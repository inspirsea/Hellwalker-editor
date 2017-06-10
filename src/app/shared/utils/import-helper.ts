import { Level, RenderableSet, Renderable, TextureResource, Rectangle, DynamicRenderableSet, DynamicRenderable } from '../model';
import { ResourceService } from '../service'
import { LevelData, RenderableData, DynamicTileData } from '../model/integration';

export class ImportHelper {
    private static instance: ImportHelper = new ImportHelper();

    constrcuctor() {
        if (ImportHelper.instance) {
            throw new Error('Static class cant be instanced!');
        }

        ImportHelper.instance = this;
    }

    public static getInstance() {
        return ImportHelper.instance;
    }

    public import(levelRaw: string, resourceService: ResourceService) {
        let levelData: LevelData = JSON.parse(levelRaw);

        let level: Level = this.levelDataToLevel(levelData, resourceService);

        return level;
    }

    public levelDataToLevel(levelData: LevelData, resourceService: ResourceService) {
        let level = new Level();
        let playerResource = resourceService.playerResource[0];
        let endResource = resourceService.endResource[0];
        let tileResources = resourceService.textureResources;
        let enemyResources = resourceService.enemyTextureResources;
        
        level.player = this.toSingleMapRenderable(playerResource, new Renderable(new Rectangle(levelData.player[0], levelData.player[1], playerResource.size[0], playerResource.size[1])));
        level.end = this.toSingleMapRenderable(endResource, new Renderable(new Rectangle(levelData.end[0], levelData.end[1], endResource.size[0], endResource.size[1])));
        level.tiles = this.toMapRenderable(tileResources, levelData.tiles);
        level.decorativeTiles = this.toMapRenderable(tileResources, levelData.decorativeTiles);
        if(levelData.background) {
            level.background = this.toMapRenderable(tileResources, [levelData.background]);
        }
        level.enemies = this.toMapRenderable(enemyResources, levelData.enemies);
        level.name = levelData.name;
        level.dynamicTiles = this.toDynamicMapRenderable(tileResources, levelData.dynamicTiles);
        level.camera = [levelData.camera[0], levelData.camera[1]];
        level.gameSize = [levelData.gameSize[0], levelData.gameSize[1]];

        return level;
    }

    private toDynamicMapRenderable(resources: TextureResource[], renderableData: DynamicTileData[]) {
        let map = new Map<number, DynamicRenderableSet>();

        for (let data of renderableData) {
            if (map.has(data.key)) {
                let set = map.get(data.key);

                set.renderables.push(this.newDynamicRenderable(data));
            } else {
                let resource = resources.find(it => it.key == data.key);
                map.set(data.key, new DynamicRenderableSet([this.newDynamicRenderable(data)], [resource.size[0], resource.size[1]]));
            }
        }

        return map;
    }

    private toMapRenderable(resources: TextureResource[], renderableData: RenderableData[]) {
        let map = new Map<number, RenderableSet>();

        for (let data of renderableData) {
            if (map.has(data.key)) {
                let set = map.get(data.key);

                set.renderables.push(this.newRenderable(data.area));
            } else {
                let resource = resources.find(it => it.key == data.key);
                map.set(data.key, new RenderableSet([this.newRenderable(data.area)], [resource.size[0], resource.size[1]]));
            }
        }

        return map;

    }

    private newDynamicRenderable(dynamicData: DynamicTileData) {
        return new DynamicRenderable(
            new Rectangle(dynamicData.tile.x, dynamicData.tile.y, dynamicData.tile.width, dynamicData.tile.height),
            dynamicData.inverse,
            dynamicData.vertical,
            dynamicData.distance,
            dynamicData.velocity
        );
    }

    private newRenderable(area: Rectangle) {
        return new Renderable(new Rectangle(area.x, area.y, area.width, area.height))
    }

    private toSingleMapRenderable(resource: TextureResource, renderable: Renderable) {
        let map = new Map<number, RenderableSet>();

        map.set(resource.key, new RenderableSet([renderable], resource.size));

        return map;
    }

}