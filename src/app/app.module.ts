import { BrowserModule } from '@angular/platform-browser';
import { NgModule, RootRenderer } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HydrationRootRenderer } from './hydration-renderer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    {provide: RootRenderer, useClass: HydrationRootRenderer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
