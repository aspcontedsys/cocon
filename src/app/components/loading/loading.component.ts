import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
  @Input() fullScreen: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
