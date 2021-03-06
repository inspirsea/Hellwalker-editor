import { RenderableSet, DynamicRenderableSet } from './';

export class Level {
    public name: string;
    public tiles: Map<number, RenderableSet> = new Map<number, RenderableSet>();
    public decorativeTiles: Map<number, RenderableSet> = new Map<number, RenderableSet>();
    public background: Map<number, RenderableSet> = new Map<number, RenderableSet>();
    public dynamicTiles: Map<number, DynamicRenderableSet> = new Map<number, DynamicRenderableSet>();
    public enemies: Map<number, RenderableSet> = new Map<number, RenderableSet>();
    public player: Map<number, RenderableSet> = new Map<number, RenderableSet>();
    public end: Map<number, RenderableSet> = new Map<number, RenderableSet>();
    public gameSize: [number, number] = [2400, 1600];
    public camera: [number, number] = [0, 0];
}