import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  constructor(public router: Router,
    public authService: AuthService

  ) {}
  ngOnInit(): void {
    
  }
  isloggedin(){
    return this.authService.isLoggedIn();
  }

}
