import { Component, OnInit } from '@angular/core';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';

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
      firstName: 'Toto',
      lastName: 'TOTO',
      tel: '0674839376',
      mail: 'toto@gmail.com',
      nbIndices: 11,
      quizzSolved: true
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
      nbIndices: 12,
      quizzSolved: true
    }]
  }];

  infoQuizz = null;

  constructor() { }

  ngOnInit() {
    this.quizz='jour2';
    this.onChange(event);
  }

  /**
   * Méthode exécutée au changement de valeur du quizz
   * @param $event évènement de changement de quizz sélectionné
   */
  onChange($event) {
    for(let info of this.infosQuizz) {
      if(info.nom == this.quizz) {
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
    for(let player of this.infoQuizz.players) {
      if(player.quizzSolved) {
        vainqueursPlausibles.push(player);
      }
    }
    // On retire les joueurs qui n'ont pas résolu 80% des enigmes
    for(let player of vainqueursPlausibles) {
      if(player.nbIndices > (this.infoQuizz.nbQuestions * 80 / 100)) {
        vainqueursPlausiblesReduit.push(player);
      }
    }
    // S'il reste toujours plusieurs joueurs en courses, on tire au sort
    // TODO : PENSER A GERER LE CAS OU AUCUN JOUEUR N'A RESOLU 80% DES ENIGMES
    if(vainqueursPlausiblesReduit.length > 1) {
      let randIndex = Math.floor(Math.random() * vainqueursPlausiblesReduit.length);
      vainqueur = vainqueursPlausiblesReduit[randIndex];
    } else {
      vainqueur = vainqueursPlausiblesReduit[0];
    }

    console.log('Vainqueur: ', vainqueur);
  }
  
}
