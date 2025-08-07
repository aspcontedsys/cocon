import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserChatPageRoutingModule } from './userchat-routing.module';

import { UserChatPage } from './userchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserChatPageRoutingModule
  ],
  declarations: [UserChatPage]
})
export class UserChatPageModule {}
