-- ============================================================
-- MYTEACHER DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Production-ready, relational, RLS enabled, Angola initial + Lusophone ready
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE language_level AS ENUM ('beginner', 'intermediate', 'advanced', 'fluent', 'unknown');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE teacher_verification_status AS ENUM (
    'draft', 'submitted', 'under_review', 'needs_information', 'approved', 'verified', 'rejected', 'suspended'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE group_status AS ENUM ('forming', 'active', 'full', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('pending', 'matched', 'accepted', 'declined', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------
-- 2. CORE REGIONAL & LANGUAGE TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  flag_country_code TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.regional_markets (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'AOA',
  currency_symbol TEXT NOT NULL DEFAULT 'Kz',
  phone_prefix TEXT NOT NULL DEFAULT '+244',
  provinces JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------
-- 3. USER PROFILES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'student',
  country_code TEXT NOT NULL DEFAULT 'ao' REFERENCES public.regional_markets(code) ON DELETE RESTRICT,
  province TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------
-- 4. LEARNER PROFILES & LANGUAGES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.learner_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  weekly_hours INT DEFAULT 3,
  group_preference TEXT DEFAULT 'interested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.learner_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  level language_level NOT NULL DEFAULT 'beginner',
  goals TEXT[] NOT NULL DEFAULT '{}',
  schedules TEXT[] NOT NULL DEFAULT '{}',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(learner_id, language_code)
);

-- ------------------------------------------------------------
-- 5. TEACHER PROFILES, LANGUAGES, QUALIFICATIONS, DOCUMENTS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.teacher_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  teaching_experience_years INT DEFAULT 1,
  teaching_style TEXT,
  lesson_types TEXT NOT NULL DEFAULT 'both', -- 'private', 'group', 'both'
  online_enabled BOOLEAN NOT NULL DEFAULT true,
  in_person_enabled BOOLEAN NOT NULL DEFAULT false,
  online_hourly_price NUMERIC(12, 2) DEFAULT 7500.00,
  in_person_hourly_price NUMERIC(12, 2) DEFAULT 10000.00,
  currency_code TEXT NOT NULL DEFAULT 'AOA',
  province TEXT DEFAULT 'Luanda',
  city TEXT DEFAULT 'Luanda',
  coverage_notes TEXT,
  verification_status teacher_verification_status NOT NULL DEFAULT 'draft',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  review_count INT NOT NULL DEFAULT 0,
  total_lessons_completed INT NOT NULL DEFAULT 0,
  profile_completion_percentage INT NOT NULL DEFAULT 60,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.teacher_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  proficiency_level TEXT NOT NULL DEFAULT 'Fluent',
  is_native BOOLEAN NOT NULL DEFAULT false,
  teaches_levels language_level[] NOT NULL DEFAULT '{beginner,intermediate,advanced,fluent}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(teacher_id, language_code)
);

CREATE TABLE IF NOT EXISTS public.teacher_qualifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  field_of_study TEXT,
  year_completed INT,
  qualification_type TEXT NOT NULL DEFAULT 'university',
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.teacher_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'id_card', 'passport', 'cv', 'certificate', 'degree', 'other'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.teacher_availabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon', 'evening')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(teacher_id, day_of_week, period)
);

-- ------------------------------------------------------------
-- 6. GROUP LEARNING (5 STUDENT MAX CAPACITY RULE)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE RESTRICT,
  level language_level NOT NULL DEFAULT 'beginner',
  teacher_id UUID REFERENCES public.teacher_profiles(id) ON DELETE SET NULL,
  schedule_description TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT 'online' CHECK (modality IN ('online', 'presencial')),
  location TEXT,
  price_per_month NUMERIC(12, 2) NOT NULL DEFAULT 25000.00,
  currency_code TEXT NOT NULL DEFAULT 'AOA',
  max_capacity INT NOT NULL DEFAULT 5 CHECK (max_capacity <= 5), -- Strictly max 5 learners
  current_member_count INT NOT NULL DEFAULT 0,
  status group_status NOT NULL DEFAULT 'forming',
  starts_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.group_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'waitlisted', 'completed', 'cancelled')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(group_id, learner_id)
);

CREATE TABLE IF NOT EXISTS public.group_waitlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  level language_level NOT NULL DEFAULT 'beginner',
  preferred_schedule TEXT,
  modality TEXT DEFAULT 'online',
  city TEXT,
  notes TEXT,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------
