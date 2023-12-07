import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { MerchantDetailsRoutingModule } from "./merchant-details.routing";
import { MerchantDetailsFormComponent } from "./merchant-details-form.component";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    MerchantDetailsRoutingModule
  ],
  declarations: [
    MerchantDetailsFormComponent
    ],
})
export class MerchantDetailsModule {
 }