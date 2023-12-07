import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import * as moment from 'moment';
import { LatePost, LatePostGrid, LatePostObj } from "../../../../common/interfaces/Latepost.interface";
import { PREFIX, VoucherTypeEnum } from "../../../../common/interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
// import { EnableLatePostService } from "./EnableLatePost.service";

@Component({
  selector: "LatePost",
  templateUrl: "./LatePost.component.html",
  providers: [TransactionService],
  // styleUrls: ["../../../modal-style.css"]
})

export class LatePostComponent {

  Date: any = <any>{};
  LObj: LatePost = <LatePost>{};
  voucherList: LatePostGrid[];
  prefixessubject: BehaviorSubject<PREFIX[]> = new BehaviorSubject([]);
  prefixesObservable$: Observable<PREFIX[]> = this.prefixessubject.asObservable();
  public activeurlpath: string;

  @ViewChild("genericGridACList")
  genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  
  voucherType: VoucherTypeEnum;
  constructor(
    private _trnMainService: TransactionService,
    private masterService: MasterRepo,
    private setting: SettingService,
    private _activatedRoute: ActivatedRoute,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService,
    private router: Router,
    private arouter: ActivatedRoute,
    // private _enableLatePostService : EnableLatePostService
  ) {
    // this.activeurlpath = arouter.snapshot.url[0].path;
    if(this._trnMainService.userSetting.EnableLatePost == 1){
      this.LObj.VTYPE = 'JV';
      this.voucherType = 12;
    }else{
      if(this._trnMainService.userSetting.ENABLELATEPOSTINPURCHASE == 1){
        this.LObj.VTYPE = 'PI';
        this.voucherType = 3;
      }
    }
    this.LoadVoucherPrefix(this.voucherType)

  }

  ngOnInit() {
    document.getElementById("L_FromDate").focus();
    this.LoadVoucherPrefix(this.voucherType)
    this.Date.FDate=new Date().toJSON().split('T')[0];
    this.ChangeDate( this.Date.FDate,"AD",'FromAD')
    this.Date.TDate=new Date().toJSON().split('T')[0];
    this.ChangeDate( this.Date.TDate,"AD",'FromAD')
  }

