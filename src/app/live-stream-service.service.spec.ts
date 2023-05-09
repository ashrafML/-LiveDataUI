import { TestBed } from '@angular/core/testing';

import { LiveStreamServiceService } from './live-stream-service.service';

describe('LiveStreamServiceService', () => {
  let service: LiveStreamServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveStreamServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
