import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LibrarianDashboardComponent } from './librarian/dashboard/dashboard.component';
import { ManageStudentsComponent } from './librarian/manage-students/manage-students.component';
import { AddStudentComponent } from './librarian/add-student/add-student.component';
import { ManageBooksComponent } from './librarian/manage-books/manage-books.component';
import { IssueBookComponent } from './librarian/issue-book/issue-book.component';
import { ReturnBookComponent } from './librarian/return-book/return-book.component';
import { SettingsComponent } from './librarian/settings/settings.component';
import { NotificationsComponent } from './librarian/notifications/notifications.component';
import { StudentDashboardComponent } from './student/dashboard/dashboard.component';
import { SearchBooksComponent } from './student/search-books/search-books.component';
import { IssuedBooksComponent } from './student/issued-books/issued-books.component';
import { ProfileComponent } from './student/profile/profile.component';
import { StudentNotificationsComponent } from './student/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LibrarianDashboardComponent,
    ManageStudentsComponent,
    AddStudentComponent,
    ManageBooksComponent,
    IssueBookComponent,
    ReturnBookComponent,
    SettingsComponent,
    NotificationsComponent,
    StudentDashboardComponent,
    SearchBooksComponent,
    IssuedBooksComponent,
    ProfileComponent,
    StudentNotificationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
    RouterModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
