import {Component} from '@angular/core';
import {SimpleList, SimpleListService, SimpleListType} from "@zaps/lists-angular-client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  SimpleListType = SimpleListType;

  constructor(
    private readonly _router: Router,
    private readonly _simpleListService: SimpleListService,
  ) {
  }

  createNewList(type: SimpleListType): void {
    this._simpleListService.addSimpleList({name: '', type: type, description: null}).subscribe(
      (newList: SimpleList) => {
        this._router.navigate([newList.id])
      },
      (error: unknown) => console.error(error)
    )
  }

}
