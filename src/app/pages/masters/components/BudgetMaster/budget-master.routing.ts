import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BudgetMasterComponent } from './budget-master.component';
import { AddBudgetMasterComponent } from './add-budget-master.component';

const routes: Routes = [
    { path: '', component: BudgetMasterComponent },
    { path: 'addbudget', component: AddBudgetMasterComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BudgetMasterRoutingModule { }