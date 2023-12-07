import { Component, Output, EventEmitter, ViewChild, Input, ElementRef } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';

@Component({
  selector: 'vat-sales-register-report',
  templateUrl: './vat-sales-register-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class VATsalesRegisterReportComponent {
  VATsalesRegisterReport: any = <any>{};

  @ViewChild('division') division: ElementRef
  private divisionList = []
  showopeningBl: string
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;


  constructor(public masterService: MasterRepo) {
    this.VATsalesRegisterReport.DATE1 = new Date().toJSON().split('T')[0];
    this.changeEntryDate(this.VATsalesRegisterReport.DATE1, "AD");
    this.VATsalesRegisterReport.DATE = new Date().toJSON().split('T')[0];
    this.changeEndDate(this.VATsalesRegisterReport.DATE, "AD");

    this.masterService.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
  }

  onload() {
    this.DialogClosedResult("ok");

  }

  public DialogClosedResult(res) {
    if (this.VATsalesRegisterReport.isSI == true) {
      this.VATsalesRegisterReport.V1 = 'SI'
    } else {
      this.VATsalesRegisterReport.V1 = ''
    }
    if (this.VATsalesRegisterReport.isCN == true) {
      this.VATsalesRegisterReport.V2 = 'CN'
    } else {
      this.VATsalesRegisterReport.V2 = ''
    }
    if (this.VATsalesRegisterReport.isDN == true) {
      this.VATsalesRegisterReport.V3 = 'DN'
    } else {
      this.VATsalesRegisterReport.V3 = ''
    }
    this.reportdataEmit.emit({
      status: res, data: {
        reportname: 'VAT Sales Register Report', reportparam: {
          DATE1: this.VATsalesRegisterReport.DATE1,
          DATE2: this.VATsalesRegisterReport.DATE,
          DIV: this.VATsalesRegisterReport.DIV,
          COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
          REPORTMODE: this.VATsalesRegisterReport.SUMMARYREPORT,
          V1: this.VATsalesRegisterReport.V1,
          V2: this.VATsalesRegisterReport.V2,
          V3: this.VATsalesRegisterReport.V3,
          isSI: false,
          isCN: false,
          isDN: false
        }
      }
    });
  }

  divisionChanged() {
    this.VATsalesRegisterReport.DIV = this.division.nativeElement.value
  }

  hide() {
    this.DialogClosedResult("Error");
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.VATsalesRegisterReport.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.VATsalesRegisterReport.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.VATsalesRegisterReport.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.VATsalesRegisterReport.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
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
