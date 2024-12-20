import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message, User } from '../model/chat.Interface';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

const _baseUrl = 'https://localhost:7088/';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentName: string = ""
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  message: Message[] = []
  privateMessages: Message[] = []
  privateMessageInitiated: boolean = false;

  constructor(private _httpService: HttpClient, private modalService: NgbModal) { }

  registration(user: User): any {
    return this._httpService.post(_baseUrl + 'api/Chat/register-user', user, {
      responseType: 'text',
    });
  }

  createChatConnection(): void {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${_baseUrl}hubs`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection
      .start()
      .then(result => { console.log('Connected'); console.log(result) })
      .catch(error => console.log(error))

    this.chatConnection
      ?.on("UserConnected", () => {
        console.log("The server has called here.")
        this.addUserConnectionId();
      })

    this.chatConnection?.on("OnlineUsers", (res) => {
      console.log("OnlineUsers, The server has called here.");
      this.onlineUsers = [...res];
    })

    this.chatConnection?.on("NewMessage", (newMessage: Message) => {
      console.log("NewMessage, The server has called here.");
      this.message = [...this.message, newMessage]
    })

    this.chatConnection?.on("OpenPrivateChat", (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage]
      this.privateMessageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatComponent)
      modalRef.componentInstance.toUser = newMessage.from;
    })

    this.chatConnection.on("ReceivePrivateMessage", (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage]
    })

    this.chatConnection.on("NewPrivateMessage", (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage]
    })

    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    })
  }

  stopChatConnection() {
    this.chatConnection?.stop()
      .then(result => { console.log("Disconnected"); console.log(result) })
      .catch(error => console.log(error))
  }

  async addUserConnectionId() {
    return this.chatConnection
      ?.invoke("AddUserConnectionId", this.currentName)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  async sendMessage(content: string) {
    const message: Message = {
      from: this.currentName,
      content
    }

    return this.chatConnection?.
      invoke("ReceiveMessage", message)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  async closePrivateChatMessage(toUser: string) {
    return this.chatConnection?.invoke("RemovePrivateChat", this.currentName, toUser)
      .catch(error => console.log(error))
  }

  async sendPrivateMessage(to: string, content: string) {
    const message: Message = {
      from: this.currentName,
      to,
      content
    };

    if (!this.privateMessageInitiated) {
      this.privateMessageInitiated = true;
      return this.chatConnection?.
        invoke('CreatePrivateChat', message)
        .then(() => {
          // debugger
          this.privateMessages = [...this.privateMessages, message]
        })
        .catch(error => console.log(error))
    } else {
      return this.chatConnection?.invoke("ReceivePrivateChat", message)
        .catch(error => { console.log(error) })
    }
  }
}
