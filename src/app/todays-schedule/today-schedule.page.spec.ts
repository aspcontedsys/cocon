import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodaySchedulePage } from './today-schedule.page';

describe('TodaySchedulePage', () => {
  let component: TodaySchedulePage;
  let fixture: ComponentFixture<TodaySchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaySchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
