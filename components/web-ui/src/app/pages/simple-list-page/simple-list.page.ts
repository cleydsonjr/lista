import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SimpleItem, SimpleItemService, SimpleList, SimpleListOperationCommand, SimpleListOperationResult, SimpleListService} from "@zaps/lists-angular-client";
import {MDCTextField} from "@material/textfield";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {mergeMap} from "rxjs/operators";
import {SimpleListDataService} from "../../data/simple-list-data.service";
import {WebSocketSubject} from "rxjs/webSocket";
import {MDCDialog} from "@material/dialog";

@Component({
  selector: 'app-simple-list-page',
  templateUrl: './simple-list.page.html',
  styleUrls: ['./simple-list.page.scss']
})
export class SimpleListPage implements OnInit, AfterViewInit {

  list?: SimpleList;
  items: SimpleItem[] = [];
  hasShareApi = false;
  @ViewChild('textField') textFieldRef?: ElementRef;
  @ViewChild('simpleList') simpleListRef?: ElementRef<HTMLUListElement>;
  @ViewChild('alertDialog') alertDialogRef?: ElementRef<HTMLDivElement>;
  webSocketSubject?: WebSocketSubject<SimpleListOperationResult>
  private alertDialog?: MDCDialog;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _simpleListService: SimpleListService,
    private readonly _simpleItemService: SimpleItemService,
    private readonly _simpleListDataService: SimpleListDataService,
  ) {
  }

  ngOnInit(): void {
    const navigator = window.navigator as Navigator;
    this.hasShareApi = !!navigator.share;
    this._activatedRoute.params.pipe(
      mergeMap((params: Params) => this._simpleListService.getSimpleListById(params.listId))
    ).subscribe(((list: SimpleList) => {
      this.list = list;
      this.items = list.items;
      setTimeout(() => {
        this.scrollToBottom();
      })
    }));
    this.webSocketSubject = this._simpleListDataService.connect('7');
    this.webSocketSubject.subscribe((result => this.refreshByResult(result)))
  }

  ngAfterViewInit(): void {
    if (this.textFieldRef) {
      MDCTextField.attachTo(this.textFieldRef.nativeElement);
    }
    if (this.alertDialogRef) {
      this.alertDialog = MDCDialog.attachTo(this.alertDialogRef.nativeElement);
      this.alertDialog.open();
    }
  }

  openShareDialog(): void {
    const navigator = window.navigator as Navigator;
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

  scrollToBottom(): void {
    if (this.simpleListRef) {
      const nativeElement = this.simpleListRef.nativeElement;
      nativeElement.scrollTo({
        top: nativeElement.scrollHeight
      });
    }
  }

  appendItem($event: Event): void {
    if (this.list && $event.target instanceof HTMLInputElement && $event.target.value) {
      const textField = $event.target as HTMLInputElement;
      const simpleItemCommand = {value: textField.value};
      this._simpleItemService.appendItem(this.list.id, simpleItemCommand).subscribe((item) => {
        console.trace(item)
        this.scrollToBottom();
        textField.value = '';
      })
    }
  }

  editLastItem($event: Event): void {
    if ($event.target instanceof HTMLInputElement && $event.target.value) {
      this.moveToPreviousInput($event.target);
      this.scrollToBottom();
    }
  }

  removeItem(index: number): void {
    if (this.list) {
      this._simpleItemService.deleteItem(this.list.id, index).subscribe((item) => {
        console.trace(item)
      })
    }
  }

  addItem(index: number, value: string): void {
    if (this.list) {
      this._simpleItemService.addItem(this.list.id, index, {value: value}).subscribe((item) => {
        console.trace(item)
      })
    }
  }

  execute(command: SimpleListOperationCommand): void {
    if (this.list) {
      this._simpleListService.executeOperation(this.list.id, command).subscribe((result) => {
        this.refreshByResult({
          command: command,
          resultItem: result.resultItem,
        })
      })
    }
  }

  refreshByResult(operationResult: SimpleListOperationResult): void {
    const command = operationResult.command;
    switch (command.operation) {
      case "APPEND":
        this.items.push(operationResult.resultItem);
        break;
      case "ADD":
        if (command.index) {
          this.items.splice(command.index, 0, operationResult.resultItem);
        }
        break;
      case "UPDATE":
        if (command.index) {
          const simpleItem = this.items[command.index];
          if (simpleItem) {
            simpleItem.value = operationResult.resultItem.value
            simpleItem.dateUpdated = operationResult.resultItem.dateUpdated
          }
        }
        break;
      case "DELETE":
        if (command.index) {
          this.items.splice(command.index, 1);
        }
        break;
    }
  }

  removeItemIfEmpty(index: number, $event: Event, focusPrevious = false): void {
    if ($event.target instanceof HTMLInputElement && !$event.target.value) {
      this.removeItem(index);
      if (focusPrevious) {
        this.moveToPreviousInput($event.target);
      }
    }
  }

  listItemInputEnter(index: number, $event: Event): void {
    if ($event.target instanceof HTMLInputElement && $event.target.value) {
      const targetInput = $event.target;
      const targetIndex = index + 1;
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

  listItemInput($event: Event, index: number): void {
    if (this.list && $event.target instanceof HTMLInputElement && $event.target.value) {
      this._simpleItemService.updateItem(this.list.id, index, {value: $event.target.value}).subscribe((item) => {
        console.trace(item)
      })
    }
  }

  listItemInputFocus($event: Event): void {
    if ($event.target && $event.target instanceof HTMLInputElement) {
      const input: HTMLInputElement = $event.target;
      input.select();
    }
  }

  listItemInputArrowUp($event: Event): void {
    if ($event.target instanceof HTMLInputElement) {
      this.moveToPreviousInput($event.target);
    }
  }

  listItemInputArrowDown($event: Event): void {
    if ($event.target instanceof HTMLInputElement) {
      this.moveToNextInput($event.target);
    }
  }

  moveToNextInput(targetInput: HTMLInputElement): void {
    if (targetInput.parentElement && targetInput.parentElement.parentElement) {
      const nextFormFieldElement = targetInput.parentElement.parentElement.nextElementSibling;
      if (nextFormFieldElement && nextFormFieldElement instanceof HTMLLIElement) {
        SimpleListPage.focusChildInput(nextFormFieldElement);
      }
    }
  }

  moveToPreviousInput(targetInput: HTMLInputElement): void {
    if (targetInput.parentElement && targetInput.parentElement.parentElement) {
      const nextFormFieldElement = targetInput.parentElement.parentElement.previousElementSibling;
      if (nextFormFieldElement && nextFormFieldElement instanceof HTMLLIElement) {
        SimpleListPage.focusChildInput(nextFormFieldElement);
      }
    }
  }

  private static focusChildInput(nextFormFieldElement: HTMLLIElement): void {
    const inputChildren = nextFormFieldElement.getElementsByTagName('input');
    if (inputChildren.length === 1) {
      inputChildren[0].focus();
    }
  }

}
