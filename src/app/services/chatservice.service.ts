import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message, User } from '../model/chat.Interface';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

const _baseUrl = 'https://localhost:7088/';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentName: string = ""
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  message: Message[] = []

  constructor(private _httpService: HttpClient) { }

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
}
