import { Injectable } from '@angular/core';
import { Level, Renderable, Rectangle } from '../model';

@Injectable()
export class LevelService {

  public levelCollection: Level[] = [];
  public level: Level = new Level();

  constructor() {
  }
}
