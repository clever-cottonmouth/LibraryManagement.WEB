import { Component } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';
import { Book } from '../../shared/models/book.model';

@Component({
  selector: 'app-search-books',
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.scss']
})
export class SearchBooksComponent {
  query: string = '';
  books: Book[] = [];
  loading = false;
  searched = false;

  constructor(private libraryService: LibraryService) {}

  searchBooks(): void {
    if (!this.query.trim()) {
      this.books = [];
      this.searched = true;
      return;
    }
    this.loading = true;
    this.libraryService.searchBooks(this.query).subscribe({
      next: (response: any) => {
        this.books = response.data ? response.data : response;
        this.loading = false;
        this.searched = true;
      },
      error: () => {
        this.books = [];
        this.loading = false;
        this.searched = true;
      }
    });
  }
}
