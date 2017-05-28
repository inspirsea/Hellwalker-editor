import { Renderable } from './';

export class RenderableSet {
    constructor(
        public renderables: Renderable[],
        public size: [number, number]
    ){}
}