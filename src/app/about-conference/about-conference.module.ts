import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutConferencePageRoutingModule } from './about-conference-routing.module';

import { AboutConferencePage } from './about-conference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutConferencePageRoutingModule
  ],
  declarations: [AboutConferencePage]
})
export class AboutConferencePageModule {}
