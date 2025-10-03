package com.example.library.repository;
import com.example.library.dto.BorrowedBookDetailsDto;

import com.example.library.model.BorrowedRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowedRecordRepository extends JpaRepository<BorrowedRecord, Long> {
    // Custom query to find records by username
    List<BorrowedRecord> findByUserUsername(String username);

    // New method to find a specific record for returning a book
    Optional<BorrowedRecord> findByUserUsernameAndBookId(String username, Long bookId);
    
    @Query("SELECT new com.example.library.dto.BorrowedBookDetailsDto(br.id, b.title, u.username, br.borrowDate) " +
            "FROM BorrowedRecord br JOIN br.book b JOIN br.user u " +
            "ORDER BY br.borrowDate DESC")
     List<BorrowedBookDetailsDto> findAllBorrowedBookDetails();
}

