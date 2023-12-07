import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ReportsComponent } from './Reports.component';
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { ReportMain } from './components/ReportMain/ReportMain';
import { DebitNote } from '../ReportDialogs/DebitNote/debitnote.component';

const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
        children: [
            {path:'reportmain',component:ReportMain,canActivate: [CanActivateTeam]},
            {path: 'accountpayablereport',component:ReportMain,canActivate:[CanActivateTeam]},  
            {path: 'accountreceivablereport',component:ReportMain,canActivate:[CanActivateTeam]},  
            {path: 'gstsalessummary',component:ReportMain,canActivate:[CanActivateTeam]},  
            {path: 'gstpurchasesummary',component:ReportMain,canActivate:[CanActivateTeam]},            
            {path: 'agingpayable',component:ReportMain,canActivate:[CanActivateTeam]},            
            {path: 'agingreceivable',component:ReportMain,canActivate:[CanActivateTeam]}, 
            { path: 'purchasebookreport', component: ReportMain, canActivate: [CanActivateTeam] },          
            { path: 'cashbookreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'salesbookreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'journalbook', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'duevoucherreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'debtorsreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'creditorsreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'PartyLedger', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'debtorsagingreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'creditorsagingreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'debtorsoutstandingreport', component: ReportMain, canActivate: [CanActivateTeam] },
            { path: 'creditorsoutstandingreport', component: ReportMain, canActivate: [CanActivateTeam] },
            { path: 'summaryledgerreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'accountledgerreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'summarypartyledger', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'partyledgerreport', component: ReportMain, canActivate: [CanActivateTeam] }, 
            { path: 'voucher-regeister-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'cash-bank-book-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'day-book-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'sub-ledger-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'sub-ledger-report-acbase',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'trial-balance-report',component: ReportMain, canActivate:[CanActivateTeam] },
            // { path: 'actual-vs-budget-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'additionalcost-itemwise-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'additionalcost-voucherwise-report',component: ReportMain, canActivate:[CanActivateTeam] },
            { path: 'salesreturnsummary-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'salesreturnsummaryretailer-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'salesreturn-reportdetail',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'stockabc-analysis-reportdms',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'stockvaluation-reportdms', component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'stockledger-reportdms',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'stocksummary-reportdms',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'currentstock-warehousewise-reportdms',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'consolidated-trialbalance-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'actual-vs-budget-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'profit-loss-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'balance-sheet-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'tds-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'consolidated-balance-sheet-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'consolidated-profit-loss-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'bill-tracking-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'creditorsbill-tracking-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'postdated-chequevoucher-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'monthly-sales-payment-report',component: ReportMain, canActivate:[CanActivateTeam]},
            { path: 'local-purchase-cost-allocation-report',component: ReportMain, canActivate:[CanActivateTeam]}
            





        ]
    }
];

export const routing = RouterModule.forChild(routes);