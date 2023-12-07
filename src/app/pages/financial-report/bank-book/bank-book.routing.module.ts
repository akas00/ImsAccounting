import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';

import { BankBookComponent } from './bank-book.component';

const routes: Routes = [
    { path: '', component: BankBookComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BankBookRoutingModule { }