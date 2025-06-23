import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
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
import { AddBookComponent } from './librarian/add-book/add-book.component';
import { EditBookComponent } from './librarian/edit-book/edit-book.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'librarian',
    canActivate: [AuthGuard],
    data: { role: 'Librarian' },
    children: [
      { path: 'dashboard', component: LibrarianDashboardComponent },
      { path: 'students', component: ManageStudentsComponent },
      { path: 'students/add', component: AddStudentComponent },
      { path: 'books', component: ManageBooksComponent },
      { path: 'books/add', component: AddBookComponent },
      { path: 'books/:id/edit', component: EditBookComponent },
      { path: 'issue', component: IssueBookComponent },
      { path: 'return', component: ReturnBookComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'settings/:studentId', component: SettingsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { role: 'Student' },
    children: [
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'search', component: SearchBooksComponent },
      { path: 'issued', component: IssuedBooksComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: StudentNotificationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
