// socket.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  // // original code
  // connectToChat(): void {
  //   this.socket.connect();
  // }

  connectToChat(): Observable<any> {
    // Attempt connection and return an Observable for handling success or failure
    return new Observable(observer => {
      this.socket.connect();

      this.socket.on('connect', () => {
        observer.next('Connected to websocket server');
        observer.complete();  // Signal successful connection
      });

      this.socket.on('error', (error:any) => {
        observer.error(error);  // Emit error if connection fails
        console.error('Error connecting to websocket:', error);
      });
    });
  }

  onNewMessage(): Observable<any> {
    return this.socket.fromEvent('new_message');
  }
}