import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttractionPageRoutingModule } from './attraction-routing.module';

import { AttractionPage } from './attraction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttractionPageRoutingModule
  ],
  declarations: [AttractionPage]
})
export class AttractionPageModule {}
