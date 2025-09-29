import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat/chat.service';
import { NavController } from '@ionic/angular';
import { ChatListUsers } from '../../app/models/cocon.models';
import { NotificationService } from '../../services/notification/notification.service';
import { CacheService } from '../../services/cache/cache.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit {
  isNetworkingOpen: boolean = false;
  allUsers: ChatListUsers[] = [];
  acceptedUsers: ChatListUsers[] = [];
  openUsers: ChatListUsers[] = [];
  activeTab: 'users' | 'accepted' = 'users';
  dropdownIndex: number | null = null;

  linkedinUrl: string = '';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private notificationService: NotificationService,
    private chatService: ChatService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.checkNetworkingStatus();
    this.getUserList();
    this.loadLinkedIn();
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  goBack(): void {
    this.navCtrl.navigateBack('/home/dashboard', {
      animated: true,
      animationDirection: 'back',
    });
  }

  toggleDropdown(index: number): void {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }

  async sendRequest(user: any): Promise<void> {
    user.requestSent = true;
    this.dropdownIndex = null;
    this.chatService.addChatRequest(user.id, user.requestSent);
    this.getUserList();
    this.notificationService.showNotification(`Request sent to ${user.name}`);
  }

  async cancelRequest(user: any): Promise<void> {
    user.requestSent = false;
    this.dropdownIndex = null;
    this.chatService.addChatRequest(user.id, user.requestSent);
    this.getUserList();
    this.notificationService.showNotification(`Request to ${user.name} has been canceled`);
  }

  openChat(user: any): void {
    this.router.navigate(['/home/chatpage', user.id, user.conversation_id]);
  }

  toggleNetworking(event: any): void {
    this.isNetworkingOpen = event.detail.checked;
    this.chatService.updateNetworkingStatus(this.isNetworkingOpen);
    if (!this.isNetworkingOpen) {
      this.linkedinUrl = ''; 
      this.cacheService.remove('linkedin_url');
    }
  }

  async checkNetworkingStatus(): Promise<void> {
    this.isNetworkingOpen = await this.cacheService.get('networking_status');
  }

  async getUserList(): Promise<void> {
    this.allUsers = await this.chatService.getUsers();

    this.acceptedUsers = this.allUsers.filter(user => user.status == 'accepted');
    this.openUsers = this.allUsers.filter(user => user.status == 'open' || user.status == 'pending' || user.status == 'rejected');
    this.activeTab = this.acceptedUsers.length > 0 ? 'accepted' : 'users';
  }

  async saveLinkedIn(): Promise<void> {
    this.chatService.updateLinkedinUrl(this.linkedinUrl).then((res)=>{
      this.cacheService.set('linkedin_url', this.linkedinUrl);
      this.notificationService.showNotification('LinkedIn profile saved');
    })
  }

  async loadLinkedIn(): Promise<void> {
    this.linkedinUrl = await this.cacheService.get('linkedin_url') || '';
  }

  //  Only opens LinkedIn in new tab
  openLinkedIn(url: string): void {
    window.open(url, '_blank');
  }
  acceptRequest(conversationId :any) {    
    this.chatService.updateChatRequest(conversationId, true);   
    this.getUserList();
  }
  rejectRequest(conversationId :any) {
    this.chatService.updateChatRequest(conversationId, false); 
    this.getUserList();   
  }
}
