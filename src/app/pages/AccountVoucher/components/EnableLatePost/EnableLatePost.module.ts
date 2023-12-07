import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { EnableLatePostComponent } from "./EnableLatePost.component";
import { EnableVoucherPostRoutingModule } from "./EnableLatePost.route";
import { LatePostComponent } from "./LatePost.component";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";
import { LimitDecimalPlacesModule } from "../../../../common/directives/limit-decimal.module";
import { VoucherTrackingPopupModule } from "../VoucherTracking/VoucherTracking.module";
import { ReportFilterModule } from "../../../../common/popupLists/report-filter/report-filter.module";
import { IMSDatePickerModule } from "../../../../common/date-picker/date-picker.module";
import { NepaliDatePickerModule } from "../../../../common/nepali-date-picker/nepali-date-picker.module";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnableVoucherPostRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    TransactionModule,
    GenericPopupGridModule.forRoot(),
    LimitDecimalPlacesModule.forRoot(),
    VoucherTrackingPopupModule.forRoot(),
    ReportFilterModule.forRoot(),
    IMSDatePickerModule.forRoot(),
    NepaliDatePickerModule
  ],
  declarations: [
    EnableLatePostComponent,LatePostComponent
  ],
})
export class EnableLatePostModule { }
