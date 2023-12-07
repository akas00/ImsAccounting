import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";

import { BudgetMasterRoutingModule } from "./budget-master.routing";
import { BudgetMasterComponent } from "./budget-master.component";
import { AddBudgetMasterComponent } from "./add-budget-master.component";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";
import { NepaliDatePickerModule } from "../../../../common/nepali-date-picker/nepali-date-picker.module";
import { SearchPipe} from "./search.pipe";
import { ContextMenuModule } from "ngx-contextmenu";
import { ContextmenuComponent } from "../../../Reports/context-menu/context-menu.component";
import { AccountGroupPopupGridModule } from "../../../../common/popupLists/AGroupPopup/account-group-popup-grid.module";
import { TreeViewAccService } from "../Account-Ledger-New/AccLedger.service";




@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    AccountGroupPopupGridModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    BudgetMasterRoutingModule,
    TransactionModule,
    NepaliDatePickerModule,
    // ContextMenuModule
    
  ],
  declarations: [
    // ContextmenuComponent,
    BudgetMasterComponent,
    AddBudgetMasterComponent,
    SearchPipe,
    ],
    providers:[TreeViewAccService]
})
export class BudgetMasterModule {
 }