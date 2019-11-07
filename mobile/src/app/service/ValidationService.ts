import { AlertController, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './AppSettingsService';
import { UserResponseService } from './UserResponseService';
import { QuizzService } from './QuizzService';

@Injectable()
export class ValidationService {

    constructor(
        private navController: NavController,
        public appSettingsService: AppSettingsService,
        public alertController: AlertController,
        public userResponseService: UserResponseService,
        public quizzService: QuizzService
    ) {}

    getLocalStoragePrefix(): string {
        return 'quizz';
    }

    getPriority(): number {
        return 1;
    }

    /**
     * Methode de validation de la question
     * @param reponseUtilisateur 
     * @param questionId 
     */
    validerQuestion(reponseUtilisateur:string, questionId: string, userId: string): Promise<string>{
        var vm = this;
        var activeQuizzId: string;
        
        return this.quizzService.getActiveQuizz().toPromise()
        /** Verification que la question se trouve dans le quizz au statut Ouvert */
        .then(function(rActiveQuizz){
            /** Pas de quizz actif */
            if(!rActiveQuizz){
                vm.showMessage('Le quizz n\'est plus actif','validationPopupRed');
                vm.navController.navigateRoot(['/home']);
                return;
            } else{
                activeQuizzId = rActiveQuizz.id;
                /** Recherche de la question */
                var question = rActiveQuizz.questions.find(function(element) { return element.questionId == questionId; });
                /** Question non trouvée */
                if(!question){
                    vm.showMessage('La question n\'a pas été trouvée en base','validationPopupRed');
                    vm.navController.navigateRoot(['/home']);
                    return;
                } else{
                    return question;
                }
            }
        })
        /** Verification de la validité de la question */
        .then(function(rQuestion){
            if(!rQuestion){
                return;
            } else if(reponseUtilisateur.toUpperCase() != rQuestion.reponse.toUpperCase()){
                vm.showMessage('Réponse incorrecte','validationPopupRed');
                return;
            } else{
                /** Récupération du user response */
                return vm.userResponseService.getUserResponse(userId,activeQuizzId).toPromise().then(function(rUserResponse){
                    if(!rUserResponse){
                        vm.showMessage('Un problème est survenu lors de la récupération des informations utilisateur','validationPopupRed');
                        return;
                    } else{
                        rUserResponse.indicesTrouves = rUserResponse.indicesTrouves.concat(rQuestion.indice);
                        rUserResponse.reponsesQuestions.forEach(element => {
                            if(element.questionId == questionId) { 
                                element.statut = 'VALIDE';
                            }
                        });
                        return rUserResponse;
                    }
                })
                /** Update de l'user response */
                .then(function(rUserResponse){
                    if(!rUserResponse){
                        return;
                    } else {
                        return vm.userResponseService.save(rUserResponse).toPromise();
                    }
                }).then(function(rUserResponse){
                    if(!rUserResponse){
                        return;
                    } else if(!rUserResponse.data){
                        vm.showMessage('Un problème est survenu lors de la mise à jour des informations utilisateur','validationPopupRed');
                    } else {
                        vm.showMessage('Indice ' + rQuestion.indice + ' ajouté !', 'validationPopupGreen');
                        vm.navController.navigateRoot(['/home']);
                        return rQuestion.indice;
                    }

                })
            }
        })
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
