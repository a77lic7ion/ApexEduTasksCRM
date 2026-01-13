
import { db } from './db';
import { UserRole, TaskPriority, TaskStatus } from './types';

export const seedDatabase = async () => {
  const usersCount = await db.users.count();
  if (usersCount > 0) return;

  const users = [
    {
      id: 'u1',
      name: 'Vaughan Blignaut',
      email: 'ApexEduTasksCRM@admin.co.za',
      password: 'Ap3xEduTasksCRM',
      phone: '+1 (555) 123-4567',
      role: UserRole.ADMIN,
      department: 'Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vaughan',
      responsibilities: ['School Strategy', 'Budget Oversight', 'Staff Hiring']
    },
    {
      id: 'u2',
      name: 'James Wilson',
      email: 'james@apex.edu',
      password: 'password',
      phone: '+1 (555) 234-5678',
      role: UserRole.HOD,
      department: 'Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      responsibilities: ['Curriculum Design', 'Lab Safety', 'Department Mentorship']
    }
  ];

  await db.users.bulkAdd(users);
};
