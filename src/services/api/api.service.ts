import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { LoadingService } from '../loading/loading.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../Auth/auth.service';
import { CacheService } from '../cache/cache.service';

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.loginServer;
  
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private cacheService: CacheService
  ) {}

  private async getHeaders(authType: string): Promise<HttpHeaders> {
    const token = await this.authService.getToken();
    const eventId = await this.getEventId();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers you need
      'Authorization': authType === 'OAuth' ? 'Bearer ' + token : '',
      'App-Key': authType === 'appkey' ? environment.appKey : '',
      'Event-Id': eventId
    });
  }

  private handleApiResponse<T>(response: any, status: number,returnAllResponse: boolean = false): ApiResponse<T> {
    // For successful responses (2xx)
    if (status >= 200 && status < 300) {
      return {
        status: true,
        statusCode: status,
        data: returnAllResponse ? response : response.data,
        message: response?.message
      };
    }
    
    // For specific status codes that should be handled as non-errors
    return {
      status: false,
      statusCode: status,
      message: response?.message || this.getDefaultMessageForStatus(status),
      data: returnAllResponse ? response : response.data
    };
  }

  private getDefaultMessageForStatus(status: number): string {
    const messages: { [key: number]: string } = {
      401: 'Unauthorized. Please log in again.',
      404: 'Resource not found.',
      500: 'Internal server error. Please try again later.'
    };
    return messages[status] || 'An error occurred while processing your request';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    
    if(error.status == 0){
      errorMessage ='No Internet provided';
    }
    else if(error.status == 401){
      errorMessage ='User not Authorized. Please login';
    }
    else if(error.status == 404){
      errorMessage ='Service seems to be incorrect please check you internet conenction or try again after a few minutes.';
    }
    if (![401, 404, 500].includes(error.status)) {
      errorMessage =error.error?.message
    }
    this.notificationService.showNotification(
      errorMessage || 'An error occurred while processing your request',
      'error'
    );

    // Hide loading
    this.loadingService.hideLoadingForApiCall();

    return throwError(() => error);
  }

  // GET request with proper typing
  async get<T>(endpoint: string,authType: string, params?: { [key: string]: any },returnAllResponse: boolean = false): Promise<ApiResponse<T>> {
    try {
      this.loadingService.showLoadingForApiCall();
      
      const url = `${this.API_URL}/${endpoint}`;
      const options = {
        headers: await this.getHeaders(authType),
        params: params ? new HttpParams({ fromObject: params }) : undefined,
        observe: 'response' as const
      };

      const response = await this.http.get<T>(url, options).pipe(
        catchError(error => {
          this.loadingService.hideLoadingForApiCall();
          return throwError(() => error);
        })
      ).toPromise();

      this.loadingService.hideLoadingForApiCall();
      return this.handleApiResponse<T>(response?.body, response?.status || 200,returnAllResponse);
    } catch (error: any) {
      if (error.status && [401, 404, 500].includes(error.status)) {
        return this.handleApiResponse(error.error, error.status,returnAllResponse);
      }
      throw this.handleError(error);
    }
  }

  // POST request with proper typing
  async post<T>(endpoint: string, authType: string,body: any,returnAllResponse: boolean = false): Promise<ApiResponse<T>> {
    try {
      this.loadingService.showLoadingForApiCall();
      
      const url = `${this.API_URL}/${endpoint}`;
      const options = {
        headers: await this.getHeaders(authType),
        observe: 'response' as const
      };

      const response = await this.http.post<T>(url, body, options).pipe(
        catchError(error => {
          this.loadingService.hideLoadingForApiCall();
          return throwError(() => error);
        })
      ).toPromise();

      this.loadingService.hideLoadingForApiCall();
      return this.handleApiResponse<T>(response?.body, response?.status || 200,returnAllResponse);
    } catch (error: any) {
      if (error.status && [401, 404, 500].includes(error.status)) {
        return this.handleApiResponse(error.error, error.status);
      }
      throw this.handleError(error);
    }
  }

  // PUT request with proper typing
  async put<T>(endpoint: string, authType: string,body: any): Promise<ApiResponse<T>> {
    try {
      this.loadingService.showLoadingForApiCall();
      
      const url = `${this.API_URL}/${endpoint}`;
      const options = {
        headers: await this.getHeaders(authType),
        observe: 'response' as const
      };

      const response = await this.http.put<T>(url, body, options).pipe(
        catchError(error => {
          this.loadingService.hideLoadingForApiCall();
          return throwError(() => error);
        })
      ).toPromise();

      this.loadingService.hideLoadingForApiCall();
      return this.handleApiResponse<T>(response?.body, response?.status || 200);
    } catch (error: any) {
      if (error.status && [401, 404, 500].includes(error.status)) {
        return this.handleApiResponse(error.error, error.status);
      }
      throw this.handleError(error);
    }
  }

  // DELETE request with proper typing
  async delete<T>(endpoint: string, authType: string): Promise<ApiResponse<T>> {
    try {
      this.loadingService.showLoadingForApiCall();
      
      const url = `${this.API_URL}/${endpoint}`;
      const options = {
        headers: await this.getHeaders(authType),
        observe: 'response' as const
      };

      const response = await this.http.delete<T>(url, options).pipe(
        catchError(error => {
          this.loadingService.hideLoadingForApiCall();
          return throwError(() => error);
        })
      ).toPromise();

      this.loadingService.hideLoadingForApiCall();
      return this.handleApiResponse<T>(response?.body, response?.status || 200);
    } catch (error: any) {
      if (error.status && [401, 404, 500].includes(error.status)) {
        return this.handleApiResponse(error.error, error.status);
      }
      throw this.handleError(error);
    }
  }

  async getEventId(): Promise<string>{
    let eventId = await this.cacheService.get('event_id') as string;
    if(eventId){
      return eventId;
    }
    return '0';
  }
}
