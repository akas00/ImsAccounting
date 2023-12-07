import { Component } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";

import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import * as moment from 'moment';


@Component({
    selector: "debitnote-itembase",
    templateUrl: "./debitnote-itembase.component.html",
    providers: [TransactionService],
    styleUrls: ["../../../modal-style.css"]
})

export class DebitNoteItemBaseComponent {
  

   
    prefix: PREFIX = <PREFIX>{};
    public printCopyCaption: string = '';

    private myTimer: any;
    checkstatus = true;
    checkView: string;

    constructor(public masterService: MasterRepo, private _trnMainService: TransactionService,
    private _activatedRoute: ActivatedRoute,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService) {
        this._trnMainService.initialFormLoad(16);
        this._trnMainService.pageHeading = "Purchase Return";
        this._trnMainService.DrillMode = "New";
       
    }

    ngOnInit() {
        this._activatedRoute.queryParams.subscribe(params => {
            if (params['mode']=="DRILL") {
              let VCHR = params['voucher']
              let vparams = []
              vparams = VCHR.split('-');
              let pcl = params['pcl'];
              this.masterService.PCL_VALUE=pcl;
              this._loadingSerive.show("Loading Invoice")
              this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
                if (res.status == "ok") {
                  this._loadingSerive.hide()
                  this._trnMainService.TrnMainObj = res.result;
                  this._trnMainService.TrnMainObj.VoucherType = 16;
                  this._trnMainService.pageHeading = "Purchase Return";
                  this._trnMainService.TrnMainObj.VoucherPrefix = "DN";
                  this._trnMainService.TrnMainObj.Mode = "VIEW";      
                  this._trnMainService.TrnMainObj.TRNDATE=(this._trnMainService.TrnMainObj.TRNDATE == null || this._trnMainService.TrnMainObj.TRNDATE == "" || this._trnMainService.TrnMainObj.TRNDATE === undefined)?this._trnMainService.TrnMainObj.TRNDATE:moment(this._trnMainService.TrnMainObj.TRNDATE).format("YYYY-MM-DD");
                  this._trnMainService.TrnMainObj.TRN_DATE=(this._trnMainService.TrnMainObj.TRN_DATE == null || this._trnMainService.TrnMainObj.TRN_DATE == "" || this._trnMainService.TrnMainObj.TRN_DATE === undefined)?this._trnMainService.TrnMainObj.TRN_DATE:moment(this._trnMainService.TrnMainObj.TRN_DATE).format("YYYY-MM-DD");

                  if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
                    this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
                  }
                }
              }, err => {
                this._loadingSerive.hide()
                this._alertService.error(err)
              })
        
            }
        });
    }

   

  

  

    public printIt() {
        clearInterval(this.myTimer);
        try {
            //alert("reached printIT")
            let printContents, popupWin;
            printContents = document.getElementById('InvoiceNewPrint').innerHTML;
            ////console.log("reach CreditNote", printContents);
            popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px'); //console.log({ POPUP: popupWin })
            // popupWin.document.open();
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
        catch (ex) {
            //console.log({ printitError: ex })
        }
    }
   
  

}
