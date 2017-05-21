import { Tile } from './';

export class TileSet {
    constructor(
        public tiles: Tile[],
        public size: [number, number]
    ){}
}