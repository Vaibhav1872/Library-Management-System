import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../model/book.interface';
import { BookService } from '../../services/borrowed-books';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mybook-component.html',
  styleUrls: ['./mybook-component.css']
})
export class MyBookComponent implements OnInit {

  borrowedBooks: Book[] = [];

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // We subscribe to the login status to ensure we load books only
    // when we are sure who the user is.
    this.authService.isLoggedIn$.subscribe(status => {
      if (status) {
        this.loadBorrowedBooks();
      } else {
        // If the user logs out, clear the list
        this.borrowedBooks = [];
      }
    });
  }

  loadBorrowedBooks(): void {
    const username = this.authService.getCurrentUsername();
    if (username) {
      this.bookService.getBorrowedBooks(username).subscribe({
        next: (books) => {
          this.borrowedBooks = books;
        },
        error: (err) => {
          console.error('Failed to load borrowed books:', err);
          alert('Could not fetch your borrowed books.');
        }
      });
    }
  }
  
  returnBook(book: Book): void {
      const username = this.authService.getCurrentUsername();
      if (username) {
          this.bookService.returnBook(book.id, username).subscribe({
              next: () => {
                  alert(`You have successfully returned "${book.title}".`);
                  // Refresh the list after returning a book
                  this.loadBorrowedBooks(); 
              },
              error: (err) => {
                  console.error('Failed to return book:', err);
                  alert('There was an error returning the book.');
              }
          });
      }
  }
}

