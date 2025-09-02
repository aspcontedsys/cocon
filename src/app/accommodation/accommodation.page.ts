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
      description: 'A serene eco-resort surrounded by lush tea plantations.',
      location: 'Munnar, Kerala',
      image: 'assets/green-valley-resort.jpg',
      roomType: 'Deluxe Room',
      occupancy: '2 Adults',
      rate: 3500,
      category: 'Resort',
      distanceVenue: '5 km',
      distanceAirport: '85 km',
      mapUrl: 'https://maps.app.goo.gl/ez48AmnG6tNWVyvT8'
    },
    {
      name: 'Sea Breeze Hotel',
      description: 'Beachfront hotel offering stunning ocean views.',
      location: 'Kovalam Beach',
      image: 'assets/sea-breeze.jpg',
      roomType: 'Suite',
      occupancy: '2 Adults + 1 Child',
      rate: 5000,
      category: 'Hotel',
      distanceVenue: '2 km',
      distanceAirport: '15 km',
      mapUrl: 'https://maps.app.goo.gl/Pm3oNugsgJ9VmP71A'
    },
    {
      name: 'Hilltop Homestay',
      description: 'Family-run homestay with a cozy hillside charm.',
      location: 'Wayanad',
      image: 'assets/wayanad-hilltop.jfif',
      roomType: 'Twin Room',
      occupancy: '2 Guests',
      rate: 2200,
      category: 'Homestay',
      distanceVenue: '12 km',
      distanceAirport: '95 km',
      mapUrl: 'https://maps.app.goo.gl/QYJ4GLytCzcZQcUQA'
    },
    {
      name: 'City Comfort Hotel',
      description: 'Budget-friendly stay in the heart of Kochi.',
      location: 'Kochi',
      image: 'assets/city-comfort.jpg',
      roomType: 'Single Room',
      occupancy: '1 Adult',
      rate: 1800,
      category: 'Hotel',
      distanceVenue: '8 km',
      distanceAirport: '40 km',
      mapUrl: 'https://maps.app.goo.gl/example'
    },
    {
      name: 'Royal Heritage Palace',
      description: 'Luxury heritage property with royal interiors.',
      location: 'Trivandrum',
      image: 'assets/royal-palace.jpg',
      roomType: 'Triple Room',
      occupancy: '3 Guests',
      rate: 7500,
      category: 'Resort',
      distanceVenue: '3 km',
      distanceAirport: '12 km',
      mapUrl: 'https://maps.app.goo.gl/example'
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
      item.location.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
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
}
