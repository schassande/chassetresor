import { ToastController, NavController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { UserResponse, UserQuestion } from '../model/quizz';
import { QuizzService } from './QuizzService';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from './MessageService';

@Injectable()
export class UserResponseService  extends RemotePersistentDataService<UserResponse> {

    constructor(
        private quizzService: QuizzService,
        db: AngularFirestore,
        toastController: ToastController,
        private messageService: MessageService,
        private navController: NavController
    ) {
        super(db, toastController);
    }

    getLocalStoragePrefix(): string {
        return 'userresponse';
    }

    getPriority(): number {
        return 1;
    }


    /**
     * Methode retournant une UserQuestion a partir d'un userId et d'un quizzId
     * La question est recherchée dans le quiz actif
     * @param userId 
     * @param questionId 
     */
    getUserQuestion(userId: string, questionId: string): Promise<UserQuestion> {
        var vm = this;

        return this.quizzService.getActiveQuizzId().toPromise().then(function(rQuizzId){
            if(!rQuizzId){
                vm.messageService.showMessage('Le quiz n\'est plus ouvert','validationPopupRed');
                return;
            } else{
                return vm.getUserResponse(userId,rQuizzId).toPromise().then(function(rUserResponse){
                    if(!rUserResponse){
                        vm.messageService.showMessage('Un problème est survenu lors de la récupération des informations utilisateur','validationPopupRed');
                        return;
                    } else{
                        return rUserResponse;
                    }
                })
            }
        }).then(function(rUserResponse){
            if(!rUserResponse){
                return;
            } else{
                 /** Recherche de la question */
                 var question = rUserResponse.reponsesQuestions.find(function(element) { return element.questionId == questionId; });
                 /** Question non trouvée */
                 if(!question){
                    vm.messageService.showMessage('La question n\'a pas été trouvée en base','validationPopupRed');
                    vm.navController.navigateRoot(['/home']);
                    return;
                 } else if(question.statut == 'VALIDE') {
                    vm.messageService.showMessage('Vous avez déja répondu à cette question','validationPopupGreen');
                    vm.navController.navigateRoot(['/home']);
                    return;
                 } else {
                    return question;
                 }
            }
        })
    }

    /**
     * Methode retournant un objet <UserResponse> à partir d'un identidiant utilisateur 
     * et d'un identifiant quizz. 
     * @param userId 
     * @param quizzId 
     * @returns UserResponse
     */
    getUserResponse(userId: string, quizzId: string): Observable<UserResponse>{
        return this.queryOne(this.getCollectionRef().where('userId', '==', userId).where('quizzId','==',quizzId), 'default').pipe(
            map((ruser => {
                return ruser.data;
            }))
        );
    }

    /**
     * Methode retournant un objet <UserResponse> à partir d'un identidiant utilisateur 
     * et d'un identifiant quizz. Si aucun <UserResponse> n'est trouvé en base, alors l'objet <UserResponse>
     * est initialisé.
     * @param userId 
     * @param quizzId 
     * @returns UserResponse
     */
    loadUserResponse(userId: string, quizzId: string): Promise<UserResponse>{
        var vm = this;
        /** Recherche d'un UserResponse existant pour le quizz actif et l'utilisateur courant */
        return this.getUserResponse(userId, quizzId).toPromise().then(function(rUserResponse){
            return rUserResponse ? 
                /** Cas ou le userResponse existe */
                rUserResponse :
                /** Sinon récupération du quizz */
                vm.quizzService.get(quizzId).toPromise().then(function(rQuizz){
                    /** Valorisation du UserResponse avec les informations du quizz */
                    var userResponse: UserResponse = {
                        userId: userId,
                        quizzId: quizzId,
                        reponseQuizz: null,
                        statut: 'EN_COURS',
                        indicesTrouves: '',
                        reponsesQuestions: [],
                        // On donne pour clé primaire la concaténation des deux ID pour simplifier la recherche
                        id: null, 
                        creationDate: new Date(),
                        dataStatus: "NEW",
                        lastUpdate: new Date(),
                        version: 0
                    }
                    rQuizz.data.questions.forEach(element => {
                        userResponse.reponsesQuestions.push(
                            {
                                questionId: element.questionId,
                                libelle: element.libelle,
                                statut: 'NON_SCANNE',
                                tailleReponse: element.reponse.length,
                                reponse: null
                            }
                        );
                    });
                    return vm.save(userResponse).toPromise();
                }).then(function(rNewUserResponse){
                    return rNewUserResponse.data;
                });
        });
    }

}