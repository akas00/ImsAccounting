import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { GenericPopUpComponent } from "./generic-popup-grid.component";
import { MasterRepo } from "../../repositories";
import { NgaModule } from "../../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [GenericPopUpComponent],
  exports: [GenericPopUpComponent]
})
export class GenericPopupGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GenericPopupGridModule,
      providers: [MasterRepo]
    };
  }
}
