import { Component, OnInit } from '@angular/core';
import { QuizzComponent } from '../answer/quizz/quizz.component';
import { Quizz } from 'src/app/model/quizz';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  quizz: Quizz;

  constructor() {}

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }





}
