import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IDivision } from "./../../../../common/interfaces/commonInterface.interface";
import { SettingService } from "./../../../../common/services/setting.service";
import { CurrentDate } from "./journal.interface";
import { JournalService } from "./journal.service";
import { CommonService } from './../../../../common/services/common.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { TrnMain, Trntran, TSubLedgerTran, TSubLedger, CostCenter } from "./../../../../common/interfaces/TrnMain";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";

@Component({
  selector: 'account-details',
  template: `
                <script type="text/javascript" src="assets/js/bootstrap.min.js"></script>

                <div class="row" style="margin-top: -15px">
                    <h4 style="text-align:center; margin-bottom:0px">{{modeTitle}}Journal Voucher</h4>
                    <form [formGroup]="form">
                    <div class="col-md-12" style="border: 2px solid #E6E6E6; padding: 15px;">

                        <div style="display:inline-block">
                            <label>Voucher No: </label>

                            <button *ngIf="viewMode == false" (focus)="prefixChange()" style="height:23px; padding-top: 2px;" id="J" data-toggle="modal" data-toggle="modal" data-target="#orderModal" value="{{prefix.VNAME}}">{{prefix.VNAME}}</button>
                            <input *ngIf="viewMode == false" type="text" name="id" style="max-width: 100px; margin-left: -4px; border-bottom-left-radius: 0px; border-top-left-radius: 0px;" [readOnly]="mode=='edit'?true:false" [style.background-color]="disabled()" [style.cursor]="disabledCursor()" formControlName="VCHRNO">
                            <input *ngIf="viewMode == true" type="text" name="id" style="max-width: 100px; padding-left:4px; color:black;" [readOnly]="mode=='edit'?true:false" [style.background-color]="disabled()" [style.cursor]="disabledCursor()" formControlName="VCHRNO">
                            <div class="alert-danger" *ngIf="form.controls['VCHRNO'].touched && !form.controls['VCHRNO'].valid">Voucher number is required.</div>
                        </div>
                        <div style="display:inline-block">
                            <label style="margin-left: 15px">Chalan No: </label>
                            <input type="text" name="rate" style="max-width: 100px; padding-left:4px; color:black;" [readOnly]="mode=='edit'?true:false" [style.background-color]="disabled()" [style.cursor]="disabledCursor()" formControlName="CHALANNO">
                            <div class="alert-danger" *ngIf="form.controls['CHALANNO'].touched && !form.controls['CHALANNO'].valid">Chalan number is required.</div>
                        </div>
                        <div style="display:inline-block">
                            <label style="margin-left: 15px">Date: </label>
                            <input [readOnly]="enableDateChange == false?true:false" [style.cursor]="disabledCursor()" [style.background-color]="dateDisabled()" type="date" name="id" style="margin-right: 5px; height: 23px; padding-left:4px; color:black;" formControlName="TRN_DATE" (change)="changeTrnMainDate($event.target.value,'AD')">A.D.
                            <div class="alert-danger" *ngIf="form.controls['TRN_DATE'].touched && !form.controls['TRN_DATE'].valid">AD date is required.</div>
                        </div>
                        <div style="display:inline-block">
                            <input *ngIf="enableDateChange == false" [style.cursor]="disabledCursor()" [readOnly]="enableDateChange == false?true:false" [style.background-color]="dateDisabled()" type="text" style="padding-left:4px; color:black;margin-left: 15px;margin-right: 5px; max-width: 90px;" formControlName="BS_DATE" placeholder="yyyy-mm-dd">
                            <input *ngIf="enableDateChange == true" [style.cursor]="disabledCursor()" onclick="showNdpCalendarBox('nepaliDate')" type="text"  id="nepaliDate" style="padding-left:4px; color:black;margin-left: 15px;margin-right: 5px; max-width: 90px;" formControlName="BS_DATE" (change)="changeTrnMainDate($event.target.value,'BS');" placeholder="yyyy-mm-dd" (click)="focusDate($event.target.value)">B.S.
                            <div class="alert-danger" *ngIf="form.controls['BS_DATE'].touched && !form.controls['BS_DATE'].valid">BS date is required.</div>
                        </div>
                        <div style="display:inline-block">
                            <label style="margin-left: 15px">A/C Bal:</label>
                        </div>
                    </div>

                    <div class="col-md-12" style="border: 2px solid #E6E6E6; padding: 15px; margin-top:5px;">
                        <div style="display:inline-block">
                            <label>Narration: </label>
                            <textarea name="quantity" [style.cursor]="disabledCursor()" formControlName="REMARKS" rows="2" style="padding-left:4px; color:black; vertical-align: top; resize:none; max-width: 800px; width: 450px"></textarea>
                        </div>
                        <div style="display:inline-block">
                            <label style="margin-left: 20px;">Division: </label>
                            <select [style.background-color]="disabledOnView()" [style.cursor]="disabledCursor()" name="amount" formControlName="DIVISION" style="height: 23px; color:black;">
                                <option *ngFor="let list of divisionList" [ngValue]="list.INITIAL">{{list.NAME}}</option>
                            </select>
                            <div class="alert-danger" *ngIf="form.controls['DIVISION'].touched && !form.controls['DIVISION'].valid">Division is required.</div>
                        </div>
                        <div style="display:inline-block">
                            <label style="margin-left: 20px">Difference Amount: </label>
                            <input type="text" [style.cursor]="disabledCursor()" name="amount" style="max-width: 90px; padding-left:4px; color:black;" disabled value="{{amount}}">
                        </div>

                    </div>
                    </form>
                </div>
                <journal (difference)="amount = $event"></journal>
                <SeriesDialog [voucherType]="voucherType" (sendPrefix)="prefixChanged($event)"></SeriesDialog>

    `,
  styleUrls: ["./../../../../../assets/css/styles.css"],
  providers: [JournalService],
})

