import { AppSettingsService } from './AppSettingsService';
import { Injectable, EventEmitter } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Reference } from '@angular/fire/storage/interfaces';

@Injectable()
export class ValidationService {

  constructor(
    private navController: NavController,
    public appSettingsService: AppSettingsService,
    public alertController: AlertController) {
  }

  validerQuestion(pReponse:string, pRefQuestion: Reference){

    // TODO
    let reponseValidation: Boolean = pReponse == '1';

    if(reponseValidation){
      this.showMessage('Indice ' + reponseValidation + ' ajouté !', 'validationPopupGreen');
      this.navController.navigateRoot(['/home']);
    } else{
      this.showMessage('Réponse incorrecte','validationPopupRed');
    }
  }

  validerQuizz(pReponse:string, pRefQuizz: Reference) {

    //TODO
    let reponseValidation: Boolean = pReponse == '1';
    
    if(reponseValidation){
      this.showMessage('Vous avez résolu l\'énigme','validationPopupGreen');
      this.navController.navigateRoot(['/home']);
    } else{
      this.showMessage('Réponse incorrecte','validationPopupRed');
    }
  }

  async showMessage(pMessage: string, pCssClass: string) {
    const alert = await this.alertController.create({
      message: pMessage,
      cssClass: pCssClass
    });
    await alert.present();
    /*setTimeout(() => {
      alert.dismiss();
    }, 1200);*/
  }

}
