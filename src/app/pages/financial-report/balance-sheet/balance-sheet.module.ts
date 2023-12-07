import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { BalanceSheetRoutingModule } from './balance-sheet.routing.module';
import { BalanceSheetComponent } from './balance-sheet.component';
import { BalanceSheetService } from './balance-sheet.service';
import { CacheService } from '../../../common/services/permission';
import { NepaliDatePickerModule } from '../../../common/nepali-date-picker/nepali-date-picker.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BalanceSheetRoutingModule,
    ReportFilterModule.forRoot(),
    NepaliDatePickerModule

  ],
  declarations: [
    BalanceSheetComponent,
  ],
  providers: [
    CanActivateTeam,
  
    BalanceSheetService,
    CacheService,
  ]
})
export class BalanceSheetModule {
}
