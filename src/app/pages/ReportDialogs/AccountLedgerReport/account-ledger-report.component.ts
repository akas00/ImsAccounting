import { Component, Inject, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { PLedgerComponent } from '../../masters/components/PLedger/PLedger.component';
import { Subscriber } from 'rxjs/Subscriber';
import { AlertService } from '../../../common/services/alert/alert.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import * as moment from 'moment';


@Component({
    selector: 'account-ledger-report',
    templateUrl: './account-ledger-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']

})
export class AccountLedgerReport implements OnInit{
    showCCtable: boolean;
    showAreaTable: boolean;
    showLedgerTable: boolean;
    showCombineLedgerList: boolean;
    showMergeCombineLedger: boolean;
    showMultipleCC: boolean;
    result: any;
    reportNameFormatWise:string;
    acname:string ='';
    accode:string = '';
    userProfile: any;
    account:any[]=[];
    division: any[] = [];
    CostcenterList: any[] = [];
    AccLedger_result:boolean;
    REPORTDISPLAYNAME:string;
    showAccGrpTable: boolean;


    @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridAccountLedger") genericGridAccountLedger: GenericPopUpComponent;
    gridPopupSettingsForAccountLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridMultipleAccountLedger") genericGridMultipleAccountLedger: GenericPopUpComponent;
    gridPopupSettingsForMultipleAccountLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridMultipleGroupAccount") genericGridMultipleGroupAccount: GenericPopUpComponent;
    gridPopupSettingsForMultipleGroupAccountList: GenericPopUpSettings = new GenericPopUpSettings();

    instanceWiseRepName:string='Account Ledger Report';

    constructor(
        public masterService: MasterRepo,
        private _authService: AuthService,
        private alertService: AlertService,
        private _reportFilterService: ReportMainService,
        private arouter: Router,
        public _ActivatedRoute: ActivatedRoute,
         public reportService: ReportFilterService,
    ) {
        this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC=true;
        // this._reportFilterService.AccoutLedgerObj.AccLedger_HIDENARATION=true;

        this._reportFilterService.showAllcontactsInCC = true;
        this._reportFilterService.AccoutLedgerObj.Reportnameis = 'accountledger';
        this._reportFilterService.AccoutLedgerObj.Reportnameis =  'accountledger';
        this.userProfile = this._authService.getUserProfile();
        this.reportNameFormatWise = 'Account Ledger Report';
        this.masterService.getAccountListACIDNotLikePA().subscribe(res => {
            this.account=res.data;
            if(this.account.length!=0){
                this.AccLedger_result=true;
            }else{
                this.AccLedger_result=false;
            }
        })

        this.division = [];
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
        this.showMultipleCC = true;
        this.getReportTitle();
        this.checkValueForCombine();
        // this.masterService.getAccDivList();

    }

