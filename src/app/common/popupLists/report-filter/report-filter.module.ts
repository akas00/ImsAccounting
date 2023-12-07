import { MasterRepo } from "../../repositories";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportFilterComponent } from "./report-filter.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { OnlyNumber } from "../../directives/onlynumber.directive";
import { GenericPopupGridModule } from "../generic-grid/generic-popup-grid.module";
import { NepaliDatePickerModule } from "../../nepali-date-picker/nepali-date-picker.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    NguiAutoCompleteModule,
    GenericPopupGridModule.forRoot(),
    NepaliDatePickerModule
 
  
  ],
  declarations: [ReportFilterComponent,OnlyNumber],
  providers:[MasterRepo],
  exports: [ReportFilterComponent]
})
export class ReportFilterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ReportFilterModule,
      providers: [MasterRepo]
    };
  }
}
