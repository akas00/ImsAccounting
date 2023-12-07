import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { CostCenterRoutingModule } from "./cost-center.routing";
import { CostCenterListComponent } from "./costCenterList.component";
import { CostCenterFormComponent } from "./costCenterForm.component";
import { ModalModule } from "ngx-bootstrap";
import { SearchPipe} from "./search.pipe";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CostCenterRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),

  ],
  declarations: [
    CostCenterListComponent,
    CostCenterFormComponent,
    SearchPipe
  ],
})
export class CostCenterModule { }
