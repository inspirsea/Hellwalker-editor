import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { ResourceService, AssetLoaderService, LevelService  } from './shared/service';
import { AssetResolve } from './shared/resolver/asset-resolve';
import { EditorToolsComponent } from './components/editor-tools/editor-tools.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ModalComponent } from './components/modal/modal.component';

const appRoutes: Routes = [
  {
    path: "edit",
    component: EditorComponent,
    resolve: {
      asset: AssetResolve
    }
  },
  { path: "**", redirectTo: "edit" }
];

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    EditorToolsComponent,
    OverviewComponent,
    ModalComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ResourceService,
    AssetResolve,
    AssetLoaderService,
    LevelService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
