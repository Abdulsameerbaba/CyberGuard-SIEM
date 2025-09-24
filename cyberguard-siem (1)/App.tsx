
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Page } from './types';
import { Dashboard } from './pages/Dashboard';
import { OsintTools } from './pages/OsintTools';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { SecurityResources } from './pages/SecurityResources';
import { Auth } from './pages/Auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);

  const renderPage = () => {
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.OsintTools:
        return <OsintTools />;
      case Page.ThreatIntelligence:
        return <ThreatIntelligence />;
      case Page.SecurityResources:
        return <SecurityResources />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogin = () => {
      setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
      setIsAuthenticated(false);
      setActivePage(Page.Dashboard);
  };

  if (!isAuthenticated) {
      return <Auth onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default App;
