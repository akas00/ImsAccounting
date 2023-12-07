import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddSubLedgerComponent } from "./add-subledger-master/add-subledger-master.component";
import { SubLedgerMasterListComponent } from "./subledger-master-list.component";

const routes: Routes = [
    { path: '', component:  SubLedgerMasterListComponent},
    { path: 'add-subledger', component: AddSubLedgerComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubLedgerMasterRoutingModule { }