import { TestBed } from '@angular/core/testing';

import { NgxService } from './ngx.service';

describe('NgxService', () => {
  let service: NgxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
