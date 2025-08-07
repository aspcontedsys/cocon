import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/services/data/data.service';
import { Category,Sponsor } from '../models/cocon.models';
@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
  standalone:false
})
export class SponsorsPage implements OnInit {

  openedAccordion: number = 0;
  sponserCategories: Category[] = [];
  sponserList: Sponsor[] = [];
  constructor(private navCtrl: NavController,private dataService: DataService) { }

  ngOnInit() {
    this.getSponserCategories();
  }
  async getSponserCategories() {
    this.sponserCategories = await this.dataService.getSponserCategories();
  }

  async getSponserList(category_id:number){
    this.sponserList = await this.dataService.getSponserList(category_id.toString());
  }

  onAccordionChange(event: CustomEvent) {
    this.openedAccordion = event.detail.value;
    this.getSponserList(this.openedAccordion);
  }

  goBack() {
    this.navCtrl.back();
  }

}
