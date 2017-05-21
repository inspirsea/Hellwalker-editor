import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AssetLoaderService, ResourceService } from '../service/';
import { Asset } from '../model';

@Injectable()
export class AssetResolve implements Resolve<Asset> {

  constructor(private assetLoaderService: AssetLoaderService,  private resourceService: ResourceService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.assetLoaderService.getAsset(this.resourceService.textureResources);
  }
}