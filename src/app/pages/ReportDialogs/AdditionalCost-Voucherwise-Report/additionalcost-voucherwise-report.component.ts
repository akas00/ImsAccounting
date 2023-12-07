import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../common/services/alert/alert.service';


export interface DialogInfo{
    header: string;
    message: Observable<string>;
}
@Component({
    selector : 'additionalcost-voucherwise-report',
    templateUrl : './additionalcost-voucherwise-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]
})

export class AdditionalCostVoucherwiseReport implements OnInit{
    ReportParameters:any=<any>{};
    multipleReportFormateName:string;
    division: any[] = [];
    CostcenterList: any[] = [];
    instanceWiseRepName:string='Additional Cost Voucherwise Report';

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridVoucherNo") genericGridVoucherNo: GenericPopUpComponent;
    gridPopupSettingsForVoucherList: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridAccount") genericGridAccount: GenericPopUpComponent;
    gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo,
        public dialogref:MdDialogRef<AdditionalCostVoucherwiseReport>,
         @Inject(MD_DIALOG_DATA) public data: DialogInfo, public _ActivatedRoute: ActivatedRoute,private alertService: AlertService,
         private _reportFilterService:ReportMainService, private arouter: Router){
      //----------Default values on load
    //   this.multipleReportFormateName = 'Additional Cost Summary Report';
      this.ReportParameters.COMID = this.masterService.userProfile.CompanyInfo.COMPANYID;
 
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

    ngOnInit(){
        this._ActivatedRoute.queryParams.subscribe(params => {
            if(this._reportFilterService.AdditionalCostSummaryObj.assignPrevioiusDate != true){
              this.masterService.getAccDivList();
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                this.changestartDate(this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1, "AD");
                this.changeEndDate(this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2, "AD");
                // this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                  if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                    this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV='%';
                }else{
                  if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                    this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV=this.division[0].INITIAL;
                  }else{
                    this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                  }
                }
                })  
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ISSUMMARY = '1';
            }
    
            if(params.instancename){
                // ////console.log("@@AdditionalCostSummaryObj",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
            }
        })
        

        this.changestartDate(this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1, "AD");
        this.changeEndDate( this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2, "AD")
    }

    onload(){
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV = (this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV == null || this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV == "")?"%":this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV;

        if(this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ISSUMMARY == '1'){
            this.multipleReportFormateName = 'Additional Cost Voucherwise Summary Report';
            this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_SUMMARYREPORTDISPLAYNAME = ' @Summary Report';
        }else{
            this.multipleReportFormateName = 'Additional Cost Voucherwise Detail Report';
            this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_SUMMARYREPORTDISPLAYNAME = ' @Detail Report';
        }

        if (this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV && this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV == '%') {
            this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV && this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIVISIONNAME = '';
          }

        if(res == "ok"){
        this._reportFilterService.AdditionalCostSummaryObj.assignPrevioiusDate = true;
        let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.AdditionalCostSummary_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Additional Cost Voucherwise Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.AdditionalCostSummary_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Additional Cost Voucherwise Report'+'_'+this._reportFilterService.AdditionalCostSummary_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.AdditionalCostSummary_loadedTimes,
                });
            }
        
        }

        this.reportdataEmit.emit({ status: res, data: {reportname:this.multipleReportFormateName, 
            REPORTDISPLAYNAME : 'Additional Cost Voucherwise Report',
            instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.AdditionalCostSummary_loadedTimes, 
            reportparam:{
            DIVISION: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIV,
            PHISCALID: this.masterService.PhiscalObj.PhiscalID,
            COMID:this.ReportParameters.COMID,
            DATE1: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1,
            DATE2: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2,
            BSDATE1: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_BSDATE1,
            BSDATE2: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_BSDATE2,
            VOUCHER: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_VOUCHERNO?this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_VOUCHERNO:'%',
            ACID: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACID?this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACID:'%',
            ACCNAME: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACNAME?this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACNAME:'%',
            SUMMARYREPORT: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ISSUMMARY,
            DIVISIONNAME : this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIVISIONNAME ? this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DIVISIONNAME : '',
            SUMMARYREPORTDISPLAYNAME:this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_SUMMARYREPORTDISPLAYNAME?this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_SUMMARYREPORTDISPLAYNAME:'',
            SUPPLIERDISPLAYNAME: this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACNAME?this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACNAME:''



        } }});

        if(res == "ok"){
            this._reportFilterService.AdditionalCostSummary_loadedTimes = this._reportFilterService.AdditionalCostSummary_loadedTimes+1;
        }
    }

    changestartDate(value, format: string) {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            } 
                // this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
    }

    changeEndDate(value, format: string) {
        try{
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_BSDATE2 =(bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2  = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
                // this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        }
          catch(e){}
    }

    VoucherNoEnterClicked() {
        this.gridPopupSettingsForVoucherList = this.masterService.getGenericGridPopUpSettings('PIVoucherListForAdditionalCostReport');
        this.genericGridVoucherNo.show();
    }

    dblClickVoucherSelect(voucher) {
        this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_VOUCHERNO = voucher.VCHRNO;
    }

    AccountEnterClicked() {
        this.gridPopupSettingsForAccountList = {
            title: "Accounts",
            apiEndpoints: `/getAccountPagedListByMapId/Master/SupplierListForReport`,
            defaultFilterIndex: 1,
            columns: [
                {
                    key: "ACID",
                    title: "ACID",
                    hidden: false,
                    noSearch: false
                },
              {
                key: "ACNAME",
                title: "A/C NAME",
                hidden: false,
                noSearch: false
              }
            ]
          };
        this.genericGridAccount.show();
    }

    dblClickAccountSelect(supplier) {
        this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACID = supplier.ACID;
        this._reportFilterService.AdditionalCostSummaryObj.AdditionalCostSummary_ACNAME = supplier.ACNAME;
    }
}

