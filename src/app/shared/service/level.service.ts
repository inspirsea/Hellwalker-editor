import { Injectable } from '@angular/core';
import { Level, Tile, Rectangle } from '../model';

@Injectable()
export class LevelService {

  public level: Level = new Level();

  constructor() {
  }
}
