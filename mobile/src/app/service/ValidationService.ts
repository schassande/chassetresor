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
     * @param reponseUtilisateur la reponse de l'utilisateur
     * @param questionId l'identifiant de la question
     */
    validerQuestion(reponseUtilisateur: string, questionId: string, userId: string): Promise<string> {
        let activeQuizzId: string;
        reponseUtilisateur = reponseUtilisateur ? reponseUtilisateur : '';
        return this.quizzService.getActiveQuizz().toPromise()
        /** Verification que la question se trouve dans le quizz au statut Ouvert */
        .then((rActiveQuizz) => {
            /** Pas de quizz actif */
            if (!rActiveQuizz) {
                this.messageService.showMessage('Le quiz n\'est plus ouvert', 'validationPopupRed');
                this.navController.navigateRoot(['/home']);
                return;
            } else {
                activeQuizzId = rActiveQuizz.id;
                /** Recherche de la question */
                const question = rActiveQuizz.questions.find((element)  => element.questionId === questionId );
                /** Question non trouvée */
                if (!question) {
                    this.messageService.showMessage('La question n\'a pas été trouvée en base', 'validationPopupRed');
                    this.navController.navigateRoot(['/home']);
                    return;
                } else {
                    return question;
                }
            }
        })
        /** Verification de la validité de la question */
        .then((rQuestion) => {
            if (!rQuestion) {
                return;
            } else if (reponseUtilisateur.toUpperCase() !== rQuestion.reponse.toUpperCase()) {
                this.messageService.showMessage('Réponse incorrecte', 'validationPopupRed');
                return;
            } else {
                /** Récupération du user response */
                return this.userResponseService.getUserResponse(userId, activeQuizzId).toPromise().then((rUserResponse) => {
                    if (!rUserResponse) {
                        this.messageService.showMessage('Un problème est survenu lors de la récupération des informations utilisateur',
                            'validationPopupRed');
                        return;
                    } else {
                        rUserResponse.indicesTrouves = rUserResponse.indicesTrouves.concat(rQuestion.indice);
                        rUserResponse.reponsesQuestions.forEach(element => {
                            if (element.questionId === questionId) {
                                element.statut = 'VALIDE';
                                element.reponse = reponseUtilisateur;
                            }
                        });
                        return rUserResponse;
                    }
                })
                /** Update de l'user response */
                .then((rUserResponse) => {
                    if (!rUserResponse) {
                        return;
                    } else {
                        return this.userResponseService.save(rUserResponse).toPromise();
                    }
                }).then((rUserResponse) => {
                    if (!rUserResponse) {
                        return;
                    } else if (!rUserResponse.data) {
                        this.messageService.showMessage('Un problème est survenu lors de la mise à jour des informations utilisateur',
                            'validationPopupRed');
                    } else {
                        this.messageService.showMessage('Indice ' + rQuestion.indice + ' ajouté !', 'validationPopupGreen');
                        this.navController.navigateRoot(['/home']);
                        return rQuestion.indice;
                    }

                });
            }
        });
      }

      /**
       * Methode de validation du quizz
       */
      validerQuizz(reponseUtilisateur: string, quizzId: string, userId: string): Promise<boolean> {
        reponseUtilisateur = reponseUtilisateur ? reponseUtilisateur : '';
        /** Recuperation du quizz */
        return this.quizzService.get(quizzId).toPromise().then((rQuizz) => {
            /** Le quizz n'a pas été récupéré */
            if (!rQuizz.data) {
                this.messageService.showMessage('Erreur lors de la récupération du quiz', 'validationPopupRed');
                return false;
            } else if (rQuizz.data.statut !== 'OUVERT') {
                this.messageService.showMessage('Le quiz n\'est plus ouvert', 'validationPopupRed');
                return false;
            } else if (rQuizz.data.reponse.toUpperCase() !== reponseUtilisateur.toUpperCase()) {
                this.messageService.showMessage('Réponse incorrecte', 'validationPopupRed');
                return false;
            } else {
                return true;
            }
        }).then((isValid) => {
            if (!isValid) {
                return false;
            } else {
                /** On met à jour le userResponse */
                return this.userResponseService.getUserResponse(userId, quizzId).toPromise().then((rUserResponse) => {
                    if (!rUserResponse) {
                        this.messageService.showMessage('Un problème est survenu lors de la récupération des informations utilisateur',
                            'validationPopupRed');
                        return false;
                    } else {
                        rUserResponse.statut = 'FINI';
                        rUserResponse.reponseQuizz = reponseUtilisateur;
                        return this.userResponseService.save(rUserResponse).toPromise().then((rUserResponse2) => {
                            if (!rUserResponse2.data) {
                                this.messageService.showMessage(
                                    'Un problème est survenu lors de la mise à jour des informations utilisateur',
                                    'validationPopupRed');
                            } else {
                                this.messageService.showMessage('Vous avez résolu l\'énigme', 'validationPopupGreen');
                                this.navController.navigateRoot(['/home']);
                                return true;
                            }
                        });
                    }
                });
            }
        });
      }
}
