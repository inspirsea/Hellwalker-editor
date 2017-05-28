import { RenderCall, Renderable, Rectangle, RenderableSet, Level, DynamicRenderable, DynamicRenderableSet } from '../../shared/model';
import { LevelData, RenderableData, DynamicTileData } from '../../shared/model/interation';

export class ExportHelper {

    private static instance: ExportHelper = new ExportHelper();

    constrcuctor() {
        if (ExportHelper.instance) {
            throw new Error("Static class cant be instanced!");
        }

        ExportHelper.instance = this;
    }

    public static getInstance() {
        return ExportHelper.instance;
    }

    public export(level: Level, camera: [number, number], gameSize: [number, number]) {

        let levelData = this.toLevelData(level, camera, gameSize);

        let jsonLevel = JSON.stringify(levelData);
        let blob = new Blob([jsonLevel], { type: "application/json" });
        let textToSaveAsURL = window.URL.createObjectURL(blob);
        let fileNameToSaveAs = "level" + Date.now() + ".json";

        let downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = this.destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);

        downloadLink.click();
    }

    private toLevelData(level: Level, camera: [number, number], gameSize: [number, number]) {

        let levelData = new LevelData();

        let playerColl = this.toRenderableData(level.player);
        let player: RenderableData;
        if(playerColl.length > 0) {
            player = playerColl[0];
        } else {
            player = new RenderableData();
            player.area = new Rectangle(0, 0, 0, 0);
        }

        let endColl = this.toRenderableData(level.end);
        let end: RenderableData;
        if(playerColl.length > 0) {
            end = endColl[0];
        } else {
            end = new RenderableData();
            end.area = new Rectangle(500, 500, 0, 0);
        }

        levelData.tiles = this.toRenderableData(level.tiles);
        levelData.enemies = this.toRenderableData(level.enemies);
        levelData.dynamicTiles = this.toDynamicRenderableData(level.dynamicTiles);
        levelData.player = [player.area.x, player.area.y];
        levelData.camera = [camera[0], camera[1]];
        levelData.gameSize = [gameSize[0], gameSize[1]];
        levelData.end = [end.area.x, end.area.y];

        return levelData;
    }

    private toDynamicRenderableData(map: Map<number, DynamicRenderableSet>) {
        let renderableDataCollection: DynamicTileData[] = [];
        
        map.forEach((value: DynamicRenderableSet, key: number) => {
            for(let renderable of value.renderables) {
                let renderableData = new DynamicTileData();
                renderableData.tile = new Rectangle(renderable.area.x, renderable.area.y, renderable.area.width, renderable.area.height);
                renderableData.inverse = renderable.inverse;
                renderableData.vertical = renderable.vertical;
                renderableData.distance = renderable.distance;
                renderableData.velocity = renderable.velocity;
                renderableData.key = key;

                renderableDataCollection.push(renderableData);
            }
        });

        return renderableDataCollection;
    }

    private toRenderableData(map: Map<number, RenderableSet>) {
        
        let renderableDataCollection: RenderableData[] = [];
        
        map.forEach((value: RenderableSet, key: number) => {
            for(let renderable of value.renderables) {
                let renderableData = new RenderableData();
                renderableData.area = new Rectangle(renderable.area.x, renderable.area.y, renderable.area.width, renderable.area.height);
                renderableData.key = key;

                renderableDataCollection.push(renderableData);
            }
        });

        return renderableDataCollection;
    }

    private destroyClickedElement(event: any) {
        document.body.removeChild(event.target);
    }
}