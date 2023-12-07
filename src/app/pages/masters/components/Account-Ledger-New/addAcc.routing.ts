import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccNewLedgerComponent } from './AccLedgerTable.component';




const routes: Routes = [
    {path: 'AccountMaster', component: AccNewLedgerComponent}, 
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccNewRoutingModule { }



