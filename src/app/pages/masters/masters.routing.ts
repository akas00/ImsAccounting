import { Routes, RouterModule } from '@angular/router';
import { Masters } from './masters.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';

import { AccountPayableReport } from '../financial-report/account-payable/account-payable.component';

const routes: Routes = [
  {
    path: '',
    component: Masters,
    children: [
      { path: 'company-info', loadChildren: 'app/pages/masters/components/CompanyInfo/company-info.module#CompanyInfoModule', canActivate: [CanActivateTeam] },
      { path: 'PartyLedger', loadChildren: 'app/pages/masters/components/PLedger/pledger.module#PartyLedgerModule', canActivate: [CanActivateTeam] },
      { path: 'AccountLedger', loadChildren: 'app/pages/masters/components/ALedger/aledger.module#AledgerModule', canActivate: [CanActivateTeam] },
      { path: 'accountpayablereport', component: AccountPayableReport, canActivate: [CanActivateTeam] }

    ]

  }
];

export const routing = RouterModule.forChild(routes);
