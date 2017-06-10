import { Rectangle } from '../'
import { DynamicTileData, RenderableData } from './';

export class LevelData {
	
	public tiles: RenderableData[];
	public background: RenderableData;
	public decorativeTiles: RenderableData[];
	public dynamicTiles: DynamicTileData[];
	public enemies: RenderableData[];
	public player: [number, number];
	public camera: [number, number];
	public gameSize: [number, number];
	public end: [number, number];
	public name: string;
	
}