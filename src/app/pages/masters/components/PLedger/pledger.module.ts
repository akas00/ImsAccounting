import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { PLedgerComponent } from "./PLedger.component";
import { SupplierLedgerComponent } from "./SupplierLedger.component";
import { CustomerLedgerComponent } from "./CustomerLedger.component";
import { PartyLedgerRoutingModule } from "./pledger.routing";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { pLedgerTableComponent } from "./PLedgerTable.component";
import { PLedgerservice } from "./PLedger.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PartyLedgerRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule

  ],
  declarations: [
    PLedgerComponent,
    SupplierLedgerComponent,
    CustomerLedgerComponent,
    pLedgerTableComponent
  ],
  providers: [PLedgerservice, TransactionService],
  exports:[PLedgerComponent]

})
export class PartyLedgerModule { }
