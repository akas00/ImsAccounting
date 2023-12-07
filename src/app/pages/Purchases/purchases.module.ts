import { NgModule } from '@angular/core';
import { TransactionService } from "./../../common/Transaction Components/transaction.service";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../node_modules/ng2-smart-table/src/ng2-smart-table.module';
import { routing } from './purchases.routing';
import { Purchases } from './purchases.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service'
import { ModalModule } from 'ng2-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AccountVouchersModule } from "../AccountVoucher/accountvoucher.module";
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete'
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';
import { DynamicFilterOptionModule } from '../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.module';
import { DeliveryOrderComponent } from '../../common/Transaction Components/delivery-order.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PurchaseService } from './components/purchase.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { DebitNoteItemBaseListComponent } from './components/DebitNoteItemWise/debitnote-itembase-list.component';
import { DebitNoteItemBaseComponent } from './components/DebitNoteItemWise/debitnote-itembase.component';
import { AddPurchaseInvoiceComponent } from './components/purchaseinvoice/AddPurchaseInvoice';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NguiAutoCompleteModule,
    ModalModule.forRoot(),
    // LoginModule,
    AccountVouchersModule,
    AutoCompleteModule,
    TransactionModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    DynamicFilterOptionModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    NgxPaginationModule
  ],
  declarations: [
    Purchases,
    DebitNoteItemBaseListComponent,
    DebitNoteItemBaseComponent,

    DeliveryOrderComponent,
    // AddPurchaseInvoiceComponent
   // InvoiceListComponent,

  ],
  providers: [
    CanActivateTeam, TransactionService,PurchaseService
  ],
  exports: []
})
export class PurchasesModule {
}
