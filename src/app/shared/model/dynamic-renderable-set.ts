import { DynamicRenderable } from './dynamic-renderable';

export class DynamicRenderableSet {
    constructor(
        public renderables: DynamicRenderable[],
        public size: [number, number]
    ) {
    }
}