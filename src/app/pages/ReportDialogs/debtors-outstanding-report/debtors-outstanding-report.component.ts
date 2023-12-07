import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Division } from '../../../common/interfaces';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../common/services/alert/alert.service';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'result-debtors-outstanding-report-dialog',
    templateUrl: './debtors-outstanding-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class DebtorsOutstandingReport {
    allCustomerlist: any[] = [];
    multipleCustomerList: any[] = [];
    showCustomer:boolean;
    showArea:boolean;
    division: any[] = [];
    AreaList:any[]=[];
    CostcenterList:any[]=[];
    PartyGroupList:any[]=[];
    instanceWiseRepName:string='Debtors Outstanding Report';

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridMultipleAccountLedger") genericGridMultipleAccountLedger: GenericPopUpComponent;
    gridPopupSettingsForMultipleAccountLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo,
        public dialogref: MdDialogRef<DebtorsOutstandingReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo, public _ActivatedRoute: ActivatedRoute,private alertService: AlertService,
        private _reportFilterService:ReportMainService,private arouter: Router) {

        this.showCustomer=true;
        this._reportFilterService.DebtorsOutstandingObj.Reportnameis='debitorsoutstanding';

        this.allCustomerlist = [];
        this.masterService.getAllCustomers().subscribe(
            res => {
                this.allCustomerlist.push(res)
            })

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
            if (this._reportFilterService.DebtorsOutstandingObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1 = new Date().toJSON().split('T')[0];
                    this.changestartDate(this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1, "AD");
                  }
                  else {

                this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changestartDate(this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1, "AD");


                }
            // this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1 = new Date().toJSON().split('T')[0];
            // this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
            this.masterService.viewDivision.subscribe(() => {
                if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                  this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV='%';
              }else{
                  this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
              }
              })
            this._reportFilterService.DebtorsOutstandingObj.ISSUMMARY='1';
            this._reportFilterService.DebtorsOutstandingObj.ReportType='1';
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_AreaWise = 0;
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts = [];
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_CostCenter ='%';
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_PartyGroup='%';
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_AreaWiseInSummary = 0;
            }

            if(params.instancename){
                ////console.log("@@[Debtors Outs Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                // this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                // this.changestartDate(this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1, "AD");
                // this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                // this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
            }
        })


        // this.changestartDate(this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1, "AD");
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
        if(this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts=== undefined){
            SelectedAccount = this._reportFilterService.DebtorsOutstandingObj.SingleAccount
        }else{
            if (this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts.length != 0) {
                this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts.forEach(acList => {
                    multipleSelectedAccount.push(acList.ACID)
                    SelectedAccount += `${multipleSelectedAccount},`
                });
            } else {
                SelectedAccount = this._reportFilterService.DebtorsOutstandingObj.multipleACID
            }
        }

        // if (this._reportFilterService.DebtorsOutstandingObj.DOAGEINGOFOPENINGBL == true) {
        //     this._reportFilterService.DebtorsOutstandingObj.DOAGEINGOFOPENINGBL = '0';
        // } else {
        //     this._reportFilterService.DebtorsOutstandingObj.DOAGEINGOFOPENINGBL = '1';
        // }

        // if((this._reportFilterService.DebtorsOutstandingObj.ISSUMMARY=='0' && this._reportFilterService.DebtorsOutstandingObj.ReportType=="1")&& res=="ok"){
        //     if(SelectedAccount=="" || SelectedAccount==null || SelectedAccount==undefined || !SelectedAccount){
        //         this.alertService.info("Please Select Account First");
        //         SelectedAccount='%'
        //         return;
        //     }
             
        // }

        if (this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV && this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV == '%') {
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV && this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_CostCenter && this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_CostCenter == '%') {
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_COSTCENTERDISPLAYNAME = '';
          }
          
          
        if(res == "ok"){
            this._reportFilterService.DebtorsOutstandingObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.DebtorsOuts_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Debtors Outstanding Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.DebtorsOuts_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Debtors Outstanding Report'+'_'+this._reportFilterService.DebtorsOuts_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.DebtorsOuts_loadedTimes,
                });
            }

            }
            let multiplereportname = 'Debtors Outstanding Report';
            let Area = '0';
            if(this._reportFilterService.DebtorsOutstandingObj.ISSUMMARY=='1'){
                multiplereportname = 'Debtors Outstanding Report';
                Area=this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_AreaWiseInSummary;
            }else if(this._reportFilterService.DebtorsOutstandingObj.ISSUMMARY=='0'){
                multiplereportname = 'Debtors Outstanding Report_1';
                Area=this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_AreaWise;
            }

        this._reportFilterService.DebtorsOutstandingObj.DIV = (this._reportFilterService.DebtorsOutstandingObj.DIV == null || this._reportFilterService.DebtorsOutstandingObj.DIV == "") ? "%" : this._reportFilterService.DebtorsOutstandingObj.DIV;
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multiplereportname,
                REPORTDISPLAYNAME : 'Debtors Outstanding Report',
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.DebtorsOuts_loadedTimes,
                reportparam: {
                    DATE: this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1 ,
                    BSDATE: this._reportFilterService.CreditorsAgeingObj.DebtorsOutstanding_BSDATE1,
                    DIV: this._reportFilterService.DebtorsOutstandingObj.DIV,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COSTCENTER: this._reportFilterService.DebtorsOutstandingObj.CostCenter,
                    ISDEBTORS: "1",
                    GROUPBY: this._reportFilterService.DebtorsOutstandingObj.GROUPBY?this._reportFilterService.DebtorsOutstandingObj.GROUPBY:'0',
                    DOAGEINGOFOPENINGBL: this._reportFilterService.DebtorsOutstandingObj.DOAGEINGOFOPENINGBL?this._reportFilterService.DebtorsOutstandingObj.DOAGEINGOFOPENINGBL:0,
                    ACID: SelectedAccount ? SelectedAccount : '%',
                    AREA: Area ? Area : '0',
                    REPORTTYPE: this._reportFilterService.DebtorsOutstandingObj.ReportType?this._reportFilterService.DebtorsOutstandingObj.ReportType:0,
                    ISSUMMARY: this._reportFilterService.DebtorsOutstandingObj.ISSUMMARY,
                    // DATE1: this.masterService.PhiscalObj.BeginDate.split('T')[0],
                    // DATE2: this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1 ,
                    DIVISIONNAME : this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIVISIONNAME ? this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_COSTCENTERDISPLAYNAME?this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_COSTCENTERDISPLAYNAME:'',
                    PARTYGROUP : this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_PartyGroup?this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_PartyGroup:'%',
                    INCLUDEPOSTEDTRANSACTION:this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_INCLUDEPOSTEDTRANSACTION?this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_INCLUDEPOSTEDTRANSACTION:0
                }
            }
        });
        if(res == "ok"){
            this._reportFilterService.DebtorsOuts_loadedTimes = this._reportFilterService.DebtorsOuts_loadedTimes+1;
        }
    }

    changestartDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
                // this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (e) { }

    }

    checkValue(){
        if(this._reportFilterService.DebtorsOutstandingObj.ReportType=='1'){
            this.showCustomer=true;
        }else{
            this.showCustomer=false;
        }
        if(this._reportFilterService.DebtorsOutstandingObj.ReportType=='2'){
            this.showArea=true;
        }else{
            this.showArea=false;
        }
    }

    // onChangeSummaryReport() {
    //     this._reportFilterService.DebtorsOutstandingObj.SummaryReportWise = 0;
    // }
    // onChangeDetailReport() {
    //     this._reportFilterService.DebtorsOutstandingObj.DetailReportWise = 0;
    // }

    addAccountToList() {
        let selectACList = this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts.filter(acList => acList.ACNAME == this._reportFilterService.DebtorsOutstandingObj.multipleACNAME)
        if (
            this._reportFilterService.DebtorsOutstandingObj.multipleACNAME === "" ||
            this._reportFilterService.DebtorsOutstandingObj.multipleACNAME === null ||
            this._reportFilterService.DebtorsOutstandingObj.multipleACNAME === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
            this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts.push({ ACID: this._reportFilterService.DebtorsOutstandingObj.multipleACID, ACNAME: this._reportFilterService.DebtorsOutstandingObj.multipleACNAME })
                this._reportFilterService.DebtorsOutstandingObj.multipleACNAME='';
                this._reportFilterService.DebtorsOutstandingObj.multipleACCODE='';
                this._reportFilterService.DebtorsOutstandingObj.multipleACID='';
        }
    }

    deleteAccount(index) {
        this._reportFilterService.DebtorsOutstandingObj.DebtorsOutstanding_multipleAccounts.splice(index, 1)
    }


    MultipleAccountEnterClicked() {
        this.gridPopupSettingsForMultipleAccountLedgerList = this.masterService.getGenericGridPopUpSettings('C');
        this.genericGridMultipleAccountLedger.show();
    }

    dblClickMultipleAccountSelect(account) {
        this._reportFilterService.DebtorsOutstandingObj.multipleACID = account.ACID;
        this._reportFilterService.DebtorsOutstandingObj.multipleACNAME = account.ACNAME;
    }

}

