import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../../services/Auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      { 
        path: 'favourites',
        loadChildren:() => import('../favourites/favourites.module').then(m => m.FavouritesPageModule)
      },
      {
        path: 'delegates',
        loadChildren: () => import('../delegates/delegates.module').then(m => m.DelegatesPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        loadChildren: () => import('../components/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'badge',
        loadChildren: () => import('../badge/badge.module').then(m => m.BadgePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'feedback',
        loadChildren: () => import('../feedback/feedback.module').then(m => m.FeedbackPageModule)
      },

      {
        path: 'attraction',
        loadChildren: () => import('../attraction/attraction.module').then(m => m.AttractionPageModule)
      },
       {
        path: 'accommodation',
        loadChildren: () => import('../accommodation/accommodation.module').then( m => m.AccommodationPageModule)
      },
      {
        path: 'venue-layout',
        loadChildren: () => import('../venue-layout/venue-layout.module').then(m => m.VenueLayoutPageModule)
      },
      {
        path: 'stall-layout',
        loadChildren: () => import('../stall-layout/stall-layout.module').then(m => m.StallLayoutPageModule)
      },
      {
        path: 'exhibitors',
        loadChildren: () => import('../exhibitors/exhibitors.module').then(m => m.ExhibitorsPageModule)
      },
      {
        path: 'sponsors',
        loadChildren: () => import('../sponsors/sponsors.module').then(m => m.SponsorsPageModule)
      },
      {
        path: 'chatpage/:id/:conversationid',
        loadChildren: () => import('../chatpage/userchat.module').then(m => m.UserChatPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'app-help',
        loadChildren: () => import('../app-help/help.module').then(m => m.HelpPageModule),
      },
      {
        path: 'directory',
        loadChildren: () => import('../directory/directory.module').then(m => m.DirectoryPageModule),
      },
      {
        path: 'today-schedule',
        loadChildren: () => import('../todays-schedule/today-schedule.module').then(m => m.TodaySchedulePageModule),
      },
      {
        path: 'about-conference',
        loadChildren: () => import('../about-conference/about-conference.module').then(m => m.AboutConferencePageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationPageModule)
      },
      {
        path: 'shuttle-service',
        loadChildren:() => import ('../shuttle-service/shuttle-service-routing.module').then (m => m.ShuttleServicePageRoutingModule)
      },
      {
        path: 'exhibitors-report',
        loadChildren:() => import ('../exhibitors-report/exhibitors-report-routing.module').then (m => m.ExhibitorsReportPageRoutingModule)
      },
      {
        path:'genericfeedback',
        loadChildren: () => import('../generic-feedback/genericfeedback.module').then(m => m.GenericFeedbackPageModule)
      }
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
