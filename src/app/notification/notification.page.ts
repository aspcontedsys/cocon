import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: false
})
export class NotificationPage implements OnInit {

  notifications: any[] = [];
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
    // Demo data
    this.notifications = [
      { title: 'Welcome!', body: 'Thanks for joining us.', time: 'Just now', type: 'default' },
      { title: 'Update Available', body: 'Version 2.1 released.', time: '2h ago', type: 'default' },
      { title: 'Event Reminder', body: 'Don’t miss tomorrow’s meeting.', time: '1d ago', type: 'default' },
      { title: 'New Message', body: 'You have a message from Alex.', time: '3d ago', type: 'messages' },
      { title: 'Message from John', body: 'Please check your tasks.', time: '5d ago', type: 'messages' },
    ];

    this.filterByTab();
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
      this.filteredNotifications = this.notifications.filter(n => n.type === 'default');
    } else {
      this.filteredNotifications = this.notifications.filter(n => n.type === 'messages');
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
