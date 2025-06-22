import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { Student } from '../../shared/models/student.model';
import { Book } from '../../shared/models/book.model';
// import { BookIssue } from '../../shared/models/book-issue.model';

interface BookIssueRequest {
  studentId: number;
  bookId: number;
  issueDate: string;
  dueDate?: string;
}

@Component({
  selector: 'app-issue-book',
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.scss']
})
export class IssueBookComponent implements OnInit {
  issueForm: FormGroup;
  students: Student[] = [];
  books: Book[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar
  ) {
    this.issueForm = this.fb.group({
      studentId: [null, Validators.required],
      bookId: [null, Validators.required],
      issueDate: [new Date().toISOString().substring(0, 10), Validators.required],
      dueDate: ['']
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

  onSubmit(): void {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const issue: BookIssueRequest = {
      studentId: this.issueForm.value.studentId,
      bookId: this.issueForm.value.bookId,
      issueDate: this.issueForm.value.issueDate,
      dueDate: this.issueForm.value.dueDate
    };
    this.libraryService.issueBook(issue as any).subscribe({
      next: () => {
        this.snackBar.open('Book issued successfully', 'Close', { duration: 3000 });
        this.issueForm.reset({
          issueDate: new Date().toISOString().substring(0, 10),
          dueDate: ''
        });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Failed to issue book', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
