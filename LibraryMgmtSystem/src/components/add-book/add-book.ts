import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/borrowed-books';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.html',
  styleUrls: ['./add-book.css']
})
export class AddBookComponent {
  // Form fields
  title = '';
  author = '';
  price: number | null = null;
  selectedFile: File | null = null;

  // For displaying messages to the user
  message: string | null = null;
  isError = false;

  constructor(private bookService: BookService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onAddBook(): void {
    if (!this.title || !this.author || !this.price || !this.selectedFile) {
      this.isError = true;
      this.message = 'All fields are required.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('author', this.author);
    formData.append('price', this.price.toString());
    formData.append('image', this.selectedFile);

    this.bookService.addBook(formData).subscribe({
      next: (response) => {
        this.isError = false;
        this.message = `Book "${response.title}" added successfully!`;
        // Clear the form
        this.title = '';
        this.author = '';
        this.price = null;
        // You might want to clear the file input as well, which is a bit tricky
      },
      error: (err) => {
        this.isError = true;
        this.message = 'Failed to add book. Please try again.';
        console.error('Add book failed:', err);
      }
    });
  }
}
