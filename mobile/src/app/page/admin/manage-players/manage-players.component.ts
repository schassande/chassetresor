import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { QuizzService } from 'src/app/service/QuizzService';
import { Quizz } from 'src/app/model/quizz';
import { Observable } from 'rxjs';
import { ResponseWithData } from 'src/app/service/response';
import { map, flatMap } from 'rxjs/operators';
import { ManagePlayersService } from './manage-players.service';
import { Player } from './player';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss'],
})
export class ManagePlayersComponent implements OnInit {

  infoQuizz = null;

  /** La liste des quizz */
  listQuizz: Quizz[];

  /** Index du quizz selctionné */
  selectedQuizzIdx: number = 0;

  /** La liste des joueurs du quizz selectionné */
  listPlayers: Player[];

  /** Constructeur */
  constructor(
    private alertCtrl: AlertController,
    private quizzService: QuizzService,
    private managePlayersService: ManagePlayersService) { }

  /** Méthode exécutée à l'initialisation de l'écran */
  ngOnInit() {
    this.loadData();
  }

  /** Méthode de chargement des données de l'écran */
  loadData() {
    this.loadQuizz().pipe(
      flatMap(() => {
        return this.loadPlayers();
      })
    ).subscribe();
  }

  /** Fonction permettant le chargement tous les quizz présents en base */
  loadQuizz(): Observable<ResponseWithData<Quizz[]>> {
    return this.quizzService.all().pipe(
      map(rQuizz => {
        this.listQuizz = rQuizz.data;
        return rQuizz;
      })
    );
  }

  /** Fonction permettant le chargement tous les joueurs présents en base */
  loadPlayers(): Observable<Player[]> {
    return this.managePlayersService.loadPlayers(this.listQuizz[this.selectedQuizzIdx].id).pipe(
      map(rPlayers => {
        this.listPlayers = rPlayers;
        return rPlayers;
      })
    );
  }

  /**
   * Méthode exécutée au changement de valeur du quizz
   * @param $event évènement de changement de quizz sélectionné
   */
  onChange($event) {
    this.loadPlayers().subscribe();
  }

  /**
   * Fonction appelée au clic sur le bouton "Désigner un vainqueur"
   */
  designerVainqueur() {
    let vainqueursPlausibles: Player[] = [];
    let vainqueursPlausiblesReduit: Player[] = [];
    let vainqueur: Player = null;

    for (let player of this.listPlayers) {
      if (player.userResponse.statut == 'FINI') {
        vainqueursPlausibles.push(player);
      }
    }

    if (vainqueursPlausibles.length == 1) {
      vainqueur = vainqueursPlausibles[0];
    } else {

      // On retire les joueurs qui n'ont pas résolu 50% des enigmes
      for (let player of vainqueursPlausibles) {
        if (player.userResponse.indicesTrouves.length > (player.userResponse.reponsesQuestions.length * 50 / 100)) {
          vainqueursPlausiblesReduit.push(player);
        }
      }

      // Si aucun joueur n'a résolu 50% des énigmes, on garde tous les joueurs ayant trouvé le quizz
      if (vainqueursPlausiblesReduit.length == 0) {
        vainqueursPlausiblesReduit = Object.assign([], vainqueursPlausibles);
      }

      // S'il reste toujours plusieurs joueurs en courses, on tire au sort
      if (vainqueursPlausiblesReduit.length > 1) {
        let randIndex = Math.floor(Math.random() * vainqueursPlausiblesReduit.length);
        vainqueur = vainqueursPlausiblesReduit[randIndex];
      } else {
        vainqueur = vainqueursPlausiblesReduit[0];
      }
    }

    // Désignation du vainqueur
    if (vainqueur) {
      this.setVainqueur(vainqueur);
      this.alertCtrl.create({
        header: 'And the winner is...',
        message: vainqueur.user.firstName + ' ' + vainqueur.user.lastName + ', ' + vainqueur.user.phone + ', ' + vainqueur.user.email,
        buttons: ['OK']
      }).then(alert => {
        alert.present();
      });
    } else {
      this.alertCtrl.create({
        header: 'Oups...',
        message: 'Aucun joueur n\'a résolu le quizz pour le moment',
        buttons: ['OK']
      }).then(alert => {
        alert.present();
      });
    }

  }

  /**
   * Méthode utilisée pour mettre à jour en base un quizz et son vainqueur
   * 
   * @param vainqueur le vainqueur du quizz
   */
  setVainqueur(vainqueur: Player) {

    // Chargement du quizz actif à l'écran
    let quizz: Quizz = this.listQuizz[this.selectedQuizzIdx];

    // On y sette le vainqueur
    quizz.gagnant = {
      userId: vainqueur.user.id,
      email: vainqueur.user.email
    }

    // MàJ en base
    this.quizzService.save(quizz);
  }
}
