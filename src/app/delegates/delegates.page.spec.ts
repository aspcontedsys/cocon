import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatesPage } from './delegates.page';

describe('DelegatesPage', () => {
  let component: DelegatesPage;
  let fixture: ComponentFixture<DelegatesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
