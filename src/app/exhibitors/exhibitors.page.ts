import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Exhibitor } from '../../app/models/cocon.models';
import {DataService} from '../../services/data/data.service';
@Component({
  selector: 'app-exhibitors',
  templateUrl: './exhibitors.page.html',
  styleUrls: ['./exhibitors.page.scss'],
  standalone:false
})
export class ExhibitorsPage implements OnInit {

  exhibitors :Exhibitor[] = [];

  constructor(
    private location: Location,
    private dataService:DataService
  ) {}

  ngOnInit() {
    this.getExhibitorsList();
  }
  async getExhibitorsList(){
    this.exhibitors = await this.dataService.getExhibitorsList();
  }

  openExhibitorWebsite(exhibitor:Exhibitor){
    console.log("websiteclicked")
    if(exhibitor.website_url){
      window.open(exhibitor.website_url, '_blank');
    }
  }

  goBack() {
    this.location.back();
  }

}
