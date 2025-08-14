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

  constructor(
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
   

    // Static demo data for now
    this.notifications = [
      { title: 'Welcome!', body: 'Thanks for joining us.', time: 'Just now' },
      { title: 'Update Available', body: 'Version 2.1 released.', time: '2h ago' },
      { title: 'Event Reminder', body: 'Don’t miss tomorrow’s meeting.', time: '1d ago' },
      { title: 'New Message', body: 'You have a message from Alex.', time: '3d ago' },
    ];

    // Set filtered list initially
    this.filteredNotifications = [...this.notifications];
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchTerm = '';
      this.filteredNotifications = [...this.notifications];
    }
  }

  filterNotifications() {
    const term = this.searchTerm.toLowerCase();
    this.filteredNotifications = this.notifications.filter(
      n =>
        (n.title && n.title.toLowerCase().includes(term)) ||
        (n.body && n.body.toLowerCase().includes(term))
    );
  }

  goBack() {
    this.location.back();
  }
}
