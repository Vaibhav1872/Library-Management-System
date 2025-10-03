import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../model/book.interface';
import { BookService } from '../../services/borrowed-books';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {

  username: string | null = 'Guest';
  books: Book[] = [];
  isAdmin = false;
  isUserLoggedIn = false;
  
  searchTerm: string = '';
  maxPrice: number | null = null;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isUserLoggedIn = status;
      if (status) {
        this.username = this.authService.getCurrentUsername();
        this.isAdmin = this.authService.getUserRole() === 'admin';
      } else {
        this.username = 'Guest';
        this.isAdmin = false;
      }
      // THIS IS THE FIX: Load books only after we know the user's status.
      this.loadAllBooks(); 
    });
  }

  loadAllBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (data) => this.books = data,
      error: (err) => {
        console.error('Failed to load books', err);
        alert('Could not fetch books from the server.');
      }
    });
  }
  
  onSearch(): void {
    this.bookService.searchBooks(this.searchTerm, this.maxPrice ?? undefined).subscribe({
      next: (data) => this.books = data,
      error: (err) => {
        console.error('Search failed:', err);
        alert('An error occurred during the search.');
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.maxPrice = null;
    this.loadAllBooks();
  }

  editBook(book: Book): void {
    this.router.navigate(['/edit-book', book.id]);
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          alert(`"${book.title}" was successfully deleted.`);
          this.loadAllBooks();
        },
        error: (err) => {
          console.error('Failed to delete book:', err);
          alert('An error occurred while trying to delete the book.');
        }
      });
    }
  }
  
  borrowBook(book: Book): void {
    if (!this.isUserLoggedIn) {
        alert('You must be logged in to borrow a book.');
        this.router.navigate(['/login']);
        return;
    }
    const username = this.authService.getCurrentUsername();
    if (username) {
        this.bookService.borrowBook(book.id, username).subscribe({
            next: (updatedBook) => {
                alert(`You have successfully borrowed "${updatedBook.title}".`);
                this.loadAllBooks();
            },
            error: (err) => {
                console.error('Borrow book failed:', err);
                alert('Failed to borrow the book. It may already be checked out.');
            }
        });
    }
  }
}

