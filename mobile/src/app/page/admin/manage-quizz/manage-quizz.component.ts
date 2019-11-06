import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/model/quizz';
import { QuizzService } from 'src/app/service/QuizzService';

@Component({
  selector: 'app-manage-quizz',
  templateUrl: './manage-quizz.component.html',
  styleUrls: ['./manage-quizz.component.scss'],
})
export class ManageQuizzComponent implements OnInit {

  /** La liste des quizz qui sera affichée dans l'écran  */
  listQuizz: Quizz[];

  /** Constructeur */
  constructor(private quizzService: QuizzService) { }

  /** Méthode exécutée à l'initialisation de l'écran */
  ngOnInit() {
    this.loadQuizz();
  }

  /**
   * Fonction permettant le chargement des quizz présent en base
   */
  loadQuizz() {
    this.quizzService.all().subscribe(rQuizz => this.listQuizz = rQuizz.data);
  }

  /**
   * Fonction permettant de démarrer un Quizz
   * Il passe alors du statut INIT à OUVERT
   * 
   * @param quizzName le nom du quizz
   */
  startQuizz(quizzName) {
    for (let quizz of this.listQuizz) {
      if (quizz.libelle == quizzName) {
        if (quizz.statut == 'INIT') {
          quizz.statut = 'OUVERT';
        }
      }
    }
  }

  /**
   * Fonction permettant de stopper un quizz
   * Il passe alors du statut OUVERT à FERME
   * 
   * @param quizzName le nom du quizz
   */
  stopQuizz(quizzName) {
    for (let quizz of this.listQuizz) {
      if (quizz.libelle == quizzName) {
        if (quizz.statut == 'OUVERT') {
          quizz.statut = 'FERME';
        }
      }
    }
  }

}
