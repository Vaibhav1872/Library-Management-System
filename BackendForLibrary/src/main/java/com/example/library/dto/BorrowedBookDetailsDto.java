package com.example.library.dto;

import java.util.Date;

public class BorrowedBookDetailsDto {

    private Long recordId;
    private String bookTitle;
    private String username;
    private Date borrowDate;

    public BorrowedBookDetailsDto(Long recordId, String bookTitle, String username, Date borrowDate) {
        this.recordId = recordId;
        this.bookTitle = bookTitle;
        this.username = username;
        this.borrowDate = borrowDate;
    }

    // Getters and Setters
    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Date getBorrowDate() { return borrowDate; }
    public void setBorrowDate(Date borrowDate) { this.borrowDate = borrowDate; }
}

