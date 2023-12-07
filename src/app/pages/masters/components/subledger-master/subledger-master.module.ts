import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ModalModule } from "ng2-bootstrap";
import { SubLedgerMasterRoutingModule } from "./subledger-master.routing";
import { AddSubLedgerComponent } from "./add-subledger-master/add-subledger-master.component";
import { SubLedgerMasterListComponent } from "./subledger-master-list.component";
import { SearchPipe } from "./search.pipe";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";

@NgModule({
    imports: [
      TreeModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SubLedgerMasterRoutingModule,
      GenericPopupGridModule.forRoot(),
      NgaModule,
      Ng2SmartTableModule,
      ModalModule.forRoot(),
      FileUploaderPopupModule.forRoot()
    ],
    declarations: [
        SubLedgerMasterListComponent,
        AddSubLedgerComponent, SearchPipe
    ],
  
  })
  export class SubLedgerMasterModule { }
  