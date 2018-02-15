import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RequestListComponent} from './request-list.component';

@NgModule({
  declarations: [
    RequestListComponent],
  imports: [
    BrowserAnimationsModule
  ],
  exports: [RequestListComponent],
  providers: []
})

export class RequestListModule {
}
