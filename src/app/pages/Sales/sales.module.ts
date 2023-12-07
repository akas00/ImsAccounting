import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { Ng2SmartTableModule } from "../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { routing } from "./sales.routing";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { ModalModule } from "ng2-bootstrap";
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { AccountVouchersModule } from "../AccountVoucher/accountvoucher.module";
import { CreditNoteItemBaseComponent } from "./components/CreditNoteItemWise/creditnote-itembase.component";
import { popupListModule } from "../../common/popupLists/popuplist.module";
import { AddSalesInvoiceComponent } from "./components/salesinvoice/AddSalesInvoices";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module"; 
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploaderPopupModule } from "../../common/popupLists/file-uploader/file-uploader-popup.module";
import { Sales } from "./sales.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule, 
    ModalModule.forRoot(),
    TransactionModule,
    AccountVouchersModule,
    popupListModule,
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot()
  ],
  declarations: [
    Sales,
    CreditNoteItemBaseComponent, 
    AddSalesInvoiceComponent 
  ],
 
  providers: [CanActivateTeam, TransactionService]
})
export class SalesModule {}
