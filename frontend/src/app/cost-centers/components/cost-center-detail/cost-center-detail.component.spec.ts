import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterDetailComponent } from './cost-center-detail.component';

describe('CostCenterDetailComponent', () => {
  let component: CostCenterDetailComponent;
  let fixture: ComponentFixture<CostCenterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostCenterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
