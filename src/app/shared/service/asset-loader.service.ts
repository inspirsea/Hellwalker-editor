import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import { Asset, RenderableAsset, TextureResource } from '../model';

@Injectable()
export class AssetLoaderService {

  constructor(private http: Http) {
  }

  private shaderUrl = "assets/shader/";
  private textureUrl = "assets/texture/";

  public getAsset(textureResources: TextureResource[], editorTextures: TextureResource[], enemyTextureResources: TextureResource[], playerResource: TextureResource[], endResource: TextureResource[]) {
    return Observable.create(obs => {
      Observable.forkJoin(
        this.loadShader("editorFragmentShader.c"),
        this.loadShader("editorVertexShader.c"),
        this.loadTextures(textureResources, "tile"),
        this.loadTextures(editorTextures, "editorutil"),
        this.loadTextures(enemyTextureResources, "enemy"),
        this.loadTextures(playerResource, "player"),
        this.loadTextures(endResource, "end")
      ).subscribe(result => {
        let asset = new Asset();
        asset.editorFragmentShader = result[0];
        asset.editorVertexShader = result[1];
        asset.tileTextures = result[2];
        asset.editorTextures = result[3];
        asset.enemyTextures = result[4];
        asset.playerTexture = result[5];
        asset.endTexture = result[6];

        obs.next(asset);
        obs.complete();
      })
    })
  }

  private loadShader(fileName: string) {
    return this.http.get(this.shaderUrl + fileName).map(this.responseToString);
  }

  private loadTextures(textureResources: TextureResource[], name: string): Observable<Map<number, RenderableAsset>> {
    return Observable.create((obs: Observer<Map<number, RenderableAsset>>) => {
      let textures = new Map<number, RenderableAsset>();
      let count = 0;
      for (let textureResource of textureResources) {
        let texture = new Image();
        texture.src = this.textureUrl + textureResource.name;
        texture.onload = () => {
          count++;
          let key = +textureResource.name.split(name)[0];
          textures.set(key, new RenderableAsset(key, texture, textureResource.size));

          if (count >= textureResources.length) {
            obs.next(textures);
            obs.complete();
          }
        }
      }
    });
  }

  private responseToString(response: Response) {
    return response.text();
  }



}
