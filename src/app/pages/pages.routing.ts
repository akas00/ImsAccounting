import { Routes, RouterModule, CanActivate } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { CanActivateTeam } from '../common/services/permission/guard.service';
import { PendingChangesGuard } from '../common/services/guard/can-navigate.guard';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', canActivate: [CanActivateTeam] },
      
      { path: 'report', loadChildren: 'app/pages/DialogReport/dialogRep.module#ReportModule' },
      { path: 'account/reports', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      {path: 'transaction/purchases', loadChildren: 'app/pages/Purchases/purchases.module#PurchasesModule'},
      { path: 'financialreports', loadChildren:  'app/pages/AccountVoucher/accountvoucher.module#AccountVouchersModule' },
       { path: 'financialreports/additionalreport', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      // { path: 'account/multiple-print', loadChildren: 'app/pages/multiple-voucher-print/multiple-voucher-print.module#MultiPrintModule' },
      { path: 'financialreports/account-ledger-reports', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'financialreports/registerBookReports', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'account', loadChildren: 'app/pages/AccountVoucher/accountvoucher.module#AccountVouchersModule' },
      { path: 'financialreports/one-lakh-above-report', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'financialreports/group-ledger', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      {path: 'configuration/userManager', loadChildren: 'app/pages/userManager/userManager.module#UserManagerModule'},
      // {path: 'settings/settingslist', loadChildren: 'app/pages/Settings/settings.module#SettingsModule'},

      { path: 'financialreports/trialbalance', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'financialreports/budgetreport', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      {path: 'configuration', loadChildren: 'app/pages/configuration/configuration.module#ConfigurationModule'},
      { path: 'financialreports/additionalcostreport', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'financialreports/salesreport', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'financialreports/inventoryreport-dms', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'financialreports/final-report', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },
      { path: 'transaction/sales', loadChildren: 'app/pages/Sales/sales.module#SalesModule' },
     


    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
