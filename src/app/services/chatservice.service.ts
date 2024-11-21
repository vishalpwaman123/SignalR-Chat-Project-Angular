import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/chatInterface';

const _baseUrl = 'https://localhost:7088/api/';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _httpService: HttpClient) {}

  registration(user: User): any {
    return this._httpService.post(_baseUrl + 'Chat/register-user', user, {
      responseType: 'text',
    });
  }
}
