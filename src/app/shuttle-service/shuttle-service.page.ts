import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { itineraries, itinery } from '../models/cocon.models';

@Component({
  selector: 'app-shuttle-service',
  templateUrl: './shuttle-service.page.html',
  styleUrls: ['./shuttle-service.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ShuttleServicePage implements OnInit {
  // Default tab = Hotel → Venue
  segments: string[] = [];
  isLoading = true;

  // Initialize with empty arrays that will be populated from API
  itineraries: itinery[] = [];
  itinerariesList: itineraries[] = [];

  constructor(
    private navCtrl: NavController, 
    private toastCtrl: ToastController,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    await this.loadItinery();
  }

  async loadItinery() {
    try {
      const itineraries = await this.dataService.getItineraries();
      this.itineraries = itineraries;
      this.loadSegments();
      this.loaditenaries(this.segments[0]);
    } catch (error) {
      console.error('Error loading itineraries:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to load shuttle information',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  loaditenaries(segment: string){
    this.itinerariesList = this.itineraries.find(itinerary => itinerary.category_name === segment)?.itineraries || [];
  }

  loadSegments(){
    this.segments = this.itineraries.map(itinerary => itinerary.category_name);
  }


  goBack() {
    this.navCtrl.back();
  }

  callDriver(phone: string) {
    window.open(`tel:${phone}`, '_system');
  }
}
