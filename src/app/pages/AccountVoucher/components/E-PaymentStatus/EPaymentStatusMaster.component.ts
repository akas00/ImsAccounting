import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import * as moment from 'moment';
import { LatePost, LatePostGrid, LatePostObj } from "../../../../common/interfaces/Latepost.interface";
import { PREFIX, VoucherTypeEnum } from "../../../../common/interfaces";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { AuthService } from "../../../../common/services/permission";
// import { EnableLatePostService } from "./EnableLatePost.service";

@Component({
  selector: "EPaymentStatusMaster",
  templateUrl: "./EPaymentStatusMaster.component.html",
  providers: [TransactionService],
  // styleUrls: ["../../../modal-style.css"]
})

export class EPaymentStatusMasterComponent {

  Date: any = <any>{};
  LObj: LatePost = <LatePost>{};
  voucherList: LatePostGrid[]=[];
  prefixessubject: BehaviorSubject<PREFIX[]> = new BehaviorSubject([]);
  prefixesObservable$: Observable<PREFIX[]> = this.prefixessubject.asObservable();

  @ViewChild("genericGridACList")
  genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  voucherType: VoucherTypeEnum;
  userSetting: any;
  userProfile: any;
  returnUrl: string;

  constructor(
    private _trnMainService: TransactionService,
    private masterService: MasterRepo,
    private setting: SettingService,
    private _activatedRoute: ActivatedRoute,
    private _loadingSerive: SpinnerService,
    private _alertService: AlertService,
    private _authService: AuthService
    // private _enableLatePostService : EnableLatePostService
  ) {
    this.userSetting = this._authService.getSetting();
    this.userProfile = this._authService.getUserProfile();
    this.voucherList = [];
  }

