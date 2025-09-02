import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExhibitorsReportPageRoutingModule } from './exhibitors-report-routing.module';

import { ExhibitorsReportPage } from './exhibitors-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExhibitorsReportPageRoutingModule
  ],
  declarations: [ExhibitorsReportPage]
})
export class ExhibitorsReportPageModule {}
