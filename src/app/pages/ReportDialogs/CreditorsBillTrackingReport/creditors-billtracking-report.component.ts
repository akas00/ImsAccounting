import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { PLedgerComponent } from '../../masters/components/PLedger/PLedger.component';
import { AlertService } from '../../../common/services/alert/alert.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';

@Component({
    selector: 'creditorsbilltracking-report-selector',
    templateUrl: './creditors-billtracking-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class CrediotrsBillTrackingReport {
    reportNameFormatWise: string;
    userProfile: any;
    division: any[] = [];
    CostcenterList: any[] = [];
    instanceWiseRepName: string = 'Creditors Bill Tracking Report';
    REPORTDISPLAYNAME: string;

    @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridPartyLedger") genericGridPartyLedger: GenericPopUpComponent;
    gridPopupSettingsForPartyLedgerList: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(public masterService: MasterRepo,
        private alertService: AlertService,
        private _reportFilterService: ReportMainService,
        private _authService: AuthService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService,
    ) {

        this.reportNameFormatWise = 'Creditors Bill Tracking Report';
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
        // this.masterService.getAccDivList();
    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            const mode = params.mode;
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname.startsWith('Creditors Bill Tracking Report') && this._reportFilterService.CreditorsBillTrackingObj.assignPrevioiusDate != true) {
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1=this.reportService.drillParam.reportparam.DATE1;
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2=this.reportService.drillParam.reportparam.DATE2;
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter=this.reportService.drillParam.reportparam.COSTCENTER;
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_Detail= '1';
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID= this.reportService.drillParam.reportparam.ACID;
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACCNAME= this.reportService.drillParam.reportparam.ACNAME;
            }else{
                if (this._reportFilterService.CreditorsBillTrackingObj.assignPrevioiusDate != true) {
                    this.masterService.getAccDivList();
                    // this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                    this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1 = new Date().toJSON().split('T')[0];
                    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2 = new Date().toJSON().split('T')[0];
                        this.changeEndDate(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2, "AD");
                    }
                    else {
        
                        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2, "AD");
                    }
                    // this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
                    this.masterService.viewDivision.subscribe(() => {
                        if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                          this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV='%';
                      }else{
                        if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV=this.division[0].INITIAL;
                          }else{
                            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                        }
                      }
                      })
                    this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter = '%'
                    this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_VoucherType = 'PV';
                    this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_Detail = '0';
        
                    this.changeEntryDate(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1, "AD");
                    this.changeEndDate(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2, "AD");
                }

                    if(params.instancename){
                        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                    }
            }
        });

        this.changeEntryDate(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if (Validatedata == true) {
                const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
                var adDate1 = adbs.bs2ad(bsDate1);
                this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
            var datearr = value.split('/');
            const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if (Validatedata == true) {
                const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
                var adDate1 = adbs.bs2ad(bsDate1);
                this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            } else {
                this.alertService.error("Cannot Change the date");
                return;
            }
        }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    public DialogClosedResult(res) {

        if (this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV && this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV == '%') {
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIVISIONNAME = 'All';
        } else if (this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV && this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV != '%') {
            let abc = this.division.filter(x => x.INITIAL == this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV);
            if (abc && abc.length > 0 && abc[0]) {
                this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIVISIONNAME = abc[0].NAME;
            } else {
                this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIVISIONNAME = '';
            }
        } else {
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIVISIONNAME = '';
        }

        if (this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter && this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter == '%') {
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_COSTCENTERDISPLAYNAME = 'All';
        } else if (this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x => x.CCID == this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter);
            if (abc && abc.length > 0 && abc[0]) {
                this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            } else {
                this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_COSTCENTERDISPLAYNAME = '';
            }
        } else {
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_COSTCENTERDISPLAYNAME = '';
        }

        if(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_Detail==0){
            this.reportNameFormatWise = 'Creditors Bill Tracking Report';
        }else{
            this.reportNameFormatWise = 'Creditors Bill Tracking Report_1';
        }

        if(this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACCNAME==""){
            this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID='%';
        }
        if (res == "ok") {
            this._reportFilterService.CreditorsBillTrackingObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.CreditorsBillTracking_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Creditors Bill Tracking Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.CreditorsBillTracking_loadedTimes,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Creditors Bill Tracking Report' + '_' + this._reportFilterService.CreditorsBillTracking_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.CreditorsBillTracking_loadedTimes,
                    });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME: 'Creditors Bill Tracking Report',
                reportname: this.reportNameFormatWise,
                instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.CreditorsBillTracking_loadedTimes,
                reportparam: {
                    DATE1: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1,
                    DATE2: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2,
                    FROMDATE: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE1,
                    TODATE: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DATE2,
                    BSDATE1: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_BSDATE1,
                    BSDATE2: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_BSDATE2,
                    DIV: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIV : '%',
                    COSTCENTER: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_CostCenter : '%',
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    VOUCHERTYPE: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_VoucherType ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_VoucherType : 'PV',
                    ACID: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID : '%',
                    PARTY: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID : '%',
                    ACNAME: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACCNAME,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID?this.masterService.PhiscalObj.PhiscalID:'%',
                    DETAIL: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_Detail ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_Detail : 1,
                    DIVISIONNAME: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIVISIONNAME ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_COSTCENTERDISPLAYNAME ? this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_COSTCENTERDISPLAYNAME : '',
                }
            }
        });

        if (res == "ok") {
            this._reportFilterService.CreditorsBillTracking_loadedTimes = this._reportFilterService.CreditorsBillTracking_loadedTimes + 1;
        }
    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("cancel");
    }

    AccountEnterClicked() {
        this.gridPopupSettingsForPartyLedgerList = this.masterService.getGenericGridPopUpSettings('SupplierListForReport');
        this.genericGridPartyLedger.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACID = account.ACID;
        this._reportFilterService.CreditorsBillTrackingObj.CreditorsBillTracking_ACCNAME = account.ACNAME;
    }

    keyPress(event: any) {
        //console.log("@@ecent",event)
        const pattern = /[\b]/;
        const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
        if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
        }
      }
}