// librarian/manage-books/manage-books.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { Book } from '../../shared/models/book.model';

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

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar
  ) {
    this.bookForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      author: ['', Validators.required],
      publication: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      pdfUrl: [''],
      wordUrl: ['']
    });
  }

  ngOnInit(): void {
    // this.searchBooks('');
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
        this.bookForm.reset({ id: 0, stock: 0 });
        this.selectedBook = null;
        // this.searchBooks('');
      },
      error: (err) => this.snackBar.open(err.error || 'Operation failed', 'Close', { duration: 3000 })
    });
  }

  searchBooks(query: string): void {
    this.libraryService.searchBooks(query).subscribe({
      next: (books) => this.books = books,
      error: (err) => this.snackBar.open('Failed to load books', 'Close', { duration: 3000 })
    });
  }

  editBook(book: Book): void {
    this.selectedBook = book;
    this.bookForm.patchValue(book);
  }

  deactivateBook(id: number): void {
    this.libraryService.deactivateBook(id).subscribe({
      next: () => {
        this.snackBar.open('Book deactivated', 'Close', { duration: 3000 });
        this.searchBooks('');
      },
      error: (err) => this.snackBar.open('Failed to deactivate book', 'Close', { duration: 3000 })
    });
  }
}
