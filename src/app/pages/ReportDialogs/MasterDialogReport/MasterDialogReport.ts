import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, ComponentFactoryResolver } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";

export interface DialogInfo {
    activeurlpath: string;
    reportparam: any;
}

@Component({
    selector: 'masterdreportdialog',
    templateUrl: './MasterDialogReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class MasterDialogReport {
    ReportParameters: any = <any>{};
    activeurlpath: string;
    currentreportparam: any;
    constructor(public dialogref: MdDialogRef<MasterDialogReport>,
         @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.activeurlpath = data.activeurlpath;
        this.currentreportparam = data.reportparam;
    }

    reportdataEmit(event) {
        this.dialogref.close(event);

    }
s

}