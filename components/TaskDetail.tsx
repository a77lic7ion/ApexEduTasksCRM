
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { Task, TaskStatus } from '../types';
import { useStore } from '../store';

export const TaskDetail: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { currentUser, setActiveTask, setTaskModalOpen } = useStore();
  const [task, setTask] = useState<Task | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    db.tasks.get(taskId).then(setTask);
  }, [taskId]);

  const updateProgress = async (val: number) => {
    if (!task) return;
    const update = { progress: val, lastUpdated: Date.now(), status: val === 100 ? TaskStatus.DONE : TaskStatus.IN_PROGRESS };
    await db.tasks.update(taskId, update);
    setTask({ ...task, ...update });
  };

  const addNote = async () => {
    if (!task || !newNote.trim() || !currentUser) return;
    const note = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      content: newNote,
      createdAt: Date.now()
    };
    const updatedNotes = [...task.notes, note];
    await db.tasks.update(taskId, { notes: updatedNotes, lastUpdated: Date.now() });
    setTask({ ...task, notes: updatedNotes });
    setNewNote('');
  };

  if (!task) return <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Retrieving task data...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTask(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold text-sm transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to List
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setTaskModalOpen(true, task)}
            className="px-6 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{task.subject}</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{task.grade}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4">{task.title}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500">forum</span>
              Journal & Notes
            </h3>
            <div className="space-y-6">
              {task.notes.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-sm text-gray-400 font-medium">No updates logged yet.</p>
                </div>
              ) : (
                task.notes.sort((a,b) => b.createdAt - a.createdAt).map(note => (
                  <div key={note.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">{note.userName}</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border border-gray-100/50">
                        {note.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 border-t border-gray-100 flex gap-4">
              <input 
                type="text" 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addNote()}
                placeholder="Log a progress update..."
                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20"
              />
              <button 
                onClick={addNote}
                className="p-2 bg-primary-500 text-white rounded-xl shadow-md hover:bg-primary-600 transition-all"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <span className="material-symbols-outlined text-primary-500">analytics</span>
              Status & Progress
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completion</span>
                  <span className="text-2xl font-black text-primary-600">{task.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(42,157,144,0.3)]" 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[0, 50, 100].map(val => (
                  <button 
                    key={val}
                    onClick={() => updateProgress(val)}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                      task.progress === val ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-primary-300'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  task.priority === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'
                }`}>{task.priority}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</span>
                <span className="text-xs font-bold text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Attachments</h3>
              <button className="text-xs font-bold text-primary-600 hover:underline">+ Add Link</button>
            </div>
            <div className="space-y-2">
              {task.attachments.length === 0 ? (
                <div className="text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                   <p className="text-xs text-gray-400">No resources linked.</p>
                </div>
              ) : (
                task.attachments.map(att => (
                  <div key={att.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 cursor-pointer group transition-all">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary-500">
                      {att.type === 'pdf' ? 'picture_as_pdf' : att.type === 'link' ? 'link' : 'image'}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate">{att.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
