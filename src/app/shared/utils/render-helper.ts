import { TileRenderCall, Tile, Rectangle } from '../../shared/model';

export class RenderHelper {

	private static instance: RenderHelper = new RenderHelper();

	constrcuctor() {
		if (RenderHelper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		RenderHelper.instance = this;
	}

	public static getInstance() {
		return RenderHelper.instance;
	}

	public getVertecies(area: Rectangle, currentVertecies: number[]) {
		var x1 = area.x;
		var x2 = area.x + area.width;
		var y1 = area.y;
		var y2 = area.y + area.height;

		var newVertecies = [
			x1, y1,
			x2, y2,
			x2, y1,
			x1, y1,
			x2, y2,
			x1, y2
		]

		currentVertecies.push.apply(currentVertecies, newVertecies);

		return currentVertecies;
	}

	public getIndecies(currentIndecies: number[]) {

		var vertexIndices = [
			currentIndecies.length, currentIndecies.length + 1, currentIndecies.length + 2, currentIndecies.length + 3, currentIndecies.length + 4, currentIndecies.length + 5
		];

		currentIndecies.push.apply(currentIndecies, vertexIndices);

		return currentIndecies;
	}

	public getTextureCoordinates(tile: Tile, currentTextureCoordinates: number[], size: [number, number]) {

        let x1 = 0;
        let x2 = tile.area.width / size[0];
        let y1 = 0;
        let y2 = tile.area.height /size[1];

		let textureCoordinates = [
            x1, y1,
			x2, y2,
			x2, y1,
			x1, y1,
			x2, y2,
			x1, y2
        ];

		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);

		return currentTextureCoordinates;
	}

    public getTileRenderCoords(renderCall: TileRenderCall, tile: Tile, size: [number, number]) {

        renderCall.vertecies = this.getVertecies(tile.area, renderCall.vertecies);
        renderCall.indecies = this.getIndecies(renderCall.indecies);
        renderCall.textureCoords = this.getTextureCoordinates(tile, renderCall.textureCoords, size);

        return renderCall;
    }

}