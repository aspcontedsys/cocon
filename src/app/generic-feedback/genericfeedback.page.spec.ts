import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Genericfeedback } from './genericfeedback.page';

describe('Genericfeedback', () => {
  let component: Genericfeedback;
  let fixture: ComponentFixture<Genericfeedback>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Genericfeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
