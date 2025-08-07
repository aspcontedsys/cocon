import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone:false
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() duration: number = 3000; // 3 seconds default
  @Output() onClose = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.close();
    }, this.duration);
  }

  close(): void {
    this.onClose.emit();
  }
}
