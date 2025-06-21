// librarian/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';

@Component({
  selector: 'app-librarian-dashboard',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Librarian Dashboard</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" routerLink="/librarian/students">Manage Students</button>
        <button mat-raised-button color="primary" routerLink="/librarian/books">Manage Books</button>
        <button mat-raised-button color="primary" routerLink="/librarian/issue">Issue Book</button>
        <button mat-raised-button color="primary" routerLink="/librarian/return">Return Book</button>
        <button mat-raised-button color="primary" routerLink="/librarian/settings">Settings</button>
        <button mat-raised-button color="primary" routerLink="/librarian/notifications">Notifications</button>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 600px; margin: 2em auto; }
    button { margin: 1em; }
  `]
})
export class LibrarianDashboardComponent { }
