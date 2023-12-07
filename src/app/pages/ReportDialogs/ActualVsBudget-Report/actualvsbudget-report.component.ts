import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { BudgetData, Pobj } from '../../masters/components/BudgetMaster/add-budget-master.component';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
    
}

@Component({
    selector: 'actual-vs-budget-report',
    templateUrl: './actualvsbudget-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class ActualVsBudgetReport {
    division: any[] = [];
    CostcenterList: any[] = [];
    userProfile: any;
    date1: any;
    date2: any;
    userSetting: any;
    instanceWiseRepName:string='Actual Vs Budget  Report';
    @Output() reportdataEmit = new EventEmitter();
    account:any[]=[];
    AccLedger_result:boolean;
    BudgetObj: Pobj = <Pobj>{};
    public temp_DetailList: BudgetData[];
    ReportOptionAll:boolean=true;
    reportNameFormatWise:string;

    @ViewChild("genericGridAccountLedger") genericGridAccountLedger: GenericPopUpComponent;
    gridPopupSettingsForAccountLedgerList: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericGridBudgetList") genericGridBudgetList: GenericPopUpComponent;
    gridPopupSettingsForBudgetList: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(private masterService: MasterRepo, private arouter: Router, private _authService: AuthService,public _ActivatedRoute: ActivatedRoute, private _reportFilterService:ReportMainService,private alertService: AlertService, ){


        this.userProfile = this._authService.getUserProfile();
        this.userSetting = _authService.getSetting();

        this.masterService.getAccountListACIDNotLikePA().subscribe(res => {
            this.account=res.data;
            if(this.account.length!=0){
                this.AccLedger_result=true;
            }else{
                this.AccLedger_result=false;
            }
        })
        // this.division = [];
        // if (this.masterService.userSetting.userwisedivision == 1) {
        //     this.masterService.getDivisionFromRightPrivelege().subscribe(res => {
        //         if (res.status == 'ok') {
        //             this.division = res.result;
        //         }
        //     })
        // }
        // else {
        //     this.masterService.getAllDivisions()
        //         .subscribe(res => {
        //             this.division.push(<Division>res);
        //         }, error => {
        //             this.masterService.resolveError(error, "divisions - getDivisions");
        //         });
        // }

        this.masterService.getCostcenter().subscribe(res => {
            this.CostcenterList = res;
        })
    }


    ngOnInit(){
        this._ActivatedRoute.queryParams.subscribe(params => {

        if (this._reportFilterService.ActualVsBudgetObj.assignPrevioiusDate != true) {
            this.masterService.getAccDivList();
        this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
        this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
            // this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
            this.masterService.viewDivision.subscribe(() => {
                if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                  this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIV='%';
              }else{
                if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                    this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIV=this.division[0].INITIAL;
                  }else{
                    this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                }
              }
              })
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter = '%'
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_OVERVIEWREPORT = '0'
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_REPORTOPTION = '0'
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BUDGETSELECTION = '0'
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATETYPE = '0'
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CheckOption = '0'
          
        }
    })
        this.changestartDate(this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE2, "AD");
    }


    
    changestartDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BSDATE1 =  (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE1  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.CreditorsAgeingObj.CreditorsAgeing_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
}

changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BSDATE2 =(bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0]
        // var bsDate = (value.replace("-", "/")).replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
}

onload() {
    this.DialogClosedResult("ok");
}

closeReportBox() {
    this.DialogClosedResult("Error!");
}

public DialogClosedResult(res) {
    let multipleReportFormateName = '';
   
      if (this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter && this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter == '%') {
        this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_COSTCENTERNAME = 'All';
      }
      else if (this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter != '%') {
        let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter);
        if(abc && abc.length>0 && abc[0]){
          this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_COSTCENTERNAME = abc[0].COSTCENTERNAME;
        }else{
          this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_COSTCENTERNAME = '';
        }
      } else {
        this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_COSTCENTERNAME = '';
      }

   
    if (res == "ok") {
        this._reportFilterService.ActualVsBudgetObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
        if (routepaths && routepaths.length) {
            activeurlpath2 = routepaths[routepaths.length - 1]
        }

        if(this._reportFilterService.ActualVsBUdget_loadedTimes == 0){
            this._reportFilterService.previouslyLoadedReportList.push(
                {
                    reportname: 'BUDGETVSUTILIZATION REPORT',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.ActualVsBUdget_loadedTimes,
                });
        }else{
            this._reportFilterService.previouslyLoadedReportList.push(
                {
                    reportname: 'BUDGETVSUTILIZATION REPORT'+'_'+this._reportFilterService.ActualVsBUdget_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.ActualVsBUdget_loadedTimes,
                });
        }

    }

    if (this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_OVERVIEWREPORT == 0) {

        this.reportNameFormatWise = 'BUDGETVSUTILIZATION REPORT';
    } else if(this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_OVERVIEWREPORT==1) {
        this.reportNameFormatWise = 'BUDGETVSUTILIZATION REPORT_2';
    }

    if(this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_REPORTOPTION==1){
        this.reportNameFormatWise = 'BUDGETVSUTILIZATION REPORT_3';
    }


    this.reportdataEmit.emit({
        status: res, data: {
            REPORTDISPLAYNAME : 'BUDGETVSUTILIZATION REPORT',
            reportname:  this.reportNameFormatWise,
            instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.ActualVsBUdget_loadedTimes,
            reportparam: {
                REPORTOPTIONDISPLAYNAME: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_REPORTOPTIONDISPLAYNAME?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_REPORTOPTIONDISPLAYNAME:'',
                DATE1: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE1,
                DATE2: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATE2,
                // BSDATE1: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BSDATE1,
                // BSDATE2: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BSDATE2,
                // DIV: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIV?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIV:'%',
                PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                CID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                COSTCENTER: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CostCenter:'%',
                DETAIL: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_OVERVIEWREPORT?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_OVERVIEWREPORT:0,
                TYPE: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_REPORTOPTION?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_REPORTOPTION:0,
                BUDGETSELECTION: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BUDGETSELECTION?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_BUDGETSELECTION:0,
                MODE: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_CheckOption,
                AD_BS:this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DATETYPE,
                ACID: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_AccLedger_ACID ,
            
                COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                // COMPANYTYPE: this._reportFilterService.ActualVsBudgetObj.TrialBalance_COMPANYTYPE ? this._reportFilterService.ActualVsBudgetObj.TrialBalance_COMPANYTYPE : 'NONDMS',
                // DIVISIONNAME : this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIVISIONNAME ? this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_DIVISIONNAME : '',
                COSTCENTERDISPLAYNAME: this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_COSTCENTERNAME?this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_COSTCENTERNAME:'',
               
             
            }
        }
    });

    // if(res == "ok"){
        this._reportFilterService.ActualVsBUdget_loadedTimes = this._reportFilterService.ActualVsBUdget_loadedTimes+1;
    // }
}


