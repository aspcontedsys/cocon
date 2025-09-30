import { Injectable, EventEmitter, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ApiService } from '../api/api.service';
import { CacheService } from '../cache/cache.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

export enum NotificationPermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
  private isNative = Capacitor.isNativePlatform();
  private token: string | null = null;
  private tokenRefreshListeners: ((token: string) => void)[] = [];
  private deviceId: string | null = null;
  private STORAGE_KEY = 'device_id';
  private readonly ANDROID_13_SDK = 33;
  
  @Output() messageReceived = new EventEmitter<any>();
  private currentConversationId: number | null = null;

  constructor(
    private platform: Platform,
    private router: Router,
    private apiService: ApiService, 
    private cacheService: CacheService
  ) { }

  async initializePushNotifications() {
    try {
      // Initialize local notifications first
      await LocalNotifications.requestPermissions();
      await this.createNotificationChannel();

      // Request push notification permissions
      const permissionStatus = await PushNotifications.requestPermissions();
      
      if (permissionStatus.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();
        console.log('Push notifications registered successfully');
        await this.checkAndRequestNotificationPermission();

        // On registration success, get FCM token
        PushNotifications.addListener('registration',async( token) => {
          console.log('Push registration success, token: ', token.value);
          const fcmToken = await FirebaseMessaging.getToken();
          console.log('FCM token:', fcmToken.token);
          if (fcmToken) {
            this.sendTokenToServer(fcmToken.token);
          }
        });

        // On registration error
        PushNotifications.addListener('registrationError', error => {
          console.error('Push registration error: ', error);
        });

        // On receiving a push notification
        PushNotifications.addListener('pushNotificationReceived', async (notification) => {
          console.log('Push received: ', notification);
          
          // Get current route and notification data
          const currentRoute = this.router.url;
          const data = notification.data || {};
          
          // Check if we're on a chat-related page
          if (currentRoute.includes('/home/chat')) {

            console.log("Current route: ", currentRoute);
            // If we're in the specific chat where the message was sent
            if (currentRoute.endsWith(`/${data.conversation_id}`)) {
              console.log("is same conversation", data.conversation_id);
              const newMessage = {
                sender_id: Number(data.senduser_id),
                message: notification.body,
                created_at: new Date().toISOString(),
                read_at: null,
                message_type: 'text',
                conversation_id: Number(data.conversation_id),
              };

              this.messageReceived.emit(newMessage);
              return; // Skip showing notification
            } else {
              // TODO: Update unread count for this conversation
              console.log('New message in another conversation:', data.conversation_id);
            }
          }
          
          // Show local notification if not in the chat where message was sent
          await this.showLocalNotification(
            notification.title || 'New Message',
            notification.body || 'You have a new message',
            data
          );
        });

        // When notification is tapped
        PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
          console.log('Notification tapped:', notification);
          const data = notification.notification.data;
          
          if (data?.senduser_id && data?.conversation_id) {
            // Navigate to chat page with user and conversation IDs
            await this.router.navigate(['/home/chatpage', data.senduser_id, data.conversation_id]);
          } else {
            await this.router.navigate(['/home/notification']);
          }
        });
      } else {
        console.warn('User denied push notification permission');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private async createNotificationChannel() {
    if (this.platform.is('android')) {
      await LocalNotifications.createChannel({
        id: 'cocon_messages',
        name: 'Cocon Messages',
        description: 'Chat messages and notifications',
        importance: 4, // IMPORTANCE_HIGH
        visibility: 1, // VISIBILITY_PUBLIC
        sound: 'default',
        vibration: true,
      });
    }
  }

  private async showLocalNotification(title: string, body: string, data: any) {
    try {
      await LocalNotifications.schedule({
        notifications: [{
          title: title,
          body: body,
          id: 199586,
          schedule: { at: new Date(Date.now() + 100) },
          extra: data,
          channelId: 'cocon_messages',
          smallIcon: 'ic_stat_icon',
          iconColor: '#488AFF',
          largeIcon: 'ic_launcher',
          group: 'cocon_messages',
          groupSummary: true,
          autoCancel: true,
          summaryText: 'New message',
        }]
      });
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }

  private async checkAndRequestNotificationPermission(): Promise<NotificationPermissionStatus> {
    if (!this.platform.is('android') || !this.isNative) {
      return NotificationPermissionStatus.GRANTED;
    }

    try {
      // Check Android version
      const sdkVersion = await this.getAndroidSdkVersion();
      
      // Only need to request for Android 13 (API 33) and above
      if (sdkVersion >= this.ANDROID_13_SDK) {
        const permissionStatus = await this.getNotificationPermissionStatus();
        
        if (permissionStatus === NotificationPermissionStatus.PROMPT) {
          // Request permission if not already determined
          const result = await PushNotifications.requestPermissions();
          return result.receive === 'granted' 
            ? NotificationPermissionStatus.GRANTED 
            : NotificationPermissionStatus.DENIED;
        }
        
        return permissionStatus;
      }
      
      return NotificationPermissionStatus.GRANTED;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return NotificationPermissionStatus.DENIED;
    }
  }

  private async getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      const result = await PushNotifications.checkPermissions();
      return (result.receive as NotificationPermissionStatus) || NotificationPermissionStatus.PROMPT;
    } catch (error) {
      console.error('Error getting notification permission status:', error);
      return NotificationPermissionStatus.DENIED;
    }
  }

  private async getAndroidSdkVersion(): Promise<number> {
    try {
      if (this.platform.is('android') && (window as any).device) {
        return (window as any).device.version || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting Android SDK version:', error);
      return 0;
    }
  }

  private async getOrCreateDeviceId(): Promise<string> {
    // Try to get existing device ID from storage
    let deviceId = await this.cacheService.get(this.STORAGE_KEY);

    // If no device ID exists, create a new one
    if (!deviceId) {
      deviceId = `device_${uuidv4()}`;
      await this.cacheService.set(this.STORAGE_KEY, deviceId);
    }

    return deviceId;
  }

  private getPlatform(): string {
    if (this.platform.is('ios')) {
      return 'ios';
    } else if (this.platform.is('android')) {
      return 'android';
    } else if (this.platform.is('desktop')) {
      return 'web';
    }
    return 'unknown';
  }

  private async sendTokenToServer(token: string) {
    try {
      const cachedToken = await this.cacheService.get("Firebase_Token");
      if(cachedToken == token){
        return;
      }
      const platform = this.getPlatform();
      this.deviceId = await this.getOrCreateDeviceId();
      console.log(`Sending FCM token to server for ${platform} device ${this.deviceId}`);

      await this.apiService.post(environment.endpoints.fcmToken.api, environment.endpoints.fcmToken.authenticationType, {
        device_id: this.deviceId,
        fcm_token: token,
        platform: platform
      },);

      console.log('FCM token sent to server successfully');
      await this.cacheService.set("Firebase_Token", token);
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
      // Consider implementing retry logic with exponential backoff
    }
  }
}