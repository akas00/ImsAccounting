import { Routes, RouterModule, CanActivate } from '@angular/router';
import { dialogRepComponent } from './dialogRep.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
const routes: Routes = [
    {
        path: '',
        component: dialogRepComponent,
        children: []

    }
];

export const routing = RouterModule.forChild(routes);