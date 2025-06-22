import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { AuthService } from '../../shared/services/auth.service';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loadingProfile = false;
  loadingPassword = false;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // Optionally, fetch current student info from backend or localStorage
    // For now, just leave blank for editing
    // You can enhance this to prefill with actual data if available
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.loadingProfile = true;
    const student: Student = {
      ...this.profileForm.value,
      id: 0, // Backend should get ID from token
      isActive: true,
      isVerified: true
    };
    this.libraryService.updateProfile(student).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.loadingProfile = false;
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Failed to update profile', 'Close', { duration: 3000 });
        this.loadingProfile = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loadingPassword = true;
    const { oldPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => {
        this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
        this.passwordForm.reset();
        this.loadingPassword = false;
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Failed to change password', 'Close', { duration: 3000 });
        this.loadingPassword = false;
      }
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }
}
