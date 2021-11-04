import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SimpleItem, SimpleItemService, SimpleList, SimpleListOperationCommand, SimpleListOperationResult, SimpleListService} from "@zaps/lists-angular-client";
import {MDCTextField} from "@material/textfield";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {debounceTime, filter, map, mergeMap, tap} from "rxjs/operators";
import {SimpleListDataService} from "../../data/simple-list-data.service";
import {WebSocketSubject} from "rxjs/webSocket";
import {Subject} from "rxjs";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-simple-list-page',
  templateUrl: './simple-list.page.html',
  styleUrls: ['./simple-list.page.scss']
})
export class SimpleListPage implements OnInit, AfterViewInit {

  webSocketSubject?: WebSocketSubject<SimpleListOperationResult>
  list?: SimpleList;
  items: SimpleItem[] = [];
  hasShareApi = false;
  @ViewChild('textField') textFieldRef?: ElementRef;
  @ViewChild('simpleList') simpleListRef?: ElementRef<HTMLUListElement>;
  @ViewChild('alertDialog') alertDialogRef?: ElementRef<HTMLDivElement>;
  @ViewChild('newItemForm') newItemForm?: NgForm;

  operationCommandSubject: Subject<SimpleListOperationCommand> = new Subject<SimpleListOperationCommand>();

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
    this._activatedRoute.paramMap.pipe(
      filter((params: ParamMap) => params.has('listId')),
      map((params: ParamMap) => params.get('listId')!),
      tap((listId: string) => {
        this.webSocketSubject = this._simpleListDataService.connect(listId);
        this.webSocketSubject.subscribe((result => this.refreshByResult(result)));
      }),
      mergeMap((listId: string) => this._simpleListService.getSimpleListById(listId))
    ).subscribe(((list: SimpleList) => {
      this.list = list;
      this.items = list.items;
      this.subscribeToOperationCommand(list.id);
      setTimeout(() => {
        this.scrollToBottom();
      })
    }));
  }

  ngAfterViewInit(): void {
    if (this.textFieldRef) {
      MDCTextField.attachTo(this.textFieldRef.nativeElement);
    }
  }

  subscribeToOperationCommand(listId: string): void {
    this.operationCommandSubject.pipe(
      debounceTime(500),
      mergeMap((command) => this._simpleListService.executeOperation(listId, command))
    ).subscribe(
      (result) => console.trace(result),
      (result) => console.error(result),
    )
  }

  openShareDialog(): void {
    const navigator = window.navigator as Navigator;
    if (navigator.share && this.list) {
      navigator.share({
        title: this.list.name,
        text: this.listReadableDescription,
        url: location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }

  get listReadableDescription(): string {
    let description = this.items.slice(0, 3).map((i) => i.value).join(', ');
    if (this.items.length > 4) {
      description = description.concat(' e mais ' + (this.items.length - 3) + ' itens.')
    } else if (this.items.length > 3) {
      description = description.concat(' e mais 1 item.')
    }
    return description;
  }

  scrollToBottom(): void {
    if (this.simpleListRef) {
      const nativeElement = this.simpleListRef.nativeElement;
      nativeElement.scrollTo({
        top: nativeElement.scrollHeight
      });
    }
  }

  appendItem(): void {
    if (this.list && this.newItemForm && this.newItemForm.value['itemValue']) {
      this._simpleItemService.appendItem(this.list.id, {value: this.newItemForm.value['itemValue']}).subscribe((item) => {
        console.trace(item)
        this.scrollToBottom();
        this.newItemForm?.setValue({
          itemValue: '',
        })
      })
    }
  }

  editLastItem($event: Event, listItemElement: HTMLLIElement): void {
    if ($event.target instanceof HTMLInputElement && !$event.target.value) {
      this.moveToPreviousInput(listItemElement);
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

  refreshByResult(operationResult: SimpleListOperationResult): void {
    const command = operationResult.command;
    switch (command.operation) {
      case "APPEND":
        this.items.push(operationResult.resultItem);
        break;
      case "ADD":
        if (command.index !== undefined) {
          this.items.splice(command.index, 0, operationResult.resultItem);
        }
        break;
      case "UPDATE":
        if (command.index !== undefined) {
          const simpleItem = this.items[command.index];
          if (simpleItem) {
            simpleItem.value = operationResult.resultItem.value
            simpleItem.dateUpdated = operationResult.resultItem.dateUpdated
          }
        }
        break;
      case "DELETE":
        if (command.index !== undefined) {
          this.items.splice(command.index, 1);
        }
        break;
    }
  }

  removeItemIfEmpty(index: number, $event: Event, listItemElement: HTMLLIElement, focusPrevious = false): void {
    if ($event.target instanceof HTMLInputElement && !$event.target.value) {
      this.removeItem(index);
      if (focusPrevious) {
        this.moveToPreviousInput(listItemElement);
      }
    }
  }

  listItemInputEnter(index: number, $event: Event, listItemElement: HTMLLIElement): void {
    if ($event.target instanceof HTMLInputElement && $event.target.value) {
      const targetInput = $event.target;
      const targetIndex = index + 1;
      if (targetIndex === this.items.length) {
        this.moveToNextInput(listItemElement);
      } else if ((this.items.length > targetIndex && this.items[targetIndex].value) || this.items.length <= targetIndex) {
        this.addItem(targetIndex, '');

        // Foca o input adicionado
        setTimeout(() => {
          if (targetInput instanceof HTMLInputElement) {
            this.moveToNextInput(listItemElement);
          }
        }, 200);
      }
    }
  }

  listItemInput($event: Event, index: number): void {
    if ($event.target instanceof HTMLInputElement && $event.target.value) {
      this.operationCommandSubject.next({
        operation: "UPDATE",
        index: index,
        item: {
          value: $event.target.value,
        }
      });
    }
  }

  listItemInputFocus($event: Event): void {
    if ($event.target && $event.target instanceof HTMLInputElement) {
      const input: HTMLInputElement = $event.target;
      input.select();
    }
  }

  listItemInputArrowUp(listItemElement: HTMLLIElement): void {
    this.moveToPreviousInput(listItemElement);
  }

  listItemInputArrowDown(listItemElement: HTMLLIElement): void {
    this.moveToNextInput(listItemElement);
  }

  moveToNextInput(listItemElement: HTMLLIElement): void {
    const nextListItemElement = listItemElement.nextElementSibling;
    if (nextListItemElement && nextListItemElement instanceof HTMLLIElement) {
      SimpleListPage.focusChildInput(nextListItemElement);
    }
  }

  moveToPreviousInput(listItemElement: HTMLLIElement): void {
    const previousListItemElement = listItemElement.previousElementSibling;
    if (previousListItemElement && previousListItemElement instanceof HTMLLIElement) {
      SimpleListPage.focusChildInput(previousListItemElement);
    }
  }

  private static focusChildInput(nextFormFieldElement: HTMLLIElement, select = false): void {
    const inputChildren = nextFormFieldElement.getElementsByTagName('input');
    if (inputChildren.length === 1) {
      inputChildren[0].focus();
      if (select) {
        inputChildren[0].select();
      }
    }
  }

}
