import { Component, Input } from '@angular/core';
import { Message } from '../model/chat.Interface';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

  @Input() messages: Message[] = []

  constructor() { }

}
