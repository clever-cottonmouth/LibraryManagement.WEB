import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';
import { Notification } from '../../shared/models/notification.model';

@Component({
  selector: 'app-student-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class StudentNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;

  constructor(private libraryService: LibraryService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.loading = true;
    const email = localStorage.getItem('email');
    if (!email) {
      this.loading = false;
      // Optionally, handle the missing email case (e.g., show an error)
      return;
    }
    this.libraryService.getStudentNotifications(email).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  sendReply(notification: any, index: number): void {
    // Placeholder: log the reply text
    console.log('Reply for notification', notification.id, ':', notification.replyText);
    // Here you would call a service to send the reply to the backend
  }
}
