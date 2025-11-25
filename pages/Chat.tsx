
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Plus, MessageSquare, Menu, FileText, ArrowUpRight, 
  ArrowRight, ArrowUp, PanelRightClose, PanelRightOpen,
  ArrowLeft, Search, X, Trash2, PanelLeftClose,
  User, Activity, Calendar, Pill, ClipboardList,
  ChevronRight, File, Settings, AlertTriangle, Cigarette, Wine, Utensils, Brain, GraduationCap, Scale
} from 'lucide-react';
import { Patient, ChatMessage, DocumentSource, ChatSession, CheckupRecord, SurveyRecord } from '../types';
import { MOCK_PATIENTS, MOCK_DOCUMENTS, CHECKUP_DATA, SURVEY_DATA } from '../constants';
import { streamChatResponse } from '../services/geminiService';
import { getSessions, saveSession, createNewSessionId, deleteSession } from '../services/chatStorage';

interface ChatProps {
  initialPatient: Patient | null;
}

const Chat: React.FC<ChatProps> = ({ initialPatient }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState<'info' | 'docs'>('info');
  const [viewingDoc, setViewingDoc] = useState<DocumentSource | null>(null);
  const [viewingPatientDetail, setViewingPatientDetail] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from storage on mount
  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);
  }, []);

  // Initialize patient and session
  useEffect(() => {
    if (initialPatient) {
      setSelectedPatient(initialPatient);
      // Don't auto-clear messages if we are just switching back from dashboard with same patient
      setViewingPatientDetail(false);
      
      // If no session active, try to find latest for this patient or start new
      if (!currentSessionId) {
        const loadedSessions = getSessions();
        const patientSession = loadedSessions.find(s => s.patientId === initialPatient.id);
        if (patientSession) {
          loadSession(patientSession);
        } else {
          setMessages([]);
          setCurrentSessionId(null);
        }
      }
    } else if (!selectedPatient && MOCK_PATIENTS.length > 0) {
      // Default to first patient if none selected
      setSelectedPatient(MOCK_PATIENTS.find(p => p.name === '홍길동') || MOCK_PATIENTS[0]);
    }
  }, [initialPatient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!viewingDoc && !viewingPatientDetail) {
      scrollToBottom();
    }
  }, [messages, viewingDoc, viewingPatientDetail]);

  // Persist current session when messages change
  useEffect(() => {
    if (currentSessionId && selectedPatient && messages.length > 0) {
      const sessionToSave: ChatSession = {
        id: currentSessionId,
        patientId: selectedPatient.id,
        title: `${selectedPatient.name} 님 상담`,
        lastMessageAt: Date.now(),
        messages: messages
      };
      saveSession(sessionToSave);
      setSessions(getSessions());
    }
  }, [messages, currentSessionId, selectedPatient]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    if (window.innerWidth < 768) {
      setIsLeftPanelOpen(false);
    }
  };

  const loadSession = (session: ChatSession) => {
    const patient = MOCK_PATIENTS.find(p => p.id === session.patientId);
    if (patient) {
      setSelectedPatient(patient);
      setMessages(session.messages);
      setCurrentSessionId(session.id);
      setViewingPatientDetail(false);
      setViewingDoc(null);
      if (window.innerWidth < 768) {
        setIsLeftPanelOpen(false);
      }
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
    setSessions(getSessions());
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedPatient) return;

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = createNewSessionId();
      setCurrentSessionId(activeSessionId);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    const loadingMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMsgId,
      role: 'model',
      text: '',
      isStreaming: true
    }]);

    const contextData = `
    PATIENT INFO:
    Name: ${selectedPatient.name}
    Age: ${selectedPatient.age}
    Condition: ${selectedPatient.group}
    Notes: ${selectedPatient.notes.join(', ')}
    Vitals: BP ${selectedPatient.stats.bloodPressure}, Sugar ${selectedPatient.stats.bloodSugar}, BMI ${selectedPatient.stats.bmi}

    AVAILABLE MEDICAL SOURCES (Reference these by ID in format [1], [2], [3]):
    [1] ${MOCK_DOCUMENTS[0].title}: ${MOCK_DOCUMENTS[0].contentSnippet}
    [2] ${MOCK_DOCUMENTS[1].title}: ${MOCK_DOCUMENTS[1].contentSnippet}
    [3] ${MOCK_DOCUMENTS[2].title}: ${MOCK_DOCUMENTS[2].contentSnippet}
    `;

    const stream = streamChatResponse({
      history: messages.map(m => ({ role: m.role, text: m.text })),
      message: userMsg.text,
      contextData: contextData
    });

    let fullText = '';
    
    for await (const chunk of stream) {
      fullText += chunk;
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId ? { ...msg, text: fullText } : msg
      ));
    }

    setMessages(prev => prev.map(msg => 
      msg.id === loadingMsgId ? { ...msg, isStreaming: false } : msg
    ));
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const id = parseInt(match[1]);
        const doc = MOCK_DOCUMENTS[id - 1] || MOCK_DOCUMENTS[0];
        
        return (
          <span key={idx} className="relative group inline-block ml-1 align-baseline cursor-pointer" onClick={() => setViewingDoc(doc)}>
            <span className="bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded hover:bg-primary/30 transition-colors">
              {id}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
              <div className="bg-panel-dark border border-gray-700 rounded-lg shadow-xl p-3 text-left">
                <p className="font-bold text-white text-xs mb-1 truncate">{doc.title}</p>
                <p className="text-gray-400 text-xs line-clamp-3">{doc.contentSnippet}</p>
                <div className="mt-2 text-primary text-xs flex items-center">
                  Click to read full document <ArrowRight size={10} className="ml-1"/>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-panel-dark"></div>
            </div>
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const getPatientDetails = (name: string): { checkup: CheckupRecord | undefined, survey: SurveyRecord | undefined } => {
    const checkup = CHECKUP_DATA.find(c => c.name === name);
    // Find survey matching name (simple matching for demo, in reality would use ID or DOB)
    const survey = SURVEY_DATA.find(s => s.survey.patient_name === name);
    return { checkup, survey };
  };

  const isAbnormal = (val: number, type: 'waist_m' | 'waist_f' | 'bmi' | 'bp_sys' | 'bp_dia' | 'fbg' | 'tg' | 'hdl_m' | 'hdl_f' | 'ldl') => {
    switch(type) {
      case 'waist_m': return val >= 90;
      case 'waist_f': return val >= 85;
      case 'bmi': return val >= 25;
      case 'bp_sys': return val >= 130;
      case 'bp_dia': return val >= 85;
      case 'fbg': return val >= 100;
      case 'tg': return val >= 150;
      case 'hdl_m': return val < 40;
      case 'hdl_f': return val < 50;
      case 'ldl': return val >= 130; // Standard strictness
      default: return false;
    }
  };

  // Helper functions for display mapping
  const formatEducation = (edu: string) => {
    const map: Record<string, string> = { 'HIGH': '고졸', 'COLLEGE': '대졸', 'MIDDLE': '중졸', 'ELEMENTARY': '초졸', 'NONE': '무학' };
    return map[edu] || edu;
  };

  const formatWeightChange = (change: string) => {
    const map: Record<string, string> = { 'INCREASED': '증가', 'DECREASED': '감소', 'NO_CHANGE': '변화 없음' };
    return map[change] || change;
  };

  const formatBodyShape = (shape: string) => {
    const map: Record<string, string> = { 'NORMAL': '보통', 'THIN': '마름', 'OBESE': '비만', 'VERY_THIN': '매우 마름', 'OVERWEIGHT': '과체중' };
    return map[shape] || shape;
  };

  const formatControlEffort = (effort: string) => {
    const map: Record<string, string> = { 'LOSE': '체중 감소', 'MAINTAIN': '유지', 'NONE': '노력 안함', 'GAIN': '체중 증가' };
    return map[effort] || effort;
  };

  const formatQuitPlan = (plan: string | null | undefined) => {
    if (!plan) return '';
    const map: Record<string, string> = { 'SOMEDAY': '언젠가', 'WITHIN_1M': '1개월 내', 'WITHIN_6M': '6개월 내', 'NO_PLAN': '계획 없음' };
    return map[plan] || plan;
  };

  const formatExercisePlan = (plan: string | null | undefined) => {
    if (!plan) return '';
    const map: Record<string, string> = { 'MORE_6M': '6개월 이상 유지', 'LESS_6M': '6개월 미만', 'NO_PLAN': '계획 없음', 'OCCASIONAL': '불규칙적', 'FUTURE': '향후 계획' };
    return map[plan] || plan;
  };

  // View: Document Viewer
  if (viewingDoc) {
    return (
      <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-in fade-in duration-300">
        <header className="w-full border-b border-gray-200 dark:border-gray-700/50 bg-background-light dark:bg-background-dark">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <button 
              onClick={() => setViewingDoc(null)}
              className="flex cursor-pointer items-center justify-center rounded-lg bg-primary text-white gap-2 text-sm font-bold h-10 px-4 hover:bg-primary-hover transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="truncate hidden sm:inline">Back to Chat</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Search size={20} />
              </button>
              <button 
                onClick={() => setViewingDoc(null)}
                className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 w-full flex justify-center py-5 sm:py-10 overflow-y-auto">
          <div className="flex w-full max-w-4xl flex-col px-6">
            <div className="flex flex-col gap-3 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{viewingDoc.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">Medical Guideline Reference • ID: {viewingDoc.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 py-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Source Type</p>
                <p className="font-medium text-gray-900 dark:text-white uppercase">{viewingDoc.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date Indexed</p>
                <p className="font-medium text-gray-900 dark:text-white">Oct 26, 2023</p>
              </div>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none pt-8">
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                <span className="bg-primary/20 rounded px-1">{viewingDoc.contentSnippet}</span>
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // View: Client Integrated Data View
  if (viewingPatientDetail && selectedPatient) {
    const { checkup, survey } = getPatientDetails(selectedPatient.name);
    
    if (!checkup || !survey) {
        return (
            <div className="flex flex-col h-full bg-background-light dark:bg-background-dark items-center justify-center">
                <p className="text-gray-400 mb-4">해당 환자의 상세 데이터를 찾을 수 없습니다.</p>
                <button 
                  onClick={() => setViewingPatientDetail(false)}
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Back to Chat
                </button>
            </div>
        )
    }

    const calculatedBMI = (checkup.weight / ((checkup.height / 100) * (checkup.height / 100))).toFixed(1);
    
    return (
      <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto animate-in fade-in duration-300">
        {/* Fixed Header */}
        <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setViewingPatientDetail(false)}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 gap-2 text-sm font-medium h-9 px-3 transition-colors border border-gray-700"
              >
                <ArrowLeft size={16} />
                <span>닫기</span>
              </button>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                 <User size={20} className="text-primary" />
                 내담자 통합 정보 뷰어
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
               <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">성명 / 성별 / 나이</span>
                  <span className="font-semibold text-white">{checkup.name} ({survey.survey.sex}) {checkup.age}세</span>
               </div>
               <div className="h-8 w-px bg-gray-700"></div>
               <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">생년월일 / 연락처</span>
                  <span className="font-semibold text-white">{survey.survey.birth_date} / {survey.survey.contact}</span>
               </div>
               <div className="h-8 w-px bg-gray-700"></div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">검진일자</span>
                  <span className="font-semibold text-white">{checkup.exam_at.split(' ')[0]}</span>
               </div>
               <div className="h-8 w-px bg-gray-700"></div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">사회경제 (가구/학력/소득)</span>
                  <span className="font-semibold text-white">
                    {survey.demographics.household_size}인 / {formatEducation(survey.demographics.education_level)} / {survey.demographics.monthly_income}
                  </span>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Column 1: Metabolic Metrics */}
            <div className="lg:col-span-1 flex flex-col gap-6">
               <div className="bg-panel-dark border border-gray-700 rounded-xl overflow-hidden shadow-lg h-full">
                  <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2">
                     <Activity size={18} className="text-red-400" />
                     <h3 className="font-bold text-white">대사증후군 검사 결과</h3>
                  </div>
                  <div className="p-0">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-800/30">
                           <tr>
                              <th className="px-6 py-3 font-medium">항목</th>
                              <th className="px-6 py-3 font-medium text-right">측정값</th>
                              <th className="px-6 py-3 font-medium text-right text-xs">참고치</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                           {/* Anthropometry */}
                           <tr className="bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-xs font-semibold text-primary/80">신체 계측</td></tr>
                           <tr>
                              <td className="px-6 py-3">신장 / 체중</td>
                              <td className="px-6 py-3 text-right text-white font-medium">{checkup.height}cm / {checkup.weight}kg</td>
                              <td className="px-6 py-3 text-right text-gray-500">-</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">BMI</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(parseFloat(calculatedBMI), 'bmi') ? 'text-yellow-400 font-bold' : 'text-white'}`}>{calculatedBMI}</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;25</td>
                           </tr>
                           
                           {/* Obesity Survey Section */}
                           <tr className="bg-gray-800/10">
                              <td colSpan={3} className="px-6 py-2 text-xs font-semibold text-gray-400 flex items-center gap-1">
                                <Scale size={12} /> 비만 관리 (설문)
                              </td>
                           </tr>
                           <tr className="text-xs bg-gray-900/20">
                              <td className="px-6 py-2 text-gray-400 pl-8">체중 변화</td>
                              <td className="px-6 py-2 text-right text-gray-300" colSpan={2}>
                                {formatWeightChange(survey.obesity.weight_change)} 
                                {survey.obesity.weight_change_kg && ` (${survey.obesity.weight_change_kg > 0 ? '+' : ''}${survey.obesity.weight_change_kg}kg)`}
                              </td>
                           </tr>
                           <tr className="text-xs bg-gray-900/20">
                              <td className="px-6 py-2 text-gray-400 pl-8">체형 인식</td>
                              <td className="px-6 py-2 text-right text-gray-300" colSpan={2}>{formatBodyShape(survey.obesity.body_shape_perception)}</td>
                           </tr>
                           <tr className="text-xs bg-gray-900/20">
                              <td className="px-6 py-2 text-gray-400 pl-8">조절 노력</td>
                              <td className="px-6 py-2 text-right text-gray-300" colSpan={2}>{formatControlEffort(survey.obesity.weight_control_effort)}</td>
                           </tr>

                           <tr>
                              <td className="px-6 py-3">허리둘레</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.waist, checkup.sex === '남' ? 'waist_m' : 'waist_f') ? 'text-red-400 font-bold' : 'text-white'}`}>{checkup.waist} cm</td>
                              <td className="px-6 py-3 text-right text-gray-500">{checkup.sex === '남' ? '<90' : '<85'}</td>
                           </tr>

                           {/* BP */}
                           <tr className="bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-xs font-semibold text-primary/80">혈압</td></tr>
                           <tr>
                              <td className="px-6 py-3">수축기 / 이완기</td>
                              <td className={`px-6 py-3 text-right font-medium`}>
                                <span className={isAbnormal(checkup.sys, 'bp_sys') ? 'text-red-400 font-bold' : 'text-white'}>{checkup.sys}</span>
                                <span className="text-gray-500 mx-1">/</span>
                                <span className={isAbnormal(checkup.dia, 'bp_dia') ? 'text-red-400 font-bold' : 'text-white'}>{checkup.dia}</span>
                                <span className="text-gray-500 text-xs ml-1">mmHg</span>
                              </td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;130/85</td>
                           </tr>

                           {/* Blood Sugar */}
                           <tr className="bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-xs font-semibold text-primary/80">혈당</td></tr>
                           <tr>
                              <td className="px-6 py-3">공복혈당</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.fbg, 'fbg') ? 'text-red-400 font-bold' : 'text-white'}`}>{checkup.fbg} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;100</td>
                           </tr>

                           {/* Lipids */}
                           <tr className="bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-xs font-semibold text-primary/80">지질</td></tr>
                           <tr>
                              <td className="px-6 py-3">총콜레스테롤</td>
                              <td className="px-6 py-3 text-right text-white font-medium">{checkup.tc} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;200</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">중성지방</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.tg, 'tg') ? 'text-red-400 font-bold' : 'text-white'}`}>{checkup.tg} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;150</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">HDL</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.hdl, checkup.sex === '남' ? 'hdl_m' : 'hdl_f') ? 'text-yellow-400 font-bold' : 'text-white'}`}>{checkup.hdl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">{checkup.sex === '남' ? '>40' : '>50'}</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">LDL</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.ldl, 'ldl') ? 'text-red-400 font-bold' : 'text-white'}`}>{checkup.ldl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;130</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Column 2: Lifestyle Survey */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-panel-dark border border-gray-700 rounded-xl overflow-hidden shadow-lg h-full">
                  <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2">
                     <Utensils size={18} className="text-green-400" />
                     <h3 className="font-bold text-white">생활습관 설문 요약</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    
                    {/* Smoking */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 bg-gray-700 p-2 rounded-lg text-gray-300"><Cigarette size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">흡연 (Smoking)</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-white font-medium">{survey.smoking.current_status}</span>
                                {survey.smoking.current_status !== 'NEVER' && (
                                    <span className="text-xs text-gray-400">
                                        ({survey.smoking.daily_amount}개비/일, {survey.smoking.smoking_duration_years}년)
                                    </span>
                                )}
                            </div>
                            {survey.smoking.quit_plan && (
                                <p className="text-xs text-blue-300 mt-1 bg-blue-500/10 px-2 py-0.5 rounded inline-block">
                                    금연 계획: {formatQuitPlan(survey.smoking.quit_plan)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Alcohol */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 bg-gray-700 p-2 rounded-lg text-gray-300"><Wine size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">음주 (Alcohol)</p>
                            <div className="flex flex-col">
                                <span className={`font-medium ${survey.alcohol.current_drinker ? 'text-white' : 'text-gray-400'}`}>
                                    {survey.alcohol.current_drinker ? '음주함' : '비음주'}
                                </span>
                                {survey.alcohol.current_drinker && (
                                    <span className="text-xs text-gray-400">
                                        빈도: {survey.alcohol.frequency}, 1회: {survey.alcohol.amount_per_occasion}잔
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Physical Activity */}
                     <div className="flex items-start gap-4">
                        <div className="mt-1 bg-gray-700 p-2 rounded-lg text-gray-300"><Activity size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">신체활동 (Activity)</p>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between w-full gap-4">
                                    <span className="text-gray-400">좌식 시간</span>
                                    <span className="text-white font-medium">{survey.physical_activity.sedentary_hours}시간 {survey.physical_activity.sedentary_minutes}분</span>
                                </div>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className={`px-2 py-0.5 rounded text-xs border ${survey.physical_activity.transport_days > 0 ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-gray-700 text-gray-600'}`}>이동</span>
                                    <span className={`px-2 py-0.5 rounded text-xs border ${survey.physical_activity.leisure_moderate_days > 0 ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-gray-700 text-gray-600'}`}>여가(중)</span>
                                    <span className={`px-2 py-0.5 rounded text-xs border ${survey.physical_activity.leisure_vigorous_days > 0 ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-gray-700 text-gray-600'}`}>여가(고)</span>
                                </div>
                                {survey.physical_activity.exercise_plan && (
                                    <p className="text-xs text-green-400 mt-1">운동 계획: {formatExercisePlan(survey.physical_activity.exercise_plan)}</p>
                                )}
                                {survey.physical_activity.no_exercise_reason && (
                                    <p className="text-xs text-gray-500 mt-0.5">미실천 사유: {survey.physical_activity.no_exercise_reason}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Diet */}
                    <div className="flex items-start gap-4 pt-4 border-t border-gray-700">
                        <div className="mt-1 bg-gray-700 p-2 rounded-lg text-gray-300"><Utensils size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">식습관 (Diet)</p>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-white font-medium">점수: </span>
                                <span className="text-primary font-bold">{survey.diet.diet_total_score} / 10</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {survey.diet.diet_q1_whole_grains === 0 && <span className="px-2 py-0.5 bg-gray-800 text-yellow-500 border border-yellow-500/30 rounded text-xs">잡곡 미섭취</span>}
                                {survey.diet.diet_q2_vegetables === 0 && <span className="px-2 py-0.5 bg-gray-800 text-yellow-500 border border-yellow-500/30 rounded text-xs">채소 부족</span>}
                                {survey.diet.diet_q5_regular_meals === 0 && <span className="px-2 py-0.5 bg-gray-800 text-red-400 border border-red-500/30 rounded text-xs">불규칙 식사</span>}
                                {survey.diet.diet_q7_low_salt === 0 && <span className="px-2 py-0.5 bg-gray-800 text-orange-400 border border-orange-500/30 rounded text-xs">국물 섭취</span>}
                                {survey.diet.diet_q9_trim_fat === 0 && <span className="px-2 py-0.5 bg-gray-800 text-yellow-500 border border-yellow-500/30 rounded text-xs">지방 미제거</span>}
                                {survey.diet.diet_q10_avoid_fried === 0 && <span className="px-2 py-0.5 bg-gray-800 text-red-400 border border-red-500/30 rounded text-xs">튀김 선호</span>}
                                {survey.diet.diet_q1_whole_grains === 1 && survey.diet.diet_q2_vegetables === 1 && survey.diet.diet_q7_low_salt === 1 && <span className="px-2 py-0.5 bg-gray-800 text-green-400 border border-green-500/30 rounded text-xs">양호한 식습관</span>}
                            </div>
                             {survey.diet.poor_diet_reason && (
                                <p className="text-xs text-gray-500 mt-2">개선 어려움: {survey.diet.poor_diet_reason}</p>
                            )}
                        </div>
                    </div>

                  </div>
                </div>
            </div>

            {/* Column 3: History & Mental */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-panel-dark border border-gray-700 rounded-xl overflow-hidden shadow-lg h-full">
                  <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2">
                     <Brain size={18} className="text-purple-400" />
                     <h3 className="font-bold text-white">병력 및 심리 상태</h3>
                  </div>
                  <div className="p-6 space-y-6">
                     
                     {/* History */}
                     <div>
                        <p className="text-xs text-gray-500 mb-2 font-bold uppercase">질병 이력 (Disease History)</p>
                        {survey.diseases.length > 0 ? (
                            <ul className="space-y-2">
                                {survey.diseases.map((d, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm bg-gray-800/50 p-2 rounded">
                                        <span className="text-white font-medium">{d.disease_name}</span>
                                        <div className="flex gap-2">
                                            <span className="text-gray-400 text-xs">{d.duration_years}년</span>
                                            {d.taking_medication && <span className="text-blue-400 text-xs bg-blue-400/10 px-1 rounded">복용중</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">특이 병력 없음</p>
                        )}
                     </div>

                     {/* Self Care */}
                     <div>
                        <p className="text-xs text-gray-500 mb-2 font-bold uppercase">자가 관리 (Self-Care)</p>
                        <div className="text-sm space-y-2">
                             <div className="flex justify-between">
                                <span className="text-gray-400">약물 순응도</span>
                                <span className={survey.medication?.compliant ? 'text-green-400' : 'text-red-400'}>
                                    {survey.medication ? (survey.medication.compliant ? '양호' : '불량') : '-'}
                                </span>
                            </div>
                            {survey.medication?.non_compliance_reason && (
                                <p className="text-xs text-gray-500 text-right">사유: {survey.medication.non_compliance_reason}</p>
                            )}
                             <div className="flex justify-between">
                                <span className="text-gray-400">수치 인지(혈압/혈당)</span>
                                <span className="text-white">{survey.bp_bg_monitoring.bp_awareness} / {survey.bp_bg_monitoring.bg_awareness}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">교육 이수</span>
                                <span className={survey.education.received_education ? 'text-blue-400' : 'text-gray-500'}>
                                    {survey.education.received_education ? '이수함' : '미이수'}
                                </span>
                            </div>
                        </div>
                     </div>

                     {/* Mental Health */}
                     <div className="pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-gray-500 font-bold uppercase">정신 건강 (PHQ-9)</p>
                            <span className="text-sm font-bold text-white">총점: {survey.mental_health.phq9_total_score}점</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">수면시간: 평일 {survey.mental_health.sleep_hours_weekday}h / 주말 {survey.mental_health.sleep_hours_weekend}h</p>
                        
                        <table className="w-full text-xs">
                            <tbody className="divide-y divide-gray-800">
                                <tr><td className="py-1 text-gray-400">우울감/희망없음</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q1_depressed}</td></tr>
                                <tr><td className="py-1 text-gray-400">흥미/즐거움 저하</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q2_no_interest}</td></tr>
                                <tr><td className="py-1 text-gray-400">수면 문제</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q3_sleep_problem}</td></tr>
                                <tr><td className="py-1 text-gray-400">피로감/기력저하</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q6_fatigue}</td></tr>
                                <tr><td className="py-1 text-gray-400">식욕 변화</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q4_appetite}</td></tr>
                                <tr><td className="py-1 text-gray-400">자책감</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q7_guilt}</td></tr>
                                <tr><td className="py-1 text-gray-400">집중력 저하</td><td className="py-1 text-right text-white">{survey.mental_health.phq9_q8_concentration}</td></tr>
                                {survey.mental_health.phq9_q9_suicide > 0 && (
                                    <tr><td className="py-1 text-red-400 font-bold">자해/자살 생각</td><td className="py-1 text-right text-red-400 font-bold">{survey.mental_health.phq9_q9_suicide}</td></tr>
                                )}
                            </tbody>
                        </table>
                     </div>

                  </div>
                </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // View: Main Chat
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Sidebar - Chat History */}
      <aside 
        className={`${isLeftPanelOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 md:opacity-100 md:w-0'} 
          transition-all duration-300 ease-in-out
          flex flex-col bg-panel-dark border-r border-gray-800 shrink-0 absolute md:relative z-20 h-full shadow-xl md:shadow-none`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <button 
            onClick={handleNewChat}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> New Chat
          </button>
          <button onClick={() => setIsLeftPanelOpen(false)} className="md:hidden ml-2 text-gray-400 hover:text-white">
            <PanelLeftClose size={20}/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          <div>
            <p className="px-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Chats</p>
            <div className="space-y-1">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all border border-transparent ${currentSessionId === session.id ? 'bg-gray-800 text-white border-gray-700 shadow-sm' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
                >
                  <MessageSquare size={18} className={`shrink-0 ${currentSessionId === session.id ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="text-sm truncate flex-1 font-medium">{session.title}</span>
                  <button 
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 px-4 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                  <MessageSquare size={24} className="mx-auto mb-2 opacity-50"/>
                  <p className="text-xs">No conversation history</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 bg-panel-dark shrink-0">
          <div className="flex flex-col gap-2">
             <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all w-full text-left group">
               <div className="bg-gray-800 group-hover:bg-primary/20 p-1.5 rounded-lg transition-colors">
                 <User size={20} className="group-hover:text-primary transition-colors"/> 
               </div>
               <span className="font-semibold text-sm">Patients</span>
             </button>
             <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all w-full text-left group">
               <div className="bg-gray-800 group-hover:bg-primary/20 p-1.5 rounded-lg transition-colors">
                 <Settings size={20} className="group-hover:text-primary transition-colors"/> 
               </div>
               <span className="font-semibold text-sm">Settings</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative bg-background-dark">
        {!isLeftPanelOpen && (
           <button 
             onClick={() => setIsLeftPanelOpen(true)}
             className="absolute top-4 left-4 z-10 p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white shadow-lg"
           >
             <Menu size={20} />
           </button>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">대화를 시작해주세요</h3>
              <p className="text-gray-400 max-w-sm">
                "{selectedPatient?.name}" 님의 건강 상태나 최근 방문 기록에 대해 물어보세요.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 leading-relaxed shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gray-700 text-white rounded-br-none' 
                    : 'bg-gray-800/80 text-gray-100 rounded-bl-none border border-gray-700'
                }`}>
                  {msg.isStreaming && !msg.text ? (
                    <div className="flex gap-1 h-6 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                     <div className="markdown-content">
                        {renderMessageText(msg.text)}
                     </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-gray-800 bg-background-dark/95 backdrop-blur">
          <div className="max-w-4xl mx-auto flex items-end gap-2 bg-gray-800 rounded-xl p-2 border border-gray-700 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none max-h-32 py-2.5"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            AI는 실수를 할 수 있습니다. 중요한 의학적 결정은 반드시 확인이 필요합니다.
          </p>
        </div>
      </div>

      {/* Right Sidebar - Info & Docs */}
      {isRightPanelOpen && selectedPatient && (
        <aside className="w-80 bg-panel-dark border-l border-gray-800 flex flex-col shrink-0 transition-all">
          <div className="flex items-center border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              환자 정보
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'docs' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              참고문서
            </button>
            <button onClick={() => setIsRightPanelOpen(false)} className="px-3 text-gray-400 hover:text-white">
              <PanelRightClose size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'info' ? (
              <div className="space-y-6 flex flex-col h-full">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <User size={16} className="text-primary"/> 기본 정보
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">이름</span>
                      <span className="text-white font-medium">{selectedPatient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">나이/성별</span>
                      <span className="text-white font-medium">{selectedPatient.age}세 / {selectedPatient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">최종 방문일</span>
                      <span className="text-white font-medium">{selectedPatient.lastVisit}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                     <Activity size={16} className="text-red-400"/> 주요 지표
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">공복 혈당</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{selectedPatient.stats.bloodSugar}</span>
                        <ArrowUp size={14} className="text-red-500" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">혈압</span>
                      <span className="text-white font-medium">{selectedPatient.stats.bloodPressure}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">BMI</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{selectedPatient.stats.bmi}</span>
                        <ArrowRight size={14} className="text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <ClipboardList size={16} className="text-green-400"/> 특이사항
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.notes.map((note, idx) => (
                      <span key={idx} className="bg-gray-700 text-gray-200 text-xs px-2.5 py-1 rounded-full border border-gray-600">
                        {note}
                      </span>
                    ))}
                    {selectedPatient.notes.length === 0 && <span className="text-gray-500 text-xs">특이사항 없음</span>}
                  </div>
                </div>

                 <div className="mt-auto pt-4">
                  <button 
                    onClick={() => setViewingPatientDetail(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-gray-600"
                  >
                    내담자 통합 정보 뷰어 <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 mb-2">환자와 관련된 참고 문서</p>
                {MOCK_DOCUMENTS.map((doc, idx) => (
                  <div 
                    key={doc.id} 
                    onClick={() => setViewingDoc(doc)}
                    className="p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-primary cursor-pointer group transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <div className="bg-primary/20 p-1.5 rounded text-primary">
                            <FileText size={16} />
                         </div>
                         <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">ID: {idx + 1}</span>
                      </div>
                      <ArrowUpRight size={14} className="text-gray-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">{doc.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{doc.contentSnippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {!isRightPanelOpen && (
         <button 
           onClick={() => setIsRightPanelOpen(true)}
           className="absolute top-4 right-4 z-10 p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white shadow-lg"
         >
           <PanelRightOpen size={20} />
         </button>
      )}
    </div>
  );
};

export default Chat;
