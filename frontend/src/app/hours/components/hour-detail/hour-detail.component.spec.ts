import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourDetailComponent } from './hour-detail.component';

describe('HourDetailComponent', () => {
  let component: HourDetailComponent;
  let fixture: ComponentFixture<HourDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
