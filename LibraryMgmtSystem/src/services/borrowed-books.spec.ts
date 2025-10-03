import { TestBed } from '@angular/core/testing';

import { BorrowedBooks } from './borrowed-books';

describe('BorrowedBooks', () => {
  let service: BorrowedBooks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorrowedBooks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
