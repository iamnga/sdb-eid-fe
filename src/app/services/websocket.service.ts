import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankData, FingerResponse } from '../models/mk';

const CHAT_URL = 'ws://localhost:7171/finger-icao-ws';

export interface Message {
  source: string;
  content: string;
}

@Injectable()
export class WebsocketService {
  public subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<FingerResponse>;
  constructor() {
    this.messages = <Subject<FingerResponse>>this.connect(CHAT_URL).pipe(
      map((response: MessageEvent): FingerResponse => {
        let data = JSON.parse(response.data);
        console.log(data);
        return data;
      })
    );
  }

  public connect(url: any): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url: any): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {},
      next: () => {
        let bankData = new BankData();
        bankData.bankAppId = 1;
        bankData.bankTransactionId = new Date().getTime().toString();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(bankData));
        }
      },
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
