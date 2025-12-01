
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Plus, MessageSquare, Menu, FileText, ArrowUpRight, 
  ArrowRight, ArrowUp, PanelRightClose, PanelRightOpen,
  ArrowLeft, Search, X, Trash2, PanelLeftClose,
  User, Activity, Calendar, Pill, ClipboardList,
  ChevronRight, File, Settings, AlertTriangle, Cigarette, Wine, Utensils, Brain, GraduationCap, Scale,
  HeartPulse, Droplets, Ruler, Flame, Image as ImageIcon, Dna, Briefcase, Users, Wallet, CreditCard, Building2,
  MapPin, Clock, CheckCircle2
} from 'lucide-react';
import { Client, ChatMessage, DocumentSource, ChatSession, CheckupRecord, SurveyRecord, ClientGroup } from '../types';
import { MOCK_DOCUMENTS } from '../constants';
import { streamChatResponse } from '../services/geminiService';
import { getSessions, saveSession, createNewSessionId, deleteSession } from '../services/chatStorage';
import { fetchClientDetail } from '../services/dataService';

interface ChatProps {
  initialClient: Client | null;
  onBackToDashboard: () => void;
}

const Chat: React.FC<ChatProps> = ({ initialClient, onBackToDashboard }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClient);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState<'info' | 'docs'>('info');
  const [viewingDoc, setViewingDoc] = useState<DocumentSource | null>(null);
  const [viewingClientDetail, setViewingClientDetail] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Real Data State
  const [clientDetails, setClientDetails] = useState<{checkup?: CheckupRecord, survey?: SurveyRecord}>({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sessions from storage on mount
  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);
  }, []);

  // Fetch Client Details from Supabase
  useEffect(() => {
    if (selectedClient) {
      const loadDetails = async () => {
        setDetailsLoading(true);
        try {
          const details = await fetchClientDetail(selectedClient.id);
          setClientDetails(details);
        } catch (error) {
          console.error("Failed to load client details", error);
        } finally {
          setDetailsLoading(false);
        }
      };
      loadDetails();
    }
  }, [selectedClient]);

  // Initialize client and session
  useEffect(() => {
    if (initialClient) {
      setSelectedClient(initialClient);
      // Don't auto-clear messages if we are just switching back from dashboard with same client
      setViewingClientDetail(false);
      
      // If no session active, try to find latest for this client or start new
      if (!currentSessionId) {
        const loadedSessions = getSessions();
        const clientSession = loadedSessions.find(s => s.clientId === initialClient.id);
        if (clientSession) {
          loadSession(clientSession);
        } else {
          setMessages([]);
          setCurrentSessionId(null);
        }
      }
    } 
  }, [initialClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!viewingDoc && !viewingClientDetail) {
      scrollToBottom();
    }
  }, [messages, viewingDoc, viewingClientDetail, previewUrl]);

  // Persist current session when messages change
  useEffect(() => {
    if (currentSessionId && selectedClient && messages.length > 0) {
      const sessionToSave: ChatSession = {
        id: currentSessionId,
        clientId: selectedClient.id,
        title: `${selectedClient.name} 님 상담`,
        lastMessageAt: Date.now(),
        messages: messages
      };
      saveSession(sessionToSave);
      setSessions(getSessions());
    }
  }, [messages, currentSessionId, selectedClient]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    clearImageSelection();
    if (window.innerWidth < 768) {
      setIsLeftPanelOpen(false);
    }
  };

  const loadSession = (session: ChatSession) => {
    // If session matches current client
    if (selectedClient && session.clientId === selectedClient.id) {
        setMessages(session.messages);
        setCurrentSessionId(session.id);
        setViewingClientDetail(false);
        setViewingDoc(null);
        clearImageSelection();
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

  // Image Helper Functions
  const clearImageSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove "data:image/jpeg;base64," prefix
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSendMessage = async () => {
    // Need either text OR an image to send
    if ((!inputValue.trim() && !selectedFile) || !selectedClient) return;

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = createNewSessionId();
      setCurrentSessionId(activeSessionId);
    }

    // Capture current file state before clearing
    const currentFile = selectedFile;
    const currentPreviewUrl = previewUrl;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      attachment: currentPreviewUrl || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    setSelectedFile(null); 
    setPreviewUrl(null); 
    if (fileInputRef.current) fileInputRef.current.value = '';

    const loadingMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMsgId,
      role: 'model',
      text: '',
      isStreaming: true
    }]);

    const contextData = `
    CLIENT INFO:
    Name: ${selectedClient.name}
    Age: ${selectedClient.age}
    Condition: ${selectedClient.group}
    Notes: ${selectedClient.notes.join(', ')}
    Vitals: BP ${selectedClient.stats.bloodPressure}, Sugar ${selectedClient.stats.bloodSugar}, BMI ${selectedClient.stats.bmi}

    DETAILED EXAM (Latest):
    ${clientDetails.checkup ? JSON.stringify(clientDetails.checkup) : 'No detailed exam data.'}

    SURVEY ANSWERS:
    ${clientDetails.survey ? JSON.stringify(clientDetails.survey) : 'No survey data.'}

    AVAILABLE MEDICAL SOURCES (Reference these by ID in format [1], [2], [3]):
    [1] ${MOCK_DOCUMENTS[0].title}: ${MOCK_DOCUMENTS[0].contentSnippet}
    [2] ${MOCK_DOCUMENTS[1].title}: ${MOCK_DOCUMENTS[1].contentSnippet}
    [3] ${MOCK_DOCUMENTS[2].title}: ${MOCK_DOCUMENTS[2].contentSnippet}
    `;

    // Prepare Base64 Image if exists
    let imagePayload = undefined;
    if (currentFile) {
        try {
            const base64Data = await fileToBase64(currentFile);
            imagePayload = {
                inlineData: {
                    data: base64Data,
                    mimeType: currentFile.type
                }
            };
        } catch (error) {
            console.error("Error processing image:", error);
        }
    }

    const stream = streamChatResponse({
      history: messages.map(m => ({ role: m.role, text: m.text })),
      message: userMsg.text,
      contextData: contextData,
      image: imagePayload
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
              <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-3 text-left">
                <p className="font-bold text-gray-900 dark:text-white text-xs mb-1 truncate">{doc.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-3">{doc.contentSnippet}</p>
                <div className="mt-2 text-primary text-xs flex items-center">
                  Click to read full document <ArrowRight size={10} className="ml-1"/>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-white dark:border-t-panel-dark"></div>
            </div>
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
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
      case 'ldl': return val >= 130;
      default: return false;
    }
  };

  const getGroupBadgeColor = (group: ClientGroup) => {
    switch (group) {
      case ClientGroup.METABOLIC: return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/20';
      case ClientGroup.NORMAL: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/20';
      case ClientGroup.CAUTION: return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/20';
      case ClientGroup.MEDICATION: return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/20';
    }
  };

  // Formatters for Demographics & Others
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

  const formatAlcoholFreq = (freq: string | null) => {
    if (!freq) return '';
    const map: Record<string, string> = {
      'LESS_1PM': '월 1회 미만',
      'ONCE_PM': '월 1회',
      '2_4PM': '월 2~4회',
      '2_3PW': '주 2~3회',
      '4PLUS_PW': '주 4회 이상'
    };
    return map[freq] || freq;
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
  
  const formatEducation = (level: string) => {
      const map: Record<string, string> = { 'ELEMENTARY': '초졸 이하', 'MIDDLE': '중졸', 'HIGH': '고졸', 'COLLEGE': '대졸 이상', 'NO_ANSWER': '무응답' };
      return map[level] || level;
  };

  const formatIncome = (income: string) => {
      const map: Record<string, string> = { 'LESS_2M': '200만원 미만', '2_4M': '200~400만원', '4_6M': '400~600만원', 'MORE_6M': '600만원 이상', 'NO_ANSWER': '무응답' };
      return map[income] || income;
  };

  const formatInsurance = (type: string) => {
      const map: Record<string, string> = { 'NHI': '건강보험', 'MEDICAID': '의료급여', 'NONE': '미가입', 'NO_ANSWER': '무응답' };
      return map[type] || type;
  };

  const formatMarital = (status: string) => {
      const map: Record<string, string> = { 'MARRIED_WITH': '기혼(동거)', 'MARRIED_WITHOUT': '기혼(비동거)', 'SINGLE': '미혼/독신', 'NO_ANSWER': '무응답' };
      return map[status] || status;
  };
  
  const formatFrequency = (freq: string | null) => {
    if (!freq) return '-';
    const map: Record<string, string> = {
        'DAILY_WEEKLY': '매일/주간',
        'MONTHLY': '월간',
        'OCCASIONALLY': '가끔/비정기'
    };
    return map[freq] || freq;
  }
  
  const formatBreakfast = (freq: string) => {
    const map: Record<string, string> = { '5_7PW': '주 5~7회', '3_4PW': '주 3~4회', '1_2PW': '주 1~2회', 'RARELY': '거의 안함' };
    return map[freq] || freq;
  };
  
  const formatSmokingLifetime = (val: string) => {
    const map: Record<string, string> = { 'MORE_5PACKS': '5갑 이상', 'LESS_5PACKS': '5갑 미만', 'NEVER': '없음' };
    return map[val] || val;
  };
  
  const formatCigaretteType = (type: string | null) => {
    if(!type) return '';
    const map: Record<string, string> = { 'REGULAR': '일반담배', 'HEATED': '궐련형 전자담배', 'LIQUID': '액상형 전자담배', 'OTHER': '기타' };
    return map[type] || type;
  };
  
  const formatActivity = (days: number, hours: number, mins: number) => {
    if (days === 0) return null;
    return `주 ${days}일, 하루 ${hours > 0 ? `${hours}시간` : ''} ${mins > 0 ? `${mins}분` : ''}`;
  };

  const getFacilityTypes = (m: any) => {
      // Prioritize the raw text input "visit_facility_other" which contains specific names like "Mapo-gu Health Center"
      if (m.visit_facility_other && m.visit_facility_other.trim().length > 0) {
          return m.visit_facility_other;
      }
      
      const types = [];
      if (m.visit_facility_health_center) types.push('보건소');
      if (m.visit_facility_clinic) types.push('의원');
      if (m.visit_facility_hospital) types.push('병원');
      return types.length > 0 ? types.join(', ') : '기록 없음';
  };
  
  const getMonitoringCount = (type: 'bp' | 'bg', monitor: any) => {
      const p = type === 'bp' ? 'bp' : 'bg';
      const w = monitor[`${p}_times_per_week`];
      const m = monitor[`${p}_times_per_month`];
      const m6 = monitor[`${p}_times_per_6months`];
      
      if (w > 0) return `주 ${w}회`;
      if (m > 0) return `월 ${m}회`;
      if (m6 > 0) return `6개월 ${m6}회`;
      return '';
  };


  // View: Document Viewer
  if (viewingDoc) {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-background-dark animate-in fade-in duration-300">
        <header className="w-full border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-background-dark">
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
            <div className="flex flex-col gap-3 pb-8 border-b border-gray-200 dark:border-gray-600">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{viewingDoc.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">Medical Guideline Reference • ID: {viewingDoc.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 py-6 border-b border-gray-200 dark:border-gray-600">
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
                <span className="bg-primary/20 rounded px-1 text-primary dark:text-indigo-400">{viewingDoc.contentSnippet}</span>
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
  if (viewingClientDetail && selectedClient) {
    const { checkup, survey } = clientDetails;
    
    if (detailsLoading) {
      return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-background-dark items-center justify-center">
             <p className="text-gray-500 dark:text-gray-400">데이터를 불러오는 중입니다...</p>
        </div>
      );
    }

    if (!checkup || !survey) {
        return (
            <div className="flex flex-col h-full bg-gray-50 dark:bg-background-dark items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">해당 내담자의 상세 데이터를 찾을 수 없습니다.</p>
                <button 
                  onClick={() => setViewingClientDetail(false)}
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Back to Chat
                </button>
            </div>
        )
    }

    const calculatedBMI = checkup.bmi ? checkup.bmi.toFixed(1) : (checkup.weight_kg / ((checkup.height_cm / 100) * (checkup.height_cm / 100))).toFixed(1);
    
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-background-dark overflow-y-auto animate-in fade-in duration-300">
        {/* Fixed Header */}
        <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-600 bg-white/95 dark:bg-background-dark/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setViewingClientDetail(false)}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 gap-2 text-sm font-medium h-9 px-3 transition-colors border border-gray-200 dark:border-gray-600"
              >
                <ArrowLeft size={16} />
                <span>닫기</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <User size={20} className="text-primary dark:text-indigo-400" />
                 내담자 상세 정보
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-300">
               <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-400 dark:text-gray-500">성명 / 성별 / 나이</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedClient.name} ({selectedClient.gender}) {selectedClient.age}세</span>
               </div>
               <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>
               <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-400 dark:text-gray-500">생년월일 / 연락처</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedClient.birthDate} / {selectedClient.contact}</span>
               </div>
               <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-400 dark:text-gray-500">검진일자</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{checkup.exam_at.split(' ')[0]}</span>
               </div>
               <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>
               <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-400 dark:text-gray-500">관리 차수</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{checkup.visit_cycle}개월 ({checkup.visit_seq}차)</span>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Column 1: Metabolic Metrics */}
            <div className="lg:col-span-1 flex flex-col gap-6">
               <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm dark:shadow-lg h-full">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50 flex items-center gap-2">
                     <Activity size={18} className="text-red-500 dark:text-red-400" />
                     <h3 className="font-bold text-gray-900 dark:text-white">대사증후군 검사 결과</h3>
                  </div>
                  <div className="p-0">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-100/50 dark:bg-gray-800/30">
                           <tr>
                              <th className="px-6 py-3 font-medium text-sm">항목</th>
                              <th className="px-6 py-3 font-medium text-right text-sm">측정값</th>
                              <th className="px-6 py-3 font-medium text-right text-sm">참고치</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-700 dark:text-gray-300">
                           {/* Anthropometry */}
                           <tr className="bg-gray-50 dark:bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-sm font-semibold text-primary dark:text-indigo-400">신체 계측</td></tr>
                           <tr>
                              <td className="px-6 py-3">신장 / 체중</td>
                              <td className="px-6 py-3 text-right text-gray-900 dark:text-white font-medium">{checkup.height_cm}cm / {checkup.weight_kg}kg</td>
                              <td className="px-6 py-3 text-right text-gray-500">-</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">BMI</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(parseFloat(calculatedBMI), 'bmi') ? 'text-yellow-600 dark:text-yellow-400 font-bold' : 'text-gray-900 dark:text-white'}`}>{calculatedBMI}</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;25</td>
                           </tr>
                           
                           {/* Obesity Survey Section */}
                           <tr className="bg-gray-50 dark:bg-gray-800/10">
                              <td colSpan={3} className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Scale size={12} /> 비만 관리(설문)
                              </td>
                           </tr>
                           <tr className="text-xs bg-gray-50/50 dark:bg-gray-900/20">
                              <td className="px-6 py-2 text-gray-500 dark:text-gray-400 pl-8">체중 변화</td>
                              <td className="px-6 py-2 text-right text-gray-700 dark:text-gray-300" colSpan={2}>
                                {formatWeightChange(survey.obesity.weight_change)} 
                                {survey.obesity.weight_change_kg && ` (${survey.obesity.weight_change_kg > 0 ? '+' : ''}${survey.obesity.weight_change_kg}kg)`}
                              </td>
                           </tr>
                           <tr className="text-xs bg-gray-50/50 dark:bg-gray-900/20">
                              <td className="px-6 py-2 text-gray-500 dark:text-gray-400 pl-8">체형 인식</td>
                              <td className="px-6 py-2 text-right text-gray-700 dark:text-gray-300" colSpan={2}>{formatBodyShape(survey.obesity.body_shape_perception)}</td>
                           </tr>
                           <tr className="text-xs bg-gray-50/50 dark:bg-gray-900/20">
                              <td className="px-6 py-2 text-gray-500 dark:text-gray-400 pl-8">조절 노력</td>
                              <td className="px-6 py-2 text-right text-gray-700 dark:text-gray-300" colSpan={2}>{formatControlEffort(survey.obesity.weight_control_effort)}</td>
                           </tr>

                           <tr>
                              <td className="px-6 py-3">허리둘레</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.waist_cm, selectedClient.gender === '남' ? 'waist_m' : 'waist_f') ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}`}>{checkup.waist_cm} cm</td>
                              <td className="px-6 py-3 text-right text-gray-500">{selectedClient.gender === '남' ? '<90' : '<85'}</td>
                           </tr>

                           {/* BP */}
                           <tr className="bg-gray-50 dark:bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-sm font-semibold text-primary dark:text-indigo-400">혈압</td></tr>
                           <tr>
                              <td className="px-6 py-3">수축기 / 이완기</td>
                              <td className={`px-6 py-3 text-right font-medium`}>
                                <span className={isAbnormal(checkup.systolic_mmHg, 'bp_sys') ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}>{checkup.systolic_mmHg}</span>
                                <span className="text-gray-500 mx-1">/</span>
                                <span className={isAbnormal(checkup.diastolic_mmHg, 'bp_dia') ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}>{checkup.diastolic_mmHg}</span>
                                <span className="text-gray-500 text-xs ml-1">mmHg</span>
                              </td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;130/85</td>
                           </tr>

                           {/* Blood Sugar */}
                           <tr className="bg-gray-50 dark:bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-sm font-semibold text-primary dark:text-indigo-400">혈당</td></tr>
                           <tr>
                              <td className="px-6 py-3">공복혈당</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.fbg_mg_dl, 'fbg') ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}`}>{checkup.fbg_mg_dl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;100</td>
                           </tr>

                           {/* Lipids */}
                           <tr className="bg-gray-50 dark:bg-gray-800/20"><td colSpan={3} className="px-6 py-2 text-sm font-semibold text-primary dark:text-indigo-400">지질</td></tr>
                           <tr>
                              <td className="px-6 py-3">총콜레스테롤</td>
                              <td className="px-6 py-3 text-right text-gray-900 dark:text-white font-medium">{checkup.tc_mg_dl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;200</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">중성지방</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.tg_mg_dl, 'tg') ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}`}>{checkup.tg_mg_dl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;150</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">HDL</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.hdl_mg_dl, selectedClient.gender === '남' ? 'hdl_m' : 'hdl_f') ? 'text-yellow-600 dark:text-yellow-400 font-bold' : 'text-gray-900 dark:text-white'}`}>{checkup.hdl_mg_dl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">{selectedClient.gender === '남' ? '>40' : '>50'}</td>
                           </tr>
                           <tr>
                              <td className="px-6 py-3">LDL</td>
                              <td className={`px-6 py-3 text-right font-medium ${isAbnormal(checkup.ldl_mg_dl, 'ldl') ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}`}>{checkup.ldl_mg_dl} mg/dL</td>
                              <td className="px-6 py-3 text-right text-gray-500">&lt;130</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Column 2: Lifestyle Survey */}
            <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
                <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm dark:shadow-lg">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50 flex items-center gap-2">
                     <Utensils size={18} className="text-green-600 dark:text-green-400" />
                     <h3 className="font-bold text-gray-900 dark:text-white">생활습관 설문 요약</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    
                    {/* Smoking */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-500 dark:text-gray-300"><Cigarette size={18} /></div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 font-bold uppercase">흡연 (Smoking)</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-gray-900 dark:text-white font-medium">{survey.smoking.current_status}</span>
                                {survey.smoking.current_status !== 'NEVER' && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({survey.smoking.daily_amount}개비/일, {survey.smoking.smoking_duration_years}년)
                                    </span>
                                )}
                            </div>
                            {survey.smoking.current_status !== 'NEVER' && (
                                <p className="text-xs text-gray-500 mt-1">
                                   유형: {formatCigaretteType(survey.smoking.cigarette_type)}, 평생: {formatSmokingLifetime(survey.smoking.lifetime_smoking)}
                                </p>
                            )}
                            {survey.smoking.quit_plan && (
                                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded inline-block border border-blue-100 dark:border-transparent">
                                    금연 계획: {formatQuitPlan(survey.smoking.quit_plan)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Alcohol */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-500 dark:text-gray-300"><Wine size={18} /></div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 font-bold uppercase">음주 (Alcohol)</p>
                            <div className="flex flex-col">
                                <span className={`font-medium ${survey.alcohol.current_drinker ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {survey.alcohol.current_drinker ? '음주함' : '비음주'}
                                </span>
                                {survey.alcohol.current_drinker && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        빈도: {formatAlcoholFreq(survey.alcohol.frequency)}, 1회: {survey.alcohol.amount_per_occasion}잔
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Physical Activity */}
                     <div className="flex items-start gap-4">
                        <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-500 dark:text-gray-300"><Activity size={18} /></div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 font-bold uppercase">신체활동 (Activity)</p>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between w-full gap-4">
                                    <span className="text-gray-500 dark:text-gray-400">좌식 시간</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{survey.physical_activity.sedentary_hours}시간 {survey.physical_activity.sedentary_minutes}분</span>
                                </div>
                                {/* Detailed Activity Stats */}
                                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700/50">
                                    {formatActivity(survey.physical_activity.work_vigorous_days, survey.physical_activity.work_vigorous_hours, survey.physical_activity.work_vigorous_minutes) && (
                                        <p>직업(고): {formatActivity(survey.physical_activity.work_vigorous_days, survey.physical_activity.work_vigorous_hours, survey.physical_activity.work_vigorous_minutes)}</p>
                                    )}
                                    {formatActivity(survey.physical_activity.work_moderate_days, survey.physical_activity.work_moderate_hours, survey.physical_activity.work_moderate_minutes) && (
                                        <p>직업(중): {formatActivity(survey.physical_activity.work_moderate_days, survey.physical_activity.work_moderate_hours, survey.physical_activity.work_moderate_minutes)}</p>
                                    )}
                                    {formatActivity(survey.physical_activity.transport_days, survey.physical_activity.transport_hours, survey.physical_activity.transport_minutes) && (
                                        <p>이동: {formatActivity(survey.physical_activity.transport_days, survey.physical_activity.transport_hours, survey.physical_activity.transport_minutes)}</p>
                                    )}
                                     {formatActivity(survey.physical_activity.leisure_vigorous_days, survey.physical_activity.leisure_vigorous_hours, survey.physical_activity.leisure_vigorous_minutes) && (
                                        <p>여가(고): {formatActivity(survey.physical_activity.leisure_vigorous_days, survey.physical_activity.leisure_vigorous_hours, survey.physical_activity.leisure_vigorous_minutes)}</p>
                                    )}
                                    {formatActivity(survey.physical_activity.leisure_moderate_days, survey.physical_activity.leisure_moderate_hours, survey.physical_activity.leisure_moderate_minutes) && (
                                        <p>여가(중): {formatActivity(survey.physical_activity.leisure_moderate_days, survey.physical_activity.leisure_moderate_hours, survey.physical_activity.leisure_moderate_minutes)}</p>
                                    )}
                                    {/* If no activity recorded */}
                                    {!survey.physical_activity.work_vigorous_days && !survey.physical_activity.work_moderate_days && !survey.physical_activity.transport_days && !survey.physical_activity.leisure_vigorous_days && !survey.physical_activity.leisure_moderate_days && (
                                        <p className="text-gray-400">기록된 활동 없음</p>
                                    )}
                                </div>

                                {survey.physical_activity.exercise_plan && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">운동 계획: {formatExercisePlan(survey.physical_activity.exercise_plan)}</p>
                                )}
                                {survey.physical_activity.no_exercise_reason && (
                                    <p className="text-xs text-gray-500 mt-0.5">미실천 사유: {survey.physical_activity.no_exercise_reason}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Diet */}
                    <div className="flex items-start gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-500 dark:text-gray-300"><Utensils size={18} /></div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 font-bold uppercase">식습관 (Diet)</p>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-900 dark:text-white font-medium text-sm">점수: </span>
                                    <span className="text-primary dark:text-indigo-400 font-bold text-sm">{survey.diet.diet_total_score} / 10</span>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <Clock size={12}/> 아침: {formatBreakfast(survey.diet.breakfast_frequency)}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {survey.diet.diet_q1_whole_grains === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 rounded text-sm">잡곡 미섭취</span>}
                                {survey.diet.diet_q2_vegetables === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 rounded text-sm">채소 부족</span>}
                                {survey.diet.diet_q3_fruits === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 rounded text-sm">과일 부족</span>}
                                {survey.diet.diet_q4_dairy === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 rounded text-sm">유제품 부족</span>}
                                {survey.diet.diet_q5_regular_meals === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded text-sm">불규칙 식사</span>}
                                {survey.diet.diet_q6_balanced_diet === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 rounded text-sm">균형식 미흡</span>}
                                {survey.diet.diet_q7_low_salt === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 rounded text-sm">국물 섭취</span>}
                                {survey.diet.diet_q8_no_extra_salt === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 rounded text-sm">추가간 함</span>}
                                {survey.diet.diet_q9_trim_fat === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 rounded text-sm">지방 미제거</span>}
                                {survey.diet.diet_q10_avoid_fried === 0 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded text-sm">튀김 선호</span>}
                                {survey.diet.diet_total_score >= 8 && <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30 rounded text-sm">양호한 식습관</span>}
                            </div>
                             {survey.diet.poor_diet_reason && (
                                <p className="text-xs text-gray-500 mt-2">개선 어려움: {survey.diet.poor_diet_reason}</p>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
                {/* 2. Demographics Card */}
                <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm dark:shadow-lg">
                   <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50 flex items-center gap-2">
                     <Users size={18} className="text-indigo-500 dark:text-indigo-400" />
                     <h3 className="font-bold text-gray-900 dark:text-white">인구사회학적 정보</h3>
                  </div>
                  <div className="p-6 space-y-4">
                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><MapPin size={12}/> 주소</p>
                           <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{selectedClient.address}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><GraduationCap size={12}/> 학력</p>
                           <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{formatEducation(survey.demographics.education_level)}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><Wallet size={12}/> 월 소득</p>
                           <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{formatIncome(survey.demographics.monthly_income)}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><Users size={12}/> 가구 형태</p>
                           <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{formatMarital(survey.demographics.marital_status)} ({survey.demographics.household_size}인 가구)</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><CreditCard size={12}/> 의료 보장</p>
                           <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{formatInsurance(survey.demographics.insurance_type)}</p>
                        </div>
                     </div>
                  </div>
                </div>
            </div>

            {/* Column 3: Demographics & History & Mental */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                

                <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm dark:shadow-lg h-full">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50 flex items-center gap-2">
                     <Brain size={18} className="text-purple-500 dark:text-purple-400" />
                     <h3 className="font-bold text-gray-900 dark:text-white">병력 및 자가관리</h3>
                  </div>
                  <div className="p-6 space-y-6">
                     
                     {/* History */}
                     <div>
                        <p className="text-sm text-gray-500 mb-2 font-bold uppercase">질병 이력 (Disease History)</p>
                        {survey.diseases.length > 0 ? (
                            <ul className="space-y-2">
                                {survey.diseases.map((d, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-600">
                                        <span className="text-gray-900 dark:text-white font-medium">{d.disease_name || d.disease_code}</span>
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">{d.duration_years}년</span>
                                            {d.taking_medication && <span className="text-blue-600 dark:text-blue-300 text-xs bg-blue-50 dark:bg-blue-400/10 px-1 rounded border border-blue-100 dark:border-transparent">복용중</span>}
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
                        <p className="text-sm text-gray-500 mb-2 font-bold uppercase">자가 관리 (Self-Care)</p>
                        <div className="text-sm space-y-2">
                             <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">약물 순응도</span>
                                <span className={survey.medication?.compliant ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    {survey.medication ? (survey.medication.compliant ? '양호' : '불량') : '-'}
                                </span>
                            </div>
                            {survey.medication && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">정기 외래 방문</span>
                                    <span className="text-gray-700 dark:text-gray-300 text-xs">{survey.medication.regular_visit ? '방문함' : '방문안함'}</span>
                                </div>
                            )}
                            {survey.medication?.non_compliance_reason && (
                                <p className="text-sm text-gray-500 text-right">사유: {survey.medication.non_compliance_reason}</p>
                            )}
                            
                            {/* Added Facility Type Info */}
                            {survey.medication && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">이용 의료기관</span>
                                    <span className="text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1">
                                        <Building2 size={10} /> {getFacilityTypes(survey.medication)}
                                    </span>
                                </div>
                            )}
                             
                             {/* Added Monitoring Frequency */}
                             <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                <span className="text-gray-500 dark:text-gray-400">혈압 측정</span>
                                <div className="text-right">
                                    <span className="text-gray-900 dark:text-white block">{survey.bp_bg_monitoring.bp_awareness}</span>
                                    <div className="flex flex-col items-end">
                                        {survey.bp_bg_monitoring.bp_frequency && (
                                            <span className="text-xs text-gray-500 block">({formatFrequency(survey.bp_bg_monitoring.bp_frequency)})</span>
                                        )}
                                        {getMonitoringCount('bp', survey.bp_bg_monitoring) && (
                                            <span className="text-[10px] text-gray-400 block">{getMonitoringCount('bp', survey.bp_bg_monitoring)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">혈당 측정</span>
                                <div className="text-right">
                                    <span className="text-gray-900 dark:text-white block">{survey.bp_bg_monitoring.bg_awareness}</span>
                                    <div className="flex flex-col items-end">
                                        {survey.bp_bg_monitoring.bg_frequency && (
                                            <span className="text-xs text-gray-500 block">({formatFrequency(survey.bp_bg_monitoring.bg_frequency)})</span>
                                        )}
                                         {getMonitoringCount('bg', survey.bp_bg_monitoring) && (
                                            <span className="text-[10px] text-gray-400 block">{getMonitoringCount('bg', survey.bp_bg_monitoring)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-start pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 dark:text-gray-400">만성질환 교육 이수</span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">고혈압·당뇨·이상지질혈증 등</span>
                                </div>
                                <span className={`mt-1 ${survey.education.received_education ? 'text-blue-600 dark:text-blue-300 font-medium' : 'text-gray-500'}`}>
                                    {survey.education.received_education ? '이수함' : '미이수'}
                                </span>
                            </div>
                        </div>
                     </div>

                     {/* Mental Health */}
                     <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-gray-500 font-bold uppercase">정신 건강 (PHQ-9)</p>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">총점: {survey.mental_health.phq9_total_score}점</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">수면시간: 평일 {survey.mental_health.sleep_hours_weekday}h / 주말 {survey.mental_health.sleep_hours_weekend}h</p>
                        
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">우울감/희망없음</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q1_depressed}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">흥미/즐거움 저하</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q2_no_interest}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">수면 문제</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q3_sleep_problem}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">피로감/기력저하</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q6_fatigue}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">식욕 변화</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q4_appetite}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">정신운동 지체/초조</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q5_psychomotor}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">자책감</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q7_guilt}</td></tr>
                                <tr><td className="py-1 text-gray-500 dark:text-gray-400">집중력 저하</td><td className="py-1 text-right text-gray-900 dark:text-white">{survey.mental_health.phq9_q8_concentration}</td></tr>
                                {survey.mental_health.phq9_q9_suicide > 0 && (
                                    <tr><td className="py-1 text-red-500 dark:text-red-400 font-bold">자해/자살 생각</td><td className="py-1 text-right text-red-500 dark:text-red-400 font-bold">{survey.mental_health.phq9_q9_suicide}</td></tr>
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
      {/* Left Sidebar - Chat History - Increased width to w-80 */}
      <aside 
        className={`${isLeftPanelOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0 md:opacity-100 md:w-0'} 
          transition-all duration-300 ease-in-out
          flex flex-col bg-white dark:bg-panel-dark border-r border-gray-200 dark:border-gray-700 shrink-0 absolute md:relative z-20 h-full shadow-xl md:shadow-none`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
          <button 
            onClick={handleNewChat}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> New Chat
          </button>
          <button onClick={() => setIsLeftPanelOpen(false)} className="md:hidden ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <PanelLeftClose size={20}/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          <div>
            <p className="px-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">최근 채팅</p>
            <div className="space-y-1">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all border border-transparent ${currentSessionId === session.id ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <MessageSquare size={18} className={`shrink-0 ${currentSessionId === session.id ? 'text-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  <span className="text-sm truncate flex-1 font-medium">{session.title}</span>
                  <button 
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 px-4 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl">
                  <MessageSquare size={24} className="mx-auto mb-2 opacity-50"/>
                  <p className="text-sm">대화 내역이 아직 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-panel-dark shrink-0">
          <div className="flex flex-col gap-2">
             <button 
                onClick={onBackToDashboard}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all w-full text-left group"
             >
               <div className="bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/20 p-1.5 rounded-lg transition-colors">
                 <Users size={20} className="group-hover:text-primary transition-colors"/> 
               </div>
               <span className="font-semibold text-base">내담자 목록</span>
             </button>
             <button className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all w-full text-left group">
               <div className="bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/20 p-1.5 rounded-lg transition-colors">
                 <Settings size={20} className="group-hover:text-primary transition-colors"/> 
               </div>
               <span className="font-semibold text-base">설정</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative bg-gray-50 dark:bg-background-dark">
        {!isLeftPanelOpen && (
           <button 
             onClick={() => setIsLeftPanelOpen(true)}
             className="absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-lg border border-gray-200 dark:border-gray-600"
           >
             <Menu size={20} />
           </button>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">대화를 시작해주세요</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                "{selectedClient?.name}" 님의 건강 상태나 <br />최근 방문 기록에 대해 물어보세요.
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
                
                <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.attachment && (
                    <div className="mb-1 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 max-w-sm">
                      <img src={msg.attachment} alt="Attachment" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className={`rounded-2xl px-5 py-3.5 leading-relaxed shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
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
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-gray-600 dark:text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-background-dark/95 backdrop-blur">
          {previewUrl && (
            <div className="max-w-4xl mx-auto mb-3 flex items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative bg-gray-100 dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm group">
                <img src={previewUrl} alt="Preview" className="h-24 w-auto object-cover rounded-lg" />
                <button 
                  onClick={clearImageSelection}
                  className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full p-1 shadow-md hover:bg-red-50 hover:text-red-500 dark:hover:bg-gray-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          
          <div className="max-w-4xl mx-auto flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <button 
              onClick={triggerFileSelect}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 resize-none max-h-32 py-2.5 custom-scrollbar"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !selectedFile}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
            AI는 실수를 할 수 있습니다. 중요한 의학적 결정은 반드시 확인이 필요합니다.
          </p>
        </div>
      </div>

      {/* Right Sidebar - Info & Docs - Increased width to w-96 */}
      {isRightPanelOpen && selectedClient && (
        <aside className="w-96 bg-white dark:bg-panel-dark border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-all">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-600">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-base font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              내담자 정보
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`flex-1 py-3 text-base font-medium border-b-2 transition-colors ${activeTab === 'docs' ? 'border-primary text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              참고문서
            </button>
            <button onClick={() => setIsRightPanelOpen(false)} className="px-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <PanelRightClose size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'info' ? (
              <div className="space-y-4 flex flex-col h-full">
                {(() => {
                  const { checkup, survey } = clientDetails;
                  
                  if (detailsLoading) {
                    return <div className="text-center py-8 text-gray-500">데이터 로딩중...</div>;
                  }
                  
                  if (checkup && survey) {
                    const bmi = checkup.bmi ? checkup.bmi.toFixed(1) : (checkup.weight_kg / ((checkup.height_cm / 100) ** 2)).toFixed(1);
                    return (
                      <>
                        {/* 1. Compact Profile - Increased Size and Text - Height Increased */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-6 rounded-xl border border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white text-xl">{selectedClient.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.gender} {selectedClient.age}세 ({survey.survey.survey_at?.split('T')[0]})</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm px-2.5 py-1 rounded-full font-medium border ${getGroupBadgeColor(selectedClient.group)}`}>{selectedClient.group}</span>
                              <p className="text-sm text-gray-500 mt-1.5">최근: {selectedClient.lastVisit}</p>
                            </div>
                          </div>
                        </div>

                        {/* 2. Key Vitals Grid - Updated Layout to 2x3 with dedicated BMI card and merged HDL/LDL - Increased Size and Text - Height Slightly Decreased */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* 1. BP */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col justify-center min-h-[75px]">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                               <HeartPulse size={16} className="text-red-500 dark:text-red-400"/> 혈압 <span className="text-[12px] text-gray-400 dark:text-gray-500 scale-90 origin-left">(mmHg)</span>
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-xl font-bold ${isAbnormal(checkup.systolic_mmHg, 'bp_sys') ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{checkup.systolic_mmHg}</span>
                              <span className="text-sm text-gray-500">/</span>
                              <span className={`text-xl font-bold ${isAbnormal(checkup.diastolic_mmHg, 'bp_dia') ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{checkup.diastolic_mmHg}</span>
                            </div>
                          </div>

                          {/* 2. FBG */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col justify-center min-h-[75px]">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                               <Droplets size={16} className="text-blue-500 dark:text-blue-400"/> 공복혈당 <span className="text-[12px] text-gray-400 dark:text-gray-500 scale-90 origin-left">(mg/dL)</span>
                            </span>
                            <span className={`text-xl font-bold ${isAbnormal(checkup.fbg_mg_dl, 'fbg') ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{checkup.fbg_mg_dl}</span>
                          </div>

                          {/* 3. Waist (Removed BMI) */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col justify-center min-h-[75px]">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                               <Ruler size={16} className="text-green-500 dark:text-green-400"/> 허리둘레 <span className="text-[12px] text-gray-400 dark:text-gray-500 scale-90 origin-left">(cm)</span>
                            </span>
                            <span className={`text-xl font-bold ${isAbnormal(checkup.waist_cm, selectedClient.gender === '남' ? 'waist_m' : 'waist_f') ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{checkup.waist_cm}</span>
                          </div>

                          {/* 4. BMI (Dedicated Card) */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col justify-center min-h-[75px]">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                               <Scale size={16} className="text-purple-500 dark:text-purple-400"/> BMI <span className="text-[12px] text-gray-400 dark:text-gray-500 scale-90 origin-left">(kg/m²)</span>
                            </span>
                            <span className={`text-xl font-bold ${isAbnormal(parseFloat(bmi), 'bmi') ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>{bmi}</span>
                          </div>

                          {/* 5. TG (Moved to slot 5) */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col justify-center min-h-[75px]">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                               <Flame size={16} className="text-orange-500 dark:text-orange-400"/> 중성지방 <span className="text-[12px] text-gray-400 dark:text-gray-500 scale-90 origin-left">(mg/dL)</span>
                            </span>
                            <span className={`text-xl font-bold ${isAbnormal(checkup.tg_mg_dl, 'tg') ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{checkup.tg_mg_dl}</span>
                          </div>

                          {/* 6. HDL & LDL (Merged) */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col justify-center min-h-[75px]">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                               <Dna size={16} className="text-pink-500 dark:text-pink-400"/> HDL/LDL <span className="text-[12px] text-gray-400 dark:text-gray-500 scale-90 origin-left">(mg/dL)</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${isAbnormal(checkup.hdl_mg_dl, selectedClient.gender === '남' ? 'hdl_m' : 'hdl_f') ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>{checkup.hdl_mg_dl}</span>
                              <span className="text-gray-600">/</span>
                              <span className={`text-lg font-bold ${isAbnormal(checkup.ldl_mg_dl, 'ldl') ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{checkup.ldl_mg_dl}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Lifestyle Icons - Increased Size and Text */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 flex justify-around items-center">
                           <div className="flex flex-col items-center gap-1">
                              <Cigarette size={20} className={survey.smoking.current_status !== 'NEVER' ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-gray-600'} />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{survey.smoking.current_status === 'DAILY' ? '매일' : survey.smoking.current_status === 'NEVER' ? '비흡연' : '과거/가끔'}</span>
                           </div>
                           <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                           <div className="flex flex-col items-center gap-1">
                              <Wine size={20} className={survey.alcohol.current_drinker ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'} />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{survey.alcohol.current_drinker ? (formatAlcoholFreq(survey.alcohol.frequency) || '음주') : '비음주'}</span>
                           </div>
                           <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                           <div className="flex flex-col items-center gap-1">
                              <Activity size={20} className={survey.physical_activity.leisure_moderate_days > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'} />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{survey.physical_activity.leisure_moderate_days > 0 ? '운동함' : '운동부족'}</span>
                           </div>
                        </div>

                        {/* 4. Medical History & Meds (Tags) - This naturally shrinks due to flex-1 and increased size of above elements */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                           <p className="text-sm text-gray-500 font-bold uppercase mb-2">병력 및 투약</p>
                           <div className="flex flex-wrap gap-1.5">
                              {survey.diseases.length > 0 ? survey.diseases.map((d, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded text-sm border border-gray-300 dark:border-gray-600 flex items-center gap-1">
                                  {d.disease_name || d.disease_code}
                                  {d.taking_medication && <Pill size={10} className="text-blue-500 dark:text-blue-300" />}
                                </span>
                              )) : <span className="text-sm text-gray-500 italic">특이 병력 없음</span>}
                              
                              {survey.medication && (
                                <span className={`px-2 py-1 rounded text-sm border flex items-center gap-1 ${survey.medication.compliant ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'}`}>
                                  약물 순응도: {survey.medication.compliant ? '양호' : '불량'}
                                </span>
                              )}
                           </div>
                        </div>
                      </>
                    );
                  } 
                  // Fallback for users not in the detailed dataset (using basic selectedClient data)
                  return (
                    <>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <User size={16} className="text-primary"/> 기본 정보
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">이름</span>
                            <span className="text-gray-900 dark:text-white font-medium">{selectedClient.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">나이/성별</span>
                            <span className="text-gray-900 dark:text-white font-medium">{selectedClient.age}세 / {selectedClient.gender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">최종 방문일</span>
                            <span className="text-gray-900 dark:text-white font-medium">{selectedClient.lastVisit}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                           <Activity size={16} className="text-red-500 dark:text-red-400"/> 주요 지표
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">공복 혈당</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 dark:text-white font-medium">{selectedClient.stats.bloodSugar}</span>
                              <ArrowUp size={14} className="text-red-500" />
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">혈압</span>
                            <span className="text-gray-900 dark:text-white font-medium">{selectedClient.stats.bloodPressure}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">BMI</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 dark:text-white font-medium">{selectedClient.stats.bmi}</span>
                              <ArrowRight size={14} className="text-yellow-500" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <ClipboardList size={16} className="text-green-500 dark:text-green-400"/> 특이사항
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedClient.notes.map((note, idx) => (
                            <span key={idx} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-2.5 py-1 rounded-full border border-gray-300 dark:border-gray-600">
                              {note}
                            </span>
                          ))}
                          {selectedClient.notes.length === 0 && <span className="text-gray-500 text-xs">특이사항 없음</span>}
                        </div>
                      </div>
                    </>
                  );
                })()}

                 <div className="mt-auto pt-2">
                  <button 
                    onClick={() => setViewingClientDetail(true)}
                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600"
                  >
                    내담자 정보 상세보기 <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 mb-2">내담자와 관련된 참고 문서</p>
                {MOCK_DOCUMENTS.map((doc, idx) => (
                  <div 
                    key={doc.id} 
                    onClick={() => setViewingDoc(doc)}
                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary cursor-pointer group transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <div className="bg-primary/20 p-1.5 rounded text-primary dark:text-indigo-400">
                            <FileText size={16} />
                         </div>
                         <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">ID: {idx + 1}</span>
                      </div>
                      <ArrowUpRight size={14} className="text-gray-400 group-hover:text-primary dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{doc.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{doc.contentSnippet}</p>
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
           className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-lg border border-gray-200 dark:border-gray-600"
           >
           <PanelRightOpen size={20} />
         </button>
      )}
    </div>
  );
};

export default Chat;
