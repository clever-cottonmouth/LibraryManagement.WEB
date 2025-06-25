// auth/register/register.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { Login } from '../../shared/models/login.model';

declare var hcaptcha: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {
  registerForm: FormGroup;
  private captchaId: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      captchaToken: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    if (typeof hcaptcha === 'undefined') {
        this.loadCaptchaScript();
    } else {
        this.renderCaptcha();
    }
  }

  loadCaptchaScript(): void {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
          this.renderCaptcha();
      };
      document.head.appendChild(script);
  }

  renderCaptcha(): void {
    this.captchaId = hcaptcha.render('hcaptcha-container', {
      sitekey: '86f0d0ae-445c-4132-a9f2-cf9492729316',
      callback: this.onCaptchaSuccess.bind(this)
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
        error: (err) => {
          this.snackBar.open('Registration failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCaptchaSuccess(token: any) {
    this.registerForm.patchValue({ captchaToken: token });
  }
}
