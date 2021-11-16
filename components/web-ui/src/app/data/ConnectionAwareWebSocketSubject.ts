import {interval, Observable, Observer, Subject} from 'rxjs';
import {WebSocketSubjectConfig} from "rxjs/internal-compatibility";
import {WebSocketSubject} from "rxjs/webSocket";
import {distinctUntilChanged, share, takeWhile} from "rxjs/operators";

/// we inherit from the ordinary Subject
export class ConnectionAwareWebSocketSubject<T> extends Subject<T> {
  private _reconnectionObservable?: Observable<number>;
  private _wsSubjectConfig: WebSocketSubjectConfig<T>;
  private _socket?: WebSocketSubject<T>;
  private _connectionObserver?: Observer<boolean>;
  private _reconnect = true;
  public connectionStatus: Observable<boolean>;

  /// by default, when a message is received from the server, we are trying to decode it as JSON
  /// we can override it in the constructor
  defaultResultSelector = (e: MessageEvent): T => {
    return JSON.parse(e.data);
  }

  /// when sending a message, we encode it to JSON
  /// we can override it in the constructor
  defaultSerializer = (data: unknown): string => {
    return JSON.stringify(data);
  }

  constructor(
    private url: string,
    private reconnectInterval: number = 5000,  /// pause between connections
    private reconnectAttempts: number = 10,  /// number of connection attempts

    private resultSelector?: (e: MessageEvent) => T,
    private readonly serializer?: (data: T) => string,
  ) {
    super();

    /// connection status
    this.connectionStatus = new Observable<boolean>((observer) => {
      this._connectionObserver = observer;
    }).pipe(
      share(),
      distinctUntilChanged()
    )

    if (!resultSelector) {
      this.resultSelector = this.defaultResultSelector;
    }
    if (!this.serializer) {
      this.serializer = this.defaultSerializer;
    }

    /// config for WebSocketSubject
    /// except the url, here is closeObserver and openObserver to update connection status
    this._wsSubjectConfig = {
      url: url,
      closeObserver: {
        next: (e: CloseEvent): void => {
          this._socket = undefined;
          if (this._connectionObserver) {
            this._connectionObserver.next(false);
          }
        }
      },
      openObserver: {
        next: (e: Event): void => {
          if (this._connectionObserver) {
            this._connectionObserver.next(true);
          }
        }
      }
    };
    /// we connect
    this.connect();
    /// we follow the connection status and run the reconnect while losing the connection
    this.connectionStatus.subscribe((isConnected) => {
      if (!this._reconnectionObservable && !isConnected) {
        this.reconnect();
      }
    });
  }

  connect(): void {
    this._socket = new WebSocketSubject<T>(this._wsSubjectConfig);
    this._socket.subscribe(
      (m) => {
        this.next(m); /// when receiving a message, we just send it to our Subject
      },
      (error: Event) => {
        if (!this._socket) {
          /// in case of an error with a loss of connection, we restore it
          this.reconnect();
        }
      });
  }

  /// WebSocket Reconnect handling
  reconnect(): void {
    this._reconnectionObservable = interval(this.reconnectInterval).pipe(
      takeWhile((v, index) => {
        return index < this.reconnectAttempts && this._reconnect && !this._socket
      })
    );

    this._reconnectionObservable.subscribe({
      next: () => {
        this.connect();
      },
      complete: () => {
        /// if the reconnection attempts are failed, then we call complete of our Subject and status
        this._reconnectionObservable = undefined;
        if (!this._socket) {
          this.complete();
        }
      }
    });
  }

  complete(): void {
    super.complete();
    this._reconnect = false;
    if (this._connectionObserver) {
      this._connectionObserver.complete();
    }
    if (this._socket) {
      this._socket.complete();
    }
  }

  /// sending the message
  send(data: T): void {
    if (this._socket && this.serializer) {
      this._socket.next(data);
    }
  }
}
