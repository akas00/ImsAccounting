import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";

import { NgxPaginationModule } from "ngx-pagination";
import { NgaModule } from "../../../../theme/nga.module";
import { MasterRepo } from "../../../../common/repositories";
import { TransportPopupComponent } from "./Transport-popup.component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
  ],
  declarations: [TransportPopupComponent],
  exports: [TransportPopupComponent],
  
})
export class TransportPopupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TransportPopupModule,
      providers: [MasterRepo]
    };
  }
}
