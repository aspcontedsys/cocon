import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseMessagingService } from '../services/firebase/firebase.service';
import { AuthService } from '../services/Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private router: Router,
    private firebaseMessagingService: FirebaseMessagingService,
    private authService:AuthService
  ) {
    this.initializePushNotifications();
}
async initializePushNotifications() {
  console.log("Initializing push notifications : Started");
  // Subscribe to auth state changes
  this.authService.isAuthenticated().subscribe(async (isAuthenticated) => {
    console.log("Auth state changed:", isAuthenticated);
    if (isAuthenticated) {
      console.log("User is authenticated - Initializing Firebase");
      try {
        await this.firebaseMessagingService.initializePushNotifications();
        console.log("Firebase initialization completed");
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    }
  });
}
}