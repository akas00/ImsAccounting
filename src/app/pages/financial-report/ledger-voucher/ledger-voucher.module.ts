import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerVoucherRoutingModule } from './ledger-voucher.routing.module';
import { LedgerVoucherComponent } from './ledger-voucher.component';
import { LedgerVoucherService } from './ledger-voucher.service';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ReportBodyModule } from '../report-body.module';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LedgerVoucherRoutingModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()



  ],
  declarations: [
    LedgerVoucherComponent,
  ],
  providers: [
    CanActivateTeam,
    LedgerVoucherService,
  ]
})
export class LedgerVoucherModule {
}
