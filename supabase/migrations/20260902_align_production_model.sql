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

INSERT INTO storage.buckets (id, name, public)
VALUES ('teacher-documents', 'teacher-documents', false)
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
  END IF;
END $$;

COMMIT;
