import { Component} from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";

import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import * as moment from 'moment';


@Component({
    selector: "creditnote-itembase",
    templateUrl: "./creditnote-itembase.component.html",
    providers: [TransactionService],
    styles: [`
   .table-summary > tbody > tr > td { 
    font-size: 10px;
 }

 .table-summary > tbody > tr > td:first-child{
    text-align: left !important; 
 }
 `]
})

export class CreditNoteItemBaseComponent {
   
    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService,
    private _activatedRoute: ActivatedRoute,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService) {
       this._trnMainService.initialFormLoad(15);    
        this._trnMainService.pageHeading = "Sales Return";
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
                  this._trnMainService.TrnMainObj.VoucherType = 15;
                  this._trnMainService.pageHeading = "Sales Return";
                  this._trnMainService.TrnMainObj.VoucherPrefix = "CN";
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
}
