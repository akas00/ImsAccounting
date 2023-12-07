import { NgModule } from '@angular/core';
import { TrnMainDispatchComponent } from "./components/dispatch/trnmain-dispatch.component";
import { TransactionService } from "./../../common/Transaction Components/transaction.service";
import { TrnMainStockIssueComponent } from "./components/stock-issue/trnmain-stock-issue.component";
import { LoginModule } from "./../login/login.module";
import { PurchasesModule } from "./../Purchases/purchases.module";
import { StockIssueComponent } from "./components/stock-issue/stock-issue.component";
import { BranchInListComponent } from "./components/branch-in/branch-in-list.component";
import { BranchInComponent } from "./components/branch-in/branch-in.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2SmartTableModule } from '../../node_modules/ng2-smart-table/src/ng2-smart-table.module';
import { ModalModule } from 'ng2-bootstrap';
import { routing } from './inventory.routing';
import { Inventory } from './inventory.component';
import { MockMasterRepo } from "../../common/repositories/MockmasterRepo.service";
import { CanActivateTeam } from '../../common/services/permission/guard.service';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdRadioModule } from '@angular/material';

import { StockIssueListComponent } from './components/stock-issue/stock-issue-list.component';
import { BranchOutListComponent } from "./components/branch-out/branch-out-list.component";
import { BranchOutComponent } from "./components/branch-out/branch-out.component";
import { DispatchListComponent } from "./components/dispatch/dispatch-list.component";
import { DispatchComponent } from "./components/dispatch/dispatch.component";
import {AutoCompleteModule,AutoComplete} from 'primeng/components/autocomplete/autocomplete'
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TrnMainBranchComponent } from "../../common/Transaction Components/trnmain-branch.component";
import { DispatchInListComponent } from "./components/dispatch-in/dispatch-in-list.component";
import { DispatchInComponent } from "./components/dispatch-in/dispatch-in.component";
import { consumptionEntryComponent } from './components/consumption/consumptionEntry.component';
import { consumptionTableComponent } from './components/consumption/consumptionTable.component';
import { StockSettlementComponent } from './components/stock-settlement/stockSettlement.component';
import { StockSettlementTableComponent } from './components/stock-settlement/stockSettlementTable.component';
import { JobCardEntryComponent } from './components/JobCardEntry/JobCardEntry.component';
import { JobCardEntryTableComponent } from './components/JobCardEntry/JobCardEntryTable.component';
import { CalendarModule } from "primeng/components/calendar/calendar";
import { OpeningStockEntryComponent } from './components/openingStockEntry/openingStockEntry';
import { NgxPaginationModule } from 'ngx-pagination';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgaModule,
    routing,
    ModalModule.forRoot(),
    Ng2SmartTableModule,
    PurchasesModule,
    LoginModule,
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
    // NoopAnimationsModule,
    //  BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule,
    MdInputModule, MdSelectModule, MdRadioModule,,TransactionModule,AutoCompleteModule,CalendarModule
  ],
  declarations: [
    Inventory, StockIssueListComponent, StockIssueComponent, TrnMainStockIssueComponent, BranchInListComponent, 
    BranchInComponent, BranchOutListComponent, BranchOutComponent, DispatchListComponent,
    DispatchComponent, TrnMainDispatchComponent,DispatchInListComponent,DispatchInComponent,consumptionEntryComponent,
    consumptionTableComponent,StockSettlementComponent,StockSettlementTableComponent,JobCardEntryComponent,JobCardEntryTableComponent
 ,OpeningStockEntryComponent,
 
  ],

  providers: [
    CanActivateTeam, TransactionService
  ]
})
export class InventoryModule {
}
