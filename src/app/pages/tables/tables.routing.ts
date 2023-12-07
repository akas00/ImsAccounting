import { Routes, RouterModule }  from '@angular/router';

import { Tables } from './tables.component';
import { BasicTables } from './components/basicTables/basicTables.component';
import { SmartTables } from './components/smartTables/smartTables.component';
import {CanActivateTeam} from '../../common/services/permission/guard.service';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Tables,
    children: [
      { path: 'basictables', component: BasicTables,canActivate:[CanActivateTeam] },
      { path: 'smarttables', component: SmartTables }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
