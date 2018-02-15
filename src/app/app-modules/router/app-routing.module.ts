import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RequestListModule} from '../../request-list';
import {RequestListComponent} from '../../request-list/request-list.component';

const routes: Routes = [
  {path: '', component: RequestListComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
