import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ProfitLossComponent } from './profit-loss.component';

const routes: Routes = [
    { path: '', component: ProfitLossComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfitLossRoutingModule { }