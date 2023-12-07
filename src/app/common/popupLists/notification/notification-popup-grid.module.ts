import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { MasterRepo } from "../../repositories";
import { NgaModule } from "../../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";
import { NotificationPopUpComponent } from "./notification-popup-grid.component";
import { FormsModule } from "../../../pages/forms/forms.module";
import { NotificationService } from "./notification.service";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [NotificationPopUpComponent],
  exports: [NotificationPopUpComponent]
})
export class NotificationPopupGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NotificationPopupGridModule,
      providers: [MasterRepo, NotificationService]
    };
  }
}
