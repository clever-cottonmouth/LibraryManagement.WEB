import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Student, BookIssue, Notification, LibrarySettings } from '../models';

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
    return this.http.put(`${this.apiUrl}/Librarian/students/${id}/deactivate`, {}, this.getAuthHeaders());
  }

  /**
   * Verifies a student account.
   * @param id Student ID
   * @returns Observable with response
   */
  verifyStudent(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Librarian/students/${id}/verify`, {}, this.getAuthHeaders());
  }

  /**
   * Adds a new book.
   * @param book Book details
   * @returns Observable with response
   */
  addBook(book: Book): Observable<any> {
    return this.http.post(`${this.apiUrl}/Librarian/books`, book, this.getAuthHeaders());
  }

  /**
   * Updates an existing book.
   * @param book Book details
   * @returns Observable with response
   */
  updateBook(book: Book): Observable<any> {
    return this.http.put(`${this.apiUrl}/Librarian/books`, book, this.getAuthHeaders());
  }

  /**
   * Deactivates a book.
   * @param id Book ID
   * @returns Observable with response
   */
  deactivateBook(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Librarian/books/${id}/deactivate`, {}, this.getAuthHeaders());
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
}
