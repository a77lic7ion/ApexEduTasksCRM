
import { create } from 'zustand';
import { AppState, User, Task } from './types';

interface StoreActions {
  setCurrentUser: (user: User | null) => void;
  setOnline: (isOnline: boolean) => void;
  setActiveTask: (id: string | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isTaskModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean, task?: Task, preselectedTeacherId?: string) => void;
  isStaffModalOpen: boolean;
  setStaffModalOpen: (isOpen: boolean, teacher?: User) => void;
  taskToEdit: Task | null;
  teacherToEdit: User | null;
  preselectedTeacherId: string | null;
  taskFilterTeacherId: string | null;
  setTaskFilterTeacherId: (id: string | null) => void;
}

export const useStore = create<AppState & StoreActions>((set) => ({
  currentUser: null,
  isOnline: navigator.onLine,
  activeTaskId: null,
  currentView: 'dashboard',
  isTaskModalOpen: false,
  isStaffModalOpen: false,
  taskToEdit: null,
  teacherToEdit: null,
  preselectedTeacherId: null,
  taskFilterTeacherId: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setOnline: (isOnline) => set({ isOnline }),
  setActiveTask: (id) => set({ activeTaskId: id }),
  setCurrentView: (view) => set({ currentView: view }),
  setTaskModalOpen: (isOpen, task = null, teacherId = null) => 
    set({ isTaskModalOpen: isOpen, taskToEdit: task, preselectedTeacherId: teacherId }),
  setStaffModalOpen: (isOpen, teacher = null) => 
    set({ isStaffModalOpen: isOpen, teacherToEdit: teacher }),
  setTaskFilterTeacherId: (id) => set({ taskFilterTeacherId: id }),
}));
