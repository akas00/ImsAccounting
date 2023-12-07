import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { MasterRepo } from '../../repositories/masterRepo.service';
import { AlertService } from '../../services/alert/alert.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { TransactionService } from '../../Transaction Components/transaction.service';
import * as moment from 'moment';


@Component({
  selector: 'reverse-entry-dialog',
  templateUrl: './reverse-entry.component.html',
  styleUrls: ['./reverse-entry.component.css'],
})
export class ReverseEntryComponent implements OnInit {
  isActive: boolean = false;

  vchrno: string;
  remarks: string;
  @Output() onClickReverse: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public fb: FormBuilder, public masterservice: MasterRepo,
    public _trnMainService: TransactionService,
    private alertService: AlertService,
    public spinnerService: SpinnerService
  ) {


  }

  ngOnInit() {
  }

  submit() {

    if (this._trnMainService.TrnMainObj.AdditionalObj.CREFBILL == null || this._trnMainService.TrnMainObj.AdditionalObj.CREFBILL == "" || this._trnMainService.TrnMainObj.AdditionalObj.CREFBILL == undefined) {
      alert("Enter Voucher no.");
      return;
    }
    if (this._trnMainService.TrnMainObj.REMARKS == null || this._trnMainService.TrnMainObj.REMARKS == "" || this._trnMainService.TrnMainObj.REMARKS == undefined) {
      alert("Enter reverse entry confirmation remarks");
      return;
    }

    if (this._trnMainService.TrnMainObj.AdditionalObj.CREFBILL != this._trnMainService.TrnMainObj.VCHRNO) {
      alert(`${this._trnMainService.TrnMainObj.VoucherAbbName} no should match with the loaded Voucher No.`);
      return;
    }
    // this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.AdditionalObj.CREFBILL;
    this.onClickReverse.emit();
  }


  closeDialog() {
    this.isActive = false;
  }

  //   keyPress(event: any) {
  //     const pattern = /[0-9]/;
  //     const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
  //     if (!pattern.test(inputChar)) {
  //       // invalid character, prevent input
  //       event.preventDefault();
  //     }
  //   }

  show(billNo: string) {
    this.vchrno = billNo;
    this._trnMainService.TrnMainObj.REMARKS = "";
    this._trnMainService.TrnMainObj.TRN_DATE = new Date().toJSON().split('T')[0];
    this.changeEntryDate(this._trnMainService.TrnMainObj.TRN_DATE, "AD");
    this.isActive = true;

  }



  hide() {
    this.isActive = false;
  }

  onclear() {

  }

  //   @HostListener("document : keydown", ["$event"])
  //   handleKeyDownboardEvent($event: KeyboardEvent) {
  //     if ($event.code == "Escape") {
  //       $event.preventDefault();
  //         this.closeDialog();
  //     }
  //     if ($event.code == "End") {
  //       if(!this.form.invalid){
  //         $event.preventDefault();
  //         this.submit(this.form.value);
  //       }

  //     }
  //   }

  changeEntryDate(value, format: string) {
    this._trnMainService.TrnMainObj.TRN_DATE = value;
    //console.log("changeEntryDate",this._trnMainService.TrnMainObj.TRN_DATE);

    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this._trnMainService.TrnMainObj.BS_DATE =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var xyz = value.split("-");
      let DateValue: any = xyz[2] + "-" + xyz[1] + "-" + xyz[0];
      var bsDate = (DateValue.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
    }

  }
}
