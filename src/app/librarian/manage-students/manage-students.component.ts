import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {
  students: Student[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  loading = false;

  constructor(
    private libraryService: LibraryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.libraryService.listStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
        this.loading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  searchStudents(query: string): void {
    if (query.trim() === '') {
      this.loadStudents();
      return;
    }

    this.loading = true;
    this.libraryService.searchStudents(query).subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to search students', 'Close', { duration: 3000 });
        this.loading = false;
        console.error('Error searching students:', error);
      }
    });
  }

  verifyStudent(id: number): void {
    this.libraryService.verifyStudent(id).subscribe({
      next: () => {
        this.snackBar.open('Student verified successfully', 'Close', { duration: 3000 });
        this.loadStudents();
      },
      error: (error) => {
        this.snackBar.open('Failed to verify student', 'Close', { duration: 3000 });
        console.error('Error verifying student:', error);
      }
    });
  }

  toggleStudentStatus(student: Student): void {
    const action = student.isActive ? 'deactivate' : 'activate';
    const observable = student.isActive
      ? this.libraryService.deactivateStudent(student.id)
      : this.libraryService.activateStudents(student.id);

    observable.subscribe({
      next: () => {
        this.snackBar.open('Student ' + action + 'd successfully', 'Close', { duration: 3000 });
        this.loadStudents();
      },
      error: (error) => {
        this.snackBar.open('Failed to ' + action + ' student', 'Close', { duration: 3000 });
        console.error('Error ' + action + 'ing student:', error);
      }
    });
  }

  sendNotification(studentId: number): void {
    const message = prompt('Enter notification message:');
    if (message && message.trim()) {
      this.libraryService.sendNotification(studentId, message.trim()).subscribe({
        next: () => {
          this.snackBar.open('Notification sent successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to send notification', 'Close', { duration: 3000 });
          console.error('Error sending notification:', error);
        }
      });
    }
  }

  get activeStudentsCount(): number {
    return this.students.filter(student => student.isActive).length;
  }

  get verifiedStudentsCount(): number {
    return this.students.filter(student => student.isVerified).length;
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.libraryService.deleteStudent(id).subscribe({
        next: () => {
          this.snackBar.open('Student permanently deleted', 'Close', { duration: 3000 });
          this.loadStudents();
        },
        error: (err) => this.snackBar.open('Failed to delete student', 'Close', { duration: 3000 })
      });
    }
  }
}
