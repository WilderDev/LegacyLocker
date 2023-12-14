import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './shared/auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './shared/auth/auth-interceptor.service';
import { NavigationComponent } from './shared/navigation/navigation.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './core/landing-page/landing-page.component';
import { TimecapsuleFormComponent } from './core/timecapsule/timecapsuleForm/timecapsule-form.component';
import { TimecapsuleViewComponent } from './core/timecapsule/timecapsuleView/timecapsule-view.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ViewTimecapsuleComponent } from './core/timecapsule/timecapsuleView/view-timecapsule/view-timecapsule.component';
import { TimecapsuleItemComponent } from './core/timecapsule/timecapsuleView/timecapsule-item/timecapsule-item.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavigationComponent,
    LandingPageComponent,
    TimecapsuleFormComponent,
    TimecapsuleViewComponent,
    ViewTimecapsuleComponent,
    TimecapsuleItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
