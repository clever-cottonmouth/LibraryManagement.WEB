import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Student, BookIssue, Notification, LibrarySettings } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = 'http://localhost:5000/api'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  /**
   * Adds a new student.
   * @param student Student details
   * @returns Observable with response
   */
  addStudent(student: Student): Observable<any> {
    return this.http.post(`${this.apiUrl}/Librarian/students`, student, this.getAuthHeaders());
  }

  /**
   * Deactivates a student account.
   * @param id Student ID
   * @returns Observable with response
   */
  deactivateStudent(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Librarian/students/${id}/deactivate`, {}, this.getAuthHeaders());
  }

  activateStudents(id:number):Observable<any>{
    return this.http.patch(`${this.apiUrl}/Librarian/students/${id}/activate`, {}, this.getAuthHeaders());
  }

  /**
   * Verifies a student account.
   * @param id Student ID
   * @returns Observable with response
   */
  verifyStudent(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Librarian/students/${id}/verify`, {}, this.getAuthHeaders());
  }

  /**
   * Adds a new book.
   * @param book Book details
   * @returns Observable with response
   */
  addBook(book: Book | FormData): Observable<any> {
    if (book instanceof FormData) {
      // Remove Content-Type so browser sets it for multipart/form-data
      const headers = this.getAuthHeaders().headers;
      const headersWithoutContentType = headers.delete('Content-Type');
      return this.http.post(`${this.apiUrl}/Librarian/books`, book, { headers: headersWithoutContentType });
    }
    return this.http.post(`${this.apiUrl}/Librarian/books`, book, this.getAuthHeaders());
  }

  /**
   * Updates an existing book.
   * @param book Book details or FormData
   * @returns Observable with response
   */
  updateBook(book: Book | FormData): Observable<any> {
    if (book instanceof FormData) {
      // Remove Content-Type so browser sets it for multipart/form-data
      const headers = this.getAuthHeaders().headers;
      const headersWithoutContentType = headers.delete('Content-Type');
      const id = book.get('id');
      return this.http.put(`${this.apiUrl}/Librarian/books/${id}`, book, { headers: headersWithoutContentType });
    }
    // book is a Book object
    return this.http.put(`${this.apiUrl}/Librarian/books/${(book as Book).id}`, book, this.getAuthHeaders());
  }

  /**
   * Deactivates a book.
   * @param id Book ID
   * @returns Observable with response
   */
  deactivateBook(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Librarian/books/${id}/deactivate`, {}, this.getAuthHeaders());
  }

  /**
   * Activates a book.
   * @param id Book ID
   * @returns Observable with response
   */
  activateBook(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Librarian/books/${id}/activate`, {}, this.getAuthHeaders());
  }

  /**
   * Deletes a book.
   * @param id Book ID
   * @returns Observable with response
   */
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Librarian/books/${id}`, this.getAuthHeaders());
  }

  /**
   * Issues a book to a student.
   * @param issue Book issue details
   * @returns Observable with response
   */
  issueBook(issue: BookIssue): Observable<any> {
    return this.http.post(`${this.apiUrl}/Librarian/issue`, issue, this.getAuthHeaders());
  }

  /**
   * Returns a book.
   * @param issueId Book issue ID
   * @returns Observable with response
   */
  returnBook(issueId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Librarian/return/${issueId}`, {}, this.getAuthHeaders());
  }

  /**
   * Searches books by query.
   * @param query Search query
   * @returns Observable with list of books
   */
  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/Librarian/books/search?query=${encodeURIComponent(query)}`, this.getAuthHeaders());
  }

  /**
   * Searches students by query.
   * @param query Search query
   * @returns Observable with list of students
   */
  searchStudents(query: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/Librarian/students/search?query=${encodeURIComponent(query)}`, this.getAuthHeaders());
  }

  /**
   * Gets all issued books.
   * @returns Observable with list of book issues
   */
  getIssuedBooks(): Observable<BookIssue[]> {
    return this.http.get<BookIssue[]>(`${this.apiUrl}/Librarian/issued-books`, this.getAuthHeaders());
  }

  /**
   * Updates library settings.
   * @param settings Library settings
   * @returns Observable with response
   */
  updateSettings(settings: LibrarySettings): Observable<any> {
    return this.http.put(`${this.apiUrl}/Librarian/settings`, settings, this.getAuthHeaders());
  }

  /**
   * Sends a notification to a student.
   * @param studentId Student ID
   * @param message Notification message
   * @returns Observable with response
   */
  sendNotification(studentId: number, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Librarian/notifications/${studentId}`, message, this.getAuthHeaders());
  }

  /**
   * Gets a student's issued books.
   * @returns Observable with list of book issues
   */
  getStudentIssuedBooks(): Observable<BookIssue[]> {
    return this.http.get<BookIssue[]>(`${this.apiUrl}/Student/issued-books`, this.getAuthHeaders());
  }

  /**
   * Updates a student's profile.
   * @param student Student details
   * @returns Observable with response
   */
  updateProfile(student: Student): Observable<any> {
    return this.http.put(`${this.apiUrl}/Student/profile`, student, this.getAuthHeaders());
  }

  /**
   * Replies to a notification.
   * @param id Notification ID
   * @param reply Reply message
   * @returns Observable with response
   */
  replyNotification(id: number, reply: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Student/notifications/reply/${id}`, reply, this.getAuthHeaders());
  }

  /**
   * Downloads a file (PDF or Word).
   * @param url File URL
   * @returns Observable with blob response
   */
  downloadFile(url: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${url}`, { ...this.getAuthHeaders(), responseType: 'blob' });
  }

  /**
   * list all students
   * @returns Observable with list of students
   */
  listStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/Librarian/students/list`, this.getAuthHeaders());
  }

  /**
   * list all books
   * @returns Observable with list of books
   */
  listBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/Librarian/books/list`, this.getAuthHeaders());
  }

  listBooksStudent(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/Student/books/list`, this.getAuthHeaders());
  }

  /**
   * Deletes a student.
   * @param id Student ID
   * @returns Observable with response
   */
  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Librarian/students/${id}`, this.getAuthHeaders());
  }

  /**
   * Gets library settings.
   * @returns Observable with library settings
   */
  getSettings(): Observable<LibrarySettings> {
    return this.http.get<LibrarySettings>(`${this.apiUrl}/Librarian/settings`, this.getAuthHeaders());
  }

  /**
   * Gets a single student by ID.
   * @param id Student ID
   * @returns Observable with student details
   */
  getStudent(id: number): Observable<Student> {
    return this.http.get<any>(`${this.apiUrl}/Librarian/students/${id}`, this.getAuthHeaders())
      .pipe(map(res => res.data));
  }

  /**
   * Gets all notifications for the librarian.
   * @returns Observable with list of notifications
   */
  getNotifications(): Observable<Notification[]> {
    return this.http.get<any>(`${this.apiUrl}/Librarian/notifications`, this.getAuthHeaders())
      .pipe(map(res => res.data || []));
  }

  /**
   * Gets notifications for the currently logged-in student.
   * @returns Observable with list of notifications
   */
  getStudentNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/Student/notifications`, this.getAuthHeaders());
  }

  /**
   * Gets a single book by ID.
   * @param id Book ID
   * @returns Observable with book details
   */
  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/Librarian/books/${id}`, this.getAuthHeaders());
  }
}
