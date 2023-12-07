import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";

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
import { AccNewLedgerComponent } from "./AccLedgerTable.component";
import { AddAccLedgerGrpComponent } from "./addAccgrp.component";
import { AccNewRoutingModule } from "./addAcc.routing";
import { AddAccLedgerComponent } from "./addAccledger.component";
import { addAccMajorGrpComponent } from "./addAccMajorgrp.component";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccNewRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    ContextMenuModule,
    ModalModule.forRoot(),
    ContextMenuModule,
    NgxPaginationModule
  ],
  declarations: [
    AccNewLedgerComponent,AddAccLedgerGrpComponent,SearchPipe,AddAccLedgerComponent,addAccMajorGrpComponent

  ],
  exports: [
    // PartyLedgerComponent
  ]
})
export class AccNewModule { }
