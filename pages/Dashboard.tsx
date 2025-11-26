
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { Patient, PatientGroup } from '../types';

interface DashboardProps {
  onPatientSelect: (patient: Patient) => void;
}

type SortKey = keyof Patient;

interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

const Dashboard: React.FC<DashboardProps> = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const getGroupBadgeColor = (group: PatientGroup) => {
    switch (group) {
      case PatientGroup.METABOLIC: return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/20';
      case PatientGroup.NORMAL: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/20';
      case PatientGroup.CAUTION: return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/20';
      case PatientGroup.MEDICATION: return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/20';
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPatients = useMemo(() => {
    let sortablePatients = [...MOCK_PATIENTS];
    
    // Filter first
    if (searchTerm) {
      sortablePatients = sortablePatients.filter(p => 
        p.name.includes(searchTerm) || p.id.includes(searchTerm)
      );
    }

    // Then sort
    if (sortConfig !== null) {
      sortablePatients.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Determine actual values for comparison to handle complex types if any, though currently all are string/number/enum
        // For group enum, we might want string comparison
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePatients;
  }, [searchTerm, sortConfig]);

  const columns: { label: string; key: SortKey }[] = [
    { label: '환자 ID', key: 'id' },
    { label: '성명', key: 'name' },
    { label: '생년월일', key: 'birthDate' },
    { label: '그룹군', key: 'group' },
    { label: '등록일', key: 'registrationDate' },
    { label: '최종 방문일', key: 'lastVisit' },
    { label: '주기', key: 'cycle' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Client List</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="환자 이름이나 ID로 검색하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-panel-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-panel-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                <tr>
                  {columns.map((col) => (
                    <th 
                      key={col.key} 
                      onClick={() => handleSort(col.key)}
                      className="px-6 py-4 cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors group select-none"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? 
                            <ArrowUp size={14} className="text-primary" /> : 
                            <ArrowDown size={14} className="text-primary" />
                        ) : (
                          <ChevronsUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {sortedPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    onClick={() => onPatientSelect(patient)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{patient.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{patient.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{patient.birthDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getGroupBadgeColor(patient.group)}`}>
                        {patient.group}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{patient.registrationDate}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300 font-mono">{patient.cycle}</td>
                  </tr>
                ))}
                {sortedPatients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-panel-dark rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center text-sm font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20">1</button>
            <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">2</button>
            <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">3</button>
            <span className="text-gray-400 dark:text-gray-600 px-2">...</span>
            <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">10</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-panel-dark rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
