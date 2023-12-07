import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { AuthService } from '../../../common/services/permission/authService.service';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { Division } from '../../../common/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import * as moment from 'moment';

export interface DialogInfo {
    header: string;
    message: Observable<string>;
}

@Component({
    selector: 'day-book-report',
    templateUrl: './day-book-report.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"],
})

export class DayBookReport implements OnInit{
    ReportParameters: any = <any>{};
    voucherTypeList: any[] = [];
    userList:any[] = [];
    division: any[] = [];
    instanceWiseRepName:string='Day Book Report';
    showVoucherTable:boolean;
    result: any;
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,private _authService: AuthService,private alertService: AlertService,
        private _reportFilterService:ReportMainService, private arouter: Router, public _ActivatedRoute: ActivatedRoute,
        public dialogref: MdDialogRef<DayBookReport>,public reportService: ReportFilterService,
        @Inject(MD_DIALOG_DATA) public data: DialogInfo) {

        this.getVoucherType();
        this.getuserList();

        this._reportFilterService.DayBookObj.Reportnameis = 'daybookreport';


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
          const mode = params.mode;
          if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname=='Day Book Report_1') {
            // //console.log("@@daybook",this.reportService.drillParam)
            this._reportFilterService.DayBookObj.DayBook_DATE1=moment(this.reportService.drillParam.reportparam.DATE1).format('YYYY-MM-DD');
            this._reportFilterService.DayBookObj.DayBook_DATE2=moment(this.reportService.drillParam.reportparam.DATE2).format('YYYY-MM-DD');
            this._reportFilterService.DayBookObj.DayBook_BSDATE1=this.reportService.drillParam.reportparam.BSDATE1;
            this._reportFilterService.DayBookObj.DayBook_BSDATE2=this.reportService.drillParam.reportparam.BSDATE2;
            this._reportFilterService.DayBookObj.DayBook_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.DayBookObj.DayBook_DETAILREPORT=this.reportService.drillParam.reportparam.DETAILREPORT;
            this._reportFilterService.DayBookObj.USER=this.reportService.drillParam.reportparam.USR;
            this._reportFilterService.DayBookObj.DayBook_VTYPE=this.reportService.drillParam.reportparam.VTYPE;
          }else{
            if(this._reportFilterService.DayBookObj.assignPrevioiusDate != true){
              this.masterService.getAccDivList();
                this._reportFilterService.DayBookObj.DayBook_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
            if (this.masterService.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                    this._reportFilterService.DayBookObj.DayBook_DATE2 = new Date().toJSON().split('T')[0];
                    this.changeEndDate(this._reportFilterService.DayBookObj.DayBook_DATE2, "AD");
                  }
                  else {

                this._reportFilterService.DayBookObj.DayBook_DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
                        this.changeEndDate(this._reportFilterService.DayBookObj.DayBook_DATE2, "AD");


                }
                // this._reportFilterService.DayBookObj.DayBook_DATE2 = new Date().toJSON().split('T')[0];
                // this._reportFilterService.DayBookObj.DayBook_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                this.masterService.viewDivision.subscribe(() => {
                  if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                    this._reportFilterService.DayBookObj.DayBook_DIV='%';
                }else{
                  if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                    this._reportFilterService.DayBookObj.DayBook_DIV=this.division[0].INITIAL;
                  }else{
                    this._reportFilterService.DayBookObj.DayBook_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                  }
                }
                })
                this._reportFilterService.DayBookObj.DayBook_DETAILREPORT = '0';
                this._reportFilterService.DayBookObj.DayBook_VTYPE="%";
                this._reportFilterService.DayBookObj.SHOWCASEOPENINGCLOSINGBL=0;
                this._reportFilterService.DayBookObj.Daybook_MultipleVoucher = [];
            }

            if(params.instancename){
                // ////console.log("@@[day book Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                this._reportFilterService.DayBookObj.DayBook_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                this._reportFilterService.DayBookObj.DayBook_DATE2=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE2;
                this._reportFilterService.DayBookObj.DayBook_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                this._reportFilterService.DayBookObj.DayBook_DETAILREPORT=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DETAILREPORT;
                this._reportFilterService.DayBookObj.USER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.USR;
                this._reportFilterService.DayBookObj.DayBook_VTYPE=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.VTYPE;
                this._reportFilterService.DayBookObj.Daybook_FROM_VNO=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.FROM_VNO;
                this._reportFilterService.DayBookObj.Daybook_TO_VNO = this._reportFilterService.reportDataStore[params.instancename].param.reportparam.TO_VNO;
            }



        this.changeEntryDate(this._reportFilterService.DayBookObj.DayBook_DATE1, "AD");
        this.changeEndDate(this._reportFilterService.DayBookObj.DayBook_DATE2, "AD");

    }
   });
   if(this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.length>0){
    this.showVoucherTable=true;
   }
}

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.DayBookObj.DayBook_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
              this._reportFilterService.DayBookObj.DayBook_DATE1 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.DayBookObj.DayBook_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.DayBookObj.DayBook_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
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
                  this._reportFilterService.DayBookObj.DayBook_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
            // this._reportFilterService.DayBookObj.DayBook_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
      if(Number(this._reportFilterService.DayBookObj.Daybook_FROM_VNO) > Number(this._reportFilterService.DayBookObj.Daybook_TO_VNO)){
        this.alertService.info("Starting Voucher No is Greater Than Ending Voucher No!");
        return;
            }else{
                this.DialogClosedResult("ok");

            }

    }

    getVoucherType(){
        this.masterService.getAllVoucherType().subscribe(
            (res) =>{
              // console.log("@@@RES",res);
                this.voucherTypeList.push(res);
            }
        )
    }

    getuserList(){
        this.masterService.getUserList().subscribe(
            res =>{
                this.userList = res
                //console.log(this.userList,"userlist")
            }
        )
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
      let multipleVouchers = [];
        // let SelectedGroupACC = '';
        this._reportFilterService.SelectedVouchers='';
        if (this._reportFilterService.DayBookObj.Daybook_MultipleVoucher === undefined ||this._reportFilterService.DayBookObj.Daybook_MultipleVoucher === null || (this._reportFilterService.DayBookObj.Daybook_MultipleVoucher && this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.length==0)) {
            this._reportFilterService.SelectedVouchers = this._reportFilterService.DayBookObj.DayBook_VTYPE;
        } else {
            if (this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.length != 0) {
                this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.forEach(vcList => {
                  multipleVouchers.push(vcList.VOUCHER_ID)
                    this._reportFilterService.SelectedVouchers += `${multipleVouchers},`
                });
                // var nameArr = this._reportFilterService.SelectedVouchers.split(',');
                // var myArr = nameArr;
                // let item = myArr.filter((el, i, a) => i === a.indexOf(el))
                // ////console.log("@@item",item)
                // this._reportFilterService.SelectedVouchers= item.toString();
            } else {
                this._reportFilterService.SelectedVouchers = '%';
            }
        }
        this._reportFilterService.DayBookObj.DayBook_DIV = (this._reportFilterService.DayBookObj.DayBook_DIV== null || this._reportFilterService.DayBookObj.DayBook_DIV == "") ? "%" : this._reportFilterService.DayBookObj.DayBook_DIV;

       let multipleReportFormateName = '';
       if(this._reportFilterService.DayBookObj.DayBook_DETAILREPORT == "0"){
           multipleReportFormateName = 'Day Book Report'
       }else{
           multipleReportFormateName = 'Day Book Report_1'
       }

       if(this._reportFilterService.DayBookObj.Daybook_FROM_VNO == null ||
        this._reportFilterService.DayBookObj.Daybook_FROM_VNO === undefined
      ){
          this._reportFilterService.DayBookObj.Daybook_FROM_VNO = 0;
      }

      if(this._reportFilterService.DayBookObj.Daybook_TO_VNO == null ||
        this._reportFilterService.DayBookObj.Daybook_TO_VNO === undefined
      ){
          this._reportFilterService.DayBookObj.Daybook_TO_VNO = 0;
      }


       
       if (this._reportFilterService.DayBookObj.DayBook_DIV && this._reportFilterService.DayBookObj.DayBook_DIV == '%') {
        this._reportFilterService.DayBookObj.DayBook_DIVISIONNAME = 'All';
      }else if( this._reportFilterService.DayBookObj.DayBook_DIV && this._reportFilterService.DayBookObj.DayBook_DIV!= '%'){
        let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.DayBookObj.DayBook_DIV);
          if(abc && abc.length>0 && abc[0]){
            this._reportFilterService.DayBookObj.DayBook_DIVISIONNAME = abc[0].NAME;
          }else{
            this._reportFilterService.DayBookObj.DayBook_DIVISIONNAME = '';
          }
      }else{
        this._reportFilterService.DayBookObj.DayBook_DIVISIONNAME = '';
      }

      if (this._reportFilterService.DayBookObj.DayBook_VTYPE && this._reportFilterService.DayBookObj.DayBook_VTYPE == '%') {
        this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME = 'All';
      }else if( this._reportFilterService.DayBookObj.DayBook_VTYPE && this._reportFilterService.DayBookObj.DayBook_VTYPE!= '%'){
        if(this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.length==0){
          let abc = this.voucherTypeList.filter(x=>x.VOUCHER_ID == this._reportFilterService.DayBookObj.DayBook_VTYPE);
          if(abc && abc.length>0 && abc[0]){
            this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME = abc[0].VOUCHER_NAME;
          }else{
            this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME = '';
          }
        }else{
          this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME = '';
        }  
      }else{
        this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME = '';
      }

       if(res == "ok"){
       this._reportFilterService.DayBookObj.assignPrevioiusDate = true;
       let routepaths = this.arouter.url.split('/');
        let activeurlpath2;
              if(routepaths&& routepaths.length){
                activeurlpath2=routepaths[routepaths.length-1]
              }

              if(this._reportFilterService.DayBook_loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Day Book Report',
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.DayBook_loadedTimes,
                });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {reportname: 'Day Book Report'+'_'+this._reportFilterService.DayBook_loadedTimes,
                    activeurlpath: this.arouter.url,
                    activerurlpath2: activeurlpath2,
                    instanceWiseRepName:this.instanceWiseRepName +this._reportFilterService.DayBook_loadedTimes,
                });
            }

       }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Day Book Report',
                reportname: multipleReportFormateName,
                instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.DayBook_loadedTimes,
                reportparam: {
                  VTYPEDISPLAYNAME: this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME?this._reportFilterService.DayBookObj.DayBook_VTYPEDISPLAYNAME:'',
                    DATE1: this._reportFilterService.DayBookObj.DayBook_DATE1,
                    DATE2: this._reportFilterService.DayBookObj.DayBook_DATE2,
                    BSDATE1: this._reportFilterService.DayBookObj.DayBook_BSDATE1,
                    BSDATE2: this._reportFilterService.DayBookObj.DayBook_BSDATE2,
                    DIV: this._reportFilterService.DayBookObj.DayBook_DIV,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    VTYPE : this._reportFilterService.SelectedVouchers?this._reportFilterService.SelectedVouchers:'%',
                    DETAILREPORT: this._reportFilterService.DayBookObj.DayBook_DETAILREPORT,
                    USR  : this._reportFilterService.DayBookObj.USER?this._reportFilterService.DayBookObj.USER:'%',
                    DIVISIONNAME : this._reportFilterService.DayBookObj.DayBook_DIVISIONNAME ? this._reportFilterService.DayBookObj.DayBook_DIVISIONNAME : '',
                    USERDISPLAYNAME: this._reportFilterService.DayBookObj.USER?this._reportFilterService.DayBookObj.USER:'',
                    SHOWCASEOPENINGCLOSINGBL: this._reportFilterService.DayBookObj.SHOWCASEOPENINGCLOSINGBL?this._reportFilterService.DayBookObj.SHOWCASEOPENINGCLOSINGBL:0,
                    VCHR1 : this._reportFilterService.DayBookObj.Daybook_FROM_VNO ? this._reportFilterService.DayBookObj.Daybook_FROM_VNO:0,
                    VCHR2 : this._reportFilterService.DayBookObj.Daybook_TO_VNO ? this._reportFilterService.DayBookObj.Daybook_TO_VNO:0,
                }
            }
        });

        if(res == "ok"){
            this._reportFilterService.DayBook_loadedTimes = this._reportFilterService.DayBook_loadedTimes+1;
        }
    }

    OnVoucherSelect(){
      this.showVoucherTable = true;
      if(this._reportFilterService.DayBookObj.DayBook_VTYPE == 'All' || this._reportFilterService.DayBookObj.DayBook_VTYPE == '%'  ){
        this.showVoucherTable = false;
        this._reportFilterService.DayBookObj.Daybook_MultipleVoucher=[];
      }
      let vouchername=this.voucherTypeList.filter(x=>x.VOUCHER_ID==this._reportFilterService.DayBookObj.DayBook_VTYPE);
      // console.log("@@vouchername",vouchername)
      if(vouchername.length>0){
        this._reportFilterService.DayBookObj.DayBook_VTYPENAME=vouchername[0].VOUCHER_NAME;
      }
    }

    addVoucherList(){

      let selectACList = this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.filter(vcList => vcList.VOUCHER_ID == this._reportFilterService.DayBookObj.DayBook_VTYPE)
        if (
            this._reportFilterService.DayBookObj.DayBook_VTYPE === "" ||
            this._reportFilterService.DayBookObj.DayBook_VTYPE === null ||
            this._reportFilterService.DayBookObj.DayBook_VTYPE === undefined
        ) {
            return;
        }

        if (selectACList.length === 0) {
          this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.push({ VOUCHER_ID: this._reportFilterService.DayBookObj.DayBook_VTYPE, VOUCHER_NAME: this._reportFilterService.DayBookObj.DayBook_VTYPENAME })
          
        }
    }

    deleteVoucher(index){
      this._reportFilterService.DayBookObj.Daybook_MultipleVoucher.splice(index, 1);
        this._reportFilterService.SelectedVouchers='';
    }

}

