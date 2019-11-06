import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/service/ValidationService';
import { UserQuestion } from 'src/app/model/quizz';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  /** Question à trouver */
  question: UserQuestion;
  /** reponse */
  reponse: string;

  constructor(
    private route: ActivatedRoute, 
    private validationService: ValidationService) {}

  ngOnInit() {
    this.question = JSON.parse(this.route.snapshot.paramMap.get('question'));
  }

  validerSaisie(){
    this.validationService.validerQuestion(this.reponse, null);
  }
}
