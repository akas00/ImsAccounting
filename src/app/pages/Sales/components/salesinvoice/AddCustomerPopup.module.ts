import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";

import { NgxPaginationModule } from "ngx-pagination";
import { NgaModule } from "../../../../theme/nga.module";
import { MasterRepo } from "../../../../common/repositories";
import { AddNewCustomerPopUpComponent } from "./AddCustomerPopup";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [AddNewCustomerPopUpComponent],
  exports: [AddNewCustomerPopUpComponent]
})
export class PopupAddNewCustomerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PopupAddNewCustomerModule,
      providers: [MasterRepo]
    };
  }
}
