import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_NAME = 'authToken';
  private readonly ROLE_NAME = 'userRole';
  private readonly USERNAME_NAME = 'username';

  // Use a BehaviorSubject to store and emit the current login status
  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Expose the login status as an Observable
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInStatus.asObservable();
  }

  login(credentials: { username: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.username && response.role) {
          localStorage.setItem(this.TOKEN_NAME, 'logged-in-token');
          localStorage.setItem(this.USERNAME_NAME, response.username);
          localStorage.setItem(this.ROLE_NAME, response.role);
          // Notify all subscribers that the user is now logged in
          this.loggedInStatus.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem(this.ROLE_NAME);
    localStorage.removeItem(this.USERNAME_NAME);
    // Notify all subscribers that the user has logged out
    this.loggedInStatus.next(false);
    this.router.navigate(['/login']);
  }

  // This private method checks the initial state
  private isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_NAME);
  }
  
  // These methods are still useful for synchronous checks
  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_NAME);
  }

  getCurrentUsername(): string | null {
    return localStorage.getItem(this.USERNAME_NAME);
  }
  
  // This is used by the register component
  registerUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
}

