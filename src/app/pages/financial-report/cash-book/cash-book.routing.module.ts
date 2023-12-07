import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';

import { CashBookComponent } from './cash-book.component';

const routes: Routes = [
    { path: '', component: CashBookComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CashBookRoutingModule { }