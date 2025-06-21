// auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { Login } from '../../shared/models/login.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
