import { Component } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../../common/services/permission";

@Component({
  selector: "credit-note",
  templateUrl: "./credit-note.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})
export class CreditNoteComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.CreditNote;
  prefix: PREFIX = <PREFIX>{};
  userSetting: any;

  constructor(
    private masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute,
    private authservice: AuthService
  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this._trnMainService.initialFormLoad(15);
    this._trnMainService.TrnMainObj.VATBILL = 0;
    this.userSetting = authservice.getSetting()
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
            //console.log("salesreturn", this.userSetting,this.userSetting.Vat_Sales)
            let abc = this._trnMainService.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.userSetting.Vat_Sales);
            //console.log("abc", abc)
            if (abc >= 0) {
              this._trnMainService.TrnMainObj.TrntranList.splice(abc, 1)
            }
            this._trnMainService.TrnMainObj.VoucherType = 15;
            this._trnMainService.pageHeading = "CreditNote";
            this._trnMainService.TrnMainObj.VoucherPrefix = "CN";
            this._trnMainService.TrnMainObj.Mode = "VIEW";
            this._trnMainService.viewDate.next();
          }
        }, err => {
          this._loadingSerive.hide()
          this._alertService.error(err)
        })
  
      }else{
        this.TrnMainObj.Mode = "NEW";
    this.masterService.ShowMore = false;
    this._trnMainService.TrnMainObj.ProdList = [];
    this._trnMainService.TrnMainObj.IsAccountBase = true;
    this._trnMainService.TrnMainObj.CNDN_MODE = 1;
      }
    })

    


  }

  prefixChanged(pref: any) {
    try {
      this._trnMainService.prefix = pref;
      this.prefix = pref;
      if (this.TrnMainObj.Mode == "NEW") {
        var tMain = <TrnMain>{ VoucherPrefix: pref.VNAME };
        if (
          this.TrnMainObj.DIVISION == "" ||
          this.TrnMainObj.DIVISION == null
        ) {
          tMain.DIVISION = this.setting.appSetting.DefaultDivision;
        }
        this.masterService.getVoucherNo(tMain).subscribe(res => {
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
}
