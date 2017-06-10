import { Component, OnInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';
import { ResourceService, LevelService } from '../../shared/service';
import { TileRenderer } from '../../render/tileRenderer';
import { RenderCall, Renderable, Rectangle, Asset, RenderableSet, Block } from '../../shared/model';
import { RenderHelper } from '../../shared/utils/render-helper';
import { Context } from '../../shared/context';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  @ViewChild('overview') overview: ElementRef;

  private asset: Asset;
  private context: Context;
  private renderHelper: RenderHelper = RenderHelper.getInstance();
  private tileRenderer: TileRenderer;
  private overViewMousePos: [number, number] = [0, 0];

  private mouseDown: boolean = false;

  private overViewResWidthFactor: number;
  private overViewResHeightFactor: number;

  constructor(private resourceService: ResourceService, private levelService: LevelService) {
  }

  ngOnInit() {
    this.context = new Context(this.resourceService.asset, this.resourceService.overviewResolution[0], this.resourceService.overviewResolution[1], this.overview.nativeElement);

    this.tileRenderer = new TileRenderer(this.context, this.calculateResolution(this.levelService.level.gameSize));

  }

  public render() {

    this.tileRenderer = new TileRenderer(this.context, this.calculateResolution(this.levelService.level.gameSize));

    let renderCalls: RenderCall[] = [];
    this.levelService.level.tiles.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getTileTypeRenderCall(key, value));
    });

    this.levelService.level.enemies.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getEnemyRenderCall(key, value));
    });

    this.levelService.level.player.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getEnemyRenderCall(key, value));
    });

    this.levelService.level.end.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getEnemyRenderCall(key, value));
    });

    this.levelService.level.dynamicTiles.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getEnemyRenderCall(key, value));
    });

    renderCalls.push(this.getWindowRenderCall());

    this.tileRenderer.render(renderCalls, [0, 0]);
  }

  public changeCamera() {

    if (this.mouseDown) {
      this.levelService.level.camera[0] = this.getWindowWidthPosition(0);
      this.levelService.level.camera[1] = this.getWindowWidthPosition(1);
    }

  }

  private getWindowWidthPosition(index: number) {

    let cameraFactor = this.resourceService.resolution[index] / this.levelService.level.gameSize[index];
    let maxWindowFactor = 1 - cameraFactor;

    let currentPos = this.overViewMousePos[index] / this.levelService.level.gameSize[index];

    if (currentPos < 0) {
      return 0;
    } else if (currentPos < maxWindowFactor) {
      return this.overViewMousePos[index];
    } else {
      return this.levelService.level.gameSize[index] * maxWindowFactor;
    }
  }



  private getWindowRenderCall() {
    let renderCall = new RenderCall();
    renderCall.textureKey = 100;
    let windowWidth = this.levelService.level.gameSize[0] * (this.resourceService.resolution[0] / this.levelService.level.gameSize[0]);
    let windowHeight = this.levelService.level.gameSize[1] * this.resourceService.resolution[1] / this.levelService.level.gameSize[1];
    let tile = new Renderable(new Rectangle(this.levelService.level.camera[0], this.levelService.level.camera[1], windowWidth, windowHeight));
    this.renderHelper.getEditorUtilRenderCoords(renderCall, tile);

    return renderCall;
  }

  private calculateResolution(gameSize: [number, number]): [number, number] {
    this.overViewResWidthFactor = gameSize[0] / this.resourceService.overviewResolution[0];
    this.overViewResHeightFactor = gameSize[1] / this.resourceService.overviewResolution[1];

    return [this.resourceService.overviewResolution[0] * this.overViewResWidthFactor, this.resourceService.overviewResolution[1] * this.overViewResHeightFactor];
  }

  @HostListener('document:mousedown', ['$event'])
  private onmousedown(event: MouseEvent) {
    this.mouseDown = true;
  }

  @HostListener('document:mouseup', ['$event'])
  private onmouseup(event: MouseEvent) {
    this.mouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  private onMousemove(event: MouseEvent) {
    this.getOverViewRelMousePos(event);
  }

  private getOverViewRelMousePos(event: MouseEvent) {
    let editrorElement = this.overview.nativeElement.getBoundingClientRect();
    let x = event.clientX - editrorElement.left;
    let y = event.clientY - editrorElement.top;

    let widthFactor = x / this.resourceService.overviewResolution[0];
    let heightFactor = y / this.resourceService.overviewResolution[1];

    let relPosX = this.levelService.level.gameSize[0] * widthFactor;
    let relPosY = this.levelService.level.gameSize[1] * heightFactor;

    this.overViewMousePos = [relPosX, relPosY];
  }

}
