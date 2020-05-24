import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleDetailComponent } from './responsible-detail.component';

describe('ResponsibleDetailComponent', () => {
  let component: ResponsibleDetailComponent;
  let fixture: ComponentFixture<ResponsibleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsibleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
