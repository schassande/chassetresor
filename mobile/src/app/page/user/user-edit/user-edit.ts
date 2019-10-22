import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';

import { ConnectedUserService } from '../../../service/ConnectedUserService';
import { ResponseWithData } from '../../../service/response';
import { UserService } from '../../../service/UserService';
import { User} from '../../../model/user';

/**
 * Generated class for the UserNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage implements OnInit {

  user: User;
  error: string[] = [];
  saving = false;

  constructor(
    private alertCtrl: AlertController,
    private navController: NavController,
    private route: ActivatedRoute,
    public userService: UserService,
    public connectedUserService: ConnectedUserService,
    private toastController: ToastController,
    public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map( (paramMap: ParamMap) => {
        const userId = paramMap.get('id');
        if (userId) {
          this.userService.get(userId).subscribe((res: ResponseWithData<User>) => {
            if (res.error) {
              this.loadingCtrl.create({
                message: 'Problem to load referee informaion ...',
                duration: 3000
              }).then( (loader) => loader.present())
              .then(() => {
                this.navController.navigateRoot('/home');
              });
            } else {
              this.user = res.data;
              console.log('load user: ', this.user);
            }
          });
        } else {
          this.initUser();
        }
          })
    ).subscribe();
  }

  public initUser() {
    this.user = {
      id: null,
      accountId: null,
      accountStatus: 'ACTIVE',
      role: 'USER',
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: null,
      token: null
    };
  }

  /** 
   * Méthode de vérification de la validité du formulaire
   * Créé un tableau d'erreur vide puis push dedans chacune des erreurs du formulaire
   * Renvoie true si cette liste est vide à la fin des vérifs, false sinon
   */
  isValid(): boolean {
    
    this.error = [];

    // Vérif email
    if (!this.isValidString(this.user.email, 5, 50)) {
      this.error.push(('Invalid email length: must be 5 to 50 chars'));
    }
    // Vérif password
    if (!this.isValidString(this.user.password, 5, 15)) {
      this.error.push(('Invalid password length: must be 5 to 15 chars'));
    }
    return this.error.length === 0;
  }

  /**
   * Méthode de vérification des normes de taille d'une String
   * @param str La String
   * @param minimalLength La taille minimale requise
   * @param maximalLength La taille maximale requise
   */
  isValidString(str: string, minimalLength: number = 0, maximalLength: number = 100): boolean {
    return str && str.trim().length >= minimalLength && str.trim().length <= maximalLength;
  }

  /**
   * Méthode appelée à la création d'un User
   * @param event le click sur le bouton save
   */
  public newUser(event) {
    if (this.isValid()) {
      this.saving = true;
      this.userService.save(this.user).subscribe((response: ResponseWithData<User>) => {
        this.saving = false;
        if (response.error) {
          if (response.error.code === 'auth/email-already-in-use') {
            console.log('The email address is already used.');
            this.toastController.create({ message: 'The email address is already used: ' + this.user.email, duration: 5000})
              .then((toast) => toast.present());
          } else {
            this.toastController.create({ message: 'Error when saving the user info: ' + this.error, duration: 5000})
              .then((toast) => toast.present());
          }
        } else {
          this.user = response.data;
          console.log('Saved user: ', this.user);
          this.navController.navigateRoot('/home');
        }
      });
    }
  }

  deleteAccount() {
    this.alertCtrl.create({
      message: 'Do you really want to delete your account ' + this.user.email  +  '?<br>All data will be removed !!',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.userService.deleteAccount(this.user);
            this.navController.navigateRoot('/user/login');
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  cancel() {
    if (this.user.dataStatus === 'NEW') {
      this.navController.navigateRoot('/user/login');
    } else {
      this.navController.navigateRoot('/home');
    }
  }
}