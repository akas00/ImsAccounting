import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { VehicleCostTrackingComponent } from './vehicle-cost-tracking.component';
import { LocalPurchaseCostAllocationListComponent } from './localpurchase-costallocation-list.component';

const routes: Routes = [
    { path: '', component: LocalPurchaseCostAllocationListComponent },
    { path: 'add-costallocation', component: VehicleCostTrackingComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LocalPurchaseCostAllocationRoutingModule { }
