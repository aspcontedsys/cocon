import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../../services/data/data.service';
import { notificationNotifications,notificationMessages } from '../models/cocon.models';

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

  selectedTab: 'default' | 'messages' = 'default';

  constructor(
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.dataService.getNotifications().then((response: any) => {
      this.notifications = response.data.notifications;
      this.messages = response.data.messages;
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
    if (this.selectedTab === 'default') {
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
}
