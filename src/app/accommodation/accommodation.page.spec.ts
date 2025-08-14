import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccommodationPage } from './accommodation.page';

describe('AccommodationPage', () => {
  let component: AccommodationPage;
  let fixture: ComponentFixture<AccommodationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
