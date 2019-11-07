import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/model/quizz';
import { QuizzService } from 'src/app/service/QuizzService';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-quizz',
  templateUrl: './manage-quizz.component.html',
  styleUrls: ['./manage-quizz.component.scss'],
})
export class ManageQuizzComponent implements OnInit {

  /** La liste des quizz qui sera affichée dans l'écran  */
  listQuizz: Quizz[];

  /** Constructeur */
  constructor(private quizzService: QuizzService,
    private alertCtrl: AlertController) { }

  /** Méthode exécutée à l'initialisation de l'écran */
  ngOnInit() {
    this.loadQuizz();
  }

  /**
   * Fonction permettant le chargement tous les quizz présents en base
   */
  loadQuizz() {
    this.quizzService.all().subscribe(rQuizz => this.listQuizz = rQuizz.data);
  }

  /**
   * Fonction permettant de (re)démarrer un Quizz
   * Il passe alors du statut FERME à OUVERT
   * 
   * @param quizzId l'ID du quizz
   */
  startQuizz(quizzId) {
    
    let openQuizz: Quizz;
    this.quizzService.getActiveQuizz().subscribe(rQuizz => openQuizz = rQuizz);

    // Vérification qu'il n'y a pas déjà un quizz OUVERT
    if (openQuizz) {
      // Si il y a déjà un quizz ouvert => message d'erreur + do nothing
      this.alertCtrl.create({
        header: 'Erreur',
        message: 'Il y a déjà un quizz ouvert actuellement : ' + openQuizz.libelle,
        buttons: ['OK']
      }).then(alert => {
        alert.present();
      });
    } else {
      // Sinon ; ouverture du quizz + update en base (TODO)
      for (let quizz of this.listQuizz) {
        if (quizz.id == quizzId) {
          if (quizz.statut == 'FERME') {
            quizz.statut = 'OUVERT';
          }
          this.quizzService.save(quizz).subscribe();
        }
      }
    }
  }

  /**
   * Fonction permettant de stopper un quizz
   * Il passe alors du statut OUVERT à FERME
   * 
   * @param quizzId l'ID du quizz
   */
  stopQuizz(quizzId) {
    for (let quizz of this.listQuizz) {
      if (quizz.id == quizzId) {
        if (quizz.statut == 'OUVERT') {
          quizz.statut = 'FERME';
        }
      }
    }
  }

}
