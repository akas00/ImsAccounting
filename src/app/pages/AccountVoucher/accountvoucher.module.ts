import { PartyBalanceConfirmationComponent } from './components/party-balance-confirmation/party-balance-confirmation.component';
import { from } from 'rxjs/observable/from';
import { NgModule } from "@angular/core";
import { ExpensesVoucherComponent } from "./components/ExpensesVoucher/expenses-voucher.component";
import { testComponent } from "./components/journal/test";
import { PrefixComponent } from "./../../common/Prefix/prefix.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { Ng2SmartTableModule } from "../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { ModalModule } from "ng2-bootstrap";
import { routing } from "./accountvoucher.routing";
import { AccountVouchers } from "./accountvoucher.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { LoginModule } from "../login/index";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { TrnTranJournalEntryComponent } from "./components/journal/trntran-journal-entry.component";
import { TrnMainJournalEntryComponent } from "./components/journal/trnmain-journal-entry.component";
import { IncomeVoucherComponent } from "./components/IncomeVoucher/income-voucher.component";
import { CreditNoteComponent } from "./components/CreditNote/credit-note.component";
import { DebitNoteComponent } from "./components/DebitNote/debit-note.component";
import { JournalVoucherComponent } from "./components/journal/journal-voucher.component";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { LimitDecimalPlacesModule } from "../../common/directives/limit-decimal.module";
import { ContraVoucherComponent } from "./components/contra/contra-voucher.component";
import { CustomerTrackingComponent } from "./components/IncomeVoucher/CustomerTracking/customerTracking.component";
import { VoucherTrackingPopupModule } from "./components/VoucherTracking/VoucherTracking.module";
import { VoucherPosting } from "./components/voucher-posting/voucher-posting.component";
import { PrintInvoiceComponent } from "../../common/Invoice/print-invoice/print-invoice.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { NgxPaginationModule } from "ngx-pagination";
import { AccountOpeningBalance } from "./components/account-opening-balance/account-opening-balance.component";
import { PartyOpeningBalance } from "./components/party-opening-balance/party-opening-balance.component";
import { BankReconciliationComponent } from "./components/bank-reconciliation/bank-reconciliation.component";
import { DebitNoteRateAdjustmentComponent } from "./components/debit-note-rate-adjustment/debit-note-rate-adjustment.component";
import { BillTrackingAmendmentComponent } from "./components/bill-tracking-amendment/bill-tracking-amendment.component";
import {BillTrackingAmendmentService} from './components/bill-tracking-amendment/bill-tracking-amendment.service'
import { ReportFilterModule } from "../../common/popupLists/report-filter/report-filter.module";
import { IMSDatePickerModule } from "../../common/date-picker/date-picker.module";
import { CapitalVoucherComponent } from "./components/capital-voucher/capital-voucher.component";
import { additionalCostDetail } from "../Purchases/components/AdditionalCost/additionalCost.component";
 

import { CostingDetailComponent } from "../Purchases/components/AdditionalCost/costingDetail.component";
import { PaymentSingleComponent } from "./components/payment-single/payment-single.component";
import { DrCrFooterWithVATIncluded } from "./components/DebitNote/FooterwithIncludedVAT.component";
import { TabsComponent } from "../Purchases/components/AdditionalCost/tabs";
import { ImportDocumentDetailsComponent } from "../Purchases/components/AdditionalCost/ImportDocumentDetails.component";
import { VoucherRenumberingComponent} from "./components/voucher-renumbering/voucher-renumbering.component";
import { PaymentCollection } from "./components/PaymentCollection/PaymentCollection.component";
import {  MasterAdditionalComponent } from "../Purchases/components/AdditionalCost/masterPageAdditional.component";
import { MultipleSeriesComponent } from "./components/MultipleSeries/MultipleSeries.component";
import { PostDirectoryComponent } from "./components/PostDirectory/postdirectory.component";
import { PartyReconciliationComponent } from './components/party-reconciliation/party-reconciliation.component';
import { NepaliDatePickerModule } from '../../common/nepali-date-picker/nepali-date-picker.module';
import { CellPayVoucherComponent } from './components/CellPayVoucher/CellPay-Voucher.component';
import { ReverseCreditNoteComponent } from './components/ReverseCreditNote/reverse-credit-note.component';
import { ReverseEntryModule } from '../../common/popupLists/reverse-entry-popup/reverse-entry.module';
import { PurchaseDetailComponent } from '../Purchases/components/AdditionalCost/purchaseDetail.component';
import { MasterNewAdditionalComponent } from '../Purchases/components/NewAdditionalCost/newmasterPageAdditional.component';
import { newadditionalCostDetail } from '../Purchases/components/NewAdditionalCost/newadditionalCost.component';
import { NewCostingDetailComponent } from '../Purchases/components/NewAdditionalCost/newcostingDetail.component';
import { NewPurchaseDetailComponent } from '../Purchases/components/NewAdditionalCost/newpurchaseDetail.component';
import { newIndividualCostDetail } from '../Purchases/components/NewAdditionalCost/newIndividualCost.component ';
import { AddPurchaseInvoiceComponent } from '../Purchases/components/purchaseinvoice/AddPurchaseInvoice';
import { VehicleCostTrackingService } from './components/vehicle-cost-tracking/vehicle-cost-tracking.service';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';
import { CashCollection } from './components/CashCollection/cashcollection.component';


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
    LimitDecimalPlacesModule.forRoot(),
    VoucherTrackingPopupModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    NgxPaginationModule,
    ReportFilterModule.forRoot(),
    IMSDatePickerModule.forRoot(),
    NepaliDatePickerModule,
    ReverseEntryModule.forRoot(),
    FileUploaderPopupModule.forRoot()




  ],
  declarations: [
    AccountVouchers,
    PrefixComponent,
    TrnTranJournalEntryComponent,
    TrnMainJournalEntryComponent,
    DebitNoteComponent,
    testComponent,
    IncomeVoucherComponent,
    ExpensesVoucherComponent,
    CreditNoteComponent,
    JournalVoucherComponent,
    ContraVoucherComponent,
    AccountOpeningBalance,
    PartyOpeningBalance,
    CustomerTrackingComponent,
    BankReconciliationComponent,
    VoucherPosting,
    DebitNoteRateAdjustmentComponent,
    PaymentSingleComponent,
    BillTrackingAmendmentComponent,
    CapitalVoucherComponent,
    additionalCostDetail,
    MasterAdditionalComponent,
    MasterNewAdditionalComponent,
    CostingDetailComponent, PurchaseDetailComponent,
    newadditionalCostDetail,
    DrCrFooterWithVATIncluded,
    TabsComponent,
    ImportDocumentDetailsComponent,
    VoucherRenumberingComponent,PaymentCollection,MultipleSeriesComponent,IncomeVoucherComponent,PostDirectoryComponent,
    PaymentCollection,
    PartyBalanceConfirmationComponent,
    PartyReconciliationComponent,
    CellPayVoucherComponent,
    ReverseCreditNoteComponent,
    NewCostingDetailComponent,
    NewPurchaseDetailComponent,
    newIndividualCostDetail,
    AddPurchaseInvoiceComponent,
    CashCollection,
    
    
  ],
  providers: [CanActivateTeam, TransactionService,PrintInvoiceComponent,BillTrackingAmendmentService, VehicleCostTrackingService],

})
export class AccountVouchersModule {}
