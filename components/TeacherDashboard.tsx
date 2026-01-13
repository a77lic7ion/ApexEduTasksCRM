
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { Task, TaskStatus, User, UserRole } from '../types';
import { useStore } from '../store';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, setActiveTask, setTaskModalOpen, taskFilterTeacherId, setTaskFilterTeacherId, currentView } = useStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const isOverseer = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.HOD;

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await db.users.toArray();
      setTeachers(allUsers);
      
      let taskList;
      if (isOverseer) {
        if (taskFilterTeacherId) {
          taskList = await db.tasks.where('assignedTeacherId').equals(taskFilterTeacherId).toArray();
        } else {
          taskList = await db.tasks.toArray();
        }
      } else {
        taskList = await db.tasks.where('assignedTeacherId').equals(currentUser?.id || '').toArray();
      }
      setTasks(taskList);
      setLoading(false);
    };
    fetchData();
  }, [currentUser, isOverseer, taskFilterTeacherId]);

  if (loading) return <div className="p-8 text-center text-gray-400 font-bold uppercase animate-pulse">Fetching Task Streams...</div>;

  const filteredTeacher = taskFilterTeacherId ? teachers.find(t => t.id === taskFilterTeacherId) : null;

  const completed = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Overview for Teachers */}
      {!isOverseer && currentView === 'dashboard' && (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * completionRate) / 100} className="text-primary-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900">{completionRate}%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complete</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">Welcome back, {currentUser?.name}!</h2>
            <p className="text-gray-500 text-sm max-w-lg">You have successfully completed <span className="text-primary-600 font-bold">{completed} tasks</span> out of <span className="text-gray-900 font-bold">{total}</span> assigned to you. Keep up the momentum!</p>
            <div className="flex gap-4 pt-4">
              <div className="bg-gray-50 px-4 py-2 rounded-xl">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Tasks</p>
                <p className="text-lg font-black text-gray-900">{total - completed}</p>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-xl">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                <p className="text-lg font-black text-gray-900">{currentUser?.department}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Monitor Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900">
              {isOverseer ? (taskFilterTeacherId ? `Tasks for ${filteredTeacher?.name}` : 'Global Task Monitor') : 'My Task Monitor'}
            </h2>
            {taskFilterTeacherId && (
              <button 
                onClick={() => setTaskFilterTeacherId(null)}
                className="text-[10px] font-bold bg-primary-100 text-primary-600 px-2 py-1 rounded-lg hover:bg-primary-200 transition-colors uppercase tracking-widest"
              >
                Clear Filter
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {isOverseer 
              ? (taskFilterTeacherId ? `Focusing on educational workflows assigned to ${filteredTeacher?.name}.` : 'Tracking all teacher progress across departments.') 
              : 'Detailed breakdown of your current workload and upcoming deadlines.'}
          </p>
        </div>
        <div className="flex gap-2">
          {(!isOverseer || isOverseer) && (
            <button 
              onClick={() => setTaskModalOpen(true, undefined, isOverseer ? (taskFilterTeacherId || undefined) : currentUser?.id)}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_task</span>
              {isOverseer ? 'New Assignment' : 'Create Task'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No tasks found</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks
              .sort((a,b) => a.dueDate - b.dueDate)
              .map(task => {
              const teacher = teachers.find(u => u.id === task.assignedTeacherId);
              return (
                <div 
                  key={task.id}
                  onClick={() => setActiveTask(task.id)}
                  className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/5 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${task.priority === 'HIGH' ? 'bg-red-400' : task.priority === 'MEDIUM' ? 'bg-orange-400' : 'bg-green-400'}`} />
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate leading-tight group-hover:text-primary-600 transition-colors">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{task.subject}</span>
                        <span className="text-[10px] text-gray-300">•</span>
                        {isOverseer && (
                          <div className="flex items-center gap-1.5">
                             <img src={teacher?.avatar} className="w-4 h-4 rounded-full border border-gray-100" />
                             <span className="text-[10px] font-bold text-primary-600 uppercase">{teacher?.name}</span>
                          </div>
                        )}
                        {!isOverseer && <span className="text-[10px] font-bold text-gray-400 uppercase">{task.grade}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase mt-0.5 ${
                        task.status === TaskStatus.DONE ? 'text-green-600' : 
                        task.status === TaskStatus.IN_PROGRESS ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Deadline</p>
                      <p className={`text-xs font-bold ${task.dueDate < Date.now() && task.status !== TaskStatus.DONE ? 'text-red-500' : 'text-gray-700'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all">chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
