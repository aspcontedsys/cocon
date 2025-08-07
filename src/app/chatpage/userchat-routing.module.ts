import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserChatPage } from './userchat.page';

const routes: Routes = [
  {
    path: '',
    component: UserChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserChatPageRoutingModule {}
