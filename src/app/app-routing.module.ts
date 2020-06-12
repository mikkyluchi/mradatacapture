import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'voter', loadChildren: './voter/voter.module#VoterPageModule' },
  { path: 'newvoter', loadChildren: './newvoter/newvoter.module#NewvoterPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'example-modal', loadChildren: './example-modal/example-modal.module#ExampleModalPageModule' },
  { path: 'newvoter', loadChildren: './newvoter/newvoter.module#NewvoterPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
