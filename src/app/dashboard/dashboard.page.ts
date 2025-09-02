import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../components/login/login.page'; 
import { DataService } from '../../services/data/data.service';
import { EventDetails } from '../../app/models/cocon.models';
import { Browser } from '@capacitor/browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
  providers: [ModalController]
})
export class DashboardPage {
  eventDetails: EventDetails = {} as EventDetails;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private dataService: DataService,
    private sanitizer: DomSanitizer
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
    return !this.authService.isLoggedIn();
  }
}




