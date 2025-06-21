// auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { Login } from '../../shared/models/login.model';

@Component({
  selector: 'app-login',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Role</mat-label>
            <mat-select formControlName="role" required>
              <mat-option value="Librarian">Librarian</mat-option>
              <mat-option value="Student">Student</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 400px; margin: 2em auto; padding: 1em; }
    mat-form-field { width: 100%; margin-bottom: 1em; }
    button { width: 100%; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const login: Login = this.loginForm.value;
      const loginObservable = this.loginForm.value.role === 'Librarian'
        ? this.authService.librarianLogin(login)
        : this.authService.studentLogin(login);

      loginObservable.subscribe({
        next: () => {
          const route = this.loginForm.value.role === 'Librarian' ? '/librarian' : '/student';
          this.router.navigate([route]);
        },
        error: (err) => this.snackBar.open(err.error || 'Login failed', 'Close', { duration: 3000 })
      });
    }
  }
}
