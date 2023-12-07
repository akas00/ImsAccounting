import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { ActivatedRoute } from "@angular/router";
import { TrnTranVoucherEntryComponent } from "../../../../common/Transaction Components/trntran-voucher-entry.component";

@Component({
  selector: 'payment-single',
  templateUrl: './payment-single.component.html',
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})

export class PaymentSingleComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.SinglePayment;
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
    this._trnMainService.initialFormLoad(65);
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['from']) {
      let VCHR = this._activatedRoute.snapshot.params['voucherNumber']
      let params = []
      params = VCHR.split('-')
      this._loadingSerive.show("Loading Invoice")
      this.masterService.LoadTransaction(VCHR, params[1], params[2]).subscribe((res) => {
        if (res.status == "ok") {
          this._loadingSerive.hide()
          this._trnMainService.TrnMainObj = res.result;
          this._trnMainService.TrnMainObj.VoucherType = 65;
          this._trnMainService.pageHeading = "Single Voucher";
          this._trnMainService.TrnMainObj.VoucherPrefix = "SV";
          this._trnMainService.TrnMainObj.Mode = "VIEW";
        }
      }, err => {
        this._loadingSerive.hide()
        this._alertService.error(err)
      })

    } else {
      this.TrnMainObj.Mode = "NEW";
      this.masterService.ShowMore = true;
    }
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
