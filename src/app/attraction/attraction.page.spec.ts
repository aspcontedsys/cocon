import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttractionPage } from './attraction.page';

describe('AttractionPage', () => {
  let component: AttractionPage;
  let fixture: ComponentFixture<AttractionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
