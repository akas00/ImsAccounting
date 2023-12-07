import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap"; 
import { DecimalPlacesRestriction } from "./limit-decimal.directive";
import { NgaModule } from "../../theme/nga.module";
import { formatToDecimal } from "./format-decimal.directive";

@NgModule({
  imports: [
    CommonModule, 
  ],
  declarations: [formatToDecimal],
  exports: [formatToDecimal]
})
export class FormatToDecimalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormatToDecimalModule 
    };
  }
}
