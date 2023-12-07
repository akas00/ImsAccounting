import { Routes, RouterModule }  from '@angular/router';

import { TerminalComponent } from './terminal.component';
import { ModuleWithProviders } from '@angular/core';
import { CanActivateTeam } from "../../common/services/permission/guard.service";

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: TerminalComponent,
    children: [
        {path:'terminal',component:TerminalComponent,canActivate: [CanActivateTeam]}
      ]
  }
];

export const TerminalRouting: ModuleWithProviders = RouterModule.forChild(routes);
