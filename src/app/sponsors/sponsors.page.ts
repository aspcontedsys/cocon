import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/services/data/data.service';
import { SponsorsList,Sponsor } from '../models/cocon.models';
@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
  standalone:false
})
export class SponsorsPage implements OnInit {

  openedAccordion: number = 0;
  sponsers: SponsorsList[] = [];
  sponsersDetails: Sponsor[] = [];
  constructor(private navCtrl: NavController,private dataService: DataService) { }

  ngOnInit() {
    this.getSponserCategories();
  }
  async getSponserCategories() {
   this.sponsers = await this.dataService.getSponserWithCategoriesAndList();
    this.openedAccordion = this.sponsers[0].id;
    this.getSponserList(this.openedAccordion);
  }

  async getSponserList(category_id:number){
     const selectedCategory = this.sponsers.find(cat => cat.id === category_id);
    this.sponsersDetails = selectedCategory?.sponsors || [];
  }

  onAccordionChange(event: CustomEvent) {
     this.openedAccordion = parseInt(event.detail.value);
    this.getSponserList(this.openedAccordion);
  }

  goBack() {
    this.navCtrl.back();
  }

}
