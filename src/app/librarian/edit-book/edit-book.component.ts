import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryService } from '../../shared/services/library.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Student, BookIssue } from '../../shared/models';

@Component({
  selector: 'app-edit-book',
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
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  loading = false;
  pdfFile: File | null = null;
  bookId: number | null = null;
  pdfUrl: string | null = null;
  videoFile: File | null = null;
  videoPreview: string | null = null;
  videoUrl: string | null = null;
  issuedStudents: Student[] = [];

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publication: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.loading = true;
      this.libraryService.getBook(this.bookId).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.setBookData(response.data);
          }
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Failed to load book details', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
      // Fetch issued books and students
      this.libraryService.getIssuedBooks().subscribe((issues: BookIssue[]) => {
        const issuedToThisBook = issues.filter(issue => issue.bookId === this.bookId);
        this.libraryService.listStudents().subscribe((students: Student[]) => {
          this.issuedStudents = students.filter(student => issuedToThisBook.some(issue => issue.studentId === student.id));
        });
      });
    }
  }

  setBookData(book: any): void {
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      publication: book.publication,
      stock: book.stock
    });
    this.pdfUrl = book.pdfUrl || null;
    this.videoUrl = book.videoUrl || null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.pdfFile = input.files[0];
    }
  }

  onVideoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
      // Optional: Show video preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoPreview = e.target.result;
      };
      reader.readAsDataURL(this.videoFile);
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid || !this.bookId) return;
    this.loading = true;
    const formData = new FormData();
    formData.append('id', this.bookId.toString());
    formData.append('title', this.bookForm.value.title);
    formData.append('author', this.bookForm.value.author);
    formData.append('publication', this.bookForm.value.publication);
    formData.append('stock', this.bookForm.value.stock);
    if (this.pdfFile) formData.append('pdfFile', this.pdfFile);
    if (this.videoFile) formData.append('videoFile', this.videoFile);
    this.libraryService.updateBook(formData).subscribe({
      next: () => {
        this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/librarian/books']);
      },
      error: () => {
        this.snackBar.open('Failed to update book', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
