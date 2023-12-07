import { NgModule } from "@angular/core";
import { testComponent } from "./components/journal/test";
import { PrefixComponent } from "./../../common/Prefix/prefix.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
//import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2SmartTableModule } from "../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { ModalModule } from "ng2-bootstrap";

import { routing } from "./accountvoucher.routing";
import { AccountVouchers } from "./accountvoucher.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { LoginModule } from "../login/index";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service"; 
import { CreditNoteComponent } from "./components/CreditNote/credit-note.component";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { LimitDecimalPlacesModule } from "../../common/directives/limit-decimal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    LoginModule,
    TransactionModule,
    GenericPopupGridModule.forRoot(),
    LimitDecimalPlacesModule.forRoot()
  ],
  declarations: [
    AccountVouchers, 
    PrefixComponent,  
    testComponent, 
    CreditNoteComponent 
  ],
  providers: [CanActivateTeam, TransactionService],
  exports: [PrefixComponent]
})
export class CreditNoteVouchersModule {}
