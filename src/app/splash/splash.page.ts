import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonicModule,CommonModule],
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.navigateToHome();
    }, 3000); 
  }

  private navigateToHome() {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard']);
    }, 300); // Small delay for smooth transition
  }
}
