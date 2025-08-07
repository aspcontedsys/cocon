import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodaySchedulePage } from './today-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: TodaySchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodaySchedulePageRoutingModule {}
