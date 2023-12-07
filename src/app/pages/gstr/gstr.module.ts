import {  NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { GstrRoutingModule } from "./gstr.routing.module";
import { GstrComponent } from "./gstr.component";
import { GstrDashBoardComponent } from "./gstr-dashboard/gstr-dashboard.component";
import { Gstr1Component } from "./gstr-1/gstr1.component";
import { GstrService } from "./gstr.service";
import { GstrCardComponent } from "./gstr-card/gstr-card.component";
import { GstSummaryListComponent } from "./gstr-card/gst-summary-list.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import {FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CacheService } from "../../common/services/permission/cacheService.service";
import { Gstr2Component } from "./gstr-2/gstr2.component";
import { Gstr4Component } from "./gstr-4/gstr4.component";
import { Gstr3BComponent } from "./gstr-3B/gstr-3B.component";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    GstrRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),

  ],
  declarations: [GstrComponent,
    GstrDashBoardComponent,
    Gstr1Component,
    GstrCardComponent,
    GstSummaryListComponent,
    Gstr2Component,
    Gstr3BComponent,
    Gstr4Component
  ],
  providers:[GstrService,CacheService]
})
export class GstrModule {
 
}
