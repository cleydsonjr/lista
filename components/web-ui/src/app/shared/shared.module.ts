import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateIntervalPipe} from './date-interval.pipe';

@NgModule({
  declarations: [
    DateIntervalPipe
  ],
  exports: [
    DateIntervalPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}
