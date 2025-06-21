import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:5001/api'; // Replace with your API URL
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on initialization
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.currentUserSubject.next(this.jwtHelper.decodeToken(token).sub);
    }
  }

  /**
   * Logs in a librarian and stores the JWT token.
   * @param login Credentials for login
   * @returns Observable with token response
   */
  librarianLogin(login: Login): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/Librarian/login`, login)
      .pipe(
        tap(response => this.setSession(response.token, 'Librarian'))
      );
  }

  /**
   * Logs in a student and stores the JWT token.
   * @param login Credentials for login
   * @returns Observable with token response
   */
  studentLogin(login: Login): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/Student/login`, login)
      .pipe(
        tap(response => this.setSession(response.token, 'Student'))
      );
  }

  /**
   * Registers a new student with CAPTCHA.
   * @param login Registration details
   * @returns Observable with registration response
   */
  register(login: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/Student/register`, login);
  }

  /**
   * Requests a password reset email.
   * @param email Student's email
   * @returns Observable with response
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Student/forgot-password`, email);
  }

  /**
   * Resets a student's password.
   * @param reset Password reset details
   * @returns Observable with response
   */
  resetPassword(reset: ResetPassword): Observable<any> {
    return this.http.post(`${this.apiUrl}/Student/reset-password`, reset);
  }

  /**
   * Changes the current student's password.
   * @param change Password change details
   * @returns Observable with response
   */
  changePassword(change: ChangePassword): Observable<any> {
    return this.http.put(`${this.apiUrl}/Student/change-password`, change, this.getAuthHeaders());
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  /**
   * Checks if the user is authenticated.
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Gets the current user's role.
   * @returns Role (Librarian or Student) or null
   */
  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }

  /**
   * Gets the current user's email.
   * @returns Email or null
   */
  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  private setSession(token: string, role: string): void {
    localStorage.setItem('token', token);
    const decoded = this.jwtHelper.decodeToken(token);
    this.currentUserSubject.next(decoded.sub);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
