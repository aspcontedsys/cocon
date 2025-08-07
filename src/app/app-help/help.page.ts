import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { AppHelp } from '../models/cocon.models';
@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  standalone:false
})
export class HelpPage implements OnInit {
  appHelp:AppHelp = {app_help:""};
  constructor(private navCtrl: NavController,private dataService:DataService) { }

  ngOnInit() {
    this.getAppHelp();
  }
  getAppHelp(){
    this.dataService.getAppHelp().then((data)=>{
      this.appHelp = data;
    })
  }
  goBack() {
    this.navCtrl.back();
  }
}
