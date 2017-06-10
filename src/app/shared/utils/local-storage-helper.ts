import { Level } from '../../shared/model';
import { LevelData } from '../../shared/model/integration';
import { ExportHelper } from './export-helper';
import { ImportHelper } from './import-helper';
import { ResourceService } from '../service';

export class LocalStorageHelper {
    private static instance: LocalStorageHelper = new LocalStorageHelper();

    private levelKey = "HellwalkerLevels";
    private exportHelper = ExportHelper.getInstance();
    private importHelper = ImportHelper.getInstance();

    constrcuctor() {
        if (LocalStorageHelper.instance) {
            throw new Error('Static class cant be instanced!');
        }

        LocalStorageHelper.instance = this;
    }

    public static getInstance() {
        return LocalStorageHelper.instance;
    }

    public saveLevel(name: string, camera: [number, number], gameSize: [number, number], level: Level) {

        if (name != null) {
            let levels = this.getListItem(this.levelKey);

            levels[name] = this.exportHelper.toLevelData(level, camera, gameSize);

            this.saveItem(levels);
        }

    }

    public loadLevels(resourceService: ResourceService) {

        let levelDatas = this.getListItem(this.levelKey) as { [key: string]: any };

        let levels: Level[] = [];

        for (let name in levelDatas) {
            levels.push(this.importHelper.levelDataToLevel(levelDatas[name], resourceService));
        }

        return levels;
    }

    public deleteLevel(name: string) {
        let levelDatas = this.getListItem(this.levelKey) as { [key: string]: any };

        delete levelDatas[name];

        this.saveItem(levelDatas);
    }

    private getListItem(key: string) {
        let item = localStorage.getItem(key);

        let parsedItem: { [key: string]: any };
        if (!item) {
            parsedItem = {};
        } else {
            parsedItem = JSON.parse(item);
        }

        return parsedItem;
    }

    private saveItem(item: any) {
        localStorage.setItem(this.levelKey, JSON.stringify(item));
    }

}