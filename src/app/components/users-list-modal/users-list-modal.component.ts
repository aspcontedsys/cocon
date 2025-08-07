import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

// Modal options for the users list
export const usersListModalOptions = {
  initialBreakpoint: 0.9,
  breakpoints: [0, 0.9],
  handle: true,
  backdropBreakpoint: 0.5,
  cssClass: 'users-list-modal',
  showBackdrop: true,
  canDismiss: true,
  backdropDismiss: true,
  animated: true,
  mode: 'ios' as const  // Using 'as const' to ensure type safety
};

@Component({
  selector: 'app-users-list-modal',
  templateUrl: './users-list-modal.component.html',
  styleUrls: ['./users-list-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class UsersListModalComponent {
  @Input() users: any[] = [];

  constructor(
    private modalController: ModalController, 
    private router: Router
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }
  openChat(user: any) {
    this.modalController.dismiss();
    //to be updated after fetching conversation id
    this.router.navigate(['/home/chatpage', user.id,user.conversationid?user.conversationid:0]);
  }
}
