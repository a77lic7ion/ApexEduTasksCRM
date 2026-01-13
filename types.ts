
export enum UserRole {
  ADMIN = 'ADMIN',
  HOD = 'HOD',
  TEACHER = 'TEACHER'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TaskStatus {
  TODO = 'TO DO',
  IN_PROGRESS = 'IN PROGRESS',
  AWAITING_REVIEW = 'AWAITING REVIEW',
  DONE = 'DONE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For local login simulation
  phone?: string;
  role: UserRole;
  department?: string;
  avatar: string;
  responsibilities?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'link';
  url: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  assignedTeacherId: string;
  dueDate: number;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number; // 0-100
  notes: TaskComment[];
  attachments: Attachment[];
  lastUpdated: number;
  synced: boolean;
}

export interface AppState {
  currentUser: User | null;
  isOnline: boolean;
  activeTaskId: string | null;
}
