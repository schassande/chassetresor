import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './AuthGuard';

import { UserEditPage } from './page/user/user-edit/user-edit';
import { UserLoginComponent } from './page/user/user-login/user-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },

  { path: 'user/login', component: UserLoginComponent},
  { path: 'user/create', component: UserEditPage},
  { path: 'user/edit/:id', component: UserEditPage, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
