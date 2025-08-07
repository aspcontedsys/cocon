import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StallLayoutPage } from './stall-layout.page';

describe('StallLayoutPage', () => {
  let component: StallLayoutPage;
  let fixture: ComponentFixture<StallLayoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StallLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
