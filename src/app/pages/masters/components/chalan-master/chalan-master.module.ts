import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChalanMasterRoutingModule } from "./chalan-master.routing";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ModalModule } from "ng2-bootstrap";
import { ChalanMaserListComponent } from "./chalan-master-list.component";
import { AddChalanComponent } from "./add-chalan-master/add-chalan-master.component";
import { ChalanMasterService } from "./chalan-master.service";
import { SearchPipe } from "./search.pipe";

@NgModule({
    imports: [
      TreeModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ChalanMasterRoutingModule,
      GenericPopupGridModule.forRoot(),
      NgaModule,
      Ng2SmartTableModule,
      ModalModule.forRoot(),
  
    ],
    declarations: [
        ChalanMaserListComponent,
        AddChalanComponent, SearchPipe
    ],
  
  })
  export class ChalanMaserModule { }
  