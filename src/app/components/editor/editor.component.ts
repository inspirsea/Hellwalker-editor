import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Context } from '../../shared/context';
import { ResourceService, LevelService } from '../../shared/service';
import { TileRenderer } from '../../render/tileRenderer';
import { RenderCall, Renderable, Rectangle, Asset, RenderableSet, Block, BlockType, DynamicRenderable, DynamicRenderableSet } from '../../shared/model';
import { RenderHelper } from '../../shared/utils/render-helper';
import { ExportHelper } from '../../shared/utils/export-helper';
import { ImportHelper } from '../../shared/utils/import-helper';
import { LocalStorageHelper } from '../../shared/utils/local-storage-helper';
import { CollisionHelper } from '../../shared/utils/collision-helper';
import { Observable } from 'rxjs';
import { EditorToolsComponent } from '../editor-tools/editor-tools.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('savemodal') saveModal: ModalComponent;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('editortools') editorTools: EditorToolsComponent;
  @ViewChild('importLink') importLink: ElementRef;

  public block: Block;
  public gridSize: number;
  private rendere: TileRenderer;
  private context: Context;
  private renderHelper = RenderHelper.getInstance();
  private exportHelper = ExportHelper.getInstance();
  private importHelper = ImportHelper.getInstance();
  private collisionHelper = CollisionHelper.getInstance();
  private localStorageHelper = LocalStorageHelper.getInstance();
  public mousePosition: [number, number] = [0, 0];

  constructor(private route: ActivatedRoute, private resourceService: ResourceService, private levelService: LevelService, private renderer2: Renderer2) { }

  ngOnInit() {
    this.resourceService.asset = this.route.snapshot.data['asset'];
    this.context = new Context(this.resourceService.asset, this.resourceService.resolution[0], this.resourceService.resolution[1], this.canvas.nativeElement);

    this.rendere = new TileRenderer(this.context, this.resourceService.resolution);

    Observable.interval(50).subscribe(() => {
      this.render();
    });

    this.renderer2.listen(this.importLink.nativeElement, 'change', (evt) => {
      let editorComp = this;
      let fileReader = new FileReader();
      fileReader.onload = (evt: ProgressEvent) => {
        let target = evt.target as FileReader;
        this.levelService.level = this.importHelper.import(target.result, this.resourceService);
      }

      fileReader.readAsText(this.importLink.nativeElement.files[0], "UTF-8")
    });

  }

  public render() {

    let renderCalls: RenderCall[] = [];

    this.levelService.level.background.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getTileTypeRenderCall(key, value));
    });

    this.levelService.level.tiles.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getTileTypeRenderCall(key, value));
    });

    this.levelService.level.decorativeTiles.forEach((value: RenderableSet, key: number) => {
      renderCalls.push(this.renderHelper.getTileTypeRenderCall(key, value));
    });

    this.levelService.level.dynamicTiles.forEach((value: RenderableSet, key: number) => {
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

    if (this.block) {
      renderCalls.push(this.getCurrentBlockRenderCall());

      if (this.block.type == BlockType.DynamicTile) {
        renderCalls.push(this.getDynamicTileArrowRenderCall(this.block));
      }
    }

    this.rendere.render(renderCalls, this.levelService.level.camera);
    this.editorTools.renderOverview();
  }

  public export() {
    this.exportHelper.export(this.levelService.level, this.levelService.level.camera, this.levelService.level.gameSize);
  }

  public import() {
    this.importLink.nativeElement.click();
  }

  public save() {
    if (this.levelService.level.name != null) {
      this.localStorageHelper.saveLevel(this.levelService.level.name, this.levelService.level.camera, this.levelService.level.gameSize, this.levelService.level);
      this.levelService.loadLevels(this.resourceService);
      this.levelService.level = this.levelService.levelCollection.find(it => it.name == this.levelService.level.name);
    }
  }

  private getDynamicTileArrowRenderCall(block: Block) {
    let renderCall = new RenderCall();
    let position = this.getCurrentPosition();

    let renderable: Renderable;

    renderable = this.getArrow([this.getClosestGridPos(position[0]), this.getClosestGridPos(position[1])], block, renderCall);

    this.renderHelper.getEditorUtilRenderCoords(renderCall, renderable)

    return renderCall;
  }

  private getArrow(position: [number, number], block: Block, renderCall: RenderCall) {
    let width: number;
    let height: number;

    if (block.vertical) {
      if (block.inverted) {
        renderCall.textureKey = 101;
        width = block.blockSize[0];
        height = block.distance;
        position[1] = position[1] - height;
      } else {
        renderCall.textureKey = 103;
        width = block.blockSize[0];
        height = block.distance;
        position[1] = position[1] + block.blockSize[1];
      }
    } else {
      if (block.inverted) {
        renderCall.textureKey = 104;
        width = block.distance;
        height = block.blockSize[1];
        position[0] = position[0] - width;
      } else {
        renderCall.textureKey = 102;
        width = block.distance;
        height = block.blockSize[1];
        position[0] = position[0] + block.blockSize[0];
      }
    }

    return new Renderable(new Rectangle(position[0], position[1], width, height));
  }

  private getCurrentBlockRenderCall() {
    let renderCall = new RenderCall();
    renderCall.textureKey = this.block.key;
    let tile = this.newRenderable(this.block);
    this.renderHelper.getTileRenderCoords(renderCall, tile, this.block.textureSize)

    return renderCall;
  }

  private addBlock() {
    if (this.block) {
      if (this.block.type == BlockType.Tile) {
        this.addToLevel(this.levelService.level.tiles, this.block);
      } else if (this.block.type == BlockType.Decorative) {
        this.addToLevel(this.levelService.level.decorativeTiles, this.block);
      } else if (this.block.type == BlockType.BackGround) {
        this.levelService.level.background.clear();
        this.addToLevel(this.levelService.level.background, this.block, true);
      } else if (this.block.type == BlockType.Enemy) {
        this.addToLevel(this.levelService.level.enemies, this.block);
      } else if (this.block.type == BlockType.Player) {
        this.levelService.level.player.clear();
        this.addToLevel(this.levelService.level.player, this.block);
      } else if (this.block.type == BlockType.End) {
        this.levelService.level.end.clear();
        this.addToLevel(this.levelService.level.end, this.block);
      } else if (this.block.type == BlockType.DynamicTile) {
        this.addToLevelDynamic(this.levelService.level.dynamicTiles, this.block);
      }
    }
  }

  private addToLevelDynamic(map: Map<number, DynamicRenderableSet>, block: Block) {
    let set = map.get(block.key);

    let newRenderable = this.newDynamicRenderable(this.block);

    if (set) {
      set.renderables.push(newRenderable);
    } else {
      map.set(block.key, new DynamicRenderableSet([newRenderable], block.textureSize));
    }
  }

  private newDynamicRenderable(block: Block) {
    let position = this.getCurrentPosition();

    let renderable: DynamicRenderable;

    renderable = new DynamicRenderable(new Rectangle(this.getClosestGridPos(position[0]), this.getClosestGridPos(position[1]), block.blockSize[0], block.blockSize[1]), block.inverted, block.vertical, block.distance, block.velocity);

    return renderable;
  }

  private addToLevel(map: Map<number, RenderableSet>, block: Block, fullScreen?: boolean) {
    let set = map.get(block.key);

    let newRenderable = this.newRenderable(this.block, fullScreen);

    if (set) {
      set.renderables.push(newRenderable);
    } else {
      map.set(block.key, new RenderableSet([newRenderable], block.textureSize));
    }
  }

  private deleteFromLevel(map: Map<number, RenderableSet>, mouseArea: Rectangle) {

    map.forEach((value: RenderableSet, key: number) => {
      let removeList: Renderable[] = [];
      for (let renderable of value.renderables) {
        if (this.collisionHelper.aabbCheck(renderable.area, mouseArea)) {
          removeList.push(renderable);
        }
      }

      this.remove(removeList, value.renderables);
    });

  }

  private deleteDynamic(map: Map<number, DynamicRenderableSet>, mouseArea: Rectangle) {
    map.forEach((value: DynamicRenderableSet, key: number) => {
      let removeList: Renderable[] = [];
      for (let renderable of value.renderables) {
        if (this.collisionHelper.aabbCheck(renderable.area, mouseArea)) {
          removeList.push(renderable);
        }
      }

      this.remove(removeList, value.renderables);
    });
  }

  private remove(removeList: object[], mainList: object[]) {
    for (let remove of removeList) {
      let index = mainList.indexOf(remove);

      if (index != -1) {
        mainList.splice(index, 1);
      }
    }
  }

  private newRenderable(block: Block, fullScreen?: boolean) {
    let position = this.getCurrentPosition();

    let renderable: Renderable;

    if (block.type == BlockType.Enemy || block.type == BlockType.Player || block.type == BlockType.End) {
      renderable = new Renderable(new Rectangle(this.getClosestGridPos(position[0]), this.getClosestGridPos(position[1]), block.textureSize[0], block.textureSize[1]));
    } else {
      if (fullScreen) {
        renderable = new Renderable(new Rectangle(0, 0, this.levelService.level.gameSize[0], this.levelService.level.gameSize[0]));
      } else {
        renderable = new Renderable(new Rectangle(this.getClosestGridPos(position[0]), this.getClosestGridPos(position[1]), block.blockSize[0], block.blockSize[1]));
      }
    }

    return renderable;
  }

  private getCurrentPosition() {
    let x = this.mousePosition[0] + this.levelService.level.camera[0];
    let y = this.mousePosition[1] + this.levelService.level.camera[1];

    return [x, y];
  }

  private getClosestGridPos(position: number) {
    return Math.round(position / this.gridSize) * this.gridSize;
  }

  private delete() {
    let currentPosition = this.getCurrentPosition();
    let mouseCollisionArea = new Rectangle(currentPosition[0], currentPosition[1], 1, 1);

    this.deleteFromLevel(this.levelService.level.tiles, mouseCollisionArea);
    this.deleteFromLevel(this.levelService.level.enemies, mouseCollisionArea);
    this.deleteFromLevel(this.levelService.level.player, mouseCollisionArea);
    this.deleteFromLevel(this.levelService.level.end, mouseCollisionArea);
    this.deleteDynamic(this.levelService.level.dynamicTiles, mouseCollisionArea);

  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    let editrorElement = this.canvas.nativeElement.getBoundingClientRect();
    let x = event.clientX - editrorElement.left;
    let y = event.clientY - editrorElement.top;

    this.mousePosition = [x, y];
  }

  @HostListener('document:keydown', ['$event'])
  private onkeydown(event: KeyboardEvent) {
    if (event.keyCode == 46) {
      this.delete();
    }
  }
}
