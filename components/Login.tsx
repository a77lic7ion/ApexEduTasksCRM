
import React, { useState } from 'react';
import { useStore } from '../store';
import { db } from '../db';
import { User, UserRole, TaskPriority, TaskStatus } from '../types';

export const Login: React.FC = () => {
  const { setCurrentUser } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // For onboarding flow
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form States
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [profile, setProfile] = useState({ name: '', phone: '', department: 'Science', avatar: '' });
  const [firstTask, setFirstTask] = useState({ title: '', description: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await db.users.where('email').equals(credentials.email).first();
      if (user && user.password === credentials.password) {
        setCurrentUser(user);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !isLogin) setStep(2);
    else if (step === 2) setStep(3);
  };

  const onSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = `u-${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        id: userId,
        email: credentials.email,
        password: credentials.password,
        name: profile.name,
        phone: profile.phone,
        department: profile.department,
        avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`,
        role: UserRole.TEACHER,
        responsibilities: []
      };

      await db.users.add(newUser);

      if (firstTask.title) {
        await db.tasks.add({
          id: `t-${Math.random().toString(36).substr(2, 9)}`,
          title: firstTask.title,
          description: firstTask.description,
          assignedTeacherId: userId,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDate: Date.now() + 86400000,
          progress: 0,
          notes: [],
          attachments: [],
          subject: 'General',
          grade: 'General',
          lastUpdated: Date.now(),
          synced: true
        });
      }

      setCurrentUser(newUser);
    } catch (err) {
      setError('Signup failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="bg-primary-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-500/20">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">ApexEduTasks</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 uppercase tracking-widest">School Management CRM</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={onLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
              <input 
                required
                type="email" 
                value={credentials.email}
                onChange={e => setCredentials({...credentials, email: e.target.value})}
                placeholder="ApexEduTasksCRM@admin.co.za"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
              <input 
                required
                type="password" 
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Log In to Console'}
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">
              New to ApexEdu? <button type="button" onClick={() => setIsLogin(false)} className="text-primary-600 font-bold hover:underline">Sign up as Teacher</button>
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={credentials.email}
                    onChange={e => setCredentials({...credentials, email: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
                  <input 
                    required
                    type="password" 
                    value={credentials.password}
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                  />
                </div>
                <button onClick={nextStep} className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black text-sm">Continue to Profile</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-3xl">add_a_photo</span>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-1 rounded-full shadow-md">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </div>
                  </div>
                </div>
                <input 
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium"
                />
                <input 
                  placeholder="Phone Number"
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium"
                />
                <button onClick={nextStep} className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black text-sm">Assign First Task</button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={onSignupComplete} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <p className="text-xs text-gray-500 font-bold uppercase text-center mb-4">Initialize your first task</p>
                <input 
                  placeholder="Task Title (e.g., Lesson Plan Prep)"
                  required
                  value={firstTask.title}
                  onChange={e => setFirstTask({...firstTask, title: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium"
                />
                <textarea 
                  placeholder="Quick Description..."
                  rows={3}
                  value={firstTask.description}
                  onChange={e => setFirstTask({...firstTask, description: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium"
                />
                <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-600/20">Complete Onboarding</button>
              </form>
            )}

            <p className="text-center text-xs text-gray-400 font-medium">
              Already have an account? <button type="button" onClick={() => {setIsLogin(true); setStep(1);}} className="text-primary-600 font-bold hover:underline">Log In</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
