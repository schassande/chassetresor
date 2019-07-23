import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { AppSettingsService } from '../../../service/AppSettingsService';
import { ConnectedUserService } from '../../../service/ConnectedUserService';
import { UserService } from '../../../service/UserService';

import { LocalAppSettings } from '../../../model/settings';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  email: string;
  password: string;
  savePassword = true;
  errors: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private appSettingsService: AppSettingsService,
    private connectedUserService: ConnectedUserService,
    private loadingController: LoadingController,
    private navController: NavController,
    private userService: UserService,
  ) { }

  ngOnInit() {
    if (this.connectedUserService.isConnected()) {
      this.navController.navigateRoot(['/home']);
    }
    this.appSettingsService.get().pipe(
      map((settings: LocalAppSettings) => {
        this.email = settings.lastUserEmail;
        this.password = settings.lastUserPassword;
        // console.log('Set email and password from local settings: ', this.email, this.password);
      })).subscribe();
  }

  isValid(): boolean {
    this.errors = [];
    if (!this.password || this.password.trim().length === 0) {
      this.errors.push('The password is required.');
    }
    if (!this.email || this.email.trim().length === 0) {
      this.errors.push('The email is required.');
    }
    return this.errors.length === 0;
  }

  login() {
    if (this.isValid()) {
      this.loadingController.create({ message: 'Login...', translucent: true}).then((l) => l.present());
      this.userService.loginWithEmailNPassword(this.email, this.password, this.savePassword).pipe(
        map((ruser) => {
          this.loadingController.dismiss();
          if (this.connectedUserService.isConnected()) {
            this.navController.navigateRoot(['/home']);
          } else if (ruser.error && ruser.error.error) {
            this.errors = [ruser.error.error];
            this.alertCtrl.create({message: ruser.error.error}).then( (alert) => alert.present() );
          } else if (ruser.error) {
            this.errors = [ruser.error];
          }
        })
      ).subscribe();
    }
  }

  createAccount() {
    this.navController.navigateRoot(['/user/create']);
  }

  resetPassword() {
    this.userService.resetPassword(this.email);
  }
}
