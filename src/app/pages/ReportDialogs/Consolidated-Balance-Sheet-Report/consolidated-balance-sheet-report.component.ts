import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'consolidated-balance-sheet-report',
    templateUrl: './consolidated-balance-sheet-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class ConsolidatedBalanceSheetReport implements OnInit {
    division: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    instanceWiseRepName: string = 'Consolidated Balance Sheet Report';
    userSetting: any;

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router, private alertService: AlertService,
        public dialogref: MdDialogRef<ConsolidatedBalanceSheetReport>, public _ActivatedRoute: ActivatedRoute,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.userProfile = this._authService.getUserProfile();
        this.userSetting = _authService.getSetting();
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

        this.masterService.getAccDivList();

    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.ConsolidatedBalanceSheetObj.assignPrevioiusDate != true) {
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE2  = new Date().toJSON().split('T')[0];
                  }
                  else {
                    this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                }
               
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWTOTALINGROUP = 1;
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWDEBTORSCREDITORS = 0;
                if (this.userSetting.IS_NESTLE == 1) {
                    this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_COMPANYTYPE = 'DMS';
                } else {
                    this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_COMPANYTYPE = 'NONDMS';
                }
            }

            if (params.instancename) {
                // ////console.log("@@[plreport0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE1 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE2 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWTOTALINGROUP = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWTOTALINGROUP;
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWDEBTORSCREDITORS = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDEBTORSCREDITORS;
                if (this.userSetting.IS_NESTLE == 1) {
                    this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_COMPANYTYPE = 'DMS';
                } else {
                    this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_COMPANYTYPE = 'NONDMS';
                }
            }
        })

        this.changeEntryDate(this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0]
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if (Validatedata == true) {
                const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
                var adDate1 = adbs.bs2ad(bsDate1);
                this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0]
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {

        let multipleReportFormateName = 'Consolidated Balance Sheet Report';
       
        if (res == "ok") {
            this._reportFilterService.ConsolidatedBalanceSheetObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.Consolidated_BalanceSheet_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Consolidated Balance Sheet Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.Consolidated_BalanceSheet_loadedTimes,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Consolidated Balance Sheet Report' + '_' + this._reportFilterService.Consolidated_BalanceSheet_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.Consolidated_BalanceSheet_loadedTimes,
                    });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME: 'Consolidated Balance Sheet Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.Consolidated_BalanceSheet_loadedTimes,
                reportparam: {
                    DATE1: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE1,
                    DATE2: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_DATE2,
                    BSDATE1: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_BSDATE1,
                    BSDATE2: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_BSDATE2,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    CID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    SHOWTOTALINGROUP: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWTOTALINGROUP ? this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWTOTALINGROUP : 0,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    COMPANYTYPE: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_COMPANYTYPE ? this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_COMPANYTYPE : 'NONDMS',
                    SHOWDEBTORSCREDITORS: this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWDEBTORSCREDITORS ? this._reportFilterService.ConsolidatedBalanceSheetObj.Consolidated_BalanceSheet_SHOWDEBTORSCREDITORS :0,
                }
            }
        });

        if (res == "ok") {
            this._reportFilterService.Consolidated_BalanceSheet_loadedTimes = this._reportFilterService.Consolidated_BalanceSheet_loadedTimes + 1;
        }
    }

}

