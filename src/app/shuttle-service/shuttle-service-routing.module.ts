import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShuttleServicePage } from './shuttle-service.page';

const routes: Routes = [
  {
    path: '',
    component: ShuttleServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShuttleServicePageRoutingModule {}
