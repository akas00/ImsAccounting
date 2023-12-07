import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PLedgerComponent } from './PLedger.component';
import { SupplierLedgerComponent } from './SupplierLedger.component';
import { CustomerLedgerComponent } from './CustomerLedger.component';

const routes: Routes = [
    { path: 'Supplier', component: PLedgerComponent },
    { path: 'SupplierList', component: SupplierLedgerComponent },
    { path: 'Customer', component: PLedgerComponent },
    { path: 'CustomerList', component: CustomerLedgerComponent },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartyLedgerRoutingModule { }
