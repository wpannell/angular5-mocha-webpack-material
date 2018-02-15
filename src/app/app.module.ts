import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-modules/router';
import { RequestListModule } from './request-list';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RequestListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
