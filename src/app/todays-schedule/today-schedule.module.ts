import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodaySchedulePageRoutingModule } from './today-schedule-routing.module';

import { TodaySchedulePage } from './today-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodaySchedulePageRoutingModule
  ],
  declarations: [TodaySchedulePage]
})
export class TodaySchedulePageModule {}