  ngOnInit() {
    document.getElementById("L_FromDate").focus();
    if (this._activatedRoute.snapshot['_routerState'].url) {
      this.returnUrl = this._activatedRoute.snapshot['_routerState'].url;
  }

    this.LObj.VTYPE = "JOURNAL VOUCHER";
    this.voucherType = 12;
    this.LoadVoucherPrefix(this.voucherType)

    this.Date.FDate=this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.ChangeDate(this.Date.FDate, "AD","FromAD");
   
    this.Date.TDate=this.masterService.PhiscalObj.EndDate.split('T')[0];
    this.ChangeDate1(this.Date.TDate, "AD","ToAD");
    this.startTimer();
  }
  ticks = 0;
  sub: Subscription;
  private startTimer() {
    try {
      
      let timer = Observable.timer(1, 1800000);
      this.sub = timer.subscribe(
        t => {
          
          this.ticks = t;
          this.OnLoadClick();
        }
      );
    } catch (ex) { }
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
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
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
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
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
    // this._loadingSerive.show("getting data please wait..")
    this.LObj.DATE1 = this.Date.FDate;
    this.LObj.DATE2 = this.Date.TDate;
    this.LObj.PhiscalID = this.masterService.PhiscalObj.phiscalID;
    this.LObj.DIV = this.masterService.PhiscalObj.DIVISION;
    this.masterService.LoadDataForEPayment(this.LObj).subscribe(x => {
      if (x.status == 'ok') {
        this.voucherList = x.result
        this._loadingSerive.hide()
        for (let i of this.voucherList) {
          // i.EPAYSTATUS = "PROCESSING"
          // //console.log("CheckLog",i)
          i.isCheck = false;
          i.NARATION = "";
          if (i.VOUCHERNO != null) {
            if (i.VOUCHERSTATUS == "Success") i.VOUCHERSTATUS = "SUCCESS";
            if (i.VOUCHERSTATUS == "User doesn't exists in system" ||
            i.VOUCHERSTATUS == "Your request could not be completed at this moment,  please try after sometime. Cellpay." ||
            i.VOUCHERSTATUS == "Failed")
            {i.NARATION = i.VOUCHERSTATUS}
            else{
              i.NARATION="";
            }
            if (i.VOUCHERSTATUS == "Fail" || i.VOUCHERSTATUS == "Failed" ||
            i.VOUCHERSTATUS == "Your request could not be completed at this moment,  please try after sometime. Cellpay." ||
            i.VOUCHERSTATUS == "User doesn't exists in system") i.VOUCHERSTATUS = "FAILED";
            if (i.VOUCHERSTATUS == null && i.ISCHECKED==1) i.VOUCHERSTATUS = "PENDING";
            if (i.VOUCHERSTATUS == null && i.ISCHECKED!=1) i.VOUCHERSTATUS = "New"

            //console.log("CHeckValue",i.VOUCHERSTATUS)
            if (i.VOUCHERSTATUS.toUpperCase() == "SUCCESS" || i.VOUCHERSTATUS.toUpperCase()  == "PENDING") {
              i.isShowCheck = false
            }
            else {
              i.isShowCheck = true
            }
            if(i.REFNO !=null){
              if(i.REFNO.startsWith('PV') && i.VOUCHERNO.startsWith('CX')){
                i.isShowCheck = false;
                i.NARATION = "This voucher is saved as "+ i.REFNO;
                i.VOUCHERSTATUS = "SUCCESS";
              }
            }
          }
          else{
            if (i.VOUCHERSTATUS == null) i.VOUCHERSTATUS = "empty"
          }

        }
      }
    })

  }
  LatePostSaveObj: LatePostObj = <LatePostObj>{}
  viaCellPayClick() {
    if (this.userProfile.CompanyInfo.NAME === null || this.userProfile.CompanyInfo.NAME == '' ||
    this.userProfile.CompanyInfo.NAME === undefined) {
      this._alertService.info("Company Name is Empty.");
      return;
    }

    // if (this.userSetting.MERCHANTBANKCODE === null || this.userSetting.MERCHANTBANKCODE == '' ||
    //   this.userSetting.MERCHANTBANKCODE === undefined) {
    //   this._alertService.info("Please set merchant bankcode.");
    //   return;
    // }

    // if (this.userSetting.MERCHANTBANKACCOUNTNO === null || this.userSetting.MERCHANTBANKACCOUNTNO == '' ||
    //   this.userSetting.MERCHANTBANKACCOUNTNO === undefined) {
    //   this._alertService.info("Please set merchant bankaccountnumber.");
    //   return;
    // }
    this.VerifyData()
  }
  stoppayment:boolean;
  VerifyData() {
    //console.log("merchantdataList",this.merchantdataList)
    this.merchantdataList.forEach(x => {
      if(this.merchantdataList.length > 1){
        this.merchantdataList.forEach(y => {
          x.MERCHANTBANKCODE == y.MERCHANTBANKCODE ? this.stoppayment=false : this.stoppayment=true;
        })
      }
    })
    if(this.stoppayment==true){
      this._alertService.info("Please send vouchers with same Bank Name");
      return;
    }
    //console.log("voucherList", this.voucherList)
    let count = 0;
    const dataList = [];
    
    var FilterValue = this.voucherList.filter(x => x.isCheck == true);
    if(FilterValue.length > 20){
      this._alertService.info("Please Select Only 20 Vouchers!");
      return;
    }
    var index = 0;
    for (let x of FilterValue) {
      //console.log("dataList00123",dataList)
      if (x.isCheck == true) {
        this.masterService.getEpaymentbankdetails(x.VOUCHERNO).subscribe(res => {
          let  dataObj: any = <any>{};
          dataObj.bankCode = res.result && res.result.BANKCODE;
          dataObj.fee = res.result2 && res.result2.FEE;
          dataObj.amount = res.result3 && res.result3.AMOUNT;
          dataObj.merchantName = x.ACCOUNTNAME;
          dataObj.merchantAccount = x.ChequeNo?x.ChequeNo:x.CHEQUENO;
          dataObj.description = res.result && res.result.NARATION?res.result.NARATION:"to Ask";
          dataObj.invoiceNumber = x.VOUCHERNO;
          dataList.push(dataObj);
          x.VOUCHERSTATUS = "PENDING"
          x.isShowCheck = false;

        },err => {

        },() => {
          if(dataList.length == FilterValue.length){
            this.getMerchantData(dataList,this.merchantdataList);
          }
        })
        // dataObj.merchantName = x.ACCOUNTNAME;
        // dataObj.merchantAccount = x.CHEQUENO;
        // dataObj.bankCode = this.voucherList[index+1].ACCODE;
        // dataObj.bankCode = "NIBL";
        // dataObj.amount = 600;
        // dataObj.description = "to Ask";
        // dataObj.fee = "5"; 
        // dataObj.invoiceNumber = x.VOUCHERNO;
        
        // dataList.push(dataObj);
        // x.VOUCHERSTATUS = "PENDING"
        // x.isShowCheck = false
        // dataObj.merchantName = "ASK company";
        // dataObj.merchantAccount = "001NIBLASK";
        // dataObj.bankCode = "NIBL";
        // dataObj.amount ="106",
        // dataObj.description = "to Ask",
        // dataObj.invoiceNumber = "005",
        
        // dataList.push(dataObj);
        // index ++;
      }
      index ++;
    }
    //console.log("dataList",dataList)





    // passObj.voucherId = "123";
    // passObj.invoiceNumber = "123";
    // passObj.isLive = "false";
    // passObj.returnUrl = "false";
    // //console.log("checkcheck",passObj, dataList)
    // return;
  }

