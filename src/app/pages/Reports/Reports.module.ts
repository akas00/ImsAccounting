import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { CanActivateTeam } from '../../common/services/permission/guard.service'
import { ModalModule } from 'ng2-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { Ng2SearchPipeModule } from '../../node_modules/ng2-search-filter';
import { routing } from './Reports.routing';
import { ReportsComponent } from './Reports.component';
import { ReportMain } from './components/ReportMain/ReportMain';
import { MasterDialogReport } from '../ReportDialogs/MasterDialogReport/MasterDialogReport';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { GstSalesSummary } from '../ReportDialogs/GST-Sales-Summary/gst-sales-summary.component';
import { GstPurchaseSummary } from '../ReportDialogs/GST-Purchase-Summary/gst-purchase-summary.component';
import { AgingPayableReport } from '../ReportDialogs/aging-payable/aging-payable.component';
import { AgingReceivableReport } from '../ReportDialogs/aging-receivable/aging-receivable.component';
import { AccountPayableReport } from '../ReportDialogs/account-payable/account-payable.component';
import { AccountReceivableReport } from '../ReportDialogs/account-receivable/account-receivable.component';
import { PurchaseBookReport } from '../ReportDialogs/PurchaseBookReport/PurchaseBookReport';
import { CashBookReport } from '../ReportDialogs/CashBookReport/cashbookreport.component';
import { SalesBookReport } from '../ReportDialogs/SalesBookReport/salesbookreport';
import { JournalBook } from '../ReportDialogs/JournalBook/journalbook.component';
import { DueVoucherReport } from '../ReportDialogs/DueVoucherReport/duevoucherreport';
import { CreditorsReport } from '../ReportDialogs/Creditors Report/creditorsreport.component';
import { DebtorsReport } from '../ReportDialogs/Debtors Report/debtorsreport.component';
import { PartyLedger } from '../ReportDialogs/PartyLedger/partyLedger.component';
import { DebtorsAgingReport } from '../ReportDialogs/debotrs-aging-report/debtors-aging-report.component';
import { CreditorsAgingReport } from '../ReportDialogs/creditors-aging-report/creditors-aging-report.component';
import { DebtorsOutstandingReport } from '../ReportDialogs/debtors-outstanding-report/debtors-outstanding-report.component';
import { CreditorsOutstandingReport } from '../ReportDialogs/creditors-outstanding-report/creditors-outstanding-report.component';
import { SummaryPartyLedger } from '../ReportDialogs/SummaryPartyLedger/summary-party-ledger.component';
import TreeModule from 'angular-tree-component';
import { SummaryLedgerReport } from '../ReportDialogs/SummaryLedgerReport/summaryledgerreport.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DateFilters } from '../ReportDialogs/DateFilters/date-filters.component';
import { AccountLedgerReport } from '../ReportDialogs/AccountLedgerReport/account-ledger-report.component';
import { PartyLedgerReport } from '../ReportDialogs/PartyLedgerReport/party-ledger-report.component';
import { CostcenterFilters } from '../ReportDialogs/costcenter-filter/costcenter-filters.component';
import { DebitNoteRegisterReportComponent } from '../ReportDialogs/Debit-Note-Register-Report/debitnote-register-report.component';
import { VATpurchaseRegisterReportComponent } from '../ReportDialogs/VAT-Purchase-Register-Report/vat-purchase-register-report.component';
import { OneLakhAbovePURCHASEreportComponent } from '../ReportDialogs/one-lakh-above-PURCHASE-report/one-lakh-above-PURCHASE-report.component';
import { OneLakhAboveSALESreportComponent } from '../ReportDialogs/One-Lakh-Above-SALES-Report/one-lakh-above-SALES-report.component';
import { ReportFilterService } from '../../common/popupLists/report-filter/report-filter.service';
import { ReportMainService } from './components/ReportMain/ReportMain.service';
import { DivisionComponent } from '../ReportDialogs/division/division.component';
import { CostcenterList } from '../ReportDialogs/costcenter-list/costcenter-list.component';
import { AreaList } from '../ReportDialogs/area-list/area-list.component';
import { AreaFilters } from '../ReportDialogs/area-filters/area-filters.component';
import { AccountList } from '../ReportDialogs/account-list/account-list.component';
import { AccountFilters } from '../ReportDialogs/account-filters/account-filters.component';
import { VoucherRegister } from '../ReportDialogs/voucher-register-report/voucher-register-report.component';
import { CashBankBookReport } from '../ReportDialogs/CashAndBankBookReport/cash-and-bank-book-report.component';
import { DayBookReport } from '../ReportDialogs/DayBookReport/day-book-report.component';
import { SubLedgerReport } from '../ReportDialogs/SubLedgerReport/sub-ledger-report.component';
import { ContextmenuComponent } from './context-menu/context-menu.component';
import { SubLedgerAcbaseReport } from '../ReportDialogs/SubLedgerAcbaseReport/sub-ledger-acbase-report.component';
import { TrialBalanceReport } from '../ReportDialogs/Trial-Balance-Report/trial-balance-report.component';
import { AdditionalCostItemwiseReport } from '../ReportDialogs/AdditionalCost-Itemwise-Report/additionalcost-itemwise-report.component';
import { AdditionalCostVoucherwiseReport } from '../ReportDialogs/AdditionalCost-Voucherwise-Report/additionalcost-voucherwise-report.component';
import { NepaliDatePickerComponent } from '../../common/nepali-date-picker/nepali-date-picker.component';
import { NepaliDatePickerModule } from '../../common/nepali-date-picker/nepali-date-picker.module';
import { SalesReturnSummaryReport } from '../ReportDialogs/SalesReturnSummaryReport/salesreturn-summary-report.component';
import { SalesReturnSummaryRetailerReport } from '../ReportDialogs/SalesReturnSummaryRetailerReport/salesreturnsummary-retailerreport.component';
import { SalesReturnReportDetail } from '../ReportDialogs/SalesReturnReportDetail/salesreturn-reportdetail.component';
import { StockValuationReport } from '../ReportDialogs/StockValuationReport/stock-valuation-report.component';
import { StockLedgerReportAccount } from '../ReportDialogs/StockLedgerReportAcc/stock-ledger-report-account.component';
import { StockSummaryReportAccount } from '../ReportDialogs/StockSummaryReportAccount/stocksummary-report-account.component';
import { CurrentStockWarehousWiseReportAccount } from '../ReportDialogs/CurrentStockWarehousewiseReportAccount/currentstock-warehousewisereport-account.component';
import { StockAbcAnalysisReportAccount } from '../ReportDialogs/StockAbcAnalysisReportAccount/stockabc-analysisreport-account.component';
import { ConsolidatedTrialBalanceReport } from '../ReportDialogs/Consolidated-Trial-Report/consolidated-trial-balance-report.component';
import { ProfitLossReport } from '../ReportDialogs/ProfitLossReport/profit-loss-report.component';
import { BalanceSheetReport } from '../ReportDialogs/BalanceSheetReport/balance-sheet-report.component';
import { TDSReport } from '../ReportDialogs/TDS Report/tds-report.comnponent';
import { ConsolidatedBalanceSheetReport } from '../ReportDialogs/Consolidated-Balance-Sheet-Report/consolidated-balance-sheet-report.component';
import { ConsolidatedProfitLossReport } from '../ReportDialogs/Consolidated-Profit&Loss-Report/consolidated-profit-loss-report.component';
import { BillTrackingReport } from '../ReportDialogs/BillTrackingReport/billtracking-report.component';
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { CrediotrsBillTrackingReport } from '../ReportDialogs/CreditorsBillTrackingReport/creditors-billtracking-report.component';
import { PostDatedChequeVoucherReport } from '../ReportDialogs/PostDatedChequeVoucherReport/post-dated-chequereport.component';
import { MonthlySalesPaymentReport } from '../ReportDialogs/MonthlySalesPaymentReport/monthly-sales-payement-report.component';
import { LocalPurchaseCostAllocationReport } from '../ReportDialogs/LocalPurchasecost-allocation-report/localpurchasecost-allocation-report.component';
import { ActualVsBudgetReport } from '../ReportDialogs/ActualVsBudget-Report/actualvsbudget-report.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    AutoCompleteModule,
    Ng2SearchPipeModule,
    NgxDaterangepickerMd.forRoot(),
    GenericPopupGridModule.forRoot(),
    TreeModule,
    ContextMenuModule,
    NepaliDatePickerModule
    ],
  declarations: [
    ContextmenuComponent,
    ReportsComponent,
    ReportMain,
    MasterDialogReport,
    AccountPayableReport,
    AccountReceivableReport,
    GstSalesSummary,
    GstPurchaseSummary,
    AgingPayableReport,
      AgingReceivableReport,
      PurchaseBookReport,
      CashBookReport,
      SalesBookReport,
      JournalBook,
      DueVoucherReport,
      CreditorsReport,
      DebtorsReport,
      PartyLedger,
      DebtorsAgingReport,
      CreditorsAgingReport,
      DebtorsOutstandingReport,
      CreditorsOutstandingReport,
      SummaryLedgerReport,
      AccountLedgerReport,
      SummaryPartyLedger,
      PartyLedgerReport,
      DateFilters,
      CostcenterFilters,
      DebitNoteRegisterReportComponent,
      VATpurchaseRegisterReportComponent,
      OneLakhAbovePURCHASEreportComponent,
      OneLakhAboveSALESreportComponent,
      DivisionComponent,
      CostcenterList,
      AreaList,
      AreaFilters,
      AccountList,
      AccountFilters,
      VoucherRegister,
      CashBankBookReport,
      DayBookReport,
      SubLedgerReport,
      SubLedgerAcbaseReport,
      TrialBalanceReport,
      ActualVsBudgetReport,
      AdditionalCostItemwiseReport,
      AdditionalCostVoucherwiseReport,
      // NepaliDatePickerComponent
      SalesReturnSummaryReport, SalesReturnSummaryRetailerReport, SalesReturnReportDetail,
      StockAbcAnalysisReportAccount,
      StockValuationReport,
      StockSummaryReportAccount,
      CurrentStockWarehousWiseReportAccount,
      StockLedgerReportAccount,
      ConsolidatedTrialBalanceReport,
      ProfitLossReport,BalanceSheetReport,
      TDSReport,
      ConsolidatedBalanceSheetReport,
      ConsolidatedProfitLossReport,
      BillTrackingReport,
      CrediotrsBillTrackingReport,
      PostDatedChequeVoucherReport,
      MonthlySalesPaymentReport,
      LocalPurchaseCostAllocationReport
  ],
  providers: [
    CanActivateTeam,TransactionService
    // ReportMainService
  ],
  exports: [],
  entryComponents:
    [MasterDialogReport],
})
export class ReportModule {
}
