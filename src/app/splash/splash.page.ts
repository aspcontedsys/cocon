import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginPage } from '../components/login/login.page';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/Auth/auth.service';
import { DataService } from '../../services/data/data.service';
@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonicModule,CommonModule],
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  constructor(private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private dataService:DataService) { }

  ngOnInit() {
    setTimeout(() => {
      this.openLoginModal();
    }, 3000); 
  }

  async openLoginModal() {
    await this.dataService.getEventDetails();
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/home/dashboard']);
      return;
    }
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal'
    });
    await modal.present();
    }
}
