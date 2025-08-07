import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttractionPage } from './attraction.page';

const routes: Routes = [
  {
    path: '',
    component: AttractionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttractionPageRoutingModule {}
