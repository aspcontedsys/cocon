import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { AboutConference } from '../models/cocon.models';

@Component({
  selector: 'app-about-conference',
  templateUrl: './about-conference.page.html',
  styleUrls: ['./about-conference.page.scss'],
  standalone: false
})
export class AboutConferencePage implements OnInit {
  aboutConference: AboutConference = { about_conference: "" };
  isLoading = true;
  
  constructor(
    private navCtrl: NavController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadAboutConference();
  }

  async loadAboutConference() {
    try {
      const data = await this.dataService.getAboutConference();
      if (data) {
        this.aboutConference = data;
      }
    } catch (error) {
      console.error('Error loading about conference:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
