import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { EnableLatePost } from "../../../../common/interfaces";
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { VoucherSeriesFormComponent } from "../../../masters/components/Voucher-Series/voucher-series-form.component";
import { PrefixComponent } from "../../../../common/Prefix/prefix.component";
import { ModalDirective } from "ng2-bootstrap";

@Component({
  selector: "journal-voucher",
  templateUrl: "./journal-voucher.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})
export class JournalVoucherComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.Journal;
  
  VoucherLatePostList: EnableLatePost[] = [];

  constructor(
    private _trnMainService: TransactionService,
    private masterService: MasterRepo,
    private setting: SettingService,
    private _activatedRoute: ActivatedRoute,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService
  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this._trnMainService.initialFormLoad(12)
    this.voucherType = VoucherTypeEnum.Journal;
    this._trnMainService.DrillMode = "New";
  }
 

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
        
        let VCHR = params['voucher']
        let vparams = [];
        this.masterService.SelectedRepDiv = params['Div'];
        this._trnMainService.DrillMode = params['mode'];
        vparams = VCHR.split('-')
        this._loadingSerive.show("Loading Invoice")
        this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
          if (res.status == "ok") {
            this._loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 12;
            this._trnMainService.pageHeading = "Journal";
            this._trnMainService.TrnMainObj.VoucherPrefix = "JV";
            this._trnMainService.TrnMainObj.Mode = "VIEW";
            this._trnMainService.viewDate.next();
          }
        }, err => {
          this._loadingSerive.hide()
          this._alertService.error(err)
        })

      }
      else if (params['mode']=="fromLatepost") {
        // alert("params['mode']==fromLatepost")
        this._loadingSerive.show("Loading Invoice")
        this.masterService.LoadTransaction(params.voucher, params.DIVISION, params.PHISCALID).subscribe((res) => {
          if (res.status == "ok") {
            this._loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 12;
            this._trnMainService.pageHeading = "Journal";
            this._trnMainService.TrnMainObj.VoucherPrefix = "JV";
            this._trnMainService.TrnMainObj.Mode = "VIEW";
            this._trnMainService.viewDate.next();
          }
        }, err => {
          this._loadingSerive.hide()
          this._alertService.error(err)
        })

      }
      else {
        this.TrnMainObj.Mode = "NEW";
        this.masterService.ShowMore = false;
        this.masterService.getEnableLatePost().subscribe(res => {
          if (res.status == "ok") {
            this.VoucherLatePostList = res.result
            for (let i of this.VoucherLatePostList) {

              if (i.VoucherName == 'JournalVoucher') {

                if (i.Status == 1) {

                  this._trnMainService.TrnMainObj.isVoucherLatePostEnable = 1;
                }

              }
            }
          }

        })
      }
    });
    ////console.log("ChecksESSION",this.masterService.PhiscalObj.USER_PROFILE,this.masterService.PhiscalObj.setting)
  }
 
 

}