import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/model/referentiels/question';
import { AlertController } from '@ionic/angular';
import { ValidationService } from 'src/app/service/ValidationService';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  /** Question à trouver */
  question: Question;
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
