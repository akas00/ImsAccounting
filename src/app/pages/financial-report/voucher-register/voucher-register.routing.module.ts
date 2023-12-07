import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { VoucherRegisterComponent } from './voucher-register.component';

const routes: Routes = [
    { path: '', component: VoucherRegisterComponent,canActivate: [CanActivateTeam]},
   



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoucherRegisterRoutingModule { }