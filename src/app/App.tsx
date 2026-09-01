import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useReports } from './hooks/useReports';
import { Onboarding } from './components/onboarding/Onboarding';
import { Home } from './components/home/Home';
import { IncidentReportFlow } from './components/incident/IncidentReportFlow';
import { MyReports } from './components/reports/MyReports';
import { Resources } from './components/resources/Resources';
import { Community } from './components/community/Community';
import { Profile } from './components/profile/Profile';
import { BottomNavigation } from './components/shared/BottomNavigation';
import { IncidentDetailView } from './components/incident/IncidentDetailView';
import { OperatorDashboard } from './components/operator/OperatorDashboard';

function AppContent() {
  const { user, profile, loading, logout } = useAuth();
  const { reports, addReport, deleteReport, updateReport } = useReports();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Extraer correo de la sesión actual
  const userEmail = user?.email || profile?.email || '';

  // REDIRECCIÓN AUTOMÁTICA AL MODO OPERADOR
  useEffect(() => {
    if (!loading && userEmail.toLowerCase().endsWith('@correounivalle.edu.co')) {
      setCurrentScreen('operador');
    }
  }, [userEmail, loading]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    setSelectedReportId(null);
  };

  const handleCompleteReport = async (data: any) => {
    addReport({
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      witnesses:
        data.witnesses === 'yes'
          ? data.witnessDetails
          : data.witnesses === 'no'
          ? 'No hubo testigos'
          : 'No está segura',
      evidence: data.evidence ? data.evidence.map((file: File) => file.name) : [],
    });
    setCurrentScreen('denuncias');
  };

  const handleViewReportDetail = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentScreen('report-detail');
  };

  const handleDeleteReport = (reportId?: string) => {
    const idToDelete = reportId || selectedReportId;
    if (idToDelete && deleteReport) {
      deleteReport(idToDelete);
    }
    setSelectedReportId(null);
    setCurrentScreen('denuncias');
  };

  const handleUpdateReport = (updatedData: any) => {
    if (updateReport) {
      updateReport(updatedData);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ECE8FF] to-white">
        <div className="w-10 h-10 border-4 border-[#6A4AE3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const selectedReport = reports.find(
    (r: any, index: number) => (r.id ? r.id === selectedReportId : index.toString() === selectedReportId)
  );

  const showBottomNav = !['registrar', 'report-detail', 'operador'].includes(currentScreen);

  return (
    <div className="pb-20">
      {currentScreen === 'home' && (
        <Home onNavigate={handleNavigate} hasIncidents={reports.length > 0} />
      )}

      {currentScreen === 'registrar' && (
        <IncidentReportFlow
          onComplete={handleCompleteReport}
          onCancel={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'denuncias' && (
        <MyReports
          reports={reports}
          onBack={() => setCurrentScreen('home')}
          onViewDetail={(id) => handleViewReportDetail(id)}
        />
      )}

      {currentScreen === 'report-detail' && (
        <IncidentDetailView
          incidentData={selectedReport}
          onBack={() => setCurrentScreen('denuncias')}
          onDeleteReport={handleDeleteReport}
          onUpdateReport={handleUpdateReport}
        />
      )}

      {currentScreen === 'recursos' && <Resources onBack={() => setCurrentScreen('home')} />}

      {currentScreen === 'comunidad' && <Community onBack={() => setCurrentScreen('home')} />}

      {currentScreen === 'perfil' && (
        <Profile onBack={() => setCurrentScreen('home')} onLogout={handleLogout} reports={reports} />
      )}

      {/* Pantalla del Operador */}
      {currentScreen === 'operador' && (
        <OperatorDashboard
          userEmail={userEmail}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {showBottomNav && <BottomNavigation currentScreen={currentScreen} onNavigate={handleNavigate} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;