import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { Speaker,EventDetails,DelegateProfile,VirtualBadge,
  Schedule,SponsorsList,FeedbackQuestion,Exhibitor,DirectoryList,
  Attractions,AppHelp,AboutConference } from '../../app/models/cocon.models';
import { CacheService } from '../cache/cache.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private apiService: ApiService,private cacheService: CacheService) {}

  async getEventDetails(): Promise<EventDetails> {
    const CACHE_KEY = 'event_details';
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 day in milliseconds
    
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get(CACHE_KEY);
      if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
        console.log('Returning cached event details');
        return cached.data;
      }
      
      // If not in cache or expired, fetch from API
      const response: ApiResponse<EventDetails> = await this.apiService.get<EventDetails>(
        environment.endpoints.eventDetails.api,
        environment.endpoints.eventDetails.authenticationType
      );
      
      if (response && response.data) {
        // Cache the response with a timestamp
        await this.cacheService.set(CACHE_KEY, {
          data: response.data,
          timestamp: Date.now()
        });
        
        // Also update the event_id in cache if needed
        if (response.data.id) {
          await this.cacheService.set('event_id', response.data.id.toString());
        }
        
        return response.data;
      }
      
      throw new Error('Failed to fetch event details');
    } catch (error) {
      console.error('Error in getEventDetails:', error);
      throw error;
    }
  }

  async getDelegateProfile (): Promise<DelegateProfile>{
    let data:ApiResponse<DelegateProfile> = await this.apiService.get<DelegateProfile>(environment.endpoints.delegateprofile.api,environment.endpoints.delegateprofile.authenticationType );
    return data.data;
  }
  async getDelegateBadge(){
    let data:ApiResponse<VirtualBadge> = await this.apiService.get<VirtualBadge>(environment.endpoints.delegateBadge.api,environment.endpoints.delegateBadge.authenticationType );
    return data.data;
  }
  async getSchedules(){
    let data:ApiResponse<Schedule[]> = await this.apiService.get<Schedule[]>(environment.endpoints.schedules.api,environment.endpoints.schedules.authenticationType,undefined,true );
    return data.data;
  }
  async getTodaySchedules(){
    let data:ApiResponse<Schedule[]> = await this.apiService.get<Schedule[]>(environment.endpoints.todaySchedule.api,environment.endpoints.todaySchedule.authenticationType,undefined,true );
    return data.data;
  }
  async getParticipants(){
    let data:ApiResponse<Speaker[]> = await this.apiService.get<Speaker[]>(environment.endpoints.participants.api,environment.endpoints.participants.authenticationType );
    return data.data;
  }
  async getSponserWithCategoriesAndList(){
    let data:ApiResponse<SponsorsList[]> = await this.apiService.get<SponsorsList[]>(environment.endpoints.sponserWithCategoriesAndList.api,environment.endpoints.sponserWithCategoriesAndList.authenticationType );
    return data.data;
  }
  async getFeedbackQuestionList(){
    let response :ApiResponse<FeedbackQuestion[]> = await this.apiService.get<FeedbackQuestion[]>(environment.endpoints.feedbackQuestionList.api,environment.endpoints.feedbackQuestionList.authenticationType );
    return response.data;
  }
  async saveFeedbackSubmit(data :{[key:string]:string}[]){
    let response :ApiResponse<FeedbackQuestion> = await this.apiService.post<FeedbackQuestion>(environment.endpoints.feedbackSubmit.api,environment.endpoints.feedbackSubmit.authenticationType,data );
    return response.data;
  }
  async getExhibitorsList(){
    let response :ApiResponse<Exhibitor[]> = await this.apiService.get<Exhibitor[]>(environment.endpoints.exhibitorsList.api,environment.endpoints.exhibitorsList.authenticationType );
    return response.data;
  }
  async getDirectorywithCategoriesAndList(){
    let response :ApiResponse<DirectoryList[]> = await this.apiService.get<DirectoryList[]>(environment.endpoints.directorywithCategoriesAndList.api,environment.endpoints.directorywithCategoriesAndList.authenticationType );
    return response.data;
  }
  async getAttractionWithCategoryAndList(){
    let response :ApiResponse<Attractions[]> = await this.apiService.get<Attractions[]>(environment.endpoints.attractionWithCategoryAndList.api,environment.endpoints.attractionWithCategoryAndList.authenticationType );
    return response.data;
  }

  async getAppHelp(){
    let response :ApiResponse<AppHelp> = await this.apiService.get<AppHelp>(environment.endpoints.appHelp.api,environment.endpoints.appHelp.authenticationType );
    return response.data;
  }

  async getAboutConference(){
    let response :ApiResponse<AboutConference> = await this.apiService.get<AboutConference>(environment.endpoints.aboutConference.api,environment.endpoints.aboutConference.authenticationType );
    return response.data;
  }
}