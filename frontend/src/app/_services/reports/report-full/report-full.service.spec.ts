import { TestBed } from '@angular/core/testing';

import { ReportFullService } from './report-full.service';

describe('ReportFullService', () => {
  let service: ReportFullService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportFullService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
