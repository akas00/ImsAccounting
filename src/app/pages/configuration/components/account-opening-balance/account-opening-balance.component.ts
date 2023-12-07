import { Component } from "@angular/core";
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { FormGroup } from "@angular/forms";
import { AppSettings } from "../../../../common/services/AppSettings";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { TAcList } from "../../../../common/interfaces/Account.interface";

@Component({
  selector: "account-opening-balance",
  templateUrl: "./account-opening-balance.component.html",
  providers: [TransactionService]
})
export class AccountOpeningBalance {
  TrnMainObj: TrnMain;
  voucherType: VoucherTypeEnum = VoucherTypeEnum.AccountOpeningBalance;
  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  form: FormGroup;
  accountList: TAcList[];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();

  results: Observable<TAcList[]>;
  selectedAccount: TAcList;
  TranList: any[] = [];
  TotalDebit: number;
  TotalCredit: number;
  previousOpeningAccountData: any[] = [];

  constructor(
    public masterService: MasterRepo,
    private _trnMainService: TransactionService,
    private setting: SettingService,
    private AppSettings: AppSettings,
    public dialog: MdDialog
  ) {
    this.TrnMainObj = this._trnMainService.TrnMainObj;
    this.TrnMainObj.DIVISION = this.AppSettings.DefaultDivision;
    this._trnMainService.initialFormLoad(22);
  }

  ngOnInit() {
    this.TrnMainObj.Mode = "NEW";
    this.masterService.ShowMore = false;
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType
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
}
