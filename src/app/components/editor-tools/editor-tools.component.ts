import { Component, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Asset, RenderableAsset, Block, BlockType, Level } from '../../shared/model';
import { ResourceService, LevelService } from '../../shared/service';
import { OverviewComponent } from '../overview/overview.component';
import { LocalStorageHelper } from '../../shared/utils/local-storage-helper';

@Component({
  selector: 'app-editor-tools',
  templateUrl: './editor-tools.component.html',
  styleUrls: ['./editor-tools.component.css']
})
export class EditorToolsComponent implements OnChanges {

  @Input() tileTextures: Map<number, RenderableAsset>;
  @Input() enemyTextures: Map<number, RenderableAsset>;
  @Input() playerTexture: Map<number, RenderableAsset>;
  @Input() endTexture: Map<number, RenderableAsset>;

  @Output() blockChanged = new EventEmitter<Block>();
  @Output() gridSizeChanged = new EventEmitter<number>();

  @ViewChild('overview') overview: OverviewComponent;

  public tileTableList: RenderableAsset[][] = [];
  public enemyTableList: RenderableAsset[][] = [];
  public playerAsset: RenderableAsset;
  public endAsset: RenderableAsset;

  public set dynamicTile(value: boolean) {
    this._dynamicTile = value;

    if(this.ifBlockTypeTile()) {
      this.block.type = value ? BlockType.DynamicTile : BlockType.Tile;
    };
  }

  public get dynamicTile() {
    return this._dynamicTile;
  }

  private _dynamicTile = false;

  public set background(value: boolean) {
    this._background = value;

    if(this.ifBlockTypeTile()) {
      this.block.type = value ? BlockType.BackGround : BlockType.Tile;
    };
  }

  public get background() {
    return this._background;
  }

  private _background = false;

  public set decorative(value: boolean) {
    this._decorative = value;

    if(this.ifBlockTypeTile()) {
      this.block.type = value ? BlockType.Decorative : BlockType.Tile;
    };
  }

  public get decorative() {
    return this._decorative;
  }

  private _decorative = false;

  public set gridSize(value: number) {
    this._gridSize = value;
    this.gridSizeChanged.emit(this._gridSize);
  }

  public get gridSize() {
    return this._gridSize;
  }

  public set block(value: Block) {
    this._block = value;

    this.blockChanged.emit(this._block);
  }

  public get block() {
    return this._block;
  }

  private _gridSize;
  private _block: Block;
  private tileCollumns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private enemyCollumns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private localStorageHelper = LocalStorageHelper.getInstance();

  constructor(private resourceService: ResourceService, public levelService: LevelService) { }

  ngOnInit() {
    this.levelService.loadLevels(this.resourceService);
  }

  ngOnChanges() {

    this.gridSize = 32;

    if (this.tileTextures) {

      this.tileTableList = this.createTableStructure(this.tileTextures, this.tileCollumns.length);

      this.block = new Block(this.tileTableList[0][0].key, this.tileTableList[0][0].size, [32, 32], BlockType.Tile, true, true, 400, 0.1);
    }

    if (this.enemyTextures) {
      this.enemyTableList = this.createTableStructure(this.enemyTextures, this.enemyCollumns.length);
    }

    if (this.playerTexture) {
      this.playerAsset = this.createTableStructure(this.playerTexture, 1)[0][0];
    }

    if(this.endTexture) {
      this.endAsset = this.createTableStructure(this.endTexture, 1)[0][0];
    }
  }

  public loadLevel(level: Level) {
    this.levelService.level = level;
  }

  public delete(name: string) {
    this.localStorageHelper.deleteLevel(name);
    this.levelService.loadLevels(this.resourceService);
  }

  public clear() {
    this.levelService.newLevel();
  }

  public renderOverview() {
    this.overview.render();
  }

  public setTile(renderableAsset: RenderableAsset) {
    if(this.dynamicTile) {
      this.setBlock(renderableAsset, BlockType.DynamicTile);
    } else if(this.decorative){
      this.setBlock(renderableAsset, BlockType.Decorative);
    } else if(this.background) {
      this.setBlock(renderableAsset, BlockType.BackGround);
    } else {
      this.setBlock(renderableAsset, BlockType.Tile);
    }
  }

  public setEnemy(renderableAsset: RenderableAsset) {
    this.setBlock(renderableAsset, BlockType.Enemy);
  }

  public setPlayer(renderableAsset: RenderableAsset) {
    this.setBlock(renderableAsset, BlockType.Player);
  }

  public setEnd(renderableAsset: RenderableAsset) {
    this.setBlock(renderableAsset, BlockType.End);
  }

  private setBlock(renderableAsset: RenderableAsset, type: BlockType) {
    this.block = new Block(renderableAsset.key, renderableAsset.size, [this.block.blockSize[0], this.block.blockSize[1]], type, this.block.inverted, this.block.vertical, this.block.distance, this.block.velocity);
  }

  private createTableStructure(assets: Map<number, RenderableAsset>, nrOfColumns: number) {
    let row: RenderableAsset[] = [];
    let tableList: RenderableAsset[][] = [];
    let i = 0;
    assets.forEach((value: RenderableAsset, key: number) => {
      if (i == 0) {
        row = [];
        tableList.push(row);
      }

      row.push(new RenderableAsset(key, value.image, value.size));

      i++;

      if (i >= nrOfColumns) {
        i = 0;
      }
    })

    return tableList;
  }

  public ifBlockTypeTile() {
    return (this.block.type == BlockType.Tile || this.block.type == BlockType.DynamicTile || this.block.type == BlockType.Decorative || this.block.type == BlockType.BackGround);
  }

}

