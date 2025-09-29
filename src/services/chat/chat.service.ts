import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { CacheService } from '../../services/cache/cache.service';
import { RegisteredUser,sendModel,ChatHistory,ChatListUsers,OpenListUsers } from '../../app/models/cocon.models';
import { ApiResponse } from '../../services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages: Map<string, any[]> = new Map();
  private readonly USER_CACHE_KEY = 'cached_chat_users';
  private readonly CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds
  private currentUser: RegisteredUser = {} as RegisteredUser;

  constructor(
    private apiService: ApiService,
    private cacheService: CacheService) {
    this.cacheService.get('userDetails').then(user => this.currentUser = user as RegisteredUser);
  }

  async getUsers(): Promise<ChatListUsers[]> {
    const CACHE_KEY = this.USER_CACHE_KEY;
    
    try {
      const response = await this.apiService.get<ChatListUsers[]>(
        environment.endpoints.networkingDelegates.api,
        environment.endpoints.networkingDelegates.authenticationType
      );

      if (response?.status && response.data) {
        // Cache the response with a timestamp
        await this.cacheService.set(CACHE_KEY, {
          data: response.data,
          timestamp: Date.now()
        });
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error in getUsers:', error);
      
      // Return cached data if available, even if expired, when there's an error
      const cached = await this.cacheService.get(CACHE_KEY);
      if (cached?.data) {
        console.warn('Using cached data due to error');
        return cached.data;
      }
      
      throw error;
    }
  }

  async getUsersCached(): Promise<ChatListUsers[]> {
     // Try to get from cache first
      const cached = await this.cacheService.get(this.USER_CACHE_KEY);
      if (cached && cached.timestamp && (Date.now() - cached.timestamp < this.CACHE_EXPIRY)) {
        console.log('Returning cached users list');
        return cached.data;
      }
      return [];
  }

  getCurrentUser(): RegisteredUser {
    return this.currentUser;
  }

  async sendMessage(conversation_id:number=0, recipientId: number, content: string): Promise<any> {
    try {
      const message: sendModel = {
        message:content,
        sender_id: this.currentUser.id,
        to_id: recipientId,
        created_at: new Date(),
        read_at: new Date(),
        message_type: 'text',
        attachment_path: '',
        attachment_type: '',
        conversation_id: conversation_id,
        // id: 0
      };

      const response = await this.apiService.post<any>(
        environment.endpoints.addChatMessage.api,
        environment.endpoints.addChatMessage.authenticationType,
        message
      );
      if(response.status){
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  async updateNetworkingStatus(status:boolean){
    try {
      this.cacheService.set('networking_status', status);
      let data = {
        "access_network":status?'Y':'N'
      }
      const response = await this.apiService.post<any>(environment.endpoints.networkingStatusUpdated.api,environment.endpoints.networkingStatusUpdated.authenticationType,data);
      if(response.status){
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error updating networking status:', error);
      throw error;
    }
  }
  async updateLinkedinUrl(linkedInUrl:string){
    try {
      let data = {
        "linkedin_url":linkedInUrl
    }
    
      const response = await this.apiService.post<any>(environment.endpoints.updateLinkedinUrl.api,environment.endpoints.updateLinkedinUrl.authenticationType,data);
      if(response.status){
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error updating networking status:', error);
      throw error;
    }
  }
  async addChatRequest(receiver_id:number,requested:boolean){
    try {
      let data = {
        "receiver_id":receiver_id,
        "status":requested?'pending':'cancelled'
    }
    
      const response = await this.apiService.post<any>(environment.endpoints.addChatRequest.api,environment.endpoints.addChatRequest.authenticationType,data);
      if(response.status){
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error updating networking status:', error);
      throw error;
    }
  }
  async updateChatRequest(conversation_id:number,accepted:boolean){
    try {
      let data = {
        "conversation_id":conversation_id,
        "status":accepted?'accepted':'rejected'
    } 
      const response = await this.apiService.post<any>(environment.endpoints.updateChatRequest.api,environment.endpoints.updateChatRequest.authenticationType,data);
      if(response.status){
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error updating networking status:', error);
      throw error;
    }
  }

  async getChatMessages(conversation_id:number): Promise<ChatHistory[]>{
    try {
      const response = await this.apiService.get<ChatHistory[]>(environment.endpoints.fetchChatMessages.api,environment.endpoints.fetchChatMessages.authenticationType,{conversation_id:conversation_id});
      if(response.status){
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error updating networking status:', error);
      throw error;
    }
  }

//   networkingDelegates:{api:'api/networking-delegates',method:'get',authenticationType:'OAuth'},

}
