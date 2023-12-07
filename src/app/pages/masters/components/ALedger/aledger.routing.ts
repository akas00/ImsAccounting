import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ALedgerComponent } from './ALedger.component';
import { ALedgerTableComponent } from './ALedgerTable.component';
import { PendingChangesGuard } from '../../../../common/services/guard/can-navigate.guard';
import { BankListComponent } from '../Bank/bank-list.component';
import { AccountLedgerComponent } from '../account-ledger/accountLedgerTable.component';

const routes: Routes = [
    {path:'Account',component:ALedgerTableComponent,canDeactivate: [PendingChangesGuard]},
    {path:'AccountList',component:ALedgerTableComponent},
    { path: 'AccountTree', component: AccountLedgerComponent}, 
    {path:'bank',loadChildren:'app/pages/masters/components/Bank/bank.module#BankModule'},
    {path:'chalan-master',loadChildren:'app/pages/masters/components/chalan-master/chalan-master.module#ChalanMaserModule'},
    {path:'subledger-master',loadChildren:'app/pages/masters/components/subledger-master/subledger-master.module#SubLedgerMasterModule'},
    {path:'voucher-series-master',loadChildren:'app/pages/masters/components/Voucher-Series/voucher-series.module#VoucherSeriesModule'},
    {path:'cost-center',loadChildren:'app/pages/masters/components/CostCenter/cost-center.module#CostCenterModule'},
    {path:'cost-center-category',loadChildren:'app/pages/masters/components/CostCenterCategory/cost-center-category.module#CostCenterCategoryModule'},
    {path:'merchant-details',loadChildren:'app/pages/masters/components/MerchantDetails/merchant-details.module#MerchantDetailsModule'},
    {path:'budget-master',loadChildren:'app/pages/masters/components/BudgetMaster/budget-master.module#BudgetMasterModule'},
    {path:'partycategory-master',loadChildren:'app/pages/masters/components/PartyCategoryMaster/party-category-master.module#PartyCategoryMasterModule'}
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AledgerRoutingModule { }
