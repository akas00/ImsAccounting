import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EnableLatePostComponent } from './EnableLatePost.component';
import { LatePostComponent } from './LatePost.component';

const routes: Routes = [
    {path:'',component:LatePostComponent},



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnableVoucherPostRoutingModule { }
