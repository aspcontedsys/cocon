import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { favouriteTopic, Schedule } from '../models/cocon.models';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FavouritesPage implements OnInit {
  schedules: Schedule[] = [];
  favorites: favouriteTopic[] = [];
  groupedFavorites: { [key: string]: favouriteTopic[] } = {};

  constructor(private navCtrl: NavController,private dataService:DataService) {}

  ngOnInit() {
    this.loadSchedules();
  }

  loadSchedules() {
    this.dataService.getFavouriteSchedules().then((data)=>{
      this.schedules = data;
      this.loadFavourites();
    });
  }

  loadFavourites() {
    this.favorites = []; // Clear existing favorites
    
    // Loop through all schedules, halls, and topics to find favorites
    this.schedules.forEach(schedule => {
      schedule.halls.forEach(hall => {
        const selectedTopics = hall.topics
          .filter(topic => topic.is_favourite)
          .map(topic => ({
            ...topic,
            event_date: schedule.event_date
          } as favouriteTopic));
          
        this.favorites = [...this.favorites, ...selectedTopics];
      });
    });
    this.groupByDate();
  }


  groupByDate() {
    this.groupedFavorites = this.favorites.reduce((groups, fav) => {
      const date = fav.event_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(fav);
      return groups;
    }, {} as { [key: string]: favouriteTopic[] });
  }

  getDates() {
    return Object.keys(this.groupedFavorites).sort();
  }

  goBack() {
    this.navCtrl.back();
  }
}
