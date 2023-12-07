import { Component, Output, EventEmitter, ViewChild, Input, ElementRef } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';

@Component({
  selector: 'vat-purchase-register-report',
  templateUrl: './vat-purchase-register-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class VATpurchaseRegisterReportComponent {
  VATpurchaseRegisterReport: any = <any>{};

  @ViewChild('division') division: ElementRef
  private divisionList = []
  showopeningBl: string
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;


  constructor(public masterService: MasterRepo) {
    this.VATpurchaseRegisterReport.DATE1 = new Date().toJSON().split('T')[0];
    this.changeEntryDate(this.VATpurchaseRegisterReport.DATE1, "AD");
    this.VATpurchaseRegisterReport.DATE = new Date().toJSON().split('T')[0];
    this.changeEndDate(this.VATpurchaseRegisterReport.DATE, "AD");

    this.masterService.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
  }

  onload() {
    this.DialogClosedResult("ok");

  }

  public DialogClosedResult(res) {
    if (this.VATpurchaseRegisterReport.isPI == true) {
      this.VATpurchaseRegisterReport.V1 = 'PI'
    } else {
      this.VATpurchaseRegisterReport.V1 = ''
    }
    if (this.VATpurchaseRegisterReport.isCP == true) {
      this.VATpurchaseRegisterReport.V2 = 'CP'
    } else {
      this.VATpurchaseRegisterReport.V2 = ''
    }
    if (this.VATpurchaseRegisterReport.isDN == true) {
      this.VATpurchaseRegisterReport.V3 = 'DN'
    } else {
      this.VATpurchaseRegisterReport.V3 = ''
    }
    if (this.VATpurchaseRegisterReport.isCN == true) {
      this.VATpurchaseRegisterReport.V4 = 'CN'
    } else {
      this.VATpurchaseRegisterReport.V4 = ''
    }
    this.reportdataEmit.emit({
      status: res, data: {
        reportname: 'VAT Purchase Register Report', reportparam: {
          DATE1: this.VATpurchaseRegisterReport.DATE1,
          DATE2: this.VATpurchaseRegisterReport.DATE,
          DIV: this.VATpurchaseRegisterReport.DIV,
          COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
          PHISCALID: this.masterService.PhiscalObj.PhiscalID,
          V1: this.VATpurchaseRegisterReport.V1,
          V2: this.VATpurchaseRegisterReport.V2,
          V3: this.VATpurchaseRegisterReport.V3,
          V4: this.VATpurchaseRegisterReport.V4,
          isPI: false,
          isCP: false,
          isCN: false,
          isDN: false

        }
      }
    });
  }

  divisionChanged() {
    this.VATpurchaseRegisterReport.DIV = this.division.nativeElement.value
  }

  hide() {
    this.DialogClosedResult("Error");
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.VATpurchaseRegisterReport.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.VATpurchaseRegisterReport.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.VATpurchaseRegisterReport.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.VATpurchaseRegisterReport.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
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
