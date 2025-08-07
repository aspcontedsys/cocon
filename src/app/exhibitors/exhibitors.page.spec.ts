import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExhibitorsPage } from './exhibitors.page';

describe('ExhibitorsPage', () => {
  let component: ExhibitorsPage;
  let fixture: ComponentFixture<ExhibitorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
