import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../services/chatservice.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {

  content: string = ''
  @Output() contentEmitter = new EventEmitter();

  constructor(public service: ChatService) { }

  sendMessage() {
    if (this.content.trim() !== '') {
      this.contentEmitter.emit(this.content)
    }
    this.content = ''
  }

}
