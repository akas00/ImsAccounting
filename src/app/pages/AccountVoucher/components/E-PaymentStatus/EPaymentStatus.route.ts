import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EPaymentStatusMasterComponent } from './EPaymentStatusMaster.component';

const routes: Routes = [
    {path:'',component:EPaymentStatusMasterComponent},



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EPaymentStatustRoutingModule { }
