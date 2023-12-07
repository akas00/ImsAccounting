import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap"; 
import { DecimalPlacesRestriction } from "./limit-decimal.directive";
import { NgaModule } from "../../theme/nga.module";

@NgModule({
  imports: [
    CommonModule, 
  ],
  declarations: [DecimalPlacesRestriction],
  exports: [DecimalPlacesRestriction]
})
export class LimitDecimalPlacesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LimitDecimalPlacesModule 
    };
  }
}
