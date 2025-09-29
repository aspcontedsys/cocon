import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../../services/data/data.service';
import { notificationNotifications,notificationMessages } from '../models/cocon.models';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: false
})
export class NotificationPage implements OnInit {

  notifications: notificationNotifications[] = [];
  messages: notificationMessages[] = [];

  filteredNotifications: any[] = [];
  searchTerm: string = '';
  isSearchVisible: boolean = false;

  selectedTab: 'appnotifications' | 'messages' = 'appnotifications';

  constructor(
    private location: Location,
    private dataService: DataService,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.dataService.getNotifications().then((response: any) => {      
      this.notifications = response.notifications;
      this.messages = response.messages;
      this.filterByTab();
    });
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchTerm = '';
      this.filterByTab();
    }
  }

  filterByTab() {
    if (this.selectedTab === 'appnotifications') {
      this.filteredNotifications = this.notifications;
    } else {
      this.filteredNotifications = this.messages;
    }

    if (this.searchTerm.trim() !== '') {
      this.filterNotifications();
    }
  }

  filterNotifications() {
    const term = this.searchTerm.toLowerCase();
    this.filteredNotifications = this.filteredNotifications.filter(
      n =>
        (n.title && n.title.toLowerCase().includes(term)) ||
        (n.body && n.body.toLowerCase().includes(term))
    );
  }

  goBack() {
    this.location.back();
  }
  accept(conversationId :any) {    
    this.chatService.updateChatRequest(conversationId, true);
    this.loadNotifications();
  }
   reject(conversationId :any) {
    this.chatService.updateChatRequest(conversationId, false);
    this.loadNotifications();
  }
}
