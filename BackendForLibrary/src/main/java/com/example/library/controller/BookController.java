package com.example.library.controller;

import com.example.library.model.Book;
import com.example.library.model.BorrowedRecord;
import com.example.library.model.User;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowedRecordRepository;
import com.example.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.library.dto.BorrowedBookDetailsDto;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200")
public class BookController {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BorrowedRecordRepository borrowedRecordRepository;

    private final String UPLOAD_DIR = "src/main/resources/static/images/";

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAllByOrderByIdAsc();
    }
    
    
    @GetMapping("/search")
    public List<Book> searchBooks(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice) {
        
        boolean hasTitle = title != null && !title.trim().isEmpty();
        boolean hasMaxPrice = maxPrice != null && maxPrice > 0;

        if (hasTitle && hasMaxPrice) {
            return bookRepository.findByTitleContainingIgnoreCaseAndPriceLessThanEqualOrderByIdAsc(title, maxPrice);
        } else if (hasTitle) {
            return bookRepository.findByTitleContainingIgnoreCaseOrderByIdAsc(title);
        } else if (hasMaxPrice) {
            return bookRepository.findByPriceLessThanEqualOrderByIdAsc(maxPrice);
        } else {
            // If no search criteria are provided, return all books
            return bookRepository.findAllByOrderByIdAsc();
        }
    }

    /**
     * NEW: Fetches a single book by its ID for the edit page.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * NEW: Updates an existing book's details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("price") double price,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        Optional<Book> bookOptional = bookRepository.findById(id);
        if (!bookOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Book bookToUpdate = bookOptional.get();
            bookToUpdate.setTitle(title);
            bookToUpdate.setAuthor(author);
            bookToUpdate.setPrice(price);

            // If a new image file is provided, update it.
            // If not, the old image URL remains unchanged.
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = imageFile.getOriginalFilename();
                Files.copy(imageFile.getInputStream(), Paths.get(UPLOAD_DIR + fileName), StandardCopyOption.REPLACE_EXISTING);
                bookToUpdate.setImageUrl("/images/" + fileName);
            }

            Book updatedBook = bookRepository.save(bookToUpdate);
            return ResponseEntity.ok(updatedBook);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addBook(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("price") double price,
            @RequestParam("image") MultipartFile imageFile) {

        try {
            String fileName = imageFile.getOriginalFilename();
            Files.copy(imageFile.getInputStream(), Paths.get(UPLOAD_DIR + fileName), StandardCopyOption.REPLACE_EXISTING);
            
            Book newBook = new Book();
            newBook.setTitle(title);
            newBook.setAuthor(author);
            newBook.setPrice(price);
            newBook.setImageUrl("/images/" + fileName);
            newBook.setBorrowed(false);
            
            Book savedBook = bookRepository.save(newBook);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }

    // ... (borrow, return, delete methods remain the same)
    @PostMapping("/borrow")
    public ResponseEntity<Book> borrowBook(@RequestBody Map<String, Object> payload) {
        Long bookId = ((Number) payload.get("bookId")).longValue();
        String username = (String) payload.get("username");

        Optional<Book> bookOpt = bookRepository.findById(bookId);
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (bookOpt.isPresent() && userOpt.isPresent()) {
            Book book = bookOpt.get();
            User user = userOpt.get();

            if (!book.isBorrowed()) {
                book.setBorrowed(true);
                Book updatedBook = bookRepository.save(book);

                BorrowedRecord record = new BorrowedRecord();
                record.setBook(book);
                record.setUser(user);
                record.setBorrowDate(new Date());
                borrowedRecordRepository.save(record);

                return ResponseEntity.ok(updatedBook);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    
    @GetMapping("/borrowed/{username}")
    public ResponseEntity<List<Book>> getBorrowedBooks(@PathVariable String username) {
        List<BorrowedRecord> records = borrowedRecordRepository.findByUserUsername(username);
        List<Book> books = records.stream()
                                  .map(BorrowedRecord::getBook)
                                  .collect(Collectors.toList());
        return ResponseEntity.ok(books);
    }

    @PostMapping("/return")
    public ResponseEntity<Void> returnBook(@RequestBody Map<String, Object> payload) {
        Long bookId = ((Number) payload.get("bookId")).longValue();
        String username = (String) payload.get("username");

        Optional<BorrowedRecord> recordOpt = borrowedRecordRepository.findByUserUsernameAndBookId(username, bookId);

        if (recordOpt.isPresent()) {
            BorrowedRecord record = recordOpt.get();
            Book book = record.getBook();
            
            borrowedRecordRepository.delete(record);
            
            book.setBorrowed(false);
            bookRepository.save(book);

            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    
    @GetMapping("/admin/borrowed-records")
    public ResponseEntity<List<BorrowedBookDetailsDto>> getAllBorrowedRecords() {
        List<BorrowedBookDetailsDto> records = borrowedRecordRepository.findAllBorrowedBookDetails();
        return ResponseEntity.ok(records);
    }
}

