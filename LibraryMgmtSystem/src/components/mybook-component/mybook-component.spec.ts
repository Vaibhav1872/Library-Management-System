import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybookComponent } from './mybook-component';

describe('MybookComponent', () => {
  let component: MybookComponent;
  let fixture: ComponentFixture<MybookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MybookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