AccountEnterClicked() {
    this.gridPopupSettingsForAccountLedgerList = this.masterService.getGenericGridPopUpSettings('AccountLedgerListForReport');
    this.genericGridAccountLedger.show();
}

dblClickAccountSelect(account) {
    this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_AccLedger_ACID = account.ACID;
    this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_AccLedger_ACCNAME = account.ACNAME;
    // this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount = account.ACID;
}


BudgetSelectionClicked() {
    this.gridPopupSettingsForBudgetList = {
      title: "Budget List",
      apiEndpoints: `/getBudgetNameList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "BUDGET_NUMBER",
          title: "Budget No",
          hidden: false,
          noSearch: false
        },
        {
          key: "BUDGET_NAME",
          title: "Budget Name",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridBudgetList.show();
  }

  dblClickBudgetSelect(value) {
    this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_Budget_Name = value.BUDGET_NAME;
    this._reportFilterService.ActualVsBudgetObj.ActualVsBudget_Budget_Num = value.BUDGET_NUMBER;
    // this.masterService.LoadBudgetAllocation(value.VCHRNO)
    //   .subscribe(data => {
    //     if (data.status == 'ok') {
    //       if (data.result && data.result.length && data.result.length > 0) {
    //         this.BudgetObj.MODE = "ADD";
    //         this.BudgetObj.BUDGET_TYPE = data.result[0].BUDGET_TYPE;
    //         this.BudgetObj.BUDGET_INTERVAL = data.result[0].BUDGET_INTERVAL;
    //         this.BudgetObj.INTERVAL_ON_AD_OR_BS = data.result[0].INTERVAL_ON_AD_OR_BS;
    //         this.BudgetObj.TRNDATE = data.result[0].TRNDATE;
    //         this.BudgetObj.BSDATE = data.result[0].BSDATE;
    //         this.BudgetObj.SUBDIVIDED_BY = data.result[0].SUBDIVIDED_BY;
    //         this.BudgetObj.FROM_DATE = data.result[0].FROM_DATE;
    //         this.BudgetObj.FROM_BSDATE = data.result[0].FROM_BSDATE;
    //         this.BudgetObj.TO_DATE = data.result[0].TO_DATE;
    //         this.BudgetObj.TO_BSDATE = data.result[0].TO_BSDATE;
    //         this.BudgetObj.ACTION = data.result[0].ACTION;
    //         this.BudgetObj.ACTION_TYPE = data.result[0].ACTION_TYPE;
    //         // this.ChooseInterval();
    //         // this.SelectionAction();
    //       }
    //       if (data.result2 && data.result2.length && data.result2.length > 0) {
    //         this.temp_DetailList = [];
    //         // this.DetailList = [];
    //         this.BudgetObj.COSTCENTER_CATEGORYID = data.result2[0].COSTCENTER_CATEGORYID;
    //         this.BudgetObj.COSTCENTER_CATEGORYNAME = data.result2[0].COSTCENTER_CATEGORYNAME;
    //         this.BudgetObj.CCID = data.result2[0].CCID;
    //         this.BudgetObj.COSTCENTER_NAME = data.result2[0].COSTCENTER_NAME;
    //         this.temp_DetailList = data.result2;
    //         // this.CalculateSum();
    //       }
    //     }
    //   }, error => {

    //   }
    //   )
  }

  overViewSelect(event:any){
    if(event.target.value==0){
        this.ReportOptionAll=true;
    }
   
   

  }
  ActualVSbudgetSelect(event:any){
    if(event.target.value==1){
        this.ReportOptionAll=false;
    }

  }




}