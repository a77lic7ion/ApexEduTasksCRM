
import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { db } from './db';
import { seedDatabase } from './seed';
import { UserRole } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TaskDetail } from './components/TaskDetail';
import { Directory } from './components/Directory';
import { TaskModal } from './components/TaskModal';
import { StaffModal } from './components/StaffModal';

const App: React.FC = () => {
  const { currentUser, setCurrentUser, activeTaskId, currentView } = useStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await seedDatabase();
      // Defaulting to Sarah Mitchell (Admin) to showcase the "Overseer" experience
      const user = await db.users.get('u1'); 
      if (user) setCurrentUser(user);
      setInitialized(true);
    };
    init();
  }, [setCurrentUser]);

  if (!initialized) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
      <p className="font-bold text-gray-500 tracking-widest text-xs uppercase animate-pulse">Initializing ApexEdu Overseer...</p>
    </div>
  );

  const renderContent = () => {
    if (activeTaskId) {
      return <TaskDetail taskId={activeTaskId} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'tasks':
        return <TeacherDashboard />;
      case 'directory':
        return <Directory />;
      case 'reports':
        return <AdminDashboard />; // Placeholder for specialized compliance reports
      default:
        return <div className="p-8">View under construction: {currentView}</div>;
    }
  };

  const getViewTitle = () => {
    if (activeTaskId) return "Oversight: Task Review";
    if (currentView === 'dashboard') return "School Performance Dashboard";
    if (currentView === 'tasks') return "Teacher Task Monitor";
    if (currentView === 'directory') return "Staff Directory & Roles";
    return currentView.charAt(0).toUpperCase() + currentView.slice(1);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
        <Header title={getViewTitle()} />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
      </main>
      <TaskModal />
      <StaffModal />
    </div>
  );
};

export default App;
