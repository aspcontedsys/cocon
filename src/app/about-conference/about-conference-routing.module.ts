import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutConferencePage } from './about-conference.page';

const routes: Routes = [
  {
    path: '',
    component: AboutConferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutConferencePageRoutingModule {}

