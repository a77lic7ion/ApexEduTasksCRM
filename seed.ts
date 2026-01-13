
import { db } from './db';
import { UserRole, TaskPriority, TaskStatus } from './types';

export const seedDatabase = async () => {
  const usersCount = await db.users.count();
  if (usersCount > 0) return;

  const users = [
    {
      id: 'u1',
      name: 'Sarah Mitchell',
      email: 'sarah@apex.edu',
      phone: '+1 (555) 123-4567',
      role: UserRole.ADMIN,
      department: 'Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      responsibilities: ['School Strategy', 'Budget Oversight', 'Staff Hiring']
    },
    {
      id: 'u2',
      name: 'James Wilson',
      email: 'james@apex.edu',
      phone: '+1 (555) 234-5678',
      role: UserRole.HOD,
      department: 'Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      responsibilities: ['Curriculum Design', 'Lab Safety', 'Department Mentorship']
    },
    {
      id: 'u3',
      name: 'David Chen',
      email: 'david@apex.edu',
      phone: '+1 (555) 345-6789',
      role: UserRole.TEACHER,
      department: 'Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      responsibilities: ['Physics Lab Management', 'Robotics Club Lead', '11th Grade Tutor']
    },
    {
      id: 'u4',
      name: 'Elena Rodriguez',
      email: 'elena@apex.edu',
      phone: '+1 (555) 456-7890',
      role: UserRole.TEACHER,
      department: 'English',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      responsibilities: ['Yearbook Editor', 'Creative Writing Workshop', 'Debate Coach']
    },
    {
      id: 'u5',
      name: 'Marcus Thorne',
      email: 'marcus@apex.edu',
      phone: '+1 (555) 567-8901',
      role: UserRole.TEACHER,
      department: 'Mathematics',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      responsibilities: ['Math Olympiad Training', 'Calculus Lead', 'Data Analysis Support']
    }
  ];

  const tasks = [
    {
      id: 't1',
      title: 'Prepare Physics Lab: Optics',
      description: 'Set up lenses and lasers for the 11th grade afternoon session.',
      subject: 'Physics',
      grade: '11th Grade',
      assignedTeacherId: 'u3',
      dueDate: Date.now() + 86400000,
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      progress: 45,
      notes: [
        { id: 'c1', userId: 'u3', userName: 'David Chen', content: 'Checking inventory for lasers.', createdAt: Date.now() - 3600000 }
      ],
      attachments: [{ id: 'a1', name: 'Optics_Guide.pdf', type: 'pdf', url: '#' }],
      lastUpdated: Date.now(),
      synced: true
    },
    {
      id: 't2',
      title: 'Grade Creative Writing Essays',
      description: 'Review the 500-word essays from 10B.',
      subject: 'English',
      grade: '10th Grade',
      assignedTeacherId: 'u4',
      dueDate: Date.now() - 86400000,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      progress: 0,
      notes: [],
      attachments: [],
      lastUpdated: Date.now() - 500000000,
      synced: true
    },
    {
      id: 't3',
      title: 'Math Olympiad Registration',
      description: 'Finalize student list and register for the national qualifiers.',
      subject: 'Math',
      grade: '9th-12th Grade',
      assignedTeacherId: 'u5',
      dueDate: Date.now() + 172800000,
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      progress: 70,
      notes: [],
      attachments: [],
      lastUpdated: Date.now(),
      synced: true
    },
    {
      id: 't4',
      title: 'Quarterly Curriculum Review',
      description: 'Review English literature selection for next term.',
      subject: 'English',
      grade: 'All Grades',
      assignedTeacherId: 'u4',
      dueDate: Date.now() + 604800000,
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      progress: 0,
      notes: [],
      attachments: [],
      lastUpdated: Date.now(),
      synced: true
    }
  ];

  await db.users.bulkAdd(users);
  // @ts-ignore
  await db.tasks.bulkAdd(tasks);
};
