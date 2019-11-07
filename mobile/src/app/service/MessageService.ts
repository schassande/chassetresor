import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './AppSettingsService';

@Injectable()
export class MessageService {

    constructor(
        public appSettingsService: AppSettingsService,
        public alertController: AlertController
    ) {}

    /**
     * Affichage d'un message sous forme de popup
     * @param pMessage 
     * @param pCssClass 
     */
    async showMessage(pMessage: string, pCssClass: string) {
        const alert = await this.alertController.create({
          message: pMessage,
          cssClass: pCssClass
        });
        await alert.present();
    }
}
