import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../components/login/login.page'; 
import { DataService } from '../../services/data/data.service';
import { EventDetails, RegisteredUser } from '../../app/models/cocon.models';
import { Browser } from '@capacitor/browser';
import { NotificationService } from '../../services/notification/notification.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular';
import { CacheService } from '../../services/cache/cache.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
  providers: [ModalController]
})
export class DashboardPage implements OnInit {
  eventDetails: EventDetails = {} as EventDetails;
  isExhibitorStatus: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private dataService: DataService,
    private notificationService: NotificationService,
    private platform: Platform,
    private cacheService: CacheService
  ) { }

  async ngOnInit() {
    this.eventDetails = await this.dataService.getEventDetails();
    // Initialize exhibitor status
    if (this.isLoggedIn()) {
      this.isExhibitorStatus = await this.isExhibitor();
    }
  }

  // Route navigation
  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  // Open external website using Capacitor Browser
  async openWebsite(url: string = '') {
    if (url) {
      await Browser.open({ url });
    }
  }

  // Open PDF in a new page
  async openPdfPage(pdfUrl: string,pdfType: 'venue-layout' | 'stall-layout') {
    try {
      
      if (pdfUrl) {
        this.router.navigate(['/home/'+pdfType], { 
          queryParams: { pdfUrl: pdfUrl } 
        });
      } else {
        console.error('PDF URL not found');
      }
    } catch (err) {
      console.error('Error navigating to PDF:', err);
    }
  }

  // Modal opening for delegate login
  async openLoginModal() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal'
    });
    await modal.present();
  }

  // Carousel 
  @ViewChild('programCarousel', { static: false }) programCarousel!: ElementRef;
  @ViewChild('badgeCarousel', { static: false }) badgeCarousel!: ElementRef;
  @ViewChild('conferenceCarousel', { static: false }) conferenceCarousel!: ElementRef;
  @ViewChild('venueCarousel', { static: false }) venueCarousel!: ElementRef;
  @ViewChild('exhibitorsCarousel', { static: false }) exhibitorsCarousel!: ElementRef;

  // Carousel scroll 
  scrollCarousel(
    section: 'program' | 'badge' | 'conference' | 'venue' | 'exhibitors',
    direction: 'next' | 'prev'
  ) {
    let scrollContainer: ElementRef | undefined;

    switch (section) {
      case 'program':
        scrollContainer = this.programCarousel;
        break;
      case 'badge':
        scrollContainer = this.badgeCarousel;
        break;
      case 'conference':
        scrollContainer = this.conferenceCarousel;
        break;
      case 'venue':
        scrollContainer = this.venueCarousel;
        break;
      case 'exhibitors':
        scrollContainer = this.exhibitorsCarousel;
        break; 
    }

    const scrollDistance = 250;

    if (scrollContainer?.nativeElement) {
      scrollContainer.nativeElement.scrollBy({
        left: direction === 'next' ? scrollDistance : -scrollDistance,
        behavior: 'smooth',
      });
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  async isExhibitor(): Promise<boolean> {
    try {
      return await this.authService.isExhibitor();
    } catch (error) {
      console.error('Error checking exhibitor status:', error);
      return false;
    }
  }

  async startScan() {
    const result = await this.checkAndOpenScanner();
    if(result?.success) {
      try {
        let returnData = await this.dataService.addExhibitorFavourite({ badge_number: result?.data });
        if(returnData.status === 'success') {
          this.notificationService.showNotification(returnData?.message, 'success');
        }
        else if(returnData.status === 'error') {
          this.notificationService.showNotification(returnData?.message, 'error');
        }
        else {
          this.notificationService.showNotification(returnData?.message ?? 'Please check the QR code and try again', 'error');
        }
      } catch (error: any) {
        console.error('Error in startScan:', error);
          this.notificationService.showNotification(
            'An error occurred while processing the QR code. Please try again.',
            'error'
          );
      }
    }
  }

  async updateFeedback() {
   const result = await this.checkAndOpenScanner();
   if(result?.success){
    this.router.navigate(['/home/feedback'], { queryParams: { topic_id: result?.data } });
   }
  }

  async checkAndOpenScanner(){

    let result = {success: false, data:''};
    try {
        let data: string | null = null;
        if(this.platform.is('android')){
          const barcodescannerinstalled = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
          if(!barcodescannerinstalled.available){
            await BarcodeScanner.installGoogleBarcodeScannerModule();
          }
          if(barcodescannerinstalled.available){
          // Check camera permission
          let status = await BarcodeScanner.checkPermissions();
          
          if (status.camera === 'prompt') {
            // If permission is not determined, request it
            status = await BarcodeScanner.requestPermissions();
          }

          if (status.camera !== 'granted') {
            this.notificationService.showNotification('Camera permission is required for scanning');
            return;
          }

          // Hide everything except the scanner
          document.body.style.background = 'transparent';
          document.querySelectorAll('ion-header, ion-content, ion-footer, ion-tab-bar')
            .forEach(element => (element as HTMLElement).style.display = 'none');
          
          try {
            const { barcodes } = await BarcodeScanner.scan();
            if (barcodes.length > 0) {
              data = barcodes[0].rawValue ?? null;
            }
          } finally {
            // Always show the UI elements again
            document.body.style.background = '';
            document.querySelectorAll('ion-header, ion-content, ion-footer, ion-tab-bar')
              .forEach(element => (element as HTMLElement).style.display = '');
          }
          
          if (data){
            result.success = true;
            result.data = data;
          }
          return result;
          }
        }
        else{
          try {
            const { barcodes } = await BarcodeScanner.scan();
            if (barcodes.length > 0) {
              data = barcodes[0].rawValue ?? null;
            }
          } finally {
            // Always show the UI elements again
            document.body.style.background = '';
            document.querySelectorAll('ion-header, ion-content, ion-footer, ion-tab-bar')
              .forEach(element => (element as HTMLElement).style.display = '');
          }
          
          if (data){
            result.success = true;
            result.data = data;
          }
          return result;
        }
    }
    catch (error) {
      console.error('Scan error:', error);
      this.notificationService.showNotification('Error accessing camera: ' + (error as Error).message);
      return result;
    }
    finally {
     return result; 
    }
  }
}