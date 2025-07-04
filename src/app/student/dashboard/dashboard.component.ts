import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';
import { AuthService } from '../../shared/services/auth.service';
import { BookIssue } from '../../shared/models/book-issue.model';
import { Notification } from '../../shared/models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  studentName: string = '';
  issuedBooks: BookIssue[] = [];
  overdueBooks: BookIssue[] = [];
  notifications: Notification[] = [];
  unreadNotifications: number = 0;
  loading = false;
  isVerified: boolean | null = null;
  isActive: boolean | null = null;

  constructor(
    private libraryService: LibraryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentName = this.authService.getCurrentUser() || 'Student';
    this.fetchIssuedBooks();
    this.fetchNotifications();
    const email = localStorage.getItem('email');
    if (email) {
      this.libraryService.isStudentVerified(email).subscribe({
        next: (res) => {
          const result: any = res;
          this.isVerified = result.IsVerified ?? result.isVerified ?? null;
          this.isActive = result.isActive ?? result.isActive ?? null;
        },
        error: () => {
          this.isVerified = null;
        }
      });
    }
  }

  fetchIssuedBooks(): void {
    this.loading = true;
    const email = localStorage.getItem('email');
    if (!email) {
      this.loading = false;
      return;
    }
    this.libraryService.getStudentIssuedBooks(email).subscribe({
      next: (response: any) => {
        const today = new Date();
        const issues = response.data ? response.data : response;
        this.issuedBooks = issues;
        this.overdueBooks = issues.filter((issue: BookIssue) => new Date(issue.dueDate) < today);
        localStorage.setItem('name',response[0]?.student?.name)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // fetchNotifications(): void {
  //   // Assume notifications are fetched from LibraryService or a similar service
  //   // For now, set to empty or mock
  //   // this.libraryService.getStudentNotifications().subscribe(...)
  //   // For demo:
  //   this.notifications = [];
  //   this.unreadNotifications = 0;
  // }

  fetchNotifications(): void {
    this.loading = true;
    const email = localStorage.getItem('email');
    if (!email) {
      this.loading = false;
      return;
    }
    this.libraryService.getStudentNotifications(email).subscribe({
      next: (notifications) => {
        localStorage.setItem('notificationId', notifications[0]?.id?.toString());
        this.notifications = notifications;
        if(notifications[0]?.reply==null){
          this.unreadNotifications = 1;
        }
        this.loading = false;
        localStorage.setItem('name',notifications[0]?.student?.name)
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }


  goToSearchBooks() {
    this.router.navigate(['/student/search-books']);
  }
}
