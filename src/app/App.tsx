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

const SESSION_START_KEY = 'atv_session_start';

// Recupera el inicio de sesión guardado en esta pestaña, o lo crea si es
// la primera vez que se carga la app. Al usar sessionStorage (en vez de
// solo un useState), el contador sobrevive a un F5 y sigue contando desde
// el momento real en que se entró a la página, no desde que se abrió
// la pantalla de "Mi perfil".
function getOrCreateSessionStart(): Date {
  try {
    const stored = sessionStorage.getItem(SESSION_START_KEY);
    if (stored) return new Date(stored);
  } catch {
    // sessionStorage no disponible (modo incógnito estricto, etc.)
  }
  const now = new Date();
  try {
    sessionStorage.setItem(SESSION_START_KEY, now.toISOString());
  } catch {
    // si falla el guardado, igual devolvemos "now" para no romper la UI
  }
  return now;
}

function AppContent() {
  const { user, profile, loading, logout } = useAuth();
  // addReport se quitó de aquí: IncidentReportFlow ya guarda el reporte
  // internamente con su propia instancia de useReports(). Si App.tsx
  // también llamara a addReport, cada envío crearía DOS documentos.
  const { reports, deleteReport, updateReport } = useReports();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Se crea UNA sola vez al montar App (es decir, al entrar a la página),
  // no cada vez que se navega a "Mi perfil".
  const [sessionStart] = useState<Date>(() => getOrCreateSessionStart());

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

  // El reporte YA fue guardado en Firestore dentro de IncidentReportFlow.
  // Aquí solo reaccionamos navegando a la pantalla de "Mis denuncias".
  const handleCompleteReport = () => {
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
    // Limpiamos el contador de sesión para que la próxima persona que
    // inicie sesión en esta pestaña empiece su propio conteo desde cero.
    try {
      sessionStorage.removeItem(SESSION_START_KEY);
    } catch {
      // no-op
    }
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
          onBack={() => setCurrentScreen('home')}
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
        <Profile
          onBack={() => setCurrentScreen('home')}
          onLogout={handleLogout}
          reports={reports}
          sessionStart={sessionStart}
        />
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