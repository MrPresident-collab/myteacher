import { supabase } from "./supabase";
import type {
  AdminAuditLog,
  Group,
  LearnerLanguage,
  LearningRequest,
  Notification,
  OnboardingData,
  Profile,
  QuizQuestion,
  TeacherDocument,
  TeacherLanguageVerificationVideo,
  QuizResult,
  TeacherApplicationData,
  TeacherProfile,
  TeacherVerificationStatus,
  LessonBooking,
  LessonSession,
  Review,
} from "@/types";
import type { LanguageCode } from "@/lib/languages";

// ============================================================
// AUTHENTICATION & PROFILE APIs
// ============================================================

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error loading profile:", error.message);
    return {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || "Utilizador MyTeacher",
      role: (user.user_metadata?.role as Profile["role"]) || "student",
      country_code: "ao",
    };
  }

  return data as Profile;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error.message);
    throw new Error(error.message);
  }
  return data as Profile;
}

// ============================================================
// TEACHERS DIRECTORY & SEARCH APIs
// ============================================================

export async function getTeachers(options?: {
  languageCode?: LanguageCode;
  languages?: LanguageCode[];
  city?: string;
  level?: string;
  modality?: "online" | "presencial";
  verifiedOnly?: boolean;
}): Promise<TeacherProfile[]> {
  let query = supabase
    .from("teacher_profiles")
    .select(`
      *,
      profile:profiles(*),
      languages:teacher_languages(
        *,
        language:languages(*)
      )
    `)
    .eq("active", true);

  if (options?.city) {
    query = query.eq("city", options.city);
  }
  if (options?.verifiedOnly) {
    query = query.eq("verification_status", "verified");
  }
  if (options?.modality === "online") {
    query = query.eq("online_enabled", true);
  }
  if (options?.modality === "presencial") {
    query = query.eq("in_person_enabled", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching teachers:", error.message);
    throw new Error(error.message);
  }

  let teachers = (data || []) as TeacherProfile[];

  if (options?.languageCode) {
    teachers = teachers.filter((t) =>
      t.languages?.some((l) => l.language_code === options.languageCode),
    );
  } else if (options?.languages && options.languages.length > 0) {
    teachers = teachers.filter((t) =>
      t.languages?.some((l) => options.languages!.includes(l.language_code)),
    );
  }

  return teachers;
}

export async function getTeacher(id: string): Promise<TeacherProfile | null> {
  const { data, error } = await supabase
    .from("teacher_profiles")
    .select(`
      *,
      profile:profiles(*),
      languages:teacher_languages(
        *,
        language:languages(*)
      ),
      qualifications:teacher_qualifications(*),
      availabilities:teacher_availabilities(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching teacher:", error.message);
    throw new Error(error.message);
  }

  return data as TeacherProfile | null;
}

// ============================================================
// GROUP LEARNING (5-Student Capacity Rule)
// ============================================================

export async function getGroups(options?: {
  languageCode?: LanguageCode;
  languages?: LanguageCode[];
  level?: string;
  modality?: "online" | "presencial";
  openOnly?: boolean;
}): Promise<Group[]> {
  let query = supabase
    .from("groups")
    .select(`
      *,
      teacher:teacher_profiles(
        *,
        profile:profiles(*)
      )
    `)
    .order("created_at", { ascending: false });

  if (options?.languageCode) {
    query = query.eq("language_code", options.languageCode);
  }
  if (options?.modality) {
    query = query.eq("modality", options.modality);
  }
  if (options?.openOnly) {
    query = query.lt("current_member_count", 5).in("status", ["forming", "active"]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching groups:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as Group[];
}

export async function joinGroup(groupId: string, learnerId: string): Promise<{ success: boolean; message: string }> {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (groupError || !group) {
    return { success: false, message: "Grupo não encontrado." };
  }

  if (group.current_member_count >= 5) {
    return { success: false, message: "Esta turma já atingiu a lotação máxima de 5 alunos." };
  }

  const { data: existingMembership } = await supabase
    .from("group_memberships")
    .select("*")
    .eq("group_id", groupId)
    .eq("learner_id", learnerId)
    .maybeSingle();

  if (existingMembership) {
    return { success: false, message: "Já está inscrito nesta turma." };
  }

  const { error: joinError } = await supabase
    .from("group_memberships")
    .insert({
      group_id: groupId,
      learner_id: learnerId,
      status: "enrolled",
    });

  if (joinError) {
    console.error("Error joining group:", joinError.message);
    return { success: false, message: joinError.message || "Erro ao juntar-se ao grupo." };
  }

  return { success: true, message: "Inscrição confirmada na turma!" };
}

export async function joinGroupWaitlist(input: {
  learnerId: string;
  languageCode: LanguageCode;
  level: string;
  preferredSchedule?: string;
  modality?: "online" | "presencial";
  city?: string;
  notes?: string;
}): Promise<{ success: boolean; message: string }> {
  const { error } = await supabase.from("group_waitlists").insert({
    learner_id: input.learnerId,
    language_code: input.languageCode,
    level: input.level,
    preferred_schedule: input.preferredSchedule,
    modality: input.modality || "online",
    city: input.city,
    notes: input.notes,
  });

  if (error) {
    console.error("Error joining waitlist:", error.message);
    return { success: false, message: error.message || "Erro ao adicionar à lista de interesse." };
  }

  return { success: true, message: "Foi adicionado à lista de interesse com sucesso. Avisaremos assim que surgir uma vaga!" };
}

// ============================================================
// LEARNER ONBOARDING & PREFERENCES
// ============================================================

export async function saveLearnerOnboarding(userId: string, data: OnboardingData): Promise<{ success: boolean; error?: string }> {
  const { error: profileError } = await supabase.from("learner_profiles").upsert({
    id: userId,
    weekly_hours: data.weeklyHours || 3,
    group_preference: data.groupLearning || "interested",
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error("Error saving learner profile:", profileError.message);
    return { success: false, error: profileError.message };
  }

  for (const langCode of data.languages) {
    const { error: langError } = await supabase.from("learner_languages").upsert(
      {
        learner_id: userId,
        language_code: langCode,
        level: data.levels[langCode] || "beginner",
        goals: data.learningGoals || ["personal"],
        schedules: data.studySchedule || ["flexible"],
        is_primary: langCode === data.languages[0],
      },
      { onConflict: "learner_id,language_code" },
    );

    if (langError) {
      console.error("Error saving learner language:", langError.message);
      return { success: false, error: langError.message };
    }

    const { error: progressError } = await supabase.from("learning_progress").upsert(
      {
        learner_id: userId,
        language_code: langCode,
        current_level: data.levels[langCode] || "beginner",
        lessons_completed: 0,
        hours_studied: 0,
        streak_days: 1,
      },
      { onConflict: "learner_id,language_code" },
    );

    if (progressError) {
      console.error("Error saving learning progress:", progressError.message);
      return { success: false, error: progressError.message };
    }
  }

  return { success: true };
}

export async function getLearnerLanguages(learnerId: string): Promise<LearnerLanguage[]> {
  const { data, error } = await supabase
    .from("learner_languages")
    .select(`
      *,
      language:languages(*)
    `)
    .eq("learner_id", learnerId);

  if (error) {
    console.error("Error fetching learner languages:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as LearnerLanguage[];
}

// ============================================================
// TEACHER APPLICATION SUBMISSION
// ============================================================

export async function submitTeacherApplication(userId: string, form: TeacherApplicationData): Promise<{ success: boolean; error?: string }> {
  const { data: submittedVideos, error: videosError } = await supabase
    .from("teacher_language_verification_videos")
    .select("language_code")
    .eq("teacher_id", userId);

  if (videosError) return { success: false, error: videosError.message };
  const submittedLanguages = new Set((submittedVideos || []).map((video) => video.language_code));
  const missingLanguages = form.languages.filter((language) => !submittedLanguages.has(language));
  if (missingLanguages.length > 0) {
    return { success: false, error: "Upload one verification video for every teaching language before submitting." };
  }

  const { error: profileError } = await supabase.from("profiles").update({
    full_name: `${form.firstName} ${form.lastName}`.trim(),
    phone: form.phone,
    province: form.province,
    city: form.city,
    country_code: form.country || "ao",
  }).eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError.message);
    return { success: false, error: profileError.message };
  }

  const { error: teacherError } = await supabase.from("teacher_profiles").upsert({
    id: userId,
    bio: form.motivation || form.additionalInformation,
    teaching_experience_years: parseInt(form.teachingExperience) || 1,
    lesson_types: form.lessonTypes.includes("both") ? "both" : form.lessonTypes[0] || "both",
    online_enabled: form.modalities.includes("online"),
    in_person_enabled: form.modalities.includes("presencial"),
    online_hourly_price: form.hourlyRateOnline || 7500,
    in_person_hourly_price: form.hourlyRateInPerson || 10000,
    currency_code: "AOA",
    province: form.province,
    city: form.city,
    verification_status: "submitted",
    profile_completion_percentage: 85,
    public_profile_video_path: form.publicProfileVideoPath || null,
  });

  if (teacherError) {
    console.error("Error saving teacher profile:", teacherError.message);
    return { success: false, error: teacherError.message };
  }

  for (const lang of form.languages) {
    const { error: langError } = await supabase.from("teacher_languages").upsert(
      {
        teacher_id: userId,
        language_code: lang,
        proficiency_level: form.languageProficiencies[lang] || (form.nativeLanguages.includes(lang) ? "Nativo" : "C1 - Fluente"),
        is_native: form.nativeLanguages.includes(lang),
      },
      { onConflict: "teacher_id,language_code" },
    );

    if (langError) {
      console.error("Error saving teacher language:", langError.message);
      return { success: false, error: langError.message };
    }
  }

  if (form.education || form.fieldOfStudy) {
    const { error: qualError } = await supabase.from("teacher_qualifications").insert({
      teacher_id: userId,
      title: form.education || "Licenciatura",
      institution: "Ensino Superior",
      field_of_study: form.fieldOfStudy,
      qualification_type: "university",
      verified: false,
    });

    if (qualError) {
      console.error("Error saving qualification:", qualError.message);
      return { success: false, error: qualError.message };
    }
  }

  return { success: true };
}

// ============================================================
// LEARNING REQUESTS & CORPORATE LEADS
// ============================================================

export async function createLearningRequest(input: Partial<LearningRequest>): Promise<{ success: boolean; data?: LearningRequest; error?: string }> {
  const { data, error } = await supabase
    .from("learning_requests")
    .insert({
      learner_id: input.learner_id,
      learner_name: input.learner_name,
      learner_email: input.learner_email,
      learner_phone: input.learner_phone,
      teacher_id: input.teacher_id,
      language_code: input.language_code || "english",
      level: input.level || "beginner",
      lesson_type: input.lesson_type || "1:1",
      modality: input.modality || "online",
      province: input.province,
      city: input.city,
      schedule_preference: input.schedule_preference,
      notes: input.notes,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating learning request:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as LearningRequest };
}

export async function createLessonBooking(input: {
  teacherId: string;
  languageCode: LanguageCode;
  scheduledAt: string;
  durationMinutes: number;
  modality: "online" | "presencial";
  price: number;
}): Promise<{ success: boolean; data?: LessonBooking; error?: string }> {
  const { data, error } = await supabase.rpc("create_lesson_booking", {
    requested_teacher_id: input.teacherId,
    requested_language_code: input.languageCode,
    requested_start: input.scheduledAt,
    requested_duration_minutes: input.durationMinutes,
    requested_modality: input.modality,
    requested_price: input.price,
  });
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as LessonBooking };
}

export async function getLessonSession(bookingId: string): Promise<LessonSession | null> {
  const { data, error } = await supabase.from("lesson_sessions").select("*").eq("booking_id", bookingId).maybeSingle();
  if (error) throw new Error(error.message);
  return data as LessonSession | null;
}

export async function submitLessonReview(input: {
  bookingId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  languageCode?: LanguageCode;
}): Promise<{ success: boolean; data?: Review; error?: string }> {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) return { success: false, error: "Rating must be between 1 and 5." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === input.revieweeId) return { success: false, error: "Only another lesson participant can be reviewed." };
  const { data: booking, error: bookingError } = await supabase.from("lesson_bookings").select("teacher_id, learner_id").eq("id", input.bookingId).single();
  if (bookingError || !booking || ![booking.teacher_id, booking.learner_id].includes(user.id) || ![booking.teacher_id, booking.learner_id].includes(input.revieweeId)) {
    return { success: false, error: "Only lesson participants can submit this review." };
  }
  const { data, error } = await supabase.from("reviews").insert({
    booking_id: input.bookingId,
    reviewer_id: user.id,
    reviewee_id: input.revieweeId,
    teacher_id: booking.teacher_id,
    learner_id: booking.learner_id,
    rating: input.rating,
    comment: input.comment,
    language_code: input.languageCode,
  }).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Review };
}

export async function createCorporateLead(lead: {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  trainingType: string;
  employeeCount?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("corporate_leads").insert({
    company_name: lead.companyName,
    contact_name: lead.contactName,
    email: lead.email,
    phone: lead.phone,
    training_type: lead.trainingType,
    employee_count: lead.employeeCount,
    notes: lead.notes,
  });

  if (error) {
    console.error("Error creating corporate lead:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================
// QUIZZES & LEVEL TESTS
// ============================================================

export async function getQuizQuestions(languageCode: LanguageCode, category?: string): Promise<QuizQuestion[]> {
  let query = supabase
    .from("quiz_questions")
    .select("*")
    .eq("language_code", languageCode);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching quiz questions:", error.message);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return [
      {
        id: "fallback-q-1",
        language_code: languageCode,
        category: "placement",
        cefr_level: "A1",
        question: "Choose the correct phrase to introduce yourself:",
        options: ["My name are John.", "My name is John.", "I is John.", "Me named John."],
        correct_option_index: 1,
        explanation: "In English, we use 'My name is' or 'I am' followed by your name.",
      },
      {
        id: "fallback-q-2",
        language_code: languageCode,
        category: "grammar",
        cefr_level: "A2",
        question: "Where _____ you go on your last vacation?",
        options: ["do", "did", "have", "were"],
        correct_option_index: 1,
        explanation: "'Did' is the auxiliary verb for simple past questions with normal verbs.",
      },
      {
        id: "fallback-q-3",
        language_code: languageCode,
        category: "vocabulary",
        cefr_level: "B1",
        question: "Which word is synonymous with 'opportunity'?",
        options: ["Obstacle", "Chance", "Delay", "Danger"],
        correct_option_index: 1,
        explanation: "'Opportunity' and 'chance' both refer to favorable circumstances.",
      },
    ];
  }

  return data as QuizQuestion[];
}

export async function saveQuizResult(result: Partial<QuizResult>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("quiz_results").insert(result);

  if (error) {
    console.error("Error saving quiz result:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================
// ADMIN OPERATIONS & AUDIT TRAIL
// ============================================================

export async function getAdminStats(): Promise<{
  totalLearners: number;
  totalTeachers: number;
  pendingApplications: number;
  verifiedTeachers: number;
  activeGroups: number;
  totalBookingsMonth: number;
  monthlyVolumeKz: number;
}> {
  const [
    { count: totalLearners },
    { count: totalTeachers },
    { count: pendingApplications },
    { count: verifiedTeachers },
    { count: activeGroups },
    { count: totalBookingsMonth },
  ] = await Promise.all([
    supabase.from("learner_profiles").select("*", { count: "exact", head: true }),
    supabase.from("teacher_profiles").select("*", { count: "exact", head: true }),
    supabase.from("teacher_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "submitted"),
    supabase.from("teacher_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
    supabase.from("groups").select("*", { count: "exact", head: true }).in("status", ["forming", "active"]),
    supabase.from("lesson_bookings").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: earnings } = await supabase
    .from("earnings_records")
    .select("gross_amount")
    .gte("created_at", thirtyDaysAgo);

  const monthlyVolumeKz = earnings?.reduce((sum, e) => sum + Number(e.gross_amount), 0) || 0;

  return {
    totalLearners: totalLearners || 0,
    totalTeachers: totalTeachers || 0,
    pendingApplications: pendingApplications || 0,
    verifiedTeachers: verifiedTeachers || 0,
    activeGroups: activeGroups || 0,
    totalBookingsMonth: totalBookingsMonth || 0,
    monthlyVolumeKz,
  };
}

export async function getPendingApplications(): Promise<TeacherProfile[]> {
  const { data, error } = await supabase
    .from("teacher_profiles")
    .select(`
      *,
      profile:profiles(*),
      languages:teacher_languages(
        *,
        language:languages(*)
      ),
      qualifications:teacher_qualifications(*)
    `)
    .in("verification_status", ["submitted", "under_review", "needs_information"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending applications:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as TeacherProfile[];
}

export async function getTeacherDocuments(teacherId: string): Promise<TeacherDocument[]> {
  const { data, error } = await supabase
    .from("teacher_documents")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teacher documents:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as TeacherDocument[];
}

export async function uploadTeacherDocument(input: {
  teacherId: string;
  documentType: TeacherDocument["document_type"];
  file: File;
}): Promise<{ success: boolean; url?: string; error?: string }> {
  const sanitizedFileName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${input.teacherId}/${input.documentType}/${Date.now()}-${sanitizedFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("teacher-documents")
    .upload(storagePath, input.file, {
      cacheControl: "3600",
      upsert: true,
      contentType: input.file.type || "application/octet-stream",
    });

  if (uploadError) {
    console.error("Error uploading teacher document:", uploadError.message);
    return { success: false, error: uploadError.message };
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("teacher-documents")
    .createSignedUrl(storagePath, 3600);

  if (signedUrlError) {
    console.error("Error creating signed teacher document URL:", signedUrlError.message);
    return { success: false, error: signedUrlError.message };
  }

  const { error: dbError } = await supabase.from("teacher_documents").insert({
    teacher_id: input.teacherId,
    document_type: input.documentType,
    file_name: input.file.name,
    file_url: signedUrlData.signedUrl,
    status: "pending",
    file_size: input.file.size,
  });

  if (dbError) {
    console.error("Error persisting teacher document metadata:", dbError.message);
    return { success: false, error: dbError.message };
  }

  return { success: true, url: signedUrlData.signedUrl };
}

export async function uploadTeacherLanguageVerificationVideo(input: {
  teacherId: string;
  languageCode: LanguageCode;
  file: File;
  durationSeconds: number;
}): Promise<{ success: boolean; video?: TeacherLanguageVerificationVideo; error?: string }> {
  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
  if (!allowedTypes.includes(input.file.type)) {
    return { success: false, error: "Use um vídeo MP4, WebM ou MOV." };
  }
  if (input.file.size <= 0 || input.file.size > 50 * 1024 * 1024) {
    return { success: false, error: "O vídeo deve ter no máximo 50 MB." };
  }
  if (!Number.isFinite(input.durationSeconds) || input.durationSeconds <= 0 || input.durationSeconds > 35) {
    return { success: false, error: "O vídeo deve ter no máximo 35 segundos." };
  }

  const sanitizedFileName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${input.teacherId}/${input.languageCode}/${Date.now()}-${sanitizedFileName}`;
  const storage = supabase.storage.from("teacher-language-verification-videos");
  const { error: uploadError } = await storage.upload(storagePath, input.file, {
    cacheControl: "3600",
    upsert: true,
    contentType: input.file.type,
  });

  if (uploadError) return { success: false, error: uploadError.message };

  const { data, error } = await supabase
    .from("teacher_language_verification_videos")
    .upsert({
      teacher_id: input.teacherId,
      language_code: input.languageCode,
      storage_path: storagePath,
      file_name: input.file.name,
      file_size: input.file.size,
      duration_seconds: input.durationSeconds,
      status: "pending",
      reviewer_id: null,
      reviewed_at: null,
      rejection_reason: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "teacher_id,language_code" })
    .select()
    .single();

  if (error) {
    await storage.remove([storagePath]);
    return { success: false, error: error.message };
  }
  return { success: true, video: data as TeacherLanguageVerificationVideo };
}

export async function uploadTeacherProfileVideo(input: { teacherId: string; file: File }): Promise<{ success: boolean; path?: string; error?: string }> {
  if (!["video/mp4", "video/webm", "video/quicktime"].includes(input.file.type)) return { success: false, error: "Use an MP4, WebM, or MOV video." };
  if (input.file.size <= 0 || input.file.size > 100 * 1024 * 1024) return { success: false, error: "The profile video must be 100 MB or smaller." };
  const fileName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${input.teacherId}/${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from("teacher-profile-videos").upload(path, input.file, { upsert: true, contentType: input.file.type });
  return error ? { success: false, error: error.message } : { success: true, path };
}

export async function getTeacherLanguageVerificationVideos(teacherId: string): Promise<TeacherLanguageVerificationVideo[]> {
  const { data, error } = await supabase
    .from("teacher_language_verification_videos")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("language_code");
  if (error) throw new Error(error.message);
  return (data || []) as TeacherLanguageVerificationVideo[];
}

export async function createTeacherLanguageVideoReviewUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("teacher-language-verification-videos")
    .createSignedUrl(storagePath, 900);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function reviewTeacherLanguageVerificationVideo(input: {
  videoId: string;
  reviewerId: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (input.status === "rejected" && !input.rejectionReason?.trim()) {
    return { success: false, error: "É obrigatório indicar o motivo da rejeição." };
  }
  const { data: video, error: videoError } = await supabase
    .from("teacher_language_verification_videos")
    .update({
      status: input.status,
      reviewer_id: input.reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: input.status === "rejected" ? input.rejectionReason : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.videoId)
    .select("teacher_id, language_code")
    .single();
  if (videoError) return { success: false, error: videoError.message };

  if (input.status === "rejected") {
    await createNotification({
      userId: video.teacher_id,
      title: "Vídeo de verificação necessita de atenção",
      message: `O vídeo de verificação de ${video.language_code} foi rejeitado: ${input.rejectionReason}`,
      type: "action_required",
      actionUrl: "/dashboard/professor",
    });
  }
  return { success: true };
}

export async function createNotification(input: {
  userId: string;
  title: string;
  message: string;
  type?: Notification["type"];
  actionUrl?: string;
}): Promise<Notification | null> {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      title: input.title,
      message: input.message,
      type: input.type || "info",
      action_url: input.actionUrl,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error.message);
    return null;
  }

  return data as Notification;
}

export async function getAdminAuditLogs(): Promise<Array<AdminAuditLog & { admin?: Profile }>> {
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select(`
      *,
      admin:profiles(*)
    `)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching admin audit logs:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as Array<AdminAuditLog & { admin?: Profile }>;
}

export async function getLearningRequests(options?: {
  status?: LearningRequest["status"];
}): Promise<LearningRequest[]> {
  let query = supabase
    .from("learning_requests")
    .select(`
      *,
      teacher:teacher_profiles(
        *,
        profile:profiles(*),
        languages:teacher_languages(
          *,
          language:languages(*)
        )
      ),
      learner:profiles(*)
    `)
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching learning requests:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as LearningRequest[];
}

export async function matchLearningRequest(requestId: string, adminId: string): Promise<{ success: boolean; message: string; teacherId?: string }> {
  const { data: request, error: requestError } = await supabase
    .from("learning_requests")
    .select(`
      *,
      teacher:teacher_profiles(
        *,
        profile:profiles(*),
        languages:teacher_languages(
          *,
          language:languages(*)
        )
      ),
      learner:profiles(*)
    `)
    .eq("id", requestId)
    .maybeSingle();

  if (requestError || !request) {
    return { success: false, message: "Pedido não encontrado." };
  }

  if (request.status === "matched" && request.matched_teacher_id) {
    return { success: false, message: "Este pedido já foi emparelhado com um professor.", teacherId: request.matched_teacher_id };
  }

  const { data: candidates, error: teachersError } = await supabase
    .from("teacher_profiles")
    .select(`
      *,
      profile:profiles(*),
      languages:teacher_languages(
        *,
        language:languages(*)
      )
    `)
    .eq("active", true)
    .in("verification_status", ["verified", "approved"])
    .order("rating", { ascending: false });

  if (teachersError) {
    console.error("Error fetching teacher match candidates:", teachersError.message);
    return { success: false, message: "Não foi possível carregar professores elegíveis." };
  }

  const teacherCandidates = (candidates || []) as TeacherProfile[];

  const scoredCandidates = teacherCandidates
    .map((teacher) => {
      let score = 0;
      const reasons: string[] = [];

      const teachesLanguage = teacher.languages?.some((lang) => lang.language_code === request.language_code);
      if (teachesLanguage) {
        score += 60;
        reasons.push("ensina a língua solicitada");
      }

      if (request.modality === "online" && teacher.online_enabled) {
        score += 20;
        reasons.push("aceita aulas online");
      }
      if (request.modality === "presencial" && teacher.in_person_enabled) {
        score += 20;
        reasons.push("aceita aulas presenciais");
      }
      if (request.modality === "online" && teacher.in_person_enabled) {
        score += 5;
      }

      if (request.city && teacher.city && request.city.toLowerCase() === teacher.city.toLowerCase()) {
        score += 15;
        reasons.push("cidade compatível");
      }
      if (request.province && teacher.province && request.province.toLowerCase() === teacher.province.toLowerCase()) {
        score += 10;
        reasons.push("província compatível");
      }

      if (teacher.rating) {
        score += Math.round(teacher.rating * 4);
      }

      if (request.lesson_type === "group" && (teacher.lesson_types === "group" || teacher.lesson_types === "both")) {
        score += 10;
        reasons.push("aceita aulas de grupo");
      }
      if (request.lesson_type === "1:1" && (teacher.lesson_types === "private" || teacher.lesson_types === "both")) {
        score += 10;
        reasons.push("aceita aulas 1:1");
      }

      if (!teachesLanguage) {
        score -= 50;
      }

      return { teacher, score, reasons };
    })
    .filter((candidate) => candidate.teacher && (candidate.score > 0 || candidate.reasons.length > 0))
    .sort((a, b) => b.score - a.score);

  const selected = scoredCandidates[0]?.teacher;

  if (!selected) {
    return {
      success: false,
      message: "Nenhum professor verificado está disponível para este pedido no momento.",
    };
  }

  const { error: matchError } = await supabase
    .from("learning_requests")
    .update({
      status: "matched",
      teacher_id: selected.id,
      matched_teacher_id: selected.id,
    })
    .eq("id", requestId);

  if (matchError) {
    console.error("Error matching learning request:", matchError.message);
    return { success: false, message: matchError.message || "Erro ao emparelhar professor." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    admin_id: adminId,
    action: "learning_request_matched",
    target_entity_type: "learning_request",
    target_entity_id: requestId,
    details: {
      selected_teacher_id: selected.id,
      request_language: request.language_code,
      request_modality: request.modality,
      score: scoredCandidates[0]?.score || 0,
      reasons: scoredCandidates[0]?.reasons || [],
    },
  });

  if (auditError) {
    console.error("Error logging admin action:", auditError.message);
  }

  if (request.learner_id) {
    await createNotification({
      userId: request.learner_id,
      title: "Professor encontrado",
      message: `Foi identificado um professor adequado para ${request.language_code} em ${request.modality}.`,
      type: "success",
      actionUrl: "/dashboard/aluno",
    });
  }

  if (selected.id) {
    await createNotification({
      userId: selected.id,
      title: "Novo pedido de aluno",
      message: `Foi atribuída uma oportunidade de aula para ${request.language_code} com um aluno novo.`,
      type: "action_required",
      actionUrl: "/dashboard/professor",
    });
  }

  return {
    success: true,
    teacherId: selected.id,
    message: `Pedido emparelhado com ${selected.profile?.full_name || "o professor selecionado"}.`,
  };
}

export async function updateTeacherVerification(input: {
  teacherId: string;
  adminId: string;
  status: TeacherVerificationStatus;
  adminNotes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("teacher_profiles")
    .update({
      verification_status: input.status,
      verified_at: input.status === "verified" ? new Date().toISOString() : null,
      verified_by: input.status === "verified" ? input.adminId : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.teacherId);

  if (error) {
    console.error("Error updating teacher verification:", error.message);
    return { success: false, error: error.message };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    admin_id: input.adminId,
    action: `teacher_status_${input.status}`,
    target_entity_type: "teacher",
    target_entity_id: input.teacherId,
    details: { notes: input.adminNotes, new_status: input.status },
  });

  if (auditError) {
    console.error("Error logging admin action:", auditError.message);
  }

  const { data: teacherProfile } = await supabase
    .from("teacher_profiles")
    .select("*, profile:profiles(*)")
    .eq("id", input.teacherId)
    .maybeSingle();

  if (teacherProfile?.id) {
    await createNotification({
      userId: teacherProfile.id,
      title: "Actualização do estado da candidatura",
      message: `O status da sua candidatura foi atualizado para ${input.status}. ${input.adminNotes ? `Nota: ${input.adminNotes}` : ""}`,
      type: input.status === "verified" ? "success" : "warning",
      actionUrl: "/dashboard/professor",
    });
  }

  return { success: true };
}

export async function reviewTeacherApplication(input: {
  teacherId: string;
  adminId: string;
  status: TeacherVerificationStatus;
  notes?: string;
  documentReview?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const result = await updateTeacherVerification({
    teacherId: input.teacherId,
    adminId: input.adminId,
    status: input.status,
    adminNotes: input.notes,
  });

  if (!result.success) {
    return result;
  }

  if (input.documentReview) {
    await supabase
      .from("teacher_documents")
      .update({ status: input.status === "verified" ? "approved" : "rejected", admin_notes: input.notes })
      .eq("teacher_id", input.teacherId);
  }

  return { success: true };
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching notifications:", error.message);
    throw new Error(error.message);
  }

  return (data || []) as Notification[];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error.message);
    throw new Error(error.message);
  }
}