-- 7. LEARNING REQUESTS & BOOKINGS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.learning_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  learner_name TEXT,
  learner_email TEXT,
  learner_phone TEXT,
  teacher_id UUID REFERENCES public.teacher_profiles(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL REFERENCES public.languages(code),
  level language_level NOT NULL DEFAULT 'beginner',
  lesson_type TEXT NOT NULL DEFAULT '1:1',
  modality TEXT NOT NULL DEFAULT 'online',
  province TEXT,
  city TEXT,
  schedule_preference TEXT,
  notes TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  matched_teacher_id UUID REFERENCES public.teacher_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.lesson_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL REFERENCES public.languages(code),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  modality TEXT NOT NULL DEFAULT 'online',
  meeting_link TEXT,
  location TEXT,
  status booking_status NOT NULL DEFAULT 'scheduled',
  price NUMERIC(12, 2) NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'AOA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  language_code TEXT REFERENCES public.languages(code),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.earnings_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.lesson_bookings(id) ON DELETE SET NULL,
  gross_amount NUMERIC(12, 2) NOT NULL,
  platform_fee NUMERIC(12, 2) NOT NULL,
  net_earnings NUMERIC(12, 2) NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'AOA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'paid_out')),
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'action_required')),
  action_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_entity_type TEXT NOT NULL,
  target_entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.corporate_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  training_type TEXT NOT NULL,
  employee_count TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------
-- 8. QUIZZES & LEVEL TESTS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('grammar', 'vocabulary', 'daily', 'placement')),
  cefr_level TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  assigned_level language_level,
  cefr_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  lessons_completed INT NOT NULL DEFAULT 0,
  hours_studied INT NOT NULL DEFAULT 0,
  current_level language_level NOT NULL DEFAULT 'beginner',
  streak_days INT NOT NULL DEFAULT 1,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(learner_id, language_code)
);

-- ------------------------------------------------------------
-- 9. TRIGGERS & CONSTRAINTS
-- ------------------------------------------------------------

-- Trigger to sync auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, country_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilizador MyTeacher'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    'ao'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.learner_profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  ELSIF NEW.raw_user_meta_data->>'role' = 'teacher' THEN
    INSERT INTO public.teacher_profiles (id, verification_status)
    VALUES (NEW.id, 'submitted')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to enforce max 5 students in group_memberships
CREATE OR REPLACE FUNCTION public.check_group_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_count INT;
  max_allowed INT;
BEGIN
  SELECT count(*), g.max_capacity INTO current_count, max_allowed
  FROM public.group_memberships gm
  JOIN public.groups g ON g.id = NEW.group_id
  WHERE gm.group_id = NEW.group_id AND gm.status = 'enrolled'
  GROUP BY g.max_capacity;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'A turma atingiu a capacidade máxima de % alunos.', max_allowed;
  END IF;

  -- Update current count
  UPDATE public.groups
  SET current_member_count = current_count + 1,
      status = CASE WHEN current_count + 1 >= max_allowed THEN 'full'::group_status ELSE 'active'::group_status END,
      updated_at = timezone('utc'::text, now())
  WHERE id = NEW.group_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_group_member_added ON public.group_memberships;
CREATE TRIGGER on_group_member_added
  AFTER INSERT ON public.group_memberships
  FOR EACH ROW
  WHEN (NEW.status = 'enrolled')
  EXECUTE FUNCTION public.check_group_capacity();

-- ------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read active languages" ON public.languages FOR SELECT USING (active = true);
CREATE POLICY "Public read regional markets" ON public.regional_markets FOR SELECT USING (true);
CREATE POLICY "Public read teacher profiles" ON public.teacher_profiles FOR SELECT USING (active = true);
CREATE POLICY "Public read teacher languages" ON public.teacher_languages FOR SELECT USING (true);
CREATE POLICY "Public read teacher qualifications" ON public.teacher_qualifications FOR SELECT USING (verified = true);
CREATE POLICY "Public read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public insert corporate leads" ON public.corporate_leads FOR INSERT WITH CHECK (true);

-- User access policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Learners can manage own profile" ON public.learner_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Learners can manage own languages" ON public.learner_languages FOR ALL USING (auth.uid() = learner_id);
CREATE POLICY "Learners can manage own progress" ON public.learning_progress FOR ALL USING (auth.uid() = learner_id);
CREATE POLICY "Learners can view and join groups" ON public.group_memberships FOR ALL USING (auth.uid() = learner_id);
CREATE POLICY "Learners can join waitlist" ON public.group_waitlists FOR ALL USING (auth.uid() = learner_id);
CREATE POLICY "Learners can save quiz results" ON public.quiz_results FOR ALL USING (auth.uid() = learner_id OR learner_id IS NULL);

CREATE POLICY "Teachers can manage own profile" ON public.teacher_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Teachers can manage own languages" ON public.teacher_languages FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage own qualifications" ON public.teacher_qualifications FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage own documents" ON public.teacher_documents FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage own availability" ON public.teacher_availabilities FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can view own earnings" ON public.earnings_records FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own bookings" ON public.lesson_bookings FOR SELECT USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- Admin full access
CREATE POLICY "Admins have full access on profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access on teacher_profiles" ON public.teacher_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access on teacher_documents" ON public.teacher_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access on groups" ON public.groups FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access on admin_audit_logs" ON public.admin_audit_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access on corporate_leads" ON public.corporate_leads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ------------------------------------------------------------
-- 11. INITIAL SEED DATA
-- ------------------------------------------------------------

