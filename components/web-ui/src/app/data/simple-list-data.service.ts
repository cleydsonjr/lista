import {Injectable} from '@angular/core';
import {SimpleListOperationResult} from "@zaps/lists-angular-client";
import {ConnectionAwareWebSocketSubject} from "./ConnectionAwareWebSocketSubject";

@Injectable({
  providedIn: 'root'
})
export class SimpleListDataService {

  private rootUrl: URL;

  constructor() {
    this.rootUrl = new URL(location.href);
    this.rootUrl.protocol = this.rootUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    this.rootUrl.port = this.rootUrl.port === '4200' ? '8080' : this.rootUrl.port
    this.rootUrl.pathname = '/ws/lists/listId'
  }

  public connect(listId: string): ConnectionAwareWebSocketSubject<SimpleListOperationResult> {
    return new ConnectionAwareWebSocketSubject<SimpleListOperationResult>(new URL(listId, this.rootUrl).toString(), 3000, 20)
  }

}
