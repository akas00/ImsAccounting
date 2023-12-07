import { AdditionalCostService } from "./../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { VoucherDateComponent } from "./voucher-date.component";
import { TrnMainVoucherEntryComponent } from "./trnmain-voucher-entry.component";
import { TrnTranVoucherEntryComponent } from "./trntran-voucher-entry.component";
import { NgModule } from "@angular/core";
import { TrnMainPurchaseComponent } from "./trnmain-purchase.component";
import { ProductInsertComponent } from "./ProductInsert";
import { TrnMainBranchComponent } from "./trnmain-branch.component";
import { InvoiceComponent } from "../Invoice/invoice.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { AutoCompleteModule } from "primeng/components/autocomplete/autocomplete";
import { NguiAutoCompleteModule } from "@ngui/auto-complete/dist";
import { TrnMainNoteItemBaseComponent } from "./trnmain-note-itembase-entry.component";
import { FocusDirective } from "./focus.directive";
import { SubFocusDirective } from "./sub-ledger-focus.directive";
import { ModalModule } from "ng2-bootstrap";
import { SalesModeComponent } from "./sales-mode.component";
import { VATNoEntry } from "./VATnoEntry.component";
import { CreditNoteModeComponent } from "./creditnotemodes";
import { PurchasePrintComponent } from "./../Invoice/purchasePrint.component";
import { InvoicePrintComponent } from "./../Invoice/invoicePrint.component";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "../../node_modules/ng2-search-filter";
import { popupListModule } from "../popupLists/popuplist.module";
import { TrnMainParametersComponent } from "./TrnMainParameters";
import { VoucherMessageRemarksComponent } from "./voucher-message-remarks.component";
import { VoucherMasterActionComponent } from "./voucher-master-action.component";
import { VoucherMasterTogglerComponent } from "./voucher-master-toggler.component";
import { VoucherTotalAreaComponent } from "./voucher-total-area.component";
import { InventoryParametersComponent } from "./InventoryParameters";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { GenericPopupGridModule } from "../popupLists/generic-grid/generic-popup-grid.module";
import { FileUploaderPopupModule } from "../popupLists/file-uploader/file-uploader-popup.module";
import { LimitDecimalPlacesModule } from "../directives/limit-decimal.module";
import { AccountMasterActionComponent } from "./account-master-action.component";
import { VoucherSidebarBillDetailComponent } from "./voucher-sidebar-billdetail.component";
import { OpeningBalanceActionComponent } from "./opening-balance-action.component";
import { AccountVoucherSummaryComponent } from "./account-voucher-summary.component";
//import { VoucherTrackingComponent } from "../../pages/AccountVoucher/components/VoucherTracking/VoucherTracking.component";
import { PartyOpeningDetailsPopUpComponent } from "../popupLists/party-opening-details-popup/party-opening-details-popup.component";
import { VoucherTrackingComponent } from "../../pages/AccountVoucher/components/VoucherTracking/VoucherTracking.component";
import { VoucherTrackingPopupModule } from "../../pages/AccountVoucher/components/VoucherTracking/VoucherTracking.module";
import { PrintInvoiceComponent } from "../Invoice/print-invoice/print-invoice.component";
import { InvoiceListComponent } from "./invoice-list.component";
import { IMSDatePickerModule } from "../date-picker/date-picker.module";
import { AccountVouchersModule } from "../../pages/AccountVoucher/accountvoucher.module";
import { OpeningBalanceTrackingComponent } from "../../pages/AccountVoucher/components/PartyOpeningBalanceTracking/PartyopeningTracking.component";
import { TrnTranNoteEntryComponent } from "./trntran-note-entry.component";
import { FormatToDecimalModule } from "../directives/format-decimal.module";
import { NepaliDatePickerModule } from "../nepali-date-picker/nepali-date-picker.module";
import { ReverseEntryModule } from "../popupLists/reverse-entry-popup/reverse-entry.module";
import { PriceCalculatorPopupComponent } from "./pricecalculator/price-calculatorpopup.component";
import { ImportPurchaseDetailsModule } from "../popupLists/import-purchase-details/import-purchase-details.module";
import { SearchPipe } from "./search.pipe";
// import { PopupitemlistComponent } from './PopupItemList.componet';

// import { PopupitemlistComponent } from './PopupItemList.componet';
@NgModule({
  imports: [
    NgaModule,
    AutoCompleteModule,
    NguiAutoCompleteModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    popupListModule,
    Ng2SearchPipeModule,
    Ng2SmartTableModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    LimitDecimalPlacesModule.forRoot(),
    VoucherTrackingPopupModule.forRoot(),
    IMSDatePickerModule.forRoot(),
    FormatToDecimalModule.forRoot(),
    NepaliDatePickerModule,
    ReverseEntryModule.forRoot(),
    ImportPurchaseDetailsModule.forRoot(),
        //AccountVouchersModule

  ],
  declarations: [
    TrnMainPurchaseComponent,
    VoucherDateComponent,
    ProductInsertComponent,
    TrnMainBranchComponent,
    FocusDirective,
    InvoiceComponent,
    TrnTranVoucherEntryComponent,
    TrnTranNoteEntryComponent,
    TrnMainVoucherEntryComponent,
    TrnMainNoteItemBaseComponent,
    SubFocusDirective,
    VATNoEntry,
    SalesModeComponent,
    CreditNoteModeComponent,
    PurchasePrintComponent,
    InvoicePrintComponent,
    FocusDirective,
    VoucherMessageRemarksComponent,
    VoucherMasterTogglerComponent,
    VoucherMasterActionComponent,
    TrnMainParametersComponent,
    VoucherTotalAreaComponent,
    InventoryParametersComponent,
    AccountMasterActionComponent,
    VoucherSidebarBillDetailComponent,
    OpeningBalanceActionComponent,
    AccountVoucherSummaryComponent,
    PartyOpeningDetailsPopUpComponent,
    InvoiceListComponent,
    OpeningBalanceTrackingComponent,
    PriceCalculatorPopupComponent,SearchPipe
  ],
  exports: [
    OpeningBalanceTrackingComponent,
    TrnMainPurchaseComponent,
    VoucherDateComponent,
    ProductInsertComponent,
    TrnMainBranchComponent,
    TrnMainParametersComponent,
    TrnTranVoucherEntryComponent,
    TrnTranNoteEntryComponent,
    TrnMainVoucherEntryComponent,
    TrnMainNoteItemBaseComponent,
    FocusDirective,
    SubFocusDirective,
    SalesModeComponent,
    VATNoEntry,
    CreditNoteModeComponent,
    PurchasePrintComponent,
    InvoicePrintComponent,
    VoucherMessageRemarksComponent,
    VoucherMasterTogglerComponent,
    VoucherMasterActionComponent,
    VoucherTotalAreaComponent,
    InventoryParametersComponent,
    AccountMasterActionComponent,
    VoucherSidebarBillDetailComponent,
    OpeningBalanceActionComponent,
    AccountVoucherSummaryComponent,
    PartyOpeningDetailsPopUpComponent,
    InvoiceListComponent
  ],
  providers: [AdditionalCostService]
})
export class TransactionModule {}
