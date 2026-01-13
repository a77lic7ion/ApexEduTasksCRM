
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { Task, TaskStatus, User, UserRole } from '../types';
import { useStore } from '../store';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, setActiveTask, setTaskModalOpen, taskFilterTeacherId, setTaskFilterTeacherId } = useStore();
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

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900">
              {isOverseer ? (taskFilterTeacherId ? `Tasks for ${filteredTeacher?.name}` : 'Global Task Monitor') : 'My Active Tasks'}
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
              : 'Managing your current educational workflows.'}
          </p>
        </div>
        <div className="flex gap-2">
          {isOverseer && (
            <button 
              onClick={() => setTaskModalOpen(true, undefined, taskFilterTeacherId || undefined)}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_task</span>
              New Assignment
            </button>
          )}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400 text-sm">filter_list</span>
            <select className="bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer">
              <option>All Departments</option>
              <option>Science</option>
              <option>English</option>
              <option>Math</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300">task_alt</span>
            <p className="mt-2 text-gray-500 font-medium">No tasks found matching your filters.</p>
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
                  className="bg-white p-4 rounded-xl border border-gray-100 hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/5 cursor-pointer transition-all flex items-center justify-between group"
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
