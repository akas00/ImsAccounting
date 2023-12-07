import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { TrnMain, VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IDivision } from '../../../../common/interfaces';
import { SettingService } from '../../../../common/services';
import { AuthService } from '../../../../common/services/permission/authService.service';

@Component({
  selector: "trnmain-journal-entry",
  templateUrl: "./trnmain-journal-entry.component.html",
  styleUrls: ["../../../Style.css"],
})
export class TrnMainJournalEntryComponent {
  TrnMainObj: TrnMain = <TrnMain>{};
  TrnMainForm: FormGroup;

  transactionType: string //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = '';
  private returnUrl: string;
  divisionList: IDivision[] = [];
  TrnDate: Date;
  Trn_Date: Date;
  warehouse: string;
  private vchrno: string;
  private division: string;
  private phiscalid: string;
  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};


  constructor(private masterService: MasterRepo,
    private _trnMainService: TransactionService,
    private _fb: FormBuilder,
    private setting: SettingService,
    private authservice: AuthService
  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.voucherType = this.TrnMainObj.VoucherType;
    this.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;

    this.masterService.refreshTransactionList();

    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn) {
      this.transactionType = 'creditnote';
    }
  }

  ngOnInit() {
    this.TrnMainForm = this._fb.group({
      REMARKS: '',
      DIFFERENCE: '',
    });

    if (this.TrnMainObj.Mode == "VIEW") {
      this.TrnMainForm.get('REMARKS').disable();
    }

    this.TrnMainForm.get('DIFFERENCE').disable();

    this.TrnMainForm.valueChanges.subscribe(form => {
      this.TrnMainObj.REMARKS = form.REMARKS;
    });

    if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
      this._trnMainService.loadDataObservable.subscribe(data => {
        try {
          this.TrnMainForm.patchValue({
            REMARKS: data.REMARKS,
            DIFFERENCE: this._trnMainService.differenceAmount
          });
        } catch (e) {
        }
      });
    }
  }
}
