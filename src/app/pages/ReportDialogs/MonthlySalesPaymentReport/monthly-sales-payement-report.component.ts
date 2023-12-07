import { Component, Inject, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { AuthService } from '../../../common/services/permission/authService.service';
import { Division } from '../../../common/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
export interface DialogInfo {
    header: string;
    message: Observable<string>;
}
@Component({
    selector: 'monthly-sales-payment',
    templateUrl: './monthly-sales-payement-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]
})

export class MonthlySalesPaymentReport implements OnInit {
    acname: string;
    accode: string;
    userProfile: any;
    division: any[] = [];
    account: any[] = [];
    account2: any[] = [];
    instanceWiseRepName:string='MonthlySalesPaymentReport';

    @Output() reportdataEmit = new EventEmitter();
    @ViewChild("genericGridMonthlysalesPayment") genericGridMonthlysalesPayment: GenericPopUpComponent;
    gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo,
        public dialogref: MdDialogRef<MonthlySalesPaymentReport>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo,
        private _reportFilterService: ReportMainService,  public _ActivatedRoute: ActivatedRoute,
        private alertService: AlertService, private _authService: AuthService, private arouter: Router
    ) {
 
        this._reportFilterService.MonthlySalesPaymentObj.Reportnameis = 'MonthlySalesPaymentReport';
        this.userProfile = this._authService.getUserProfile();

        this.division=[];
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

        // this.masterService.getAccDivList();

    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            if (this._reportFilterService.MonthlySalesPaymentObj.assignPrevioiusDate != true) {
                this.masterService.getAccDivList();
            this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2, "AD");
                  }
                  else {

                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2, "AD");


                }
                // this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2 = new Date().toJSON().split('T')[0];
                // this._reportFilterService.MonthlySalesPaymentObj.  MonthlySalesPayment_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
            }

            if(params.instancename){
                // ////console.log("@@[Monthly Sales Payment0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACID=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACCNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACNAME;

            }

        })

        this.changeEntryDate(this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2, "AD");
    }
    focusOutFromDate(value) {
        this.masterService.validateDate(value).subscribe(x => {
            if (x == "error") {
                this.alertService.warning("Date should be within Fiscal year");
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1 = new Date().toJSON().split('T')[0];
            }
        });
    }
    changeEntryDate(value, format: string) {

        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }

    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
            // this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {

            // if (this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACCNAME == null || this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACCNAME == '' || this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACCNAME == undefined) {
            //     this.alertService.info("Please Select Account");
            //     return;
            // }
            this.DialogClosedResult("ok"); 
        
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV = (this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV == null || this._reportFilterService.MonthlySalesPaymentObj.  MonthlySalesPayment_DIV == "") ? "%" : this._reportFilterService.MonthlySalesPaymentObj.  MonthlySalesPayment_DIV;

        if (this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV && this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV == '%') {
            this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIVISIONAME = 'All';
          }else if( this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV && this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIVISIONAME = abc[0].NAME;
              }else{
                this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIVISIONAME = '';
              }
          }else{
            this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIVISIONAME = '';
          }

        if (res == "ok") {
            this._reportFilterService.MonthlySalesPaymentObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }

            if(this._reportFilterService.Monthlysales_Payment_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'MonthlySalesPaymentReport',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.Monthlysales_Payment_loadedTimes,
                    });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'MonthlySalesPaymentReport'+'_'+this._reportFilterService.Monthlysales_Payment_loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.Monthlysales_Payment_loadedTimes,
                    });
            }

        }


        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Monthly Sales Payment Report',
                reportname:'Monthly Sales Payment Report',
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.Monthlysales_Payment_loadedTimes,
                reportparam: {
                    REPORTOPTIONDISPLAYNAME: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_REPORTOPTIONDISPLAYNAME?this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_REPORTOPTIONDISPLAYNAME:'',
                    DATE1: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE1,
                    DATE2: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DATE2,
                    BSDATE1: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_BSDATE1,
                    BSDATE2: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_BSDATE2,
                    DIV: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIV,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID, 
                    ACID: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACID ? this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACID : '%',
                    ACNAME: this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACCNAME,
                    DIVISIONNAME : this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIVISIONAME ? this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_DIVISIONAME : '',
                   
                }
            }
        })
        this._reportFilterService.Monthlysales_Payment_loadedTimes = this._reportFilterService.Monthlysales_Payment_loadedTimes+1;
    }


    AccountEnterClicked() {
        this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('AllAcountList');
        this.genericGridMonthlysalesPayment.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACID = account.ACID;
        this._reportFilterService.MonthlySalesPaymentObj.MonthlySalesPayment_ACCNAME = account.ACNAME;
    }
}
