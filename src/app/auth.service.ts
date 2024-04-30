import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private lastLoginTime: number = 0; // Timestamp in milliseconds
  private idUser:number  = -1;

  setLoggedIn(status: boolean, id: number) {
    this.isLoggedIn = status;
    this.lastLoginTime = Date.now();
    this.idUser = id;
    this.saveLoginStatus();
  }

  getLoggedInStatus() {
    // Load login status from localStorage whenever this getter is accessed
    this.loadLoginStatus();

    // Check if the login has not expired (within 3 days)
    const loginNotExpired = Date.now() - this.lastLoginTime < 3 * 24 * 60 * 60 * 1000;
    return this.isLoggedIn && loginNotExpired ;
  }

  getLoggedInUserid() {
    // Load login status from localStorage whenever this getter is accessed
    this.loadLoginStatus();
    return this.idUser ;
  }

  private saveLoginStatus() {
    // Store the login status and timestamp in localStorage
    localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
    localStorage.setItem('lastLoginTime', this.lastLoginTime.toString());
    localStorage.setItem('idUser', this.idUser.toString());
  }

  private loadLoginStatus() {
    // Retrieve the login status and timestamp from localStorage on service initialization
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.lastLoginTime = parseInt(localStorage.getItem('lastLoginTime') || '0', 10);
    this.idUser = parseInt(localStorage.getItem('idUser') || '0', 10);
  }

  constructor() { }
}
