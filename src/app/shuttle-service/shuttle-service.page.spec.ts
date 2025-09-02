import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShuttleServicePage } from './shuttle-service.page';

describe('ShuttleServicePage', () => {
  let component: ShuttleServicePage;
  let fixture: ComponentFixture<ShuttleServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttleServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
