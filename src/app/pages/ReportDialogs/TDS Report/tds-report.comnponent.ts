import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Division } from '../../../common/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'tds-report',
    templateUrl: './tds-report.comnponent.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class TDSReport implements OnInit {
    ReportParameters: any = <any>{};
    voucherTypeList: any[] = [];
    userList: any[] = [];
    division: any[] = [];
    instanceWiseRepName: string = 'TDS Report';

    result: any;
    @Output() reportdataEmit = new EventEmitter();

    @ViewChild("genericGridACList")
    genericGridACList: GenericPopUpComponent;
    gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericGridPartyList")
    genericGridPartyList: GenericPopUpComponent;
    gridPartyListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("gridSubLedgerSettingList")
    gridSubLedgerSettingList: GenericPopUpComponent;
    gridSubLedgerSetting: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo, private _authService: AuthService, private alertService: AlertService,
        private _reportFilterService: ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public dialogref: MdDialogRef<TDSReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {

        this._reportFilterService.TDSObj.Reportnameis = 'TDS Report';

        this.division = [];
        //let data: Array<IDivision> = [];
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
                    //////console.log("div" + JSON.stringify(res));
                    this.division.push(<Division>res);
                }, error => {
                    this.masterService.resolveError(error, "divisions - getDivisions");
                });
        }
        // this.masterService.getAccDivList();
    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.TDSObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
                this._reportFilterService.TDSObj.TDS_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.TDSObj.TDS_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.TDSObj.TDS_DATE2, "AD");
                }
                else {

                    this._reportFilterService.TDSObj.TDS_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                    this.changeEndDate(this._reportFilterService.TDSObj.TDS_DATE2, "AD");


                }
                // this._reportFilterService.TDSObj.TDS_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                    if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                      this._reportFilterService.TDSObj.TDS_DIV='%';
                  }else{
                    if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.TDSObj.TDS_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.TDSObj.TDS_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    }
                  }
                  })
                this._reportFilterService.TDSObj.TDS_REPORTTYPE = '0';

            }

            if (params.instancename) {

                this._reportFilterService.TDSObj.TDS_DATE1 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.TDSObj.TDS_DATE2 = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.TDSObj.TDS_DIV = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.TDSObj.TDS_REPORTTYPE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTTYPE;
                this._reportFilterService.TDSObj.TDS_TDSNAME = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.TDSDISPLAYNAME;
                this._reportFilterService.TDSObj.TDS_PARTYNAME = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.TDS_PARTYNAME;
            }
        })


        this.changeEntryDate(this._reportFilterService.TDSObj.TDS_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.TDSObj.TDS_DATE2, "AD");

    }
    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.TDSObj.TDS_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.TDSObj.TDS_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            } else {
                this.alertService.error("Cannot Change the date");
                return;
            }
            // this._reportFilterService.TDSObj.TDS_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.TDSObj.TDS_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.TDSObj.TDS_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            } else {
                this.alertService.error("Cannot Change the date");
                return;
            }
            // this._reportFilterService.TDSObj.TDS_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        if(this._reportFilterService.TDSObj.TDS_TDSNAME == "" ||this._reportFilterService.TDSObj.TDS_TDSNAME == null || 
        this._reportFilterService.TDSObj.TDS_TDSNAME == undefined ){
            this._reportFilterService.TDSObj.TDS_TDSID = '%';
        }
        // if(!this._reportFilterService.TDSObj.TDS_TDSID){
        //     this.alertService.warning("Please select TDS Account")
        //     return;
        // }
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.TDSObj.TDS_DIV = (this._reportFilterService.TDSObj.TDS_DIV == null || this._reportFilterService.TDSObj.TDS_DIV == "") ? "%" : this._reportFilterService.TDSObj.TDS_DIV;

        let multipleReportFormateName = '';
        if(this._reportFilterService.TDSObj.TDS_ISIRDFORMAT==1){
            multipleReportFormateName = 'TDS Report_2';
        }else{
            if (this._reportFilterService.TDSObj.TDS_REPORTTYPE == "0") {
                multipleReportFormateName = 'TDS Report';
            } else if (this._reportFilterService.TDSObj.TDS_REPORTTYPE == "1") {
                multipleReportFormateName = 'TDS Report_1';
            }
        }


        if (this._reportFilterService.TDSObj.TDS_DIV && this._reportFilterService.TDSObj.TDS_DIV == '%') {
            this._reportFilterService.TDSObj.TDS_DIVISIONNAME = 'All';
        } else if (this._reportFilterService.TDSObj.TDS_DIV && this._reportFilterService.TDSObj.TDS_DIV != '%') {
            let abc = this.division.filter(x => x.INITIAL == this._reportFilterService.TDSObj.TDS_DIV);
            if (abc && abc.length > 0 && abc[0]) {
                this._reportFilterService.TDSObj.TDS_DIVISIONNAME = abc[0].NAME;
            } else {
                this._reportFilterService.TDSObj.TDS_DIVISIONNAME = '';
            }
        } else {
            this._reportFilterService.TDSObj.TDS_DIVISIONNAME = '';
        }


        if (res == "ok") {
            this._reportFilterService.TDSObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if (this._reportFilterService.TDS_loadedTimes == 0) {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'TDS Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.TDS_loadedTimes,
                    });
            } else {
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'TDS Report' + '_' + this._reportFilterService.TDS_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.TDS_loadedTimes,
                    });
            }

        }

        if (this._reportFilterService.TDSObj.TDS_TDSNAME == "" || this._reportFilterService.TDSObj.TDS_TDSNAME == null || this._reportFilterService.TDSObj.TDS_TDSNAME == undefined) {
            this._reportFilterService.TDSObj.TDS_TDSID = '%';
        }

        if (this._reportFilterService.TDSObj.TDS_PARTYNAME == "" || this._reportFilterService.TDSObj.TDS_PARTYID == null || this._reportFilterService.TDSObj.TDS_PARTYID == undefined) {
            this._reportFilterService.TDSObj.TDS_PARTYID = '%';
        }
        if (this._reportFilterService.TDSObj.TDS_SL_ACNAME == "" || this._reportFilterService.TDSObj.TDS_SL_ACNAME == null || this._reportFilterService.TDSObj.TDS_SL_ACNAME == undefined) {
            this._reportFilterService.TDSObj.TDS_SL_ACID = '%';
        }
        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME: 'TDS Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName: this.instanceWiseRepName + this._reportFilterService.TDS_loadedTimes,
                reportparam: {

                    DATE1: this._reportFilterService.TDSObj.TDS_DATE1,
                    DATE2: this._reportFilterService.TDSObj.TDS_DATE2,
                    BSDATE1: this._reportFilterService.TDSObj.TDS_BSDATE1,
                    BSDATE2: this._reportFilterService.TDSObj.TDS_BSDATE2,
                    DIV: this._reportFilterService.TDSObj.TDS_DIV,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    TDSACID: this._reportFilterService.TDSObj.TDS_TDSID ? this._reportFilterService.TDSObj.TDS_TDSID : '%',
                    ACID: this._reportFilterService.TDSObj.TDS_PARTYID ? this._reportFilterService.TDSObj.TDS_PARTYID : '%',
                    REPORTTYPE: this._reportFilterService.TDSObj.TDS_REPORTTYPE,
                    ISIRDFORMAT:this._reportFilterService.TDSObj.TDS_ISIRDFORMAT?this._reportFilterService.TDSObj.TDS_ISIRDFORMAT:0,
                    DIVISIONNAME: this._reportFilterService.TDSObj.TDS_DIVISIONNAME ? this._reportFilterService.TDSObj.TDS_DIVISIONNAME : '',
                    TDSDISPLAYNAME: this._reportFilterService.TDSObj.TDS_TDSNAME ? this._reportFilterService.TDSObj.TDS_TDSNAME : '',
                    PARTYDISPLAYNAME: this._reportFilterService.TDSObj.TDS_PARTYNAME ? this._reportFilterService.TDSObj.TDS_PARTYNAME : '',
                    SUBLEDGERDISPLAYNAME: this._reportFilterService.TDSObj.TDS_SL_ACNAME ? this._reportFilterService.TDSObj.TDS_SL_ACNAME : '',
                    SL_ACID: this._reportFilterService.TDSObj.TDS_SL_ACID ? this._reportFilterService.TDSObj.TDS_SL_ACID : ''
                }
            }
        });

        if (res == "ok") {
            this._reportFilterService.TDS_loadedTimes = this._reportFilterService.TDS_loadedTimes + 1;
        }
    }

    TDSEnterCommand() {
        this.showAcList();
    }

    showAcList() {
        this.gridACListPopupSettings = {
            title: "Accounts",
            apiEndpoints: `/getAccountPagedListByMapId/Details/TDS`,
            defaultFilterIndex: 1,
            columns: [
                {
                    key: "ACID",
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

        this.genericGridACList.show();

    }

    onAcSelect(event) {
        this._reportFilterService.TDSObj.TDS_TDSID = event.ACID;
        this._reportFilterService.TDSObj.TDS_TDSNAME = event.ACNAME;
    }

    PartyEnterCommand() {
        this.showPartyList();
    }

    showPartyList() {
        this.gridPartyListPopupSettings = {
            title: "Accounts",
            apiEndpoints: `/getAccountPagedListByMapId/Details/PartyReceipt`,
            defaultFilterIndex: 1,
            columns: [
                {
                    key: "ACID",
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

        this.genericGridPartyList.show();

    }

    onPartySelect(event) {
        this._reportFilterService.TDSObj.TDS_PARTYID = event.ACID;
        this._reportFilterService.TDSObj.TDS_PARTYNAME = event.ACNAME;

    }

    checkValue() {
        if (this._reportFilterService.TDSObj.TDS_ISIRDFORMAT== true) {
            this._reportFilterService.TDSObj.TDS_ISIRDFORMAT=1;
        }
    }
    SubLedgerEnterCommand(){
        this.gridSubLedgerSetting = {
            title: "SubLedger List",
            apiEndpoints: `/getSubLedgerPageList`,
            defaultFilterIndex: 1,
            columns: [
              {
                key: "SL_ACID",
                title: "SubLedger ID",
                hidden: false,
                noSearch: false
              },
              {
                key: "SL_ACNAME",
                title: "SubLedger Name",
                hidden: false,
                noSearch: false
              }
            ]
          };
          this.gridSubLedgerSettingList.show();
    }
    onSubLedgerSelect(value) {
        this._reportFilterService.TDSObj.TDS_SL_ACID = value.SL_ACID;
        this._reportFilterService.TDSObj.TDS_SL_ACNAME = value.SL_ACNAME;
    
      }
      changeCheckboxValue(event){
          if(event.target.value==1){
           this._reportFilterService.TDSObj.TDS_ISIRDFORMAT=0;
          }
      }
}

