import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MerchantDetailsFormComponent } from './merchant-details-form.component';

const routes: Routes = [
    { path: '', component: MerchantDetailsFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MerchantDetailsRoutingModule { }