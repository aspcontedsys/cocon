import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { Speaker } from '../../app/models/cocon.models';
@Component({
  selector: 'app-delegates',
  templateUrl: './delegates.page.html',
  styleUrls: ['./delegates.page.scss'],
  standalone:false
})
export class DelegatesPage implements OnInit {
  searchTerm: string = '';
  showCancel: boolean = false;

  selectedUser: Speaker | null = null;
  speakers:Speaker[] = [];

  constructor(
    private navCtrl: NavController,
    private dataService:DataService
  ) {}

  ngOnInit(): void {
    this.getSpeakers();
  }

  async getSpeakers(){
    this.speakers = await this.dataService.getParticipants();
  }
  goBack(): void {
    this.navCtrl.navigateBack('/home/dashboard', {
      animationDirection: 'back',
      animated: true
    });
  }

  filteredUsers() {
    if (!this.searchTerm.trim()) {
      return this.speakers;
    }
    return this.speakers.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  cancelSearch(): void {
    this.searchTerm = '';
    this.showCancel = false;
  }

  hideCancel(): void {
    if (!this.searchTerm.trim()) {
      this.showCancel = false;
    }
  }

  openProfile(user: Speaker): void {
    this.selectedUser = user;
  }

  closeProfile(): void {
    this.selectedUser = null;
  }
}
