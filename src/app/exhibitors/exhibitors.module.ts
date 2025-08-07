import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExhibitorsPageRoutingModule } from './exhibitors-routing.module';

import { ExhibitorsPage } from './exhibitors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExhibitorsPageRoutingModule
  ],
  declarations: [ExhibitorsPage]
})
export class ExhibitorsPageModule {}
