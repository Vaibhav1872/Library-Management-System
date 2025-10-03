import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ], // FormsModule is required for [(ngModel)]
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  // These properties are bound to the input fields in the HTML form
  username = '';
  password = '';
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * This method is called when the login form is submitted.
   */
  onLogin(): void {
    // Reset any previous error messages
    this.errorMessage = null;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      // This is the success callback
      next: (response) => {
        console.log('Login successful!', response);
        // On successful login, navigate the user to the home page
        this.router.navigate(['/home']);
      },
      // This is the error callback
      error: (err) => {
        console.error('Login failed:', err);
        // Set the error message to be displayed in the template
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    });
  }
}