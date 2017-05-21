import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Context } from '../../shared/context';
import { ResourceService, LevelService } from '../../shared/service';
import { TileRenderer } from '../../render/tileRenderer';
import { TileRenderCall, Tile, Rectangle, Asset, TileSet, Block } from '../../shared/model';
import { RenderHelper } from '../../shared/utils/render-helper';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;

  public block: Block;
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
    this.render();
  }

  public render() {

    let renderCalls: TileRenderCall[] = [];
    this.levelService.level.tiles.forEach((value: TileSet, key: number) => {
      renderCalls.push(this.getTileTypeRenderCall(key, value));
    });

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

  private addBlock() {
    if (this.block) {
      let tileSet = this.levelService.level.tiles.get(this.block.key);

      let newTile = new Tile(new Rectangle(this.mousePosition[0], this.mousePosition[1], this.block.blockSize[0], this.block.blockSize[1]));

      if (tileSet) {
        tileSet.tiles.push(newTile);
      } else {
        this.levelService.level.tiles.set(this.block.key, new TileSet([newTile], this.block.textureSize));
      }

      this.render();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    let element = this.canvas.nativeElement.getBoundingClientRect();
    let x = event.clientX - element.left;
    let y = event.clientY - element.top;

    this.mousePosition = [x, y];
  }
}
