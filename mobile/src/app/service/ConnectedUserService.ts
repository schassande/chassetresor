import { AppSettingsService } from './AppSettingsService';
import { Injectable, EventEmitter } from '@angular/core';
import { User } from './../model/user';
import * as firebase from 'firebase/app';

@Injectable()
export class ConnectedUserService {

  /** The current user */
  private currentUser: User = null;
  private credential: firebase.auth.UserCredential = null;

  /** The event about user connection */
  public $userConnectionEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor(
      public appSettingsService: AppSettingsService) {
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }
  public isConnected(): boolean {
    return this.currentUser && this.currentUser !== null;
  }
  public isLogin(): boolean {
    return this.currentUser && this.currentUser !== null
      && this.currentUser.token && this.currentUser.token != null;
  }
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public userConnected(user: User, credential: firebase.auth.UserCredential) {
    this.currentUser = user;
    if (credential !== null || this.credential === null || this.credential.user.email !== user.email) {
      // set the new credential or clean if user is
      this.credential = credential;
    } // else keep the credential because it is same user
    console.log('User connected: ' + this.currentUser.email);
    this.$userConnectionEvent.emit(this.currentUser);
  }
  public userDisconnected() {
    this.currentUser = null;
    // keep the credential in case of
    console.log('User disconnected.');
    this.$userConnectionEvent.emit(this.currentUser);
  }
}
