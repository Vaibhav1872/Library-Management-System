import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../model/book.interface';
import { BorrowedBookDetails } from '../components/borrowed-history/borrowed-history';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }


    searchBooks(title?: string, maxPrice?: number): Observable<Book[]> {
    let params = new HttpParams();
    if (title && title.trim() !== '') {
      params = params.append('title', title);
    }
    if (maxPrice) {
      params = params.append('maxPrice', maxPrice.toString());
    }
    return this.http.get<Book[]>(`${this.apiUrl}/search`, { params });
  }

  borrowBook(bookId: number, username: string): Observable<Book> {
    const payload = { bookId, username };
    return this.http.post<Book>(`${this.apiUrl}/borrow`, payload);
  }

  getBorrowedBooks(username: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/borrowed/${username}`);
  }

  returnBook(bookId: number, username: string): Observable<void> {
    const payload = { bookId, username };
    return this.http.post<void>(`${this.apiUrl}/return`, payload);
  }

  /**
   * Deletes a book by its ID.
   * @param bookId The ID of the book to delete.
   * @returns An Observable that completes when the action is done.
   */
  deleteBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookId}`);
  }

   addBook(formData: FormData): Observable<Book> {
    // Corrected the syntax from "this->" to "this."
    return this.http.post<Book>(`${this.apiUrl}/add`, formData);
  }

    getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

    updateBook(id: number, formData: FormData): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, formData);
  }

    getAllBorrowedRecords(): Observable<BorrowedBookDetails[]> {
    return this.http.get<BorrowedBookDetails[]>(`${this.apiUrl}/admin/borrowed-records`);
  }

}

