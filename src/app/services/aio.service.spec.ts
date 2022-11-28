import { TestBed } from '@angular/core/testing';

import { AioService } from './aio.service';

describe('AioService', () => {
  let service: AioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
