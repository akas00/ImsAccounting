import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { VoucherSeriesFormComponent} from './voucher-series-form.component';
import { VoucherSeriesListComponent } from './voucher-series-list.component';

const routes: Routes = [
    { path: '', component: VoucherSeriesListComponent },
    { path: 'add-voucher-series', component: VoucherSeriesFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoucherSeriesRoutingModule { }