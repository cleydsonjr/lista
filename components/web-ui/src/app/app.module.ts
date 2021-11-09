import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePage} from './pages/home-page/home.page';
import {SimpleListPage} from './pages/simple-list-page/simple-list.page';
import {DataModule} from "./data/data.module";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "./shared/shared.module";
import { AboutPage } from './pages/about-page/about.page';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    SimpleListPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataModule,
    FormsModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
