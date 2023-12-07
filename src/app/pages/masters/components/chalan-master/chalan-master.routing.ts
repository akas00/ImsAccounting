import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChalanMaserListComponent } from "./chalan-master-list.component";
import { AddChalanComponent } from "./add-chalan-master/add-chalan-master.component";

const routes: Routes = [
    { path: '', component:  ChalanMaserListComponent},
    { path: 'add-chalan', component: AddChalanComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChalanMasterRoutingModule { }