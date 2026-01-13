
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { Task, User, TaskStatus, TaskPriority } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.tasks.toArray(),
      db.users.toArray()
    ]).then(([t, u]) => {
      setTasks(t);
      setTeachers(u);
      setLoading(false);
    });
  }, []);

  const overdueTasks = tasks.filter(t => t.dueDate < Date.now() && t.status !== TaskStatus.DONE);
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE);

  const statusData = [
    { name: 'Pending', value: pendingTasks.length, color: '#9ca3af' },
    { name: 'In Progress', value: inProgressTasks.length, color: '#3b82f6' },
    { name: 'Done', value: completedTasks.length, color: '#10b981' },
    { name: 'Overdue', value: overdueTasks.length, color: '#ef4444' },
  ];

  const workloadData = teachers.filter(u => u.role === 'TEACHER').map(t => ({
    name: t.name.split(' ')[0],
    count: tasks.filter(task => task.assignedTeacherId === t.id && task.status !== TaskStatus.DONE).length
  }));

  if (loading) return <div className="p-8">Loading analytics...</div>;

  const quickStats = [
    { label: 'Pending', count: pendingTasks.length, icon: 'hourglass_empty', color: 'text-gray-500', bg: 'bg-gray-100' },
    { label: 'In Progress', count: inProgressTasks.length, icon: 'sync', color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Overdue', count: overdueTasks.length, icon: 'warning', color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Completed', count: completedTasks.length, icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">donut_large</span>
            Task Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-gray-500 uppercase">{item.name}</span>
                <span className="ml-auto text-xs font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">bar_chart</span>
            Live Teacher Workload (Active Tasks)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#2a9d90" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">priority_high</span>
            Critical Oversight: Overdue & High Priority
          </h3>
          <button className="text-xs font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">Generate Compliance Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase">Assigned Teacher</th>
                <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase">Task Title</th>
                <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase text-right">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks
                .filter(t => t.priority === TaskPriority.HIGH || t.dueDate < Date.now())
                .sort((a, b) => a.dueDate - b.dueDate)
                .slice(0, 8)
                .map(task => {
                const teacher = teachers.find(u => u.id === task.assignedTeacherId);
                const isOverdue = task.dueDate < Date.now() && task.status !== TaskStatus.DONE;
                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={teacher?.avatar} className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100" alt="" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{teacher?.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{teacher?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-semibold text-gray-800 leading-none">{task.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">{task.subject} • {task.grade}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isOverdue ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {isOverdue ? 'Overdue' : task.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-gray-600'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {tasks.length === 0 && <div className="py-12 text-center text-gray-400 font-medium">No critical tasks found.</div>}
        </div>
      </div>
    </div>
  );
};
