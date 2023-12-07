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
    selector: 'consolidated-trial-balance-report',
    templateUrl: './consolidated-trial-balance-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class ConsolidatedTrialBalanceReport implements OnInit {
    // ReportParameters: any = <any>{};
    division: any[] = [];
    CostcenterList: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    instanceWiseRepName:string='Consolidated Trial Balance Report';
    userSetting: any;

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private arouter: Router,private alertService: AlertService,
         public _ActivatedRoute: ActivatedRoute,
        public dialogref: MdDialogRef<ConsolidatedTrialBalanceReport>,
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
        this.masterService.getAccDivList();

    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.ConsolidatedTrialBalanceObj.assignPrevioiusDate != true) {
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                // this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter = '%';
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_LEDGERWISE = '0';
                
            }

            if(params.instancename){
                //console.log("@@[trial bln Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                // this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_LEDGERWISE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.LEDGERWISE;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWDEBTORSCREDITORSDETAILS=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDEBTORSCREDITORSDETAILS;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWOPENINGTRIALONLY;
                // this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSTOCKVALUE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWSTOCKVALUE;
                this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSUBLEDGER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWSUBLEDGER;
                // this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWZEROBL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWZEROBL;
               
            }

        })

        this.changeEntryDate(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE1= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
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
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_BSDATE2 =(bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0]
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
       
        if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY == true){
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY =1;
        }else{
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY =0;
        }
        if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSUBLEDGER == true){
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSUBLEDGER =1;
        }else{
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSUBLEDGER =0;
        }
        if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWDEBTORSCREDITORSDETAILS == true){
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWDEBTORSCREDITORSDETAILS =1;
        }else{
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWDEBTORSCREDITORSDETAILS =0;
        }
        // if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSTOCKVALUE == true){
        //     this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSTOCKVALUE =1;
        // }else{
        //     this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSTOCKVALUE =0;
        // }

        // if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWZEROBL == true){
        //     this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWZEROBL =1;
        // }else{
        //     this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWZEROBL =0;
        // }

        let multipleReportFormateName = '';
        if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_LEDGERWISE == 0){
            multipleReportFormateName = 'Consolidated Trial Balance Report';
        }else if(this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_LEDGERWISE == 1 ){
            multipleReportFormateName = 'Consolidated Trial Balance Report_1'
        }else {
            multipleReportFormateName = 'Consolidated Trial Balance Report';
        }

        // if (this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV && this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV == '%') {
        //     this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIVISIONNAME = 'All';
        //   }else if( this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV && this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV!= '%'){
        //     let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV);
        //       if(abc && abc.length>0 && abc[0]){
        //         this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIVISIONNAME = abc[0].NAME;
        //       }else{
        //         this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIVISIONNAME = '';
        //       }
        //   }else{
        //     this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIVISIONNAME = '';
        //   }
    
          if (this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter && this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter == '%') {
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_COSTCENTERDISPLAYNAME = '';
          }

        if (res == "ok") {
            this._reportFilterService.ConsolidatedTrialBalanceObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if(this._reportFilterService.consolidated_TrialBalance_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: ' Consolidated Trial Balance Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.consolidated_TrialBalance_loadedTimes,
                    });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: ' Consolidated Trial Balance Report'+'_'+this._reportFilterService.consolidated_TrialBalance_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.consolidated_TrialBalance_loadedTimes,
                    });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multipleReportFormateName,
                REPORTDISPLAYNAME : 'Consolidated Trial Balance Report',
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.consolidated_TrialBalance_loadedTimes,
                reportparam: {
                    DATE1: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE1,
                    DATE2: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DATE2,
                    // DIV: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV?this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIV:'%',
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    CID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    COSTCENTER: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter?this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_CostCenter:'%',
                    LEDGERWISE: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_LEDGERWISE?this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_LEDGERWISE:0,
                    SHOWOPENINGTRIALONLY: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY,
                    SHOWSUBLEDGER: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSUBLEDGER,
                    SHOWDEBTORSCREDITORSDETAILS: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWDEBTORSCREDITORSDETAILS,
                    // SHOWSTOCKVALUE: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWSTOCKVALUE,
                    // SHOWZEROBL: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWZEROBL,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                
                    // NODEACID:
                    // NODEACNAME:
                    // DIVISIONNAME : this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIVISIONNAME ? this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_COSTCENTERDISPLAYNAME?this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_COSTCENTERDISPLAYNAME:'',
                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.consolidated_TrialBalance_loadedTimes = this._reportFilterService.consolidated_TrialBalance_loadedTimes+1;
        }
    }

    checkValue() {
        // ////console.log("@@_reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY", this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY)
        if (this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY == true) {
            this._reportFilterService.ConsolidatedTrialBalanceObj.Consolidated_TrialBalance_SHOWOPENINGTRIALONLY =1;
        }
    }


}

