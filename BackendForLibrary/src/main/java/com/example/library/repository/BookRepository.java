package com.example.library.repository;

import com.example.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    List<Book> findAllByOrderByIdAsc();

    // --- NEW METHODS FOR SEARCHING ---

    // Finds books where the title contains the given string (case-insensitive)
    List<Book> findByTitleContainingIgnoreCaseOrderByIdAsc(String title);

    // Finds books where the price is less than or equal to the given value
    List<Book> findByPriceLessThanEqualOrderByIdAsc(double maxPrice);

    // Finds books that match both a title and a maximum price
    List<Book> findByTitleContainingIgnoreCaseAndPriceLessThanEqualOrderByIdAsc(String title, double maxPrice);
}

