import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/borrowed-books';

// --- THIS IS THE FIX ---
// This interface defines the expected shape of the data from the backend.
export interface BorrowedBookDetails {
  recordId: number;
  bookTitle: string;
  username: string;
  borrowDate: string;
}

@Component({
  selector: 'app-borrowed-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrowed-history.html',
  styleUrls: ['./borrowed-history.css']
})
export class BorrowedHistory implements OnInit {

  borrowedRecords: BorrowedBookDetails[] = [];
  isLoading = true; // Flag to show a loading message

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // Fetch the records when the component loads
    this.bookService.getAllBorrowedRecords().subscribe({
      next: (data) => {
        this.borrowedRecords = data;
        this.isLoading = false; // Data has arrived, hide loading spinner
      },
      error: (err) => {
        console.error('Failed to fetch borrowed records', err);
        alert('Could not load borrowed book records. Please ensure the backend is running.');
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }
}

