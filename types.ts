

export enum ClientGroup {
  METABOLIC = '대사증후군', // MS
  NORMAL = '정상군', // NORMAL
  CAUTION = '건강주의군', // CAUTION
  MEDICATION = '약물치료군', // MEDICATION
}

export interface Client {
  id: string; // client_id
  name: string;
  sex: string; // M/F
  birthDate: string; // birth_date
  contact: string;
  address: string;
  group: ClientGroup; // mapped from risk_group
  surveyFormType: string;
  
  // UI helper props
  age: number; 
  gender: '남' | '여';
  registrationDate: string; // derived
  lastVisit: string; // derived from exam
  cycle: number; // derived from exam
  stats: {
    bloodSugar: string;
    bloodPressure: string;
    bmi: string;
  };
  notes: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  citations?: Citation[];
  isStreaming?: boolean;
  attachment?: string;
}

export interface ChatSession {
  id: string;
  clientId: string;
  title: string;
  lastMessageAt: number;
  messages: ChatMessage[];
}

export interface Citation {
  id: number;
  sourceId: string;
  snippet: string;
}

export interface DocumentSource {
  id: string;
  title: string;
  type: 'pdf' | 'doc';
  contentSnippet: string;
}

export interface SearchResult {
  id: number;
  original_name: string;
  signed_url: string;
  chunk_text: string;
  search_rank: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT'
}

// --- DB Schema Types ---

export interface CheckupRecord {
  exam_id: number;
  client_id: string;
  visit_cycle: string;
  visit_seq: number;
  exam_at: string;
  prev_exam_at?: string;
  baseline_exam_at?: string;
  facility: string;
  doc_registered_on?: string;
  
  height_cm: number;
  weight_kg: number;
  bmi: number;
  waist_cm: number;
  systolic_mmHg: number;
  diastolic_mmHg: number;
  fbg_mg_dl: number;
  tg_mg_dl: number;
  hdl_mg_dl: number;
  tc_mg_dl: number;
  ldl_mg_dl: number;
  
  recent_checkup?: boolean;
  recent_checkup_date?: string;

  // UI Helper
  description: string;
}

export interface SurveyRecord {
  survey: {
    survey_id: string;
    client_id: string;
    visit_cycle: string;
    visit_seq: number;
    survey_form_type: string;
    survey_at: string;
  };
  diseases: {
    disease_code: string;
    disease_name: string;
    diagnosed: boolean;
    prescribed: boolean;
    taking_medication: boolean;
    regular_medication: boolean | null;
    duration_years: number;
  }[];
  medication: {
    regular_visit: boolean;
    visit_facility_health_center: boolean;
    visit_facility_clinic: boolean;
    visit_facility_hospital: boolean;
    visit_facility_other: string | null;
    compliant: boolean | null;
    non_compliance_reason: string | null;
    non_compliance_reason_text: string | null;
  } | null;
  bp_bg_monitoring: {
    bp_awareness: string;
    bp_frequency: string | null;
    bp_times_per_week: number | null;
    bp_times_per_month: number | null;
    bp_times_per_6months: number | null;
    bg_awareness: string;
    bg_frequency: string | null;
    bg_times_per_week: number | null;
    bg_times_per_month: number | null;
    bg_times_per_6months: number | null;
  };
  education: {
    received_education: boolean;
  };
  smoking: {
    lifetime_smoking: string;
    current_status: string;
    cigarette_type: string | null;
    cigarette_type_other: string | null;
    frequency_type: string | null;
    daily_amount: number | null;
    occasional_amount: number | null;
    occasional_days_per_month: number | null;
    smoking_duration_years: number | null;
    quit_plan: string | null;
  };
  alcohol: {
    current_drinker: boolean;
    frequency: string | null;
    amount_per_occasion: string | null;
    amount_per_occasion_num: number | null;
  };
  physical_activity: {
    sedentary_hours: number;
    sedentary_minutes: number;
    work_vigorous_days: number;
    work_vigorous_hours: number;
    work_vigorous_minutes: number;
    work_moderate_days: number;
    work_moderate_hours: number;
    work_moderate_minutes: number;
    transport_days: number;
    transport_hours: number;
    transport_minutes: number;
    leisure_vigorous_days: number;
    leisure_vigorous_hours: number;
    leisure_vigorous_minutes: number;
    leisure_moderate_days: number;
    leisure_moderate_hours: number;
    leisure_moderate_minutes: number;
    exercise_plan: string | null;
    no_exercise_reason: string | null;
    no_exercise_reason_text: string | null;
  };
  obesity: {
    weight_change: string;
    weight_change_kg: number | null;
    body_shape_perception: string;
    weight_control_effort: string;
  };
  diet: {
    breakfast_frequency: string;
    diet_total_score: number;
    diet_q1_whole_grains: number;
    diet_q2_vegetables: number;
    diet_q3_fruits: number;
    diet_q4_dairy: number;
    diet_q5_regular_meals: number;
    diet_q6_balanced_diet: number;
    diet_q7_low_salt: number;
    diet_q8_no_extra_salt: number;
    diet_q9_trim_fat: number;
    diet_q10_avoid_fried: number;
    poor_diet_reason: string | null;
    poor_diet_reason_text: string | null;
  };
  mental_health: {
    phq9_total_score: number;
    sleep_hours_weekday: number;
    sleep_hours_weekend: number;
    phq9_q1_depressed: number;
    phq9_q2_no_interest: number;
    phq9_q3_sleep_problem: number;
    phq9_q4_appetite: number;
    phq9_q5_psychomotor: number;
    phq9_q6_fatigue: number;
    phq9_q7_guilt: number;
    phq9_q8_concentration: number;
    phq9_q9_suicide: number;
  };
  demographics: {
    marital_status: string;
    household_size: number;
    insurance_type: string;
    education_level: string;
    monthly_income: string;
    household_size_cat: string;
  };
}