import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FavouritesPage implements OnInit {
  favorites: any[] = [];
  groupedFavorites: any = {};

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.loadDummyFavorites();
    this.groupByDate();
  }

  loadDummyFavorites() {
    this.favorites = [
      {
        id: '1',
        date: '2025-08-28',
        time: '09:00',
        time2: '10:00',
        title: 'Keynote: Future of Medicine',
        roles: [
          {
            role_name: 'Speaker',
            participants: [
              { name: 'Dr. Alex Joseph', email: 'Alex@med.com' }
            ]
          }
        ]
      },
      {
        id: '2',
        date: '2025-08-28',
        time: '11:00',
        time2: '12:00',
        title: 'AI in Healthcare',
        roles: [
          {
            role_name: 'Panelist',
            participants: [
              { name: 'Dr. Alexxis', email: 'Alexxis@aihealth.com' },
              { name: 'Dr. AlexxY', email: 'AlexxY@medai.com' }
            ]
          }
        ]
      },
      {
        id: '3',
        date: '2025-08-29',
        time: '14:00',
        time2: '15:00',
        title: 'Clinical Trials Innovations',
        roles: [
          {
            role_name: 'Moderator',
            participants: [
              { name: 'Prof. AlexxO', email: 'AlexxO@clinical.com' }
            ]
          }
        ]
      }
    ];
  }

  groupByDate() {
    this.groupedFavorites = this.favorites.reduce((groups, fav) => {
      const date = fav.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(fav);
      return groups;
    }, {});
  }

  getDates() {
    return Object.keys(this.groupedFavorites).sort();
  }

  goBack() {
    this.navCtrl.back();
  }
}
