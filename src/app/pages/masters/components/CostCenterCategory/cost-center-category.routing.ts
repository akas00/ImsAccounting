import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CostCenterCategoryListComponent } from './costCenterCategoryList.component';
import { CostCentercategoryFormComponent } from './costCenterCategoryForm.component';

const routes: Routes = [
    { path: '', component: CostCenterCategoryListComponent },
    { path: 'add-cost-category-center', component: CostCentercategoryFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostCenterCategoryRoutingModule { }
