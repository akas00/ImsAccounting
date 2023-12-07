import { Routes, RouterModule } from '@angular/router';
import { LedgerVoucherComponent } from './ledger-voucher.component';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';

const routes: Routes = [
    { path: '', component: LedgerVoucherComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LedgerVoucherRoutingModule { }