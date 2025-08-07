import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VenueLayoutPage } from './venue-layout.page';

describe('VenueLayoutPage', () => {
  let component: VenueLayoutPage;
  let fixture: ComponentFixture<VenueLayoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
