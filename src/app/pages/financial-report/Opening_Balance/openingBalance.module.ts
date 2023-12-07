import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ReportBodyModule } from '../report-body.module';
import { OpeningBalanceComponent } from './openingBalance.component';
import { OpeningBalanceRoutingModule } from './openingBalance.routing.module';
import {OpeningBalanceService } from './openingBalance.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OpeningBalanceRoutingModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()



  ],
  declarations: [
    OpeningBalanceComponent,
  ],
  providers: [
    CanActivateTeam,
    OpeningBalanceService,
  ]
})
export class OpeningBalancerModule {
}
