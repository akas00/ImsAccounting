import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgaModule } from "../../../../theme/nga.module";
import { AledgerRoutingModule } from "./aledger.routing";
import { ALedgerComponent } from "./ALedger.component";
import { ALedgerTableComponent } from "./ALedgerTable.component";
import { PendingChangesGuard } from "../../../../common/services/guard/can-navigate.guard";
import { AccountGroupPopupGridModule } from "../../../../common/popupLists/AGroupPopup/account-group-popup-grid.module";
import { PLedgerservice } from "../PLedger/PLedger.service";
import { PartyLedgerModule } from "../PLedger/pledger.module";
import { ModalModule } from "ng2-bootstrap";
import { BankModule } from "../Bank/bank.module";
import { AccountLedgerComponent } from "../account-ledger/accountLedgerTable.component";
import { AddLedgerComponent } from "../account-ledger/addLedger.component";
import { addGrpComponent } from "../account-ledger/addSubgrps.component";
import { LedgComponent } from "../account-ledger/addLedg.component";
import {TreeModule} from "angular-tree-component";
import { ContextMenuModule } from "ngx-contextmenu";
import { PartyModule } from "../party-ledger/addparty.module";
import { AccNewModule } from "../Account-Ledger-New/addAcc.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AledgerRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    AccountGroupPopupGridModule.forRoot(),
    PartyLedgerModule,
    ModalModule.forRoot(),
    BankModule,TreeModule,ContextMenuModule,
    PartyModule,
    AccNewModule,
    GenericPopupGridModule.forRoot(),
  ],
  declarations: [
    ALedgerComponent,
    ALedgerTableComponent,AccountLedgerComponent,AddLedgerComponent,addGrpComponent,LedgComponent
  ],
  providers:[PendingChangesGuard]
})
export class AledgerModule { }
