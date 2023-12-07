import { TrnMain } from './../../../common/interfaces/TrnMain';
import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'PrintDialog',
    template: `
        <div class="modal fade" role="dialog" id="purchasePrint" aria-labelledby="orderModalLabel">
    <div  style="width: 400px; background:white">
        <p class="InvoiceHeader"> {{InvoiceType}}

        </p>
        <p class="InvoiceHeader"> {{CompanyName}}

        </p>
        <p class="InvoiceHeader"> {{CompanyAddress}}

        </p>
        <p class="InvoiceHeader"> {{CompanyPan}}

        </p>
        <p>
            <label style="width: 90px;">Custmomer Name :</label>
            <label style="width: 130px;"> {{TrnMainObj.VCHRNO}}</label>
            <label style="width: 60px;">Address :</label>
            <label style="width: 90px;"> {{TrnMainObj.BSDATE}}</label>
        </p>
        <p>
            <label style="width: 90px;">Ref. Job Sheet# :</label>
            <label> {{TrnMainObj.BILLTO}}</label>
        </p>
        <p>
            <label style="width: 90px;">Address :</label>
            <label> {{TrnMainObj.BILLTOADD}}</label>
        </p>
        <p>
            <label style="width: 90px;">PAN :</label>
            <label colspan="3"> {{TrnMainObj.BILLTOPAN}}</label>
        </p>
        <table class="itemtable">
            <thead>
                <tr>
                    <th style="width: 40px;">Sno.</th>
                    <th style="width: 200px;">Particulars</th>
                    <th style="width: 50px;">Qty.</th>
                    <th style="width: 50px;">Rate</th>
                    <th style="width: 60px;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of TrnMainObj.ProdList">
                    <td> {{item.SNO}}</td>
                    <td> {{item.ITEMDESC}}</td>
                    <td style="text-align:right"> {{item.Quantity}}</td>
                    <td style="text-align:right"> {{item.REALRATE}}</td>
                    <td style="text-align:right"> {{item.AMOUNT}}</td>
                </tr>
            </tbody>
        </table>
        <table class="summaryTable">
            <tbody>
                <tr>
                    <td>Net Amount :</td>
                    <td>{{TrnMainObj.TOTAMNT}}</td>
                </tr>
                <tr>
                    <td>Discount :</td>
                    <td>{{TrnMainObj.DCAMNT}}</td>
                </tr>
                <tr>
                    <td>Taxable :</td>
                    <td>{{TrnMainObj.TAXABLE}}</td>
                </tr>
                <tr>
                    <td>VAT Amount :</td>
                    <td>{{TrnMainObj.VATAMNT}}</td>
                </tr>
                <tr>
                    <td>Total Amount :</td>
                    <td>{{TrnMainObj.NETAMNT}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
`
})
export class PrintDialog {
    @Input() ValuePrint: string= 'Tax Invoice';
    @Input() CompanyName: string = 'IMS Himalayan Sangrila Pvt. Ltd.';
    @Input() CompanyAddress: string = 'Tripureswore, Kathmandu';
    @Input() CompanyPan: string = '675845231';
    @Input() TrnMainObj: TrnMain = <TrnMain>{};
    @Output() sendPrefix = new EventEmitter();
    heading: string = "Information";
    message$: Observable<string>;

    constructor(public dialogref: MdDialogRef<PrintDialog>, @Inject(MD_DIALOG_DATA) public data: any) {
let response: Array<any> = [];
         if (data)
            {
                alert(data)
            }
    }
    onPrintClicked() {
        let printContents, popupWin;
        printContents = document.getElementById('ValuePrint').innerHTML;
        //console.log(printContents);
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=400');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
              <head>                  
                  <style>
                      .InvoiceHeader{
                text-align:center;
                font-weight:bold
            }
            p
            {
                height:5px;
            }
            table{
                margin:5px
            }
            .summaryTable{
                float: right;
                border: none;
            }

            .summaryTable  td{
                text-align:right;
                border:none;
            }

            .itemtable{
                border: 1px solid black;
                border-collapse: collapse;
            }
            .itemtable th{                
                height:30px;
                font-weight:bold;
            }
            .itemtable th, td {               
                border: 1px solid black;
                padding:2px;

            }
                  </style>
              </head>
              <body onload="window.print();window.close()">${printContents}
              </body>
          </html>`
        );
        popupWin.document.close();
    }

}