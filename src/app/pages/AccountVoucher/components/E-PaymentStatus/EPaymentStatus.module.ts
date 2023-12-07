import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";
import { LimitDecimalPlacesModule } from "../../../../common/directives/limit-decimal.module";
import { VoucherTrackingPopupModule } from "../VoucherTracking/VoucherTracking.module";
import { ReportFilterModule } from "../../../../common/popupLists/report-filter/report-filter.module";
import { IMSDatePickerModule } from "../../../../common/date-picker/date-picker.module";
import { NepaliDatePickerModule } from "../../../../common/nepali-date-picker/nepali-date-picker.module";
import { EPaymentStatusMasterComponent } from "./EPaymentStatusMaster.component";
import { EPaymentStatusComponent } from "./EPaymentStatus.component";
import { EPaymentStatustRoutingModule } from "./EPaymentStatus.route";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    TransactionModule,
    GenericPopupGridModule.forRoot(),
    LimitDecimalPlacesModule.forRoot(),
    VoucherTrackingPopupModule.forRoot(),
    ReportFilterModule.forRoot(),
    IMSDatePickerModule.forRoot(),
    NepaliDatePickerModule,
    EPaymentStatustRoutingModule
  ],
  declarations: [
    EPaymentStatusComponent,EPaymentStatusMasterComponent
  ],
})
export class EPaymentStatusModule { }
