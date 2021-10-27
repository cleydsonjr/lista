import {Component, OnInit} from '@angular/core';
import {SimpleListService} from "@zaps/lists-angular-client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly simpleListService: SimpleListService,
  ) {
  }

  ngOnInit(): void {
  }

  createNewList() {
    this.simpleListService.addSimpleList({name: 'Teste okok'}).subscribe((newList) => {
      this.router.navigate([newList.id])
    })
  }

}
