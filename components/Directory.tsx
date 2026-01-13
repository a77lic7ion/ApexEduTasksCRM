
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { User, Task, UserRole } from '../types';
import { useStore } from '../store';

export const Directory: React.FC = () => {
  const { setTaskModalOpen, setStaffModalOpen, setCurrentView, setTaskFilterTeacherId } = useStore();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.users.toArray(),
      db.tasks.toArray()
    ]).then(([u, t]) => {
      setTeachers(u);
      setTasks(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning Staff Directory...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Teacher Directory</h1>
          <p className="text-gray-500 mt-1">Full profile of school staff, roles, and core responsibilities.</p>
        </div>
        <button 
          onClick={() => setStaffModalOpen(true)}
          className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Onboard New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {teachers.map(teacher => {
          const teacherTasks = tasks.filter(t => t.assignedTeacherId === teacher.id);
          const activeTasks = teacherTasks.filter(t => t.status !== 'DONE').length;
          
          return (
            <div key={teacher.id} className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
              <div className="h-24 bg-primary-50 relative">
                <div className="absolute -bottom-8 left-6">
                  <img 
                    src={teacher.avatar} 
                    className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md object-cover" 
                    alt={teacher.name} 
                  />
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setStaffModalOpen(true, teacher)}
                    className="p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-primary-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <div className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-[10px] font-black uppercase text-primary-700 tracking-wider">
                    {teacher.department}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 leading-tight">{teacher.name}</h3>
                    <p className="text-primary-600 text-[10px] font-bold uppercase tracking-widest mt-1">{teacher.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {teacher.phone && (
                      <a href={`tel:${teacher.phone}`} className="text-gray-400 hover:text-primary-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">call</span>
                      </a>
                    )}
                    <a href={`mailto:${teacher.email}`} className="text-gray-400 hover:text-primary-600 transition-colors">
                      <span className="material-symbols-outlined text-xl">mail</span>
                    </a>
                  </div>
                </div>

                {teacher.responsibilities && teacher.responsibilities.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Responsibilities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.responsibilities.map((res, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-medium border border-gray-100">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100/50">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Task Capacity</span>
                      <span className="text-xs font-black text-gray-900">{activeTasks} Active</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ${activeTasks > 4 ? 'bg-orange-500' : 'bg-primary-500'}`} 
                        style={{ width: `${Math.min(activeTasks * 20, 100)}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setTaskFilterTeacherId(teacher.id);
                        setCurrentView('tasks'); 
                      }}
                      className="py-2.5 rounded-xl border border-gray-100 bg-white text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all"
                    >
                      View Tasks
                    </button>
                    <button 
                      onClick={() => setTaskModalOpen(true, undefined, teacher.id)}
                      className="py-2.5 rounded-xl bg-primary-50 text-primary-600 text-xs font-bold hover:bg-primary-100 transition-all"
                    >
                      Assign Work
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div 
          onClick={() => setStaffModalOpen(true)}
          className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-primary-400 transition-all cursor-pointer group bg-gray-50/30"
        >
          <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-12 transition-all duration-300">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <div>
            <p className="font-bold text-lg text-gray-600">Add Staff Member</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[180px]">Expand your department or school team</p>
          </div>
        </div>
      </div>
    </div>
  );
};
