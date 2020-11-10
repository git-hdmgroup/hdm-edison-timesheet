import { TestBed } from '@angular/core/testing';

import { GqlFilterService } from './gql-filter.service';

describe('GqlFilterService', () => {
  let service: GqlFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GqlFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
