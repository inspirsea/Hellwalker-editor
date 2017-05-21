import { Injectable } from '@angular/core';
import { TextureResource } from '../model';

@Injectable()
export class ResourceService {

  public canvasWidth: number = 1200;
  public canvasHeight: number = 800;
  public textureResources: TextureResource[] = [
    new TextureResource("tile1.png", [32, 32]),
    new TextureResource("tile2.png", [32, 32]),
    new TextureResource("tile3.png", [32, 32]),
    new TextureResource("tile4.png", [32, 32]),
    new TextureResource("tile5.png", [32, 32]),
    new TextureResource("tile6.png", [32, 32])
  ];

  constructor() { }

}
