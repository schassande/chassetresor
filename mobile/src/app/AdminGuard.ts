import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './service/UserService';
import { ConnectedUserService } from './service/ConnectedUserService';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(
      private connectedUserService: ConnectedUserService,
      private userService: UserService,
      private navController: NavController
    ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const connected: boolean = this.connectedUserService.getCurrentUser() != null;
    if (connected) {
      return this.connectedUserService.getCurrentUser().role === 'ADMIN';
    }
    return this.userService.autoLogin().pipe(
      map(() => {
        if (!this.connectedUserService.isConnected()) {
          this.navController.navigateRoot(['/user/login']);
        }
        return this.connectedUserService.isConnected() && this.connectedUserService.getCurrentUser().role === 'ADMIN';
      })
    );
  }
}
