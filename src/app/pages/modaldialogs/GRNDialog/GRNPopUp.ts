import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
//import { DialogInfo } from "../../../common/interfaces/TrnMain";
import { MessageDialog } from "../messageDialog/messageDialog.component";
import { ModalDirective } from 'ng2-bootstrap';


@Component({
    selector: "popUpGrn",
    templateUrl: "./GRNPopUp.html",
  //  providers: [TransactionService],
  //  styleUrls: ["../../../modal-style.css"]
})

export class GRNPopUpComponent {
    @ViewChild('childModal') childModal: ModalDirective;
    constructor(public dialogref: MdDialogRef<GRNPopUpComponent>, @Inject(MD_DIALOG_DATA) public data: any, private masterService: MasterRepo,public dialog: MdDialog) {}
    ClosePopUp(){
        this.childModal.show();
    }
}