import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedHistory } from './borrowed-history';

describe('BorrowedHistory', () => {
  let component: BorrowedHistory;
  let fixture: ComponentFixture<BorrowedHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowedHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowedHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
