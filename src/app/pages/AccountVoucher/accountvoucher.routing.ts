import { from } from 'rxjs/observable/from';
import { PartyBalanceConfirmationComponent } from './components/party-balance-confirmation/party-balance-confirmation.component';
import { SimpleCollectionComponent } from './components/simpleCollection/simpleCollection.component';
import { Routes, RouterModule } from '@angular/router';
import { AccountVouchers } from './accountvoucher.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { IncomeVoucherComponent } from "./components/IncomeVoucher/income-voucher.component";
import { ExpensesVoucherComponent } from "./components/ExpensesVoucher/expenses-voucher.component";
import { CreditNoteComponent } from './components/CreditNote/credit-note.component';
import { DebitNoteComponent } from './components/DebitNote/debit-note.component';
import { JournalVoucherComponent } from './components/journal/journal-voucher.component';
import { ContraVoucherComponent } from './components/contra/contra-voucher.component';
import { VoucherPosting } from './components/voucher-posting/voucher-posting.component';
import { BankReconciliationComponent } from './components/bank-reconciliation/bank-reconciliation.component';
import { AccountOpeningBalance } from './components/account-opening-balance/account-opening-balance.component';
import { PartyOpeningBalance } from './components/party-opening-balance/party-opening-balance.component';
import { DebitNoteRateAdjustmentComponent } from './components/debit-note-rate-adjustment/debit-note-rate-adjustment.component';
import { BillTrackingAmendmentComponent } from './components/bill-tracking-amendment/bill-tracking-amendment.component';
import { CapitalVoucherComponent } from './components/capital-voucher/capital-voucher.component';
import { additionalCostDetail } from '../Purchases/components/AdditionalCost/additionalCost.component';
import {  MasterAdditionalComponent } from '../Purchases/components/AdditionalCost/masterPageAdditional.component';
import { PaymentSingleComponent } from '../AccountVoucher/components/payment-single/payment-single.component';
import { VoucherRenumberingComponent } from './components/voucher-renumbering/voucher-renumbering.component';
import { PaymentCollection } from './components/PaymentCollection/PaymentCollection.component';
import { PostDirectoryComponent } from './components/PostDirectory/postdirectory.component';
import { PartyReconciliationComponent } from './components/party-reconciliation/party-reconciliation.component';
import { CellPayVoucherComponent } from './components/CellPayVoucher/CellPay-Voucher.component';
import { ReverseCreditNoteComponent } from './components/ReverseCreditNote/reverse-credit-note.component';
import { MasterNewAdditionalComponent } from '../Purchases/components/NewAdditionalCost/newmasterPageAdditional.component';
import { AddPurchaseInvoiceComponent } from '../Purchases/components/purchaseinvoice/AddPurchaseInvoice';
import { CashCollection } from './components/CashCollection/cashcollection.component';


