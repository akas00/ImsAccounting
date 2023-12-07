import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MultiPrintComponent } from './multiple-voucher-print.component';


const routes: Routes = [
    { path: '', component: MultiPrintComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MultiPrintRoutingModule { }
