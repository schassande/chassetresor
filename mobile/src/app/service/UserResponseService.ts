import { ToastController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { UserResponse, Quizz } from '../model/quizz';
import { QuizzService } from './QuizzService';

@Injectable()
export class UserResponseService  extends RemotePersistentDataService<UserResponse> {

    constructor(
        private quizzService: QuizzService,
        db: AngularFirestore,
        toastController: ToastController,
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
     * et d'un identifiant quizz. Si aucun quizz n'est trouvé en base, alors l'objet <UserResponse>
     * est initialisé.
     * @param userId 
     * @param quizzId 
     * @returns UserResponse
     */
    getUserResponse(userId: string, quizzId: string): UserResponse{

        /** Recherche d'un UserResponse existant pour le quizz actif et l'utilisateur courant */
        var userResponse: UserResponse;
        this.get(userId.concat(quizzId)).subscribe(result => userResponse = result.data); //TODO tester

        /** Si l'objet userResponse n'existe pas, alors on le crée */
        if(!userResponse){
            /** Récupération du quizz actif */
            var quizz: Quizz = this.quizzService.getActiveQuizz();
            /** Valorisation du UserResponse avec les informations du quizz */
            userResponse = {
                userId: userId,
                quizzId: quizzId,
                reponseQuizz: null,
                statut: 'EN_COURS',
                indicesTrouves: '',
                reponsesQuestions: [],
                // On donne pour clé primaire la concaténation des deux ID pour simplifier la recherche
                id: userId.concat(quizzId), 
                creationDate: new Date(),
                dataStatus: 'NEW',
                lastUpdate: new Date(),
                version: 0
            }
            quizz.questions.forEach(element => {
                userResponse.reponsesQuestions.push(
                    {
                        questionId: element.questionId,
                        libelle: element.libelle,
                        statut:'NON_SCANNE',
                        tailleReponse: element.libelle.length,
                        reponse: null
                    }
                );
            });
            /** Enregistrement de l'objet UserResponse */
            this.save(userResponse);
        }

        return userResponse;
    }

}
