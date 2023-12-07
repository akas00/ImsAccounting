import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyFormComponent } from './companyForm.component';

const routes: Routes = [
    { path: '', component: CompanyFormComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyInfoRoutingModule { }
