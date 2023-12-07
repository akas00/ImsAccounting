import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { Subscriber } from 'rxjs';
import { AlertService } from '../../../common/services/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'voucher-registor-dialog',
    templateUrl: './voucher-register-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class VoucherRegister implements OnInit{
    // ReportParameters: any = <any>{};
    division: any[] = [];
    CostcenterList: any[] = [];
    voucherTypeList: any[] = [];
    costlists:any[] = [];
    userList:any[] = [];
    allAccountList:any[] = [];
    @ViewChild("genericGridACListParty")
    genericGridACListParty: GenericPopUpComponent;
    gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    result: any;
    userProfile: any;
    instanceWiseRepName:string='Voucher Register Report';

    @ViewChild("genericGridAccountList") genericGridAccountList: GenericPopUpComponent;
    gridPopupSettingsForAccountList: GenericPopUpSettings = new GenericPopUpSettings();
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,private _authService: AuthService, public _ActivatedRoute: ActivatedRoute,
        private _reportFilterService:ReportMainService, private alertService: AlertService, private arouter: Router,
        public dialogref: MdDialogRef<VoucherRegister>,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        //----------Default values on load
        this.getVoucherType();
        this.getCostCenter();
        this.getuserList();
        this.getAllAcccountList();
        this.userProfile = this._authService.getUserProfile();

        // this._reportFilterService.VoucherRegisterObj.REPORTMODEVR = '0';

        this.gridACListPartyPopupSettings = {
            title: "Accounts",
            apiEndpoints: `/getAccountPagedListByMapId/Master/ALL/`,
            defaultFilterIndex: 1,
            columns: [
              {
                key: "ACCODE",
                title: "AC CODE",
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
          // this.masterService.getAccDivList();

    }

    ngOnInit(){
        this._ActivatedRoute.queryParams.subscribe(params => {
            if(this._reportFilterService.VoucherRegisterObj.assignPrevioiusDate != true){
              this.masterService.getAccDivList();
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE1=this.masterService.PhiscalObj.BeginDate.split('T')[0];
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2, "AD");
                  }
                  else {

                this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2, "AD");


                }
                // this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2 = new Date().toJSON().split('T')[0];
                // this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                  if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                    this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV='%';
                }else{
                  if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                    this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV=this.division[0].INITIAL;
                  }else{
                    this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                  }
                }
                })
                this._reportFilterService.VoucherRegisterObj.VTYPE="%";
                this._reportFilterService.VoucherRegisterObj.REPORT_TYPE='1';
                this._reportFilterService.VoucherRegisterObj.REPORTMODEVR = '0';
            }

            if(params.instancename){
                // ////console.log("@@[voucher reg Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.VoucherRegisterObj.CCENTER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.CostCenter;
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACID=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACID;
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.ACNAME;
                this._reportFilterService.VoucherRegisterObj.FROM_VNO=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.FROM_VNO;
                this._reportFilterService.VoucherRegisterObj.REPORTMODEVR=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORT_MODE;
                this._reportFilterService.VoucherRegisterObj.REPORT_TYPE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORT_TYPE;
                this._reportFilterService.VoucherRegisterObj.TO_VNO=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.TO_VNO;
                this._reportFilterService.VoucherRegisterObj.USER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.USER;
                this._reportFilterService.VoucherRegisterObj.VTYPE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.VTYPE;
            }
        })


        this.changeEntryDate(this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2, "AD");
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        if(this._reportFilterService.VoucherRegisterObj.REPORTMODEVR == 1 && (this._reportFilterService.VoucherRegisterObj.FROM_VNO > this._reportFilterService.VoucherRegisterObj.TO_VNO)){
            this.alertService.info("Starting Voucher No is Greater Than Ending Voucher No!");
            return;
                }else{
                    this.DialogClosedResult("ok");

                }
    }

    getVoucherType(){
        this.masterService.getAllVoucherType().subscribe(
            (res) =>{
                // ////console.log("vouchertyperes",res);
                this.voucherTypeList.push(res);
            }
        )
    }
    getAllAcccountList(){
        this.masterService.getAllAccountList().subscribe(
            (res)=>{
                ////console.log("accres",res);
                this.allAccountList = res.result;
            }
        )
    }

    getCostCenter(){
        this.masterService.getAllNEWCostCenter().subscribe(res => {
            if (res) {

              this.costlists = res.result;

            }
          }, error => {
            this.costlists = [];
          });
    }
    getuserList(){
        this.masterService.getUserList().subscribe(
            res =>{
                ////console.log("res",res);
                this.userList = res
            }
        )
    }


    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    onClikcAccountEnter(event){
        this.genericGridACListParty.show();
    }

    dropListItem = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
            this.masterService.getAllAccountList().map(data => {
                this.result = data.result;
                return this.result.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
            }
            ).subscribe(res => { observer.next(res); })
        }).share();
    }
    onEnterAcnameChange(event){

    }
    itemChanged(value:any){
        if (typeof (value) === "object") {
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME = value.ACNAME;
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACID = value.ACID;

        }
    }



    public DialogClosedResult(res) {
        this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV = (this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV== null || this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV == "") ? "%" : this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV;

       let multipleReportFormateName = '';
       if(this._reportFilterService.VoucherRegisterObj.REPORT_TYPE == 0){
           multipleReportFormateName = 'vat register report'
       }else{
           multipleReportFormateName = 'vat register report_1'
       }

       if(this._reportFilterService.VoucherRegisterObj.FROM_VNO == null ||
          this._reportFilterService.VoucherRegisterObj.FROM_VNO == "" ||
          this._reportFilterService.VoucherRegisterObj.FROM_VNO === undefined
        ){
            this._reportFilterService.VoucherRegisterObj.FROM_VNO = 0;
        }

        if(this._reportFilterService.VoucherRegisterObj.TO_VNO == null ||
            this._reportFilterService.VoucherRegisterObj.TO_VNO == "" ||
            this._reportFilterService.VoucherRegisterObj.TO_VNO === undefined
          ){
              this._reportFilterService.VoucherRegisterObj.TO_VNO = 0;
          }

          if(this._reportFilterService.VoucherRegisterObj.REPORTMODEVR == 0){
            this._reportFilterService.VoucherRegisterObj.FROM_VNO = 0;
            this._reportFilterService.VoucherRegisterObj.TO_VNO = 0;
          }

          if (this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV && this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV == '%') {
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV && this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIVISIONNAME = '';
          }
    
          if (this._reportFilterService.VoucherRegisterObj.CCENTER && this._reportFilterService.VoucherRegisterObj.CCENTER == '%') {
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_COSTCENTERDISPLAYNAME = 'All';
          }
          else if (this._reportFilterService.VoucherRegisterObj.CCENTER != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.VoucherRegisterObj.CCENTER);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.VoucherRegisterObj.VoucherRegister_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.VoucherRegisterObj.VoucherRegister_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_COSTCENTERDISPLAYNAME = '';
          }

          if (this._reportFilterService.VoucherRegisterObj.VTYPE && this._reportFilterService.VoucherRegisterObj.VTYPE == '%') {
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_VTYPEDISPLAYNAME = 'All';
          }else if( this._reportFilterService.VoucherRegisterObj.VTYPE && this._reportFilterService.VoucherRegisterObj.VTYPE!= '%'){
            let abc = this.voucherTypeList.filter(x=>x.VOUCHER_ID == this._reportFilterService.VoucherRegisterObj.VTYPE);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_VTYPEDISPLAYNAME = abc[0].VOUCHER_NAME;
              }else{
                this._reportFilterService.VoucherRegisterObj.VoucherRegister_VTYPEDISPLAYNAME = '';
              }
          }else{
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_VTYPEDISPLAYNAME = '';
          }

          if(res == "ok"){
          this._reportFilterService.VoucherRegisterObj.assignPrevioiusDate = true;
          let routepaths = this.arouter.url.split('/');
          let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.VoucherReg_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Voucher Register Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.VoucherReg_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Voucher Register Report'+'_'+this._reportFilterService.VoucherReg_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.VoucherReg_loadedTimes,
                });
            }

          }

          if(this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME == ''){
            this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACID ='%';
          }

        this.reportdataEmit.emit({
            status: res, data: {
                reportname: multipleReportFormateName,
                REPORTDISPLAYNAME : 'Voucher Register',
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.VoucherReg_loadedTimes,
                reportparam: {
                  VTYPEDISPLAYNAME: this._reportFilterService.VoucherRegisterObj.VoucherRegister_VTYPEDISPLAYNAME?this._reportFilterService.VoucherRegisterObj.VoucherRegister_VTYPEDISPLAYNAME:'',
                    DATE1: this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE1,
                    DATE2: this._reportFilterService.VoucherRegisterObj.VoucherRegister_DATE2,
                    BSDATE1: this._reportFilterService.VoucherRegisterObj.VoucherRegister_BSDATE1,
                    BSDATE2: this._reportFilterService.VoucherRegisterObj.VoucherRegister_BSDATE2,
                    DIV: this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIV,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    CostCenter: this._reportFilterService.VoucherRegisterObj.CCENTER,
                    REPORT_MODE: this._reportFilterService.VoucherRegisterObj.REPORTMODEVR,
                    FROM_VNO : this._reportFilterService.VoucherRegisterObj.FROM_VNO,
                    TO_VNO : this._reportFilterService.VoucherRegisterObj.TO_VNO,
                    VTYPE : this._reportFilterService.VoucherRegisterObj.VTYPE?this._reportFilterService.VoucherRegisterObj.VTYPE:'%',
                    REPORT_TYPE: this._reportFilterService.VoucherRegisterObj.REPORT_TYPE,
                    USER  : this._reportFilterService.VoucherRegisterObj.USER,
                    ACID : this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACID,
                    ACNAME:this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME,
                    DIVISIONNAME : this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIVISIONNAME ? this._reportFilterService.VoucherRegisterObj.VoucherRegister_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.VoucherRegisterObj.VoucherRegister_COSTCENTERDISPLAYNAME?this._reportFilterService.VoucherRegisterObj.VoucherRegister_COSTCENTERDISPLAYNAME:'',
                    ACCOUNTDISPLAYNAME: this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME?this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME:'',
                    USERDISPLAYNAME: this._reportFilterService.VoucherRegisterObj.USER?this._reportFilterService.VoucherRegisterObj.USER:''
                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.VoucherReg_loadedTimes = this._reportFilterService.VoucherReg_loadedTimes+1;
        }
    }


    AccountEnterClicked() {
        this.gridPopupSettingsForAccountList = this.masterService.getGenericGridPopUpSettings('AllAcountList');
        this.genericGridAccountList.show();
    }

    dblClickAccountSelect(account) {
        this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACID  = account.ACID;
        this._reportFilterService.VoucherRegisterObj.VoucherRegister_ACCNAME = account.ACNAME;
    }

}

