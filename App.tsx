
import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import { AppView, Patient } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleLogin = () => {
    setCurrentView(AppView.DASHBOARD);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView(AppView.CHAT);
  };

  if (currentView === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeView={currentView} 
      onNavigate={handleNavigate}
      userProfile={{ name: "Dr. Kim", avatar: "https://i.pravatar.cc/150?img=11" }}
    >
      {currentView === AppView.DASHBOARD && (
        <Dashboard onPatientSelect={handlePatientSelect} />
      )}
      {currentView === AppView.CHAT && (
        <Chat 
          initialPatient={selectedPatient} 
          onBackToDashboard={() => handleNavigate(AppView.DASHBOARD)}
        />
      )}
    </Layout>
  );
}

export default App;
