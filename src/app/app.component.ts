import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LibraryManagement.WEB';

  constructor(public authService: AuthService, private router: Router) {}

  goToDashboard() {
    const role = this.authService.getRole();
    if (role === 'Librarian') {
      this.router.navigate(['/librarian/dashboard']);
    } else if (role === 'Student') {
      this.router.navigate(['/student/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  get userRole(): string | null {
    return this.authService.getRole();
  }
}
