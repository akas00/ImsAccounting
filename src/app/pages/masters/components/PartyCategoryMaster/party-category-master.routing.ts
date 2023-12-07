import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PartyCategoryMasterComponent } from './party-category-master.component';

const routes: Routes = [
    { path: '', component: PartyCategoryMasterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartyCategoryMasterRoutingModule { }