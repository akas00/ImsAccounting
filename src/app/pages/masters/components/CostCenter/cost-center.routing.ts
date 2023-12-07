import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CostCenterListComponent } from './costCenterList.component';
import { CostCenterFormComponent } from './costCenterForm.component';

const routes: Routes = [
    { path: '', component: CostCenterListComponent },
    { path: 'add-cost-center', component: CostCenterFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostCenterRoutingModule { }
