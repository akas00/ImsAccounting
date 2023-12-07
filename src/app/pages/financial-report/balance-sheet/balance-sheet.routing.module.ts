import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { BalanceSheetComponent } from './balance-sheet.component';

const routes: Routes = [
    { path: '', component: BalanceSheetComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BalanceSheetRoutingModule { }