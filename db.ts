
import { Dexie, type Table } from 'dexie';
import { Task, User } from './types';

// ApexEduDB inherits from Dexie to provide a strongly-typed database instance.
// Using the named import for Dexie ensures that the class definition is correctly 
// recognized by the TypeScript compiler, including inherited methods like version().
export class ApexEduDB extends Dexie {
  tasks!: Table<Task>;
  users!: Table<User>;

  constructor() {
    super('ApexEduDB');
    // Define the database schema and indexes.
    // Fixed: Using named import for Dexie resolves "Property 'version' does not exist on type 'ApexEduDB'".
    this.version(1).stores({
      tasks: 'id, assignedTeacherId, status, dueDate, subject, synced',
      users: 'id, role, department'
    });
  }
}

export const db = new ApexEduDB();
