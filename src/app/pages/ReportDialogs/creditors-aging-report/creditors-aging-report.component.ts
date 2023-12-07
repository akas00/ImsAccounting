import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, OnInit} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';


export interface DialogInfo{
    header: string;
    message: Observable<string>;

}
@Component({
    selector : 'result-creditros-aging-report-dialog',
    templateUrl : './creditors-aging-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class CreditorsAgingReport implements OnInit{
  AgingValue: any;
    ReportParameters:any=<any>{};
    multipleReportFormateName:string;
    division: any[] = [];
    CostcenterList: any[] = [];
    instanceWiseRepName:string='Creditors Ageing Report';
    AreaList: any[] = [];
    PartyGroupList:any[]=[];
    PartyCategoryList:any[]=[];

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,
        public dialogref:MdDialogRef<CreditorsAgingReport>,
         @Inject(MD_DIALOG_DATA) public data: DialogInfo, public _ActivatedRoute: ActivatedRoute,
         private _reportFilterService:ReportMainService, private alertService: AlertService, private arouter: Router){
      //----------Default values on load


    //   this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
    //   this.changeEndDate(this.ReportParameters.DATE2,'AD');


      this.multipleReportFormateName = 'Creditors Aging Report';
      this.ReportParameters.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID
    //   this.ReportParameters.CreditorsAgeing_CostCenter = "%";
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

    //   this.ReportParameters.CHK_AGEINGOFPARTYOPENING = 1;
    //   this.ReportParameters.CHK_SHOWAGEINGREPORT = 0;
    // this.ReportParameters.DIVISION=this.masterService.userProfile.CompanyInfo.INITIAL;
    this.ReportParameters.ISDEBTORS = 0;


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

    ngOnInit(){

      let AgingObj:any = <any>{}
      AgingObj = this.masterService.userProfile.userRights.find(x => x.right =='StockAgeingLimit');
      console.log("dd",AgingObj)
      this.AgingValue = AgingObj.value;
      console.log("AGINGVALUE",this.AgingValue);
        this._ActivatedRoute.queryParams.subscribe(params => {
            if(this._reportFilterService.CreditorsAgeingObj.assignPrevioiusDate != true){
              this.masterService.getAccDivList();
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1 = new Date().toJSON().split('T')[0];
                    this.changestartDate(this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1, "AD");
                  }
                  else {

                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changestartDate(this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1, "AD");


                }


                this.masterService.viewDivision.subscribe(() => {
                  if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                    this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV='%';
                }else{
                    this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                }
                })
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter ='%';
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_AreaWise=0;
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_PartyGroup='%';
            }

            if(params.instancename){
                // ////console.log("@@[Creditors Outs Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                this._reportFilterService.CreditorsAgeingObj.DOAGEINGOFOPENINGBL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DOAGEINGOFOPENINGBL;
                this._reportFilterService.CreditorsAgeingObj.GROUPBY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.GROUPBY;
                this.ReportParameters.ISDEBTORS=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ISDEBTORS;
                this._reportFilterService.CreditorsAgeingObj.REPORTMODE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTMODE;
                this._reportFilterService.CreditorsAgeingObj.SHOWDPARTYDETAIL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDPARTYDETAIL;
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
            }
        })


        this.changestartDate(this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1, "AD");
    }

    onload(){
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
        console.log("aging",this.AgingValue)
        if(this.AgingValue>=10){
          this.ReportParameters.D10 = this._reportFilterService.StockAgeingObj.StockAgeing_AGE10 ? this._reportFilterService.StockAgeingObj.StockAgeing_AGE10 : "300";
        }else {
          this.ReportParameters.D10 = this.ReportParameters.D9;
        }
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV = (this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV == null || this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV == "")?"%":this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV;

        if(this._reportFilterService.CreditorsAgeingObj.SHOWDPARTYDETAIL == 1){
            this.multipleReportFormateName = 'Creditors Aging Report_1';
        }else{
            this.multipleReportFormateName = 'Creditors Aging Report';
        }

        if (this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV && this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV == '%') {
            this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV && this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter && this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter == '%') {
            this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_COSTCENTERDISPLAYNAME = '';
          }
          
        if(res == "ok"){
        this._reportFilterService.CreditorsAgeingObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.CreditorsAgeing_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Creditors Ageing Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.CreditorsAgeing_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Creditors Ageing Report'+'_'+this._reportFilterService.CreditorsAgeing_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.CreditorsAgeing_loadedTimes,
                });
            }

        }

        this.reportdataEmit.emit({ status: res, data: {reportname:this.multipleReportFormateName,
            REPORTDISPLAYNAME : 'Creditors Ageing Report',
            instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.CreditorsAgeing_loadedTimes,
            reportparam:{
            DATE: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1,
            BSDATE: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_BSDATE1,
            DIV: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIV,
            PHISCALID: this.masterService.PhiscalObj.PhiscalID,
            COMID:this.ReportParameters.COMID,
            CreditorsAgeing_CostCenter: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter,
            SHOWDPARTYDETAIL: this._reportFilterService.CreditorsAgeingObj.SHOWDPARTYDETAIL,
            // OPNINGBLONLY: this._reportFilterService.CreditorsAgeingObj.OPNINGBLONLY,
            REPORTMODE:this._reportFilterService.CreditorsAgeingObj.REPORTMODE,
            GROUPBY:this._reportFilterService.CreditorsAgeingObj.GROUPBY?this._reportFilterService.CreditorsAgeingObj.GROUPBY:0,
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
            DOAGEINGOFOPENINGBL: this._reportFilterService.CreditorsAgeingObj.DOAGEINGOFOPENINGBL,
            ISDEBTORS: this.ReportParameters.ISDEBTORS,
            COSTCENTER: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_CostCenter,
            // DATE1: this.masterService.PhiscalObj.BeginDate.split('T')[0],
            // DATE2: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1,
            DIVISIONNAME : this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIVISIONNAME ? this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DIVISIONNAME : '',
            COSTCENTERDISPLAYNAME: this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_COSTCENTERDISPLAYNAME?this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_COSTCENTERDISPLAYNAME:'',
            AREA : this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_AreaWise?this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_AreaWise:0,
            PARTYGROUP : this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_PartyGroup?this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_PartyGroup:'%',
            INCLUDEPOSTEDTRANSACTION:this._reportFilterService.CreditorsAgeingObj.CreditorsAgeingObj_INCLUDEPOSTEDTRANSACTION?this._reportFilterService.CreditorsAgeingObj.CreditorsAgeingObj_INCLUDEPOSTEDTRANSACTION:0

        } }});

        if(res == "ok"){
            this._reportFilterService.CreditorsAgeing_loadedTimes = this._reportFilterService.CreditorsAgeing_loadedTimes+1;
        }
    }

    changestartDate(value, format: string) {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_BSDATE1 =  (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
                // this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
    }

    changeEndDate(value, format: string) {
        try{
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.ReportParameters.BSDATE2 =  (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
            }
            else if (format == "BS") {
              var datearr = value.split('/');
              const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
                // var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ReportParameters.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        }
          catch(e){}
    }
}

