// librarian/manage-books/manage-books.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../shared/services/library.service';
import { Book } from '../../shared/models/book.model';

@Component({
  selector: 'app-manage-books',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Manage Books</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Author</mat-label>
            <input matInput formControlName="author" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Publication</mat-label>
            <input matInput formControlName="publication" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Stock</mat-label>
            <input matInput type="number" formControlName="stock" required>
          </mat-form-field>
          <input type="file" (change)="onFileChange($event, 'pdf')" accept=".pdf">
          <input type="file" (change)="onFileChange($event, 'word')" accept=".doc,.docx">
          <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid">Save</button>
        </form>
        <mat-form-field>
          <mat-label>Search Books</mat-label>
          <input matInput (input)="searchBooks($any($event.target).value)">
        </mat-form-field>
        <table mat-table [dataSource]="books">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let book">{{book.title}}</td>
          </ng-container>
          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let book">{{book.author}}</td>
          </ng-container>
          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef>Stock</th>
            <td mat-cell *matCellDef="let book">{{book.stock}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let book">
              <button mat-icon-button (click)="editBook(book)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button (click)="deactivateBook(book.id)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['title', 'author', 'stock', 'actions']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['title', 'author', 'stock', 'actions']"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 800px; margin: 2em auto; }
    mat-form-field, input[type="file"] { width: 100%; margin-bottom: 1em; }
    table { width: 100%; }
  `]
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
    this.searchBooks('');
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
        this.searchBooks('');
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
