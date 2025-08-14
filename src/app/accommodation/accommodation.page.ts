import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.page.html',
  styleUrls: ['./accommodation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AccommodationPage {
  searchTerm = '';
  categories = ['All', 'Resort', 'Hotel', 'Homestay'];

  accommodations = [
    {
      name: 'Green Valley Resort',
      location: 'Munnar, Kerala',
      description: 'A peaceful stay surrounded by tea plantations.',
      image: 'assets/green-valley-resort.jpg',
      price: 3500,
      category: 'Resort',
      mapUrl: 'https://maps.app.goo.gl/ez48AmnG6tNWVyvT8',
      bookingUrl: 'https://booking.example.com/green-valley'
    },
    {
      name: 'Sea Breeze Hotel',
      location: 'Kovalam Beach',
      description: 'Beachfront luxury with ocean view rooms.',
      image: 'assets/sea-breeze.jpg',
      price: 5000,
      category: 'Hotel',
      mapUrl: 'https://maps.app.goo.gl/Pm3oNugsgJ9VmP71A',
      bookingUrl: 'https://booking.example.com/sea-breeze'
    },
    {
      name: 'Hilltop Homestay',
      location: 'Wayanad',
      description: 'Experience the warmth of local hospitality.',
      image: 'assets/wayanad-hilltop.jfif',
      price: 2200,
      category: 'Homestay',
      mapUrl: 'https://maps.app.goo.gl/QYJ4GLytCzcZQcUQA',
      bookingUrl: 'https://booking.example.com/hilltop'
    }
  ];

  filteredAccommodations = [...this.accommodations];

  goBack() {
    window.history.back();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAccommodations = this.accommodations.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term)
    );
  }

  filterByCategory(category: string) {
    if (category === 'All') {
      this.filteredAccommodations = this.accommodations;
    } else {
      this.filteredAccommodations = this.accommodations.filter(item => item.category === category);
    }
    this.applyFilter();
  }

  viewOnMap(item: any) {
    window.open(item.mapUrl, '_blank');
  }

  bookNow(item: any) {
    window.open(item.bookingUrl, '_blank');
  }
}
