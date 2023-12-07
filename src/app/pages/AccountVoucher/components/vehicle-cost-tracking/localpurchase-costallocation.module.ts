import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LocalPurchaseCostAllocationRoutingModule } from "./localpurchase-costallocation.routing";
import { VehicleCostTrackingComponent } from "./vehicle-cost-tracking.component";
import { LocalPurchaseCostAllocationListComponent } from "./localpurchase-costallocation-list.component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";
import { SearchPipe } from "./search.pipe";
import { LimitDecimalPlacesModule } from "../../../../common/directives/limit-decimal.module";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    LocalPurchaseCostAllocationRoutingModule,
    LimitDecimalPlacesModule.forRoot()
  ],
  declarations: [
    VehicleCostTrackingComponent,
    LocalPurchaseCostAllocationListComponent,
    SearchPipe
  ],
})
export class LocalPurchaseCostAllocationModule { }
