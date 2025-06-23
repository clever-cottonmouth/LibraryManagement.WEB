import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LibraryService } from '../../shared/services/library.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export class AddBookComponent {
  bookForm: FormGroup;
  loading = false;
  pdfFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publication: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.pdfFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;
    this.loading = true;
    const formData = new FormData();
    formData.append('title', this.bookForm.value.title);
    formData.append('author', this.bookForm.value.author);
    formData.append('publication', this.bookForm.value.publication);
    formData.append('stock', this.bookForm.value.stock);
    if (this.pdfFile) formData.append('pdfFile', this.pdfFile);
    this.libraryService.addBook(formData).subscribe({
      next: () => {
        this.snackBar.open('Book added successfully', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/librarian/books']);
      },
      error: () => {
        this.snackBar.open('Failed to add book', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
