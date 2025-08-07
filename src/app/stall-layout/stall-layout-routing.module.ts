import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StallLayoutPage } from './stall-layout.page';

const routes: Routes = [
  {
    path: '',
    component: StallLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StallLayoutPageRoutingModule {}
