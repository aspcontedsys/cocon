import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NotificationModule } from './components/notification/notification.module';
import { LoadingModule } from './components/loading/loading.module';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthGuard } from '../services/Auth/auth.guard';
import { AuthService } from '../services/Auth/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NotificationModule,
    LoadingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
