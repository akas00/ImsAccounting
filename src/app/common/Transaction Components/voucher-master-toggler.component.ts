import { AdditionalCostService } from "../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { TransactionService } from "./transaction.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
//import {TAcList} from '../../../../common/interfaces';
import { TrnMain, VoucherTypeEnum } from "../interfaces/TrnMain";
import { FormGroup } from "@angular/forms";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";
import { HotkeysService } from "angular2-hotkeys/src/hotkeys.service";
import { Hotkey } from "angular2-hotkeys";

@Component({
  selector: "voucher-master-toggler",
  templateUrl: "./voucher-master-toggler.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class VoucherMasterTogglerComponent implements OnInit {
  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";

  TrnMainObj: TrnMain = <TrnMain>{};

  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};
  // additonalCost is 99 sends from AdditionalCost component
  @Input() additionCost: number;
  @Output() additionalcostEmit = new EventEmitter();

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    public additionalCostService: AdditionalCostService,
    authservice: AuthService,
    public dialog: MdDialog,
    private _hotkeysService: HotkeysService
  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.masterService.ShowMore = true;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.voucherType = this.TrnMainObj.VoucherType;
    this.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;

    this.masterService.refreshTransactionList();
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
    ) {
      this.transactionType = "creditnote";
    }

    this._hotkeysService.add(
      new Hotkey(
        "f1",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.ShowMore();
          return false;
        }
      )
    );
  }

  ngOnInit() { }

  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
    }
  }

  ShowMore() {
    this.masterService.ShowMore = !this.masterService.ShowMore;
  }

  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }
}
