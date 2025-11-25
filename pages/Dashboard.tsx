import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { Patient, PatientGroup } from '../types';

interface DashboardProps {
  onPatientSelect: (patient: Patient) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getGroupBadgeColor = (group: PatientGroup) => {
    switch (group) {
      case PatientGroup.METABOLIC: return 'bg-red-500/20 text-red-400 border-red-500/20';
      case PatientGroup.NORMAL: return 'bg-green-500/20 text-green-400 border-green-500/20';
      case PatientGroup.CAUTION: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case PatientGroup.MEDICATION: return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.includes(searchTerm) || p.id.includes(searchTerm)
  );

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Client List</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="환자 이름이나 ID로 검색하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-panel-dark border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-panel-dark/50 border border-gray-800 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60 text-xs text-gray-400 uppercase tracking-wider font-medium">
                <tr>
                  {['환자 ID', '성명', '생년월일', '그룹군', '등록일', '최종 방문일', '주기'].map((header, idx) => (
                    <th key={idx} className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">
                      <div className="flex items-center gap-1">
                        {header}
                        {header === '성명' ? <ArrowUp size={14} className="text-primary" /> : <ChevronsUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    onClick={() => onPatientSelect(patient)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">{patient.id}</td>
                    <td className="px-6 py-4 text-gray-300">{patient.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{patient.birthDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getGroupBadgeColor(patient.group)}`}>
                        {patient.group}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{patient.registrationDate}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-right text-gray-300 font-mono">{patient.cycle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-panel-dark rounded-lg border border-gray-700 hover:bg-gray-800 hover:text-white transition-all">
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center text-sm font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20">1</button>
            <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">2</button>
            <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">3</button>
            <span className="text-gray-600 px-2">...</span>
            <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">10</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-panel-dark rounded-lg border border-gray-700 hover:bg-gray-800 hover:text-white transition-all">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;