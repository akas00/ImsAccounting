import { Routes, RouterModule, CanActivate } from '@angular/router';
import { BranchInComponent } from "./components/branch-in/branch-in.component";
import { BranchInListComponent } from "./components/branch-in/branch-in-list.component";
import { StockIssueComponent } from "./components/stock-issue/stock-issue.component";
import { Inventory } from './inventory.component';
import { StockIssueListComponent } from './components/stock-issue/stock-issue-list.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { BranchOutListComponent } from "./components/branch-out/branch-out-list.component";
import { BranchOutComponent } from "./components/branch-out/branch-out.component";
import { DispatchListComponent } from "./components/dispatch/dispatch-list.component";
import { DispatchComponent } from "./components/dispatch/dispatch.component";
import { DispatchInListComponent } from "./components/dispatch-in/dispatch-in-list.component";
import { DispatchInComponent } from "./components/dispatch-in/dispatch-in.component";
import { consumptionEntryComponent } from './components/consumption/consumptionEntry.component';
import { consumptionTableComponent } from './components/consumption/consumptionTable.component';
import { StockSettlementComponent } from './components/stock-settlement/stockSettlement.component';
import { StockSettlementTableComponent } from './components/stock-settlement/stockSettlementTable.component';
import { JobCardEntryComponent } from './components/JobCardEntry/JobCardEntry.component';
import { JobCardEntryTableComponent } from './components/JobCardEntry/JobCardEntryTable.component';
import { OpeningStockEntryComponent } from './components/openingStockEntry/openingStockEntry';
import { StockSettlementApprovalComponent } from './components/stock-settlement-approval/stockSettlement.component';
const routes: Routes = [
    {
        path: '',
        component: Inventory,
        children: [
           
            { path: 'add-stock-issue', component: StockIssueComponent, canActivate: [CanActivateTeam] },
            { path: 'branch-in', component: BranchInListComponent, canActivate: [CanActivateTeam] },
            { path: 'add-branch-in', component: BranchInComponent, canActivate: [CanActivateTeam] },
            { path: 'branch-out', component: BranchOutListComponent, canActivate: [CanActivateTeam] },
            { path: 'add-branch-out', component: BranchOutComponent, canActivate: [CanActivateTeam] },
            { path: 'dispatch', component: DispatchListComponent, canActivate: [CanActivateTeam] },
            { path: 'dispatch/add-dispatch', component: DispatchComponent, canActivate: [CanActivateTeam] },
             { path: 'dispatchIn', component: DispatchInListComponent, canActivate: [CanActivateTeam] },
            { path: 'dispatch/add-dispatchIn', component: DispatchInComponent, canActivate: [CanActivateTeam] },
              { path: 'productionout', component: DispatchListComponent, canActivate: [CanActivateTeam] },
              { path: 'ConsumptionEntry', component: consumptionEntryComponent },
              { path: 'Consumption', component: consumptionTableComponent, canActivate: [CanActivateTeam] },
              { path: 'StockSettlementEntry', component: StockSettlementComponent },
              { path: 'StockSettlementEntryApproval', component: StockSettlementComponent },
              { path: 'JobCardEntry', component: JobCardEntryComponent },
              { path: 'JobCard', component: JobCardEntryTableComponent, canActivate: [CanActivateTeam] },
              { path: 'openingstockentry', component: OpeningStockEntryComponent, canActivate: [CanActivateTeam] },
        ]

    }
];

export const routing = RouterModule.forChild(routes);