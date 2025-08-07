import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../../services/data/data.service';
import { Category ,Attraction} from '../models/cocon.models';

@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.page.html',
  styleUrls: ['./attraction.page.scss'],
  standalone:false
})
export class AttractionPage implements OnInit {
  selectedTabName: string = 'beaches';
  currentSlide: number = 0;
  autoplayInterval: any;
  progress = 0;
  autoplayDuration = 2000;
  autoplayStep = 100;

  CategoryList:Category[]=[];
  attractionList:Attraction[]=[];
  currentTabId:number=0;  

  constructor(private router: Router, private location: Location,private dataService:DataService) {}

  ngOnInit() {
    this.ionViewDidEnter();
    this.startAutoplay();
  }

  async ionViewDidEnter() {
    this.CategoryList = await this.dataService.getAttractionCategories();
    this.selectTab(this.CategoryList[0].id);
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  goBack() {
    this.location.back();
  }

  async selectTab(id: number) {
    this.currentTabId = id;
    this.currentSlide = 0;
    this.stopAutoplay();
    this.attractionList = await this.dataService.getAttractionList(this.currentTabId.toString());
    this.startAutoplay();
  }

  nextSlide() {
    const activeList = this.attractionList;

    this.currentSlide = (this.currentSlide + 1) % activeList.length;
    this.resetProgress();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetProgress();
  }

  resetProgress() {
    this.progress = 0;
  }

  startAutoplay() {
    this.stopAutoplay();
    let elapsed = 0;
    this.progress = 0;
    this.autoplayInterval = setInterval(() => {
      elapsed += this.autoplayStep;
      this.progress = Math.min((elapsed / this.autoplayDuration) * 100, 100);
      if (elapsed >= this.autoplayDuration) {
        this.nextSlide();
        elapsed = 0;
      }
    }, this.autoplayStep);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    this.progress = 0;
  }

}
