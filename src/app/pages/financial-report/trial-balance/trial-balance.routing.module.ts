import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { TrialBalanceComponent } from './trial-balance.component';

const routes: Routes = [
    { path: '', component: TrialBalanceComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrialBalanceRoutingModule { }