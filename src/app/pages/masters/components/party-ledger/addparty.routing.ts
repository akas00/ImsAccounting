import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PartyLedgerComponent } from './partyLedgerTable.component';



const routes: Routes = [
    {path: 'PartyTree', component: PartyLedgerComponent}, 
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartyRoutingModule { }



