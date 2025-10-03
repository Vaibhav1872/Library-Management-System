import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../model/book.interface';
import { BookService } from '../../services/borrowed-books';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book.html',
  styleUrls: ['./edit-book.css']
})
export class EditBookComponent implements OnInit {
  book: Book | null = null;
  selectedFile: File | null = null;
  currentImageUrl: string | null = null;
  
  message: string | null = null;
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe({
        next: (data) => {
          this.book = data;
          this.currentImageUrl = this.book.imageUrl.startsWith('/') 
            ? 'http://localhost:8080' + this.book.imageUrl 
            : this.book.imageUrl;
        },
        error: () => this.router.navigate(['/home'])
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onUpdateBook(): void {
    if (!this.book) return;

    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('price', this.book.price.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.bookService.updateBook(this.book.id, formData).subscribe({
      next: (updatedBook) => {
        this.isError = false;
        this.message = `Book "${updatedBook.title}" updated successfully!`;
        this.book = updatedBook;
        this.currentImageUrl = updatedBook.imageUrl.startsWith('/') 
          ? 'http://localhost:8080' + updatedBook.imageUrl 
          : updatedBook.imageUrl;
      },
      error: (err) => {
        this.isError = true;
        this.message = 'Failed to update book. Please try again.';
        console.error('Update book failed:', err);
      }
    });
  }
}

