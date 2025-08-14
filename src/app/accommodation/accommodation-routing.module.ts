import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccommodationPage } from './accommodation.page';

const routes: Routes = [
  {
    path: '',
    component: AccommodationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccommodationPageRoutingModule {}
