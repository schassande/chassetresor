import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Quizz } from '../model/quizz';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

}
