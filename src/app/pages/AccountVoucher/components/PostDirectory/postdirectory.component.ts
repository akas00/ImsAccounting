import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/index";
import { CustomerTrackingComponent } from "./CustomerTracking/customerTracking.component";
import { VoucherTrackingComponent } from "../VoucherTracking/VoucherTracking.component";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { TrnTranVoucherEntryComponent } from "../../../../common/Transaction Components/trntran-voucher-entry.component";

@Component({
  selector: "postdirectory",
  templateUrl: "./postdirectory.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})
export class PostDirectoryComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.PostDirectory;
  prefix: PREFIX = <PREFIX>{};
  @ViewChild("voucherTrack") VoucherTrackingComponent: VoucherTrackingComponent;
  @ViewChild("trnmainentry") trnmainentry: TrnTranVoucherEntryComponent;
  constructor(
    private masterService: MasterRepo,
    private _trnMainService: TransactionService,
    private setting: SettingService,
    private _hotkeysService: HotkeysService,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute

  ) {
    this.TrnMainObj = this._trnMainService.TrnMainObj;
    this._trnMainService.initialFormLoad(72);
    this.masterService.ShowMore = false;
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
            this._trnMainService.TrnMainObj.VoucherType = 72;
              this._trnMainService.pageHeading = "Post Directory";
              this._trnMainService.TrnMainObj.VoucherPrefix = "PC";
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
              this._trnMainService.TrnMainObj.VoucherType = 72;
              this._trnMainService.pageHeading = "Post Directory";
              this._trnMainService.TrnMainObj.VoucherPrefix = "PC";
              this._trnMainService.TrnMainObj.Mode = "VIEW";
            }
          }, err => {
            this._loadingSerive.hide()
            this._alertService.error(err)
          })
    
        } else {
          this.TrnMainObj.Mode = "NEW";
          this.masterService.ShowMore = false;
          this._trnMainService.TrnMainObj.TRNMODE = 'Party Receipt';
        }
      }
    });
   

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

  BillTrack() {
    this.trnmainentry.BillTrack()
  }
}
