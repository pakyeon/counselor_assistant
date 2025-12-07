

import { supabase } from './supabaseClient';
import { Client, ClientGroup, CheckupRecord, SurveyRecord, SearchResult } from '../types';

// --- Helper to unwrap Supabase 1:1 relation arrays ---
const unwrap = <T>(val: T | T[] | null | undefined, defaultValue?: T): T | null => {
  if (Array.isArray(val)) {
    return val.length > 0 ? val[0] : (defaultValue || null);
  }
  return val || defaultValue || null;
};

// --- Helper: Map DB Risk Group to UI Enum ---
const mapRiskGroup = (group: string): ClientGroup => {
  switch (group) {
    case 'MS': return ClientGroup.METABOLIC;
    case 'CAUTION': return ClientGroup.CAUTION;
    case 'MEDICATION': return ClientGroup.MEDICATION;
    case 'NORMAL': return ClientGroup.NORMAL;
    default: return ClientGroup.NORMAL;
  }
};

// --- Helper: Calculate Age from Birthdate ---
const calculateAge = (birthDateString: string): number => {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// --- Simulated RAG Search API ---
export const searchDocuments = async (query: string): Promise<SearchResult[]> => {
  console.log(`Searching documents for query: ${query}`);
  
  // In a real implementation, this would call:
  // const response = await fetch('/api/chat/search', { 
  //   method: 'POST', 
  //   body: JSON.stringify({ query, top_k: 5 }) 
  // });
  // return response.json().results;

  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock response with signed_url pointing to a real PDF for demonstration
  const DEMO_PDF_URL = "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf";

  return [
    {
      id: 1,
      original_name: "2024_Metabolic_Syndrome_Guidelines.pdf",
      signed_url: DEMO_PDF_URL,
      chunk_text: "대사증후군 관리의 첫 번째 목표는 LDL 콜레스테롤 수치를 100mg/dL 미만으로 유지하는 것입니다. 이를 위해 생활습관 교정이 필수적이며, 필요시 스타틴 계열 약물을 처방해야 합니다. 특히 당뇨병 동반 시 더욱 엄격한 관리가 요구됩니다.",
      search_rank: 1
    },
    {
      id: 2,
      original_name: "Clinical_Nutrition_Report_Oct.pdf",
      signed_url: DEMO_PDF_URL,
      chunk_text: "저탄수화물 식이요법이 중성지방 감소에 미치는 영향에 대한 연구 결과, 12주간의 개입 후 평균 35mg/dL의 감소 효과가 관찰되었습니다. 이는 고지방 식이에 비해 유의미한 수치입니다.",
      search_rank: 2
    },
    {
      id: 3,
      original_name: "Physical_Activity_Recommendations.pdf",
      signed_url: DEMO_PDF_URL,
      chunk_text: "주 150분 이상의 중등도 유산소 운동은 인슐린 저항성을 개선하는 데 가장 효과적인 방법 중 하나입니다. 근력 운동을 주 2회 병행할 경우 그 효과는 배가됩니다.",
      search_rank: 3
    },
    {
      id: 4,
      original_name: "Stress_and_Cortisol.pdf",
      signed_url: DEMO_PDF_URL,
      chunk_text: "만성적인 스트레스는 코르티솔 수치를 높여 복부 비만을 악화시키는 주요 원인입니다. 명상과 규칙적인 수면 패턴은 대사 지표 개선에 도움을 줍니다.",
      search_rank: 4
    }
  ];
};

// --- Fetch Dashboard Clients ---
export const fetchDashboardClients = async (): Promise<Client[]> => {
  // 1. Fetch Clients table
  const { data: clientsData, error: clientError } = await supabase
    .from('clients')
    .select('*');

  if (clientError) {
    console.error('Error fetching clients:', JSON.stringify(clientError));
    return [];
  }

  if (!clientsData || clientsData.length === 0) return [];

  // 2. Fetch Latest Health Exams to populate stats
  // We fetch all exams for these clients and then filter in JS for simplicity
  const clientIds = clientsData.map((c: any) => c.client_id);
  const { data: examsData, error: examError } = await supabase
    .from('health_exams')
    .select('*')
    .in('client_id', clientIds)
    .order('exam_at', { ascending: false });

  if (examError) {
    console.error('Error fetching health_exams:', JSON.stringify(examError));
  }

  // 3. Merge Data
  return clientsData.map((c: any) => {
    // Find latest exam for this client
    const clientExams = examsData ? examsData.filter((e: any) => e.client_id === c.client_id) : [];
    const latestExam = clientExams.length > 0 ? clientExams[0] : null;

    // Generate simple notes based on thresholds
    const notes = [];
    if (latestExam) {
      if (latestExam.systolic_mmHg >= 140 || latestExam.diastolic_mmHg >= 90) notes.push('고혈압 의심');
      if (latestExam.fbg_mg_dl >= 126) notes.push('당뇨 의심');
      if (latestExam.bmi >= 25) notes.push('비만');
    }
    if (notes.length === 0) notes.push('특이사항 없음');

    return {
      id: c.client_id,
      name: c.name,
      sex: c.sex,
      birthDate: c.birth_date,
      contact: c.contact,
      address: c.address,
      risk_group: c.risk_group, // raw string
      group: mapRiskGroup(c.risk_group), // UI enum
      surveyFormType: c.survey_form_type,
      
      // Helpers
      age: calculateAge(c.birth_date),
      gender: c.sex === 'M' ? '남' : '여',
      registrationDate: latestExam?.baseline_exam_at?.split('T')[0] || c.birth_date || '-',
      lastVisit: latestExam ? latestExam.exam_at.split('T')[0] : '-',
      cycle: latestExam ? parseInt(latestExam.visit_cycle) : 6,
      
      stats: {
        bloodSugar: latestExam ? `${latestExam.fbg_mg_dl} mg/dL` : '-',
        bloodPressure: latestExam ? `${latestExam.systolic_mmHg}/${latestExam.diastolic_mmHg} mmHg` : '-',
        bmi: latestExam ? latestExam.bmi?.toFixed(1) : '-'
      },
      notes: notes
    };
  });
};

// --- Fetch Client Details ---
export const fetchClientDetail = async (clientId: string): Promise<{ checkup?: CheckupRecord, survey?: SurveyRecord }> => {
  // 1. Fetch Latest Health Exam
  const { data: exams, error: examError } = await supabase
    .from('health_exams')
    .select('*')
    .eq('client_id', clientId)
    .order('exam_at', { ascending: false })
    .limit(1);

  if (examError) {
    console.error('Error fetching health_exams detail:', JSON.stringify(examError));
  }

  let checkup: CheckupRecord | undefined = undefined;
  if (exams && exams.length > 0) {
    const e = exams[0];
    checkup = {
      exam_id: e.exam_id,
      client_id: e.client_id,
      visit_cycle: e.visit_cycle,
      visit_seq: e.visit_seq,
      exam_at: e.exam_at.replace('T', ' ').split('.')[0],
      prev_exam_at: e.prev_exam_at,
      baseline_exam_at: e.baseline_exam_at,
      facility: e.facility,
      doc_registered_on: e.doc_registered_on,
      
      height_cm: e.height_cm,
      weight_kg: e.weight_kg,
      bmi: e.bmi,
      waist_cm: e.waist_cm,
      systolic_mmHg: e.systolic_mmHg,
      diastolic_mmHg: e.diastolic_mmHg,
      fbg_mg_dl: e.fbg_mg_dl,
      tg_mg_dl: e.tg_mg_dl,
      hdl_mg_dl: e.hdl_mg_dl,
      tc_mg_dl: e.tc_mg_dl,
      ldl_mg_dl: e.ldl_mg_dl,
      
      recent_checkup: e.recent_checkup,
      recent_checkup_date: e.recent_checkup_date,
      
      description: `검진일: ${e.exam_at.split('T')[0]} (${e.visit_seq}차 방문)`
    };
  }

  // 2. Fetch Latest Survey with all relations
  const { data: surveys, error: surveyError } = await supabase
    .from('surveys')
    .select(`
      *,
      disease_history(*),
      medication_compliance(*),
      bp_bg_monitoring(*),
      education_history(*),
      smoking_history(*),
      alcohol_consumption(*),
      physical_activity(*),
      obesity_management(*),
      diet_habit(*),
      mental_health(*),
      demographics(*)
    `)
    .eq('client_id', clientId)
    .order('survey_at', { ascending: false })
    .limit(1);

  if (surveyError) {
    console.error('Error fetching surveys detail:', JSON.stringify(surveyError));
  }

  let survey: SurveyRecord | undefined = undefined;
  if (surveys && surveys.length > 0) {
    const s = surveys[0];
    survey = {
      survey: {
        survey_id: s.survey_id,
        client_id: s.client_id,
        visit_cycle: s.visit_cycle,
        visit_seq: s.visit_seq,
        survey_form_type: s.survey_form_type,
        survey_at: s.survey_at,
      },
      diseases: s.disease_history || [],
      medication: unwrap(s.medication_compliance),
      bp_bg_monitoring: unwrap(s.bp_bg_monitoring)!,
      education: unwrap(s.education_history, { received_education: false })!,
      smoking: unwrap(s.smoking_history)!,
      alcohol: unwrap(s.alcohol_consumption)!,
      physical_activity: unwrap(s.physical_activity)!,
      obesity: unwrap(s.obesity_management)!,
      diet: unwrap(s.diet_habit)!,
      mental_health: unwrap(s.mental_health)!,
      demographics: unwrap(s.demographics)!
    };
  }

  return { checkup, survey };
};