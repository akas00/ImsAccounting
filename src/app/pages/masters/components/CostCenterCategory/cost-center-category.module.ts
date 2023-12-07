import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";

import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { CostCenterCategoryListComponent } from "./costCenterCategoryList.component";
import { CostCenterCategoryRoutingModule } from "./cost-center-category.routing";
import { CostCentercategoryFormComponent } from "./costCenterCategoryForm.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchPipe } from "./search.pipe";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CostCenterCategoryRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),

  ],
  declarations: [
    CostCenterCategoryListComponent,
    CostCentercategoryFormComponent,
    SearchPipe,
  
  ],
})
export class CostCenterCategoryModule { }
