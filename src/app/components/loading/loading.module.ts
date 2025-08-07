import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { LoadingService } from '../../../services/loading/loading.service';

@NgModule({
  imports: [CommonModule],
  providers: [LoadingService]
})
export class LoadingModule {}
