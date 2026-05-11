import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../Services/chat.service';
import { UserService } from '../../Services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  newMessage: string = '';
  myId: string = '';
  private msgSub!: Subscription;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef; 

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const rawToken = localStorage.getItem('Authorization') || '';
    if (!rawToken) {
      this.users = [];
      return;
    }
    const token = rawToken.replace('Bearer ', '');
    this.myId = this.getMyId(rawToken);
    this.chatService.connect(token);

    this.msgSub = this.chatService.onNewMessage().subscribe((msg) => {
      if (this.selectedUser) {
        this.messages.push(msg);
      }
    });

    this.loadUsers();
  }

  ngAfterViewChecked(): void { 
    this.scrollToBottom();
  }

  scrollToBottom(): void { 
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch {}
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        console.log('My ID:', this.myId);
        console.log('All users:', res.users);
        this.users = (res.users || []).filter((u: any) => {
          console.log('Comparing:', u._id, 'with', this.myId);
          return u._id !== this.myId;
        });
      },
      error: (err) => console.error(err)
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.messages = [];
    this.chatService.joinChat(user._id);
    this.chatService.getHistory(user._id).subscribe({
      next: (msgs) => this.messages = msgs,
      error: () => {}
    });
  }

  send(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;
    console.log('Sending to:', this.selectedUser._id);
    console.log('My ID:', this.myId);
    console.log('Token:', localStorage.getItem('Authorization'));
    this.chatService.sendMessage(this.selectedUser._id, this.newMessage.trim());
    this.newMessage = '';
  }

  getMyId(token: string): string {
    if (!token) return '';
    try {
      const cleanToken = token.replace('Bearer ', '');
      const payload = JSON.parse(atob(cleanToken.split('.')[1]));
      return payload._id;
    } catch { return ''; }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
    this.chatService.disconnect();
  }
}
