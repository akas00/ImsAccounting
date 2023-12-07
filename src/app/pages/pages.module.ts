import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CanActivateTeam } from "../common/services/permission/guard.service";
import { routing } from "./pages.routing";
import { NgaModule } from "../theme/nga.module";

import { Pages } from "./pages.component";
import { PendingChangesGuard } from "../common/services/guard/can-navigate.guard";
import { AlertService } from "../common/services/alert/alert.service";
import { AlertComponent } from "../common/services/alert/directives/alert.component";
import { ModalModule } from "ng2-bootstrap";
import { SpinnerService } from "../common/services/spinner/spinner.service";
import { SpinnerComponent } from "../common/services/spinner/directives/spinner.component";
import { PreventNavigationService } from "../common/services/navigation-perventor/navigation-perventor.service";
import { NavigationPreventorComponent } from "../common/services/navigation-perventor/directives/navigation-preventor.component";
import { NotificationPopupGridModule } from "../common/popupLists/notification/notification-popup-grid.module";
import { Footer } from "./footer/footer.component";

@NgModule({
  imports: [
    CommonModule, 
    NgaModule,
    ModalModule.forRoot(),
    routing,
    NotificationPopupGridModule.forRoot()
  ],
  declarations: [
    Pages,
    AlertComponent,
    SpinnerComponent,
    NavigationPreventorComponent,
    Footer
  ],
  providers: [
    CanActivateTeam,
    PreventNavigationService,
    PendingChangesGuard,
    AlertService,
    SpinnerService
  ]
})
export class PagesModule {}
