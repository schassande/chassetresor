import { AlertController, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './AppSettingsService';
import { UserResponseService } from './UserResponseService';
import { QuizzService } from './QuizzService';
import { MessageService } from './MessageService';

@Injectable()
export class ValidationService {

    constructor(
        private navController: NavController,
        public appSettingsService: AppSettingsService,
        public alertController: AlertController,
        public userResponseService: UserResponseService,
        public quizzService: QuizzService,
        public messageService: MessageService
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
                vm.messageService.showMessage('Le quiz n\'est plus ouvert','validationPopupRed');
                vm.navController.navigateRoot(['/home']);
                return;
            } else{
                activeQuizzId = rActiveQuizz.id;
                /** Recherche de la question */
                var question = rActiveQuizz.questions.find(function(element) { return element.questionId == questionId; });
                /** Question non trouvée */
                if(!question){
                    vm.messageService.showMessage('La question n\'a pas été trouvée en base','validationPopupRed');
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
                vm.messageService.showMessage('Réponse incorrecte','validationPopupRed');
                return;
            } else{
                /** Récupération du user response */
                return vm.userResponseService.getUserResponse(userId,activeQuizzId).toPromise().then(function(rUserResponse){
                    if(!rUserResponse){
                        vm.messageService.showMessage('Un problème est survenu lors de la récupération des informations utilisateur','validationPopupRed');
                        return;
                    } else{
                        rUserResponse.indicesTrouves = rUserResponse.indicesTrouves.concat(rQuestion.indice);
                        rUserResponse.reponsesQuestions.forEach(element => {
                            if(element.questionId == questionId) { 
                                element.statut = 'VALIDE';
                                element.reponse = reponseUtilisateur;
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
                        vm.messageService.showMessage('Un problème est survenu lors de la mise à jour des informations utilisateur','validationPopupRed');
                    } else {
                        vm.messageService.showMessage('Indice ' + rQuestion.indice + ' ajouté !', 'validationPopupGreen');
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
      validerQuizz(reponseUtilisateur:string, quizzId: string, userId: string): Promise<boolean> {
        var vm = this;
        /** Recuperation du quizz */
        return this.quizzService.get(quizzId).toPromise().then(function(rQuizz){
            /** Le quizz n'a pas été récupéré */
            if(!rQuizz.data){
                vm.messageService.showMessage('Erreur lors de la récupération du quiz','validationPopupRed');
                return false;
            } else if (rQuizz.data.statut != 'OUVERT') {
                vm.messageService.showMessage('Le quiz n\'est plus ouvert','validationPopupRed');
                return false;
            } else if (rQuizz.data.reponse.toUpperCase() != reponseUtilisateur.toUpperCase()){
                vm.messageService.showMessage('Réponse incorrecte','validationPopupRed');
                return false;
            } else {
                return true;
            }
        }).then(function(isValid){
            if(!isValid){
                return false;
            } else{
                /** On met à jour le userResponse */
                return vm.userResponseService.getUserResponse(userId, quizzId).toPromise().then(function(rUserResponse){
                    if(!rUserResponse){
                        vm.messageService.showMessage('Un problème est survenu lors de la récupération des informations utilisateur','validationPopupRed');
                        return false;
                    } else {
                        rUserResponse.statut = 'FINI';
                        rUserResponse.reponseQuizz = reponseUtilisateur;
                        return vm.userResponseService.save(rUserResponse).toPromise().then(function(rUserResponse){
                            if(!rUserResponse.data){
                                vm.messageService.showMessage('Un problème est survenu lors de la mise à jour des informations utilisateur','validationPopupRed');
                            } else{
                                vm.messageService.showMessage('Vous avez résolu l\'énigme','validationPopupGreen');
                                vm.navController.navigateRoot(['/home']);
                                return true;
                            }
                        })
                    }
                })
            }
        })
      }

}