export class AccountDetailsComponent {
  public trnMain: TrnMain = <TrnMain>{};
  public divisionList: IDivision[] = [];
  private voucherNo: string;
  private enableDateChange = false;
  private enablePreviousDateChange = true;
  voucherType: VoucherTypeEnum = VoucherTypeEnum.Journal;
  amount: number;
  prefix: PREFIX = <PREFIX>{};
  form: FormGroup;
  mode: string = "";
  modeTitle: string = '';
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  currentDate: any = <any>{};
  viewMode = false;


  constructor(private masterService: MasterRepo, private _journalService: JournalService, private _activatedRoute: ActivatedRoute, private _fb: FormBuilder, private settingService: SettingService) {
    try {
      this.trnMain = <TrnMain>{};
      if (!!_activatedRoute.snapshot.params['vchrNo']) {
        // this.voucherNo = _activatedRoute.snapshot.params['vchrNo'].replace("JV", "");
        // this.trnMain.vchrNo = this.voucherNo;
        // this.trnMain.chalanNo = _activatedRoute.snapshot.params['chalanNo'];
      }
      if (!!_activatedRoute.snapshot.params['vt']) {
        this.voucherType = _activatedRoute.snapshot.params['vt'].replace("JV");

      }
      this.voucherType == VoucherTypeEnum.Journal
      this.enableDateChange = this.settingService.appSetting.enableDateChange;
    } catch (ex) {
      alert(ex);
    }

  }

