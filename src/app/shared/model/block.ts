import { BlockType } from './';

export class Block {
    constructor(
        public key: number,
        public textureSize: [number, number],
        public blockSize: [number, number],
        public type: BlockType,
        public inverted: boolean,
        public vertical: boolean,
        public distance: number,
        public velocity: number
    ) {}
}