  getMerchantData(dataList,merchantdataList) {
    //console.log("this.returnUrl",this.returnUrl)
    //console.log("merchantdataList1",merchantdataList)
    let passObj: any = <any>{};
    passObj.sender = this.userProfile.CompanyInfo.NAME?this.userProfile.CompanyInfo.NAME:"IMS-Software";
    passObj.bankCode = merchantdataList[0].MERCHANTBANKCODE?merchantdataList[0].MERCHANTBANKCODE:'NIBL';
    passObj.account = merchantdataList[0].MERCHANTBANKACCOUNTNO? merchantdataList[0].MERCHANTBANKACCOUNTNO:'001002003004';
    if(this.userSetting.ISCELLPAYLIVE == 1){
    passObj.isLive = "true";
    passObj.url ="https://sdk.cellpay.com.np/submitBulk";
    }else{
      passObj.isLive = "false";
      passObj.url ="https://test.shristi.co/sdktest/systemPaymentBulk";
    }
    passObj.voucherId = "1";
    // passObj.returnUrl = "https://cellpay.com.np/cpay";
    passObj.returnUrl = this.returnUrl;
    passObj.invoiceNumber = dataList && dataList[0].invoiceNumber?dataList[0].invoiceNumber:"CX1-MMX-77/78";

    this.BulkCellPay(passObj, dataList);

  }

