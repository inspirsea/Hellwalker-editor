import { Context } from '../shared/context';
import { SettingsService } from '../shared/service';
import { TileRenderCall } from '../shared/model';

export class TileRenderer {

	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLShader;

	private vertexBuffer: WebGLBuffer;
	private textureCoordBuffer: WebGLBuffer;
	private indeciesBuffer: WebGLBuffer;

	private positionLocation: number;
	private textureCoordAttribute: number;
	private resolutionLocation : WebGLUniformLocation;

    constructor(private context: Context, private settingsService: SettingsService) {
		this.gl = this.context.gl;
		this.shaderProgram = this.context.editorShaderProgram;
		this.gl.useProgram(this.shaderProgram);

		this.gl.bindAttribLocation(this.shaderProgram, 0, "a_position");
		this.gl.bindAttribLocation(this.shaderProgram, 1, "a_texture_coord");

		this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
		this.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_texture_coord");
		
		this.resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");

		this.vertexBuffer = this.gl.createBuffer();
		this.textureCoordBuffer = this.gl.createBuffer();
		this.indeciesBuffer = this.gl.createBuffer();
    }

	public render(renderCalls: TileRenderCall[]) {
		this.gl.useProgram(this.shaderProgram);
		for(let renderCall of renderCalls) {
			
			this.gl.enableVertexAttribArray(this.positionLocation);
			this.gl.enableVertexAttribArray(this.textureCoordAttribute);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.vertecies), this.gl.STATIC_DRAW);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.textureCoords), this.gl.STATIC_DRAW);

			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indecies), this.gl.STATIC_DRAW);
			
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
			this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
			this.gl.vertexAttribPointer(this.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

			this.gl.uniform2f(this.resolutionLocation, this.settingsService.canvasWidth, this.settingsService.canvasHeight);

			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.tileTextures.get(renderCall.tileKey));
			
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
			this.gl.drawElements(this.gl.TRIANGLES, renderCall.indecies.length, this.gl.UNSIGNED_SHORT, 0)

			this.gl.disableVertexAttribArray(this.positionLocation);
			this.gl.disableVertexAttribArray(this.textureCoordAttribute);
		}
	}

}