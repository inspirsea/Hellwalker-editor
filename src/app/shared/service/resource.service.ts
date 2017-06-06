import { Injectable } from '@angular/core';
import { TextureResource, Asset } from '../model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ResourceService {

  public asset: Asset;
  public resolution: [number, number] = [1200, 800];
  public overviewResolution: [number, number] = [600, 400];
  public gameSize: [number, number] = [2400, 1600];
  public camera: [number, number] = [0, 0];
  public textureResources: TextureResource[] = [
    new TextureResource("1tile.png", [32, 32]),
    new TextureResource("2tile.png", [32, 32]),
    new TextureResource("3tile.png", [32, 32]),
    new TextureResource("4tile.png", [32, 32]),
    new TextureResource("5tile.png", [32, 32]),
    new TextureResource("6tile.png", [32, 32]),
    new TextureResource("7tile.png", [32, 32]),
    new TextureResource("8tile.png", [32, 32]),
    new TextureResource("9tile.png", [32, 32]),
    new TextureResource("10tile.png", [32, 32]),
    new TextureResource("11tile.png", [32, 32]),
    new TextureResource("12tile.png", [32, 32]),
    new TextureResource("13tile.png", [32, 32]),
    new TextureResource("14tile.png", [32, 32]),
    new TextureResource("15tile.png", [32, 32]),
    new TextureResource("16tile.png", [32, 32]),
    new TextureResource("17tile.png", [32, 32]),
    new TextureResource("18tile.png", [32, 32]),
    new TextureResource("19tile.png", [32, 32]),
    new TextureResource("20tile.png", [32, 32]),
    new TextureResource("21tile.png", [32, 32]),
    new TextureResource("22tile.png", [32, 32]),
    new TextureResource("23tile.png", [32, 32]),
    new TextureResource("24tile.png", [32, 32]),
    new TextureResource("25tile.png", [32, 32]),
    new TextureResource("26tile.png", [32, 32])
  ];

  public enemyTextureResources: TextureResource[] = [
    new TextureResource("50enemy.png", [56, 59]),
    new TextureResource("51enemy.png", [50, 50]),
    new TextureResource("52enemy.png", [128, 128]),
    new TextureResource("53enemy.png", [128, 128]),
    new TextureResource("54enemy.png", [80, 80]),
    new TextureResource("55enemy.png", [128, 128]),
    new TextureResource("56enemy.png", [128, 128])
  ];

  public editorUtilTextures: TextureResource[] = [
    new TextureResource("100editorutil.png", [128, 128]),
    new TextureResource("101editorutil.png", [64, 64]),
    new TextureResource("102editorutil.png", [64, 64]),
    new TextureResource("103editorutil.png", [64, 64]),
    new TextureResource("104editorutil.png", [64, 64])
  ];

  public playerResource: TextureResource[] = [
    new TextureResource("75player.png", [85, 85])
  ];

  public endResource: TextureResource[] = [
    new TextureResource("200end.png", [256, 128])
  ]

  constructor() { }

}
