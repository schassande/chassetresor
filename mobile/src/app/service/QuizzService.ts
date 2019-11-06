import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Quizz } from '../model/quizz';

@Injectable()
export class QuizzService  extends RemotePersistentDataService<Quizz> {

    constructor(
        db: AngularFirestore,
        toastController: ToastController,
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
    getActiveQuizz(): Quizz {
        this.all().subscribe((result) => {
            result.data.forEach(element => {
                if(element.statut == 'OUVERT'){
                    return element;
                }
            });
        }, (error) => {
            console.log(error);
        });
        return;
    }

    /**
     * Methode récupérant l'identifiant du quizz actif
     * @returns identifiant du quizz actif
     */
    getActiveQuizzId(): string {
        var activeQuizz: Quizz = this.getActiveQuizz();
        return activeQuizz ? activeQuizz.id : null;
    }

}
