import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shuttle-service',
  templateUrl: './shuttle-service.page.html',
  styleUrls: ['./shuttle-service.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ShuttleServicePage implements OnInit {

  // Default tab = Hotel → Venue
  segment: string = 'hotel-venue';

  // Tab 3: Vehicle Details
  hotelToEvent = [
    { code: 'SH-01', plate: 'AB123CD', capacity: 40, driver: 'Alexxo', phone: '+123456789', time: '08:30 AM' },
    { code: 'SH-02', plate: 'XY456ZT', capacity: 35, driver: 'Alexis', phone: '+987654321', time: '09:00 AM' }
  ];

  // Tab 1: Hotel ➝ Venue
  hotelToVenueRoutes = [
    {
      name: 'Route A',
      vehicle: 'AB123CD',
      capacity: 40,
      driver: 'Alexxo',
      phone: '+123456789',
      stops: [
        { hotel: 'Hotel Plaza', time: '09:00 AM', eta: '09:00 AM', status: 'arrived' },
        { hotel: 'Hotel Royal', time: '09:15 AM', eta: '09:15 AM', status: 'upcoming' },
        { hotel: 'Hotel Garden', time: '09:30 AM', eta: '09:30 AM', status: 'upcoming' },
        { hotel: 'Venue Hall', time: '09:50 AM', eta: '09:50 AM', status: 'upcoming' }
      ]
    }
  ];

  // Tab 2: Venue ➝ Hotel
  venueToHotelRoutes = [
    {
      name: 'Return Route A',
      vehicle: 'LM789QR',
      capacity: 30,
      driver: 'Michael Lee',
      phone: '+112233445',
      stops: [
        { hotel: 'Venue Hall', time: '05:30 PM', eta: '05:30 PM', status: 'arrived' },
        { hotel: 'Hotel Plaza', time: '05:50 PM', eta: '05:50 PM', status: 'upcoming' },
        { hotel: 'Hotel Royal', time: '06:10 PM', eta: '06:10 PM', status: 'upcoming' },
        { hotel: 'Hotel Garden', time: '06:30 PM', eta: '06:30 PM', status: 'upcoming' }
      ]
    }
  ];

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.simulateLiveUpdates();
  }

  goBack() {
    this.navCtrl.back();
  }

  callDriver(phone: string) {
    window.open(`tel:${phone}`, '_system');
  }

 
  async simulateLiveUpdates() {
    setTimeout(async () => {
      this.hotelToVenueRoutes[0].stops[3].status = 'arrived';
      this.hotelToVenueRoutes[0].stops[3].eta = '09:51 AM';

      const toast = await this.toastCtrl.create({
        message: 'Update: Hotel → Venue shuttle has arrived at Venue Hall.',
        duration: 3000,
        color: 'success'
      });
      toast.present();
    }, 8000);
  }
}
