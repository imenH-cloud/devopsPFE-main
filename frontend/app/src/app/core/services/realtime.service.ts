import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private socket: Socket | null = null;
  private eventsSubject = new Subject<RealtimeEvent>();
  public events$ = this.eventsSubject.asObservable();
  private isConnectedSubject = new Subject<boolean>();
  public isConnected$ = this.isConnectedSubject.asObservable();

  connect(url: string = window.location.origin): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to real-time server');
      this.isConnectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from real-time server');
      this.isConnectedSubject.next(false);
    });

    this.socket.on('event', (data: any) => {
      this.eventsSubject.next({
        type: data.type,
        data: data.payload,
        timestamp: new Date(),
      });
    });

    this.socket.on('error', (error: any) => {
      console.error('Real-time error:', error);
    });
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
