import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../components/login/login.page'; 
import { DataService } from '../../services/data/data.service';
import { EventDetails } from '../../app/models/cocon.models';
import { Browser } from '@capacitor/browser';
import { NotificationService } from '../../services/notification/notification.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
  providers: [ModalController]
})
export class DashboardPage implements OnInit {
  eventDetails: EventDetails = {} as EventDetails;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private dataService: DataService,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {
    this.eventDetails = await this.dataService.getEventDetails();
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

  async startScan() {
    const result = await this.checkAndOpenScanner();
    if(result?.success){
      try {
        await this.dataService.addExhibitorFavourite({ badge_number: result?.data });
        this.notificationService.showNotification('Successfully added to favorites!');
      } catch (error) {
        console.error('Error adding favorite:', error);
        this.notificationService.showNotification('Failed to add to favorites');
      }}
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