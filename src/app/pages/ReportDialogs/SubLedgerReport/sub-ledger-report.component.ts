import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Division } from '../../../common/interfaces';
import { Subscriber } from 'rxjs/Subscriber';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'sub-ledger-report',
    templateUrl: './sub-ledger-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class SubLedgerReport implements OnInit {
    ReportParameters: any = <any>{};
    division: any[] = [];
    CostcenterList: any[] = [];
    result: any;
    account: any[] = [];
    SubLedger_result: boolean;
    userProfile: any;
    showSummaryTree: boolean;
    showLedgerSegregation: boolean;
    userSetting:any;
    instanceWiseRepName:string='Sub Ledger Report';

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridSubLedger") genericGridSubLedger: GenericPopUpComponent;
    gridPopupSettingsForSubLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridSubLedgerOnly") genericGridSubLedgerOnly: GenericPopUpComponent;
    gridPopupSettingsForSubLedgerListOnly: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(private masterService: MasterRepo, private _authService: AuthService,
        private _reportFilterService: ReportMainService, private alertService: AlertService,
        private arouter: Router, public _ActivatedRoute: ActivatedRoute, public reportService: ReportFilterService,
        public dialogref: MdDialogRef<SubLedgerReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {

        this.userProfile = this._authService.getUserProfile();
        this.userSetting = this._authService.getSetting();

        // ////console.log("@@userSetting.ENABLESUBLEDGER",this.userSetting.ENABLESUBLEDGER)

        // this.masterService.getSubLedgerForReport().subscribe(res => {
        //     this.account = res.data;
        //     if (this.account.length != 0) {
        //         this.SubLedger_result = true;
        //     } else {
        //         this.SubLedger_result = false;
        //     }
        // })




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
        // this.masterService.getAccDivList();

        
    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            const mode = params.mode;
            // ////console.log("@@this.reportMasterService.drillParam.returnUrl",params.mode,this.reportService.drillParam.returnUrl);
            // ////console.log("@@this.reportMasterService.drillParam",this.reportService.drillParam)
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname=='Sub Ledger Report' && this._reportFilterService.SubLedgerObj.assignPrevioiusDate != true) {
            this._reportFilterService.SubLedgerObj.SubLedger_DATE1=this.reportService.drillParam.reportparam.DATE1;
            this._reportFilterService.SubLedgerObj.SubLedger_DATE2=this.reportService.drillParam.reportparam.DATE2;
            this._reportFilterService.SubLedgerObj.SubLedger_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.SubLedgerObj.SubLedger_CostCenter=this.reportService.drillParam.reportparam.COSTCENTER;
            this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE = '1';
            this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID=this.reportService.drillParam.reportparam.SL_ACID;
            this._reportFilterService.SubLedgerObj.SubLedger_ACID=this.reportService.drillParam.reportparam.ACID;
            this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME=this.reportService.drillParam.reportparam.ACCNAME;
            this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME=this.reportService.drillParam.reportparam.SL_ACNAME;

            this.changeEntryDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE1, "AD");
            this.changeEndDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE2, "AD");
            this.checkValue();
            }

        else {

            if (this._reportFilterService.SubLedgerObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
        this._reportFilterService.SubLedgerObj.SubLedger_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
        this.changeEntryDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE1, "AD");
        if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {

                    this._reportFilterService.SubLedgerObj.SubLedger_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE2 , "AD");
                  }
                  else {

                this._reportFilterService.SubLedgerObj.SubLedger_DATE2  = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE2 , "AD");


                }
                this.masterService.viewDivision.subscribe(() => {
                    if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                      this._reportFilterService.SubLedgerObj.SubLedger_DIV='%';
                  }else{
                    if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                        this._reportFilterService.SubLedgerObj.SubLedger_DIV=this.division[0].INITIAL;
                      }else{
                        this._reportFilterService.SubLedgerObj.SubLedger_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                    }
                  }
                  })
                this._reportFilterService.SubLedgerObj.SubLedger_CostCenter = '%';
                this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE = '0';
                this.checkValue();
                this._reportFilterService.SubLedgerObj.SubLedger_HIDECOSTCENTER = 0;
                }

            if(params.instancename){
                // ////console.log("@@[Sub Ledger Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.SubLedgerObj.SubLedger_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.SubLedgerObj.SubLedger_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this.changeEntryDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE1, "AD");
                this.changeEndDate(this._reportFilterService.SubLedgerObj.SubLedger_DATE2, "AD");
                this._reportFilterService.SubLedgerObj.SubLedger_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.SubLedgerObj.SubLedger_CostCenter=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTTYPE;
                this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SL_ACID;
                this._reportFilterService.SubLedgerObj.SubLedger_ACID=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACCNAME;
                this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SL_ACNAME;
                this._reportFilterService.SubLedgerObj.SubLedger_LEDGERSEGREGATION = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.LEDGERSEGREGATION;
                this._reportFilterService.SubLedgerObj.SubLedger_SHOWNDATE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWNDATE;
                this._reportFilterService.SubLedgerObj.SubLedger_SHOWSUMMARYINTREE = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.SHOWSUMMARYINTREE;
            }
        }

    })
}

