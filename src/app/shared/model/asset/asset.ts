import { RenderableAsset } from '../';

export class Asset {
	public editorVertexShader: string;
	public editorFragmentShader: string;
	public tileTextures: Map<number, RenderableAsset>;
	public enemyTextures: Map<number, RenderableAsset>;
	public editorTextures: Map<number, RenderableAsset>;
	public playerTexture: Map<number, RenderableAsset>;
	public endTexture: Map<number, RenderableAsset>;
}