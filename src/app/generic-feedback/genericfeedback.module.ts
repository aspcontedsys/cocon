import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericFeedbackRoutingModule } from './genericfeedback-routing.module';

import { Genericfeedback } from './genericfeedback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GenericFeedbackRoutingModule
  ],
  declarations: [Genericfeedback]
})
export class GenericFeedbackPageModule {}
