import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';
import { Book } from '../../shared/models/book.model';

@Component({
  selector: 'app-search-books',
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.scss']
})
export class SearchBooksComponent implements OnInit {
  query: string = '';
  allBooks: Book[] = [];
  books: Book[] = [];
  loading = false;
  searched = false;

  constructor(private libraryService: LibraryService) {}

  ngOnInit(): void {
    this.loading = true;
    this.libraryService.listBooksStudent().subscribe({
      next: (response: any) => {
        this.allBooks = response.data ? response.data : response;
        this.books = [...this.allBooks];
        this.loading = false;
        this.searched = false;
      },
      error: () => {
        this.allBooks = [];
        this.books = [];
        this.loading = false;
        this.searched = false;
      }
    });
  }

  searchBooks(): void {
    if (!this.query.trim()) {
      this.books = [...this.allBooks];
      this.searched = true;
      return;
    }
    const q = this.query.trim().toLowerCase();
    this.books = this.allBooks.filter(book =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.publication.toLowerCase().includes(q)
    );
    this.searched = true;
  }
}
