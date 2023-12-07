import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";

import { NgxPaginationModule } from "ngx-pagination";
import { NgaModule } from "../../../../theme/nga.module";
import { MasterRepo } from "../../../../common/repositories";
import { TransportPopupComponent } from "./Transport-popup.component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { VoucherTrackingComponent } from "./VoucherTracking.component";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
  ],
  declarations: [VoucherTrackingComponent],
  exports: [VoucherTrackingComponent],
  
})
export class VoucherTrackingPopupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: VoucherTrackingPopupModule,
      providers: [MasterRepo]
    };
  }
}
