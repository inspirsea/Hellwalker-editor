import { Injectable } from '@angular/core';
import { TextureResource, Asset } from '../model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ResourceService {

  public asset: Asset;
  public resolution: [number, number] = [1200, 800];
  public overviewResolution: [number, number] = [600, 400];
  public textureResources: TextureResource[] = [
    new TextureResource("1tile.png", [32, 32], 1),
    new TextureResource("2tile.png", [32, 32], 2),
    new TextureResource("3tile.png", [32, 32], 3),
    new TextureResource("4tile.png", [32, 32], 4),
    new TextureResource("5tile.png", [32, 32], 5),
    new TextureResource("6tile.png", [32, 32], 6),
    new TextureResource("7tile.png", [32, 32], 7),
    new TextureResource("8tile.png", [32, 32], 8),
    new TextureResource("9tile.png", [32, 32], 9),
    new TextureResource("10tile.png", [32, 32], 10),
    new TextureResource("11tile.png", [32, 32], 11),
    new TextureResource("12tile.png", [32, 32], 12),
    new TextureResource("13tile.png", [32, 32], 13),
    new TextureResource("14tile.png", [32, 32], 14),
    new TextureResource("15tile.png", [32, 32], 15),
    new TextureResource("16tile.png", [32, 32], 16),
    new TextureResource("17tile.png", [32, 32], 17),
    new TextureResource("18tile.png", [32, 32], 18),
    new TextureResource("19tile.png", [32, 32], 19),
    new TextureResource("20tile.png", [32, 32], 20),
    new TextureResource("21tile.png", [32, 32], 21),
    new TextureResource("22tile.png", [32, 32], 22),
    new TextureResource("23tile.png", [32, 32], 23),
    new TextureResource("24tile.png", [32, 32], 24),
    new TextureResource("25tile.png", [32, 32], 25),
    new TextureResource("26tile.png", [32, 32], 26)
  ];

  public enemyTextureResources: TextureResource[] = [
    new TextureResource("50enemy.png", [56, 59], 50),
    new TextureResource("51enemy.png", [50, 50], 51),
    new TextureResource("52enemy.png", [128, 128], 52),
    new TextureResource("53enemy.png", [128, 128], 53),
    new TextureResource("54enemy.png", [80, 80], 54),
    new TextureResource("55enemy.png", [128, 128], 55),
    new TextureResource("56enemy.png", [128, 128], 56)
  ];

  public editorUtilTextures: TextureResource[] = [
    new TextureResource("100editorutil.png", [128, 128], 100),
    new TextureResource("101editorutil.png", [64, 64], 101),
    new TextureResource("102editorutil.png", [64, 64], 102),
    new TextureResource("103editorutil.png", [64, 64], 103),
    new TextureResource("104editorutil.png", [64, 64], 104)
  ];

  public playerResource: TextureResource[] = [
    new TextureResource("75player.png", [85, 85], 75)
  ];

  public endResource: TextureResource[] = [
    new TextureResource("200end.png", [256, 128], 200)
  ]

  constructor() { }

}
