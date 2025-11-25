

import { Patient, PatientGroup, DocumentSource, CheckupRecord, SurveyRecord } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: '김서준',
    birthDate: '1999-01-01',
    age: 26,
    gender: '남',
    group: PatientGroup.NORMAL,
    registrationDate: '2024-03-01',
    lastVisit: '2025-08-12',
    cycle: 3,
    stats: { bloodSugar: '92 mg/dL', bloodPressure: '118/74 mmHg', bmi: '22.2' },
    notes: ['정상 범위 유지']
  },
  {
    id: 'P002',
    name: '한예린',
    birthDate: '2001-09-30',
    age: 24,
    gender: '여',
    group: PatientGroup.CAUTION,
    registrationDate: '2024-06-05',
    lastVisit: '2025-08-23',
    cycle: 6,
    stats: { bloodSugar: '82 mg/dL', bloodPressure: '95/62 mmHg', bmi: '17.6' },
    notes: ['저체중', '근력 운동 필요']
  },
  {
    id: 'P003',
    name: '오다인',
    birthDate: '2000-06-18',
    age: 25,
    gender: '여',
    group: PatientGroup.NORMAL,
    registrationDate: '2025-01-15',
    lastVisit: '2025-09-16',
    cycle: 6,
    stats: { bloodSugar: '85 mg/dL', bloodPressure: '108/65 mmHg', bmi: '20.5' },
    notes: []
  },
  {
    id: 'P004',
    name: '최민준',
    birthDate: '1997-03-15',
    age: 28,
    gender: '남',
    group: PatientGroup.METABOLIC,
    registrationDate: '2024-12-10',
    lastVisit: '2025-08-25',
    cycle: 3,
    stats: { bloodSugar: '105 mg/dL', bloodPressure: '135/88 mmHg', bmi: '29.3' },
    notes: ['비만', '혈압 관리 필요', '흡연']
  },
  {
    id: 'P005',
    name: '이도윤',
    birthDate: '1993-02-15',
    age: 32,
    gender: '여',
    group: PatientGroup.METABOLIC,
    registrationDate: '2024-05-10',
    lastVisit: '2025-08-13',
    cycle: 3,
    stats: { bloodSugar: '118 mg/dL', bloodPressure: '145/92 mmHg', bmi: '32.4' },
    notes: ['고도비만', '대사증후군', '식습관 교정 시급']
  },
  {
    id: 'P006',
    name: '서지후',
    birthDate: '1990-03-11',
    age: 35,
    gender: '남',
    group: PatientGroup.NORMAL,
    registrationDate: '2024-11-19',
    lastVisit: '2025-08-28',
    cycle: 12,
    stats: { bloodSugar: '88 mg/dL', bloodPressure: '115/72 mmHg', bmi: '26.2' },
    notes: ['운동선수형 과체중']
  },
  {
    id: 'P007',
    name: '박소영',
    birthDate: '1991-08-20',
    age: 34,
    gender: '여',
    group: PatientGroup.CAUTION,
    registrationDate: '2024-09-15',
    lastVisit: '2025-09-05',
    cycle: 6,
    stats: { bloodSugar: '98 mg/dL', bloodPressure: '125/78 mmHg', bmi: '28.1' },
    notes: ['과체중', '경계성 수치']
  },
  {
    id: 'P008',
    name: '김태현',
    birthDate: '1987-05-05',
    age: 38,
    gender: '남',
    group: PatientGroup.CAUTION,
    registrationDate: '2024-04-22',
    lastVisit: '2025-09-12',
    cycle: 6,
    stats: { bloodSugar: '85 mg/dL', bloodPressure: '105/68 mmHg', bmi: '19.4' },
    notes: ['저체중', '흡연']
  },
  {
    id: 'P009',
    name: '박하준',
    birthDate: '1980-09-30',
    age: 45,
    gender: '남',
    group: PatientGroup.MEDICATION,
    registrationDate: '2024-07-22',
    lastVisit: '2025-08-16',
    cycle: 6,
    stats: { bloodSugar: '95 mg/dL', bloodPressure: '138/86 mmHg', bmi: '24.6' },
    notes: ['고지혈증', '흡연']
  },
  {
    id: 'P010',
    name: '윤하린',
    birthDate: '1977-01-01',
    age: 48,
    gender: '여',
    group: PatientGroup.MEDICATION,
    registrationDate: '2025-03-03',
    lastVisit: '2025-09-01',
    cycle: 6,
    stats: { bloodSugar: '102 mg/dL', bloodPressure: '140/90 mmHg', bmi: '26.0' },
    notes: ['갱년기', '고혈압', '고지혈증']
  },
  {
    id: 'P011',
    name: '조민호',
    birthDate: '1983-06-14',
    age: 42,
    gender: '남',
    group: PatientGroup.METABOLIC,
    registrationDate: '2024-08-30',
    lastVisit: '2025-09-08',
    cycle: 3,
    stats: { bloodSugar: '125 mg/dL', bloodPressure: '155/98 mmHg', bmi: '28.7' },
    notes: ['중등도 비만', '고혈압 전단계']
  }
];

