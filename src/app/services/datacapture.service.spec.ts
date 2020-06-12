import { TestBed } from '@angular/core/testing';

import { DatacaptureService } from './datacapture.service';

describe('DatacaptureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatacaptureService = TestBed.get(DatacaptureService);
    expect(service).toBeTruthy();
  });
});
