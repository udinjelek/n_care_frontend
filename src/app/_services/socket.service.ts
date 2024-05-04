// socket.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  connectToChat(): void {
    this.socket.connect();
  }

  onNewMessage(): Observable<any> {
    return this.socket.fromEvent('new_message');
  }
}