export const MOCK_DOCUMENTS: DocumentSource[] = [
  {
    id: 'source-1',
    title: '2024_Medical_Guidelines_Metabolic.pdf',
    type: 'pdf',
    contentSnippet: '...recent studies indicate that lifestyle intervention is the first line of defense against metabolic syndrome...'
  },
  {
    id: 'source-2',
    title: 'Patient_P010_Lab_Results_Oct.pdf',
    type: 'pdf',
    contentSnippet: '...Fasting glucose levels showed a slight increase compared to the previous quarter (135 mg/dL vs 130 mg/dL)...'
  },
  {
    id: 'source-3',
    title: 'Internal_Memo_Dietary_Plans.docx',
    type: 'doc',
    contentSnippet: '...recommended low-sodium DASH diet for patients exhibiting hypertension symptoms alongside diabetes...'
  }
];

export const SYSTEM_INSTRUCTION = `You are a professional medical counselor assistant specializing in metabolic syndrome.
You have access to patient data and medical guidelines.
When answering questions about a patient, use the provided context.
If you refer to specific medical facts or patient records, act as if you are citing them.
Output citations in the format [1], [2], etc., corresponding to the sources provided in the context.
Be concise, professional, and empathetic.
Use Korean language for the final response.
`;

export const CHECKUP_DATA: CheckupRecord[] = [
    {
        "name": "김서준", "sex": "남", "age": 26, "rrn": "990101-1******",
        "reg": "2024-03-01 09:00:00", "exam_at": "2025-08-12 09:30:00",
        "facility": "마포구보건소", "doc_reg": "2025-08-12",
        "height": 175.0, "weight": 68.0, "waist": 82.0,
        "sys": 118, "dia": 74, "fbg": 92.0,
        "tc": 180.0, "tg": 95.0, "hdl": 58.0, "ldl": 105.0,
        "description": "20대 정상 남성"
    },
    {
        "name": "한예린", "sex": "여", "age": 24, "rrn": "010930-4******",
        "reg": "2024-06-05 15:45:00", "exam_at": "2025-08-23 11:05:00",
        "facility": "성동구보건소", "doc_reg": "2025-08-23",
        "height": 165.0, "weight": 48.0, "waist": 68.0,
        "sys": 95, "dia": 62, "fbg": 82.0,
        "tc": 155.0, "tg": 68.0, "hdl": 62.0, "ldl": 85.0,
        "description": "20대 저체중 여성"
    },
    {
        "name": "오다인", "sex": "여", "age": 25, "rrn": "000618-4******",
        "reg": "2025-01-15 08:05:00", "exam_at": "2025-09-16 13:45:00",
        "facility": "서초구보건소", "doc_reg": "2025-09-16",
        "height": 168.0, "weight": 58.0, "waist": 70.0,
        "sys": 108, "dia": 65, "fbg": 85.0,
        "tc": 170.0, "tg": 70.0, "hdl": 75.0, "ldl": 90.0,
        "description": "20대 이상적 수치 여성"
    },
    {
        "name": "최민준", "sex": "남", "age": 28, "rrn": "970315-1******",
        "reg": "2024-12-10 14:20:00", "exam_at": "2025-08-25 10:15:00",
        "facility": "강남구보건소", "doc_reg": "2025-08-25",
        "height": 180.0, "weight": 95.0, "waist": 95.0,
        "sys": 135, "dia": 88, "fbg": 105.0,
        "tc": 220.0, "tg": 180.0, "hdl": 42.0, "ldl": 150.0,
        "description": "20대 비만 + 복합 위험인자"
    },
    {
        "name": "이도윤", "sex": "여", "age": 32, "rrn": "930215-2******",
        "reg": "2024-05-10 10:00:00", "exam_at": "2025-08-13 10:15:00",
        "facility": "성동구보건소", "doc_reg": "2025-08-13",
        "height": 162.0, "weight": 85.0, "waist": 98.0,
        "sys": 145, "dia": 92, "fbg": 118.0,
        "tc": 260.0, "tg": 280.0, "hdl": 35.0, "ldl": 175.0,
        "description": "30대 심각한 대사증후군 여성"
    },
    {
        "name": "서지후", "sex": "남", "age": 35, "rrn": "900311-1******",
        "reg": "2024-11-19 10:20:00", "exam_at": "2025-08-28 09:20:00",
        "facility": "마포구보건소", "doc_reg": "2025-08-28",
        "height": 180.0, "weight": 85.0, "waist": 78.0,
        "sys": 115, "dia": 72, "fbg": 88.0,
        "tc": 170.0, "tg": 75.0, "hdl": 68.0, "ldl": 90.0,
        "description": "30대 운동선수형 남성"
    },
    {
        "name": "박소영", "sex": "여", "age": 34, "rrn": "910820-2******",
        "reg": "2024-09-15 16:30:00", "exam_at": "2025-09-05 14:20:00",
        "facility": "용산구보건소", "doc_reg": "2025-09-05",
        "height": 160.0, "weight": 72.0, "waist": 86.0,
        "sys": 125, "dia": 78, "fbg": 98.0,
        "tc": 205.0, "tg": 155.0, "hdl": 48.0, "ldl": 125.0,
        "description": "30대 과체중 + 경계치 여성"
    },
    {
        "name": "김태현", "sex": "남", "age": 38, "rrn": "870505-1******",
        "reg": "2024-04-22 11:45:00", "exam_at": "2025-09-12 15:40:00",
        "facility": "강서구보건소", "doc_reg": "2025-09-12",
        "height": 173.0, "weight": 58.0, "waist": 72.0,
        "sys": 105, "dia": 68, "fbg": 85.0,
        "tc": 160.0, "tg": 65.0, "hdl": 62.0, "ldl": 88.0,
        "description": "30대 저체중 남성"
    },
    {
        "name": "박하준", "sex": "남", "age": 45, "rrn": "800930-1******",
        "reg": "2024-07-22 11:00:00", "exam_at": "2025-08-16 14:40:00",
        "facility": "강서구보건소", "doc_reg": "2025-08-16",
        "height": 178.0, "weight": 78.0, "waist": 88.0,
        "sys": 138, "dia": 86, "fbg": 95.0,
        "tc": 240.0, "tg": 120.0, "hdl": 48.0, "ldl": 170.0,
        "description": "40대 고LDL + 경계고혈압 남성"
    },
    {
        "name": "윤하린", "sex": "여", "age": 48, "rrn": "770101-2******",
        "reg": "2025-03-03 09:10:00", "exam_at": "2025-09-01 15:30:00",
        "facility": "송파구보건소", "doc_reg": "2025-09-01",
        "height": 158.0, "weight": 65.0, "waist": 88.0,
        "sys": 140, "dia": 90, "fbg": 102.0,
        "tc": 270.0, "tg": 185.0, "hdl": 45.0, "ldl": 180.0,
        "description": "40대 갱년기 지질이상 여성"
    },
    {
        "name": "조민호", "sex": "남", "age": 42, "rrn": "830614-1******",
        "reg": "2024-08-30 13:15:00", "exam_at": "2025-09-08 11:25:00",
        "facility": "노원구보건소", "doc_reg": "2025-09-08",
        "height": 175.0, "weight": 88.0, "waist": 102.0,
        "sys": 155, "dia": 98, "fbg": 125.0,
        "tc": 240.0, "tg": 320.0, "hdl": 32.0, "ldl": 155.0,
        "description": "40대 중등도 비만 + 고혈압 전단계 남성"
    },
    {
        "name": "신은정", "sex": "여", "age": 44, "rrn": "810225-2******",
        "reg": "2024-11-08 10:50:00", "exam_at": "2025-08-30 16:10:00",
        "facility": "관악구보건소", "doc_reg": "2025-08-30",
        "height": 163.0, "weight": 55.0, "waist": 75.0,
        "sys": 122, "dia": 76, "fbg": 90.0,
        "tc": 195.0, "tg": 88.0, "hdl": 65.0, "ldl": 115.0,
        "description": "40대 표준체중 정상수치 여성"
    },
    {
        "name": "최서연", "sex": "여", "age": 52, "rrn": "730508-2******",
        "reg": "2024-02-14 13:30:00", "exam_at": "2025-08-18 08:50:00",
        "facility": "송파구보건소", "doc_reg": "2025-08-18",
        "height": 160.0, "weight": 68.0, "waist": 92.0,
        "sys": 132, "dia": 84, "fbg": 96.0,
        "tc": 215.0, "tg": 165.0, "hdl": 42.0, "ldl": 140.0,
        "description": "50대 복부비만 + 저HDL 여성"
    },
    {
        "name": "장유준", "sex": "남", "age": 55, "rrn": "700715-1******",
        "reg": "2024-08-08 17:25:00", "exam_at": "2025-09-10 10:00:00",
        "facility": "강서구보건소", "doc_reg": "2025-09-10",
        "height": 170.0, "weight": 75.0, "waist": 89.5,
        "sys": 129, "dia": 84, "fbg": 99.0,
        "tc": 199.0, "tg": 149.0, "hdl": 40.5, "ldl": 129.0,
        "description": "50대 모든 경계치 남성"
    },
    {
        "name": "홍미선", "sex": "여", "age": 56, "rrn": "690330-2******",
        "reg": "2024-06-18 09:40:00", "exam_at": "2025-09-14 13:30:00",
        "facility": "종로구보건소", "doc_reg": "2025-09-14",
        "height": 155.0, "weight": 78.0, "waist": 98.0,
        "sys": 148, "dia": 92, "fbg": 110.0,
        "tc": 285.0, "tg": 240.0, "hdl": 38.0, "ldl": 195.0,
        "description": "50대 고도비만 + 전체적 고위험 여성"
    },
    {
        "name": "임성민", "sex": "남", "age": 53, "rrn": "720410-1******",
        "reg": "2025-02-20 15:10:00", "exam_at": "2025-08-28 12:45:00",
        "facility": "서대문구보건소", "doc_reg": "2025-08-28",
        "height": 176.0, "weight": 70.0, "waist": 85.0,
        "sys": 125, "dia": 78, "fbg": 92.0,
        "tc": 190.0, "tg": 105.0, "hdl": 52.0, "ldl": 120.0,
        "description": "50대 정상범위 유지 남성"
    },
    {
        "name": "정지후", "sex": "남", "age": 58, "rrn": "670212-1******",
        "reg": "2024-01-10 09:00:00", "exam_at": "2025-08-20 16:10:00",
        "facility": "서초구보건소", "doc_reg": "2025-08-20",
        "height": 172.0, "weight": 82.0, "waist": 98.0,
        "sys": 152, "dia": 95, "fbg": 135.0,
        "tc": 220.0, "tg": 200.0, "hdl": 38.0, "ldl": 145.0,
        "description": "60대 당뇨병 수준 고혈당 남성"
    },
    {
        "name": "김순자", "sex": "여", "age": 62, "rrn": "630825-2******",
        "reg": "2024-10-05 14:25:00", "exam_at": "2025-09-03 10:35:00",
        "facility": "동대문구보건소", "doc_reg": "2025-09-03",
        "height": 152.0, "weight": 45.0, "waist": 78.0,
        "sys": 145, "dia": 88, "fbg": 108.0,
        "tc": 250.0, "tg": 140.0, "hdl": 48.0, "ldl": 175.0,
        "description": "60대 저체중 + 고혈압 + 고콜레스테롤 여성"
    },
    {
        "name": "박철수", "sex": "남", "age": 64, "rrn": "610520-1******",
        "reg": "2024-03-28 11:20:00", "exam_at": "2025-08-26 15:20:00",
        "facility": "중구보건소", "doc_reg": "2025-08-26",
        "height": 168.0, "weight": 92.0, "waist": 110.0,
        "sys": 165, "dia": 105, "fbg": 148.0,
        "tc": 295.0, "tg": 380.0, "hdl": 28.0, "ldl": 185.0,
        "description": "60대 고도비만 + 2단계 고혈압 + 당뇨병 남성"
    },
    {
        "name": "이영숙", "sex": "여", "age": 61, "rrn": "640907-2******",
        "reg": "2024-12-12 16:45:00", "exam_at": "2025-09-18 09:15:00",
        "facility": "영등포구보건소", "doc_reg": "2025-09-18",
        "height": 158.0, "weight": 58.0, "waist": 82.0,
        "sys": 138, "dia": 85, "fbg": 95.0,
        "tc": 210.0, "tg": 120.0, "hdl": 58.0, "ldl": 135.0,
        "description": "60대 비교적 양호한 수치 여성"
    }
];

