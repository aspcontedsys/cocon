import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShuttleServicePageRoutingModule } from './shuttle-service-routing.module';

import { ShuttleServicePage } from './shuttle-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShuttleServicePageRoutingModule
  ],
  declarations: [ShuttleServicePage]
})
export class ShuttleServicePageModule {}