const routes: Routes = [
  {
    path: '',
    component: AccountVouchers,
    children: [
      { path: 'acvouchers/journal-voucher', component: JournalVoucherComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/contra-voucher', component: ContraVoucherComponent, canActivate: [CanActivateTeam] },
      // { path: 'acvouchers/payment-voucher/payment-single', component: PaymentSingleComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/income-voucher', component: IncomeVoucherComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/expense-voucher', component: ExpensesVoucherComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/debit-note', component: DebitNoteComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/credit-note', component: CreditNoteComponent, canActivate: [CanActivateTeam] },
      // { path: 'acvouchers/debit-note-rate-adjustment', component: DebitNoteRateAdjustmentComponent, canActivate: [CanActivateTeam] },
      // { path: 'acvouchers/credit-note-rate-adjustment', component: DebitNoteRateAdjustmentComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/bill-tracking', component: BillTrackingAmendmentComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/capital-voucher', component: CapitalVoucherComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/additional-cost', component: MasterAdditionalComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/newadditional-cost', component: MasterNewAdditionalComponent, canActivate: [CanActivateTeam] },
      { path: "Opening/account-opening-balance", component: AccountOpeningBalance, canActivate: [CanActivateTeam] },
      { path: "Opening/party-opening-balance", component: PartyOpeningBalance, canActivate: [CanActivateTeam] },

      { path: 'AccountLedger', loadChildren: 'app/pages/masters/components/ALedger/aledger.module#AledgerModule', canActivate: [CanActivateTeam] },
      { path: 'LatePostCollection', loadChildren: 'app/pages/AccountVoucher/components/EnableLatePost/EnableLatePost.module#EnableLatePostModule', canActivate: [CanActivateTeam] },
      { path: 'EPaymentStatus', loadChildren: 'app/pages/AccountVoucher/components/E-PaymentStatus/EPaymentStatus.module#EPaymentStatusModule', canActivate: [CanActivateTeam] },
      { path: 'acvouchers/voucher-posting', component: VoucherPosting, canActivate: [CanActivateTeam] },
      { path: "Utilities/bank-reconciliation", component: BankReconciliationComponent, canActivate: [CanActivateTeam] },
      { path: "Utilities/party-balance-confirmation", component: PartyBalanceConfirmationComponent, canActivate: [CanActivateTeam] },
      { path: 'day-book', loadChildren: 'app/pages/financial-report/day-book/day-book.module#DayBookModule', canActivate: [CanActivateTeam] },
      { path: 'cash-book', loadChildren: 'app/pages/financial-report/cash-book/cash-book.module#CashBookModule', canActivate: [CanActivateTeam] },
      { path: 'bank-book', loadChildren: 'app/pages/financial-report/bank-book/bank-book.module#BankBookModule', canActivate: [CanActivateTeam] },
      { path: 'trial-balance', loadChildren: 'app/pages/financial-report/trial-balance/trial-balance.module#TrialBalanceModule', canActivate: [CanActivateTeam] },
      { path: 'profit-loss', loadChildren: 'app/pages/financial-report/profit-loss/profit-loss.module#ProfitLossModule', canActivate: [CanActivateTeam] },
      { path: 'balance-sheet', loadChildren: 'app/pages/financial-report/balance-sheet/balance-sheet.module#BalanceSheetModule', canActivate: [CanActivateTeam] },
      { path: 'ledger-report', loadChildren: 'app/pages/financial-report/ledger-voucher/ledger-voucher.module#LedgerVoucherModule', canActivate: [CanActivateTeam] },
      { path: 'voucher-register', loadChildren: 'app/pages/financial-report/voucher-register/voucher-register.module#VoucherRegisterModule', canActivate: [CanActivateTeam] },
      // { path: 'vatsalesreport', loadChildren: 'app/pages/financial-report/VAT-Sales-Report/VAT-Sales-Report.module#VATSalesReportModule', canActivate: [CanActivateTeam] },
      { path: 'openingbalance', loadChildren: 'app/pages/financial-report/Opening_Balance/openingBalance.module#OpeningBalancerModule', canActivate: [CanActivateTeam] },
      {path: 'renum/VoucherRenumbering', component: VoucherRenumberingComponent, canActivate:[CanActivateTeam]},
      // {path: 'acvouchers/PaymentCollection', component: PaymentCollection, canActivate:[CanActivateTeam]},
      // {path: 'acvouchers/simpleCollection', component: SimpleCollectionComponent,canActivate:[CanActivateTeam]},
      {path: 'Utilities/PaymentCollection', component: PaymentCollection, canActivate:[CanActivateTeam]},
      {path: 'acvouchers/postdirectory', component: PostDirectoryComponent, canActivate:[CanActivateTeam]},
      { path: "Utilities/party-reconciliation", component: PartyReconciliationComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/cellpay-voucher', component: CellPayVoucherComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/reverse-credit-note', component: ReverseCreditNoteComponent, canActivate: [CanActivateTeam] },
      { path: 'purchases/add-purchase-invoice', component: AddPurchaseInvoiceComponent, canActivate: [CanActivateTeam] },
      { path: 'acvouchers/localpurchase-costallocation', loadChildren: 'app/pages/AccountVoucher/components/vehicle-cost-tracking/localpurchase-costallocation.module#LocalPurchaseCostAllocationModule', canActivate: [CanActivateTeam] },
      {path: 'Utilities/cash-collection', component: CashCollection, canActivate:[CanActivateTeam]},
      
    ]
  }
];

export const routing = RouterModule.forChild(routes);
