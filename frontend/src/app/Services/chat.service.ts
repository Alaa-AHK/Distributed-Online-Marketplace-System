import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  connect(token: string): void {
    this.socket = io(this.apiUrl, {
      auth: { token },
      transports: ['websocket'],
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  joinChat(userB: string): void {
    this.socket.emit('join-chat', { userB });
  }

  sendMessage(receiver: string, msg: string): void {
    this.socket.emit('send-message', { receiver, msg });
  }

  onNewMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receive-message', (msg) => observer.next(msg));
    });
  }

  getHistory(otherUserId: string): Observable<any[]> {
    const myId = this.getMyId();
    const roomId = [myId, otherUserId].sort().join('_');
    return this.http.get<any[]>(`${this.apiUrl}/chat/messages?roomId=${roomId}`);
  }

  private getMyId(): string {
    const token = localStorage.getItem('Authorization') || '';
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload._id;
  }
}