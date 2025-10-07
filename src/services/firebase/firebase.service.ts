import { Injectable, EventEmitter, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ApiService } from '../api/api.service';
import { CacheService } from '../cache/cache.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { App } from '@capacitor/app';

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
  private deviceId: string | null = null;
  private STORAGE_KEY = 'device_id';
  private readonly ANDROID_13_SDK = 33;
  private isInitialized = false;  // Add this flag
  private listenersAdded = false; // Add this flag
  
  @Output() messageReceived = new EventEmitter<any>();
  private currentConversationId: number | null = null;

  constructor(
    private platform: Platform,
    private router: Router,
    private apiService: ApiService, 
    private cacheService: CacheService
  ) { }

  async initializePushNotifications() {
     // Prevent multiple initializations
     if (this.isInitialized) {
      console.log('Push notifications already initialized');
      return;
    }
    try {
      // Initialize local notifications first
      await LocalNotifications.requestPermissions();
      await this.createNotificationChannel();
      if (this.platform.is('ios')) {
        await this.initializeIOSMessaging();
      } else if (this.platform.is('android')) {
        await this.initializeFirebaseAndriod();
      }

      this.isInitialized = true;
      console.log('Push notifications initialized successfully');
    }catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private async initializeFirebaseAndriod(){
     // Request push notification permissions
     const permissionStatus = await PushNotifications.requestPermissions();
      
     if (permissionStatus.receive === 'granted') {
       // Register for push notifications
       await PushNotifications.register();
       console.log('Push notifications registered successfully');
       await this.checkAndRequestNotificationPermission();
       // Add listeners only once
       if (!this.listenersAdded) {
         this.setuplistenerforandroid();
         this.listenersAdded = true;
         this.isInitialized = true;
       }
     } else {
       console.warn('User denied push notification permission');
     }
  }

  private setuplistenerforandroid(){
    // On registration success, get FCM token
    PushNotifications.addListener('registration',async( token) => {
      console.log('Push registration success, token: ', token.value);
      this.sendTokenToServer(token.value);
    });

    // On registration error
    PushNotifications.addListener('registrationError', error => {
      console.error('Push registration error: ', error);
    });

     // On receiving a push notification
     console.log('pushNotificationReceived listener');
     PushNotifications.addListener('pushNotificationReceived', async (notification) => {
       console.log('Push received: ', notification);
       
       this.addnotificaitonorUpdateMessage(notification);
     });
 

     // When notification is tapped
     console.log('pushNotificationActionPerformed listener');
     PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
       console.log('Notification tapped:', notification);
       const data = notification.notification.data;
       this.handleNotificationAction(data);
     });

     FirebaseMessaging.addListener('notificationReceived', (message) => {
      console.log('Message received:', message);
      const notification: PushNotificationSchema = {
        id: message.notification.id ?? "",
        title: message.notification?.title || '',
        body: message.notification?.body || '',
        data: message.notification?.data || {}
      };
      console.log('Message updating to ui:', message);
      this.addnotificaitonorUpdateMessage(notification);
    });

    LocalNotifications.addListener('localNotificationActionPerformed', async (message) => {
      console.log('Notification action performed:', message);
      const data = message.notification?.extra ?? {}
      this.handleNotificationAction(data);
    });
  }

  private async initializeIOSMessaging(){
    const permissionStatus = await FirebaseMessaging.requestPermissions();
    await PushNotifications.register();
    if (permissionStatus.receive === 'granted') {
      const fcmToken = (await FirebaseMessaging.getToken()).token;
      if (fcmToken) await this.sendTokenToServer(fcmToken);
      this.setuplistenerforios();
    } else {
      console.warn('User denied iOS notification permission');
    }
  }

  private setuplistenerforios(){
    FirebaseMessaging.addListener('notificationReceived', async (message) => {
      console.log('FCM message received (iOS):', message);
      const appState = await App.getState();

      // Only show a local notification if the app is in foreground
      if (appState.isActive) {
        const notification: PushNotificationSchema = {
          id: message.notification?.id ?? '',
          title: message.notification?.title || '',
          body: message.notification?.body || '',
          data: message.notification?.data || {},
        };
        await this.addnotificaitonorUpdateMessage(notification);
      }
    });

    FirebaseMessaging.addListener('notificationActionPerformed', async (response) => {
      console.log('Firebase notification action performed (iOS):', response);
      const data = response.notification?.data || {};
      await this.handleNotificationAction(data);
    });

    FirebaseMessaging.addListener('tokenReceived', async (token) => {
      console.log('New FCM token (iOS):', token.token);
      await this.sendTokenToServer(token.token);
    });
  }

  private async handleNotificationAction(data: any) {
    if (data?.senduser_id && data?.conversation_id) {
      await this.router.navigate(['/home/chatpage', data.senduser_id, data.conversation_id]);
    } else {
      await this.router.navigate(['/home/notification']);
    }
  }

  private async addnotificaitonorUpdateMessage(notification:PushNotificationSchema,showNotification: boolean = true){
      // Get current route and notification data
      const currentRoute = this.router.url;
      const data = notification.data || {};
      console.log("Current route: ", currentRoute);

      // Check if we're on a chat-related page
      if (currentRoute.includes('/home/chatpage')) {

        console.log("Current route: ", currentRoute);
        // If we're in the specific chat where the message was sent
        if (currentRoute.endsWith(`/${data.conversation_id}`)) {
          console.log("is same conversation", data.conversation_id);
          const newMessage = {
            sender_id: data.senduser_id,
            message: data.body,
            created_at: new Date().toISOString(),
            read_at: null,
            message_type: 'text',
            conversation_id: data.conversation_id,
          };

          this.messageReceived.emit(newMessage);
          return; // Skip showing notification
        } else {
          // TODO: Update unread count for this conversation
          console.log('New message in another conversation:', data.conversation_id);
        }
      }
      console.log('New message in conversation:', notification);
      //Show local notification if not in the chat where message was sent
      if(showNotification){
        await this.showLocalNotification(
          notification.title || 'New Message',
          notification.body || 'You have a new message',
          data
        );
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
          id:  Math.floor(Math.random() * 10000),
          schedule: { at: new Date(Date.now() + 1000) },
          extra: data,
          channelId: 'cocon_messages',
          smallIcon: 'ic_notification',
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