import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserQuestion } from 'src/app/model/quizz';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { ValidationService } from 'src/app/service/ValidationService';
import { UserResponseService } from 'src/app/service/UserResponseService';

export type PageStatus =  'CHARGEMENT' | 'QUESTION_INDISPONIBLE' | 'QUESTION_A_TRAITER';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  /** Statut de la page utilisé pour les differentes configurations de l'écran */
  pageStatus: PageStatus;

  /** Question à trouver */
  question: UserQuestion;
  /** Reponse de l'utilisateur */
  reponse: string;

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private connectedUserService: ConnectedUserService,
    private userResponseService: UserResponseService,
    private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.pageStatus = 'CHARGEMENT';
    this.loadValues();
  }

  /** Chargement des valeurs de l'écran */
  loadValues() {
    const questionId = this.route.snapshot.paramMap.get('questionId');
    this.userResponseService.getUserQuestion(this.connectedUserService.getCurrentUser().id, questionId).then((rUserQuestion) => {
        this.question = rUserQuestion;
    }).finally(() => {
      /** Calcul du statut de l'ecran */
      if (!this.question) {
        this.pageStatus = 'QUESTION_INDISPONIBLE';
      } else {
        this.pageStatus = 'QUESTION_A_TRAITER';
      }
      /** Syncronization des changements */
      this.changeRef.detectChanges();
    });
  }

  validerSaisie() {
    this.validationService.validerQuestion(this.reponse, this.question.questionId, this.connectedUserService.getCurrentUser().id);
  }
}
