import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExhibitorsReportPage } from './exhibitors-report.page';

const routes: Routes = [
  {
    path: '',
    component: ExhibitorsReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExhibitorsReportPageRoutingModule {}
