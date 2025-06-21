// auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { Login } from '../../shared/models/login.model';

@Component({
  selector: 'app-register',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Register</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">Register</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 400px; margin: 2em auto; padding: 1em; }
    mat-form-field, re-captcha { width: 100%; margin-bottom: 1em; }
    button { width: 100%; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const login: Login = this.registerForm.value;
      this.authService.register(login).subscribe({
        next: () => {
          this.snackBar.open('Registration successful. Awaiting verification.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => this.snackBar.open(err.error || 'Registration failed', 'Close', { duration: 3000 })
      });
    }
  }
}