export const SURVEY_DATA: SurveyRecord[] = [
  {
    "survey": {
      "survey_id": "SV202508122165",
      "patient_id": "PT9901015257",
      "patient_name": "김서준",
      "sex": "M",
      "birth_date": "1999-01-01",
      "contact": "010-8014-2807",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-12T09:30:00",
      "facility": "마포구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-12",
      "created_at": "2025-11-03T07:47:33.303321",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "UNKNOWN",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
        "weight_change": "NO_CHANGE",
        "weight_change_kg": null,
        "body_shape_perception": "NORMAL",
        "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "FORMER",
      "daily_amount": 14,
      "smoking_duration_years": 19,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "ONCE_PM",
      "amount_per_occasion": "1_2",
    },
    "physical_activity": {
      "sedentary_hours": 9,
      "sedentary_minutes": 25,
      "transport_days": 7,
      "leisure_vigorous_days": 4,
      "leisure_moderate_days": 3,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 6,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 7,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 0,
      "phq9_q8_concentration": 0,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "2_4M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508236687",
      "patient_id": "PT0109306591",
      "patient_name": "한예린",
      "sex": "F",
      "birth_date": "2001-09-30",
      "contact": "010-2127-8803",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-23T11:05:00",
      "facility": "성동구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-23",
      "created_at": "2025-11-03T07:47:33.303443",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "UNKNOWN",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "DECREASED",
      "weight_change_kg": 2,
      "body_shape_perception": "THIN",
      "weight_control_effort": "GAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "ONCE_PM",
      "amount_per_occasion": "5_6",
    },
    "physical_activity": {
      "sedentary_hours": 11,
      "sedentary_minutes": 58,
      "transport_days": 3,
      "leisure_vigorous_days": 5,
      "leisure_moderate_days": 2,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 9,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 5,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 0,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "SINGLE",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "4_6M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509167108",
      "patient_id": "PT0006187143",
      "patient_name": "오다인",
      "sex": "F",
      "birth_date": "2000-06-18",
      "contact": "010-1381-5764",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-16T13:45:00",
      "facility": "서초구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-16",
      "created_at": "2025-11-03T07:47:33.303541",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "UNKNOWN",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_3PW",
      "amount_per_occasion": "3_4",
    },
    "physical_activity": {
      "sedentary_hours": 9,
      "sedentary_minutes": 15,
      "transport_days": 4,
      "leisure_vigorous_days": 4,
      "leisure_moderate_days": 4,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 6,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 10,
      "phq9_total_score": 7,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 0,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "SINGLE",
      "household_size": 1,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "2_4M",
      "household_size_cat": "ONE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508254377",
      "patient_id": "PT9703152595",
      "patient_name": "최민준",
      "sex": "M",
      "birth_date": "1997-03-15",
      "contact": "010-5480-1858",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-25T10:15:00",
      "facility": "강남구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-25",
      "created_at": "2025-11-03T07:47:33.303613",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 5,
      "body_shape_perception": "OBESE",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "OCCASIONAL",
      "daily_amount": null,
      "smoking_duration_years": 7,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "4PLUS_PW",
      "amount_per_occasion": "1_2",
    },
    "physical_activity": {
      "sedentary_hours": 12,
      "sedentary_minutes": 50,
      "transport_days": 3,
      "leisure_vigorous_days": 2,
      "leisure_moderate_days": 2,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 5,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 7,
      "phq9_total_score": 8,
      "phq9_q1_depressed": 2,
      "phq9_q2_no_interest": 0,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 2,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "LESS_2M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508134784",
      "patient_id": "PT9302156916",
      "patient_name": "이도윤",
      "sex": "F",
      "birth_date": "1993-02-15",
      "contact": "010-5588-7514",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-13T10:15:00",
      "facility": "성동구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-13",
      "created_at": "2025-11-03T07:47:33.303704",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 2
      },
      {
        "disease_name": "당뇨병",
        "diagnosed": true,
        "taking_medication": false,
        "duration_years": 3
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 3
      }
    ],
    "medication": {
      "compliant": true,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "KNOW",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 3,
      "body_shape_perception": "OBESE",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "ONCE_PM",
      "amount_per_occasion": "3_4",
    },
    "physical_activity": {
      "sedentary_hours": 8,
      "sedentary_minutes": 38,
      "transport_days": 6,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 0,
      "no_exercise_reason": "NO_TIME",
    },
    "diet": {
      "diet_total_score": 3,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 0,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": "NO_HELP",
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 7,
      "phq9_q1_depressed": 0,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "2_4M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508287844",
      "patient_id": "PT9003116858",
      "patient_name": "서지후",
      "sex": "M",
      "birth_date": "1990-03-11",
      "contact": "010-6737-1753",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-28T09:20:00",
      "facility": "마포구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-28",
      "created_at": "2025-11-03T07:47:33.304846",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "UNKNOWN",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "3_4",
    },
    "physical_activity": {
      "sedentary_hours": 10,
      "sedentary_minutes": 32,
      "transport_days": 6,
      "leisure_vigorous_days": 1,
      "leisure_moderate_days": 2,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 5,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 0,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 10,
      "phq9_total_score": 6,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 4,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "4_6M",
      "household_size_cat": "FOUR_PLUS"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509054046",
      "patient_id": "PT9108202349",
      "patient_name": "박소영",
      "sex": "F",
      "birth_date": "1991-08-20",
      "contact": "010-1587-3610",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-05T14:20:00",
      "facility": "용산구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-05",
      "created_at": "2025-11-03T07:47:33.304927",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 2,
      "body_shape_perception": "OVERWEIGHT",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": false,
      "frequency": null,
      "amount_per_occasion": null,
    },
    "physical_activity": {
      "sedentary_hours": 9,
      "sedentary_minutes": 12,
      "transport_days": 5,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 3,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 7,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 4,
      "phq9_q1_depressed": 0,
      "phq9_q2_no_interest": 0,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 0,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "2_4M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509120643",
      "patient_id": "PT8705058392",
      "patient_name": "김태현",
      "sex": "M",
      "birth_date": "1987-05-05",
      "contact": "010-8861-1781",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-12T15:40:00",
      "facility": "강서구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-12",
      "created_at": "2025-11-03T07:47:33.305005",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "UNKNOWN",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "DECREASED",
      "weight_change_kg": 1,
      "body_shape_perception": "THIN",
      "weight_control_effort": "GAIN"
    },
    "smoking": {
      "current_status": "DAILY",
      "daily_amount": 11,
      "smoking_duration_years": 5,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "5_6",
    },
    "physical_activity": {
      "sedentary_hours": 10,
      "sedentary_minutes": 55,
      "transport_days": 7,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 2,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 7,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 0,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 8,
      "phq9_total_score": 4,
      "phq9_q1_depressed": 0,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "SINGLE",
      "household_size": 1,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "4_6M",
      "household_size_cat": "ONE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508167529",
      "patient_id": "PT8009305913",
      "patient_name": "박하준",
      "sex": "M",
      "birth_date": "1980-09-30",
      "contact": "010-5823-8555",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-16T14:40:00",
      "facility": "강서구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-16",
      "created_at": "2025-11-03T07:47:33.305097",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 4
      }
    ],
    "medication": {
      "compliant": null,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "DAILY",
      "daily_amount": 20,
      "smoking_duration_years": 12,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "5_6",
    },
    "physical_activity": {
      "sedentary_hours": 10,
      "sedentary_minutes": 15,
      "transport_days": 4,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 2,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 2,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 0,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": "WEAK_WILL",
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 8,
      "phq9_total_score": 3,
      "phq9_q1_depressed": 0,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "4_6M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509014178",
      "patient_id": "PT7701018596",
      "patient_name": "윤하린",
      "sex": "F",
      "birth_date": "1977-01-01",
      "contact": "010-5124-8374",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-01T15:30:00",
      "facility": "송파구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-01",
      "created_at": "2025-11-03T07:47:33.305186",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": false,
        "duration_years": 13
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 10
      }
    ],
    "medication": {
      "compliant": false,
      "non_compliance_reason": "FORGET",
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 2,
      "body_shape_perception": "OVERWEIGHT",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": false,
      "frequency": null,
      "amount_per_occasion": null,
    },
    "physical_activity": {
      "sedentary_hours": 6,
      "sedentary_minutes": 11,
      "transport_days": 5,
      "leisure_vigorous_days": 1,
      "leisure_moderate_days": 3,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 4,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": "NO_HELP",
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 8,
      "phq9_q1_depressed": 2,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 2,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 2,
      "phq9_q8_concentration": 0,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "4_6M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509085481",
      "patient_id": "PT8306145231",
      "patient_name": "조민호",
      "sex": "M",
      "birth_date": "1983-06-14",
      "contact": "010-9550-4303",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-08T11:25:00",
      "facility": "노원구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-08",
      "created_at": "2025-11-03T07:47:33.305288",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 7
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 3
      }
    ],
    "medication": {
      "compliant": true,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "UNKNOWN",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 4,
      "body_shape_perception": "OBESE",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "3_4",
    },
    "physical_activity": {
      "sedentary_hours": 8,
      "sedentary_minutes": 47,
      "transport_days": 6,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 4,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 5,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 7,
      "phq9_total_score": 8,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 2,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "4_6M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508306965",
      "patient_id": "PT8102252590",
      "patient_name": "신은정",
      "sex": "F",
      "birth_date": "1981-02-25",
      "contact": "010-3077-2102",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-30T16:10:00",
      "facility": "관악구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-30",
      "created_at": "2025-11-03T07:47:33.305368",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "DAILY",
      "daily_amount": 7,
      "smoking_duration_years": 20,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "5_6",
    },
    "physical_activity": {
      "sedentary_hours": 11,
      "sedentary_minutes": 52,
      "transport_days": 4,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 4,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 6,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 5,
      "phq9_q1_depressed": 0,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 4,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "MORE_6M",
      "household_size_cat": "FOUR_PLUS"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508185227",
      "patient_id": "PT7305084596",
      "patient_name": "최서연",
      "sex": "F",
      "birth_date": "1973-05-08",
      "contact": "010-2203-5822",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-18T08:50:00",
      "facility": "송파구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-18",
      "created_at": "2025-11-03T07:47:33.305445",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 3,
      "body_shape_perception": "OVERWEIGHT",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": false,
      "frequency": null,
      "amount_per_occasion": null,
    },
    "physical_activity": {
      "sedentary_hours": 10,
      "sedentary_minutes": 6,
      "transport_days": 3,
      "leisure_vigorous_days": 1,
      "leisure_moderate_days": 4,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 5,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 5,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 11,
      "phq9_q1_depressed": 2,
      "phq9_q2_no_interest": 2,
      "phq9_q3_sleep_problem": 2,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "4_6M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509104926",
      "patient_id": "PT7007155136",
      "patient_name": "장유준",
      "sex": "M",
      "birth_date": "1970-07-15",
      "contact": "010-9026-4646",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-10T10:00:00",
      "facility": "강서구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-10",
      "created_at": "2025-11-03T07:47:33.305512",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "UNKNOWN",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "5_6",
    },
    "physical_activity": {
      "sedentary_hours": 10,
      "sedentary_minutes": 11,
      "transport_days": 3,
      "leisure_moderate_days": 0,
      "leisure_vigorous_days": 0,
      "no_exercise_reason": "NO_TIME",
    },
    "diet": {
      "diet_total_score": 8,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 4,
      "phq9_q1_depressed": 0,
      "phq9_q2_no_interest": 0,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 4,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "2_4M",
      "household_size_cat": "FOUR_PLUS"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509144214",
      "patient_id": "PT6903301818",
      "patient_name": "홍미선",
      "sex": "F",
      "birth_date": "1969-03-30",
      "contact": "010-6601-5649",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-14T13:30:00",
      "facility": "종로구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-14",
      "created_at": "2025-11-03T07:47:33.305585",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 15
      },
      {
        "disease_name": "당뇨병",
        "diagnosed": true,
        "taking_medication": false,
        "duration_years": 2
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 12
      }
    ],
    "medication": {
      "compliant": true,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "KNOW",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 5,
      "body_shape_perception": "OBESE",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "5_6",
    },
    "physical_activity": {
      "sedentary_hours": 6,
      "sedentary_minutes": 23,
      "transport_days": 7,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 1,
      "no_exercise_reason": "FUTURE",
    },
    "diet": {
      "diet_total_score": 2,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": "NO_TIME",
    },
    "mental_health": {
      "sleep_hours_weekday": 6,
      "sleep_hours_weekend": 7,
      "phq9_total_score": 13,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 2,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 3,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "COLLEGE",
      "monthly_income": "4_6M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508289966",
      "patient_id": "PT7204109749",
      "patient_name": "임성민",
      "sex": "M",
      "birth_date": "1972-04-10",
      "contact": "010-2249-2854",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-28T12:45:00",
      "facility": "서대문구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-28",
      "created_at": "2025-11-03T07:47:33.305663",
      "created_by": "system"
    },
    "diseases": [],
    "medication": null,
    "bp_bg_monitoring": {
      "bp_awareness": "NOT_MEASURED",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "ONCE_PM",
      "amount_per_occasion": "3_4",
    },
    "physical_activity": {
      "sedentary_hours": 7,
      "sedentary_minutes": 41,
      "transport_days": 5,
      "leisure_vigorous_days": 1,
      "leisure_moderate_days": 2,
      "no_exercise_reason": null,
    },
    "diet": {
      "diet_total_score": 9,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 1,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 1,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 1,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 8,
      "phq9_total_score": 5,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 0,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 0,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "4_6M",
      "household_size_cat": "TWO"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508201037",
      "patient_id": "PT6702129030",
      "patient_name": "정지후",
      "sex": "M",
      "birth_date": "1967-02-12",
      "contact": "010-6208-2532",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-20T16:10:00",
      "facility": "서초구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-20",
      "created_at": "2025-11-03T07:47:33.305735",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 15
      },
      {
        "disease_name": "당뇨병",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 10
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": false,
        "duration_years": 12
      }
    ],
    "medication": {
      "compliant": true,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "KNOW",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 2,
      "body_shape_perception": "OVERWEIGHT",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": false,
      "frequency": null,
      "amount_per_occasion": null,
    },
    "physical_activity": {
      "sedentary_hours": 10,
      "sedentary_minutes": 28,
      "transport_days": 5,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 0,
      "no_exercise_reason": "FUTURE",
    },
    "diet": {
      "diet_total_score": 2,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 0,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": "ECONOMIC",
    },
    "mental_health": {
      "sleep_hours_weekday": 5,
      "sleep_hours_weekend": 7,
      "phq9_total_score": 9,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 1,
      "phq9_q5_psychomotor": 2,
      "phq9_q6_fatigue": 1,
      "phq9_q7_guilt": 2,
      "phq9_q8_concentration": 0,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "MIDDLE",
      "monthly_income": "2_4M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509032419",
      "patient_id": "PT6308251377",
      "patient_name": "김순자",
      "sex": "F",
      "birth_date": "1963-08-25",
      "contact": "010-8304-9923",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-03T10:35:00",
      "facility": "동대문구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-03",
      "created_at": "2025-11-03T07:47:33.305806",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 15
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 12
      }
    ],
    "medication": {
      "compliant": false,
      "non_compliance_reason": "FORGET",
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "DECREASED",
      "weight_change_kg": 3,
      "body_shape_perception": "VERY_THIN",
      "weight_control_effort": "GAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": false,
      "frequency": null,
      "amount_per_occasion": null,
    },
    "physical_activity": {
      "sedentary_hours": 6,
      "sedentary_minutes": 52,
      "transport_days": 7,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 1,
      "no_exercise_reason": "NO_TIME",
    },
    "diet": {
      "diet_total_score": 2,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 0,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 0,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": "ECONOMIC",
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 4,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 1,
      "phq9_q3_sleep_problem": 1,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 0,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 0,
      "phq9_q8_concentration": 1,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "4_6M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202508264201",
      "patient_id": "PT6105205638",
      "patient_name": "박철수",
      "sex": "M",
      "birth_date": "1961-05-20",
      "contact": "010-8131-2361",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-08-26T15:20:00",
      "facility": "중구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-08-26",
      "created_at": "2025-11-03T07:47:33.305879",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 15
      },
      {
        "disease_name": "당뇨병",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 10
      },
      {
        "disease_name": "이상지질혈증",
        "diagnosed": true,
        "taking_medication": true,
        "duration_years": 12
      }
    ],
    "medication": {
      "compliant": true,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "KNOW",
    },
    "education": {
      "received_education": false
    },
    "obesity": {
      "weight_change": "INCREASED",
      "weight_change_kg": 5,
      "body_shape_perception": "OBESE",
      "weight_control_effort": "LOSE"
    },
    "smoking": {
      "current_status": "DAILY",
      "daily_amount": 5,
      "smoking_duration_years": 15,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "2_4PM",
      "amount_per_occasion": "7_9",
    },
    "physical_activity": {
      "sedentary_hours": 11,
      "sedentary_minutes": 10,
      "transport_days": 3,
      "leisure_moderate_days": 0,
      "leisure_vigorous_days": 0,
      "no_exercise_reason": "OCCASIONAL",
    },
    "diet": {
      "diet_total_score": 3,
      "diet_q1_whole_grains": 0,
      "diet_q2_vegetables": 0,
      "diet_q3_fruits": 0,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 0,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 1,
      "poor_diet_reason": "NO_HELP",
    },
    "mental_health": {
      "sleep_hours_weekday": 7,
      "sleep_hours_weekend": 6,
      "phq9_total_score": 22,
      "phq9_q1_depressed": 3,
      "phq9_q2_no_interest": 3,
      "phq9_q3_sleep_problem": 3,
      "phq9_q4_appetite": 3,
      "phq9_q5_psychomotor": 3,
      "phq9_q6_fatigue": 3,
      "phq9_q7_guilt": 1,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 1,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 3,
      "insurance_type": "NHI",
      "education_level": "MIDDLE",
      "monthly_income": "4_6M",
      "household_size_cat": "THREE"
    }
  },
  {
    "survey": {
      "survey_id": "SV202509184808",
      "patient_id": "PT6409076578",
      "patient_name": "이영숙",
      "sex": "F",
      "birth_date": "1964-09-07",
      "contact": "010-8315-9075",
      "address": null,
      "visit_type": "first",
      "survey_date": "2025-09-18T09:15:00",
      "facility": "영등포구보건소",
      "recent_checkup": true,
      "recent_checkup_date": "2025-09-18",
      "created_at": "2025-11-03T07:47:33.305954",
      "created_by": "system"
    },
    "diseases": [
      {
        "disease_name": "고혈압",
        "diagnosed": true,
        "taking_medication": false,
        "duration_years": 2
      }
    ],
    "medication": {
      "compliant": null,
      "non_compliance_reason": null,
    },
    "bp_bg_monitoring": {
      "bp_awareness": "KNOW",
      "bg_awareness": "NOT_MEASURED",
    },
    "education": {
      "received_education": true
    },
    "obesity": {
      "weight_change": "NO_CHANGE",
      "weight_change_kg": null,
      "body_shape_perception": "NORMAL",
      "weight_control_effort": "MAINTAIN"
    },
    "smoking": {
      "current_status": "NEVER",
      "daily_amount": null,
      "smoking_duration_years": null,
    },
    "alcohol": {
      "current_drinker": true,
      "frequency": "LESS_1PM",
      "amount_per_occasion": "1_2",
    },
    "physical_activity": {
      "sedentary_hours": 8,
      "sedentary_minutes": 42,
      "transport_days": 7,
      "leisure_vigorous_days": 0,
      "leisure_moderate_days": 0,
      "no_exercise_reason": "FUTURE",
    },
    "diet": {
      "diet_total_score": 6,
      "diet_q1_whole_grains": 1,
      "diet_q2_vegetables": 1,
      "diet_q3_fruits": 1,
      "diet_q4_dairy": 0,
      "diet_q5_regular_meals": 1,
      "diet_q6_balanced_diet": 1,
      "diet_q7_low_salt": 0,
      "diet_q8_no_extra_salt": 1,
      "diet_q9_trim_fat": 0,
      "diet_q10_avoid_fried": 0,
      "poor_diet_reason": null,
    },
    "mental_health": {
      "sleep_hours_weekday": 8,
      "sleep_hours_weekend": 9,
      "phq9_total_score": 4,
      "phq9_q1_depressed": 1,
      "phq9_q2_no_interest": 0,
      "phq9_q3_sleep_problem": 0,
      "phq9_q4_appetite": 0,
      "phq9_q5_psychomotor": 1,
      "phq9_q6_fatigue": 0,
      "phq9_q7_guilt": 0,
      "phq9_q8_concentration": 2,
      "phq9_q9_suicide": 0,
    },
    "demographics": {
      "marital_status": "MARRIED_WITH",
      "household_size": 2,
      "insurance_type": "NHI",
      "education_level": "HIGH",
      "monthly_income": "2_4M",
      "household_size_cat": "TWO"
    }
  }
];
