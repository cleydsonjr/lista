import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SimpleItem, SimpleItemService, SimpleList, SimpleListOperationCommand, SimpleListOperationResult, SimpleListService} from "@zaps/lists-angular-client";
import {MDCTextField} from "@material/textfield";
import {of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {mergeMap} from "rxjs/operators";
import {SimpleListDataService} from "../../data/simple-list-data.service";

@Component({
  selector: 'app-simple-list-page',
  templateUrl: './simple-list.page.html',
  styleUrls: ['./simple-list.page.scss']
})
export class SimpleListPage implements OnInit, AfterViewInit {

  list?: SimpleList;
  items: SimpleItem[] = [];
  hasShareApi: boolean = false;
  @ViewChild('textField') textFieldRef?: ElementRef;
  @ViewChild('simpleList') simpleListRef?: ElementRef<HTMLUListElement>;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _simpleListService: SimpleListService,
    private readonly _simpleItemService: SimpleItemService,
    private readonly _simpleListDataService: SimpleListDataService,
  ) {
  }

  ngOnInit(): void {
    this.hasShareApi = !!navigator.share;
    this._activatedRoute.params.pipe(
      mergeMap((params) => this._simpleListService.getSimpleListById(params.listId))
    ).subscribe((list => {
      this.list = list;
      this.items = list.items;
      setTimeout(() => {
        this.scrollToBottom();
      })
      this._simpleListDataService.connect(list.id).subscribe((result => this.refreshByResult(result)))
    }));
  }

  ngAfterViewInit(): void {
    if (this.textFieldRef) {
      MDCTextField.attachTo(this.textFieldRef.nativeElement);
    }
  }

  openShareDialog(): void {
    if (navigator.share) {
      navigator.share({
        title: 'web.dev',
        text: 'Check out web.dev.',
        url: 'https://web.dev/',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }

  scrollToBottom() {
    if (this.simpleListRef) {
      let nativeElement = this.simpleListRef.nativeElement;
      nativeElement.scrollTo({
        top: nativeElement.scrollHeight
      });
    }
  }

  appendItem($event: Event) {
    if (this.list && $event.target instanceof HTMLInputElement && $event.target.value) {
      let textField = $event.target as HTMLInputElement;
      let simpleItemCommand = {value: textField.value};
      this._simpleItemService.appendItem(this.list.id, simpleItemCommand).subscribe((item) => {
        this.scrollToBottom();
        textField.value = '';
      })
    }
  }

  editLastItem($event: Event) {
    this.scrollToBottom();
    // this.removeItem(this.items.length - 1);
  }

  removeItem(index: number) {
    if (this.list) {
      this._simpleItemService.deleteItem(this.list.id, index).subscribe((item) => {

      })
    }
  }

  addItem(index: number, value: string) {
    if (this.list) {
      this._simpleItemService.addItem(this.list.id, index, {value: value}).subscribe((item) => {

      })
    }
  }

  execute(command: SimpleListOperationCommand) {
    of({
      dateCreated: '01/01/2021 08:00',
      dateUpdated: '01/01/2021 08:15',
      value: command.item!.value,
    }).subscribe((item) => {
      this.refreshByResult({
        command: command,
        resultItem: item,
      })
    })
  }

  refreshByResult(operationResult: SimpleListOperationResult) {
    let command = operationResult.command;
    switch (command.operation) {
      case "APPEND":
        this.items.push(operationResult.resultItem);
        break;
      case "ADD":
        this.items.splice(command.index!, 0, operationResult.resultItem);
        break;
      case "UPDATE":
        // this.items.splice(command.index!, 1, operationResult.resultItem);
        let simpleItem = this.items[command.index!];
        if (simpleItem) {
          simpleItem.value = operationResult.resultItem.value
          simpleItem.dateUpdated = operationResult.resultItem.dateUpdated
        }
        break;
      case "DELETE":
        this.items.splice(command.index!, 1);
        break;
    }
  }

  removeItemIfEmpty(index: number, $event: Event, focusPrevious = false) {
    if ($event.target instanceof HTMLInputElement && !$event.target.value) {
      this.removeItem(index);
      if (focusPrevious) {
        this.moveToPreviousInput($event.target);
      }
    }
  }

  listItemInputEnter(index: number, $event: Event) {
    if ($event.target instanceof HTMLInputElement && $event.target.value) {
      const targetInput = $event.target;
      let targetIndex = index + 1;
      if (targetIndex === this.items.length) {
        this.moveToNextInput(targetInput);
      } else if ((this.items.length > targetIndex && this.items[targetIndex].value) || this.items.length <= targetIndex) {
        this.addItem(targetIndex, '');

        // Foca o input adicionado
        setTimeout(() => {
          if (targetInput instanceof HTMLInputElement) {
            this.moveToNextInput(targetInput);
          }
        }, 200);
      }
    }
  }

  listItemInput($event: Event, index: number) {
    if (this.list && $event.target instanceof HTMLInputElement && $event.target.value) {
      this._simpleItemService.updateItem(this.list.id, index, {value: $event.target.value}).subscribe((item) => {
      })
    }
  }

  listItemInputFocus($event: Event): void {
    if ($event.target && $event.target instanceof HTMLInputElement) {
      const input: HTMLInputElement = $event.target;
      input.select();
    }
  }

  listItemInputArrowUp($event: Event) {
    if ($event.target instanceof HTMLInputElement) {
      this.moveToPreviousInput($event.target);
    }
  }

  listItemInputArrowDown($event: Event) {
    if ($event.target instanceof HTMLInputElement) {
      this.moveToNextInput($event.target);
    }
  }

  moveToNextInput(targetInput: HTMLInputElement) {
    if (targetInput.parentElement && targetInput.parentElement.parentElement) {
      const nextFormFieldElement = targetInput.parentElement.parentElement.nextElementSibling;
      if (nextFormFieldElement && nextFormFieldElement instanceof HTMLLIElement) {
        SimpleListPage.focusChildInput(nextFormFieldElement);
      }
    }
  }

  moveToPreviousInput(targetInput: HTMLInputElement) {
    if (targetInput.parentElement && targetInput.parentElement.parentElement) {
      const nextFormFieldElement = targetInput.parentElement.parentElement.previousElementSibling;
      if (nextFormFieldElement && nextFormFieldElement instanceof HTMLLIElement) {
        SimpleListPage.focusChildInput(nextFormFieldElement);
      }
    }
  }

  private static focusChildInput(nextFormFieldElement: HTMLLIElement) {
    const inputChildren = nextFormFieldElement.getElementsByTagName('input');
    if (inputChildren.length === 1) {
      inputChildren[0].focus();
    }
  }

}
