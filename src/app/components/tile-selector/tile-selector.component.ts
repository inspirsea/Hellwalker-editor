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

  public blockSize: [number, number] = [50, 50];
  public tileAssetList: TileAsset[][] = [];
  private tileRows: number[] = [1, 2];


  private set block(value: Block) {
    this._block = value;

    this.blockChanged.emit(this._block);
  }

  private get block() {
    return this._block;
  }

  private _block: Block; 


  constructor() { }

  ngOnChanges() {
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

        if(i >= this.tileRows.length) {
          i = 0;
        } 
      })
    }
  }

  public setBlock(tile: TileAsset) {
    this.block = new Block(tile.key, tile.size, [this.blockSize[0], this.blockSize[1]]);
  }

  public setBlockSize(value: number, index: number) {
    this.blockSize[index] = +value;
    if(this.block) {
      this.block.blockSize[index] = this.blockSize[index];
    }
    
  }

}

