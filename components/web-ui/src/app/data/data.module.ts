import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiModule, Configuration, SimpleItemService, SimpleListService} from '@zaps/lists-angular-client'
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
    ApiModule,
  ],
  providers: [
    SimpleListService,
    SimpleItemService,
    {
      provide: Configuration,
      useFactory: (): Configuration => new Configuration({
        basePath: ''
      })
    }
  ]
})
export class DataModule {
}
