import { NgModule } from '@angular/core';
import { NavigationEnd, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthGuard } from '../services/Auth/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Store the current navigation URL
      const currentUrl = event.urlAfterRedirects || event.url;
      
      // If trying to navigate back to splash from home, redirect to home
      if (currentUrl === '/splash' && this.router.getCurrentNavigation()?.previousNavigation) {
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
  }
}
