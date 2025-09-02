import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { Speaker } from '../../app/models/cocon.models';

@Component({
  selector: 'app-delegates',
  templateUrl: './delegates.page.html',
  styleUrls: ['./delegates.page.scss'],
  standalone: false
})
export class DelegatesPage implements OnInit {
  searchTerm: string = '';
  showCancel: boolean = false;

  selectedUser: Speaker | null = null;
  speakers: Speaker[] = [];

  constructor(
    private navCtrl: NavController,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getSpeakers();
  }

  /** Fetch all speakers from the data service */
  async getSpeakers() {
    this.speakers = await this.dataService.getParticipants();
   
  }

  /** Navigate back to dashboard */
  goBack(): void {
    this.navCtrl.navigateBack('/home/dashboard', {
      animationDirection: 'back',
      animated: true
    });
  }

  /** Filter speakers by search term */
  filteredUsers() {
    if (!this.searchTerm.trim()) {
      return this.speakers;
    }
    return this.speakers.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /** Cancel search input */
  cancelSearch(): void {
    this.searchTerm = '';
    this.showCancel = false;
  }

  /** Hide the cancel button if input is empty */
  hideCancel(): void {
    if (!this.searchTerm.trim()) {
      this.showCancel = false;
    }
  }

  /** Open speaker profile overlay */
  openProfile(user: Speaker): void {
    this.selectedUser = user;
  }

  /** Close speaker profile overlay */
  closeProfile(): void {
    this.selectedUser = null;
  }

  
  formattedDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB').split('/').join('-');
  }

  /** Open LinkedIn profile in a new tab */
  openLinkedIn(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
