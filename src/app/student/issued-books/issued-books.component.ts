import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../shared/services/library.service';
import { AuthService } from '../../shared/services/auth.service';
import { BookIssue } from '../../shared/models/book-issue.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issued-books',
  templateUrl: './issued-books.component.html',
  styleUrls: ['./issued-books.component.scss']
})
export class IssuedBooksComponent implements OnInit {
  issuedBooks: BookIssue[] = [];
  loading = false;
  isVerified: boolean | null = null;
  isActive: boolean | null = null;

  constructor(
    private libraryService: LibraryService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchIssuedBooks();
    const email = localStorage.getItem('email');
    if (email) {
      this.libraryService.isStudentVerified(email).subscribe({
        next: (res) => {
          const result: any = res;
          this.isVerified = result.IsVerified ?? result.isVerified ?? null;
          this.isActive = result.isActive ?? result.isActive ?? null;
        },
        error: () => {
          this.isVerified = null;
        }
      });
    }
  }

  fetchIssuedBooks(): void {
    this.loading = true;
    const email = localStorage.getItem('email');

    if (!email) {
      this.snackBar.open('User not authenticated', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    this.libraryService.getStudentIssuedBooks(email).subscribe({
      next: (response: any) => {
        this.issuedBooks = response.data ? response.data : response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error?.error?.message || 'Failed to fetch issued books';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  }
}
