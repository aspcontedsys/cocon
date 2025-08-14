import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DirectoryList,Directory } from '../models/cocon.models';
import { DataService } from '../../services/data/data.service';
@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  standalone:false
})
export class DirectoryPage implements OnInit {
 directoryCategories: DirectoryList[] = [];
  openedAccordion: number = 0;
  directoryList: Directory[] = [];
  constructor(private navCtrl: NavController,private dataService:DataService) { }

  ngOnInit() {
    this.getDirectoryCategory();
  }

  async getDirectoryCategory(){
    this.directoryCategories = await this.dataService.getDirectorywithCategoriesAndList();
  }
   async getDirectoryList(category_id:number){
    this.directoryList = this.directoryCategories.find((category) => category.id === category_id)?.directories || [];
  }
  
  onAccordionChange(event: CustomEvent) {
    this.openedAccordion = parseInt(event.detail.value);
    this.getDirectoryList(this.openedAccordion);
  }

  goBack() {
    this.navCtrl.back();
  }
}
