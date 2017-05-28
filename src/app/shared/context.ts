import { Observable, Subscription, Observer } from 'rxjs';
import { ShaderType, Asset, RenderableAsset } from '../shared/model';

export class Context {
	public editorShaderProgram: WebGLProgram;
	public gl: WebGLRenderingContext;
	public tileTextures = new Map<number, WebGLTexture>();

	constructor(asset: Asset, width: number, height: number, canvas: HTMLCanvasElement) {
		this.initContext(width, height, canvas);
		this.initShaders(asset);
	}

	public clear(color: number[]) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.clearColor(color[0], color[1], color[2], color[3]);
	}

	private initContext(width: number, height: number, canvas: HTMLCanvasElement) {
		canvas.width = width;
		canvas.height = height;
		this.gl = canvas.getContext("experimental-webgl");

		console.log("Context initialized...");
	}

	private initShaders(asset: Asset) {
		let vertexShader = this.compileShader(asset.editorVertexShader, ShaderType.Vertex);
		let fragmentShader = this.compileShader(asset.editorFragmentShader, ShaderType.Fragment);

		this.editorShaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.editorShaderProgram, vertexShader);
		this.gl.attachShader(this.editorShaderProgram, fragmentShader);
		this.gl.linkProgram(this.editorShaderProgram);
		if (!this.gl.getProgramParameter(this.editorShaderProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.editorShaderProgram));
		}

		this.initAssetTextures(this.gl, asset);
	}

	private initAssetTextures(gl: WebGLRenderingContext, asset: Asset) {

		this.initTextures(gl, asset.tileTextures);
		this.initTextures(gl, asset.editorTextures);
		this.initTextures(gl, asset.enemyTextures);
		this.initTextures(gl, asset.playerTexture);
		this.initTextures(gl, asset.endTexture);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);

	}

	private initTextures(gl: WebGLRenderingContext, textureMap: Map<number, RenderableAsset>) {
		textureMap.forEach((tileAsset: RenderableAsset, key: number) => {

			let texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tileAsset.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

			this.tileTextures.set(key, texture);
		});
	}

	private compileShader(source: string, shaderType: ShaderType) {
		var shader: WebGLShader;

		if (shaderType == ShaderType.Fragment) {
			shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		} else if (shaderType == ShaderType.Vertex) {
			shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		}

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.log("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}
}