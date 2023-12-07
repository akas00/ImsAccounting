import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'result-debtorsreport-dialog',
    templateUrl: './debtorsreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class DebtorsReport implements OnInit{
    // ReportParameters: any = <any>{};
    division: any[] = [];
    CostcenterList: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    instanceWiseRepName:string='Debtors Report';
    AreaList: any[] = [];
    PartyGroupList:any[]=[];
    PartyCategoryList:any[]=[];
  @ViewChild("genericeSalesManList")
  genericeSalesManList: GenericPopUpComponent;
  gridSalesmanListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,private _authService: AuthService,
        private _reportFilterService:ReportMainService, private arouter: Router,public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService, private alertService: AlertService,
        public dialogref: MdDialogRef<DebtorsReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
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
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname=='Debtors Report' && this._reportFilterService.DebtorsReportObj.assignPrevioiusDate != true) {
            this._reportFilterService.DebtorsReportObj.Debtors_DATE1=this.reportService.drillParam.reportparam.DATE1;
            this._reportFilterService.DebtorsReportObj.Debtors_DATE2=this.reportService.drillParam.reportparam.DATE2;
            this._reportFilterService.DebtorsReportObj.Debtors_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.DebtorsReportObj.Debtors_CostCenter=this.reportService.drillParam.reportparam.COSTCENTER;
            }else{
                if(this._reportFilterService.DebtorsReportObj.assignPrevioiusDate != true){
                  this.masterService.getAccDivList();
                    this._reportFilterService.DebtorsReportObj.Debtors_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
                    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                        this._reportFilterService.DebtorsReportObj.Debtors_DATE2  = new Date().toJSON().split('T')[0];
                        this.changeEndDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE2  , "AD");
                      }
                      else {
                            this._reportFilterService.DebtorsReportObj.Debtors_DATE2  = this.masterService.PhiscalObj.EndDate.split('T')[0];
                            this.changeEndDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE2  , "AD");
                    }
                    // this._reportFilterService.DebtorsReportObj.Debtors_DATE2 = new Date().toJSON().split('T')[0];
                    this._reportFilterService.DebtorsReportObj.REPORTMODE='0';
                    // this._reportFilterService.DebtorsReportObj.Debtors_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    this.masterService.viewDivision.subscribe(() => {
                      if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                        this._reportFilterService.DebtorsReportObj.Debtors_DIV='%';
                    }else{
                      if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.DebtorsReportObj.Debtors_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.DebtorsReportObj.Debtors_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                      }
                    }
                    })
                    this._reportFilterService.DebtorsReportObj.Debtors_CostCenter ='%';
                    this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise=0;
                    this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup='%';
                    this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory ='%';


                    }

                    if(params.instancename){
                        // ////console.log("@@[Debtors Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                        this._reportFilterService.DebtorsReportObj.Debtors_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                        this._reportFilterService.DebtorsReportObj.Debtors_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                        this._reportFilterService.DebtorsReportObj.Debtors_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                        this._reportFilterService.DebtorsReportObj.Debtors_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                        this._reportFilterService.DebtorsReportObj.GROUPBY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.GROUPBY;
                        this._reportFilterService.DebtorsReportObj.Debtors_OPNINGBLONLY=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.OPNINGBLONLY;
                        this._reportFilterService.DebtorsReportObj.REPORTMODE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTMODE;
                        this._reportFilterService.DebtorsReportObj.SHOWDPARTYDETAIL=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWDPARTYDETAIL;
                        this._reportFilterService.DebtorsReportObj.Debtors_INCLUDEPOSTEDTRANSACTION=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.Debtors_INCLUDEPOSTEDTRANSACTION;
                        this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.PARTYCATEGORY;
                        this._reportFilterService.DebtorsReportObj.Debtors_SHOWBRANCHBL = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWBRANCHBL;
                        this._reportFilterService.DebtorsReportObj.DebtorsReport_INCLUDEPOSTDATE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.IncPostDatedTransaction;
                    }
            }
        });

        this.changeEntryDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE2, "AD");

    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.DebtorsReportObj.Debtors_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.DebtorsReportObj.Debtors_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
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
            this._reportFilterService.DebtorsReportObj.Debtors_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.DebtorsReportObj.Debtors_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }

          }
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.DebtorsReportObj.Debtors_DIV = (this._reportFilterService.DebtorsReportObj.Debtors_DIV== null || this._reportFilterService.DebtorsReportObj.Debtors_DIV == "") ? "%" : this._reportFilterService.DebtorsReportObj.Debtors_DIV;

       let multipleReportFormateName = '';
       if(this._reportFilterService.DebtorsReportObj.SHOWDPARTYDETAIL == 1){
           multipleReportFormateName = 'Debtors Report_1'
       }else{
           multipleReportFormateName = 'Debtors Report'
       }

       if (this._reportFilterService.DebtorsReportObj.Debtors_DIV && this._reportFilterService.DebtorsReportObj.Debtors_DIV == '%') {
        this._reportFilterService.DebtorsReportObj.Debtors_DIVISIONNAME = 'All';
      }else if( this._reportFilterService.DebtorsReportObj.Debtors_DIV && this._reportFilterService.DebtorsReportObj.Debtors_DIV!= '%'){
        let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.DebtorsReportObj.Debtors_DIV);
          if(abc && abc.length>0 && abc[0]){
            this._reportFilterService.DebtorsReportObj.Debtors_DIVISIONNAME = abc[0].NAME;
          }else{
            this._reportFilterService.DebtorsReportObj.Debtors_DIVISIONNAME = '';
          }
      }else{
        this._reportFilterService.DebtorsReportObj.Debtors_DIVISIONNAME = '';
      }

      if (this._reportFilterService.DebtorsReportObj.Debtors_CostCenter && this._reportFilterService.DebtorsReportObj.Debtors_CostCenter == '%') {
        this._reportFilterService.DebtorsReportObj.Debtors_COSTCENTERDISPLAYNAME = '';
      }
      else if (this._reportFilterService.DebtorsReportObj.Debtors_CostCenter != '%') {
        let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.DebtorsReportObj.Debtors_CostCenter);
        if(abc && abc.length>0 && abc[0]){
          this._reportFilterService.DebtorsReportObj.Debtors_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
        }else{
          this._reportFilterService.DebtorsReportObj.Debtors_COSTCENTERDISPLAYNAME = '';
        }
      } else {
        this._reportFilterService.DebtorsReportObj.Debtors_COSTCENTERDISPLAYNAME = '';
      }

      
      if (this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise && this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise == 0) {
        this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWiseDisplayName = '';
      }
      else if (this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise != 0) {
        let abc = this.AreaList.filter(x=>x.AREA_ID == this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise);
        if(abc && abc.length>0 && abc[0]){
          this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWiseDisplayName = abc[0].AREA_NAME;
        }else{
          this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWiseDisplayName = '';
        }
      } else {
        this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWiseDisplayName = '';
      }

      if (this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup && this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup == 0) {
        this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroupDisplayName = '';
      }
      else if (this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup != 0) {
        let abc = this.PartyGroupList.filter(x=>x.ACID == this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup);
        if(abc && abc.length>0 && abc[0]){
          this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroupDisplayName = abc[0].ACNAME;
        }else{
          this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroupDisplayName = '';
        }
      } else {
        this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroupDisplayName = '';
      }

      if (this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory && this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory == 0) {
        this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategoryDisplayName = '';
      }
      else if (this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory != 0) {
        let abc = this.PartyCategoryList.filter(x=>x.CATEGORY_ID == this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory);
        if(abc && abc.length>0 && abc[0]){
          this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategoryDisplayName = abc[0].CATEGORYNAME;
        }else{
          this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategoryDisplayName = '';
        }
      } else {
        this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategoryDisplayName = '';
      }
      

       if(res == "ok"){
       this._reportFilterService.DebtorsReportObj.assignPrevioiusDate = true;
       let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.loadedTimesD == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Debtors Report',
                    activeurlpath: this.arouter.url,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.loadedTimesD,
                    activerurlpath2: activeurlpath2,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Debtors Report' +'_'+this._reportFilterService.loadedTimesD,
                    activeurlpath: this.arouter.url,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.loadedTimesD,
                    activerurlpath2: activeurlpath2,
                });
            }

       }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Debtors Report',
                reportname: multipleReportFormateName,instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.loadedTimesD, reportparam: {
                    DATE1: this._reportFilterService.DebtorsReportObj.Debtors_DATE1,
                    DATE2: this._reportFilterService.DebtorsReportObj.Debtors_DATE2,
                    BSDATE1: this._reportFilterService.DebtorsReportObj.Debtors_BSDATE1,
                    BSDATE2: this._reportFilterService.DebtorsReportObj.Debtors_BSDATE2,
                    DIV: this._reportFilterService.DebtorsReportObj.Debtors_DIV,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    CostCenter: this._reportFilterService.DebtorsReportObj.Debtors_CostCenter,
                    SHOWDPARTYDETAIL: this._reportFilterService.DebtorsReportObj.SHOWDPARTYDETAIL,
                    OPNINGBLONLY: this._reportFilterService.DebtorsReportObj.Debtors_OPNINGBLONLY,
                    REPORTMODE: this._reportFilterService.DebtorsReportObj.REPORTMODE,
                    GROUPBY: this._reportFilterService.DebtorsReportObj.GROUPBY?this._reportFilterService.DebtorsReportObj.GROUPBY:0,
                    COSTCENTER: this._reportFilterService.DebtorsReportObj.Debtors_CostCenter,
                    DIVISIONNAME : this._reportFilterService.DebtorsReportObj.Debtors_DIVISIONNAME ? this._reportFilterService.DebtorsReportObj.Debtors_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.DebtorsReportObj.Debtors_COSTCENTERDISPLAYNAME?this._reportFilterService.DebtorsReportObj.Debtors_COSTCENTERDISPLAYNAME:'',
                    AREA : this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise?this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWise:0,
                    PARTYGROUP : this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup?this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroup:'%',
                    SHOWBRANCHBL: this._reportFilterService.DebtorsReportObj.Debtors_SHOWBRANCHBL,
                    PARTYCATEGORY:this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory ? this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategory :'%',
                    AREAWISEDISPLAYNAME:this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWiseDisplayName ?this._reportFilterService.DebtorsReportObj.DebtorsReport_AreaWiseDisplayName:'',
                    PARTYGROUPDISPLAYNAME:this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroupDisplayName ?this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyGroupDisplayName:'',
                    PARTYCATEGORYDISPLAYNAME:this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategoryDisplayName ?this._reportFilterService.DebtorsReportObj.DebtorsReport_PartyCategoryDisplayName:'',
                    //IncPostDatedTransaction :this._reportFilterService.DebtorsReportObj.DebtorsReport_INCLUDEPOSTDATE ? this._reportFilterService.DebtorsReportObj.DebtorsReport_INCLUDEPOSTDATE:0,
                    INCLUDEPOSTEDTRANSACTION: this._reportFilterService.DebtorsReportObj.Debtors_INCLUDEPOSTEDTRANSACTION?this._reportFilterService.DebtorsReportObj.Debtors_INCLUDEPOSTEDTRANSACTION :0,
                    // SALESMAN:this._reportFilterService.DebtorsReportObj.Debtors_salesman_ID?this._reportFilterService.DebtorsReportObj.Debtors_salesman_ID:'%'
                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.loadedTimesD = this._reportFilterService.loadedTimesD+1;
        }
    }

    checkValueForOpeningDebtors(){
        if(this._reportFilterService.DebtorsReportObj.Debtors_OPNINGBLONLY == true){
            this._reportFilterService.DebtorsReportObj.Debtors_OPNINGBLONLY = 1;
            this.date1 = this._reportFilterService.DebtorsReportObj.Debtors_DATE1;
            this.date2=this._reportFilterService.DebtorsReportObj.Debtors_DATE2;
            this._reportFilterService.DebtorsReportObj.Debtors_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
            this._reportFilterService.DebtorsReportObj.Debtors_DATE2=this.masterService.PhiscalObj.EndDate.split('T')[0];
            this.changeEntryDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE1, "AD");
            this.changeEndDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE2, "AD");
        }else{
            this._reportFilterService.DebtorsReportObj.Debtors_OPNINGBLONLY = 0;
            this._reportFilterService.DebtorsReportObj.Debtors_DATE1= this.date1?this.date1:this._reportFilterService.DebtorsReportObj.Debtors_DATE1;
            this._reportFilterService.DebtorsReportObj.Debtors_DATE2= this.date2?this.date2:this._reportFilterService.DebtorsReportObj.Debtors_DATE2;
            this.changeEntryDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE1, "AD");
            this.changeEndDate(this._reportFilterService.DebtorsReportObj.Debtors_DATE2, "AD");
        }

    }

    showSalesmanList() {
      this.gridSalesmanListPopupSettings = {
        title: "Salesman",
        apiEndpoints: `/getAllSalesmanList`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: "NAME",
            title: "Salesman",
            hidden: false,
            noSearch: false
          }
        ]
      };
  
      this.genericeSalesManList.show();
    }

    onSalesManSelect(event){
      //console.log("@@EVENT",event);
      this._reportFilterService.DebtorsReportObj.Debtors_salesman = event.NAME;
      this._reportFilterService.DebtorsReportObj.Debtors_salesman_ID= event.SALESMANID;
    }

}

