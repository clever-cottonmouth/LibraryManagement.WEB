import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';
import { Notification } from '../../shared/models/notification.model';
import { Student } from '../../shared/models/student.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-librarian-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  students: Student[] = [];
  loading = false;
  editingReplyId: number | null = null;
  replyText: { [id: number]: string } = {};
  selectedStudentId: number | null = null;
  newMessage: string = '';
  sending = false;

  constructor(private libraryService: LibraryService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchNotifications();
    this.fetchStudents();
  }

  fetchNotifications(): void {
    this.loading = true;
    this.libraryService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
        // Initialize replyText for each notification
        notifications.forEach(n => this.replyText[n.id] = n.reply || '');
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  fetchStudents(): void {
    this.libraryService.listStudents().subscribe({
      next: (students) => {
        this.students = students;
      }
    });
  }

  startEditReply(id: number): void {
    this.editingReplyId = id;
  }

  cancelEditReply(): void {
    this.editingReplyId = null;
  }

  sendReply(notificationId: number): void {
    const reply = this.replyText[notificationId]?.trim();
    if (!reply) return;
    this.libraryService.replyNotification(notificationId, reply).subscribe({
      next: () => {
        this.snackBar.open('Reply sent successfully', 'Close', { duration: 3000 });
        this.editingReplyId = null;
        this.fetchNotifications();
      },
      error: () => {
        this.snackBar.open('Failed to send reply', 'Close', { duration: 3000 });
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedStudentId || !this.newMessage.trim()) return;
    this.sending = true;
    this.libraryService.sendNotification(this.selectedStudentId, this.newMessage.trim()).subscribe({
      next: () => {
        this.snackBar.open('Message sent successfully', 'Close', { duration: 3000 });
        this.newMessage = '';
        this.selectedStudentId = null;
        this.sending = false;
        this.fetchNotifications();
      },
      error: () => {
        this.snackBar.open('Failed to send message', 'Close', { duration: 3000 });
        this.sending = false;
      }
    });
  }
}
