import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'trial-balance-report',
    templateUrl: './trial-balance-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class TrialBalanceReport implements OnInit {
    // ReportParameters: any = <any>{};
    division: any[] = [];
    CostcenterList: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    instanceWiseRepName:string='Trial Balance Report';
    userSetting: any;

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router,private alertService: AlertService,
        public dialogref: MdDialogRef<TrialBalanceReport>, public _ActivatedRoute: ActivatedRoute,
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
            if (this._reportFilterService.TrialBalanceObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
            this._reportFilterService.TrialBalanceObj.TrialBalance_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
            this._reportFilterService.TrialBalanceObj.TrialBalance_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                // this._reportFilterService.TrialBalanceObj.TrialBalance_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                    if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                      this._reportFilterService.TrialBalanceObj.TrialBalance_DIV='%';
                  }else{
                    if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.TrialBalanceObj.TrialBalance_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.TrialBalanceObj.TrialBalance_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    }
                  }
                  })
                this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter = '%'
                this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORT = '0';
                this._reportFilterService.TrialBalanceObj.TrialBalance_LEDGERWISE = '0';
                if(this.userSetting.IS_NESTLE  == 1){
                    this._reportFilterService.TrialBalanceObj.TrialBalance_COMPANYTYPE = 'DMS';
                }else{
                    this._reportFilterService.TrialBalanceObj.TrialBalance_COMPANYTYPE = 'NONDMS';
                }
            }

            if(params.instancename){
                // ////console.log("@@[trial bln Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.TrialBalanceObj.TrialBalance_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.TrialBalanceObj.TrialBalance_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.TrialBalanceObj.TrialBalance_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                this._reportFilterService.TrialBalanceObj.TrialBalance_LEDGERWISE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.LEDGERWISE;
                this._reportFilterService.TrialBalanceObj.TrialBalance_LEVELS=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.LEVELS;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWCLOSINGONPY;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWDEBTORSCREDITORSDETAILS=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDEBTORSCREDITORSDETAILS;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWOPENINGTRIALONLY;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSTOCKVALUE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWSTOCKVALUE;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSUBLEDGER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWSUBLEDGER;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWZEROBL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWZEROBL;
                this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORT=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SUMMARYREPORT;
            }

        })

        this.changeEntryDate(this._reportFilterService.TrialBalanceObj.TrialBalance_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.TrialBalanceObj.TrialBalance_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.TrialBalanceObj.TrialBalance_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0]
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this._reportFilterService.TrialBalanceObj.TrialBalance_DATE1= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.TrialBalanceObj.TrialBalance_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.TrialBalanceObj.TrialBalance_BSDATE2 =(bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0]
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.TrialBalanceObj.TrialBalance_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        if (this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORT == 0) {
            this._reportFilterService.TrialBalanceObj.TrialBalance_LEVELS = 0;
            this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORTDISPLAYNAME = ' @Detail Report';
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORTDISPLAYNAME = ' @Summary Report';
        }
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY == true){
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY =1;
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY =0;
        }
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSUBLEDGER == true){
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSUBLEDGER =1;
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSUBLEDGER =0;
        }
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWDEBTORSCREDITORSDETAILS == true){
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWDEBTORSCREDITORSDETAILS =1;
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWDEBTORSCREDITORSDETAILS =0;
        }
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSTOCKVALUE == true){
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSTOCKVALUE =1;
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSTOCKVALUE =0;
        }
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY == true){
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY =1;
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY =0;
        }
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWZEROBL == true){
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWZEROBL =1;
        }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWZEROBL =0;
        }

        let multipleReportFormateName = '';
        if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY == 1){
            multipleReportFormateName = 'Trial Balance Report'
        }else if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY == 0 && this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY == 1){
            multipleReportFormateName = 'Trial Balance Report_1'
        }else if(this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY == 0 && this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY == 0){
            multipleReportFormateName = 'Trial Balance Report_2'
        }

        if (this._reportFilterService.TrialBalanceObj.TrialBalance_DIV && this._reportFilterService.TrialBalanceObj.TrialBalance_DIV == '%') {
            this._reportFilterService.TrialBalanceObj.TrialBalance_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.TrialBalanceObj.TrialBalance_DIV && this._reportFilterService.TrialBalanceObj.TrialBalance_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.TrialBalanceObj.TrialBalance_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.TrialBalanceObj.TrialBalance_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.TrialBalanceObj.TrialBalance_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.TrialBalanceObj.TrialBalance_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter && this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter == '%') {
            this._reportFilterService.TrialBalanceObj.TrialBalance_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.TrialBalanceObj.TrialBalance_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.TrialBalanceObj.TrialBalance_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.TrialBalanceObj.TrialBalance_COSTCENTERDISPLAYNAME = '';
          }

          if (this._reportFilterService.TrialBalanceObj.TrialBalance_LEDGERWISE == 0) {
            this._reportFilterService.TrialBalanceObj.TrialBalance_REPORTOPTIONDISPLAYNAME = ' @Group Wise Report';
        } else if (this._reportFilterService.TrialBalanceObj.TrialBalance_LEDGERWISE == 1) {
            this._reportFilterService.TrialBalanceObj.TrialBalance_REPORTOPTIONDISPLAYNAME = ' @Ledger Wise Report';
        }

        if (res == "ok") {
            this._reportFilterService.TrialBalanceObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if(this._reportFilterService.TrialBalance_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Trial Balance Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.TrialBalance_loadedTimes,
                    });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Trial Balance Report'+'_'+this._reportFilterService.TrialBalance_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.TrialBalance_loadedTimes,
                    });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Trial Balance Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.TrialBalance_loadedTimes,
                reportparam: {
                    REPORTOPTIONDISPLAYNAME: this._reportFilterService.TrialBalanceObj.TrialBalance_REPORTOPTIONDISPLAYNAME?this._reportFilterService.TrialBalanceObj.TrialBalance_REPORTOPTIONDISPLAYNAME:'',
                    DATE1: this._reportFilterService.TrialBalanceObj.TrialBalance_DATE1,
                    DATE2: this._reportFilterService.TrialBalanceObj.TrialBalance_DATE2,
                    BSDATE1: this._reportFilterService.TrialBalanceObj.TrialBalance_BSDATE1,
                    BSDATE2: this._reportFilterService.TrialBalanceObj.TrialBalance_BSDATE2,
                    DIV: this._reportFilterService.TrialBalanceObj.TrialBalance_DIV?this._reportFilterService.TrialBalanceObj.TrialBalance_DIV:'%',
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    CID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    COSTCENTER: this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter?this._reportFilterService.TrialBalanceObj.TrialBalance_CostCenter:'%',
                    LEDGERWISE: this._reportFilterService.TrialBalanceObj.TrialBalance_LEDGERWISE?this._reportFilterService.TrialBalanceObj.TrialBalance_LEDGERWISE:0,
                    SUMMARYREPORT: this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORT?this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORT:0,
                    LEVELS: this._reportFilterService.TrialBalanceObj.TrialBalance_LEVELS,
                    SHOWOPENINGTRIALONLY: this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY,
                    SHOWSUBLEDGER: this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSUBLEDGER,
                    SHOWDEBTORSCREDITORSDETAILS: this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWDEBTORSCREDITORSDETAILS,
                    SHOWSTOCKVALUE: this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWSTOCKVALUE,
                    SHOWCLOSINGONPY: this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY,
                    SHOWZEROBL: this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWZEROBL,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    COMPANYTYPE: this._reportFilterService.TrialBalanceObj.TrialBalance_COMPANYTYPE ? this._reportFilterService.TrialBalanceObj.TrialBalance_COMPANYTYPE : 'NONDMS',
                    DIVISIONNAME : this._reportFilterService.TrialBalanceObj.TrialBalance_DIVISIONNAME ? this._reportFilterService.TrialBalanceObj.TrialBalance_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.TrialBalanceObj.TrialBalance_COSTCENTERDISPLAYNAME?this._reportFilterService.TrialBalanceObj.TrialBalance_COSTCENTERDISPLAYNAME:'',
                    SUMMARYREPORTDISPLAYNAME:this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORTDISPLAYNAME?this._reportFilterService.TrialBalanceObj.TrialBalance_SUMMARYREPORTDISPLAYNAME:''
                    // NODEACID:
                    // NODEACNAME:
                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.TrialBalance_loadedTimes = this._reportFilterService.TrialBalance_loadedTimes+1;
        }
    }

    checkValue() {
        // ////console.log("@@_reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY", this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY)
        if (this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY == true) {
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWOPENINGTRIALONLY =1;
            this._reportFilterService.TrialBalanceObj.TrialBalance_SHOWCLOSINGONPY = 0;
        }
    }


}

