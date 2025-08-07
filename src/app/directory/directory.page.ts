import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Category,Directory,Sponsor } from '../models/cocon.models';
import { DataService } from '../../services/data/data.service';
@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  standalone:false
})
export class DirectoryPage implements OnInit {
 directoryCategories: Category[] = [];
  openedAccordion: number = 0;
  directoryList: Directory[] = [];
  constructor(private navCtrl: NavController,private dataService:DataService) { }

  ngOnInit() {
    this.getDirectoryCategory();
  }

  async getDirectoryCategory(){
    this.directoryCategories = await this.dataService.getDirectoryCategories();
  }
   async getDirectoryList(category_id:number){
    this.directoryList = await this.dataService.getDirectoryList(category_id.toString());
  }
  
  onAccordionChange(event: CustomEvent) {
    this.openedAccordion = event.detail.value;
    this.getDirectoryList(this.openedAccordion);
  }

  goBack() {
    this.navCtrl.back();
  }
}
