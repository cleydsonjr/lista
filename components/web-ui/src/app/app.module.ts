import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePage} from './pages/home-page/home.page';
import {SimpleListPage} from './pages/simple-list-page/simple-list.page';
import {DataModule} from "./data/data.module";

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    SimpleListPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
