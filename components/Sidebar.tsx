
import React from 'react';
import { useStore } from '../store';
import { UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const { currentUser, setActiveTask, currentView, setCurrentView, logout } = useStore();
  const isOverseer = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.HOD;

  const menuItems = [
    { id: 'dashboard', label: isOverseer ? 'School Overview' : 'My Dashboard', icon: 'grid_view' },
    { id: 'tasks', label: isOverseer ? 'Task Monitor' : 'My Tasks', icon: 'checklist' },
  ];

  if (isOverseer) {
    menuItems.push({ id: 'directory', label: 'Teacher Directory', icon: 'groups' });
    menuItems.push({ id: 'reports', label: 'Compliance Reports', icon: 'analytics' });
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary-500 p-2 rounded-lg text-white">
          <span className="material-symbols-outlined">menu_book</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">ApexEdu</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
            {isOverseer ? 'Overseer Console' : 'Teacher Portal'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTask(null);
              setCurrentView(item.id);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold ${
              currentView === item.id 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
          <img src={currentUser?.avatar} alt="" className="w-9 h-9 rounded-full bg-gray-200 object-cover border border-gray-200" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-primary-600 font-bold uppercase">{currentUser?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};
