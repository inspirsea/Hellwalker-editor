import { TestBed, inject } from '@angular/core/testing';

import { AssetLoaderService } from './asset-loader.service';

describe('AssetLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetLoaderService]
    });
  });

  it('should be created', inject([AssetLoaderService], (service: AssetLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
