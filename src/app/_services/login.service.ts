import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient,) { 
  }

  public getLogin(params: {username: string, password: string}):Observable<any>{
    let queryParams = new HttpParams({ fromObject: params });
    return this.http.get(
      API_BASE_URL + 'login' , {params: queryParams}
       );
  }

  public getloadDevModeUser():Observable<any>{
    return this.http.get(
      API_BASE_URL + 'load-dev-mode-user' 
       );
  }
}
