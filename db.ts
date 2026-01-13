
import { Dexie, type Table } from 'dexie';
import { Task, User } from './types';

export class ApexEduDB extends Dexie {
  tasks!: Table<Task>;
  users!: Table<User>;

  constructor() {
    super('ApexEduDB');
    this.version(2).stores({
      tasks: 'id, assignedTeacherId, status, dueDate, subject, synced',
      users: 'id, role, department, email'
    });
  }
}

export const db = new ApexEduDB();
