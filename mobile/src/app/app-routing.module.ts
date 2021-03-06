import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './AuthGuard';

import { UserEditPage } from './page/user/user-edit/user-edit';
import { UserLoginComponent } from './page/user/user-login/user-login.component';
import { ScanPageComponent } from './page/scan-page/scan-page.component';
import { HomePage } from './page/home/home.page';
import { ManagePlayersComponent } from './page/admin/manage-players/manage-players.component';
import { ManageQuizzComponent } from './page/admin/manage-quizz/manage-quizz.component';
import { QuizzComponent } from './page/answer/quizz/quizz.component';
import { QuestionComponent } from './page/answer/question/question.component';
import { RulesComponent } from './page/rules/rules.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage, canActivate: [AuthGuard] },
  { path: 'user/login', component: UserLoginComponent},
  { path: 'user/create', component: UserEditPage},
  { path: 'user/edit/:id', component: UserEditPage, canActivate: [AuthGuard]},
  { path: 'scan', component: ScanPageComponent, canActivate: [AuthGuard]},
  { path: 'admin/players', component: ManagePlayersComponent, canActivate: [AuthGuard]},
  { path: 'admin/quizz', component: ManageQuizzComponent, canActivate: [AuthGuard]},
  { path: 'quizz', component: QuizzComponent, canActivate: [AuthGuard]},
  { path: 'question/:questionId', component: QuestionComponent, canActivate: [AuthGuard]},
  { path: 'rules', component: RulesComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
