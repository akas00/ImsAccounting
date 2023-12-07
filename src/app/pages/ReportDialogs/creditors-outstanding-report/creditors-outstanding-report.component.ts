import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Division } from '../../../common/interfaces';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../common/services/alert/alert.service';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'result-creditors-outstanding-report-dialog',
    templateUrl: './creditors-outstanding-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class CreditorsOutstandingReport {
    allCustomerlist: any[] = [];
    multipleCustomerList: any[] = [];
    showCustomer:boolean;
    showArea:boolean;
    division: any[] = [];
    AreaList:any[]=[];
    CostcenterList:any[]=[];
    PartyGroupList:any[]=[];
    instanceWiseRepName:string='Creditors Outstanding Report';

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridMultipleAccountLedger") genericGridMultipleAccountLedger: GenericPopUpComponent;
    gridPopupSettingsForMultipleAccountLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo, public _ActivatedRoute: ActivatedRoute, private alertService: AlertService,
        public dialogref: MdDialogRef<CreditorsOutstandingReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo,
        private _reportFilterService:ReportMainService, private arouter: Router) {

        this.showCustomer=true;
        this._reportFilterService.CreditorsOutstandingObj.Reportnameis='creditorsoutstanding';

        this.allCustomerlist = [];
        this.masterService.getAllCustomers().subscribe(
            res => {
                this.allCustomerlist.push(res)
            }
        )

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

            this.masterService.getAreaList().subscribe(res => {
                this.AreaList = res.result;
            })

            this.masterService.getCostcenter().subscribe(res => {
                this.CostcenterList = res;
            })

            this.masterService.getPartyGroupList().subscribe(res => {
                this.PartyGroupList = res.result;
            })
            // this.masterService.getAccDivList();
    }
    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.CreditorsOutstandingObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1 = new Date().toJSON().split('T')[0];
                    this.changestartDate(this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1, "AD");
                  }
                  else {

                this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changestartDate(this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1, "AD");


                }
            // this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1 = new Date().toJSON().split('T')[0];
            // this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
            this.masterService.viewDivision.subscribe(() => {
                if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                  this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV='%';
              }else{
                if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                    this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV=this.division[0].INITIAL;
                  }else{
                    this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                }
              }
              })
            this._reportFilterService.CreditorsOutstandingObj.ISSUMMARY='1';
            this._reportFilterService.CreditorsOutstandingObj.ReportType='1';
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_AreaWise = 0;
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts = [];
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_CostCenter ='%';
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_PartyGroup='%';
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_AreaWiseInSummary = 0;
            }

            if(params.instancename){
                ////console.log("@@[Crediors Outs Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                // this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                // this.changestartDate(this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1, "AD");
                // this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                // this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
            }
        })


        // this.changestartDate(this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1, "AD");
        this.checkValue();
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        let multipleSelectedAccount = [];
        let SelectedAccount = '';
        if(this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts=== undefined){
            SelectedAccount = this._reportFilterService.CreditorsOutstandingObj.SingleAccount
        }else{
            if (this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts.length != 0) {
                this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts.forEach(acList => {
                    multipleSelectedAccount.push(acList.ACID)
                    SelectedAccount += `${multipleSelectedAccount},`
                });
            } else {
                SelectedAccount = this._reportFilterService.CreditorsOutstandingObj.multipleACID
            }
        }

        // if((this._reportFilterService.CreditorsOutstandingObj.ISSUMMARY=='0' && this._reportFilterService.CreditorsOutstandingObj.ReportType=="1")&& res=="ok"){
        //     if(SelectedAccount=="" || SelectedAccount==null || SelectedAccount==undefined || !SelectedAccount){
        //         this.alertService.info("Please Select Account First");
        //         return;
        //     }
        // }

        // if (this._reportFilterService.CreditorsOutstandingObj.DOAGEINGOFOPENINGBL == true) {
        //     this._reportFilterService.CreditorsOutstandingObj.DOAGEINGOFOPENINGBL = '0';
        // } else {
        //     this._reportFilterService.CreditorsOutstandingObj.DOAGEINGOFOPENINGBL = '1';
        // }

        if (this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV && this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV == '%') {
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV && this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_CostCenter && this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_CostCenter == '%') {
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_COSTCENTERDISPLAYNAME = '';
          }

        if(res == "ok"){
            this._reportFilterService.CreditorsOutstandingObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.CreditorsOuts_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Creditors Outstanding Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.CreditorsOuts_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Creditors Outstanding Report'+'_'+this._reportFilterService.CreditorsOuts_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.CreditorsOuts_loadedTimes,
                });
            }

            }

            let multiplereportname = 'Creditors Outstanding Report';
            let Area = '0';
            if(this._reportFilterService.CreditorsOutstandingObj.ISSUMMARY=='1'){
                multiplereportname = 'Creditors Outstanding Report';
                Area=this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_AreaWiseInSummary;
            }else if(this._reportFilterService.CreditorsOutstandingObj.ISSUMMARY=='0'){
                multiplereportname = 'Creditors Outstanding Report_1';
                Area=this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_AreaWise;
            }


        this._reportFilterService.CreditorsOutstandingObj.DIV = (this._reportFilterService.CreditorsOutstandingObj.DIV == null || this._reportFilterService.CreditorsOutstandingObj.DIV == "") ? "%" : this._reportFilterService.CreditorsOutstandingObj.DIV;
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multiplereportname,
                REPORTDISPLAYNAME : 'Creditors Outstanding Report',
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.CreditorsOuts_loadedTimes,
                reportparam: {
                    DATE: this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1,
                    BSDATE: this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_BSDATE1,
                    DIV: this._reportFilterService.CreditorsOutstandingObj.DIV,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COSTCENTER: this._reportFilterService.CreditorsOutstandingObj.CostCenter,
                    ISCreditors: "0",
                    GROUPBY: this._reportFilterService.CreditorsOutstandingObj.GROUPBY?this._reportFilterService.CreditorsOutstandingObj.GROUPBY:'0',
                    DOAGEINGOFOPENINGBL: this._reportFilterService.CreditorsOutstandingObj.DOAGEINGOFOPENINGBL?this._reportFilterService.CreditorsOutstandingObj.DOAGEINGOFOPENINGBL:0,
                    ACID: SelectedAccount ? SelectedAccount : '%',
                    AREA: Area ? Area : '0',
                    REPORTTYPE: this._reportFilterService.CreditorsOutstandingObj.ReportType?this._reportFilterService.CreditorsOutstandingObj.ReportType:'0',
                    ISSUMMARY: this._reportFilterService.CreditorsOutstandingObj.ISSUMMARY,
                    // DATE1: this.masterService.PhiscalObj.BeginDate.split('T')[0],
                    // DATE2: this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1,
                    DIVISIONNAME : this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIVISIONNAME ? this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_COSTCENTERDISPLAYNAME?this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_COSTCENTERDISPLAYNAME:'',
                    PARTYGROUP : this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_PartyGroup?this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_PartyGroup:'%',
                    ISDEBTORS: "0",
                    INCLUDEPOSTEDTRANSACTION:this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_INCLUDEPOSTEDTRANSACTION ?this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_INCLUDEPOSTEDTRANSACTION:0
                }
            }
        });
        this._reportFilterService.CreditorsOuts_loadedTimes = this._reportFilterService.CreditorsOuts_loadedTimes+1;
    }

    changestartDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_BSDATE1= (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
                // this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (e) { }

    }

    checkValue(){
        if(this._reportFilterService.CreditorsOutstandingObj.ReportType==1){
            this.showCustomer=true;
        }else{
            this.showCustomer=false;
        }
        if(this._reportFilterService.CreditorsOutstandingObj.ReportType==2){
            this.showArea=true;
        }else{
            this.showArea=false;
        }
    }

    // onChangeSummaryReport() {
    //     this.ReportParameters.SummaryReportWise = 0;
    // }

    // onChangeDetailReport() {
    //     this.ReportParameters.DetailReportWise = 0;
    // }

    addAccountToList() {
        let selectACList = this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts.filter(acList => acList.ACNAME == this._reportFilterService.CreditorsOutstandingObj.multipleACNAME)
        if (
            this._reportFilterService.CreditorsOutstandingObj.multipleACNAME === "" ||
            this._reportFilterService.CreditorsOutstandingObj.multipleACNAME === null ||
            this._reportFilterService.CreditorsOutstandingObj.multipleACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts.push({ ACID: this._reportFilterService.CreditorsOutstandingObj.multipleACID, ACNAME: this._reportFilterService.CreditorsOutstandingObj.multipleACNAME })
                this._reportFilterService.CreditorsOutstandingObj.multipleACNAME='';
                this._reportFilterService.CreditorsOutstandingObj.multipleACCODE='';
                this._reportFilterService.CreditorsOutstandingObj.multipleACID='';
        }
    }

    deleteAccount(index) {
        this._reportFilterService.CreditorsOutstandingObj.CreditorsOutstanding_multipleAccounts.splice(index, 1)
    }


    MultipleAccountEnterClicked() {
        this.gridPopupSettingsForMultipleAccountLedgerList = this.masterService.getGenericGridPopUpSettings('V');
        this.genericGridMultipleAccountLedger.show();
    }

    dblClickMultipleAccountSelect(account) {
        this._reportFilterService.CreditorsOutstandingObj.multipleACID = account.ACID;
        this._reportFilterService.CreditorsOutstandingObj.multipleACNAME = account.ACNAME;
    }
}

