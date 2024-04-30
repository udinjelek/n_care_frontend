import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private bearerToken = 'your_bearer_token_here..';

  constructor(
    private http: HttpClient,
  ) { }

  public headerSent(){
    return{
      headers:new HttpHeaders()
      .set('user', '111')
    }; 
  }

  public getUser():Observable<any>{
    return this.http.get(
      API_BASE_URL + 'chat' 
       );
  }

  public getChatHistory(params: { self_id: number, target_id: number }):Observable<any>{
    let queryParams = new HttpParams()
    .set('self_id', params.self_id.toString())
    .set('target_id', params.target_id.toString());
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.bearerToken}`
    });
    return this.http.get(
      API_BASE_URL + 'chat_history' , { headers, params: queryParams}
       );
  }

  public getSidebarChat(params: {self_id: number}):Observable<any>{
    let queryParams = new HttpParams()
    .set('self_id', params.self_id.toString());

    return this.http.get(
      API_BASE_URL + 'sidebar_chat' , {params: queryParams}
       );
  }
}
