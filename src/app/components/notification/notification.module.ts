import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../../../services/notification/notification.service';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, IonicModule],
  exports: [NotificationComponent],
  providers: [NotificationService]
})
export class NotificationModule {}
