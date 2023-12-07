import { Component, Output, EventEmitter, ViewChild, Input, ElementRef } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';

@Component({
  selector: 'one-lakh-above-SALES-report',
  templateUrl: './one-lakh-above-SALES-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class OneLakhAboveSALESreportComponent {
  OneLakhAboveSalesReport: any = <any>{};

  @ViewChild('division') division: ElementRef
  private divisionList = []
  showopeningBl: string
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;


  constructor(public masterService: MasterRepo) {
    this.OneLakhAboveSalesReport.DATE1 = new Date().toJSON().split('T')[0];
    this.changeEntryDate(this.OneLakhAboveSalesReport.DATE1, "AD");
    this.OneLakhAboveSalesReport.DATE = new Date().toJSON().split('T')[0];
    this.changeEndDate(this.OneLakhAboveSalesReport.DATE, "AD");

    this.masterService.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
  }

  onload() {
    this.DialogClosedResult("ok");

  }

  public DialogClosedResult(res) {
    if (this.OneLakhAboveSalesReport.isR1 == true) {
      this.OneLakhAboveSalesReport.R1 = '1'
    } else {
      this.OneLakhAboveSalesReport.R1 = ''
    }
    if (this.OneLakhAboveSalesReport.isR2 == true) {
      this.OneLakhAboveSalesReport.R2 = '1'
    } else {
      this.OneLakhAboveSalesReport.R2 = ''
    }
    if (this.OneLakhAboveSalesReport.isR3 == true) {
      this.OneLakhAboveSalesReport.R3 = '1'
    } else {
      this.OneLakhAboveSalesReport.R3 = ''
    }
    this.reportdataEmit.emit({
      status: res, data: {
        reportname: 'One Lakh Above Sales Report', reportparam: {
          DATE1: this.OneLakhAboveSalesReport.DATE1,
          DATE2: this.OneLakhAboveSalesReport.DATE,
          DIV: this.OneLakhAboveSalesReport.DIV,
          COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
          R1: this.OneLakhAboveSalesReport.R1,
          R2: this.OneLakhAboveSalesReport.R2,
          R3: this.OneLakhAboveSalesReport.R3,
          DETAIL: '0',
          PARTY: '%',
          VATNO: '%',
          isR1: false,
          isR2: false,
          isR3: false
        }
      }
    });
  }

  divisionChanged() {
    this.OneLakhAboveSalesReport.DIV = this.division.nativeElement.value
  }

  hide() {
    this.DialogClosedResult("Error");
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.OneLakhAboveSalesReport.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.OneLakhAboveSalesReport.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.OneLakhAboveSalesReport.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.OneLakhAboveSalesReport.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
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
