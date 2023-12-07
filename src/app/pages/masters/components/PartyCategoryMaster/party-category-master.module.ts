import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { PartyCategoryMasterComponent } from "./party-category-master.component";
import { PartyCategoryMasterRoutingModule } from "./party-category-master.routing";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    PartyCategoryMasterRoutingModule
  ],
  declarations: [
    PartyCategoryMasterComponent
    ],
})
export class PartyCategoryMasterModule {
 }