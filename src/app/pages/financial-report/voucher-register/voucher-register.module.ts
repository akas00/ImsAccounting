import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { VoucherRegisterComponent } from './voucher-register.component';
import { VoucherRegisterRoutingModule } from './voucher-register.routing.module';
import { VoucherRegisterService } from './voucher-register.service';
import { ReportBodyModule } from '../report-body.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VoucherRegisterRoutingModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()


  ],
  declarations: [
    VoucherRegisterComponent,
  ],
  providers: [
    CanActivateTeam,
    VoucherRegisterService
  ]
})
export class VoucherRegisterModule {
}
