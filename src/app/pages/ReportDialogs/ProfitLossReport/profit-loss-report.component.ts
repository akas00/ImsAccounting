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
    selector: 'profitloss-report',
    templateUrl: './profit-loss-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class ProfitLossReport implements OnInit {
    division: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    instanceWiseRepName: string = 'Profit Loss Report';
    userSetting: any;
    CostcenterList: any[] = [];

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router, private alertService: AlertService,
        public dialogref: MdDialogRef<ProfitLossReport>, public _ActivatedRoute: ActivatedRoute,
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

        this.masterService.getCostcenter().subscribe(res => {
            this.CostcenterList = res;
        })

        // this.masterService.getAccDivList();

    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.ProfitLossObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
                this._reportFilterService.ProfitLossObj.ProfitLoss_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2 = new Date().toJSON().split('T')[0]; 
                  }
                  else {
                    this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                }
                this.masterService.viewDivision.subscribe(() => {
                    if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                      this._reportFilterService.ProfitLossObj.ProfitLoss_DIV='%';
                  }else{
                    if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.ProfitLossObj.ProfitLoss_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.ProfitLossObj.ProfitLoss_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    }
                  }
                  })
                this._reportFilterService.ProfitLossObj.ProfitLoss_VERTICALFORMAT = '1';
                // this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK = 0;
                // this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK = 0;
                this._reportFilterService.ProfitLossObj.ProfitLoss_SHOWSUBLEDGER = 0;
                this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter = '%';
                if (this.userSetting.IS_NESTLE == 1) {
                    this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE = 'DMS';
                } else {
                    this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE = 'NONDMS';
                }
            }

            if (params.instancename) {
                // ////console.log("@@[plreport0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.ProfitLossObj.ProfitLoss_DATE1 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.ProfitLossObj.ProfitLoss_DIV = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.ProfitLossObj.ProfitLoss_SHOWSUBLEDGER = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWSUBLEDGER;
                this._reportFilterService.ProfitLossObj.ProfitLoss_VERTICALFORMAT = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.VERTICALFORMAT;
                this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.OSTOCK;
                this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.CSTOCK;
                if (this.userSetting.IS_NESTLE == 1) {
                    this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE = 'DMS';
                } else {
                    this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE = 'NONDMS';
                }
                this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
            }
        })

        this.calcStock();
        this.changeEntryDate(this._reportFilterService.ProfitLossObj.ProfitLoss_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.ProfitLossObj.ProfitLoss_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.ProfitLossObj.ProfitLoss_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.ProfitLossObj.ProfitLoss_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0]
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        //console.log("ProfitLoss_OSTOCK",this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK,this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK)
        // if (this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK === '' || this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK === null ||
        //     this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK === undefined || this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK === '' || this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK === null ||
        //     this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK === undefined) {
        //     this.alertService.info("Please Calculate Stock!!");
        //     return;
        // }

        let multipleReportFormateName = 'Profit Loss Report';
        if (this._reportFilterService.ProfitLossObj.ProfitLoss_VERTICALFORMAT == 1) {
            multipleReportFormateName = 'Profit Loss Report';
        } else if (this._reportFilterService.ProfitLossObj.ProfitLoss_VERTICALFORMAT == 0) {
            multipleReportFormateName = 'PLACCOUNT';
        }

        if (this._reportFilterService.ProfitLossObj.ProfitLoss_DIV && this._reportFilterService.ProfitLossObj.ProfitLoss_DIV == '%') {
            this._reportFilterService.ProfitLossObj.ProfitLoss_DIVISIONNAME = 'All';
        } else if (this._reportFilterService.ProfitLossObj.ProfitLoss_DIV && this._reportFilterService.ProfitLossObj.ProfitLoss_DIV != '%') {
            let abc = this.division.filter(x => x.INITIAL == this._reportFilterService.ProfitLossObj.ProfitLoss_DIV);
            if (abc && abc.length > 0 && abc[0]) {
                this._reportFilterService.ProfitLossObj.ProfitLoss_DIVISIONNAME = abc[0].NAME;
            } else {
                this._reportFilterService.ProfitLossObj.ProfitLoss_DIVISIONNAME = '';
            }
        } else {
            this._reportFilterService.ProfitLossObj.ProfitLoss_DIVISIONNAME = '';
        }

        if (this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter && this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter == '%') {
            this._reportFilterService.ProfitLossObj.ProfitLoss_COSTCENTERDISPLAYNAME = 'All';
        } else if (this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x => x.CCID == this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter);
            if (abc && abc.length > 0 && abc[0]) {
                this._reportFilterService.ProfitLossObj.ProfitLoss_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            } else {
                this._reportFilterService.ProfitLossObj.ProfitLoss_COSTCENTERDISPLAYNAME = '';
            }
        } else {
            this._reportFilterService.ProfitLossObj.ProfitLoss_COSTCENTERDISPLAYNAME = '';
        }

        if (res == "ok") {
            this._reportFilterService.ProfitLossObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.ProfitLoss_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Profit Loss Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.ProfitLoss_loadedTimes,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Profit Loss Report' + '_' + this._reportFilterService.ProfitLoss_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.ProfitLoss_loadedTimes,
                    });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME: 'Profit Loss Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.ProfitLoss_loadedTimes,
                reportparam: {
                    DATE1: this._reportFilterService.ProfitLossObj.ProfitLoss_DATE1,
                    DATE2: this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2,
                    BSDATE1: this._reportFilterService.ProfitLossObj.ProfitLoss_BSDATE1,
                    BSDATE2: this._reportFilterService.ProfitLossObj.ProfitLoss_BSDATE2,
                    DIV: this._reportFilterService.ProfitLossObj.ProfitLoss_DIV ? this._reportFilterService.ProfitLossObj.ProfitLoss_DIV : '%',
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    CID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    SHOWSUBLEDGER: this._reportFilterService.ProfitLossObj.ProfitLoss_SHOWSUBLEDGER?this._reportFilterService.ProfitLossObj.ProfitLoss_SHOWSUBLEDGER:0,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    COMPANYTYPE: this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE ? this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE : 'NONDMS',
                    OSTOCK: this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK ?this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK:0,
                    CSTOCK: this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK ?this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK:0,
                    SUMMARY: 0,
                    LEV: 100,
                    VERTICALFORMAT: this._reportFilterService.ProfitLossObj.ProfitLoss_VERTICALFORMAT ? this._reportFilterService.ProfitLossObj.ProfitLoss_VERTICALFORMAT : 1,
                    DIVISIONNAME: this._reportFilterService.ProfitLossObj.ProfitLoss_DIVISIONNAME ? this._reportFilterService.ProfitLossObj.ProfitLoss_DIVISIONNAME : '',
                    COSTCENTER: this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter ? this._reportFilterService.ProfitLossObj.ProfitLoss_CostCenter : '%',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.ProfitLossObj.ProfitLoss_COSTCENTERDISPLAYNAME ? this._reportFilterService.ProfitLossObj.ProfitLoss_COSTCENTERDISPLAYNAME : '',
                }
            }
        });

        if (res == "ok") {
            this._reportFilterService.ProfitLoss_loadedTimes = this._reportFilterService.ProfitLoss_loadedTimes + 1;
        }
    }

    calcStock() {
        let reportparam: any = {};
        reportparam.DATE1 = this._reportFilterService.ProfitLossObj.ProfitLoss_DATE1;
        reportparam.DATE2 = this._reportFilterService.ProfitLossObj.ProfitLoss_DATE2;
        reportparam.DIV = this._reportFilterService.ProfitLossObj.ProfitLoss_DIV;
        reportparam.COMPANYTYPE = this._reportFilterService.ProfitLossObj.ProfitLoss_COMPANYTYPE;
        reportparam.PHISCALID = this.masterService.PhiscalObj.PhiscalID;
        
        this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK = 0;
        this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK = 0;
        // this._reportFilterService.stockCalculation(reportparam).subscribe((res) => {
        //     this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK = res.result;
        //     this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK = res.result2;
        // })
    }

    changeDivision() {
        this._reportFilterService.ProfitLossObj.ProfitLoss_OSTOCK = 0;
        this._reportFilterService.ProfitLossObj.ProfitLoss_CSTOCK = 0;
    }

}

