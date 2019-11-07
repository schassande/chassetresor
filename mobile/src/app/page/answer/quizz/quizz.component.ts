import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IndicesPipe } from 'src/app/utlis/indices.pipe';
import { ValidationService } from 'src/app/service/ValidationService';
import { QuizzService } from 'src/app/service/QuizzService';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';

export type PageStatus =  'CHARGEMENT' | 'QUIZZ_INDISPONIBLE' | 'QUIZZ_DISPONBILE' | 'QUIZZ_TERMINE';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit {

    /** Statut de la page utilisé pour les differentes configurations de l'écran */
    pageStatus: PageStatus;

    /** Identifiant du quizz Actif */
    quizzId: string;
    /** Nombre d'indices à trouver */
    nbIndices = 0;
    /** Indices trouvés */
    indicesTrouves: Array<string> = [];
    /** Reponse de l'utilisateur */
    reponse = '';
    /** Quizz validé ? */
    isQuizzValide = false;

  constructor(
    private validationService: ValidationService,
    private quizzService: QuizzService,
    private userResponseService: UserResponseService,
    private connectedUserService: ConnectedUserService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pageStatus = 'CHARGEMENT';
    this.loadValues();
  }

  loadValues() {
    /** Etape 1 : Récupération de l'identifiant du Quizz courant */
    this.quizzService.getActiveQuizzId().toPromise().then((rQuizzId) => {
      this.quizzId = rQuizzId;
      /** Etape 2 : Récupération de UserResponse */
      return this.userResponseService.getUserResponse(this.connectedUserService.getCurrentUser().id, this.quizzId).toPromise();
    }).then((rUserResponse) => {
      /** Etape 3 : Initialisation des valeurs de l'écran avec UserResponse */
      if (rUserResponse) {
        this.nbIndices = rUserResponse.reponsesQuestions.length;
        this.initializeIndicesTab(rUserResponse.indicesTrouves);
        this.isQuizzValide = rUserResponse.statut === 'FINI';
      }
      this.changeRef.detectChanges();
    }).finally(() => {
      /** Calcul du statut de l'ecran */
      if (!this.quizzId) {
        this.pageStatus = 'QUIZZ_INDISPONIBLE';
      } else if (this.isQuizzValide) {
        this.pageStatus = 'QUIZZ_TERMINE';
      } else {
        this.pageStatus = 'QUIZZ_DISPONBILE';
      }

      /** Syncronization des changements */
      this.changeRef.detectChanges();
    });
  }

  initializeIndicesTab(indices: string) {
    indices = new IndicesPipe().transform(indices, this.nbIndices).toString();
    this.indicesTrouves = indices.replace(' ', '').split('');
    /*
    this.indicesTrouves = new Array<string>();
    for (let i = 0; i < indices.length; i++) {
       if (indices[i] !== ' ') {
        this.indicesTrouves.push(indices[i]);
       }
    }
    */
  }

  validerSaisie() {
    this.validationService.validerQuizz(this.reponse, this.quizzId, this.connectedUserService.getCurrentUser().id);
  }
}
