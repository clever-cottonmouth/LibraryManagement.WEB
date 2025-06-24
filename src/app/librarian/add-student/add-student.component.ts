import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LibraryService } from '../../shared/services/library.service';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  studentForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.loading = true;
      const student: Student = {
        id: 0, // Will be assigned by the backend
        name: this.studentForm.value.name,
        email: this.studentForm.value.email,
        isActive: true,
        isVerified: false
      };

      this.libraryService.addStudent(student).subscribe({
        next: (response) => {
          if (response && response.success === false) {
            this.snackBar.open(response.message || 'Failed to add student', 'Close', { duration: 3000 });
            this.loading = false;
            return;
          }
          this.snackBar.open('Student added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/librarian/students']);
        },
        error: (error) => {
          let errorMsg = 'Failed to add student';
          if (error?.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (typeof error.error === 'object' && error.error.message) {
              errorMsg = error.error.message;
            }
          }
          this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
          this.loading = false;
          console.error('Error adding student:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/librarian/students']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.studentForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}