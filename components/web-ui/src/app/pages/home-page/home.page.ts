import {Component} from '@angular/core';
import {SimpleListService} from "@zaps/lists-angular-client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  constructor(
    private readonly router: Router,
    private readonly simpleListService: SimpleListService,
  ) {
  }

  createNewList(): void {
    this.simpleListService.addSimpleList({name: 'Nova lista lista lista lista'}).subscribe((newList) => {
      this.router.navigate([newList.id])
    })
  }

}
