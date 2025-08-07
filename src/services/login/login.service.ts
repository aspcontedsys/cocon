import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { NotificationService } from '../../services/notification/notification.service';
import { RegisteredUser } from '../../app/models/cocon.models';
import { AuthService } from '../Auth/auth.service';
import { environment } from 'src/environments/environment';
import { loginResponse } from '../../app/models/cocon.models';
import { CacheService } from '../../services/cache/cache.service';
import { FirebaseMessagingService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentuser:RegisteredUser = {} as RegisteredUser; 
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private cacheService: CacheService,
    private firebaseMessagingService: FirebaseMessagingService
  ) {}
  public async getOtp<Boolean>(loginForm: any) {
    try {
        const loginData = {
          email: loginForm.email,
        };
        // Make API call to login
        let success = await this.apiService.post<any>(environment.endpoints.login.api,environment.endpoints.login.authenticationType, loginData);
        if(success.status){
          return true;
        }
        else{
          this.notificationService.showNotification(success.message || null, 'error');
          return false;
        }
    } catch (error:any) {
      // For API errors with a response
      if ((error as any).error && (error as any).error.message) {
        this.notificationService.showNotification((error as any).error.message, 'error');
      } 
      // For network errors
      else if ((error as any).message) {
        this.notificationService.showNotification((error as any).message, 'error');
      }
      // For any other errors
      else {
        this.notificationService.showNotification(error.message.toString(), 'error');
      }
      return false;
    }
  }
  public async verifyOtp<Boolean>(loginForm: any) {
    try {
        // Make API call to login
        let response = await this.apiService.post<loginResponse>(environment.endpoints.verifyOtp.api,environment.endpoints.verifyOtp.authenticationType, loginForm,true);
        if(response.status){
          this.authService.login(response.data.token);
          this.cacheService.set('userDetails', response.data.data);
          // Initialize Firebase after successful login
          await this.firebaseMessagingService.initializePushNotifications();
          return true;
        }
        else{
          this.notificationService.showNotification(response.message || null, 'error');
          return false;
        }
    } catch (error) {
      this.notificationService.showNotification(null, 'error');
      return false;
    }

  }
}