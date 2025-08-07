import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { VenueLayoutPageRoutingModule } from './venue-layout-routing.module';

import { VenueLayoutPage } from './venue-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule,
    VenueLayoutPageRoutingModule
  ],
  declarations: [VenueLayoutPage]
})
export class VenueLayoutPageModule {}

