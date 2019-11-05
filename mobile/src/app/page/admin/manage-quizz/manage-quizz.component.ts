import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-quizz',
  templateUrl: './manage-quizz.component.html',
  styleUrls: ['./manage-quizz.component.scss'],
})
export class ManageQuizzComponent implements OnInit {

  listQuizz=[{
    name: 'Quizz jour 1',
    nbIndices: 11,
    gagnant: null,
    status: 'Initialisé',
    dateOfStart: null,
    dateOfEnd: null,
  }, {
    name: 'Quizz jour 2',
    nbIndices: 12,
    gagnant: null,
    status: 'Initialisé',
    dateOfStart: null,
    dateOfEnd: null,
  }]

  constructor() { }

  ngOnInit() {}

  startQuizz(quizzName) {
    for(let quizz of this.listQuizz) {
      if(quizz.name == quizzName) {
        if(quizz.status=='Initialisé') {
          quizz.status='Démarré';
          quizz.dateOfStart = new Date();
        }
      }
    }
  }

  stopQuizz(quizzName) {
    for(let quizz of this.listQuizz) {
      if(quizz.name == quizzName) {
        if(quizz.status=='Démarré') {
          quizz.status='Arrêté';
          quizz.dateOfEnd = new Date();
        }
      }
    }
  }

}
