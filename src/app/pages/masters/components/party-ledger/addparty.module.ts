import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { PartyLedgerComponent } from "./partyLedgerTable.component";
import { PartyRoutingModule } from "./addparty.routing";
import { ContextMenuModule } from "ngx-contextmenu";
import { ModalModule } from "ng2-bootstrap";
import { addMajorGrpComponent } from "./addMajorgrp.component";
import { AddPartyLedgerGrpComponent } from "./addpartygrp.component";
import { AddPartyLedgerComponent } from "./addpartyledger.component";
import {SearchPipe} from './search.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PartyRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    ContextMenuModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    ContextMenuModule,
    NgxPaginationModule,
    FileUploaderPopupModule.forRoot()
  ],
  declarations: [
    PartyLedgerComponent,addMajorGrpComponent,AddPartyLedgerGrpComponent,AddPartyLedgerComponent,SearchPipe

  ],
  exports: [
    // PartyLedgerComponent
  ]
})
export class PartyModule { }