  ChangeDate(value, format: string, DName) {
    ////console.log("CheckDate", value, format, DName)

    var adbs = require("ad-bs-converter");
    var newDate;
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        var DateValue = newDate = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        DName == 'FromAD' ? this.Date.BS_FDate = DateValue : this.Date.BS_TDate = DateValue;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      var DateValue = newDate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      DName == "FromBS" ? this.Date.FDate = DateValue : this.Date.TDate = DateValue;
    }
    this.ValidateBSDATE(newDate, "DATE3", "TRNDATE");
  }

  ChangeDate1(value, format: string, DName) {
    ////console.log("CheckDate", value, format, DName)

    var adbs = require("ad-bs-converter");
    var newDate;
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        var DateValue = newDate = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        DName == 'ToAD' ? this.Date.BS_TDate = DateValue : this.Date.BS_TDate = DateValue;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      var DateValue = newDate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      DName == "BS" ? this.Date.TDate = DateValue : this.Date.TDate = DateValue;
    }
    this.ValidateBSDATE(newDate, "DATE3", "TRNDATE");
  }


  ValidateBSDATE(value, date, dateType) {
    return;

  }
  OnLoadClick() {
    if(this.Date.FDate == "" ||this.Date.FDate == null || this.Date.FDate == undefined || this.Date.TDate== ""||
    this.Date.TDate== null || this.Date.TDate== undefined  ){
      this._alertService.warning("Please Select the date");
      return;
    }
    this._loadingSerive.show("getting data please wait..")
    this.LObj.DATE1 = this.Date.FDate;
    this.LObj.DATE2 = this.Date.TDate;
    this.LObj.PhiscalID = this.masterService.PhiscalObj.phiscalID;
    this.LObj.DIV = this.masterService.PhiscalObj.DIVISION;
    if(this.LObj.ACID == "" || this.LObj.ACID == null || this.LObj.ACID == undefined){
      this.LObj.ACID = '%';
    }
    if(this.LObj.VSERIES == "" || this.LObj.VSERIES == null || this.LObj.VSERIES == undefined){
      this.LObj.VSERIES = '%';
    }
    if(this.LObj.VTYPE == "" || this.LObj.VTYPE == null || this.LObj.VTYPE == undefined){
      this.LObj.VTYPE = '%';
    }
    this.masterService.LoadData(this.LObj).subscribe(x => {
      if (x.status == 'ok') {
        this.voucherList = x.result
        this._loadingSerive.hide()
        for (let i of this.voucherList) {
          i.isCheck = false;
          if (i.VOUCHERNO != null) {
            i.isShowCheck = true
          }

        }
      }
    })
  }
  LatePostSaveObj: LatePostObj = <LatePostObj>{}
  SaveClick() {
    this._loadingSerive.show("saving data please wait...")
    this.LatePostSaveObj.PostList = this.voucherList.filter(x => x.isCheck == true);
    let bodydata = { data: this.LatePostSaveObj }
    this.masterService.saveVoucherLatePost(bodydata).subscribe(x => {
      if (x.status == "ok") {
        this._loadingSerive.hide()
        this.OnLoadClick();
      } else {

      }
    }, error => {
      // ////console.log("@@error",error)
    })
  }
  Reset() {
    this.voucherList = [];
    this.LObj.VTYPE= '';
    this.LObj.VSERIES= '';
    this.ac_name= '';
    this.Date.FDate = new Date().toJSON().split('T')[0];
    this.Date.TDate = new Date().toJSON().split('T')[0];
    
  }
  
  VTypeChange(value) {
    if (value == 'JV') {
      this.voucherType = 12;
    }
    else if (value == 'CV') {
      this.voucherType = 62;
    }
    else if (value == 'PV') {
      this.voucherType = 17;
    }
    else if (value == 'RV') {
      this.voucherType = 18;
    }
    else if (value == 'CP') {
      this.voucherType = 64;
    }
    else if(value =='PI'){
      this.voucherType=3
    }
    else {
      // this._alertService.warning("Cannot detect selected value!");
    }
   this.LoadVoucherPrefix( this.voucherType)
  }

  LoadVoucherPrefix(voucherType){
    this.LatePostSaveObj.VOUCHERTYPE=voucherType;
    console.log("@@LoadVoucherPrefix",voucherType)
    this.masterService.getVoucherType(voucherType).subscribe((data) => {
      this.prefixessubject.next(<PREFIX[]>data);
    }, error => { });
  }
  showAcList(i) {
    
    // var TRNMODE = 'SinglePayment_Party';
    var TRNMODE = 'ALL';
    this.gridACListPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "ACID",
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

    this.genericGridACList.show();


  }
  ac_name:any;
  onAcSelect(acItem) {
    
    this.ac_name= acItem.ACNAME;
    this.LObj.ACID = acItem.ACID;
    
  }

  drillDown(event){
  //console.log("inside the dblclick", event);
  // let arr = event.VOUCHERNO.split("-");
  // let phiscalID = arr[2];
  //console.log("phiscal idf", phiscalID);

  let VoucherPrefix = event.VOUCHERNO.substring(0,2);

  if (VoucherPrefix == 'PI') {
    this.masterService.getPclandCNDNmode(VoucherPrefix, event.VOUCHERNO).subscribe((res) => {
      if (res.result && res.result[0].CNDN_MODE == 1) {
      } else {
        if (res.result && res.result[0].PCL == 'pc001') {
          this.masterService.PCL_VALUE = 1;
        } else if (res.result && res.result[0].PCL == 'pc002') {
          this.masterService.PCL_VALUE = 2;
        }
        else{
          this.masterService.PCL_VALUE = 2;
        }
      }
    }, err => {

    }, () => {
      this.drilltovouchers(event,VoucherPrefix);
    })
  } else {
    this.drilltovouchers(event,VoucherPrefix);
  }


  // alert("Latpeost_dblclick")   
  }

  drilltovouchers(event,VoucherPrefix){
    let arr = event.VOUCHERNO.split("-");
    let phiscalID = arr[2];
    switch(VoucherPrefix){
      case 'JV':
        this.router.navigate(
          ['/pages/account/acvouchers/journal-voucher'],
          {
          queryParams: {
            mode:"fromLatepost",
            voucher:event.VOUCHERNO,
            DIVISION: event.DIVISION,
            PHISCALID: phiscalID
            
          }
          }
        );
  
        break;
  
      case  'CP':
        this.router.navigate(
          ['/pages/account/acvouchers/capital-voucher'],
          {
          queryParams: {
            mode:"fromLatepost",
            voucher:event.VOUCHERNO,
            DIVISION: event.DIVISION,
            PHISCALID: phiscalID
            
          }
          }
        );
         break;
  
         case  'CV':
          this.router.navigate(
            ['/pages/account/acvouchers/contra-voucher'],
            {
            queryParams: {
              mode:"fromLatepost",
              voucher:event.VOUCHERNO,
              DIVISION: event.DIVISION,
              PHISCALID: phiscalID
              
            }
            }
          );
           break;
          
        case  'AD':
            this.router.navigate(
              ['/pages/account/acvouchers/additional-cost'],
              {
              queryParams: {
                mode:"fromLatepost",
                voucher:event.VOUCHERNO,
                DIVISION: event.DIVISION,
                PHISCALID: phiscalID
                
              }
              }
            );
             break;
             case  'RV':
              this.router.navigate(
                ['/pages/account/acvouchers/income-voucher'],
                {
                queryParams: {
                  mode:"fromLatepost",
                  voucher:event.VOUCHERNO,
                  DIVISION: event.DIVISION,
                  PHISCALID: phiscalID
                  
                }
                }
              );
               break;
               case  'PV':
                this.router.navigate(
                  ['/pages/account/acvouchers/expense-voucher'],
                  {
                  queryParams: {
                    mode:"fromLatepost",
                    voucher:event.VOUCHERNO,
                    DIVISION: event.DIVISION,
                    PHISCALID: phiscalID
                    
                  }
                  }
                );
                 break;
                 case 'PI':
                  this.router.navigate(
                    ['/pages/account/purchases/add-purchase-invoice'],
                    {
                    queryParams: {
                      mode:"fromLatepost",
                      voucher:event.VOUCHERNO,
                      DIVISION: event.DIVISION,
                      PHISCALID: phiscalID,
                      pcl: this.masterService.PCL_VALUE
                    }
                    }
                  );
            
                  break;
      default:
        return;
    }
  }
}
