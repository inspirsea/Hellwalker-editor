import { Rectangle } from './';

export class DynamicRenderable {
    constructor(
        public area: Rectangle,
        public inverse: boolean,
        public vertical: boolean,
        public distance: number,
        public velocity: number) {
    }
}