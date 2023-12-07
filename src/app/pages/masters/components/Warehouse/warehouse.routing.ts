import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseListComponent } from './warehouse-list.component';

const routes: Routes = [
    { path: '', component: WarehouseListComponent },
    {path:'add-warehouse',component:WarehouseComponent}, 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseRoutingModule { }
