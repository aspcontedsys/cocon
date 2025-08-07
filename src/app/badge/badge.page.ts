import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { VirtualBadge } from '../models/cocon.models';
@Component({
  selector: 'app-badge',
  templateUrl: './badge.page.html',
  styleUrls: ['./badge.page.scss'],
  standalone: false
})
export class BadgePage implements OnInit {

  userDetails :VirtualBadge ={} as VirtualBadge;

  constructor(private router: Router,private dataservice:DataService) { }

  ngOnInit() {
    this.getBadgeDetails();
  }

  async getBadgeDetails() {
   this.userDetails =await this.dataservice.getDelegateBadge();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
