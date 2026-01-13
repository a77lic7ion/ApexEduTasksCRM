
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { db } from '../db';
import { User, UserRole } from '../types';

export const StaffModal: React.FC = () => {
  const { isStaffModalOpen, setStaffModalOpen, teacherToEdit } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Science',
    role: UserRole.TEACHER,
    responsibilities: '',
    avatar: '',
  });

  useEffect(() => {
    if (teacherToEdit) {
      setFormData({
        name: teacherToEdit.name,
        email: teacherToEdit.email,
        phone: teacherToEdit.phone || '',
        department: teacherToEdit.department || 'Science',
        role: teacherToEdit.role,
        responsibilities: teacherToEdit.responsibilities?.join(', ') || '',
        avatar: teacherToEdit.avatar,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Science',
        role: UserRole.TEACHER,
        responsibilities: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substr(2, 5)}`,
      });
    }
  }, [teacherToEdit, isStaffModalOpen]);

  if (!isStaffModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      avatar: formData.avatar,
      responsibilities: formData.responsibilities.split(',').map(r => r.trim()).filter(r => r !== ''),
    };

    try {
      if (teacherToEdit) {
        await db.users.update(teacherToEdit.id, userData);
      } else {
        const newUser: User = {
          id: `u-${Math.random().toString(36).substr(2, 9)}`,
          ...(userData as any),
        };
        await db.users.add(newUser);
      }
      setStaffModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const randomizeAvatar = () => {
    const seed = Math.random().toString(36).substr(2, 5);
    setFormData({ ...formData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{teacherToEdit ? 'Edit Staff Profile' : 'Onboard Staff Member'}</h3>
          <button onClick={() => setStaffModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-6 pb-2">
            <div className="relative">
              <img src={formData.avatar} className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm object-cover" alt="Profile" />
              <button 
                type="button"
                onClick={randomizeAvatar}
                className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-primary-600 hover:text-primary-700 transition-all"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
              </button>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Image URL</label>
              <input 
                type="text" 
                value={formData.avatar}
                onChange={e => setFormData({...formData, avatar: e.target.value})}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-xs font-medium"
              />
              <p className="text-[10px] text-gray-400">Click refresh for a random avatar or paste a URL.</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Prof. John Smith"
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@apex.edu"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Telephone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</label>
              <select 
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold"
              >
                <option>Science</option>
                <option>English</option>
                <option>Math</option>
                <option>Arts</option>
                <option>Administration</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold"
              >
                <option value={UserRole.TEACHER}>Teacher</option>
                <option value={UserRole.HOD}>HOD</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Responsibilities (Comma separated)</label>
            <textarea 
              rows={2}
              value={formData.responsibilities}
              onChange={e => setFormData({...formData, responsibilities: e.target.value})}
              placeholder="e.g., Lab Safety, Debate Coach, 11th Grade Tutor"
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setStaffModalOpen(false)}
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
                  <span className="material-symbols-outlined text-lg">{teacherToEdit ? 'save' : 'person_add'}</span>
                  {teacherToEdit ? 'Update Profile' : 'Add Staff'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
