// librarian/manage-books/manage-books.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { Book } from '../../shared/models/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss']
})
export class ManageBooksComponent implements OnInit {
  bookForm: FormGroup;
  books: Book[] = [];
  selectedBook: Book | null = null;
  pdfFile: File | null = null;
  wordFile: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      author: ['', Validators.required],
      publication: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      pdfUrl: [''],
      wordUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.listBooks();
  }

  listBooks(): void {
    this.loading = true;
    this.libraryService.listBooks().subscribe({
      next: (response: any) => {
        this.books = response.data ? response.data : response;
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load books', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      if (type === 'pdf') this.pdfFile = input.files[0];
      if (type === 'word') this.wordFile = input.files[0];
    }
  }

  onSubmit(): void {
    const book: Book = this.bookForm.value;
    const observable = this.selectedBook
      ? this.libraryService.updateBook(book)
      : this.libraryService.addBook(book);

    observable.subscribe({
      next: () => {
        this.snackBar.open('Book saved', 'Close', { duration: 3000 });
        this.bookForm.reset({ id: 0, stock: 0, isActive: true });
        this.selectedBook = null;
        this.listBooks();
      },
      error: (err) => this.snackBar.open(err.error || 'Operation failed', 'Close', { duration: 3000 })
    });
  }

  searchBooks(query: string): void {
    this.loading = true;
    this.libraryService.searchBooks(query).subscribe({
      next: (response: any) => {
        this.books = response.data ? response.data : response;
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load books', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  editBook(book: Book): void {
    this.selectedBook = book;
    this.bookForm.patchValue(book);
  }

  toggleBookStatus(book: Book): void {
    const observable = book.isActive
      ? this.libraryService.deactivateBook(book.id)
            : this.libraryService.activateBook(book.id);

    observable.subscribe({
      next: () => {
        this.snackBar.open(`Book ${book.isActive ? 'deactivated' : 'activated'}`, 'Close', { duration: 3000 });
        this.listBooks();
      },
      error: (err) => {
        this.snackBar.open(`Failed to ${book.isActive ? 'deactivate' : 'activate'} book`, 'Close', { duration: 3000 });
        // Optionally, revert the toggle state on error
        this.listBooks();
      }
    });
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.libraryService.deleteBook(id).subscribe({
        next: () => {
          this.snackBar.open('Book permanently deleted', 'Close', { duration: 3000 });
          this.listBooks();
        },
        error: (err) => this.snackBar.open('Failed to delete book', 'Close', { duration: 3000 })
      });
    }
  }

  openAddBook(): void {
    this.router.navigate(['/librarian/books/add']);
  }
}
