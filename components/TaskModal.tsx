
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { db } from '../db';
import { Task, TaskPriority, TaskStatus, User } from '../types';

export const TaskModal: React.FC = () => {
  const { isTaskModalOpen, setTaskModalOpen, taskToEdit, preselectedTeacherId } = useStore();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    assignedTeacherId: '',
    priority: TaskPriority.MEDIUM,
    dueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    db.users.filter(u => u.role === 'TEACHER').toArray().then(setTeachers);
    
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        subject: taskToEdit.subject,
        grade: taskToEdit.grade,
        assignedTeacherId: taskToEdit.assignedTeacherId,
        priority: taskToEdit.priority,
        dueDate: new Date(taskToEdit.dueDate).toISOString().split('T')[0],
      });
    } else if (preselectedTeacherId) {
      setFormData(prev => ({ ...prev, assignedTeacherId: preselectedTeacherId }));
    } else {
      setFormData({
        title: '',
        description: '',
        subject: '',
        grade: '',
        assignedTeacherId: '',
        priority: TaskPriority.MEDIUM,
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [taskToEdit, preselectedTeacherId, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const taskData: Partial<Task> = {
      ...formData,
      dueDate: new Date(formData.dueDate).getTime(),
      lastUpdated: Date.now(),
      synced: true,
      progress: taskToEdit?.progress || 0,
      status: taskToEdit?.status || TaskStatus.TODO,
      notes: taskToEdit?.notes || [],
      attachments: taskToEdit?.attachments || [],
    };

    try {
      if (taskToEdit) {
        await db.tasks.update(taskToEdit.id, taskData);
      } else {
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          ...taskData as any,
        };
        await db.tasks.add(newTask);
      }
      setTaskModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      // Force refresh data in parent by standard state patterns if needed, 
      // though Dexie is live-ish in many architectures. 
      // For this simple app, state update or window reload is fine.
      window.location.reload(); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{taskToEdit ? 'Edit Task' : 'Assign New Task'}</h3>
          <button onClick={() => setTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Weekly Syllabus Prep"
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="Physics, History..."
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade / Level</label>
              <input 
                type="text" 
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                placeholder="10th, AP..."
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assign to Teacher</label>
            <select 
              required
              value={formData.assignedTeacherId}
              onChange={e => setFormData({...formData, assignedTeacherId: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold text-gray-700"
            >
              <option value="">Select a staff member</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</label>
              <input 
                type="date" 
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setTaskModalOpen(false)}
              className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] py-3.5 rounded-2xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">{taskToEdit ? 'edit' : 'send'}</span>
                  {taskToEdit ? 'Update Task' : 'Assign Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
