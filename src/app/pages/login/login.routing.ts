import { CanActivateTeam } from './../../common/services/permission/guard.service';
import { Routes, RouterModule }  from '@angular/router';

import { Login } from './login.component';
import { ModuleWithProviders } from '@angular/core';
import {SearchUserComponent} from './searchUser.component';
import {SendEmailComponent} from './sendEmail.component';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Login,
    children:[
       { path: 'SearchUser', component: SearchUserComponent },
       { path: 'SendEmail', component: SendEmailComponent, canActivate: [CanActivateTeam] },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