    ngOnInit(){
        this._ActivatedRoute.queryParams.subscribe(params => {
            const mode = params.mode;
            // ////console.log("@@accledger",this.reportService.drillParam)
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname.startsWith('Account Ledger Report')) {
            this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1=moment(this.reportService.drillParam.reportparam.DATE1).format('YYYY-MM-DD');
            this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2=moment(this.reportService.drillParam.reportparam.DATE2).format('YYYY-MM-DD');
            this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE1=this.reportService.drillParam.reportparam.BSDATE1;
            this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE2=this.reportService.drillParam.reportparam.BSDATE2;
            this._reportFilterService.AccoutLedgerObj.AccLedger_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter=this.reportService.drillParam.reportparam.COSTCENTER;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType =2;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME=this.reportService.drillParam.reportparam.CUSTOMERNAME?this.reportService.drillParam.reportparam.CUSTOMERNAME.trim():this.reportService.drillParam.reportparam.CUSTOMERNAME;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACID=this.reportService.drillParam.reportparam.ACID;
            this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount=this.reportService.drillParam.reportparam.ACID;

            this.showLedgerTable = true;
            this._reportFilterService.AccoutLedgerObj.EnableCombineLedger = false;
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts = [];
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter = [];
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts= [];
            // this.changeEntryDate(this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE1, "AD");
            // this.changeEndDate(this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE2, "AD");
            if(this.reportService.drillParam.reportname == 'Account Ledger Report_2'){
                this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT='1';
            }else{
                this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT='0';
            }

            if(this.masterService.userSetting.DISPLAY == 1){
                this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC=true;
            }else{
                this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC=false;
            }

            }else{
                if(this._reportFilterService.AccoutLedgerObj.assignPrevioiusDate != true){
                    this.masterService.getAccDivList();
                    this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
                    //console.log("@@this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1",this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1)
                    this.changeEntryDate(this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1, "AD");
                    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                        this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2 = new Date().toJSON().split('T')[0];
                        this.changeEndDate(this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2, "AD");
                      }
                      else {
                        this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2, "AD");
                    }
                    // this._reportFilterService.AccoutLedgerObj.AccLedger_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    this.masterService.viewDivision.subscribe(() => {
                        if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                          this._reportFilterService.AccoutLedgerObj.AccLedger_DIV='%';
                      }else{
                        if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                            this._reportFilterService.AccoutLedgerObj.AccLedger_DIV=this.division[0].INITIAL;
                          }else{
                            this._reportFilterService.AccoutLedgerObj.AccLedger_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                        }
                      }
                      })
                    this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter ='%';
                    this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType =2;
                    this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter = [];
                    this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts = [];
                    this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts=[];
                    this._reportFilterService.AccoutLedgerObj.AccLedger_HIDECOSTCENTER = 0;
                    if(this.masterService.userSetting.DISPLAY == 1){
                        this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT='0';
                        this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC=true;
                    }else{
                        this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT='0';
                    }
                    // this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC= 1;
                    this.checkValue();
                    if(this._reportFilterService.AccoutLedgerObj.EnableCombineLedger == true){
                        this.checkValue();
                    } else{
                        this.checkValueForCombine();
                    }
                  
                    }
                    if(params.instancename){
                        ////console.log("@@[Account Ledger Report0]",this._reportFilterService.reportDataStore[params.instancename])
                        this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                        this.changeEntryDate(this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1, "AD");
                        this.changeEndDate(this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2, "AD");
                        this._reportFilterService.AccoutLedgerObj.AccLedger_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTTYPE;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACNAME;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_ACID=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_Areawise=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.AREA;
                        this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.IGNOREOPPOSITAC;
                        this._reportFilterService.AccoutLedgerObj.MERGEREPORT=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.MERGEREPORT;
                        // this._reportFilterService.AccoutLedgerObj.SHOWNARATION=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWNARATION;
                        // this._reportFilterService.AccoutLedgerObj.SHOWNDATE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWNDATE;
                        this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SUMMARYLEDGER; 
                        this._reportFilterService.AccoutLedgerObj.AccLedger_HIDENARATION = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.HIDENARATION; 
                        this._reportFilterService.AccoutLedgerObj.AccLedger_HIDEVOUCHERTYPE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.HIDEVOUCHERTYPE; 
                        this._reportFilterService.AccoutLedgerObj.AccLedger_SHOWITEMDETAIL =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWITEMDETAIL; 
                        this._reportFilterService.AccoutLedgerObj.AccLedger_INCLUDEPOSTDATE =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.INCLUDEPOSTEDTRANSACTION ; 
                        this._reportFilterService.AccoutLedgerObj.AccLedger_HIDECOSTCENTER = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.HIDECOSTCENTER ; 
                    }

            }
          
        });





}
    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        ////console.log("valuess",value)
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        // ////console.log("singleAccount",this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount,this._reportFilterService.AccoutLedgerObj.DATE2)
        // this.SelectedDivReport = this._reportFilterService.AccoutLedgerObj.AccLedger_DIV;

        if (this._reportFilterService.AccoutLedgerObj.EnableCombineLedger==true && this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 2 && (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts === undefined || this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts.length == 0)) {
            this.alertService.info("Please Select Account");
            return;
        } else if ((this._reportFilterService.AccoutLedgerObj.EnableCombineLedger==true && this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 4 && (this._reportFilterService.AccoutLedgerObj.AccLedger_showAllContacts == false || this._reportFilterService.AccoutLedgerObj.AccLedger_showAllContacts===undefined)) && (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter === undefined || this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter.length == 0)) {
            this.alertService.info("Please Select Costcenter");
            return;
        } else if ((this._reportFilterService.AccoutLedgerObj.EnableCombineLedger==true &&
            this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 4
            || this._reportFilterService.AccoutLedgerObj.AccLedger_showAllContacts) &&
            (this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount === undefined ||
                this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount == '')) {
            this.alertService.info("Please Select Account");
            return;
        } else if (this.AccLedger_result == true && (this._reportFilterService.AccoutLedgerObj.EnableCombineLedger === undefined || this._reportFilterService.AccoutLedgerObj.EnableCombineLedger == false)) {
            if (this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount === undefined || this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount == '' || this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME == '') {
                this.alertService.info("Please Select Account");
                return;
            }
            this.DialogClosedResult("ok");
        }
        else {
            this.DialogClosedResult("ok");
        }
    }

    getReportTitle(){
        this.masterService.getReportTitle(this.reportNameFormatWise).subscribe(
            (res)=>{
                ////console.log("newres",res);
                if(res.status == 'ok'){
                    this.reportNameFormatWise = res.result;
                    ////console.log("reportName",this.reportNameFormatWise);
                }
            }
        )
    }

    public DialogClosedResult(res) {

        let multipleSelectedCC = [];
        let SelectedCC = '';
        if (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter === undefined) {
            SelectedCC = this._reportFilterService.AccoutLedgerObj.CCENTER;
        } else {
            if (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter.length != 0) {
                this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter.forEach(COSTCENTER => {
                    multipleSelectedCC.push(COSTCENTER.CCID)
                    SelectedCC += `${multipleSelectedCC},`
                });
            } else {
                SelectedCC = this._reportFilterService.AccoutLedgerObj.CCENTER
            }
        }

        let multipleSelectedAccount = [];
        //let SelectedAccount = '';
        if (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts === undefined) {
          this._reportFilterService.SelectedAccount = this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount
        } else {
            if (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts.length != 0) {
                this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts.forEach(acList => {
                    this._reportFilterService.SelectedAccount=''
                    multipleSelectedAccount.push(acList.ACID)
                this._reportFilterService.SelectedAccount += `${multipleSelectedAccount},`
                });
                var nameArr = this._reportFilterService.SelectedAccount.split(',');
                var myArr = nameArr;
                let item = myArr.filter((el, i, a) => i === a.indexOf(el))
                // ////console.log("@@item",item)
                this._reportFilterService.SelectedAccount= item.toString();
                // ////console.log("@@this._reportFilterService.SelectedAccount",this._reportFilterService.SelectedAccount)

            } else {
                this._reportFilterService.SelectedAccount = this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount
            }
        }

        if (this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType != 4) {
            SelectedCC = this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter
        }

        let multipleSelectedGroupACC = [];
        // let SelectedGroupACC = '';
        if (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts === undefined ||this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts === null) {
            this._reportFilterService.SelectedGroupAccount = '%';
        } else {
            if (this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts.length != 0) {
                this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts.forEach(acList => {
                    this._reportFilterService.SelectedGroupAccount =''
                    multipleSelectedGroupACC.push(acList.ACID)
                    this._reportFilterService.SelectedGroupAccount += `${multipleSelectedGroupACC},`
                });
                var nameArr = this._reportFilterService.SelectedGroupAccount.split(',');
                var myArr = nameArr;
                let item = myArr.filter((el, i, a) => i === a.indexOf(el))
                // ////console.log("@@item",item)
                this._reportFilterService.SelectedGroupAccount= item.toString();
            } else {
                this._reportFilterService.SelectedGroupAccount = '%';
            }
        }

        if (this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC == true) {
            this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC = 1;
            this.reportNameFormatWise = 'Account Ledger Report_1';
        } else {
            this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC = 0;
            this.reportNameFormatWise = 'Account Ledger Report';
        }

        if(this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT ==1){
            this.reportNameFormatWise = 'Account Ledger Report_2';
        }

        if (this._reportFilterService.AccoutLedgerObj.SHOWNDATE == true) {
            this._reportFilterService.AccoutLedgerObj.SHOWNDATE = 1;
        } else {
            this._reportFilterService.AccoutLedgerObj.SHOWNDATE = 0;
        }

        if (this._reportFilterService.AccoutLedgerObj.MERGEREPORT == true) {
            this._reportFilterService.AccoutLedgerObj.MERGEREPORT = 1;
        } else {
            this._reportFilterService.AccoutLedgerObj.MERGEREPORT = 0;
        }
        if (this._reportFilterService.AccoutLedgerObj.SHOWNARATION == true) {
            this._reportFilterService.AccoutLedgerObj.SHOWNARATION = 1;
        } else {
            this._reportFilterService.AccoutLedgerObj.SHOWNARATION = 0;
        }


        if (this._reportFilterService.AccoutLedgerObj.AccLedger_showAllContacts == true) {
            this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType = 3;
            SelectedCC = '%';
        }

        if(this._reportFilterService.AccoutLedgerObj.EnableCombineLedger !=true){
            this._reportFilterService.selectedAccountParty = this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount;
            SelectedCC = this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType = 0;
        }

        if(this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType != 2){
            this._reportFilterService.selectedAccountParty = this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount;
        }

        if (this._reportFilterService.AccoutLedgerObj.AccLedger_DIV && this._reportFilterService.AccoutLedgerObj.AccLedger_DIV == '%') {
            this._reportFilterService.AccoutLedgerObj.AccLedger_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.AccoutLedgerObj.AccLedger_DIV && this._reportFilterService.AccoutLedgerObj.AccLedger_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.AccoutLedgerObj.AccLedger_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.AccoutLedgerObj.AccLedger_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.AccoutLedgerObj.AccLedger_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.AccoutLedgerObj.AccLedger_DIVISIONNAME = '';
          }

          if (this._reportFilterService.AccoutLedgerObj.EnableCombineLedger != true) {
          this.REPORTDISPLAYNAME = 'Account Ledger';
          this._reportFilterService.AccoutLedgerObj.AccLedger_LABELDISPLAYNAME = 'Ledger';
          this._reportFilterService.AccoutLedgerObj.AccLedger_LEDGERDISPLAYNAME = this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME;
          
          if (this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter && this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter == '%') {
            this._reportFilterService.AccoutLedgerObj.AccLedger_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.AccoutLedgerObj.AccLedger_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.AccoutLedgerObj.AccLedger_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.AccoutLedgerObj.AccLedger_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.AccoutLedgerObj.AccLedger_COSTCENTERDISPLAYNAME = '';
          }
        }

        if (this._reportFilterService.AccoutLedgerObj.EnableCombineLedger == true) {
            this.REPORTDISPLAYNAME = 'Account Ledger';
            this._reportFilterService.AccoutLedgerObj.AccLedger_LABELDISPLAYNAME = 'Ledger';
            this._reportFilterService.AccoutLedgerObj.AccLedger_LEDGERDISPLAYNAME = 'Combine Ledger Selection';
    }

        if(res == "ok"){
            this._reportFilterService.AccoutLedgerObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

            if(this._reportFilterService.AccLedger_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Account Ledger Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName: this.instanceWiseRepName+this._reportFilterService.AccLedger_loadedTimes,
            })
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Account Ledger Report'+'_'+this._reportFilterService.AccLedger_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName: this.instanceWiseRepName+this._reportFilterService.AccLedger_loadedTimes,
            })
            }

    }



        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Account Ledger',
                reportname: this.reportNameFormatWise,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.AccLedger_loadedTimes,
                reportparam: {
                    LABELDISPLAYNAME : this._reportFilterService.AccoutLedgerObj.AccLedger_LABELDISPLAYNAME?this._reportFilterService.AccoutLedgerObj.AccLedger_LABELDISPLAYNAME:'',
                    LEDGERDISPLAYNAME : this._reportFilterService.AccoutLedgerObj.AccLedger_LEDGERDISPLAYNAME?this._reportFilterService.AccoutLedgerObj.AccLedger_LEDGERDISPLAYNAME:'',
                    DATE1: this._reportFilterService.AccoutLedgerObj.AccLedger_DATE1,
                    DATE2: this._reportFilterService.AccoutLedgerObj.AccLedger_DATE2,
                    BSDATE1: this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE1,
                    BSDATE2: this._reportFilterService.AccoutLedgerObj.AccLedger_BSDATE2,
                    DIV: this._reportFilterService.AccoutLedgerObj.AccLedger_DIV ? this._reportFilterService.AccoutLedgerObj.AccLedger_DIV : '%',
                    COSTCENTER: SelectedCC ? SelectedCC : '%',
                    AREA: this._reportFilterService.AccoutLedgerObj.AccLedger_Areawise ? this._reportFilterService.AccoutLedgerObj.AccLedger_Areawise : 0,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    REPORTTYPE: this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType ? this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType : 0,
                    IGNOREOPPOSITAC: this._reportFilterService.AccoutLedgerObj.IGNOREOPPOSITAC,
                    // SHOWNDATE: this._reportFilterService.AccoutLedgerObj.SHOWNDATE,
                    ACID: this._reportFilterService.SelectedAccount ? this._reportFilterService.SelectedAccount : '%',
                    MERGEREPORT: this._reportFilterService.AccoutLedgerObj.MERGEREPORT,
                    // SHOWNARATION: this._reportFilterService.AccoutLedgerObj.SHOWNARATION,
                    ACNAME : this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    // REPORTDISPLAYNAME : this.REPORTDISPLAYNAME ? this.REPORTDISPLAYNAME : this.reportNameFormatWise,
                    DIVISIONNAME : this._reportFilterService.AccoutLedgerObj.AccLedger_DIVISIONNAME ? this._reportFilterService.AccoutLedgerObj.AccLedger_DIVISIONNAME : '',
                    SUMMARYLEDGER: this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT ? this._reportFilterService.AccoutLedgerObj.AccLedger_SUMMARYREPORT:0,
                    COSTCENTERDISPLAYNAME: this._reportFilterService.AccoutLedgerObj.AccLedger_COSTCENTERDISPLAYNAME?this._reportFilterService.AccoutLedgerObj.AccLedger_COSTCENTERDISPLAYNAME:'',
                    HIDENARATION: this._reportFilterService.AccoutLedgerObj.AccLedger_HIDENARATION ? this._reportFilterService.AccoutLedgerObj.AccLedger_HIDENARATION:0,
                    HIDEVOUCHERTYPE: this._reportFilterService.AccoutLedgerObj.AccLedger_HIDEVOUCHERTYPE ?  this._reportFilterService.AccoutLedgerObj.AccLedger_HIDEVOUCHERTYPE:0,
                    SHOWITEMDETAIL:this._reportFilterService.AccoutLedgerObj.AccLedger_SHOWITEMDETAIL ? this._reportFilterService.AccoutLedgerObj.AccLedger_SHOWITEMDETAIL:0,
                    INCLUDEPOSTEDTRANSACTION :this._reportFilterService.AccoutLedgerObj.AccLedger_INCLUDEPOSTDATE ? this._reportFilterService.AccoutLedgerObj.AccLedger_INCLUDEPOSTDATE:0,
                    HIDECOSTCENTER: this._reportFilterService.AccoutLedgerObj.AccLedger_HIDECOSTCENTER ? this._reportFilterService.AccoutLedgerObj.AccLedger_HIDECOSTCENTER:0,
                    GROUP_ACID :this._reportFilterService.SelectedGroupAccount ? this._reportFilterService.SelectedGroupAccount :'%',
                    
                }
            }
        });
        if(res == "ok"){
            this._reportFilterService.AccLedger_loadedTimes = this._reportFilterService.AccLedger_loadedTimes+1;
        }

    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("cancel");
    }

    checkValue() {


        if (this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 2) {
            this.showLedgerTable = true;

            this.acname = this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = '';
            this.accode = this._reportFilterService.AccoutLedgerObj.AccLedger_ACID;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACID = '';
            this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount = '';
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter = [];
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts=[];
        } else {
            this.showLedgerTable = false;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = this.acname;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACID = this.accode;
            this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount = this.accode;
        }
        if (this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 1) {
            this.showAreaTable = true;
        } else {
            this.showAreaTable = false;
        }
        if (this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 4) {
            this.showCCtable = true;
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts = [];
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts=[];
        } else {
            this.showCCtable = false;
        }
        if(this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 5){
            this.showAccGrpTable = true;
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts = [];
        }else{
            this.showAccGrpTable = false;
        }

    }

    checkValueForCombine() {
        if (this._reportFilterService.AccoutLedgerObj.EnableCombineLedger == true) {
            this.showCombineLedgerList = true;
            this.showMergeCombineLedger = true;
            this.acname = this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = '';
            this.accode = this._reportFilterService.AccoutLedgerObj.AccLedger_ACID;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACID = '';
            this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount = '';
            if(this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 2){
                this.showLedgerTable = true;
            }else if (this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 4){
                this.showCCtable = true;
            }else if (this._reportFilterService.AccoutLedgerObj.AccLedger_ReportType == 5){
                this.showAccGrpTable = true;
            }
        } else {
            this.showCombineLedgerList = false;
            this.showMergeCombineLedger = false;
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts = [];
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter = [];
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts=[];
            this.showLedgerTable = false;
            this.showCCtable = false;
            this.showAccGrpTable = false;
        }
    }

    dropListItem = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
                this.masterService.getAccountListACIDNotLikePA().map(data => {
                    this.result = data.result;
                    return this.result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                }
                ).subscribe(res => { observer.next(res); })
        }).share();
    }

    accodeChanged(value: string) {
        var item;
        item = this.masterService.accountList.find(x => x.ACCODE == value);
        this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = '';
        if (item) {
            value = item.ACNAME;
            //console.log(value + "****");
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = value;
        }
    }

    onEnterAcnameChange(value) {
        this.accodeChanged(value);
    }

    itemChanged(value: any) {
        //console.log({ itemChangedValue: value });
        if (typeof (value) === "object") {
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = value.ACNAME;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACCODE = value.ACCODE;
            this._reportFilterService.AccoutLedgerObj.AccLedger_ACID = value.ACID;
            this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount = value.ACID;
        }
    }


    AccountEnterClicked() {
        this.gridPopupSettingsForAccountLedgerList = this.masterService.getGenericGridPopUpSettings('AccountLedgerListForReport');
        this.genericGridAccountLedger.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.AccoutLedgerObj.AccLedger_ACID = account.ACID;
        this._reportFilterService.AccoutLedgerObj.AccLedger_ACCNAME = account.ACNAME;
        this._reportFilterService.AccoutLedgerObj.AccLedger_SingleAccount = account.ACID;
    }

    checkCostCenterValue() {
        if (this._reportFilterService.AccoutLedgerObj.AccLedger_showAllContacts == true) {
            this.showMultipleCC = false;
        } else {
            this.showMultipleCC = true;
        }
    }

    addCostcenterToList() {
        const ccData = this._reportFilterService.AccoutLedgerObj.CCENTER;
        this._reportFilterService.AccoutLedgerObj.CCENTER = ccData && ccData.CCID ? ccData.CCID : '';
        let selectCCenterList = this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter.filter(centerList => centerList.COSTCENTERNAME == ccData.COSTCENTERNAME)
        if (
            ccData.COSTCENTERNAME === "" ||
            ccData.COSTCENTERNAME === null ||
            ccData.COSTCENTERNAME === undefined
        ) {
            return;
        }

        if (selectCCenterList.length === 0) {
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter.push({ CCID: ccData.CCID, COSTCENTERNAME: ccData.COSTCENTERNAME })
        }

    }

    deleteCostcenter(index) {
        this._reportFilterService.AccoutLedgerObj.AccLedger_multipleCostcenter.splice(index, 1)
    }

    addAccountToList() {
        let selectACList = this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts.filter(acList => acList.ACNAME == this._reportFilterService.AccoutLedgerObj.multipleACNAME)
        if (
            this._reportFilterService.AccoutLedgerObj.multipleACNAME === "" ||
            this._reportFilterService.AccoutLedgerObj.multipleACNAME === null ||
            this._reportFilterService.AccoutLedgerObj.multipleACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts.push({ ACID: this._reportFilterService.AccoutLedgerObj.multipleACID, ACNAME: this._reportFilterService.AccoutLedgerObj.multipleACNAME })
                this._reportFilterService.AccoutLedgerObj.multipleACNAME='';
                this._reportFilterService.AccoutLedgerObj.multipleACCODE='';
        }
    }

    deleteAccount(index) {
        this._reportFilterService.AccoutLedgerObj.AccLedger_multipleAccounts.splice(index, 1)
    }


    MultipleAccountEnterClicked() {
        this.gridPopupSettingsForMultipleAccountLedgerList = this.masterService.getGenericGridPopUpSettings('AccountLedgerListForReport');
        this.genericGridMultipleAccountLedger.show();
    }

    dblClickMultipleAccountSelect(account) {
        this._reportFilterService.AccoutLedgerObj.multipleACID = account.ACID;
        this._reportFilterService.AccoutLedgerObj.multipleACNAME = account.ACNAME;
    }

    addGroupAccountToList(){
        let selectACList = this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts.filter(acList => acList.ACNAME == this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME)
        if (
            this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME === "" ||
            this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME === null ||
            this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts.push({ ACID: this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACID, ACNAME: this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME })
            console.log(" this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts", this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts)
                this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME='';
                this._reportFilterService.AccoutLedgerObj.multiple_Group_ACCODE='';
        }
    }

    GroupAccountclick(){
            
            this.gridPopupSettingsForMultipleGroupAccountList = this.masterService.getGenericGridPopUpSettings('AccountGroupList');
            this.genericGridMultipleGroupAccount.show();
    }

    dblClickGroupAccountSelect(account) {
        this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACID = account.ACID;
        this._reportFilterService.AccoutLedgerObj.Multiple_GROUP_ACNAME = account.ACNAME;
    }

    deleteGroupAccount(index) {
        this._reportFilterService.AccoutLedgerObj.AccLedger_multipleGroupAccounts.splice(index, 1);
        this._reportFilterService.SelectedGroupAccount='';
    }

}
