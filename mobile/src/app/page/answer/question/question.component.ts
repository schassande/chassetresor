import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserQuestion } from 'src/app/model/quizz';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { ValidationService } from 'src/app/service/ValidationService';

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
    private connectedUserService: ConnectedUserService) {}

  ngOnInit() {
    this.pageStatus = 'CHARGEMENT';
    this.loadValues();
  }

  /** Chargement des valeurs de l'écran */
  loadValues(){
    this.question = JSON.parse(this.route.snapshot.paramMap.get('question')); // TODO appel back
    this.pageStatus = 'QUESTION_A_TRAITER'; 
  }

  validerSaisie(){
    this.validationService.validerQuestion(this.reponse, this.question.questionId, this.connectedUserService.getCurrentUser().id);
  }
}