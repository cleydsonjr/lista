import {Component} from '@angular/core';
import * as copy from "copy-to-clipboard";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-about-page',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss']
})
export class AboutPage {

  pixKey = '0e0a0859-7f79-4101-baa9-5df6c0a36269';
  displayCopyInfo = false;
  navigated = false;

  constructor(
    private readonly _router: Router,
    private readonly _location: Location
  ) {
    this.navigated = _router.navigated
  }

  copyPix(): void {
    copy(this.pixKey)
    this.displayCopyInfo = true;
    setTimeout(() => this.displayCopyInfo = false, 500)
  }

  goBack(): void {
    this._location.back();
  }
}
