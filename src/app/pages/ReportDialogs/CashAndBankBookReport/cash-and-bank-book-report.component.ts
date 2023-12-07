import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { AuthService } from '../../../common/services/permission/authService.service';
import { Division } from '../../../common/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
export interface DialogInfo {
    header: string;
    message: Observable<string>;
}
@Component({
    selector: 'cash-bank-book',
    templateUrl: './cash-and-bank-book-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]
})

export class CashBankBookReport implements OnInit {
    acname: string;
    accode: string;
    userProfile: any;
    division: any[] = [];
    account: any[] = [];
    account2: any[] = [];
    instanceWiseRepName:string='Cash/Bank Book Report';

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridCashBankBook") genericGridCashBankBook: GenericPopUpComponent;
    gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo,
        public dialogref: MdDialogRef<CashBankBookReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo,
        private _reportFilterService: ReportMainService,  public _ActivatedRoute: ActivatedRoute,
        private alertService: AlertService, private _authService: AuthService, private arouter: Router
    ) {
        // this._reportFilterService.CashAndBankBookObj.REPORTMODE = '0';
        this._reportFilterService.CashAndBankBookObj.Reportnameis = 'cashbankbookreport';
        this.userProfile = this._authService.getUserProfile();

        this.division=[];
        //let data: Array<IDivision> = [];
        if(this.masterService.userSetting.userwisedivision == 1){
          this.masterService.getDivisionFromRightPrivelege().subscribe(res=>{
              if(res.status == 'ok'){
                  this.division = res.result;
              }
          })
        }
        else{
         this.masterService.getAllDivisions()
         .subscribe(res => {
           //////console.log("div" + JSON.stringify(res));
           this.division.push(<Division>res);
         }, error => {
           this.masterService.resolveError(error, "divisions - getDivisions");
         });
        }

        this.masterService.getCashListForReport().subscribe(res => {
            this.account = res.data;
            ////console.log("@@res", res)
            if (this.account.length != 0) {
                this._reportFilterService.result = true;
            } else {
                this._reportFilterService.result = false;
            }
        })

        this.masterService.getBankBookListForReport().subscribe(res => {
            this.account2 = res.data;
            if (this.account2.length != 0) {
                this._reportFilterService.result2 = true;
            } else {
                this._reportFilterService.result2 = false;
            }
        })

        this.checkSummary();
        // this.masterService.getAccDivList();

    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.CashAndBankBookObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
            this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2, "AD");
                  }
                  else {

                this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2, "AD");


                }
                // this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2 = new Date().toJSON().split('T')[0];
                // this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                    if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                      this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV='%';
                  }else{
                    if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    }
                  }
                  })
                this._reportFilterService.CashAndBankBookObj.REPORTMODE = '0';
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT = '0';
            }

            if(params.instancename){
                // ////console.log("@@[cash bank Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.CashAndBankBookObj.REPORTMODE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTMODE;
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DETAILREPORT;
                this._reportFilterService.CashAndBankBookObj.SingleAccount=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                this._reportFilterService.CashAndBankBookObj.ACCNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACNAME;
                this._reportFilterService.CashAndBankBookObj.CashBankBook_INCLUDEPOSTDATE =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.INCLUDEPOSTEDTRANSACTION ; 

            }

        })

        this.changeEntryDate(this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2, "AD");
    }
    focusOutFromDate(value) {
        this.masterService.validateDate(value).subscribe(x => {
            if (x == "error") {
                this.alertService.warning("Date should be within Fiscal year");
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1 = new Date().toJSON().split('T')[0];
            }
        });
    }
    changeEntryDate(value, format: string) {

        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CashAndBankBookObj.CashBankBook_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }

    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CashAndBankBookObj.CashBankBook_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
                const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
                if(Validatedata == true){
                  const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
                  var adDate1 = adbs.bs2ad(bsDate1);
                  this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
            // this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        if (this._reportFilterService.result == true && (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == '1' && this._reportFilterService.CashAndBankBookObj.REPORTMODE == "1")) {
            if (this._reportFilterService.CashAndBankBookObj.SingleAccount === undefined || this._reportFilterService.CashAndBankBookObj.SingleAccount == '' || this._reportFilterService.CashAndBankBookObj.ACCNAME == '') {
                this.alertService.info("Please Select Account");
                return;
            }
            this.DialogClosedResult("ok");
        } else if (this._reportFilterService.result2 == true && (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == '1' && this._reportFilterService.CashAndBankBookObj.REPORTMODE == "2")) {
            if (this._reportFilterService.CashAndBankBookObj.SingleAccount === undefined || this._reportFilterService.CashAndBankBookObj.SingleAccount == '' || this._reportFilterService.CashAndBankBookObj.ACCNAME == '') {
                this.alertService.info("Please Select Account");
                return;
            }
            this.DialogClosedResult("ok");
        }
        else {
            this.DialogClosedResult("ok");
        }
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV = (this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV == null || this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV == "") ? "%" : this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV;

        let multipleReportFormateName = '';
        if (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == "0") {
            multipleReportFormateName = 'Cash/Bank Book Report';
            this._reportFilterService.CashAndBankBookObj.CashBankBook_SUMMARYREPORTDISPLAYNAME = ' @Summary Report';
        } else if (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == "1" && this._reportFilterService.CashAndBankBookObj.REPORTMODE == "1") {
            multipleReportFormateName = 'Cash/Bank Book Report_1';
            this._reportFilterService.CashAndBankBookObj.CashBankBook_SUMMARYREPORTDISPLAYNAME = ' @Detail Report';
        } else if (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == "1" && this._reportFilterService.CashAndBankBookObj.REPORTMODE == "2") {
            multipleReportFormateName = 'Cash/Bank Book Report_2';
            this._reportFilterService.CashAndBankBookObj.CashBankBook_SUMMARYREPORTDISPLAYNAME = ' @Detail Report';
        }

        if (this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV && this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV == '%') {
            this._reportFilterService.CashAndBankBookObj.CashBankBook_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV && this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.CashAndBankBookObj.CashBankBook_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.CashAndBankBookObj.CashBankBook_DIVISIONNAME = '';
          }

        if (this._reportFilterService.CashAndBankBookObj.REPORTMODE == "1") {
            this._reportFilterService.CashAndBankBookObj.CashBankBook_REPORTOPTIONDISPLAYNAME = ' @Cash Book Only';
        } else if (this._reportFilterService.CashAndBankBookObj.REPORTMODE == "2") {
            this._reportFilterService.CashAndBankBookObj.CashBankBook_REPORTOPTIONDISPLAYNAME = ' @Bank Book Only';
        } else if (this._reportFilterService.CashAndBankBookObj.REPORTMODE == "0") {
            this._reportFilterService.CashAndBankBookObj.CashBankBook_REPORTOPTIONDISPLAYNAME = '';
        }

        if (res == "ok") {
            this._reportFilterService.CashAndBankBookObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if(this._reportFilterService.CashBank_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Cash/Bank Book Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.CashBank_loadedTimes,
                    });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Cash/Bank Book Report'+'_'+this._reportFilterService.CashBank_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.CashBank_loadedTimes,
                    });
            }

        }

        if (this._reportFilterService.CashAndBankBookObj.ACCNAME = '') {
            this._reportFilterService.CashAndBankBookObj.SingleAccount = '%';
        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Cash/Bank Book Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.CashBank_loadedTimes,
                reportparam: {
                    REPORTOPTIONDISPLAYNAME: this._reportFilterService.CashAndBankBookObj.CashBankBook_REPORTOPTIONDISPLAYNAME?this._reportFilterService.CashAndBankBookObj.CashBankBook_REPORTOPTIONDISPLAYNAME:'',
                    DATE1: this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE1,
                    DATE2: this._reportFilterService.CashAndBankBookObj.CashBankBook_DATE2,
                    BSDATE1: this._reportFilterService.CashAndBankBookObj.CashBankBook_BSDATE1,
                    BSDATE2: this._reportFilterService.CashAndBankBookObj.CashBankBook_BSDATE2,
                    DIV: this._reportFilterService.CashAndBankBookObj.CashBankBook_DIV,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    REPORTMODE: this._reportFilterService.CashAndBankBookObj.REPORTMODE,
                    DETAILREPORT: this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT ? this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT : "0",
                    ACID: this._reportFilterService.CashAndBankBookObj.SingleAccount ? this._reportFilterService.CashAndBankBookObj.SingleAccount : '%',
                    ACNAME: this._reportFilterService.CashAndBankBookObj.ACCNAME,
                    DIVISIONNAME : this._reportFilterService.CashAndBankBookObj.CashBankBook_DIVISIONNAME ? this._reportFilterService.CashAndBankBookObj.CashBankBook_DIVISIONNAME : '',
                    SUMMARYREPORTDISPLAYNAME:this._reportFilterService.CashAndBankBookObj.CashBankBook_SUMMARYREPORTDISPLAYNAME?this._reportFilterService.CashAndBankBookObj.CashBankBook_SUMMARYREPORTDISPLAYNAME:'',
                    INCLUDEPOSTEDTRANSACTION :this._reportFilterService.CashAndBankBookObj.CashBankBook_INCLUDEPOSTDATE ? this._reportFilterService.CashAndBankBookObj.CashBankBook_INCLUDEPOSTDATE:0
                }
            }
        })
        this._reportFilterService.CashBank_loadedTimes = this._reportFilterService.CashBank_loadedTimes+1;
    }

    checkReportMode() {
        this._reportFilterService.CashAndBankBookObj.ACCNAME = "";
        this._reportFilterService.CashAndBankBookObj.ACCODE = "";
        this._reportFilterService.CashAndBankBookObj.ACID = "";
        this._reportFilterService.CashAndBankBookObj.SingleAccount = "";
    }

    checkSummary() {
        if (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == "0") {
            this.acname = this._reportFilterService.CashAndBankBookObj.ACCNAME;
            this._reportFilterService.CashAndBankBookObj.ACCNAME = "";
            this.accode = this._reportFilterService.CashAndBankBookObj.ACCODE;
            this._reportFilterService.CashAndBankBookObj.ACCODE = "";
            this._reportFilterService.CashAndBankBookObj.ACID = "";
            this._reportFilterService.CashAndBankBookObj.SingleAccount = "";
        } else {
            if (this._reportFilterService.CashAndBankBookObj.REPORTMODE == "1") {
                this._reportFilterService.CashAndBankBookObj.ACCNAME = this.acname;
                this._reportFilterService.CashAndBankBookObj.ACCODE = this.accode;
                this._reportFilterService.CashAndBankBookObj.SingleAccount = this.accode;
            }
        }

        if (this._reportFilterService.CashAndBankBookObj.CashBankBook_DETAILREPORT == "1") {
            this._reportFilterService.CashAndBankBookObj.REPORTMODE = "1";
        }
    }

    AccountEnterClicked() {
        if (this._reportFilterService.CashAndBankBookObj.REPORTMODE == '1') {
            this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('CashBookList');
        } else if (this._reportFilterService.CashAndBankBookObj.REPORTMODE == '2') {
            this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('BankBookList');
        }
        this.genericGridCashBankBook.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.CashAndBankBookObj.ACID = account.ACID;
        this._reportFilterService.CashAndBankBookObj.ACCNAME = account.ACNAME;
        this._reportFilterService.CashAndBankBookObj.SingleAccount = account.ACID;
    }
}
