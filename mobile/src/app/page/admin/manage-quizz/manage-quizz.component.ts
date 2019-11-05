import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/model/referentiels/quizz';
import { QuizzService } from 'src/app/service/QuizzService';

@Component({
  selector: 'app-manage-quizz',
  templateUrl: './manage-quizz.component.html',
  styleUrls: ['./manage-quizz.component.scss'],
})
export class ManageQuizzComponent implements OnInit {

 /* listQuizz=[{
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
  }]*/

  listQuizz: Quizz[];

  constructor(private quizzService: QuizzService) { }

  ngOnInit() {
    this.loadQuizz();
  }

  loadQuizz() {
    this.quizzService.all().subscribe(rQuizz => this.listQuizz = rQuizz.data);
  }

  startQuizz(quizzName) {
    for(let quizz of this.listQuizz) {
      if(quizz.libelle == quizzName) {
        if(quizz.statut=='INIT') {
          quizz.statut='OUVERT';
        }
      }
    }
  }

  stopQuizz(quizzName) {
    for(let quizz of this.listQuizz) {
      if(quizz.libelle == quizzName) {
        if(quizz.statut=='OUVERT') {
          quizz.statut='FERME';
        }
      }
    }
  }

}
