
import React from 'react';
import { useStore } from '../store';

export const Header: React.FC<{ title: string }> = ({ title }) => {
  const { isOnline } = useStore();

  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 pr-4 py-1.5 bg-gray-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
          <span className="material-symbols-outlined text-xs">{isOnline ? 'wifi' : 'wifi_off'}</span>
          {isOnline ? 'Online' : 'Offline Mode'}
        </div>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};
