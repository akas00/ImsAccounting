import { NgModule } from "@angular/core";
import { routing } from "./masters.routing";
import { Masters } from "./masters.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";

@NgModule({
  imports: [
    routing,
    NgxDaterangepickerMd.forRoot(),
    GenericPopupGridModule.forRoot(),
    
  ],
  declarations: [
    Masters
  ],
  providers: [CanActivateTeam]
})
export class MastersModule {}
