import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
export interface DialogInfo {
  header: string;
  message: Observable<string>;
}
@Component({
  selector: 'postdated-report-selector',
  templateUrl: './post-dated-chequereport.component.html',
  styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class PostDatedChequeVoucherReport implements OnInit {
  division: any[] = [];
  CostcenterList: any[] = [];
  userProfile: any;
  date1: any;
  date2: any;
  instanceWiseRepName: string = 'Post Dated Cheque Voucher Report';
  @ViewChild("genericGridPartyLedger") genericGridPartyLedger: GenericPopUpComponent;
    gridPopupSettingsForPartyLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridACListParty")
    genericGridACListParty: GenericPopUpComponent;
    gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @Output() reportdataEmit = new EventEmitter();
  constructor(private masterService: MasterRepo, private _authService: AuthService,
    private _reportFilterService: ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
    public reportService: ReportFilterService, private alertService: AlertService,private _transactionService: TransactionService,
    public dialogref: MdDialogRef<PostDatedChequeVoucherReport>,
    @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
    this.userProfile = this._authService.getUserProfile();

    this.division = [];
    if (this.masterService.userSetting.userwisedivision == 1) {
      this.masterService.getDivisionFromRightPrivelege().subscribe(res => {
        if (res.status == 'ok') {
          this.division = res.result;
        }
      })
    }
    else {
      this.masterService.getAllDivisions()
        .subscribe(res => {
          this.division.push(<Division>res);
        }, error => {
          this.masterService.resolveError(error, "divisions - getDivisions");
        });
    }

    this.masterService.getCostcenter().subscribe(res => {
      this.CostcenterList = res;
    })
  }

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      const mode = params.mode;
      if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname == 'Post Dated Cheque Voucher Report' && this._reportFilterService.PostDatedChequeObj.assignPrevioiusDate != true) {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1 = this.reportService.drillParam.reportparam.DATE1;
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = this.reportService.drillParam.reportparam.DATE2;
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV = this.reportService.drillParam.reportparam.DIV;
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter = this.reportService.drillParam.reportparam.COSTCENTER;
      } else {
        if (this._reportFilterService.PostDatedChequeObj.assignPrevioiusDate != true) {
          this.masterService.getAccDivList();
          // this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
          // if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
          //   this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = new Date().toJSON().split('T')[0];
          //   this.changeEndDate(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2, "AD");
          // }
          // else {
          //   this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
          //   this.changeEndDate(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2, "AD");
          // }
          this.masterService.viewDivision.subscribe(() => {
            if (this.masterService.userSetting.userwisedivision == 0 || this.masterService.showAll == true) { //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
              this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV = '%';
            } else {
              if (this.masterService.userSetting.userwisedivision == 1 && this.division.length == 1) {
                this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV = this.division[0].INITIAL;
              } else {
                this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
              }
            }
          })
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter = '%';
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_TRANTYPE = 'Party Receipt';
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DETAILSREPORT = '0';
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_TRANSACTIONMODE = '0';
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CHEQUEDATEWISEREPORT = '0';
          this.ChangeDate();
        }

        if (params.instancename) {
          // ////console.log("@@[Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
          this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
        }
      }
    });

    this.changeEntryDate(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1, "AD");
    this.changeEndDate(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2, "AD");

  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
      if (Validatedata == true) {
        const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
        var adDate1 = adbs.bs2ad(bsDate1);
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
      } else {
        this.alertService.error("Cannot Change the date");
        return;
      }


    }
  }

  changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
      // if (Validatedata == true) {
        const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
        var adDate1 = adbs.bs2ad(bsDate1);
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
      // } else {
      //   this.alertService.error("Cannot Change the date");
      //   return;
      // }

    }
  }

  changeEntryCDate(value, format: string) { }
  changeEndCDate(value, format: string) { }

  onload() {
    this.DialogClosedResult("ok");
  }

  closeReportBox() {
    this.DialogClosedResult("Error!");
  }

  public DialogClosedResult(res) {
    this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV = (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV == null || this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV == "") ? "%" : this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV;

    let multipleReportFormateName = '';
    if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DETAILSREPORT == 1) {
      multipleReportFormateName = 'Post Dated Cheque Voucher Report_1';
    } else {
      multipleReportFormateName = 'Post Dated Cheque Voucher Report';
    }

    if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV && this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV == '%') {
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIVISIONNAME = 'All';
    } else if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV && this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV != '%') {
      let abc = this.division.filter(x => x.INITIAL == this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV);
      if (abc && abc.length > 0 && abc[0]) {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIVISIONNAME = abc[0].NAME;
      } else {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIVISIONNAME = '';
      }
    } else {
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIVISIONNAME = '';
    }

    if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter && this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter == '%') {
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_COSTCENTERDISPLAYNAME = '';
    }
    else if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter != '%') {
      let abc = this.CostcenterList.filter(x => x.CCID == this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter);
      if (abc && abc.length > 0 && abc[0]) {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
      } else {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_COSTCENTERDISPLAYNAME = '';
      }
    } else {
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_COSTCENTERDISPLAYNAME = '';
    }

    if(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYNAME==""){
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYID='%';
    }

    if(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKNAME==""){
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKID='%';
    }

    if (res == "ok") {
      this._reportFilterService.PostDatedChequeObj.assignPrevioiusDate = true;
      let routepaths = this.arouter.url.split('/');
      let activeurlpath2;
      if (routepaths && routepaths.length) {
        activeurlpath2 = routepaths[routepaths.length - 1]
      }

      if (this._reportFilterService.loadedTimesD == 0) {
        this._reportFilterService.previouslyLoadedReportList.push(
          {
            reportname: 'Post Dated Cheque Report',
            activeurlpath: this.arouter.url,
            instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.loadedTimesD,
            activerurlpath2: activeurlpath2,
          });
      } else {
        this._reportFilterService.previouslyLoadedReportList.push(
          {
            reportname: 'Post Dated Cheque Report' + '_' + this._reportFilterService.loadedTimesD,
            activeurlpath: this.arouter.url,
            instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.loadedTimesD,
            activerurlpath2: activeurlpath2,
          });
      }

    }

    this.reportdataEmit.emit({
      status: res, data: {
        REPORTDISPLAYNAME: 'Post Dated Cheque Voucher Report',
        reportname: multipleReportFormateName, instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.loadedTimesD, reportparam: {
          DATE1: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1,
          DATE2: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2,
          BSDATE1: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BSDATE1,
          BSDATE2: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BSDATE2,
          DIV: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIV,
          PHISCALID: this.masterService.PhiscalObj.PhiscalID,
          COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
          CCENTER: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter ? this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter : '%',
          TRANTYPE: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_TRANTYPE,
          DETAILSREPORT: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DETAILSREPORT,
          TRANSACTIONMODE: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_TRANSACTIONMODE,
          CHEQUEDATEWISEREPORT: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CHEQUEDATEWISEREPORT,
          COSTCENTER: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CostCenter,
          DIVISIONNAME: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIVISIONNAME ? this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DIVISIONNAME : '',
          COSTCENTERDISPLAYNAME: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_COSTCENTERDISPLAYNAME ? this._reportFilterService.PostDatedChequeObj.PostDatedCheque_COSTCENTERDISPLAYNAME : '',
          BANK_ACID:this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKID ? this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKID : '%',
          ACID: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYID ? this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYID :'%',
          PARTYDISPLAYNAME: this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYNAME ?  this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYNAME :'',
          BANKDISPLAYNAME:this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKNAME ? this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKNAME:'',
        }
      }
    });

    if (res == "ok") {
      this._reportFilterService.loadedTimesD = this._reportFilterService.loadedTimesD + 1;
    }
  }

  ChangeDate() {
    if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CHEQUEDATEWISEREPORT == 0) {
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
      if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = new Date().toJSON().split('T')[0];
      }
      else {
        this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
      }
    } else if (this._reportFilterService.PostDatedChequeObj.PostDatedCheque_CHEQUEDATEWISEREPORT == 1) {
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1 = new Date().toJSON().split('T')[0];;
      this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2 = new Date().toJSON().split('T')[0];;
    }

    this.changeEntryDate(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE1, "AD");
    this.changeEndDate(this._reportFilterService.PostDatedChequeObj.PostDatedCheque_DATE2, "AD");

  }

  PartyEnterCommand() {
    this.gridPopupSettingsForPartyLedgerList = this.masterService.getGenericGridPopUpSettings('PartyLedgerList');
    this.genericGridPartyLedger.show();
}


  onPartySelect(event) {
    this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYID = event.ACID;
    this._reportFilterService.PostDatedChequeObj.PostDatedCheque_PARTYNAME = event.ACNAME;

}
  BankEntercommand(){
    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;
    TRNMODE = "Bank Deposit Voucher";
    this.gridACListPartyPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Default/${TRNMODE}/`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "ACCODE",
          title: "AC CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACNAME",
          title: "A/C NAME",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridACListParty.show();
  }

  onBankNameSelect(event){
    this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKID = event.ACID;
    this._reportFilterService.PostDatedChequeObj.PostDatedCheque_BANKNAME = event.ACNAME;
  }



}

