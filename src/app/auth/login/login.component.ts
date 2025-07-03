// auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { Login } from '../../shared/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['Librarian', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const login: Login = this.loginForm.value;
      const loginObservable = this.loginForm.value.role === 'Librarian'
        ? this.authService.librarianLogin(login)
        : this.authService.studentLogin(login);

      loginObservable.subscribe({
        next: () => {
          const route = this.loginForm.value.role === 'Librarian' ? '/librarian' : '/student';
          this.router.navigate([route]);
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.open(err.error.message || 'Login failed', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
