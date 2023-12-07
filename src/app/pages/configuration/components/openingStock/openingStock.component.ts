import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/setting.service";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppSettings } from "../../../../common/services/AppSettings";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";
//import { MdDialog } from "@angular/material/material";

@Component({
  selector: "openingStock",
  templateUrl: "./openingStock.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})

export class OpeningStockComponent {
  private returnUrl: string;
  invoiceType: string;
  private subcriptions: Array<Subscription> = [];
  TrnMainObj: TrnMain;
  voucherType: VoucherTypeEnum = VoucherTypeEnum.OpeningStockBalance;
  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  form: FormGroup;
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  constructor(public masterService: MasterRepo, private _trnMainService: TransactionService, private router: Router, private arouter: ActivatedRoute, private _hotkeysService: HotkeysService, private setting: SettingService, private _fb: FormBuilder, private AppSettings: AppSettings, public dialog: MdDialog) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.TrnMainObj.DIVISION = this.AppSettings.DefaultDivision;
    this.TrnMainObj.VoucherPrefix = 'OP';
    this.TrnMainObj.VoucherName = 'OPBILL';
    this.TrnMainObj.VoucherAbbName = 'OP';
    this.TrnMainObj.VoucherType = VoucherTypeEnum.OpeningStockBalance;
    this._trnMainService.pageHeading = "Opening Stock";
    this.voucherType = VoucherTypeEnum.OpeningStockBalance;

  }

  ngOnInit() {
    this.form = this._fb.group({
      CHALANNO: [''],
      DIVISION: [this.AppSettings.DefaultDivision, Validators.required],

    });
    if (!!this.arouter.snapshot.params['returnUrl']) {
      this.returnUrl = this.arouter.snapshot.params['returnUrl'];
    }
    var mode: string;
    if (!!this.arouter.snapshot.params['mode']) {
      mode = this.arouter.snapshot.params['mode'];
      this.TrnMainObj.Mode = mode == 'add' ? 'NEW' : mode.toUpperCase();
    }

    if (mode.toUpperCase() == "VIEW") {
      let division: string;
      let phiscalid: string;
      let VNO: string;
      if (!!this.arouter.snapshot.params['div']) {
        division = this.arouter.snapshot.params['div'];
      }

      if (!!this.arouter.snapshot.params['phiscal']) {
        phiscalid = this.arouter.snapshot.params['phiscal'];
      }
      if (!!this.arouter.snapshot.params['c']) {
        VNO = this.arouter.snapshot.params['c'];
      }
      this.masterService.getSingleObject({ VNO: VNO, division: division, phiscalid: phiscalid }, '/getopeningstockbyvno').subscribe(
        data => {
          if (data.status == 'ok') {
            this.TrnMainObj.ProdList = data.result;
            this._trnMainService.TrnMainObj = this.TrnMainObj;
            this.form.patchValue({ DIVISION: division, CHALANNO: VNO });


          }
        }
      )
    }


  }
  onSaveClicked() {
    if (this.form.value.DIVISION == null) { alert("Division Compulsory"); return; }
    this.dialogMessageSubject.next("Saving Data please wait...");
    var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })

    this.TrnMainObj.DIVISION = this.form.value.DIVISION;
    let sub = this.masterService.getSingleObject({ TrnMainObj: this.TrnMainObj }, '/saveopeningstock')
      .subscribe(data => {
        if (data.status == 'ok') {
          this.TrnMainObj.ProdList = [];
          this.dialogMessageSubject.next("Data Saved Successfully")
          this.router.navigate([this.returnUrl]);
          setTimeout(() => {
            dialogRef.close();
          }, 1000)
        }
        else {
          this.dialogMessageSubject.next(data.result);
          setTimeout(() => {
            dialogRef.close();
          }, 3000)
        }
      },
        error => { alert(error) },
      )


    this.subcriptions.push(sub);
  }
  onCancelClicked() {
    this.router.navigate([this.returnUrl]);
  }

}
