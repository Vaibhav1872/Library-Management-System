import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user.html',
  styleUrls: ['./register-user.css']
})
export class RegisterUserComponent {
  username = '';
  password = '';
  role = 'student'; // Default role

  // For displaying feedback messages
  message: string | null = null;
  isError = false;

  constructor(private authService: AuthService) {}

  onRegister(): void {
    const userData = {
      username: this.username,
      password: this.password,
      role: this.role,
    };

    this.authService.registerUser(userData).subscribe({
      next: (response) => {
        this.isError = false;
        this.message = `User "${response.username}" registered successfully!`;
        this.clearForm();
      },
      error: (err) => {
        console.error('Registration failed:', err); // Log the full error for debugging
        this.isError = true;
        // --- THIS IS THE FIX ---
        // Provide a clear, user-friendly error message instead of the complex error object.
        this.message = 'Failed to register user. The username may already exist or the server is unavailable.';
      }
    });
  }

  clearForm(): void {
    this.username = '';
    this.password = '';
    this.role = 'student';
  }
}

