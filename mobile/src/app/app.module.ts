import { AppSettingsService } from './service/AppSettingsService';
import { ConnectedUserService } from './service/ConnectedUserService';
import { FormsModule } from '@angular/forms';
import { UserEditPage } from './page/user/user-edit/user-edit';
import { UserLoginComponent } from './page/user/user-login/user-login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';

import { environment } from '../environments/environment';
import { UserService } from './service/UserService';
import { ScanPageComponent } from './page/scan-page/scan-page.component';
import { HomePage } from './page/home/home.page';
import { ManagePlayersComponent } from './page/admin/manage-players/manage-players.component';
import { ManageQuizzComponent } from './page/admin/manage-quizz/manage-quizz.component';
import { QuizzComponent } from './page/answer/quizz/quizz.component';
import { QuestionComponent } from './page/answer/question/question.component';
import { RulesComponent } from './page/rules/rules.component';
import { IndicesPipe } from './utlis/indices.pipe';
import { ValidationService } from './service/ValidationService';
import { UserResponseService } from './service/UserResponseService';
import { QuizzService } from './service/QuizzService';

@NgModule({
  declarations: [
    IndicesPipe,
    HomePage,
    ManagePlayersComponent,
    ManageQuizzComponent,
    QuizzComponent,
    QuestionComponent,
    AppComponent,
    UserLoginComponent,
    UserEditPage,
    ScanPageComponent,
    RulesComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot({ name: '__myDb', driverOrder : [ 'indexeddb', 'websql', 'sqlite']}),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppSettingsService,
    ConnectedUserService,
    UserService,
    ValidationService,
    UserResponseService,
    QuizzService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
