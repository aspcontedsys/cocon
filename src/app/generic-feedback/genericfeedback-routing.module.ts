import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Genericfeedback } from './genericfeedback.page';

const routes: Routes = [
  {
    path: '',
    component: Genericfeedback
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericFeedbackRoutingModule {}
