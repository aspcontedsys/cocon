import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AccommodationPageRoutingModule } from './accommodation-routing.module';
import { AccommodationPage } from './accommodation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccommodationPageRoutingModule,
    AccommodationPage 
  ]
})
export class AccommodationPageModule {}
