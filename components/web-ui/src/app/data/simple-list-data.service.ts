import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {SimpleListOperationResult} from "@zaps/lists-angular-client";

export const WS_ENDPOINT = 'ws://192.168.1.4:8080/ws/lists/7';
export const RECONNECT_INTERVAL = 1000;

@Injectable({
  providedIn: 'root'
})
export class SimpleListDataService {

  private rootUrl: URL;

  constructor() {
    this.rootUrl = new URL(location.href);
    this.rootUrl.protocol = 'ws:';
    this.rootUrl.port = '8080';
    this.rootUrl.pathname = '/ws/lists/listId'
  }

  public connect(listId: string): WebSocketSubject<SimpleListOperationResult> {
    return webSocket(new URL(listId, this.rootUrl).toString())
  }

}
