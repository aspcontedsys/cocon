import { Component,OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../../services/data/data.service';
import { Attractions} from '../models/cocon.models';

@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.page.html',
  styleUrls: ['./attraction.page.scss'],
  standalone:false
})
export class AttractionPage implements OnInit,OnDestroy {
  currentSlide = 0;
  progress = 0;
  autoplayDuration = 5000; 
  autoplayStep = 50;
  autoplayInterval: any;
  progressInterval: any;
  
  attractionsList: Attractions[] = [];
  currentTabId: number | null = null;
  currentAttractions: any[] = [];  

  constructor(private router: Router, private location: Location,private dataService:DataService) {}
ngOnInit() {
    this.loadAttractions();
  }

  async loadAttractions() {
    try {
      this.attractionsList = await this.dataService.getAttractionWithCategoryAndList();
      if (this.attractionsList.length > 0) {
        this.selectTab(this.attractionsList[0].id);
      }
    } catch (error) {
      console.error('Error loading attractions:', error);
    }
  }

  ionViewDidEnter() {
    //this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  selectTab(id: number) {
    this.currentTabId = id;
    this.currentSlide = 0;
    this.stopAutoplay();
    
    const selectedCategory = this.attractionsList.find(cat => cat.id === id);
    this.currentAttractions = selectedCategory?.attractions || [];
    
    //this.startAutoplay();
  }

  nextSlide() {
    if (this.currentAttractions.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.currentAttractions.length;
    //this.resetProgress();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    //this.resetProgress();
  }

  startAutoplay() {
    this.stopAutoplay();
    
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDuration);

    this.progressInterval = setInterval(() => {
      this.progress += (100 / (this.autoplayDuration / this.autoplayStep));
      if (this.progress >= 100) {
        this.progress = 0;
      }
    }, this.autoplayStep);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      clearInterval(this.progressInterval);
      this.progress = 0;
    }
  }

  resetProgress() {
    this.progress = 0;
  }

  goBack() {
    this.location.back();
  }
  
}
