import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.page.html',
  styleUrls: ['./accommodation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AccommodationPage {
  searchTerm = '';
  categories : string[] = [];
  accommodations: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getHotels().then(data => {
      this.accommodations = data;
      this.filteredAccommodations = [...this.accommodations];
      this.categories = this.getCategories();
    });
  }

  filteredAccommodations = [...this.accommodations];

  goBack() {
    window.history.back();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAccommodations = [];
    
    // Flatten the accommodations array to handle the nested structure
    this.accommodations.forEach(categoryGroup => {
      const filteredHotels = categoryGroup.hotel.filter((hotel : any) => 
        hotel.hotel_name?.toLowerCase().includes(term) ||
        hotel.hotel_location?.toLowerCase().includes(term) ||
        hotel.hotel_description?.toLowerCase().includes(term)
      );
      
      if (filteredHotels.length > 0) {
        this.filteredAccommodations.push({
          ...categoryGroup,
          hotel: filteredHotels
        });
      }
    });
  }

  filterByCategory(category: string) {
    if (category === 'All') {
      this.filteredAccommodations = [...this.accommodations];
    } else {
      this.filteredAccommodations = this.accommodations.filter(
        item => item.hotel_category === category
      );
    }
  }

  viewOnMap(hotel: any) {
    if (hotel?.hotel_google_map) {
      window.open(hotel.hotel_google_map, '_blank');
    }
  }

  getCategories(): string[] {
    // Extract unique hotel categories from accommodations
    const categories = new Set<string>();
    this.accommodations.forEach(accommodation => {
      if (accommodation.hotel_category) {
        categories.add(accommodation.hotel_category);
      }
    });
    return Array.from(categories);
  }
}
