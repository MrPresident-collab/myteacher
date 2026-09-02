import type { LanguageCode } from "@/lib/languages";

export type UserRole = "student" | "teacher" | "admin";

export type LanguageLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "fluent"
  | "unknown";

// CEFR Level for placement & certified proficiency
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LearningGoal =
  | "personal"
  | "school"
  | "work"
  | "other";

export type StudySchedule =
  | "morning"
  | "afternoon"
  | "evening"
  | "flexible";

export type GroupLearningPreference =
  | "interested"
  | "not-now"
  | "private";

export type TeacherVerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "needs_information"
  | "approved"
  | "verified"
  | "rejected"
  | "suspended";

export type LessonTypePreference = "private" | "group" | "both";
export type ModalityPreference = "online" | "presencial" | "both";

// ============================================================
// CORE ENTITIES
// ============================================================

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  role: UserRole;
  country_code?: string;
  province?: string | null;
  city?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type LearnerProfile = {
  id: string; // user id
  weekly_hours?: number;
  group_preference?: GroupLearningPreference;
  created_at?: string;
  updated_at?: string;
};

export type LearnerLanguage = {
  id?: string;
  learner_id: string;
  language_code: LanguageCode;
  level: LanguageLevel;
  goals: LearningGoal[];
  schedules: StudySchedule[];
  is_primary?: boolean;
  language?: {
    code: LanguageCode;
    name: string;
    nativeName: string;
  };
};

export type TeacherProfile = {
  id: string; // user id
  headline?: string | null;
  bio?: string | null;
  teaching_experience_years?: number | null;
  teaching_style?: string | null;
  lesson_types: LessonTypePreference;
  online_enabled: boolean;
  in_person_enabled: boolean;
  online_hourly_price?: number | null;
  in_person_hourly_price?: number | null;
  currency_code: string;
  province?: string | null;
  city?: string | null;
  coverage_notes?: string | null;
  verification_status: TeacherVerificationStatus;
  verified_at?: string | null;
  verified_by?: string | null;
  rating: number;
  review_count: number;
  total_lessons_completed: number;
  profile_completion_percentage: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  profile?: Profile;
  languages?: TeacherLanguage[];
  qualifications?: TeacherQualification[];
  availabilities?: TeacherAvailability[];
};

export type Teacher = TeacherProfile;

export type TeacherLanguage = {
  id?: string;
  teacher_id: string;
  language_code: LanguageCode;
  proficiency_level: string; // Native, C2, C1, Fluent, etc.
  is_native: boolean;
  teaches_levels: LanguageLevel[];
  language?: {
    code: LanguageCode;
    name: string;
    nativeName: string;
  };
};

export type TeacherQualification = {
  id?: string;
  teacher_id: string;
  title: string;
  institution: string;
  field_of_study?: string | null;
  year_completed?: number | null;
  qualification_type: "university" | "certification" | "diploma" | "other";
  verified: boolean;
};

export type TeacherDocument = {
  id?: string;
  teacher_id: string;
  document_type: "id_card" | "passport" | "cv" | "certificate" | "degree" | "other";
  file_name: string;
  file_url: string;
  file_size?: number;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string | null;
  created_at?: string;
};

export type TeacherAvailability = {
  id?: string;
  teacher_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  period: "morning" | "afternoon" | "evening";
  is_active: boolean;
};

// ============================================================
// GROUP LEARNING (Max 5 Capacity)
// ============================================================

