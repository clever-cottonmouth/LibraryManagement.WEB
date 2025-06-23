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
    this.libraryService.getStudentNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
