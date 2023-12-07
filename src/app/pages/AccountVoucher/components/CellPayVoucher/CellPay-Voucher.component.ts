import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SettingService } from "../../../../common/services/index";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TrnTranVoucherEntryComponent } from "../../../../common/Transaction Components/trntran-voucher-entry.component";

@Component({
  selector: "cellpay-voucher",
  templateUrl: "./CellPay-Voucher.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})
export class CellPayVoucherComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.PaymentVoucher;
  prefix: PREFIX = <PREFIX>{};
  @ViewChild("trnmainentry") trnmainentry: TrnTranVoucherEntryComponent;

  constructor(
    private masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.TrnMainObj = this._trnMainService.TrnMainObj;
    this._trnMainService.initialFormLoad(75);
    this.masterService.ShowMore = false;
    // this._trnMainService.TrnMainObj.TRNAC = "AG10278";
    //       this._trnMainService.TrnMainObj.TRNACName = "NIBL";
    //       this._trnMainService.masterSelectACID = "AG10278";
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
        let VCHR = params['voucher']
        let vparams = []
        vparams = VCHR.split('-')
        this._loadingSerive.show("Loading Invoice")
        this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
          if (res.status == "ok") {
            this._loadingSerive.hide()
            this._trnMainService.TrnMainObj = res.result;
            this._trnMainService.TrnMainObj.VoucherType = 17;
              this._trnMainService.pageHeading = "CellPay Voucher";
              this._trnMainService.TrnMainObj.VoucherPrefix = "PV";
            this._trnMainService.TrnMainObj.Mode = "VIEW";
            this._trnMainService.viewDate.next();
          }
        }, err => {
          this._loadingSerive.hide()
          this._alertService.error(err)
        })
  
      }else{
        if (this._activatedRoute.snapshot.params['from']) {
          let VCHR = this._activatedRoute.snapshot.params['voucherNumber']
          let params = []
          params = VCHR.split('-')
          this._loadingSerive.show("Loading Invoice")
          this.masterService.LoadTransaction(VCHR, params[1], params[2]).subscribe((res) => {
            if (res.status == "ok") {
              this._loadingSerive.hide()
              this._trnMainService.TrnMainObj = res.result;
              this._trnMainService.TrnMainObj.VoucherType = 17;
              this._trnMainService.pageHeading = "CellPay Voucher";
              this._trnMainService.TrnMainObj.VoucherPrefix = "PV";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
            }
          }, err => {
            this._loadingSerive.hide()
            this._alertService.error(err)
          })
    
        } else {
          this.TrnMainObj.Mode = "NEW";
          this.masterService.ShowMore = false;
        }
      }
    })
    this._trnMainService.DrillMode = "New";
   
  }

  prefixChanged(pref: any) {
    try {
      this._trnMainService.prefix = pref;
      this.prefix = pref;
      if (this.TrnMainObj.Mode == "NEW") {
        if (
          this.TrnMainObj.DIVISION == "" ||
          this.TrnMainObj.DIVISION == null
        ) {
          this.TrnMainObj.DIVISION = this.setting.appSetting.DefaultDivision;
        }
        this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(
              2,
              TMain.VCHRNO.length - 2
            );
            this.TrnMainObj.CHALANNO = TMain.CHALANNO;
          } else {
            alert("Failed to retrieve VoucherNo");
          }
        });
      }
    } catch (ex) {
    }
  }

  BillTrack() {
    this.trnmainentry.BillTrack()
  }
}
