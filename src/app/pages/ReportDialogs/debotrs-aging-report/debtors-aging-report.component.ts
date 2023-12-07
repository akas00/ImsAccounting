import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../common/services/permission/authService.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';


export interface DialogInfo {
    header: string;
    message: Observable<string>;

}
@Component({
    selector: 'result-debtors-aging-report-dialog',
    templateUrl: './debtors-aging-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]

})

export class DebtorsAgingReport implements OnInit{
  AgingValue: any;
    ReportParameters: any = <any>{};
    division: any[] = [];
    CostcenterList: any[] = [];
    multipleReportFormateName:string;
    instanceWiseRepName:string='Debtors Ageing Report';
    AreaList: any[] = [];
    PartyGroupList:any[]=[];
    PartyCategoryList:any[]=[];

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,private _authService: AuthService,
        public reportService: ReportFilterService, private alertService: AlertService,
        public dialogref: MdDialogRef<DebtorsAgingReport>, public _ActivatedRoute: ActivatedRoute,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo,private _reportFilterService:ReportMainService,  private arouter: Router) {
        //----------Default values on load


        // this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
        // this.changeEndDate(this.ReportParameters.DATE2, 'AD');

        this.ReportParameters.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID
        this.ReportParameters.DebtorsAgeing_CostCenter = "%";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE1 = "30";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE2 = "60";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE3 = "90";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE4 = "120";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE5 = "150";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE6 = "180";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE7 = "210";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE8 = "240";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE9 = "270";
        this._reportFilterService.StockAgeingObj.StockAgeing_AGE10 = "300";
        // this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
        this.ReportParameters.ISDEBTORS = 1;


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

            this.masterService.getCostcenter().subscribe(res => {
                this.CostcenterList = res;
            })

            this.masterService.getAreaList().subscribe(res => {
              this.AreaList = res.result;
          })

          this.masterService.getPartyGroupList().subscribe(res => {
            this.PartyGroupList = res.result;
        })

        this.masterService.getPartyCategoryList().subscribe(res => {
          this.PartyCategoryList = res.result;
      })
        
            // this.masterService.getAccDivList();
    }
    userProfile: any;
    ngOnInit(){

      let AgingObj:any = <any>{}
      AgingObj = this.masterService.userProfile.userRights.find(x => x.right =='StockAgeingLimit');
      console.log("dd",AgingObj)
      this.AgingValue = AgingObj.value;
      console.log("AGINGVALUE",this.AgingValue);
        this.userProfile = this._authService.getUserProfile();
        this._ActivatedRoute.queryParams.subscribe(params => {
            if(this._reportFilterService.DebtorsAgeingObj.assignPrevioiusDate != true){
              this.masterService.getAccDivList();
            if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1 = new Date().toJSON().split('T')[0];
                    this.changestartDate(this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1, "AD");
                  }
                  else {

                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changestartDate(this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1, "AD");


                }

                // this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                  if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                    this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV='%';
                }else{
                    if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                      this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV=this.division[0].INITIAL;
                    }else{
                      this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    }
                }
                })
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter ='%';
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_AreaWise=0;
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_PartyGroup='%';
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_PartyCategory='%';
            }

            if(params.instancename){
                // ////console.log("@@[Creditors Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE;
                this.changestartDate(this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1, "AD");
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                this._reportFilterService.DebtorsAgeingObj.DOAGEINGOFOPENINGBL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DOAGEINGOFOPENINGBL;
                this._reportFilterService.DebtorsAgeingObj.GROUPBY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.GROUPBY;
                this.ReportParameters.ISDEBTORS=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ISDEBTORS;
                this._reportFilterService.DebtorsAgeingObj.REPORTMODE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTMODE;
                this._reportFilterService.DebtorsAgeingObj.SHOWDPARTYDETAIL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDPARTYDETAIL;
                this.ReportParameters.D1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D1;
                this.ReportParameters.D2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D2;
                this.ReportParameters.D3=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D3;
                this.ReportParameters.D4=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D4;
                this.ReportParameters.D5=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D5;
                this.ReportParameters.D6=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D6;
                this.ReportParameters.D7=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D7;
                this.ReportParameters.D8=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D8;
                this.ReportParameters.D9=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D9;
                this.ReportParameters.D10=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.D10;
               
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE1 = 30;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE2 = 60;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE3 = 90;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE4 = 120;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE5 = 150;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE6 = 180;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE7 = 210;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE8 = 240;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE9 = 270;
            //     this._reportFilterService.StockAgeingObj.StockAgeing_AGE10 = 300;
            }

        })



    }

    onload() {
      this.ReportParameters.D1 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE1 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE1 : "30";
      this.ReportParameters.D2 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE2 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE2 : "60";
      this.ReportParameters.D3 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE3 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE3 : "90";
      this.ReportParameters.D4 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE4 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE4 : "120";
        if(this.AgingValue>=5){
          this.ReportParameters.D5 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE5 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE5 : "150";
        } else {
          this.ReportParameters.D5 = this.ReportParameters.D4;
        }
        if(this.AgingValue>=6){
          this.ReportParameters.D6 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE6 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE6 : "180";
        } else {
          this.ReportParameters.D6 = this.ReportParameters.D5;
        }
        if(this.AgingValue>=7){
          this.ReportParameters.D7 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE7 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE7 : "210";
        }else {
          this.ReportParameters.D7 = this.ReportParameters.D6;
        }
        if(this.AgingValue>=8){
          this.ReportParameters.D8 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE8 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE8 : "240";
        }else {
          this.ReportParameters.D8 = this.ReportParameters.D7;
        }
        if(this.AgingValue>=9){
          this.ReportParameters.D9 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE9 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE9 : "270";
        }else {
          this.ReportParameters.D9 = this.ReportParameters.D8;
        }
        if(this.AgingValue>=10){
          this.ReportParameters.D10 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE10 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE10 : "300";
        }else {
          this.ReportParameters.D10 = this.ReportParameters.D9;
        }
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV = (this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV == null || this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV == "") ? "%" : this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV;

        if(this._reportFilterService.DebtorsAgeingObj.SHOWDPARTYDETAIL == 1){
            this.multipleReportFormateName = 'Debtors Aging Report_1'
        }else{
            this.multipleReportFormateName = 'Debtors Aging Report'
        }

        if (this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV && this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV == '%') {
            this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV && this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter && this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter == '%') {
            this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_COSTCENTERDISPLAYNAME = '';
          }

        if(res == "ok"){
        this._reportFilterService.DebtorsAgeingObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.DebtorsAgeing_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Debtors Ageing Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.DebtorsAgeing_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Debtors Ageing Report'+'_'+this._reportFilterService.DebtorsAgeing_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.DebtorsAgeing_loadedTimes,
                });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Debtors Ageing Report',
                reportname: this.multipleReportFormateName,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.DebtorsAgeing_loadedTimes,
                reportparam: {
                    DATE: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1,
                    BSDATE: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_BSDATE1,
                    DIV: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIV,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.ReportParameters.COMID,
                    DebtorsAgeing_CostCenter: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter,
                    SHOWDPARTYDETAIL: this._reportFilterService.DebtorsAgeingObj.SHOWDPARTYDETAIL,
                    // OPNINGBLONLY: this._reportFilterService.DebtorsAgeingObj.OPNINGBLONLY,
                    REPORTMODE: this._reportFilterService.DebtorsAgeingObj.REPORTMODE,
                    GROUPBY: this._reportFilterService.DebtorsAgeingObj.GROUPBY?this._reportFilterService.DebtorsAgeingObj.GROUPBY:0,
                    D1: this.ReportParameters.D1,
                    D2: this.ReportParameters.D2,
                    D3: this.ReportParameters.D3,
                    D4: this.ReportParameters.D4,
                    D5: this.ReportParameters.D5,
                    D6: this.ReportParameters.D6,
                    D7: this.ReportParameters.D7,
                    D8: this.ReportParameters.D8,
                    D9: this.ReportParameters.D9,
                    D10: this.ReportParameters.D10,
                    
                    DOAGEINGOFOPENINGBL: this._reportFilterService.DebtorsAgeingObj.DOAGEINGOFOPENINGBL,
                    ISDEBTORS: this.ReportParameters.ISDEBTORS,
                    COSTCENTER: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_CostCenter,
                    // DATE1: this.masterService.PhiscalObj.BeginDate.split('T')[0],
                    // DATE2: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1,
                    DIVISIONNAME : this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIVISIONNAME ? this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_COSTCENTERDISPLAYNAME?this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_COSTCENTERDISPLAYNAME:'',
                    AREA : this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_AreaWise?this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_AreaWise:0,
                    PARTYGROUP : this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_PartyGroup?this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_PartyGroup:'%',
                    INCLUDEPOSTEDTRANSACTION:this._reportFilterService.DebtorsAgeingObj.DebtorsAgeingObj_INCLUDEPOSTEDTRANSACTION?this._reportFilterService.DebtorsAgeingObj.DebtorsAgeingObj_INCLUDEPOSTEDTRANSACTION:0
                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.DebtorsAgeing_loadedTimes = this._reportFilterService.DebtorsAgeing_loadedTimes+1;
        }

    }

    changestartDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            } 
            // this._reportFilterService.DebtorsAgeingObj.DebtorsAgeing_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }
    changeEndDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.ReportParameters.BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
            }
            else if (format == "BS") {
              var datearr = value.split('/');
              const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
                // var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ReportParameters.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

            }
        }
        catch (e) { }

    }


}

