import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExhibitorsReportPage } from './exhibitors-report.page';

describe('ExhibitorsReportPage', () => {
  let component: ExhibitorsReportPage;
  let fixture: ComponentFixture<ExhibitorsReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitorsReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
