import { Rectangle } from '../model';

export class CollisionHelper {

    private static instance: CollisionHelper = new CollisionHelper();

    constrcuctor() {
        if (CollisionHelper.instance) {
            throw new Error("Static class cant be instanced!");
        }

        CollisionHelper.instance = this;
    }

    public static getInstance() {
        return CollisionHelper.instance;
    }

    public aabbCheck(rect1: Rectangle, rect2: Rectangle) {
        return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y);
    }
}