import { Component, OnDestroy, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/setting.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { AppSettings } from "../../../../common/services/AppSettings";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { Subscriber } from "rxjs/Subscriber";
import { AutoComplete } from "primeng/components/autocomplete/autocomplete";
import { PartyOpeningDetailsPopUpComponent } from "../../../../common/popupLists/party-opening-details-popup/party-opening-details-popup.component";
//import { MdDialog } from "@angular/material/material";

@Component({
  selector: "party-opening-balance",
  templateUrl: "./party-opening-balance.component.html",
  providers: [TransactionService]
})
export class PartyOpeningBalance {
  TrnMainObj: TrnMain;
  voucherType: VoucherTypeEnum = VoucherTypeEnum.PartyOpeningBalance;
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
    this._trnMainService.initialFormLoad(23);
    this._trnMainService.DrillMode = "New";
  }

  ngOnInit() {
    this.TrnMainObj.Mode = "NEW";
    this.masterService.ShowMore = false;
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType
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
