import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { TrialBalanceRoutingModule } from './trial-balance.routing.module';
import { TrialBalanceComponent } from './trial-balance.component';
import { TrialBalanceService } from './trial-balance.service';
import { CacheService } from '../../../common/services/permission';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TrialBalanceRoutingModule,
    ReportFilterModule.forRoot()



  ],
  declarations: [
    TrialBalanceComponent,
  ],
  providers: [
    CanActivateTeam,
    TrialBalanceService,
    CacheService,
  ]
})
export class TrialBalanceModule {
}
