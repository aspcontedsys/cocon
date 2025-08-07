import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DelegatesPageRoutingModule } from './delegates-routing.module';

import { DelegatesPage } from './delegates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DelegatesPageRoutingModule
  ],
  declarations: [DelegatesPage]
})
export class DelegatesPageModule {}