  BulkCellPay(passObj, dataList) {


    var merchant_data = JSON.stringify(dataList);
    //console.log("merchant_data", merchant_data);
    //console.log("passObj", passObj);

    const form = document.createElement('form');
    form.method = "POST";
    form.target = "_blank"
    // form.action = "https://cellpay.com.np/cpay/submitBulk";
    // form.action = "https://sdk.cellpay.com.np/submitBulk";
    form.action = passObj.url?passObj.url:"https://sdk.cellpay.com.np/submitBulk";
    const hiddenField = document.createElement('input');
    hiddenField.type = 'text';
    hiddenField.name = "sender";
    hiddenField.value = passObj.sender;

    const hiddenField1 = document.createElement('input');
    hiddenField1.type = 'text';
    hiddenField1.name = "bankCode";
    hiddenField1.value = passObj.bankCode;

    const hiddenField2 = document.createElement('input');
    hiddenField2.type = 'text';
    hiddenField2.name = "account";
    hiddenField2.value = passObj.account;

    const hiddenField4 = document.createElement('input');
    hiddenField4.type = 'text';
    hiddenField4.name = "isLive";
    hiddenField4.value = passObj.isLive;

    const hiddenField3 = document.createElement('input');
    hiddenField3.type = 'text';
    hiddenField3.name = "voucherId";
    hiddenField3.value = passObj.voucherId;

    const hiddenField9 = document.createElement('input');
    hiddenField9.type = 'text';
    hiddenField9.name = "merchantData";
    hiddenField9.value = merchant_data;

    const hiddenField5 = document.createElement('input');
    hiddenField5.type = 'text';
    hiddenField5.name = "invoiceNumber";
    hiddenField5.value = passObj.invoiceNumber;

    const hiddenField6 = document.createElement('input');
    hiddenField6.type = 'text';
    hiddenField6.name = "returnUrl";
    // hiddenField6.value = "https://cellpay.com.np/cpay/";
    hiddenField6.value =  passObj.returnUrl;

    const hiddenField7 = document.createElement('input');
    hiddenField7.type = 'text';
    hiddenField7.name = "fee";
    hiddenField7.value = passObj.fee;


    form.appendChild(hiddenField);
    form.appendChild(hiddenField1);
    form.appendChild(hiddenField2);
    form.appendChild(hiddenField3);
    form.appendChild(hiddenField4);
    form.appendChild(hiddenField5);
    form.appendChild(hiddenField6);
    form.appendChild(hiddenField9);
    form.appendChild(hiddenField7);
    document.body.appendChild(form);
    form.submit();
  }
  SaveClick() {
    //console.log("voucherList", this.voucherList)
    return
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
  }

  VTypeChange(value) {
    if (value == 'JOURNAL VOUCHER') {
      this.voucherType = 12;
    }
    else if (value == 'CONTRA VOUCHER') {
      this.voucherType = 62;
    }
    else if (value == 'PAYMENT VOUCHER') {
      this.voucherType = 17;
    }
    else if (value == 'RECEIPT VOUCHER') {
      this.voucherType = 18;
    }
    else if (value == 'CAPITAL VOUCHER') {
      this.voucherType = 64;
    }
    else {
      this._alertService.warning("Cannot detect selected value!");
    }
    this.LoadVoucherPrefix(this.voucherType)
  }

  LoadVoucherPrefix(voucherType) {
    this.masterService.getVoucherType(voucherType).subscribe((data) => {
      this.prefixessubject.next(<PREFIX[]>data);
    }, error => { });
  }
  showAcList(i) {

    var TRNMODE = 'SinglePayment_Party';
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
  ac_name: any;
  onAcSelect(acItem) {

    this.ac_name = acItem.ACNAME;
    this.LObj.ACID = acItem.ACID;

  }

  merchantdataList = [];
  checkMerchantBankDetails() {
    var FilterValue = this.voucherList.filter(x => x.isCheck == true);
    //console.log("@@SelectVoucherNo",FilterValue.length)
    for (let x of FilterValue) {
      //console.log("merchantdataList0", this.merchantdataList)
      if (x.isCheck == true) {
        this.masterService.getEpaymentbankdetails(x.VOUCHERNO).subscribe(res => {
          let dataObj: any = <any>{};
          //console.log("res.result4", res.result4)
          dataObj.MERCHANTBANKCODE = res.result4 && res.result4.MERCHANTBANKCODE;
          dataObj.MERCHANTBANKNAME = res.result4 && res.result4.MERCHANTBANKNAME;
          dataObj.MERCHANTBANKACCOUNTNO = res.result4 && res.result4.MERCHANTBANKACCOUNTNO;
          this.merchantdataList.push(dataObj);
        }, err => { }, () => {
          this.merchantdataList.forEach(x => {
            if(this.merchantdataList.length > 1){
              this.merchantdataList.forEach(y => {
                x.MERCHANTBANKCODE == y.MERCHANTBANKCODE ? '' : this._alertService.info("Please send vouchers with same Bank Name");
              })
            }
          })
        })
      }
    }
    if(FilterValue.length > 20){
      this._alertService.info("Please Select Only 20 Vouchers!");
      return;
    }
  }

}