changeEntryDate(value, format: string) {
  var adbs = require("ad-bs-converter");
  if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._reportFilterService.SubLedgerObj.SubLedger_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
  //console.log("FROM BSDATE1",this._reportFilterService.SubLedgerObj.SubLedger_BSDATE1);
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
                  this._reportFilterService.SubLedgerObj.SubLedger_DATE1  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
    //   this._reportFilterService.SubLedgerObj.SubLedger_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
  }
}


    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.SubLedgerObj.SubLedger_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.SubLedgerObj.SubLedger_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        if(this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME == '' || this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME === undefined || this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME === null){
            this._reportFilterService.SubLedgerObj.SubLedger_ACID = '';
        }
        if(this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME == '' || this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME === undefined || this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME === null){
            this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID = '';
        }
        // ////console.log("@@acid",this._reportFilterService.SubLedgerObj.SubLedger_ACID,this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME)
        // ////console.log("@@slacid",this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID,this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME)

        if(this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID === undefined || this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID == ''){
            if ((this._reportFilterService.SubLedgerObj.SubLedger_ACID === undefined ||
                this._reportFilterService.SubLedgerObj.SubLedger_ACID == '' || this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME == '')) {
            this.alertService.info("Please Select Account");
            return;
        }
    }else if(this._reportFilterService.SubLedgerObj.SubLedger_ACID === undefined || this._reportFilterService.SubLedgerObj.SubLedger_ACID == '' ){
        if ((this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID === undefined ||
            this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID == '' || this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME == '')) {
    this.alertService.info("Please Select Account");
    return;
    }
        }
            this.DialogClosedResult("ok");

    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.SubLedgerObj.SubLedger_DIV = (this._reportFilterService.SubLedgerObj.SubLedger_DIV == null || this._reportFilterService.SubLedgerObj.SubLedger_DIV == "") ? "%" : this._reportFilterService.SubLedgerObj.SubLedger_DIV;

        let multipleReportFormateName = '';
        // ////console.log("@@this.userSetting.ENABLESUBLEDGER",this.userSetting.ENABLESUBLEDGER)

            // if (this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE == "0") {
                multipleReportFormateName = 'Sub Ledger Report'
            // } else {
            //     multipleReportFormateName = 'Sub Ledger Report_1'
            // }



        if (this._reportFilterService.SubLedgerObj.SubLedger_SHOWSUMMARYINTREE == true && this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE == "0") {
            this._reportFilterService.SubLedgerObj.SubLedger_SHOWSUMMARYINTREE = 1;
        } else {
            this._reportFilterService.SubLedgerObj.SubLedger_SHOWSUMMARYINTREE = 0;
        }

        // if (this._reportFilterService.SubLedgerObj.SubLedger_LEDGERSEGREGATION == true && this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE == "1") {
        //     this._reportFilterService.SubLedgerObj.SubLedger_LEDGERSEGREGATION = 1;
        // } else {
        //     this._reportFilterService.SubLedgerObj.SubLedger_LEDGERSEGREGATION = 0;
        // }

        if (this._reportFilterService.SubLedgerObj.SubLedger_SHOWNDATE == true) {
            this._reportFilterService.SubLedgerObj.SubLedger_SHOWNDATE = 1;
        } else {
            this._reportFilterService.SubLedgerObj.SubLedger_SHOWNDATE = 0;
        }

        if (this._reportFilterService.SubLedgerObj.SubLedger_DIV && this._reportFilterService.SubLedgerObj.SubLedger_DIV == '%') {
            this._reportFilterService.SubLedgerObj.SubLedger_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.SubLedgerObj.SubLedger_DIV && this._reportFilterService.SubLedgerObj.SubLedger_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.SubLedgerObj.SubLedger_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.SubLedgerObj.SubLedger_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.SubLedgerObj.SubLedger_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.SubLedgerObj.SubLedger_DIVISIONNAME = '';
          }

          if (this._reportFilterService.SubLedgerObj.SubLedger_CostCenter && this._reportFilterService.SubLedgerObj.SubLedger_CostCenter == '%') {
            this._reportFilterService.SubLedgerObj.SubLedger_COSTCENTERDISPLAYNAME = 'All';
          }else if (this._reportFilterService.SubLedgerObj.SubLedger_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.SubLedgerObj.SubLedger_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.SubLedgerObj.SubLedger_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.SubLedgerObj.SubLedger_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.SubLedgerObj.SubLedger_COSTCENTERDISPLAYNAME = '';
          }

        if(res == "ok"){
        this._reportFilterService.SubLedgerObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }
              if(this._reportFilterService.SubLedger_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Sub Ledger - Ledger Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.SubLedger_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Sub Ledger - Ledger Report'+'_'+this._reportFilterService.SubLedger_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.SubLedger_loadedTimes,
                });
            }

        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Sub Ledger - Ledger Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.SubLedger_loadedTimes,
                reportparam: {
                    MAINLEDGERDISPLAYNAME : this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME?this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME:'',
                    SUBLEDGERDISPLAYNAME : this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME ?this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME:'',
                    DATE1: this._reportFilterService.SubLedgerObj.SubLedger_DATE1,
                    DATE2: this._reportFilterService.SubLedgerObj.SubLedger_DATE2,
                    BSDATE1: this._reportFilterService.SubLedgerObj.SubLedger_BSDATE1,
                    BSDATE2: this._reportFilterService.SubLedgerObj.SubLedger_BSDATE2,
                    DIV: this._reportFilterService.SubLedgerObj.SubLedger_DIV ? this._reportFilterService.SubLedgerObj.SubLedger_DIV :'%',
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    SHOWSUMMARYINTREE: this._reportFilterService.SubLedgerObj.SubLedger_SHOWSUMMARYINTREE,
                    REPORTTYPE: 1,
                    LEDGERSEGREGATION: 0,
                    ACID: this._reportFilterService.SubLedgerObj.SubLedger_ACID ? this._reportFilterService.SubLedgerObj.SubLedger_ACID :'%',
                    CCENTER: this._reportFilterService.SubLedgerObj.SubLedger_CostCenter ? this._reportFilterService.SubLedgerObj.SubLedger_CostCenter :'%',
                    ACCNAME: this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME,
                    SL_ACID :this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID ?this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID :'%',
                    SHOWNDATE: this._reportFilterService.SubLedgerObj.SubLedger_SHOWNDATE?this._reportFilterService.SubLedgerObj.SubLedger_SHOWNDATE:0,
                    SL_ACNAME :this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME ?this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME :'%',
                    DIVISIONNAME : this._reportFilterService.SubLedgerObj.SubLedger_DIVISIONNAME ? this._reportFilterService.SubLedgerObj.SubLedger_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.SubLedgerObj.SubLedger_COSTCENTERDISPLAYNAME?this._reportFilterService.SubLedgerObj.SubLedger_COSTCENTERDISPLAYNAME:'',
                    HIDECOSTCENTER:this._reportFilterService.SubLedgerObj.SubLedger_HIDECOSTCENTER ? this._reportFilterService.SubLedgerObj.SubLedger_HIDECOSTCENTER:0,
                    HIDENARATION:this._reportFilterService.SubLedgerObj.SubLedger_HIDENARATION ? this._reportFilterService.SubLedgerObj.SubLedger_HIDENARATION:0,
                    IGNOREOPPOSITAC:this._reportFilterService.SubLedgerObj.IGNOREOPPOSITAC ? this._reportFilterService.SubLedgerObj.IGNOREOPPOSITAC:0

                }
            }
        });
        if(res == "ok"){
            this._reportFilterService.SubLedger_loadedTimes = this._reportFilterService.SubLedger_loadedTimes+1;
        }
    }

    dropListItem = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
            this.masterService.getSubLedgerForReport().map(data => {
                this.result = data.result;
                return this.result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
            }
            ).subscribe(res => { observer.next(res); })
        }).share();
    }

    accodeChanged(value: string) {
        var item;
        item = this.masterService.accountList.find(x => x.ACCODE == value);
        this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME = '';
        if (item) {
            value = item.ACNAME;
            //console.log(value + "****");
            this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME = value;
        }
    }

    onEnterAcnameChange(value) {
        this.accodeChanged(value);
    }

    itemChanged(value: any) {
        //console.log({ itemChangedValue: value });
        if (typeof (value) === "object") {
            this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME = value.ACNAME;
            this._reportFilterService.SubLedgerObj.SubLedger_ACCODE = value.ACCODE;
            this._reportFilterService.SubLedgerObj.SubLedger_ACID = value.ACID;
        }
    }

    checkValue() {
        if (this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE == "0") {
            this.showSummaryTree = true
        } else {
            this.showSummaryTree = false;
        }

        if (this._reportFilterService.SubLedgerObj.SubLedger_REPORTTYPE == "1") {
            this.showLedgerSegregation = true;
        } else {
            this.showLedgerSegregation = false;
        }
    }

    AccountEnterClicked() {
        if(this.userSetting.ENABLESUBLEDGER==2){
            this.gridPopupSettingsForSubLedgerList = this.masterService.getGenericGridPopUpSettings('MainLedgerListAtSettingTwo');
            this.genericGridSubLedger.show();
        }else{
            this.gridPopupSettingsForSubLedgerList = this.masterService.getGenericGridPopUpSettings('MainLedgerListAtSettingOne');
            this.genericGridSubLedger.show();
        }
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.SubLedgerObj.SubLedger_ACID = account.ACID;
        this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME = account.ACNAME;
    }

    SubLedgerEnterClicked() {
        if(this.userSetting.ENABLESUBLEDGER==2){
            this.gridPopupSettingsForSubLedgerListOnly = this.masterService.getGenericGridPopUpSettings('SubLedgerListAtSettingTwo');
            this.genericGridSubLedgerOnly.show();
        }else{
            if(this._reportFilterService.SubLedgerObj.SubLedger_ACCNAME == ''){
                this._reportFilterService.SubLedgerObj.SubLedger_ACID='';
            }
            if(this._reportFilterService.SubLedgerObj.SubLedger_ACID){
                this.gridPopupSettingsForSubLedgerListOnly = this.masterService.getGenericGridSettingForSubLedger(this._reportFilterService.SubLedgerObj.SubLedger_ACID);
            }else{
                this.gridPopupSettingsForSubLedgerListOnly = this.masterService.getGenericGridPopUpSettings('SubLedgerListAtSettingOne');
            }
            this.genericGridSubLedgerOnly.show();
        }
    }

    dblClickSubLedgerSelect(account) {
        this._reportFilterService.SubLedgerObj.SubLedger_SL_ACID = account.ACID;
        this._reportFilterService.SubLedgerObj.SubLedger_SL_ACNAME = account.ACNAME;
    }

}

