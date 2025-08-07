import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { StallLayoutPageRoutingModule } from './stall-layout-routing.module';
import { StallLayoutPage } from './stall-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule,
    StallLayoutPageRoutingModule
  ],
  declarations: [StallLayoutPage]
})
export class StallLayoutPageModule {}
