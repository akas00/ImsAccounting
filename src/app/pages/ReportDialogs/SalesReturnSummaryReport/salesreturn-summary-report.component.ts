import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../common/services/alert/alert.service';


export interface DialogInfo {
    header: string;
    message: Observable<string>;
}
@Component({
    selector: 'salesreturn-summary-report',
    templateUrl: './salesreturn-summary-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]
})

export class SalesReturnSummaryReport implements OnInit {
    ReportParameters: any = <any>{};
    multipleReportFormateName: string;
    division: any[] = [];
    CostcenterList: any[] = [];
    instanceWiseRepName: string = 'Sales Return Summary Report';

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,
        public dialogref: MdDialogRef<SalesReturnSummaryReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo, public _ActivatedRoute: ActivatedRoute, private alertService: AlertService,
        private _reportFilterService: ReportMainService, private arouter: Router) {
        //----------Default values on load
        this.ReportParameters.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;

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

        // this.masterService.getAccDivList();
    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.SalesReturnSummaryObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                this.changestartDate(this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1, "AD");
                this.changeEndDate(this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2, "AD");
                this.masterService.viewDivision.subscribe(() => {
                    if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                      this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV='%';
                  }else{
                      this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                  }
                  })
            }

            if (params.instancename) {
                // ////console.log("@@SalesReturnSummaryObj",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
            }
        })


        this.changestartDate(this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2, "AD")
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV = (this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV == null || this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV == "") ? "%" : this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV;


        this.multipleReportFormateName = 'Sales Return Summary Report_Account';

        if (res == "ok") {
            this._reportFilterService.SalesReturnSummaryObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.SalesReturnSummary_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Sales Return Summary Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.SalesReturnSummary_loadedTimes,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Sales Return Summary Report' + '_' + this._reportFilterService.SalesReturnSummary_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.SalesReturnSummary_loadedTimes,
                    });
            }
        }

        this.reportdataEmit.emit({
            status: res, data: {
                reportname: this.multipleReportFormateName,
                instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.SalesReturnSummary_loadedTimes,
                reportparam: {
                    DIVISION: this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DIV,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.ReportParameters.COMID,
                    DATE1: this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1,
                    DATE2: this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2,
                    SDATE: this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1,
                    EDATE: this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2,
                }
            }
        });

        if (res == "ok") {
            this._reportFilterService.SalesReturnSummary_loadedTimes = this._reportFilterService.SalesReturnSummary_loadedTimes + 1;
        }
    }

    changestartDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            } else {
                this.alertService.error("Cannot Change the date");
                return;
            }
        }
    }

    changeEndDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                    this._reportFilterService.SalesReturnSummaryObj.SalesReturnSummary_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                } else {
                    this.alertService.error("Cannot Change the date");
                    return;
                }
            }
        }
        catch (e) { }
    }

}

