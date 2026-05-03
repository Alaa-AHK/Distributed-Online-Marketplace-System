import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../Services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() receiverId: string = '';
  @Input() receiverName: string = 'User';

  messages: any[] = [];
  newMessage: string = '';
  isOpen: boolean = false;
  private msgSub!: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    this.chatService.connect(token);
    this.chatService.joinChat(this.receiverId);

    // load history
    this.chatService.getHistory(this.receiverId).subscribe({
      next: (msgs) => this.messages = msgs,
      error: () => {}
    });

    // listen for new messages
    this.msgSub = this.chatService.onNewMessage().subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  send(): void {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage(this.receiverId, this.newMessage.trim());
    this.newMessage = '';
  }

  getMyId(): string {
    const token = localStorage.getItem('token') || '';
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload._id;
  }

  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
    this.chatService.disconnect();
  }
}

