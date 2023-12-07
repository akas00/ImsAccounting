import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BankComponent } from './bank.component';
import { BankListComponent } from './bank-list.component';


const routes: Routes = [
    { path: '', component: BankListComponent },
    { path: 'add-bank', component: BankComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BankRoutingModule { }