  ngOnInit() {
    try {
      this.masterService.getDivisions().subscribe(res => { this.divisionList = res; });

      this.form = this._fb.group({
        VCHRNO: ['', Validators.required],
        CHALANNO: ['', Validators.required],
        TRN_DATE: ['', Validators.required],
        BS_DATE: ['', Validators.required],
        REMARKS: [''],
        DIVISION: ['', Validators.required],
      });

      if (!!this._activatedRoute.snapshot.params['mode']) {
        if (this._activatedRoute.snapshot.params['mode'] == "view") {
          this.viewMode = true;
          this.form.get('VCHRNO').disable();
          this.form.get('CHALANNO').disable();
          this.form.get('TRN_DATE').disable();
          this.form.get('BS_DATE').disable();
          this.form.get('DIVISION').disable();
          this.form.get('REMARKS').disable();
        }
      }
      let VCHRNO;
      let division;
      let phiscalid;
      if (!!this._activatedRoute.snapshot.params['div']) {
        division = this._activatedRoute.snapshot.params['div'];
      }
      if (!!this._activatedRoute.snapshot.params['phiscal']) {
        phiscalid = this._activatedRoute.snapshot.params['phiscal'];
      }
      if (!!this._activatedRoute.snapshot.params['mode']) {
        if (this._activatedRoute.snapshot.params['mode'] == "view") {
          this.viewMode = true;
        }
        if (!!this._activatedRoute.snapshot.params['vchrNo']) {
          VCHRNO = this._activatedRoute.snapshot.params['vchrNo'];
        }
        if (VCHRNO != undefined && phiscalid != undefined && phiscalid != undefined) {
          this.masterService.LoadTransaction(VCHRNO, division, phiscalid)
            .subscribe(data => {
              if (data.status == 'ok') {
                this.form.patchValue({
                  VCHRNO: data.result.VCHRNO,
                  CHALANNO: data.result.CHALANNO,
                  TRN_DATE: ((data.result.TRNDATE == null) ? "" : data.result.TRNDATE.substring(0, 10)),
                  BS_DATE: data.result.BSDATE,
                  REMARKS: data.result.REMARKS,
                  DIVISION: data.result.DIVISION,
                });

                let self = this;
                if (this._activatedRoute.snapshot.params['mode'] == null) {
                  self.modeTitle = "Edit ";
                } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                  self.modeTitle = "View ";
                }
                self.mode = 'edit';
                self.initialTextReadOnly = true;
                var res = (this.form.get('BS_DATE').value).split('/');
                this.form.get('BS_DATE').setValue(res[2] + '-' + (res[1].length == 1 ? '0' + res[1] : res[1]) + '-' + (res[0].length == 1 ? '0' + res[0] : res[0]));
                this.prefix.VNAME = data.result.VCHRNO.substring(0, 2);
              }
              else {
                this.mode = '';
                this.modeTitle = "Edit - Error in ";
                this.initialTextReadOnly = true;
              }
            }, error => {
              this.mode = '';
              this.modeTitle = "Edit2 - Error in ";
              this.masterService.resolveError(error, "Journal account-details - LoadTransaction");
            }
            );
        }
        else {
          this.mode = "add";
          this.modeTitle = "Add ";
          this.initialTextReadOnly = false;
          this.form.get("DIVISION").setValue(this.settingService.appSetting.DefaultDivision);
          this.masterService.getCurrentDate().subscribe(date => { this.currentDate = date.Date; this.form.get('TRN_DATE').setValue(date.Date.substring(0, 10)); this.changeTrnMainDate(date.Date.substring(0, 10), "AD") });

        }

        this.disabled();
      }
    } catch (ex) {
      alert(ex);
    }
  }

  disabled() {
    try {
      if (this.mode == "edit") {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  dateDisabled() {
    try {
      if (this.enableDateChange == false) {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  disabledOnView() {
    try {
      if (this.viewMode == true) {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  disabledCursor() {
    try {
      if (this.viewMode == true) {
        return "not-allowed";
      } else {
        return "";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  prefixChange() {
    if (this.prefix.VNAME != undefined) {
    }
  }

  prefixChanged(pref: any) {
    try {
      this.prefix = pref;
      if (this.mode == 'add') {

        var tMain = <TrnMain>{};
        tMain.VoucherPrefix = this.prefix.VNAME;
        if (this.form.controls['DIVISION'].value == '' || this.form.controls['DIVISION'].value == null) {
          tMain.DIVISION = this.settingService.appSetting.DefaultDivision;
        }

        this.masterService.getVoucherNo(tMain).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this.form.patchValue({
              VCHRNO: TMain.VCHRNO.substr(2, TMain.VCHRNO.length - 2),
              CHALANNO: TMain.CHALANNO,
            });
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

  changeTrnMainDate(value, format: string) {
    try {
      var adbs = require("ad-bs-converter");
      if (format == "AD") {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this.form.get("BS_DATE").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
      }
      else if (format == "BS") {
        var bsDate = (value.replace("-", "/")).replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this.form.get("TRN_DATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      }
    } catch (ex) {
      alert(ex);
    }
  }
  focusDate(value) {
    try {
      if (value != null && value != 0) {
        var adbs = require("ad-bs-converter");
        var bsDate = (value.replace("-", "/")).replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this.form.get("TRN_DATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      }
    } catch (ex) {
      alert(ex);
      // a
    }
  }

}
