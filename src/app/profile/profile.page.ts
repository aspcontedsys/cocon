import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DelegateProfile } from 'src/app/models/cocon.models';
import { DataService } from '../../services/data/data.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: DelegateProfile = {} as DelegateProfile;

  constructor(private navCtrl: NavController,private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getDelegateProfile().then((user: DelegateProfile) => {
      this.user = user;
    });
  }
  goBack() {
    this.navCtrl.back();
  }

}
