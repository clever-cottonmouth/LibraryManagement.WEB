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
        localStorage.setItem('notificationId', notifications[0]?.id?.toString());
        this.notifications = notifications;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  sendReply(notification: any, index: number): void {
    const message = notification.replyText;
    if (!message || !notification.id) {
      console.error('Message or notification ID is missing');
      return;
    }
    this.libraryService.replyNotification(notification.id, message).subscribe({
      next: () => {
        this.notifications[index].reply = message;
        this.notifications[index].replyText = '';
        console.log('Reply sent successfully');
      },
      error: (err) => {
        console.error('Error sending reply:', err);
        // Optionally show a user-friendly error message
      }
    });
  }
}
