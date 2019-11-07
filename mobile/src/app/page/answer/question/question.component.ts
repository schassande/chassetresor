import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserQuestion } from 'src/app/model/quizz';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { ValidationService } from 'src/app/service/ValidationService';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  /** Question à trouver */
  question: UserQuestion;
  /** Reponse de l'utilisateur */
  reponse: string;

  constructor(
    private route: ActivatedRoute, 
    private validationService: ValidationService,
    private connectedUserService: ConnectedUserService) {}

  ngOnInit() {
    this.question = JSON.parse(this.route.snapshot.paramMap.get('question'));
  }

  validerSaisie(){
    this.validationService.validerQuestion(this.reponse, this.question.questionId, this.connectedUserService.getCurrentUser().id);
  }
}