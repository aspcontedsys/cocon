import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  private storageKey = 'auth_token';
  public redirectUrl: string | null = null;

  constructor(
    private router: Router,
    private cacheService: CacheService
  ) {
    this.initStorage();
  }

  private async initStorage() {
    this.checkToken();
  }

  private async checkToken() {
    const token = await this.cacheService.get(this.storageKey);
    this.authState.next(!!token);
  }

  async login(token: string) {
    await this.cacheService.set(this.storageKey, token);
    this.authState.next(true);
    
    // Redirect to the stored URL or home
    const redirect = this.redirectUrl || '/home/dashboard';
    this.router.navigateByUrl(redirect, { replaceUrl: true });
    this.redirectUrl = null; // Clear the redirect URL after use
  }

  async logout() {
    await this.cacheService.remove(this.storageKey);
    this.authState.next(false);
    // Clear navigation stack and redirect to login
    this.router.navigate(['/home/login'], { 
      replaceUrl: true,
      queryParams: { logout: true }
    });
  }

  isAuthenticated(): Observable<boolean> {
    this.checkToken();
    return this.authState.asObservable();
  }

  async getToken(): Promise<string | null> {
    return await this.cacheService.get(this.storageKey);
  }

  isLoggedIn(): boolean {
    //this.checkToken();
    return this.authState.value;
  }

  // Add this method to handle token refresh if needed
  async refreshToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return false;
      
      // Here you would typically make an API call to refresh the token
      // For now, we'll just update the storage timestamp
      await this.cacheService.set('last_activity', Date.now());
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.logout();
      return false;
    }
  }
}
