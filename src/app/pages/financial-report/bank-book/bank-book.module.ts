import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { ReportBodyModule } from '../report-body.module';

import { BankBookRoutingModule } from './bank-book.routing.module';
import { BankBookComponent } from './bank-book.component';
import { BankBookService } from './bank-book.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BankBookRoutingModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()


  ],
  declarations: [
    BankBookComponent,
  ],
  providers: [
    CanActivateTeam,
    BankBookService
  ]
})
export class BankBookModule {
}
