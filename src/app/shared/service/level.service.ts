import { Injectable } from '@angular/core';
import { Level, Renderable, Rectangle } from '../model';
import { ImportHelper } from '../utils/import-helper';
import { LocalStorageHelper } from '../utils/local-storage-helper';
import { ResourceService } from '../service';

@Injectable()
export class LevelService {

  public levelCollection: Level[] = [];
  public level: Level = new Level();

  private localStorageHelper = LocalStorageHelper.getInstance();

  constructor() {
  }

  public newLevel() {
    this.level = new Level();
  }

  public loadLevels(resourceService: ResourceService) {

    this.levelCollection = this.localStorageHelper.loadLevels(resourceService);

  }
}