export type Group = {
  id: string;
  name: string;
  description?: string | null;
  language_code: LanguageCode;
  level: LanguageLevel;
  teacher_id?: string | null;
  teacher?: TeacherProfile;
  schedule_description: string;
  modality: "online" | "presencial";
  location?: string | null;
  price_per_month: number;
  currency_code: string;
  max_capacity: number; // Strictly 5
  current_member_count: number;
  status: "forming" | "active" | "full" | "completed" | "cancelled";
  starts_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type GroupMembership = {
  id: string;
  group_id: string;
  learner_id: string;
  status: "enrolled" | "waitlisted" | "completed" | "cancelled";
  joined_at: string;
  learner?: Profile;
  group?: Group;
};

export type GroupWaitlist = {
  id: string;
  learner_id: string;
  language_code: LanguageCode;
  level: LanguageLevel;
  preferred_schedule?: string;
  modality?: "online" | "presencial";
  city?: string;
  notes?: string;
  notified: boolean;
  created_at: string;
  learner?: Profile;
};

// ============================================================
// BOOKINGS & LEARNING REQUESTS
// ============================================================

export type LearningRequest = {
  id: string;
  learner_id?: string | null;
  learner_name?: string;
  learner_email?: string;
  learner_phone?: string;
  teacher_id?: string | null;
  language_code: LanguageCode;
  level: LanguageLevel;
  lesson_type: "1:1" | "group";
  modality: "online" | "presencial";
  province?: string;
  city?: string;
  schedule_preference?: string;
  notes?: string;
  status: "pending" | "matched" | "accepted" | "declined" | "closed";
  created_at: string;
  matched_teacher_id?: string | null;
  teacher?: TeacherProfile;
  learner?: Profile;
};

export type LessonBooking = {
  id: string;
  teacher_id: string;
  learner_id: string;
  group_id?: string | null;
  language_code: LanguageCode;
  scheduled_at: string;
  duration_minutes: number;
  modality: "online" | "presencial";
  meeting_link?: string | null;
  location?: string | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled";
  price: number;
  currency_code: string;
  created_at: string;
  teacher?: TeacherProfile;
  learner?: Profile;
  group?: Group;
};

export type Review = {
  id: string;
  teacher_id: string;
  learner_id: string;
  rating: number; // 1 to 5
  comment?: string | null;
  language_code?: LanguageCode;
  created_at: string;
  learner?: Profile;
};

export type EarningsRecord = {
  id: string;
  teacher_id: string;
  booking_id?: string | null;
  gross_amount: number;
  platform_fee: number;
  net_earnings: number;
  currency_code: string;
  status: "pending" | "available" | "paid_out";
  payout_date?: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "action_required";
  action_url?: string;
  read: boolean;
  created_at: string;
};

export type AdminAuditLog = {
  id: string;
  admin_id: string;
  action: string;
  target_entity_type:
    | "teacher"
    | "learner"
    | "group"
    | "learning_request"
    | "teacher_document"
    | "application"
    | "notification"
    | "settings"
    | string;
  target_entity_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  admin?: Profile;
};

export type CorporateLead = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  training_type: string;
  employee_count?: string;
  notes?: string;
  status: "new" | "contacted" | "proposal_sent" | "closed_won" | "closed_lost";
  created_at: string;
};

// ============================================================
// QUIZZES & LEVEL TESTS
// ============================================================

export type QuizQuestion = {
  id: string;
  language_code: LanguageCode;
  category: "grammar" | "vocabulary" | "daily" | "placement";
  cefr_level: CEFRLevel;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
};

export type QuizResult = {
  id: string;
  learner_id?: string | null;
  language_code: LanguageCode;
  quiz_type: "placement" | "vocabulary" | "grammar" | "daily";
  score: number;
  total_questions: number;
  assigned_level?: LanguageLevel;
  cefr_level?: CEFRLevel;
  created_at: string;
};

export type LearningProgress = {
  id: string;
  learner_id: string;
  language_code: LanguageCode;
  lessons_completed: number;
  hours_studied: number;
  current_level: LanguageLevel;
  streak_days: number;
  last_activity_date?: string;
  updated_at: string;
};

// ============================================================
// ONBOARDING & APPLICATION FORMS
// ============================================================

export type OnboardingData = {
  role: "student";
  languages: LanguageCode[];
  levels: Partial<Record<LanguageCode, LanguageLevel>>;
  learningGoals: LearningGoal[];
  studySchedule: StudySchedule[];
  weeklyHours?: number;
  groupLearning?: GroupLearningPreference;
};

export type TeacherApplicationData = {
  role: "teacher";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  country: string;
  province: string;
  city: string;
  languages: LanguageCode[];
  nativeLanguages: LanguageCode[];
  languageProficiencies: Partial<Record<LanguageCode, string>>;
  teachingExperience: string;
  education: string;
  fieldOfStudy: string;
  certificates: string;
  professionalExperience: string;
  specializations: string[];
  lessonTypes: LessonTypePreference[];
  modalities: ("online" | "presencial")[];
  hourlyRateOnline?: number;
  hourlyRateInPerson?: number;
  availability: string[];
  weeklyHours?: number;
  motivation: string;
  additionalInformation?: string;
  documentationAvailable: boolean;
  cvFileName?: string;
  certificateFileName?: string;
  idDocumentFileName?: string;
  verificationStatus: TeacherVerificationStatus;
};