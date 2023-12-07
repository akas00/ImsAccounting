import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { PLedgerComponent } from '../../masters/components/PLedger/PLedger.component';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { AlertService } from '../../../common/services/alert/alert.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import * as moment from 'moment';

@Component({
    selector: 'party-ledger-report',
    templateUrl: './party-ledger-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class PartyLedgerReport {
    showCCtable: boolean;
    showAreaTable: boolean;
    showLedgerTable: boolean;
    showCombineLedgerList: boolean;
    showMergeCombineLedger: boolean;
    reportNameFormatWise:string;
    acname:string ='';
    accode:string = '';
    userProfile: any;
    account:any[]=[];
    result: any;
    division: any[] = [];
    CostcenterList: any[] = [];
    PartyLedger_result: boolean;
    showMultipleCC: boolean;
    AreaList: any[] = [];
    instanceWiseRepName:string='Party Ledger Report';
    REPORTDISPLAYNAME:string;
    showAccGrpTable:boolean;

    @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridPartyLedger") genericGridPartyLedger: GenericPopUpComponent;
    gridPopupSettingsForPartyLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridMultiplePartyLedger") genericGridMultiplePartyLedger: GenericPopUpComponent;
    gridPopupSettingsForMultiplePartyLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridMultipleGroupAccount") genericGridMultipleGroupAccount: GenericPopUpComponent;
    gridPopupSettingsForMultipleGroupAccountList: GenericPopUpSettings = new GenericPopUpSettings();
    
    constructor(public masterService: MasterRepo,
        private alertService: AlertService,
        private _reportFilterService: ReportMainService,
        private _authService: AuthService, private arouter: Router,public _ActivatedRoute: ActivatedRoute,
        public reportService: ReportFilterService,
        ) {

            this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC=true;
            // this._reportFilterService.PartyLedgerObj.PartyLedger_HIDENARATION=true;

        this._reportFilterService.showAllcontactsInCC = true;
        this._reportFilterService.PartyLedgerObj.Reportnameis = 'partyledger';
        this.reportNameFormatWise = 'Party Ledger Report';
        this.userProfile = this._authService.getUserProfile();
        
        this.masterService.getAccountListACIDLikePA().subscribe(res => {
            this.account=res.data;
            if(this.account.length!=0){
                this.PartyLedger_result=true;
            }else{
                this.PartyLedger_result=false;
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

            this.masterService.getAreaList().subscribe(res => {
                this.AreaList = res.result;
            })

        this.showMultipleCC = true;
        this.checkValueForCombine();
        // this.masterService.getAccDivList();
       
    }


  

    ngOnInit(){
        this._ActivatedRoute.queryParams.subscribe(params => {
            const mode = params.mode;
            // ////console.log("@@this.reportMasterService.drillParam.returnUrl",params.mode,this.reportService.drillParam.returnUrl);
            // ////console.log("@@partyled",this.reportService.drillParam)
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname.startsWith('Party Ledger Report')) {
            this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1=moment(this.reportService.drillParam.reportparam.DATE1).format('YYYY-MM-DD');
            this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2=moment(this.reportService.drillParam.reportparam.DATE2).format('YYYY-MM-DD');
            this._reportFilterService.PartyLedgerObj.PartyLedger_BSDATE1=this.reportService.drillParam.reportparam.BSDATE1;
            this._reportFilterService.PartyLedgerObj.PartyLedger_BSDATE2=this.reportService.drillParam.reportparam.BSDATE2;
            this._reportFilterService.PartyLedgerObj.PartyLedger_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter=this.reportService.drillParam.reportparam.COSTCENTER;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType =2;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME=this.reportService.drillParam.reportparam.CUSTOMERNAME;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACID=this.reportService.drillParam.reportparam.ACID;
            this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount=this.reportService.drillParam.reportparam.ACID;

            this.showLedgerTable = true;
            this._reportFilterService.PartyLedgerObj.EnableCombineLedger = false;
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = 0;

            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts=[];
            // this.changeEntryDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1, "AD");
            // this.changeEndDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2, "AD");
            if(this.reportService.drillParam.reportname == 'Party Ledger Report_2'){
                this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT='1';
            }else{
                this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT='0';
            }

            if(this.masterService.userSetting.DISPLAY == 1){
                this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC=true;
            }else{
                this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC=false;
            }
            }
        else{
            if(this._reportFilterService.PartyLedgerObj.assignPrevioiusDate != true){
                this.masterService.getAccDivList();
                this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
                //console.log("@@01BeginDate",this.masterService.PhiscalObj.BeginDate)
                if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2, "AD");
                  }
                  else {
                    //console.log("@@02EndDate",this.masterService.PhiscalObj.EndDate)
                        this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2, "AD");  
          
                    
                }
                // this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2 = new Date().toJSON().split('T')[0];
                this.masterService.viewDivision.subscribe(() => {
                      if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                        this._reportFilterService.PartyLedgerObj.PartyLedger_DIV='%';
                    }else{
                        if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                            this._reportFilterService.PartyLedgerObj.PartyLedger_DIV=this.division[0].INITIAL;
                          }else{
                            this._reportFilterService.PartyLedgerObj.PartyLedger_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                        }
                    }
                    })              
                this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter ='%'
                this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType =2;
                // this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC =1;
                if(this.masterService.userSetting.DISPLAY == 1){
                    this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT ='0';
                    this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC = true;
                }else{
                    this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT ='0';
                }
                this.checkValue();
                this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = 0;
                if(this._reportFilterService.PartyLedgerObj.EnableCombineLedger == true){
                    this.checkValue();
                } else{
                    this.checkValueForCombine();
                } 
                this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts = [];
                this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter = [];
                this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts=[];
                this.changeEntryDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1, "AD");
                this.changeEndDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2, "AD"); 
                this._reportFilterService.PartyLedgerObj.PartyLedger_HIDECOSTCENTER = 0;
            }
    
            

            if(params.instancename){
                // ////console.log("@@[Party Ledger Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this.changeEntryDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1, "AD");
                this.changeEndDate(this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2, "AD");  
                this._reportFilterService.PartyLedgerObj.PartyLedger_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.PartyLedgerObj.CCENTER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTTYPE;
                this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACNAME;
                this._reportFilterService.PartyLedgerObj.PartyLedger_ACID=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.AREA;   
                this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.IGNOREOPPOSITAC;
                this._reportFilterService.PartyLedgerObj.MERGEREPORT=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.MERGEREPORT;
                this._reportFilterService.PartyLedgerObj.SHOWNARATION=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWNARATION;
                this._reportFilterService.PartyLedgerObj.SHOWNDATE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWNDATE;
                this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SUMMARYLEDGER;
                this._reportFilterService.PartyLedgerObj.PartyLedger_HIDENARATION = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.HIDENARATION; 
                this._reportFilterService.PartyLedgerObj.PartyLedger_HIDEVOUCHERTYPE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.HIDEVOUCHERTYPE; 
                this._reportFilterService.PartyLedgerObj.PartyLedger_SHOWITEMDETAIL =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWITEMDETAIL; 
                this._reportFilterService.PartyLedgerObj.PartyLedger_INCLUDEPOSTDATE =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.INCLUDEPOSTEDTRANSACTION ; 
                this._reportFilterService.PartyLedgerObj.PartyLedger_HIDECOSTCENTER =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.HIDECOSTCENTER ; 
            }
        } 

    });
    }
    ngAfterViewInit(){
        var a = this.masterService.AccListDiv.forEach(x=>x.isSelected == 1);
        
        
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.PartyLedgerObj.PartyLedger_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
              }else{
                  this.alertService.error("Cannot Change the date");
                return;
              }
            // this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.PartyLedgerObj.PartyLedger_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
              }else{
                  this.alertService.error("Cannot Change the date");
                return;
              }

            // this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        if (this._reportFilterService.PartyLedgerObj.EnableCombineLedger==true && this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 2 && (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts === undefined || this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts.length == 0)) {
            this.alertService.info("Please Select Account");
            return;
        } else if (this._reportFilterService.PartyLedgerObj.EnableCombineLedger==true && this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 1 && this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise === undefined) {
            this.alertService.info("Please Select Area");
            return;
        } else if ((this._reportFilterService.PartyLedgerObj.EnableCombineLedger==true && this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 4 && (this._reportFilterService.PartyLedgerObj.PartyLedger_showAllContacts == false || this._reportFilterService.PartyLedgerObj.PartyLedger_showAllContacts===undefined)) && (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter === undefined || this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter.length == 0)) {
            this.alertService.info("Please Select Costcenter");
            return;
        } else if ((this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 1 || this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 4 || this._reportFilterService.PartyLedgerObj.PartyLedger_showAllContacts) && (this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount === undefined || this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount == '' || this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME == '')) {
            this.alertService.info("Please Select Account");
            return;
        }else if (this.PartyLedger_result == true && ( this._reportFilterService.PartyLedgerObj.EnableCombineLedger === undefined ||this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType ==0)) {
            if (this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount === undefined || this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount=='' || this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME == '') {
                this.alertService.info("Please Select Account");
                return;
            }
            this.DialogClosedResult("ok");
        }
        else {
            this.DialogClosedResult("ok");
        }

    }

    public DialogClosedResult(res) {

        let multipleSelectedCC = [];
        let SelectedCC = '';
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter === undefined) {
            SelectedCC = this._reportFilterService.PartyLedgerObj.CCENTER;
        } else {
            if (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter.length != 0) {
                this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter.forEach(COSTCENTER => {
                    multipleSelectedCC.push(COSTCENTER.CCID)
                    SelectedCC += `${multipleSelectedCC},`
                });
            } else {
                SelectedCC = this._reportFilterService.PartyLedgerObj.CCENTER
            }
        }

        let multipleSelectedAccount = [];

        if (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts === undefined) {
            this._reportFilterService.selectedAccountParty = this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount
        } else {
            if (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts.length != 0) {
                this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts.forEach(acList => {
                    this._reportFilterService.selectedAccountParty=''
                    multipleSelectedAccount.push(acList.ACID)
                    this._reportFilterService.selectedAccountParty += `${multipleSelectedAccount},`
                });
                var nameArr = this._reportFilterService.selectedAccountParty.split(',');
                var myArr = nameArr;
                let item = myArr.filter((el, i, a) => i === a.indexOf(el))
                // ////console.log("@@item",item)
                this._reportFilterService.selectedAccountParty= item.toString();
                // ////console.log("@@this._reportFilterService.selectedAccountParty",this._reportFilterService.selectedAccountParty)
            } else {
                this._reportFilterService.selectedAccountParty = this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount
            }
        }

        let multipleSelectedGroupACC = [];
        // let SelectedGroupACC = '';
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts === undefined) {
            this._reportFilterService.selectedGroupAccountParty = '%';
        } else {
            if (this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts.length != 0) {
                this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts.forEach(acList => {
                    this._reportFilterService.selectedGroupAccountParty =''
                    multipleSelectedGroupACC.push(acList.ACID)
                    this._reportFilterService.selectedGroupAccountParty += `${multipleSelectedGroupACC},`
                });
                var nameArr = this._reportFilterService.selectedGroupAccountParty.split(',');
                var myArr = nameArr;
                let item = myArr.filter((el, i, a) => i === a.indexOf(el))
                // ////console.log("@@item",item)
                this._reportFilterService.selectedGroupAccountParty= item.toString();
            } else {
                this._reportFilterService.selectedGroupAccountParty = '%';
            }
        }

        if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType != 4) {
            SelectedCC = this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter
        }

        if (this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC == true) {
            this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC = 1;
            this.reportNameFormatWise = 'Party Ledger Report_1';
        } else {
            this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC = 0;
            this.reportNameFormatWise = 'Party Ledger Report';
        }

        if(this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT == 1){
            this.reportNameFormatWise = 'Party Ledger Report_2';
        }

        if (this._reportFilterService.PartyLedgerObj.SHOWNDATE == true) {
            this._reportFilterService.PartyLedgerObj.SHOWNDATE = 1;
        } else {
            this._reportFilterService.PartyLedgerObj.SHOWNDATE = 0;
        }

        if (this._reportFilterService.PartyLedgerObj.MERGEREPORT == true) {
            this._reportFilterService.PartyLedgerObj.MERGEREPORT = 1;
        } else {
            this._reportFilterService.PartyLedgerObj.MERGEREPORT = 0;
        }

        if (this._reportFilterService.PartyLedgerObj.PartyLedger_showAllContacts == true) {
            this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType = 3;
            SelectedCC = '%';
        }

        if(this._reportFilterService.PartyLedgerObj.EnableCombineLedger !=true){
            this._reportFilterService.selectedAccountParty = this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType = 0;
        }

        if(this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType != 2){
            this._reportFilterService.selectedAccountParty = this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount;
        }

        if(this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType != 1){
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = 0;
        }

        if (this._reportFilterService.PartyLedgerObj.PartyLedger_DIV && this._reportFilterService.PartyLedgerObj.PartyLedger_DIV == '%') {
            this._reportFilterService.PartyLedgerObj.PartyLedger_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.PartyLedgerObj.PartyLedger_DIV && this._reportFilterService.PartyLedgerObj.PartyLedger_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.PartyLedgerObj.PartyLedger_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.PartyLedgerObj.PartyLedger_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.PartyLedgerObj.PartyLedger_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.PartyLedgerObj.PartyLedger_DIVISIONNAME = '';
          }

          if (this._reportFilterService.PartyLedgerObj.EnableCombineLedger != true) {
          this.REPORTDISPLAYNAME = 'Party Ledger';
          this._reportFilterService.PartyLedgerObj.PartyLedger_LABELDISPLAYNAME = 'Ledger';
          this._reportFilterService.PartyLedgerObj.PartyLedger_LEDGERDISPLAYNAME = this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME;

          if (this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter && this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter == '%') {
            this._reportFilterService.PartyLedgerObj.PartyLedger_COSTCENTERDISPLAYNAME = 'All';
          }else if (this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.PartyLedgerObj.PartyLedger_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.PartyLedgerObj.PartyLedger_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.PartyLedgerObj.PartyLedger_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.PartyLedgerObj.PartyLedger_COSTCENTERDISPLAYNAME = '';
          }
        }

        if (this._reportFilterService.PartyLedgerObj.EnableCombineLedger == true) {
            this.REPORTDISPLAYNAME = 'Party Ledger';
            this._reportFilterService.PartyLedgerObj.PartyLedger_LABELDISPLAYNAME = 'Ledger';
            this._reportFilterService.PartyLedgerObj.PartyLedger_LEDGERDISPLAYNAME = 'Combine Ledger Selection';
    }

        if(res == "ok"){
        this._reportFilterService.PartyLedgerObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
                // ////console.log("@@activeurlpath2",activeurlpath2)
              } 

        if(this._reportFilterService.PartyLedger_loadedTimes == 0){
            this._reportFilterService.previouslyLoadedReportList.push(
                {reportname: 'Party Ledger Report',
                activeurlpath: this.arouter.url,
                activerurlpath2: activeurlpath2,
                instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.PartyLedger_loadedTimes,
            });
        }else{
            this._reportFilterService.previouslyLoadedReportList.push(
                {reportname: 'Party Ledger Report'+'_'+this._reportFilterService.PartyLedger_loadedTimes,
                activeurlpath: this.arouter.url,
                activerurlpath2: activeurlpath2,
                instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.PartyLedger_loadedTimes,
            });
        }
     
        }
        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Party Ledger',
                reportname: this.reportNameFormatWise,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.PartyLedger_loadedTimes, 
                reportparam: {
                    LABELDISPLAYNAME : this._reportFilterService.PartyLedgerObj.PartyLedger_LABELDISPLAYNAME?this._reportFilterService.PartyLedgerObj.PartyLedger_LABELDISPLAYNAME:'',
                    LEDGERDISPLAYNAME : this._reportFilterService.PartyLedgerObj.PartyLedger_LEDGERDISPLAYNAME?this._reportFilterService.PartyLedgerObj.PartyLedger_LEDGERDISPLAYNAME:'',
                    DATE1: this._reportFilterService.PartyLedgerObj.PartyLedger_DATE1,
                    DATE2: this._reportFilterService.PartyLedgerObj.PartyLedger_DATE2,
                    BSDATE1: this._reportFilterService.PartyLedgerObj.PartyLedger_BSDATE1,
                    BSDATE2: this._reportFilterService.PartyLedgerObj.PartyLedger_BSDATE2,
                    DIV: this._reportFilterService.PartyLedgerObj.PartyLedger_DIV ? this._reportFilterService.PartyLedgerObj.PartyLedger_DIV : '%',
                    COSTCENTER: SelectedCC ? SelectedCC : '%',
                    AREA: this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise ? this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise : 0,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    REPORTTYPE: this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType?this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType:0,
                    IGNOREOPPOSITAC: this._reportFilterService.PartyLedgerObj.IGNOREOPPOSITAC,
                    // SHOWNDATE: this._reportFilterService.PartyLedgerObj.SHOWNDATE,
                    ACID: this._reportFilterService.selectedAccountParty ? this._reportFilterService.selectedAccountParty : '%',
                    MERGEREPORT: this._reportFilterService.PartyLedgerObj.MERGEREPORT,
                    ACNAME : this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    ADDRESS : this._reportFilterService.PartyLedgerObj.PartyLedger_ADDRESS?this._reportFilterService.PartyLedgerObj.PartyLedger_ADDRESS:'',
                    VATNO : this._reportFilterService.PartyLedgerObj.PartyLedger_VATNO?this._reportFilterService.PartyLedgerObj.PartyLedger_VATNO:'',
                    PHONE : this._reportFilterService.PartyLedgerObj.PartyLedger_PHONE?this._reportFilterService.PartyLedgerObj.PartyLedger_PHONE:'',
                    EMAIL : this._reportFilterService.PartyLedgerObj.PartyLedger_EMAIL?this._reportFilterService.PartyLedgerObj.PartyLedger_EMAIL:'',
                    // REPORTDISPLAYNAME : this.REPORTDISPLAYNAME ? this.REPORTDISPLAYNAME : this.reportNameFormatWise,
                    DIVISIONNAME : this._reportFilterService.PartyLedgerObj.PartyLedger_DIVISIONNAME ? this._reportFilterService.PartyLedgerObj.PartyLedger_DIVISIONNAME : '',

                    COSTCENTERDISPLAYNAME: this._reportFilterService.PartyLedgerObj.PartyLedger_COSTCENTERDISPLAYNAME?this._reportFilterService.PartyLedgerObj.PartyLedger_COSTCENTERDISPLAYNAME:'',
                    SUMMARYLEDGER:this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT ? this._reportFilterService.PartyLedgerObj.PartyLedger_SUMMARYREPORT: 0,
                    HIDENARATION: this._reportFilterService.PartyLedgerObj.PartyLedger_HIDENARATION ? this._reportFilterService.PartyLedgerObj.PartyLedger_HIDENARATION:0,
                    HIDEVOUCHERTYPE:this._reportFilterService.PartyLedgerObj.PartyLedger_HIDEVOUCHERTYPE ? this._reportFilterService.PartyLedgerObj.PartyLedger_HIDEVOUCHERTYPE:0,
                    SHOWITEMDETAIL:this._reportFilterService.PartyLedgerObj.PartyLedger_SHOWITEMDETAIL? this._reportFilterService.PartyLedgerObj.PartyLedger_SHOWITEMDETAIL:0,
                    INCLUDEPOSTEDTRANSACTION :this._reportFilterService.PartyLedgerObj.PartyLedger_INCLUDEPOSTDATE ? this._reportFilterService.PartyLedgerObj.PartyLedger_INCLUDEPOSTDATE:0,
                    HIDECOSTCENTER:this._reportFilterService.PartyLedgerObj.PartyLedger_HIDECOSTCENTER ? this._reportFilterService.PartyLedgerObj.PartyLedger_HIDECOSTCENTER:0,
                    GROUP_ACID :this._reportFilterService.selectedGroupAccountParty ? this._reportFilterService.selectedGroupAccountParty :'%',

                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.PartyLedger_loadedTimes = this._reportFilterService.PartyLedger_loadedTimes+1;
        }
    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("cancel");
    }

    checkValue() {
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 2) {
            this.showLedgerTable = true;
            this.acname = this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME = '';
            this.accode = this._reportFilterService.PartyLedgerObj.PartyLedger_ACCODE;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACID = '';
            this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount = '';
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts=[];
        } else {
            this.showLedgerTable = false;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME = this.acname;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACID = this.accode;
            this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount = this.accode;
        }
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 1) {
            this.showAreaTable = true;
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts=[];
        } else {
            this.showAreaTable = false;
        }
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 4) {
            this.showCCtable = true;
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = 0;
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts=[];
        } else {
            this.showCCtable = false;
        }
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 5) {
            this.showAccGrpTable = true;
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = 0;
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts = [];
        } else {
            this.showAccGrpTable = false;
        }
        

    }

    checkValueForCombine(){
        if (this._reportFilterService.PartyLedgerObj.EnableCombineLedger == true) {
            this.showCombineLedgerList = true;
            this.acname = this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME = '';
            this.accode = this._reportFilterService.PartyLedgerObj.PartyLedger_ACCODE;
            this._reportFilterService.PartyLedgerObj.PartyLedger_ACID = '';
            this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount = '';
            this.showMergeCombineLedger = true;
            if(this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 2){
                this.showLedgerTable = true;
            }else if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 4){
                this.showCCtable = true;
            }else if(this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 1){
                this.showAreaTable = true;
            }else if (this._reportFilterService.PartyLedgerObj.PartyLedger_ReportType == 5){
                this.showAccGrpTable = true;
            }
        } else {
            this.showCombineLedgerList = false;
            this.showMergeCombineLedger = false;
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts = [];
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts=[];
            this._reportFilterService.PartyLedgerObj.PartyLedger_AreaWise = 0;
            this.showLedgerTable = false;
            this.showCCtable = false;
            this.showAreaTable = false;
            this.showAccGrpTable = false;
        }
    }

    AccountEnterClicked() {
        this.gridPopupSettingsForPartyLedgerList = this.masterService.getGenericGridPopUpSettings('PartyLedgerListForReport');
        this.genericGridPartyLedger.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.PartyLedgerObj.PartyLedger_ACID = account.ACID;
        this._reportFilterService.PartyLedgerObj.PartyLedger_ACCNAME = account.ACNAME;
        this._reportFilterService.PartyLedgerObj.PartyLedger_SingleAccount = account.ACID;
        this._reportFilterService.PartyLedgerObj.PartyLedger_ADDRESS = account.ADDRESS;
        this._reportFilterService.PartyLedgerObj.PartyLedger_VATNO = account.VATNO?account.VATNO:account.GSTNO;
        this._reportFilterService.PartyLedgerObj.PartyLedger_PHONE= account.PHONE;
        this._reportFilterService.PartyLedgerObj.PartyLedger_EMAIL = account.EMAIL;

    }

    addAccountToList() {
        let selectACList = this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts.filter(acList => acList.ACNAME == this._reportFilterService.PartyLedgerObj.multipleACNAME)
        if (
            this._reportFilterService.PartyLedgerObj.multipleACNAME === "" ||
            this._reportFilterService.PartyLedgerObj.multipleACNAME === null ||
            this._reportFilterService.PartyLedgerObj.multipleACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts.push({ ACID: this._reportFilterService.PartyLedgerObj.multipleACID, ACNAME: this._reportFilterService.PartyLedgerObj.multipleACNAME })
                this._reportFilterService.PartyLedgerObj.multipleACNAME='';
                this._reportFilterService.PartyLedgerObj.multipleACCODE='';
        }
    }

    deleteAccount(index) {
        this._reportFilterService.PartyLedgerObj.PartyLedger_multipleAccounts.splice(index, 1);
        this._reportFilterService.selectedAccountParty= '';
    }

    
    MultipleAccountEnterClicked() {
        this.gridPopupSettingsForMultiplePartyLedgerList = this.masterService.getGenericGridPopUpSettings('PartyLedgerListForReport');
        this.genericGridMultiplePartyLedger.show();
    }

    dblClickMultipleAccountSelect(account) {
        this._reportFilterService.PartyLedgerObj.multipleACID = account.ACID;
        this._reportFilterService.PartyLedgerObj.multipleACNAME = account.ACNAME;
    }

    checkCostCenterValue() {
        if (this._reportFilterService.PartyLedgerObj.PartyLedger_showAllContacts == true) {
            this.showMultipleCC = false;
        } else {
            this.showMultipleCC = true;
        }
    }

    addCostcenterToList() {
        const ccData = this._reportFilterService.PartyLedgerObj.CCENTER;
        this._reportFilterService.PartyLedgerObj.CCENTER = ccData && ccData.CCID ? ccData.CCID : '';
        let selectCCenterList = this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter.filter(centerList => centerList.COSTCENTERNAME == ccData.COSTCENTERNAME)
        if (
            ccData.COSTCENTERNAME === "" ||
            ccData.COSTCENTERNAME === null ||
            ccData.COSTCENTERNAME === undefined
        ) {
            return;
        }

        if (selectCCenterList.length === 0) {
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter.push({ CCID: ccData.CCID, COSTCENTERNAME: ccData.COSTCENTERNAME })
        }

    }

    deleteCostcenter(index) {
        this._reportFilterService.PartyLedgerObj.PartyLedger_multipleCostcenter.splice(index, 1)
    }

    GroupAccountclick(){   
        this.gridPopupSettingsForMultipleGroupAccountList = this.masterService.getGenericGridPopUpSettings('AccountGroupList');
        this.genericGridMultipleGroupAccount.show();
    }

    dblClickGroupAccountSelect(account) {
        this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACID = account.ACID;
        this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME = account.ACNAME;
    }

    addGroupAccountToList(){
        let selectACList = this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts.filter(acList => acList.ACNAME == this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME)
        if (
            this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME === "" ||
            this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME === null ||
            this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts.push({ ACID: this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACID, ACNAME: this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME })
                this._reportFilterService.PartyLedgerObj.Multiple_GROUP_ACNAME='';
                this._reportFilterService.PartyLedgerObj.multiple_Group_ACCODE='';
        }
    }

    deleteGroupAccount(index) {
        this._reportFilterService.PartyLedgerObj.PartyLedger_multipleGroupAccounts.splice(index, 1);
        this._reportFilterService.selectedGroupAccountParty='';

    }
   
}