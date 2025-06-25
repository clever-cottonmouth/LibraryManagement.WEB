import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { Student } from '../../shared/models/student.model';
import { BookIssue } from '../../shared/models/book-issue.model';
import { Book } from '../../shared/models/book.model';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.scss']
})
export class ReturnBookComponent implements OnInit {
  returnForm: FormGroup;
  students: Student[] = [];
  issuedBooks: BookIssue[] = [];
  selectedBook: BookIssue | null = null;
  loading = false;
  books: Book[] = [];

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar
  ) {
    this.returnForm = this.fb.group({
      studentId: [null, Validators.required],
      issueId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchStudents();
    this.fetchBooks();
  }

  fetchStudents(): void {
    this.libraryService.listStudents().subscribe({
      next: (response: any) => {
        this.students = response.data ? response.data : response;
      },
      error: () => this.snackBar.open('Failed to load students', 'Close', { duration: 3000 })
    });
  }

  fetchBooks(): void {
    this.libraryService.listBooks().subscribe({
      next: (response: any) => {
        this.books = response.data ? response.data : response;
      },
      error: () => this.snackBar.open('Failed to load books', 'Close', { duration: 3000 })
    });
  }

  getBookTitle(bookId: number): string {
    const book = this.books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  }

  onStudentChange(): void {
    const studentId = this.returnForm.value.studentId;
    if (!studentId) {
      this.issuedBooks = [];
      this.returnForm.get('issueId')?.reset();
      return;
    }
    this.loading = true;
    this.libraryService.getIssuedBooks().subscribe({
      next: (response: any) => {
        // Filter books issued to the selected student
        const allIssued = response.data ? response.data : response;
        this.issuedBooks = allIssued.filter((issue: BookIssue) => issue.studentId === studentId);
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load issued books', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const issueId = this.returnForm.value.issueId;
    this.libraryService.returnBook(issueId).subscribe({
      next: () => {
        this.snackBar.open('Book returned successfully', 'Close', { duration: 3000 });
        this.returnForm.get('issueId')?.reset();
        this.onStudentChange(); // Refresh issued books
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Failed to return book', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
