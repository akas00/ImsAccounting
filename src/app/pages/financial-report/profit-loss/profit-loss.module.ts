import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ProfitLossRoutingModule } from './profit-loss.routing.module';
import { ProfitLossComponent } from './profit-loss.component';
import { ProfitLossService } from './profit-loss.service';
import { CacheService } from '../../../common/services/permission';
import { NepaliDatePickerModule } from '../../../common/nepali-date-picker/nepali-date-picker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProfitLossRoutingModule,
    NepaliDatePickerModule,
    ReportFilterModule.forRoot()
    



  ],
  declarations: [
    ProfitLossComponent,
  ],
  providers: [
    CanActivateTeam,
    ProfitLossService,
    CacheService,
  ]
})
export class ProfitLossModule {
}
