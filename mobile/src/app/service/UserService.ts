import { AngularFireFunctions } from '@angular/fire/functions';
import { LocalAppSettings } from './../model/settings';
import { AppSettingsService } from './AppSettingsService';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { ResponseWithData, Response } from './response';
import { Observable, of, from, Subject } from 'rxjs';
import { ConnectedUserService } from './ConnectedUserService';
import { Injectable } from '@angular/core';
import { User, AuthProvider } from './../model/user';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { flatMap, map, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService  extends RemotePersistentDataService<User> {

    constructor(
        db: AngularFirestore,
        toastController: ToastController,
        private connectedUserService: ConnectedUserService,
        private appSettingsService: AppSettingsService,
        private alertCtrl: AlertController,
        private loadingController: LoadingController,
        private angularFireFunctions: AngularFireFunctions
    ) {
        super(db, toastController);
    }

    getLocalStoragePrefix(): string {
        return 'user';
    }

    getPriority(): number {
        return 1;
    }

    public save(user: User, cred: firebase.auth.UserCredential = null): Observable<ResponseWithData<User>> {
        if (!user) {
            return of({data: null, error: { error : 'null user', errorCode: -1}});
        }
        const password = user.password;
        delete user.password;
        if (user.dataStatus === 'NEW') {
            let obs: Observable<firebase.auth.UserCredential> = null;
            if (cred !== null  && (user.authProvider === 'FACEBOOK' || user.authProvider === 'GOOGLE')) {
                obs = of(cred);
            } else {
                obs = from(firebase.auth().createUserWithEmailAndPassword(user.email, password));
            }
            return obs.pipe(
                flatMap((userCred: firebase.auth.UserCredential) => {
                    // Store in application user datbase the firestore user id
                    user.accountId = userCred.user.uid;
                    return super.save(user);
                }),
                flatMap((ruser) => {
                    if (ruser.data) {
                        // TODO send an email to admin with the account to validate
                        this.sendNewAccountToAdmin(ruser.data.id);
                        this.sendNewAccountToUser(ruser.data.id);
                        this.appSettingsService.setLastUser(user.email, password);
                        return this.autoLogin();
                    } else {
                        return of(ruser);
                    }
                }),
                catchError((err) => {
                    console.error(err);
                    return of({ error: err, data: null});
                }),
            );
        } else {
            return super.save(user);
        }
    }

    public delete(id: string): Observable<Response> {
        // check the user to delete is the current user.
        if (this.connectedUserService.getCurrentUser().id !== id) {
            return of({error: {error: 'Not current user', errorCode: 1}});
        }
        // First delete user from database
        return super.delete(id).pipe(
            flatMap( (res) => {
                if (res.error != null) {
                    console.log('Error on delete', res.error);
                    return of (res);
                } else {
                    // then delete the user from firestore user auth database
                    return from(firebase.auth().currentUser.delete()).pipe(
                        map(() => {
                            return {error: null};
                        }),
                        catchError((err) => {
                            console.error(err);
                            return of({error: err});
                        })
                    );
                }
            })
        );
    }

    public login(email: string, password: string): Observable<ResponseWithData<User>> {
        console.log('UserService.login(' + email + ', ' + password + ')');
        let credential = null;
        return from(firebase.auth().signInWithEmailAndPassword(email, password)).pipe(
            flatMap( (cred: firebase.auth.UserCredential) => {
                credential = cred;
                // console.log('login: cred=', JSON.stringify(cred, null, 2));
                return this.getByEmail(email);
            }),
            catchError((err) => {
                console.log('UserService.login(' + email + ', ' + password + ') error=', err);
                this.loadingController.dismiss(null);
                this.alertCtrl.create({message: err.message}).then((alert) => alert.present());
                return of({ error: err, data: null});
            }),
            map( (ruser: ResponseWithData<User>) => {
                // console.log('UserService.login(' + email + ', ' + password + ') ruser=', ruser);
                if (ruser.data) {
                    switch (ruser.data.accountStatus) {
                    case 'ACTIVE':
                        this.connectedUserService.userConnected(ruser.data, credential);
                        break;
                    case 'DELETED':
                        ruser.data = null;
                        ruser.error = { error : 'The account \'' + email + '\' has been removed.', errorCode : 1234 };
                        break;
                    case 'LOCKED':
                        ruser.data = null;
                        ruser.error = { error : 'The account \'' + email + '\' has been locked. Please contact the administrator.',
                                        errorCode : 1234 };
                        break;
                    case 'VALIDATION_REQUIRED':
                        ruser.data = null;
                        ruser.error = { error : 'A validation is still required for the account \'' + email + '\'.',
                                        errorCode : 1234 };
                        break;
                    }
                } else if (firebase.auth().currentUser && ruser.error === null) {
                    ruser.error = { error : 'The account \'' + email + '\' has been removed.', errorCode : 1234 };
                }
                return ruser;
            })
        );
    }

    public logout() {
        console.log('UserService.logout()');
        this.connectedUserService.userDisconnected();
    }

    /**
     * Try to autologin an user with data stored from local storage.
     */
    public autoLogin(): Observable<ResponseWithData<User>> {
        let loading = null;
        return from(this.loadingController.create({ message: 'Connexion en cours...', translucent: true})).pipe(
            flatMap( (ctrl) => {
                loading = ctrl;
                loading.present();
                return this.appSettingsService.get();
            }),
            flatMap((settings: LocalAppSettings) => {
                const email = settings.lastUserEmail;
                const password = settings.lastUserPassword;
                // console.log('UserService.autoLogin(): lastUserEmail=' + email + ', lastUserPassword=' + password);
                if (!email) {
                    loading.dismiss();
                    return of({ error: null, data: null});
                }
                if (!this.connectedUserService.isOnline()) {
                    console.log('UserService.autoLogin(): offline => connect with email only');
                    loading.dismiss();
                    return this.connectByEmail(email, password);
                }
                if (password) {
                    // password is defined => try to login
                    // console.log('UserService.autoLogin(): login(' + email + ', ' + password + ')');
                    return this.login(email, password).pipe(
                        map((ruser) =>  {
                            loading.dismiss();
                            return ruser;
                        })
                    );
                }
                loading.dismiss();
                return of({data: null, error: null});
            })
        );
    }

    public resetPassword(email, sub: Subject<ResponseWithData<User>> = null) {
        // console.log('Reset password of the account', email);
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            this.alertCtrl.create({message: 'An email has been sent to \'' + email + '\' to reset the password.'})
                .then((alert) => alert.present());
            if (sub) {
                sub.next({ error: null, data: null});
                sub.complete();
            }
        });
    }

    public loginWithEmailNPassword(email: string,
                                   password: string,
                                   savePassword: boolean): Observable<ResponseWithData<User>> {
        console.log('loginWithEmailNPassword(' + email + ', ' + password + ', ' + savePassword + ')');
        return this.login(email, password).pipe(
            flatMap ( (ruser) => {
                if (ruser.error) {
                    // login failed
                    savePassword = false; // don't save the password if error occurs
                    if (ruser.error.code === 'auth/network-request-failed') {
                        // no network => check the email/password with local storage
                        return this.connectByEmail(email, password);
                    }
                }
                return of(ruser);
            }),
            map( (ruser) => {
                if (ruser.data) { // Login with success
                    console.log('UserService.loginWithEmailNPassword(' + email + '): login with success');
                    if (savePassword) {
                        console.log('UserService.askPasswordToLogin(' + email + '): store password.');
                        // The user is ok to store password in settings on local device
                        this.appSettingsService.setLastUser(email, password);
                    }
                }
                return ruser;
            })
        );
    }

    private connectByEmail(email: string, password: string = null): Observable<ResponseWithData<User>> {
        return this.appSettingsService.get().pipe(
            flatMap((appSettings) => {
                if (email === appSettings.lastUserEmail && (password == null || password === appSettings.lastUserPassword)) {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): password is valid => get user');
                    return this.getByEmail(email);
                } else {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): wrong password.');
                    return of({ error: null, data: null });
                }
            }),
            map( (ruser: ResponseWithData<User>) => {
                if (ruser.data) {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): user found', ruser.data);
                    this.connectedUserService.userConnected(ruser.data, null);
                } else {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): fail.');
                }
                return ruser;
            })
        );
}
    public getUrlPathOfGet(id: number) {
        return '?id=' + id;
    }

    public getByEmail(email: string): Observable<ResponseWithData<User>> {
        return this.queryOne(this.getCollectionRef().where('email', '==', email), 'default').pipe(
            map((ruser => {
                // console.log('UserService.getByEmail(' + email + ')=', ruser.data);
                return ruser;
            })),
            catchError((err) => {
                return of({ error: err, data: null});
            }),
        );
    }
    public findByShortName(shortName: string): Observable<ResponseWithData<User[]>> {
        return this.query(this.getCollectionRef().where('shortName', '==', shortName), 'default');
    }

    public authWithGoogle(): Observable<ResponseWithData<User>> {
        return this.authWith(new firebase.auth.GoogleAuthProvider(), 'GOOGLE');
    }

    public authWithFacebook(): Observable<ResponseWithData<User>> {
        return this.authWith(new firebase.auth.FacebookAuthProvider(), 'FACEBOOK');
    }

    public authWith(authProvider: any, authName: AuthProvider): Observable<ResponseWithData<User>> {
        let credential = null;
        return from(firebase.auth().signInWithPopup(authProvider)).pipe(
            flatMap( (cred: firebase.auth.UserCredential) => {
                credential = cred;
                console.log('authWith: cred=', JSON.stringify(cred, null, 2));
                return this.getByEmail(cred.user.email);
            }),
            catchError((err) => {
                // console.log('authWith error: ', err);
                return of({ error: err, data: null});
            }),
            flatMap( (ruser: ResponseWithData<User>) => {
                if (!ruser.data) {
                    return this.save(this.createUserFromCredential(credential, authName), credential);
                } else {
                    return of(ruser);
                }
            }),
            map( (ruser: ResponseWithData<User>) => {
                console.log('authWith user: ', JSON.stringify(ruser));
                if (ruser.data) {
                    this.connectedUserService.userConnected(ruser.data, credential);
                }
                return ruser;
            })
        );
    }
    public computeShortName(firstName, lastName): string {
        return firstName.charAt(0).toUpperCase()
            + lastName.charAt(0).toUpperCase()
            + lastName.charAt(lastName.length - 1).toUpperCase();
    }

    private createUserFromCredential(cred: firebase.auth.UserCredential, authProvider: AuthProvider): User {
        if (!cred || !cred.user) {
            return null;
        }
        const names = cred.user.displayName.split(' ');
        const firstName: string = names[0];
        const lastName: string = names.length > 1 ? names[1] : ' ';
        const shortName: string = this.computeShortName(firstName, lastName);
        return {
            id: null,
            accountId: cred.user.uid,
            accountStatus: 'ACTIVE',
            role: 'USER',
            authProvider,
            version: 0,
            creationDate : new Date(),
            lastUpdate : new Date(),
            dataStatus: 'NEW',
            email: cred.user.email,
            password: '',
            firstName: '',
            lastName: '',
            phone: null,
            token: null
        };
    }
    deleteAccount(user: User) {
        if (user.id ===  this.connectedUserService.getCurrentUser().id) {
            from(firebase.auth().currentUser.delete()).pipe(
                flatMap(() => this.delete(user.id)),
                map(() => this.connectedUserService.userDisconnected())
            ).subscribe();
        } else {
            this.delete(user.id).subscribe();
        }
    }
    public sendNewAccountToAdmin(userId: string): Observable<any> {
        return of(''); // this.angularFireFunctions.httpsCallable('sendNewAccountToAdmin')({userId});
    }
    public sendNewAccountToUser(userId: string): Observable<any> {
        return of(''); // this.angularFireFunctions.httpsCallable('sendNewAccountToUser')({userId});
    }
    public sendAccountValidated(userId: string): Observable<any> {
        return of(''); // this.angularFireFunctions.httpsCallable('sendAccountValidated')({userId});
    }
    public sendAccountNotValidated(userId: string): Observable<any> {
        return of(''); // this.angularFireFunctions.httpsCallable('sendAccountNotValidated')({userId});
    }
}
