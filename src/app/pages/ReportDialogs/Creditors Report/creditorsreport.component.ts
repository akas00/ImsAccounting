import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, OnInit} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { AlertService } from '../../../common/services/alert/alert.service';

export interface DialogInfo{
    header: string;
    message: Observable<string>;
}

@Component({
    selector : 'result-creditorsreport-dialog',
    templateUrl : './creditorsreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]
})

export class CreditorsReport implements OnInit{
    // ReportParameters:any=<any>{};
    division: any[]=[];
    CostcenterList: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    instanceWiseRepName:string='Creditors Report';
    AreaList: any[] = [];
    PartyGroupList:any[]=[];
    PartyCategoryList:any[]=[];

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<CreditorsReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo,
    private _reportFilterService:ReportMainService, private _authService: AuthService, private arouter: Router,public _ActivatedRoute: ActivatedRoute,
    public reportService: ReportFilterService,private alertService: AlertService,){
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
        this._ActivatedRoute.queryParams.subscribe(params => {
            const mode = params.mode;
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname=='Creditors Report' && this._reportFilterService.CreditorsReportObj.assignPrevioiusDate != true) {
            this._reportFilterService.CreditorsReportObj.Creditors_DATE1=this.reportService.drillParam.reportparam.DATE1;
            this._reportFilterService.CreditorsReportObj.Creditors_DATE2=this.reportService.drillParam.reportparam.DATE2;
            this._reportFilterService.CreditorsReportObj.Creditors_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.CreditorsReportObj.Creditors_CostCenter=this.reportService.drillParam.reportparam.COSTCENTER;
            }else{
                if(this._reportFilterService.CreditorsReportObj.assignPrevioiusDate != true){
                  this.masterService.getAccDivList();
                    this._reportFilterService.CreditorsReportObj.Creditors_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
                    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                        this._reportFilterService.CreditorsReportObj.Creditors_DATE2 = new Date().toJSON().split('T')[0];
                        this.changeEndDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE2 , "AD");
                      }
                      else {

                            this._reportFilterService.CreditorsReportObj.Creditors_DATE2  = this.masterService.PhiscalObj.EndDate.split('T')[0];
                            this.changeEndDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE2 , "AD");


                    }
                    // this._reportFilterService.CreditorsReportObj.Creditors_DATE2 = new Date().toJSON().split('T')[0];
                    // this._reportFilterService.CreditorsReportObj.Creditors_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    this.masterService.viewDivision.subscribe(() => {
                      if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                        this._reportFilterService.CreditorsReportObj.Creditors_DIV='%';
                    }else{
                      if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.CreditorsReportObj.Creditors_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.CreditorsReportObj.Creditors_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                      }
                    }
                    })
                    this._reportFilterService.CreditorsReportObj.Creditors_CostCenter ='%'
                    this._reportFilterService.CreditorsReportObj.REPORTMODEC = '0';
                    this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise=0;
                    this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup='%';
                    this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory='%';
                }

                if(params.instancename){
                    // ////console.log("@@[Creditors Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                    this._reportFilterService.CreditorsReportObj.Creditors_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                    this._reportFilterService.CreditorsReportObj.Creditors_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                    this._reportFilterService.CreditorsReportObj.Creditors_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                    this._reportFilterService.CreditorsReportObj.Creditors_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                    this._reportFilterService.CreditorsReportObj.GROUPBY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.GROUPBY;
                    this._reportFilterService.CreditorsReportObj.Creditors_OPNINGBLONLY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.OPNINGBLONLY;
                    this._reportFilterService.CreditorsReportObj.REPORTMODE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTMODE;
                    this._reportFilterService.CreditorsReportObj.SHOWDPARTYDETAIL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDPARTYDETAIL;
                    this._reportFilterService.CreditorsReportObj.CreditorsReport_INCLUDEPOSTDATE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.IncPostDatedTransaction;
                    this._reportFilterService.CreditorsReportObj.Creditors_INCLUDEPOSTEDTRANSACTION=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.Creditors_INCLUDEPOSTEDTRANSACTION;
                  }
            }
         });


        this.changeEntryDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CreditorsReportObj.Creditors_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.CreditorsReportObj.Creditors_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }

            // this._reportFilterService.CreditorsReportObj.Creditors_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.CreditorsReportObj.Creditors_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.CreditorsReportObj.Creditors_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.CreditorsReportObj.Creditors_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload(){
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.CreditorsReportObj.Creditors_DIV = (this._reportFilterService.CreditorsReportObj.Creditors_DIV == null || this._reportFilterService.CreditorsReportObj.Creditors_DIV == "")?"%":this._reportFilterService.CreditorsReportObj.Creditors_DIV;


        let mulitpleReportFormateName = '';
        if( this._reportFilterService.CreditorsReportObj.SHOWDPARTYDETAIL == 1){
            mulitpleReportFormateName = 'Creditors Report_1';
        }else{
            mulitpleReportFormateName = 'Creditors Report';
        }

        if (this._reportFilterService.CreditorsReportObj.Creditors_DIV && this._reportFilterService.CreditorsReportObj.Creditors_DIV == '%') {
            this._reportFilterService.CreditorsReportObj.Creditors_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.CreditorsReportObj.Creditors_DIV && this._reportFilterService.CreditorsReportObj.Creditors_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.CreditorsReportObj.Creditors_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.CreditorsReportObj.Creditors_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.CreditorsReportObj.Creditors_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.CreditorsReportObj.Creditors_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.CreditorsReportObj.Creditors_CostCenter && this._reportFilterService.CreditorsReportObj.Creditors_CostCenter == '%') {
            this._reportFilterService.CreditorsReportObj.Creditors_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.CreditorsReportObj.Creditors_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.CreditorsReportObj.Creditors_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.CreditorsReportObj.Creditors_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.CreditorsReportObj.Creditors_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.CreditorsReportObj.Creditors_COSTCENTERDISPLAYNAME = '';
          }

          if (this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise && this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise == 0) {
            this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWiseDisplayName = '';
          }
          else if (this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise != 0) {
            let abc = this.AreaList.filter(x=>x.AREA_ID == this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWiseDisplayName = abc[0].AREA_NAME;
            }else{
              this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWiseDisplayName = '';
            }
          } else {
            this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWiseDisplayName = '';
          }
    
          if (this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup && this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup == 0) {
            this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroupDisplayName = '';
          }
          else if (this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup != 0) {
            let abc = this.PartyGroupList.filter(x=>x.ACID == this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroupDisplayName = abc[0].ACNAME;
            }else{
              this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroupDisplayName = '';
            }
          } else {
            this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroupDisplayName = '';
          }
    
          if (this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory && this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory == 0) {
            this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategoryDisplayName = '';
          }
          else if (this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory != 0) {
            let abc = this.PartyCategoryList.filter(x=>x.CATEGORY_ID == this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategoryDisplayName = abc[0].CATEGORYNAME;
            }else{
              this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategoryDisplayName = '';
            }
          } else {
            this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategoryDisplayName = '';
          }
          
        if(res == "ok"){
        this._reportFilterService.CreditorsReportObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }
              if(this._reportFilterService.Creditors_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Creditors Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.Creditors_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Creditors Report'+'_'+this._reportFilterService.Creditors_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.Creditors_loadedTimes,
                });
            }

        }

        this.reportdataEmit.emit({ status: res, data: {reportname:mulitpleReportFormateName,
            REPORTDISPLAYNAME : 'Creditors Report',
            instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.Creditors_loadedTimes,
             reportparam:{
            DATE1: this._reportFilterService.CreditorsReportObj.Creditors_DATE1,
            DATE2: this._reportFilterService.CreditorsReportObj.Creditors_DATE2,
            BSDATE1: this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE1,
            BSDATE2: this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE2,
            DIVISION: this._reportFilterService.CreditorsReportObj.Creditors_DIV,
            COMID:this.masterService.userProfile.CompanyInfo.COMPANYID,
            CostCenter: this._reportFilterService.CreditorsReportObj.Creditors_CostCenter,
            SHOWDPARTYDETAIL: this._reportFilterService.CreditorsReportObj.SHOWDPARTYDETAIL,
            OPNINGBLONLY: this._reportFilterService.CreditorsReportObj.Creditors_OPNINGBLONLY,
            REPORTMODE:this._reportFilterService.CreditorsReportObj.REPORTMODEC,
            GROUPBY:this._reportFilterService.CreditorsReportObj.GROUPBY?this._reportFilterService.CreditorsReportObj.GROUPBY:0,
            PHISCALID: this.masterService.PhiscalObj.PhiscalID,
            COSTCENTER: this._reportFilterService.CreditorsReportObj.Creditors_CostCenter,
            DIV: this._reportFilterService.CreditorsReportObj.Creditors_DIV,
            DIVISIONNAME : this._reportFilterService.CreditorsReportObj.Creditors_DIVISIONNAME ? this._reportFilterService.CreditorsReportObj.Creditors_DIVISIONNAME : '',
            COSTCENTERDISPLAYNAME: this._reportFilterService.CreditorsReportObj.Creditors_COSTCENTERDISPLAYNAME?this._reportFilterService.CreditorsReportObj.Creditors_COSTCENTERDISPLAYNAME:'',
            AREA : this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise?this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWise:0,
            PARTYGROUP : this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup?this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroup:'%',
            SHOWBRANCHBL: this._reportFilterService.CreditorsReportObj.Creditors_SHOWBRANCHBL,
            PARTYCATEGORY:this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory ? this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategory:'%',
            AREAWISEDISPLAYNAME:this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWiseDisplayName ?this._reportFilterService.CreditorsReportObj.CreditorsReport_AreaWiseDisplayName:'',
            PARTYGROUPDISPLAYNAME: this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroupDisplayName ? this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyGroupDisplayName:'',
            PARTYCATEGORYDISPLAYNAME:this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategoryDisplayName ?this._reportFilterService.CreditorsReportObj.CreditorsReport_PartyCategoryDisplayName:'',
           // IncPostDatedTransaction :this._reportFilterService.CreditorsReportObj.CreditorsReport_INCLUDEPOSTDATE ? this._reportFilterService.CreditorsReportObj.CreditorsReport_INCLUDEPOSTDATE:0,
            INCLUDEPOSTEDTRANSACTION:this._reportFilterService.CreditorsReportObj.Creditors_INCLUDEPOSTEDTRANSACTION ? this._reportFilterService.CreditorsReportObj.Creditors_INCLUDEPOSTEDTRANSACTION:0,
        }}});

        if(res == "ok"){
            this._reportFilterService.Creditors_loadedTimes = this._reportFilterService.Creditors_loadedTimes+1;
        }

    }

    checkValueForOpeningCreditors(){
        if(this._reportFilterService.CreditorsReportObj.Creditors_OPNINGBLONLY == true){
            this._reportFilterService.CreditorsReportObj.Creditors_OPNINGBLONLY = 1;
            this.date1 = this._reportFilterService.CreditorsReportObj.Creditors_DATE1;
            this.date2=this._reportFilterService.CreditorsReportObj.Creditors_DATE2;
            this._reportFilterService.CreditorsReportObj.Creditors_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
            this._reportFilterService.CreditorsReportObj.Creditors_DATE2=this.masterService.PhiscalObj.EndDate.split('T')[0];
            this.changeEntryDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE1, "AD");
            this.changeEndDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE2, "AD");
        }else{
            this._reportFilterService.CreditorsReportObj.Creditors_OPNINGBLONLY = 0;
            this._reportFilterService.CreditorsReportObj.Creditors_DATE1= this.date1?this.date1:this._reportFilterService.CreditorsReportObj.Creditors_DATE1;
            this._reportFilterService.CreditorsReportObj.Creditors_DATE2= this.date2?this.date2:this._reportFilterService.CreditorsReportObj.Creditors_DATE2;
            this.changeEntryDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE1, "AD");
            this.changeEndDate(this._reportFilterService.CreditorsReportObj.Creditors_DATE2, "AD");
        }
    }

}


