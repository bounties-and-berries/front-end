import { User, Student, Faculty, Admin, Event, Reward, Achievement, Badge, PointTransaction, Notification } from '@/types';

export const mockUsers: (Student | Faculty | Admin)[] = [
  {
    id: '1',
    email: 'student@demo.com',
    name: 'Alice Johnson',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    totalPoints: 2450,
    achievements: [],
    badges: [],
    createdAt: '2024-01-15',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    id: '2',
    email: 'faculty@demo.com',
    name: 'Dr. Robert Smith',
    role: 'faculty',
    department: 'Computer Science',
    subject: 'Data Structures',
    qrCode: 'FAC_12345',
    createdAt: '2024-01-10',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    id: '3',
    email: 'admin@demo.com',
    name: 'Sarah Wilson',
    role: 'admin',
    collegeName: 'Tech University',
    permissions: ['user_management', 'points_management', 'events_management'],
    createdAt: '2024-01-05',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Hackathon 2024',
    description: 'Annual coding competition with exciting prizes',
    category: 'academic',
    date: '2024-03-15',
    location: 'Main Auditorium',
    points: 500,
    registrationDeadline: '2024-03-10',
    maxParticipants: 100,
    currentParticipants: 75,
    createdBy: '2',
    image: 'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'Cultural Fest',
    description: 'Showcase your talents in music, dance, and art',
    category: 'cultural',
    date: '2024-03-20',
    location: 'Campus Ground',
    points: 300,
    registrationDeadline: '2024-03-18',
    maxParticipants: 200,
    currentParticipants: 120,
    createdBy: '2',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'Beach Cleanup Drive',
    description: 'Environmental volunteering activity',
    category: 'volunteer',
    date: '2024-03-25',
    location: 'City Beach',
    points: 200,
    registrationDeadline: '2024-03-23',
    maxParticipants: 50,
    currentParticipants: 30,
    createdBy: '2',
    image: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Free Lunch Coupon',
    description: 'Redeem for a free meal at the campus cafeteria',
    category: 'food',
    pointsCost: 100,
    availability: 50,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'College T-Shirt',
    description: 'Official college merchandise',
    category: 'merchandise',
    pointsCost: 250,
    availability: 25,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: '10% Fee Discount',
    description: 'Discount on next semester fees',
    category: 'fee',
    pointsCost: 1000,
    availability: 10,
    image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    title: 'Book Store Voucher',
    description: '$20 voucher for the campus bookstore',
    category: 'discount',
    pointsCost: 400,
    availability: 15,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Perfect Attendance',
    description: 'Attended all classes for a month',
    points: 100,
    category: 'attendance',
    date: '2024-02-15',
    status: 'approved',
    approvedBy: '2',
  },
  {
    id: '2',
    title: 'Hackathon Winner',
    description: 'First place in coding competition',
    points: 500,
    category: 'academic',
    date: '2024-02-20',
    status: 'pending',
    proofUrl: 'certificate.pdf',
  },
  {
    id: '3',
    title: 'Community Service',
    description: 'Volunteered at local shelter',
    points: 200,
    category: 'volunteer',
    date: '2024-02-25',
    status: 'approved',
    approvedBy: '2',
  },
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Early Bird',
    description: 'Never missed morning classes',
    icon: 'sunrise',
    earnedAt: '2024-02-10',
    category: 'attendance',
  },
  {
    id: '2',
    name: 'Code Master',
    description: 'Won 3 coding competitions',
    icon: 'code',
    earnedAt: '2024-02-15',
    category: 'academic',
  },
  {
    id: '3',
    name: 'Helper',
    description: 'Completed 10 volunteer activities',
    icon: 'heart',
    earnedAt: '2024-02-20',
    category: 'volunteer',
  },
];

export const mockTransactions: PointTransaction[] = [
  {
    id: '1',
    studentId: '1',
    points: 100,
    type: 'earned',
    description: 'Perfect Attendance Award',
    date: '2024-02-15',
    category: 'attendance',
  },
  {
    id: '2',
    studentId: '1',
    points: -100,
    type: 'spent',
    description: 'Free Lunch Coupon',
    date: '2024-02-20',
    rewardId: '1',
  },
  {
    id: '3',
    studentId: '1',
    points: 300,
    type: 'earned',
    description: 'Cultural Event Participation',
    date: '2024-02-25',
    category: 'cultural',
    eventId: '2',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Points Approved!',
    message: 'Your hackathon participation points have been approved',
    type: 'success',
    read: false,
    date: '2024-02-28',
  },
  {
    id: '2',
    userId: '1',
    title: 'New Event Available',
    message: 'Beach Cleanup Drive registration is now open',
    type: 'info',
    read: false,
    date: '2024-02-27',
  },
  {
    id: '3',
    userId: '2',
    title: 'Pending Approvals',
    message: 'You have 5 point requests waiting for approval',
    type: 'warning',
    read: true,
    date: '2024-02-26',
  },
];