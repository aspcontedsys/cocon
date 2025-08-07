import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HelpPage } from './help.page';
import { HelpPageRoutingModule } from './help-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageRoutingModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}