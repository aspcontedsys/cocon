import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelegatesPage } from './delegates.page';

const routes: Routes = [
  {
    path: '',
    component: DelegatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegatesPageRoutingModule {}
