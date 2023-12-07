import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../../../../common/services/setting.service";

@Component({
  selector: "journal",
  templateUrl: "./journal.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})

export class JournalComponent {
  private returnUrl: string;
  private subcriptions: Array<Subscription> = [];
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.Journal;
  prefix: PREFIX = <PREFIX>{};

  constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private router: Router, private arouter: ActivatedRoute, private setting: SettingService) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.TrnMainObj.VoucherPrefix = 'JV';
    this.TrnMainObj.VoucherType = VoucherTypeEnum.Journal;
    this._trnMainService.pageHeading = "Journal Voucher";
  }

  ngOnInit() {
    if (!!this.arouter.snapshot.params['returnUrl']) {
      this.returnUrl = this.arouter.snapshot.params['returnUrl'];
    }

    if (!!this.arouter.snapshot.params['mode']) {
      var mode: string;
      mode = this.arouter.snapshot.params['mode'];
      this.TrnMainObj.Mode = mode == 'add' ? 'NEW' : mode.toUpperCase();
    }

    let division: string;
    let phiscalid: string;

    if (!!this.arouter.snapshot.params['div']) {
      division = this.arouter.snapshot.params['div'];
    }

    if (!!this.arouter.snapshot.params['phiscal']) {
      phiscalid = this.arouter.snapshot.params['phiscal'];
    }

    if (!!this.arouter.snapshot.params['vchrNo']) {
      let VCHR = this.arouter.snapshot.params['vchrNo'];

      this._trnMainService.loadData(VCHR, division, phiscalid);
      this._trnMainService.loadDataObservable.subscribe(data => {
        this.TrnMainObj = data;
      })
    }
  }

  onSaveClicked() {
    var data = JSON.stringify(this._trnMainService.TrnMainObj, undefined, 2);
    this.onsubmit();
  }

  prefixChanged(pref: any) {
    try {
      this._trnMainService.prefix = pref;
      this.prefix = pref;
      if (this.TrnMainObj.Mode == 'NEW') {
        var tMain = <TrnMain>{ VoucherPrefix: pref.VNAME };
        if (this.TrnMainObj.DIVISION == '' || this.TrnMainObj.DIVISION == null) {
          tMain.DIVISION = this.setting.appSetting.DefaultDivision;
        }
        this.masterService.getVoucherNo(tMain).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(2, TMain.VCHRNO.length - 2);
            this.TrnMainObj.CHALANNO = TMain.CHALANNO;
            this._trnMainService.TrnMainObj.VoucherPrefix=pref.VNAME ;
          }
          else {
            alert("Failed to retrieve VoucherNo")
          }
        });
      }
    } catch (ex) {
      alert(ex);
    }
  }

  onsubmit() {
    try {
      if (this.TrnMainObj.TrntranList[this.TrnMainObj.TrntranList.length - 1].AccountItem.ACID == null || (this.TrnMainObj.TrntranList[this.TrnMainObj.TrntranList.length - 1].DRAMNT == null && this.TrnMainObj.TrntranList[this.TrnMainObj.TrntranList.length - 1].CRAMNT == null)) {
        this.TrnMainObj.TrntranList.splice((this.TrnMainObj.TrntranList.length - 1), 1);
      }
      for (var t in this.TrnMainObj.TrntranList) {
        if (this.TrnMainObj.TrntranList[t].AccountItem.HASSUBLEDGER == 1 && this.TrnMainObj.TrntranList[t].SubledgerTranList.length != 0 && (this.TrnMainObj.TrntranList[t].SubledgerTranList[this.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1].SubledgerItem.ACID == null || (this.TrnMainObj.TrntranList[t].SubledgerTranList[this.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1].DRAMNT == null && this.TrnMainObj.TrntranList[t].SubledgerTranList[this.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1].CRAMNT == null))) {
          this.TrnMainObj.TrntranList[t].SubledgerTranList.splice((this.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1), 1);
        }
      }
      this.TrnMainObj.VoucherPrefix = this.prefix.VNAME;

      let sub = this.masterService.saveTransaction(this.TrnMainObj.Mode, this.TrnMainObj)
        .subscribe(data => {
          if (data.status == 'ok') {
            this.router.navigate([this.returnUrl]);
          }
        },
          error => { alert(error) }
        );
      // this.subcriptions.push(sub);
    }
    catch (e) {
      //this.childModal.hide()
      alert(e);
    }
  }


  onCancelClicked() {
    this.router.navigate([this.returnUrl]);
  }

  isFormValid: boolean;
  formValidCheck = (): boolean => {
    if (this._trnMainService.Warehouse == undefined || this._trnMainService.Warehouse == '') {
      return false;

    }
    if (this.TrnMainObj.ProdList == undefined) {
      return false;
    }
    else {
      if (this.TrnMainObj.ProdList.length < 1) {
        return false;
      }
    }
    // if (this.TrnMainObj.TRNAC == undefined || this.TrnMainObj.TRNAC == '') {
    //     return false;
    // }

    return true;
  }

}
