import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SimpleItem, SimpleItemService, SimpleList, SimpleListOperationCommand, SimpleListOperationResult, SimpleListService, SimpleListType} from "@zaps/lists-angular-client";
import {MDCTextField} from "@material/textfield";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {concatMap, debounceTime, filter, map, mergeMap, take, tap} from "rxjs/operators";
import {SimpleListDataService} from "../../data/simple-list-data.service";
import {WebSocketSubject} from "rxjs/webSocket";
import {from, Subject} from "rxjs";
import {NgForm} from "@angular/forms";
import {MDCMenu} from '@material/menu';
import * as copy from "copy-to-clipboard";
import {Key} from "ts-key-enum";

const NO_ITEM: Readonly<{ [key in SimpleListType]: string }> = {
  ITEMS: 'Nenhum item',
  PEOPLE: 'Nenhuma pessoa',
}

const ONE_ITEM: Readonly<{ [key in SimpleListType]: string }> = {
  ITEMS: '1 item',
  PEOPLE: '1 pessoa',
}

const ITEMS: Readonly<{ [key in SimpleListType]: string }> = {
  ITEMS: 'itens',
  PEOPLE: 'pessoas',
}

const MAX_LIST_LENGTH = 50;
const MAX_ITEM_VALUE_LENGTH = 25;

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
  @ViewChild('editListForm') editListForm?: NgForm;
  @ViewChild('contextMenuDiv') contextMenuRef?: ElementRef<HTMLDivElement>;

  contextMenu?: MDCMenu;
  infoPanelOpen = false;
  infoPanelEdit = false;

  maxListLength = MAX_LIST_LENGTH;
  maxItemValueLength = MAX_ITEM_VALUE_LENGTH;

  operationCommandSubject: Subject<SimpleListOperationCommand> = new Subject<SimpleListOperationCommand>();

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _simpleListService: SimpleListService,
    private readonly _simpleItemService: SimpleItemService,
    private readonly _simpleListDataService: SimpleListDataService,
    private readonly _elementRef: ElementRef
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
      if (this.editListForm) {
        this.editListForm.setValue({name: list.name, description: list.description || ''})
      }
      this.subscribeToOperationCommand(list.id);
      setTimeout(() => {
        this.scrollToBottom();
      })
    }));
  }

  ngAfterViewInit(): void {
    if (this.textFieldRef) {
      this._elementRef.nativeElement.querySelectorAll('label.mdc-text-field').forEach((labelElement: HTMLLabelElement) => MDCTextField.attachTo(labelElement));
    }
    if (this.contextMenuRef) {
      this.contextMenu = MDCMenu.attachTo(this.contextMenuRef.nativeElement);
    }
    document.addEventListener('keyup', (event) => {
      if (event.key == Key.Escape) {
        this.infoPanelOpen = false;
      }
    })
  }

  subscribeToOperationCommand(listId: string): void {
    this.operationCommandSubject.pipe(
      debounceTime(400),
      mergeMap((command) => this._simpleListService.executeOperation(listId, command))
    ).subscribe(
      (result) => console.debug(result),
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

  openContextMenu(): void {
    if (this.contextMenu) {
      this.contextMenu.open = true
    }
  }

  copyListToClipboard(): void {
    if (this.list) {
      const listText = '*' + this.list.name + '*' + '\n\n' +
        this.items
          .map((item, index) => (index + 1) + '. ' + item.value + (item.additional ? ' (+' + item.additional + ')' : ''))
          .join('\n');
      copy(listText);
    }
  }

  duplicateList(): void {
    if (this.list) {
      this._simpleListService.addSimpleList({name: null, type: null, description: null}, this.list.id).subscribe(
        (newList: SimpleList) => {
          this._router.navigate([newList.id])
        },
        (error: unknown) => console.error(error)
      )
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

  get listReadableLegend(): string {
    if (this.list) {
      const length = this.items.reduce((a, b) => a + (b ? (1 + (b.additional || 0)) : 0), 0)

      if (length === 0) {
        return NO_ITEM[this.list.type];
      } else if (length === 1) {
        return ONE_ITEM[this.list.type];
      } else {
        return length + ' ' + ITEMS[this.list.type];
      }
    } else {
      return '';
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

  appendItem(): void {
    if (this.list && this.newItemForm && this.newItemForm.value['itemValue']) {
      this._simpleItemService.appendItem(this.list.id, {value: this.newItemForm.value['itemValue'], additional: 0}).subscribe((item: SimpleItem) => {
        console.debug(item)
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
      this._simpleItemService.deleteItem(this.list.id, index).subscribe((item: SimpleItem) => {
        console.debug(item)
      })
    }
  }

  addItem(index: number, value: string): void {
    if (this.list) {
      this._simpleItemService.addItem(this.list.id, index, {value: value, additional: 0}).subscribe((item: SimpleItem) => {
        console.debug(item)
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
            simpleItem.additional = operationResult.resultItem.additional
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

  listItemInput($event: Event, index: number, item: SimpleItem): void {
    if ($event.target instanceof HTMLInputElement && $event.target.value) {
      this.operationCommandSubject.next({
        operation: "UPDATE",
        index: index,
        item: {
          value: $event.target.value,
          additional: item.additional,
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

  plusOne(index: number, item: SimpleItem): void {
    this.operationCommandSubject.next({
      operation: "UPDATE",
      index: index,
      item: {
        value: item.value,
        additional: (item.additional || 0) + 1,
      }
    });
  }

  minusOne(index: number, item: SimpleItem): void {
    if (item.additional) {
      this.operationCommandSubject.next({
        operation: "UPDATE",
        index: index,
        item: {
          value: item.value,
          additional: item.additional - 1,
        }
      });
    }
  }

  onPasteText($event: ClipboardEvent): void {
    if (this.list && $event.clipboardData) {
      const text = $event.clipboardData.getData("text/plain");
      if (text.match(/\n/g)) {
        $event.preventDefault();
        $event.stopPropagation();

        const newItensValues = text.split(/\r?\n/g)
        const listId = this.list.id;

        from(newItensValues).pipe(
          map((itemValue) => itemValue.trim().replace(/^\d+\./mg, '').slice(0, this.maxItemValueLength)),
          filter((text => text.trim() !== '')),
          take(this.maxListLength - this.items.length),
          concatMap((itemValue) => this._simpleItemService.appendItem(listId, {value: itemValue, additional: 0}))
        ).subscribe((item: SimpleItem) => {
          console.debug(item)
          this.scrollToBottom();
        })
      }
    }
  }

  updateListInfo(): void {
    if (this.list && this.editListForm) {
      const form = this.editListForm;
      this._simpleListService.updateSimpleList(this.list.id, {...this.list, ...form.value}).subscribe((updatedList) => {
        this.list = updatedList;
        this.infoPanelEdit = false;
        form.setValue({name: updatedList.name, description: updatedList.description});
      })
    }
  }

  cancelEdit(): void {
    this.infoPanelEdit = false;

    if (this.editListForm && this.list) {
      this.editListForm.setValue({name: this.list.name, description: this.list.description || ''})
    }
  }
}
