import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ReportBodyModule } from '../report-body.module';

import { CashBookComponent } from './cash-book.component'; 
import { CashBookRoutingModule } from './cash-book.routing.module';
import { CashBookService } from './cash-book.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CashBookRoutingModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()


  ],
  declarations: [
    CashBookComponent,
  ],
  providers: [
    CanActivateTeam,
    CashBookService
  ]
})
export class CashBookModule {
}
