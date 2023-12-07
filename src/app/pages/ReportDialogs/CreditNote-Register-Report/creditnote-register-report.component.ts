import { Component, Output, EventEmitter, ViewChild, Input, ElementRef } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';

@Component({
  selector: 'creditnote-register-report',
  templateUrl: './creditnote-register-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class CreditNoteRegisterReportComponent {
  CreditNoteRegisterReport: any = <any>{};

  @ViewChild('division') division: ElementRef
  private divisionList = []
  showopeningBl: string
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;

  constructor(public masterService: MasterRepo) {
    this.CreditNoteRegisterReport.DATE1 = new Date().toJSON().split('T')[0];
    this.changeEntryDate(this.CreditNoteRegisterReport.DATE1, "AD");
    this.CreditNoteRegisterReport.DATE = new Date().toJSON().split('T')[0];
    this.changeEndDate(this.CreditNoteRegisterReport.DATE, "AD");

    this.masterService.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
  }

  onload() {
    this.DialogClosedResult("ok");
  }

  public DialogClosedResult(res) {
    this.reportdataEmit.emit({
      status: res, data: {
        reportname: 'Credit Note Register Report', reportparam: {
          DATE1: this.CreditNoteRegisterReport.DATE1,
          DATE2: this.CreditNoteRegisterReport.DATE,
          DIV: this.CreditNoteRegisterReport.DIV,
          COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
        }
      }
    });
  }

  divisionChanged() {
    this.CreditNoteRegisterReport.DIV = this.division.nativeElement.value
  }

  hide() {
    this.DialogClosedResult("Error");
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.CreditNoteRegisterReport.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.CreditNoteRegisterReport.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.CreditNoteRegisterReport.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.CreditNoteRegisterReport.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  cancel() {
    this.DialogClosedResult("cancel");
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

}