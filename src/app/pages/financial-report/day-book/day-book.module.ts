import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ReportBodyModule } from '../report-body.module';
import { DayBookRoutingModule } from './day-book.routing.module';
import { DayBookComponent } from './day-book.component';
import { DayBookService } from './day-book.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DayBookRoutingModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()


  ],
  declarations: [
    DayBookComponent,
  ],
  providers: [
    CanActivateTeam,
    DayBookService
  ]
})
export class DayBookModule {
}
