import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../services/chatservice.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  @Output() closeChatEmitter = new EventEmitter();

  constructor(public service: ChatService) { }

  ngOnInit(): void {
    this.service.createChatConnection()
  }

  backToHome(): void {
    this.closeChatEmitter.emit()
  }

}
