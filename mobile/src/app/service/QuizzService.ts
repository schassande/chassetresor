import { ToastController, AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Quizz } from '../model/quizz';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppSettingsService } from './AppSettingsService';

@Injectable()
export class QuizzService  extends RemotePersistentDataService<Quizz> {

    constructor(
        db: AngularFirestore,
        toastController: ToastController,
        private navController: NavController,
        public appSettingsService: AppSettingsService,
        public alertController: AlertController
    ) {
        super(db, toastController);
    }

    getLocalStoragePrefix(): string {
        return 'quizz';
    }

    getPriority(): number {
        return 1;
    }

    /**
     * Methode récupérant le quizz actif
     * @returns le <Quizz> actif
     */
    getActiveQuizz(): Observable<Quizz> {
        return this.all().pipe(
            map( (rQuizzs) => {
                var result;
                if (rQuizzs.data) {
                    rQuizzs.data.forEach(element => {
                        if(element.statut == "OUVERT")
                        { 
                            result = element; 
                        }
                    });
                }
                return result;
            })
        )
    };

    /**
     * Methode récupérant l'identifiant du quizz actif
     * @returns identifiant du quizz actif
     */
    getActiveQuizzId(): Observable<string> {
        return this.getActiveQuizz().pipe(
            map( (rQuizz) => {
                var result;
                if (rQuizz) {
                    result = rQuizz.id;
                }
                return result;
            })
        );
    }

    /**
     * Methode de validation de la question
     * @param reponseUtilisateur 
     * @param questionId 
     */
    validerQuestion(reponseUtilisateur:string, questionId: string): Promise<string>{

        return;
       // var vm = this;
        /** Verification que le quizz en question est ouvert */
        //return

        //return this.getUserResponse(userId, quizzId).toPromise()


        // TODO
        /*let reponseValidation: Boolean = pReponse == '1';
    
        if(reponseValidation){
          this.showMessage('Indice ' + reponseValidation + ' ajouté !', 'validationPopupGreen');
          this.navController.navigateRoot(['/home']);
        } else{
          this.showMessage('Réponse incorrecte','validationPopupRed');
        }*/
      }

      /**
       * Methode de validation du quizz
       * @param reponseUtilisateur 
       * @param quizzId 
       */
      validerQuizz(reponseUtilisateur:string, quizzId: string) {

        return;


        //TODO
        //let reponseValidation: Boolean = pReponse == '1';
        
        /*if(reponseValidation){
          this.showMessage('Vous avez résolu l\'énigme','validationPopupGreen');
          this.navController.navigateRoot(['/home']);
        } else{
          this.showMessage('Réponse incorrecte','validationPopupRed');
        }*/
      }
    
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
