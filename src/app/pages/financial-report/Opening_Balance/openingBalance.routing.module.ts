import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import {OpeningBalanceComponent} from './openingBalance.component';

const routes: Routes = [
    { path: '', component: OpeningBalanceComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpeningBalanceRoutingModule { }