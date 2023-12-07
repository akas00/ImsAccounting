import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { DialogInfo } from "../../../common/interfaces/TrnMain";
import { MessageDialog } from "../messageDialog/messageDialog.component";


@Component({
    selector: 'dispatch-dialog',
    template: `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                <div class="close" aria-label="Close" (click)="dispatchResult('cancel')">&times;</div>
                <h4 class="modal-title">Dispatch List</h4>
                </div>
                    
                <div class="modal-body">
                    <table class="table" >
                    <div>
                        <tr>
                            <th style="width:100px">Voucher No.</th>
                            <th style="width:100px">Division</th>
                            <th style="width:100px">Trn. A/C</th>
                            <th style="width:100px">Fiscal Year</th>
                            <th style="width:180px">Date</th>
                            <th style="width:100px">Miti</th>
                        </tr>
                        </div>
                     
                        <div style="height:100px;overflow:auto;scrollbar-3dlight-color:#FFFFFF;scrollbar-arrow-color:#000000;scrollbar-base-color:#FF9999;scrollbar-darkshadow-color:#000000;scrollbar-face-color:#000000;scrollbar-highlight-color:#000000;scrollbar-shadow-color:#0033CC;">
                            <tr *ngFor="let d of dispatchList; let i = index" (click)="rowClick(d,i)" [class.active]="i == selectedRowIndex">
                                <td style="width:100px">{{d.VCHRNO}}</td>
                                <td style="width:100px">{{d.DIVISION}}</td>
                                <td style="width:100px">{{d.TRNAC}}</td>
                                <td style="width:100px">{{d.PhiscalID}}</td>
                                <td style="width:180px">{{d.TRNDATE}}</td>
                                <td style="width:100px">{{d.BSDATE}}</td>
                            </tr>
                        </div>
                        
                    </table>
                </div>
                 <div class="modal-footer">
                        
                        <button class="btn btn-info confirm-btn" type="button" [disabled]="selectedRow==null" (click)=onsubmit()>OK</button>
                    </div>
            </div>
        </div>
`,
    styles: [`
    tr th{
        padding: 5px 2px;
        cursor: default;
        font-weight: bold;
        background-color: #FFFFFF;
    }

    tr td{
        padding: 0px 2px;
        border-top: 0px;
        line-height: 31px;
    }

    tbody tr:hover {
        background-color: #e0e0e0;
    }
    .table tr.active td {
  background-color:#123456 !important;
  color: white;
}
`]
})
export class DispatchDialog {
    dispatchList: Array<any> = [];
    selectedRow: any;
    selectedRowIndex = -1;
    constructor(public dialogref: MdDialogRef<DispatchDialog>, @Inject(MD_DIALOG_DATA) public data: DialogInfo, private masterService: MasterRepo,public dialog: MdDialog) {
        let response: Array<any> = [];
        if (data) {
            //  let dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: {header:'Loading...',message:'Loading Data Please wait...'} });
  this.masterService.getSalesModeList(data).subscribe(res => {
                if (res.status == "ok") {

                    response = res.result;
                    if (data.PARAC && data.SALESMODE=='delivery') {
                        response = response.filter(x => x.PARAC == data.PARAC);

                    }
                    this.dispatchList = response;
                    // dialogRef.close();
                }
            }, error => {
                this.masterService.resolveError(error, "dispatchDialog - getDispatchList");
            });



        }

    }

    rowClick(row, index) {
        this.selectedRow = row;
        this.selectedRowIndex = index;
    }
    onsubmit() {
        this.dispatchResult('ok');
    }
    public dispatchResult(res) {
        this.dialogref.close({ status: res, selectedRow: this.selectedRow });
    }

}