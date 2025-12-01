
import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import { AppView, Client } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleLogin = () => {
    setCurrentView(AppView.DASHBOARD);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
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
        <Dashboard onClientSelect={handleClientSelect} />
      )}
      {currentView === AppView.CHAT && (
        <Chat 
          initialClient={selectedClient} 
          onBackToDashboard={() => handleNavigate(AppView.DASHBOARD)}
        />
      )}
    </Layout>
  );
}

export default App;
