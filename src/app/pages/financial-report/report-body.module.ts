import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportBodyComponent } from "./report-body.component";
import { HttpModule } from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [ReportBodyComponent],
  exports: [ReportBodyComponent]
})
export class ReportBodyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ReportBodyModule,
    };
  }
}
