import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import { Asset, TileAsset, TextureResource } from '../model';

@Injectable()
export class AssetLoaderService {

  constructor(private http: Http) {
  }

  private shaderUrl = "assets/shader/";
  private textureUrl = "assets/texture/";

  public getAsset(textureResources: TextureResource[]) {
    return Observable.create(obs => {
      Observable.forkJoin(
        this.loadShader("editorFragmentShader.c"),
        this.loadShader("editorVertexShader.c"),
        this.loadTextures(textureResources)
      ).subscribe(result => {
        let asset = new Asset();
        asset.editorFragmentShader = result[0];
        asset.editorVertexShader = result[1];
        asset.tileTextures = result[2];

        obs.next(asset);
        obs.complete();
      })
    })
  }

  private loadShader(fileName: string) {
    return this.http.get(this.shaderUrl + fileName).map(this.responseToString);
  }

  private loadTextures(textureResources: TextureResource[]): Observable<Map<number, TileAsset>> {
    return Observable.create((obs: Observer<Map<number, TileAsset>>) => {
      let textures = new Map<number, TileAsset>();
      let count = 0;
      for (let textureResource of textureResources) {
        let texture = new Image();
        texture.src = this.textureUrl + textureResource.name;
        texture.onload = () => {
          count++;
          let key = +textureResource.name.replace("tile", "").replace(".png", "");
          textures.set(key, new TileAsset(key, texture, textureResource.size));

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
