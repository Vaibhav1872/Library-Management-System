import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the real-time login status
    this.authService.isLoggedIn$.subscribe(status => {
      this.isUserLoggedIn = status;
      // When the status changes, also update the role
      this.isAdmin = this.authService.getUserRole() === 'admin';
    });
  }

  logout(): void {
    this.authService.logout();
    // No need to reload the page anymore
  }
}

