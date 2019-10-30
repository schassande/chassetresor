import { Component, OnInit } from '@angular/core';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss'],
})
export class ManagePlayersComponent implements OnInit {

  quizz = null;

  infosQuizz = [{
    nom: 'jour1',
    nbQuestions: 11,
    mailVainqueur: null,
    players: [{
      firstName: 'Alexis',
      lastName: 'BOUVARD',
      tel: '0646422970',
      mail: 'bouvardalexis@gmail.com',
      nbIndices: 6,
      quizzSolved: false
    }, {
      firstName: 'Emilien',
      lastName: 'CARRIGNON',
      tel: '0612345678',
      mail: 'carrignonemilien@gmail.com',
      nbIndices: 11,
      quizzSolved: true
    }, {
      firstName: 'Fabien',
      lastName: 'JOSEPH',
      tel: '0642386486',
      mail: 'josephfabien@gmail.com',
      nbIndices: 10,
      quizzSolved: true
    }, {
      firstName: 'Frederic',
      lastName: 'DROGO',
      tel: '0642416879',
      mail: 'drogofrederic@gmail.com',
      nbIndices: 6,
      quizzSolved: true
    }, {
      firstName: 'Minh',
      lastName: 'PHAM HUU PHUT',
      tel: '0601487653',
      mail: 'phamhuuphutminh@gmail.com',
      nbIndices: 2,
      quizzSolved: false
    }, {
      firstName: 'Marie',
      lastName: 'MATHIVET',
      tel: '0689566538',
      mail: 'mathivetmarie@gmail.com',
      nbIndices: 10,
      quizzSolved: false
    }]
  }, {
    nom: 'jour2',
    nbQuestions: 12,
    mailVainqueur: null,
    players: [{
      firstName: 'Tutu',
      lastName: 'TUTU',
      tel: '0601845429',
      mail: 'tutu@gmail.com',
      nbIndices: 3,
      quizzSolved: false
    }, {
      firstName: 'Tete',
      lastName: 'TETE',
      tel: '0609824311',
      mail: 'tete@gmail.com',
      nbIndices: 7,
      quizzSolved: true
    }, {
      firstName: 'Tata',
      lastName: 'TATA',
      tel: '0643820743',
      mail: 'tata@gmail.com',
      nbIndices: 6,
      quizzSolved: true
    }]
  }];

  infoQuizz = null;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.quizz = 'jour1';
    this.onChange(event);
  }

  /**
   * Méthode exécutée au changement de valeur du quizz
   * @param $event évènement de changement de quizz sélectionné
   */
  onChange($event) {
    for (let info of this.infosQuizz) {
      if (info.nom == this.quizz) {
        this.infoQuizz = info;
      }
    }
  }

  /**
   * Fonction appelée au clic sur le bouton "Désigner un vainqueur"
   */
  designerVainqueur() {
    let vainqueursPlausibles = [];
    let vainqueursPlausiblesReduit = [];
    let vainqueur = null;
    for (let player of this.infoQuizz.players) {
      if (player.quizzSolved) {
        vainqueursPlausibles.push(player);
      }
    }

    if (vainqueursPlausibles.length == 1) {
      vainqueur = vainqueursPlausibles[0];
    } else {

      // On retire les joueurs qui n'ont pas résolu 80% des enigmes
      for (let player of vainqueursPlausibles) {
        if (player.nbIndices > (this.infoQuizz.nbQuestions * 80 / 100)) {
          vainqueursPlausiblesReduit.push(player);
        }
      }

      // Si aucun joueur n'a résolu 80% des énigmes, on garde tous les joueurs ayant trouvé le quizz
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

      // Désignation du vainqueur
      if (vainqueur) {
        this.infoQuizz.mailVainqueur = vainqueur.mail;
        this.alertCtrl.create({
          header: 'And the winner is...',
          message: vainqueur.firstName + ' ' + vainqueur.lastName + ', ' + vainqueur.tel + ', ' + vainqueur.mail,
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
  }
}
