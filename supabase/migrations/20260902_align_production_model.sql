-- Additive, idempotent, non-destructive migration for the current MyTeacher model.
-- This migration does not reset data or drop objects; it only adds missing safeguards
-- and ensures doc access remains private and role-scoped.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.teacher_profiles') IS NOT NULL THEN
    UPDATE public.teacher_profiles
    SET rating = 0
    WHERE rating IS NULL OR rating < 0 OR rating > 5;

    UPDATE public.teacher_profiles
    SET review_count = 0
    WHERE review_count IS NULL;

    UPDATE public.teacher_profiles
    SET profile_completion_percentage = COALESCE(profile_completion_percentage, 0)
    WHERE profile_completion_percentage IS NULL;
  END IF;
END $$;

ALTER TABLE public.teacher_profiles
  ALTER COLUMN lesson_types SET DEFAULT 'both';

ALTER TABLE public.teacher_profiles
  ALTER COLUMN verification_status SET DEFAULT 'draft';

ALTER TABLE public.teacher_profiles
  ALTER COLUMN rating SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_teacher_profiles_verification_status
  ON public.teacher_profiles (verification_status, active);

CREATE INDEX IF NOT EXISTS idx_teacher_profiles_city
  ON public.teacher_profiles (city, province);

CREATE INDEX IF NOT EXISTS idx_learning_requests_status_created_at
  ON public.learning_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_group_memberships_group_status
  ON public.group_memberships (group_id, status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications (user_id, read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_teacher_documents_teacher_status
  ON public.teacher_documents (teacher_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor_created_at
  ON public.admin_audit_logs (admin_id, created_at DESC);

ALTER TABLE public.teacher_documents
  ALTER COLUMN status SET DEFAULT 'pending';

DO $$
BEGIN
  CREATE TYPE staff_role AS ENUM ('president', 'admin', 'support_staff', 'finance', 'operations', 'content_manager', 'user_access_manager', 'data_analyst');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS staff_role staff_role;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS public_profile_video_path TEXT;

CREATE TABLE IF NOT EXISTS public.teacher_language_verification_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE RESTRICT,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL CHECK (file_size > 0 AND file_size <= 52428800),
  duration_seconds NUMERIC(5, 2) NOT NULL CHECK (duration_seconds > 0 AND duration_seconds <= 35),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(teacher_id, language_code)
);

ALTER TABLE public.teacher_language_verification_videos ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_teacher_language_videos_teacher_status
  ON public.teacher_language_verification_videos (teacher_id, status, created_at DESC);

CREATE OR REPLACE FUNCTION public.prevent_protected_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.staff_role IS DISTINCT FROM OLD.staff_role)
    AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND staff_role = 'president') THEN
    RAISE EXCEPTION 'Only the President can change privileged roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'protect_profile_roles') THEN
    CREATE TRIGGER protect_profile_roles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_protected_profile_changes();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.prevent_teacher_video_self_review()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status IS DISTINCT FROM OLD.status OR NEW.reviewer_id IS DISTINCT FROM OLD.reviewer_id OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at)
    AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (staff_role IN ('president', 'admin') OR role = 'admin')) THEN
    RAISE EXCEPTION 'Only authorized staff can review verification videos.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'protect_teacher_video_review') THEN
    CREATE TRIGGER protect_teacher_video_review BEFORE UPDATE ON public.teacher_language_verification_videos FOR EACH ROW EXECUTE FUNCTION public.prevent_teacher_video_self_review();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.require_approved_language_videos()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status IN ('approved', 'verified') AND EXISTS (
    SELECT 1 FROM public.teacher_languages language
    WHERE language.teacher_id = NEW.id
      AND NOT EXISTS (SELECT 1 FROM public.teacher_language_verification_videos video WHERE video.teacher_id = NEW.id AND video.language_code = language.language_code AND video.status = 'approved')
  ) THEN
    RAISE EXCEPTION 'Every teaching language requires an approved verification video.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'require_approved_language_videos') THEN
    CREATE TRIGGER require_approved_language_videos BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION public.require_approved_language_videos();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are append-only.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'protect_audit_log_mutation') THEN
    CREATE TRIGGER protect_audit_log_mutation BEFORE UPDATE OR DELETE ON public.admin_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_mutation();
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.teacher_profiles') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conrelid = 'public.teacher_profiles'::regclass
        AND conname = 'teacher_profiles_lesson_types_check'
    ) THEN
      ALTER TABLE public.teacher_profiles
        ADD CONSTRAINT teacher_profiles_lesson_types_check
        CHECK (lesson_types IN ('private', 'group', 'both'));
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conrelid = 'public.teacher_profiles'::regclass
        AND conname = 'teacher_profiles_rating_check'
    ) THEN
      ALTER TABLE public.teacher_profiles
        ADD CONSTRAINT teacher_profiles_rating_check
        CHECK (rating >= 0 AND rating <= 5);
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_language_verification_videos' AND policyname = 'Teachers manage own language verification videos') THEN
    CREATE POLICY "Teachers manage own language verification videos"
      ON public.teacher_language_verification_videos FOR ALL
      USING (auth.uid() = teacher_id)
      WITH CHECK (auth.uid() = teacher_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_language_verification_videos' AND policyname = 'Privileged staff review language verification videos') THEN
    CREATE POLICY "Privileged staff review language verification videos"
      ON public.teacher_language_verification_videos FOR ALL
      USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (staff_role IN ('president', 'admin') OR role = 'admin')))
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (staff_role IN ('president', 'admin') OR role = 'admin')));
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('teacher-documents', 'teacher-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('teacher-language-verification-videos', 'teacher-language-verification-videos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('teacher-profile-videos', 'teacher-profile-videos', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF to_regclass('storage.objects') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = 'teachers_manage_own_verification_documents'
    ) THEN
      CREATE POLICY "teachers_manage_own_verification_documents"
      ON storage.objects
      FOR ALL
      USING (
        bucket_id = 'teacher-documents'
        AND split_part(name, '/', 1) = auth.uid()::text
      )
      WITH CHECK (
        bucket_id = 'teacher-documents'
        AND split_part(name, '/', 1) = auth.uid()::text
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = 'admins_manage_all_verification_documents'
    ) THEN
      CREATE POLICY "admins_manage_all_verification_documents"
      ON storage.objects
      FOR ALL
      USING (
        bucket_id = 'teacher-documents'
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
      )
      WITH CHECK (
        bucket_id = 'teacher-documents'
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
      );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Teachers manage own language verification video storage') THEN
      CREATE POLICY "Teachers manage own language verification video storage" ON storage.objects FOR ALL
        USING (bucket_id = 'teacher-language-verification-videos' AND split_part(name, '/', 1) = auth.uid()::text)
        WITH CHECK (bucket_id = 'teacher-language-verification-videos' AND split_part(name, '/', 1) = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Privileged staff review language verification video storage') THEN
      CREATE POLICY "Privileged staff review language verification video storage" ON storage.objects FOR ALL
        USING (bucket_id = 'teacher-language-verification-videos' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (staff_role IN ('president', 'admin') OR role = 'admin')))
        WITH CHECK (bucket_id = 'teacher-language-verification-videos' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (staff_role IN ('president', 'admin') OR role = 'admin')));
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lesson_session_status') THEN
    CREATE TYPE lesson_session_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled', 'expired');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.lesson_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), booking_id UUID NOT NULL UNIQUE REFERENCES public.lesson_bookings(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, room_name TEXT NOT NULL UNIQUE, status lesson_session_status NOT NULL DEFAULT 'scheduled',
  scheduled_start TIMESTAMPTZ NOT NULL, lesson_duration_seconds INT NOT NULL DEFAULT 3600 CHECK (lesson_duration_seconds BETWEEN 1 AND 3600),
  wrap_up_duration_seconds INT NOT NULL DEFAULT 900 CHECK (wrap_up_duration_seconds BETWEEN 0 AND 900), started_at TIMESTAMPTZ, ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()), updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.lesson_sessions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_lesson_sessions_start ON public.lesson_sessions (scheduled_start, status);

ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.lesson_bookings(id) ON DELETE CASCADE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.reviews'::regclass AND conname = 'reviews_no_self_rating') THEN
    ALTER TABLE public.reviews ADD CONSTRAINT reviews_no_self_rating CHECK (reviewer_id IS NULL OR reviewee_id IS NULL OR reviewer_id <> reviewee_id);
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_booking_reviewer ON public.reviews (booking_id, reviewer_id) WHERE booking_id IS NOT NULL AND reviewer_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), booking_id UUID REFERENCES public.lesson_bookings(id) ON DELETE SET NULL,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT, provider TEXT NOT NULL, provider_payment_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE, amount NUMERIC(12,2) NOT NULL CHECK (amount > 0), currency_code TEXT NOT NULL DEFAULT 'AOA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','failed','expired','refunded')), provider_reference TEXT,
  confirmed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()), updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), transaction_id UUID NOT NULL REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
  provider_event_id TEXT NOT NULL UNIQUE, event_type TEXT NOT NULL, payload JSONB NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), booking_id UUID NOT NULL REFERENCES public.lesson_bookings(id) ON DELETE RESTRICT,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT, teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE RESTRICT,
  payment_transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL, amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (platform_fee >= 0), teacher_net_amount NUMERIC(12,2) NOT NULL CHECK (teacher_net_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','failed','refunded')), created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE RESTRICT,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0), currency_code TEXT NOT NULL DEFAULT 'AOA', status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','failed')),
  provider_reference TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()), paid_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_by UUID REFERENCES public.profiles(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
INSERT INTO public.platform_settings (key, value) VALUES ('platform_fee_percent', '17.5'::jsonb) ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.create_lesson_booking(
  requested_teacher_id UUID, requested_language_code TEXT, requested_start TIMESTAMPTZ,
  requested_duration_minutes INT, requested_modality TEXT, requested_price NUMERIC
)
RETURNS public.lesson_bookings AS $$
DECLARE booking public.lesson_bookings;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication is required.'; END IF;
  IF requested_duration_minutes <= 0 OR requested_duration_minutes > 60 THEN RAISE EXCEPTION 'Lesson duration must be between 1 and 60 minutes.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.teacher_profiles WHERE id=requested_teacher_id AND active=true AND verification_status IN ('approved','verified') AND ((requested_modality='online' AND online_enabled) OR (requested_modality='presencial' AND in_person_enabled))) THEN RAISE EXCEPTION 'Teacher is not eligible for this booking.'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(requested_teacher_id::text, 0));
  IF EXISTS (SELECT 1 FROM public.lesson_bookings b WHERE b.teacher_id=requested_teacher_id AND b.status IN ('scheduled','in_progress') AND tstzrange(b.scheduled_at, b.scheduled_at + make_interval(mins => b.duration_minutes), '[)') && tstzrange(requested_start, requested_start + make_interval(mins => requested_duration_minutes), '[)')) THEN RAISE EXCEPTION 'Teacher is already booked for this time.'; END IF;
  INSERT INTO public.lesson_bookings (teacher_id, learner_id, language_code, scheduled_at, duration_minutes, modality, status, price)
  VALUES (requested_teacher_id, auth.uid(), requested_language_code, requested_start, requested_duration_minutes, requested_modality, 'scheduled', requested_price) RETURNING * INTO booking;
  RETURN booking;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lesson_sessions' AND policyname='Participants can view own lesson sessions') THEN
    CREATE POLICY "Participants can view own lesson sessions" ON public.lesson_sessions FOR SELECT USING (EXISTS (SELECT 1 FROM public.lesson_bookings b WHERE b.id=booking_id AND (b.teacher_id=auth.uid() OR b.learner_id=auth.uid())));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reviews' AND policyname='Completed participants can create reviews') THEN
    CREATE POLICY "Completed participants can create reviews" ON public.reviews FOR INSERT WITH CHECK (reviewer_id=auth.uid() AND EXISTS (SELECT 1 FROM public.lesson_bookings b WHERE b.id=booking_id AND b.status='completed' AND ((b.teacher_id=auth.uid() AND reviewee_id=b.learner_id) OR (b.learner_id=auth.uid() AND reviewee_id=b.teacher_id))));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payment_transactions' AND policyname='Users can view own payments') THEN
    CREATE POLICY "Users can view own payments" ON public.payment_transactions FOR SELECT USING (learner_id=auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=auth.uid() AND p.staff_role IN ('president','admin','finance')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tips' AND policyname='Participants can view own tips') THEN
    CREATE POLICY "Participants can view own tips" ON public.tips FOR SELECT USING (learner_id=auth.uid() OR teacher_id=auth.uid());
  END IF;
END $$;

COMMIT;
