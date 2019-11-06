import { ToastController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { UserResponse } from '../model/quizz';
import { QuizzService } from './QuizzService';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserResponseService  extends RemotePersistentDataService<UserResponse> {

    constructor(
        private quizzService: QuizzService,
        db: AngularFirestore,
        toastController: ToastController
    ) {
        super(db, toastController);
    }

    getLocalStoragePrefix(): string {
        return 'useruesponse';
    }

    getPriority(): number {
        return 1;
    }

    /**
     * Methode retournant un objet <UserResponse> à partir d'un identidiant utilisateur 
     * et d'un identifiant quizz. 
     * @param userId 
     * @param quizzId 
     * @returns UserResponse
     */
    getUserResponse(userId: string, quizzId: string): Observable<UserResponse>{
        return this.get(userId.concat(quizzId)).pipe(
            map( (rUserResponse) => {
                return rUserResponse.data;
            })
        )
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
                        id: userId.concat(quizzId), 
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
                                tailleReponse: element.libelle.length,
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
