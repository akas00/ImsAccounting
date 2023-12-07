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

@Component({
  selector: "voucher-message-remarks",
  templateUrl: "./voucher-message-remarks.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class VoucherMessageRemarksComponent implements OnInit {
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
    public dialog: MdDialog
  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.masterService.ShowMore = false;
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
