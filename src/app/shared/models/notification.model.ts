import { Student } from './student.model';

export interface Notification {
  id: number;
  studentId: number;
  student: Student;
  message: string;
  reply?: string;
  sentDate: string;
}
