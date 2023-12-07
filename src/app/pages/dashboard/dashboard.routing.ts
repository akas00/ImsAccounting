import { Routes, RouterModule }  from '@angular/router';
import {CanActivateTeam} from '../../common/services/permission/guard.service'
import { Dashboard } from './dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { fiscalyearComponent } from './fiscalyear/fiscalyear.component';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'dashboard', component: Dashboard },
    
    ]
  },
 
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