-- Regional markets
INSERT INTO public.regional_markets (code, name, currency_code, currency_symbol, phone_prefix, provinces, active)
VALUES 
  ('ao', 'Angola', 'AOA', 'Kz', '+244', '["Luanda", "Benguela", "Huambo", "Huíla", "Cabinda", "Cuanza Sul", "Cuanza Norte", "Malanje", "Uíge", "Zaire", "Namibe", "Cunene", "Bié", "Moxico", "Cuando Cubango", "Lunda Norte", "Lunda Sul", "Bengo"]'::jsonb, true),
  ('mz', 'Moçambique', 'MZN', 'MT', '+258', '["Maputo", "Sofala", "Nampula", "Zambézia", "Inhambane", "Gaza", "Tete", "Manica", "Cabo Delgado", "Niassa"]'::jsonb, false),
  ('pt', 'Portugal', 'EUR', '€', '+351', '["Lisboa", "Porto", "Braga", "Setúbal", "Aveiro", "Faro", "Coimbra"]'::jsonb, false),
  ('br', 'Brasil', 'BRL', 'R$', '+55', '["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"]'::jsonb, false),
  ('cv', 'Cabo Verde', 'CVE', 'Esc', '+238', '["Santiago (Praia)", "São Vicente (Mindelo)", "Sal", "Boa Vista"]'::jsonb, false)
ON CONFLICT (code) DO NOTHING;

-- Languages
INSERT INTO public.languages (code, name, native_name, flag_country_code, description, display_order)
VALUES 
  ('english', 'Inglês', 'English', 'gb', 'Inglês britânico e internacional para trabalho, exames e conversação.', 1),
  ('french', 'Francês', 'Français', 'fr', 'Francês para estudo, viagens e relações empresariais.', 2),
  ('portuguese', 'Português', 'Português', 'pt', 'Português para aperfeiçoamento, comunicação formal e acadêmica.', 3),
  ('spanish', 'Espanhol', 'Español', 'es', 'Espanhol para negócios globais, turismo e fluência conversacional.', 4),
  ('italian', 'Italiano', 'Italiano', 'it', 'Italiano para cultura, intercâmbio e proficiência profissional.', 5),
  ('mandarin', 'Mandarim', '中文', 'zh', 'Mandarim para comércio internacional, parcerias e diplomacia.', 6)
ON CONFLICT (code) DO NOTHING;

-- Quiz questions for level assessment & daily challenges
INSERT INTO public.quiz_questions (language_code, category, cefr_level, question, options, correct_option_index, explanation)
VALUES
  ('english', 'grammar', 'A1', 'Choose the correct sentence:', '["She have two brothers.", "She has two brothers.", "She having two brothers.", "She is have two brothers."]'::jsonb, 1, 'In third-person singular (she/he/it), we use "has" in the present simple.'),
  ('english', 'vocabulary', 'A2', 'What is the opposite of "expensive"?', '["Cheap", "Rich", "Difficult", "Heavy"]'::jsonb, 0, '"Cheap" means low in price, which is the exact antonym of "expensive".'),
  ('english', 'placement', 'B1', 'If I _____ more time, I would learn another language.', '["have", "had", "will have", "would have"]'::jsonb, 1, 'Second conditional structure: If + past simple (had), would + bare infinitive.'),
  ('french', 'grammar', 'A1', 'Complétez: "Nous _____ à Luanda."', '["habite", "habites", "habitons", "habitent"]'::jsonb, 2, 'With the subject pronoun "nous", regular -er verbs take the "-ons" ending (habitons).'),
  ('french', 'placement', 'B1', 'Choisissez la bonne forme: "Il faut que tu _____ tes devoirs."', '["fais", "fasses", "fait", "faire"]'::jsonb, 1, '"Il faut que" requires the subjunctive mood (que tu fasses).'),
  ('spanish', 'grammar', 'A1', '¿Cómo se dice "Good morning" en español?', '["Buenas tardes", "Buenas noches", "Buenos días", "Hola"]'::jsonb, 2, '"Buenos días" is the standard Spanish greeting for morning.'),
  ('portuguese', 'grammar', 'B2', 'Identifique a regência verbal correta:', '["Assistimos o filme ontem.", "Assistimos ao filme ontem.", "Assistimos no filme ontem.", "Assistimos pelo filme ontem."]'::jsonb, 1, 'No sentido de ver/presenciar, o verbo assistir é transitivo indireto e exige a preposição "a" (ao filme).'),
  ('mandarin', 'vocabulary', 'A1', 'What does "你好" (Nǐ hǎo) mean?', '["Thank you", "Goodbye", "Hello", "Sorry"]'::jsonb, 2, '"你好" is the standard greeting meaning "Hello".')
ON CONFLICT DO NOTHING;
