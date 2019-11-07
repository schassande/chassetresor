import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserQuestion } from 'src/app/model/quizz';
import { QuizzService } from 'src/app/service/QuizzService';

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
    private quizzService: QuizzService) {}

  ngOnInit() {
    this.question = JSON.parse(this.route.snapshot.paramMap.get('question'));
  }

  validerSaisie(){
    this.quizzService.validerQuestion(this.reponse, this.question.questionId);
  }
}