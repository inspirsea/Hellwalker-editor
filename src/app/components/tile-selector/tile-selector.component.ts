import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Asset, TileAsset, Block } from '../../shared/model';

@Component({
  selector: 'app-tile-selector',
  templateUrl: './tile-selector.component.html',
  styleUrls: ['./tile-selector.component.css']
})
export class TileSelectorComponent implements OnChanges {

  @Input() tileTextures: Map<number, TileAsset>;
  @Output() blockChanged = new EventEmitter<Block>();
  @Output() gridSizeChanged = new EventEmitter<number>();

  public tileAssetList: TileAsset[][] = [];

  public set gridSize(value: number) {
    this._gridSize = value;
    this.gridSizeChanged.emit(this._gridSize);
  }

  public get gridSize() {
    return this._gridSize;
  }

  private _gridSize;

  private set block(value: Block) {
    this._block = value;

    this.blockChanged.emit(this._block);
  }

  private get block() {
    return this._block;
  }

  private _block: Block;
  private tileCollumns: number[] = [1, 2, 3, 4];


  constructor() { }

  ngOnChanges() {

    this.gridSize = 10;
    
    if (this.tileTextures) {
    
      let row: TileAsset[] = [];
      let i = 0;
      this.tileTextures.forEach((value: TileAsset, key: number) => {
        if(i == 0) {
          row = [];
          this.tileAssetList.push(row);
        }
        
        row.push(new TileAsset(key, value.image, value.size));

        i++;

        if(i >= this.tileCollumns.length) {
          i = 0;
        } 
      })

      this.block = new Block(this.tileAssetList[0][0].key, this.tileAssetList[0][0].size, [32, 32]);
    }
  }

  public setBlock(tile: TileAsset) {
    this.block = new Block(tile.key, tile.size, [this.block.blockSize[0], this.block.blockSize[1]]);
  }

}

