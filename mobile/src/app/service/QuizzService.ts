import { ToastController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Quizz } from '../model/quizz';

@Injectable()
export class QuizzService  extends RemotePersistentDataService<Quizz> {

    constructor(
        db: AngularFirestore,
        toastController: ToastController,
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
        return;
    }

}
