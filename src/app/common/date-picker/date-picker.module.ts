import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MasterRepo } from "../repositories";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { IMSDatePickerComponent } from "./date-picker.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    NgxDaterangepickerMd.forRoot(),

  
  ],
  declarations: [IMSDatePickerComponent],
  exports: [IMSDatePickerComponent]
})
export class IMSDatePickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IMSDatePickerModule,
      providers: [MasterRepo]
    };
  }
}
