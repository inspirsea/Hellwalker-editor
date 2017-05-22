import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Context } from '../../shared/context';
import { ResourceService, LevelService } from '../../shared/service';
import { TileRenderer } from '../../render/tileRenderer';
import { TileRenderCall, Tile, Rectangle, Asset, TileSet, Block } from '../../shared/model';
import { RenderHelper } from '../../shared/utils/render-helper';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;

  public block: Block;
  public gridSize: number;
  public mousePosition: [number, number] = [0, 0];
  private tileRenderer: TileRenderer;
  private context: Context;
  private renderHelper = RenderHelper.getInstance();
  private asset: Asset;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService, private levelService: LevelService) { }

  ngOnInit() {
    this.asset = this.route.snapshot.data['asset'];
    this.context = new Context(this.asset, this.resourceService.canvasWidth, this.resourceService.canvasHeight, this.canvas.nativeElement);

    this.tileRenderer = new TileRenderer(this.context, this.resourceService);

    Observable.interval(50).subscribe(() => {
      this.render();
    });

  }

  public render() {

    let renderCalls: TileRenderCall[] = [];
    this.levelService.level.tiles.forEach((value: TileSet, key: number) => {
      renderCalls.push(this.getTileTypeRenderCall(key, value));
    });

    if(this.block) {
      renderCalls.push(this.getCurrentBlockRenderCall());
    }

    this.tileRenderer.render(renderCalls);
  }

  private getTileTypeRenderCall(tileKey: number, tileSet: TileSet) {

    let renderCall = new TileRenderCall();
    renderCall.tileKey = tileKey;
    for (let tile of tileSet.tiles) {
      this.renderHelper.getTileRenderCoords(renderCall, tile, tileSet.size);
    }

    return renderCall;
  }

  private getCurrentBlockRenderCall() {
    let renderCall = new TileRenderCall();
    renderCall.tileKey = this.block.key;
    let tile = this.newTile(this.block);
    this.renderHelper.getTileRenderCoords(renderCall, tile, this.block.textureSize)

    return renderCall;
  }

  private addBlock() {
    if (this.block) {
      let tileSet = this.levelService.level.tiles.get(this.block.key);

      let newTile = this.newTile(this.block);

      if (tileSet) {
        tileSet.tiles.push(newTile);
      } else {
        this.levelService.level.tiles.set(this.block.key, new TileSet([newTile], this.block.textureSize));
      }
    }
  }

  private newTile(block: Block) {
    return new Tile(new Rectangle(this.getClosestGridPos(this.mousePosition[0]), this.getClosestGridPos(this.mousePosition[1]), block.blockSize[0], block.blockSize[1]));
  }

  private getClosestGridPos(position: number) {
    return Math.round(position / this.gridSize) * this.gridSize; 
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    let element = this.canvas.nativeElement.getBoundingClientRect();
    let x = event.clientX - element.left;
    let y = event.clientY - element.top;

    this.mousePosition = [x, y];
  }
}
