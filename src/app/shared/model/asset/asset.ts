import { TileAsset } from '../';

export class Asset {
	public editorVertexShader: string;
	public editorFragmentShader: string;
	public tileTextures: Map<number, TileAsset>;
}