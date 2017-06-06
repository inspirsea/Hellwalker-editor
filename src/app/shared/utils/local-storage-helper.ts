import { Level } from '../../shared/model';
import { LevelData } from '../../shared/model/interation';
import { ExportHelper } from './export-helper';

export class LocalStorageHelper {
    private static instance: LocalStorageHelper = new LocalStorageHelper();

    private levelKey = "HellwalkerLevels";
    private exportHelper = ExportHelper.getInstance();

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

        let levels = this.getListItem(this.levelKey);

        levels[name] = this.exportHelper.toLevelData(level, camera, gameSize);

        this.saveItem(levels);
    }

    public loadLevel(name: string) {

    }

    private getListItem(key: string) {
        let item = localStorage.getItem(key);

        let parsedItem: { [key: string]: any };
        if(!item) {
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