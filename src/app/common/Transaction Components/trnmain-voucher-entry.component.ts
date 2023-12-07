import { Router, ActivatedRoute } from '@angular/router';
import { Component, ViewChild, ElementRef } from "@angular/core";
import { TSubLedger } from "./../interfaces/TrnMain";
import { SettingService } from "./../services/setting.service";
import { PREFIX } from "./../interfaces/Prefix.interface";
import { TAcList } from "./../interfaces/Account.interface";
import { Trntran, VoucherTypeEnum } from "./../interfaces/TrnMain";
import { FormBuilder } from "@angular/forms";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { IDivision } from "./../interfaces";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TransactionService } from "./transaction.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";

import { AlertService } from "../services/alert/alert.service";
import { AuthService } from '../services/permission/authService.service';
import * as moment from 'moment';
import { xorWith } from 'lodash';
import { ModalDirective } from 'ng2-bootstrap';
import { AdditionalCostService } from '../../pages/Purchases/components/AdditionalCost/addtionalCost.service';

@Component({
  selector: "trnmain-voucher-entry",
  templateUrl: "./trnmain-voucher-entry.component.html",
  styleUrls: ["../../pages/Style.css"]
})
export class TrnMainVoucherEntryComponent {
  @ViewChild("genericGridACListParty")
  genericGridACListParty: GenericPopUpComponent;
  gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("adEntryDate") _adEntryDate: ElementRef;
  @ViewChild("bsEntryDate") _bsEntryDate: ElementRef;
  @ViewChild("adTrnDate") _adTrnDate: ElementRef;
  @ViewChild("bsTrnDate") _bsTrnDate: ElementRef;
  @ViewChild("genericGridRefBillPopup")
  genericGridRefBillPopup: GenericPopUpComponent;
  genericRefBillPopupSetting : GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("gridSubLedgerSettingList")
  gridSubLedgerSettingList: GenericPopUpComponent;
  gridSubLedgerSetting: GenericPopUpSettings = new GenericPopUpSettings();

  TrnTranList: Trntran[] = [];
  divisionList: IDivision[] = [];
  voucherType: VoucherTypeEnum = VoucherTypeEnum.PaymentVoucher;
  accountList: TAcList[] = [];
  cashAndBankList: TAcList[] = [];
  Suppliers: TAcList[] = [];
  Customers: TAcList[] = [];
  cashList: TAcList[] = [];
  bankList: TAcList[] = [];
  acList: TAcList[] = [];
  trnaccountList: TAcList[] = [];
  subledgerDropDownList: TSubLedger[] = [];
  VoucherEntry: any = <any>{};
  EntryDate: any = <any>{};
  date1: any;
  date2: any;
  bsDate: any;
  prefix: PREFIX = <PREFIX>{};
  // TrnMainForm: FormGroup;
  viewMode = false;
  private subcriptions: Array<Subscription> = [];
  cashAccountSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<
    TAcList[]
  >([]);
  cashAccountObserver$: Observable<
    TAcList[]
  > = this.cashAccountSubject.asObservable();
  accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<
    TAcList[]
  >([]);
  accountListObersver$: Observable<
    TAcList[]
  > = this.accountListSubject.asObservable();

  noteType: string;
  isNote = false;
  isShowingDate = false;
  serverDate: any;
  chalanSeries: any;
  costlists = [];
  salesmanlist = [];
  userProfile: any;
  userSetting: any;
  errorOccurfromDate: boolean = false;
  dateChangeFormate: string;
  Div : string;
  activeurlpath:any;

  @ViewChild('BILLTO') _billTo: ElementRef;
  
  @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
  gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
  
  constructor(
    public masterService: MasterRepo,
    public router: Router,
    public alertService: AlertService,
    private _transactionService: TransactionService,
    private _authService: AuthService,
    private _AdditionalCostService: AdditionalCostService,
    private arouter: ActivatedRoute,
  ) {

    this.userProfile = this._authService.getUserProfile();
    this.userSetting = _authService.getSetting()
    // this.date1 = new Date();
    var y = this.masterService.PhiscalObj.BeginDate
    y = y.substring(0, 10);
    this.date2 = y;
    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
      this.date1 = new Date();
    }
    else {
      this.date1 = this.masterService.PhiscalObj.EndDate;
      this.date2 = this.masterService.PhiscalObj.BeginDate;;
    }

    const r = this.router.url;
    if (r === '/pages/account/acvouchers/debit-note') {
      this.noteType = 'CreditNote';
      this.isNote = true;
    } else if (r === '/pages/account/acvouchers/credit-note') {
      this.noteType = 'DebitNote';
      this.isNote = true;
    } else if (r === '/pages/account/account-opening-balance' || r === '/pages/account/party-opening-balance') {
      this.isShowingDate = true;
      this.getCurrentServerDate();
    }

    try {
      this.voucherType = this._transactionService.TrnMainObj.VoucherType;
      // ////console.log("WWW",this._transactionService.TrnMainObj.VoucherType)
      if (this.TrnTranList.length == 0) {
        var nulltt = <Trntran>{};
        nulltt.AccountItem = <TAcList>{};
        nulltt.ROWMODE = "new";
        this.TrnTranList.push(nulltt);
      }
      if (_transactionService.userSetting.enableCostCenter == 1) {
        this.masterService.getAllNEWCostCenter().subscribe(res => {
          if (res) {
            ////console.log("result", res)
            this.costlists.push(res);
            this.costlists = res.result;
            // _transactionService.TrnMainObj.COSTCENTER ='';

          }
        }, error => {
          this.costlists = [];
        });
      }
      if (_transactionService.userSetting.enableSalesman == 1) {
        this.masterService.getAllSalesmanList().subscribe(res => {
          if (res) {
            this.salesmanlist.push(res);
            this.salesmanlist = res.result;
            // _transactionService.TrnMainObj.COSTCENTER ='';

          }
        }, error => {
          this.salesmanlist = [];
        });
      }

      // this._transactionService.getCostCenterList();
      // this.costlists = this._transactionService.costlists;

      //this.hasCostCenter = this.settingService.appSetting.enableCostCenter;
      //this.hasCheque = this.settingService.appSetting.enableChequeInEntry;
      //this.enableACCodeFocus = this.settingService.appSetting.enableACCodeFocus;
      //this.enableACNameFocus = this.settingService.appSetting.enableACNameFocus;
      //this.masterService.refreshAccountList('Journal-constructor');
      this._transactionService.TrnMainObj.INVOICETYPE = "Regular";
      this.masterService
        .getAccount("IncomeVoucher")
        .map(data => {
          var fil = data.filter(ac => ac.MAPID == "C" || ac.MAPID == "B");
          return fil;
        })
        .subscribe((res: Array<TAcList>) => {
          this.cashAccountSubject.next(res);
        });
    } catch (ex) {
      alert(ex);
    }
  }




  ngOnInit() {
    ////console.log("VOUCHER TYPE", this._transactionService.TrnMainObj.VoucherType);
    this.arouter.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
        this,this._transactionService.TrnMainObj.Mode="VIEW";
      }
      })
    this._transactionService.TrnMainObj.CHALANNO = '';
    this.initDate();

    this._transactionService.viewDate.subscribe(
      (data) => {
        this.initDate();
      }
    )

    this._AdditionalCostService.viewDate.subscribe(
      (data) => {
        this.initDate();
      }
    )

    this.alertService.emitShowHideSubject.subscribe(
      (res) => {
        this.mangeFocusonDatefield();
      }
    )

    this._transactionService.changetrndate.subscribe(
      (data) => {
        this.changeTrndate();
      }
    )



    try {
      if (this._transactionService.TrnMainObj.Mode == "VIEW") {
        this.viewMode = true;

      }
      if (this._transactionService.TrnMainObj.Mode == "EDIT" || this._transactionService.TrnMainObj.Mode == "VIEW") {
        this._transactionService.loadDataObservable.subscribe(data => {
          try {
            this.VoucherTypeChangeEvent(data.TRNMODE);
          } catch (e) {
            alert(e);
          }
        });
      } else {
        if (this._transactionService.TrnMainObj.TRNMODE == "" || this._transactionService.TrnMainObj.TRNMODE == null) {
          if (this.voucherType == VoucherTypeEnum.ReceiveVoucher) {
            this._transactionService.TrnMainObj.TRNMODE = "Party Receipt";
            this.VoucherTypeChangeEvent("Party Receipt");
          } else if (this.voucherType == VoucherTypeEnum.PaymentVoucher) {
            this._transactionService.TrnMainObj.TRNMODE = "Party Payment";
            this.VoucherTypeChangeEvent("Party Payment");
          }
          else if (this.voucherType == VoucherTypeEnum.SinglePayment) {
            this._transactionService.TrnMainObj.TRNMODE = "Single Payment";
            this.VoucherTypeChangeEvent("Single Payment");
          }
          else {
            this.VoucherTypeChangeEvent("");
          }
        }

      }

      this.getChalanSeries();
      
    } catch (ex) {
      alert(ex);
    }
  }

  mangeFocusonDatefield() {
    if (this.errorOccurfromDate) {
      let elementObj = null;
      ////console.log("datechangeformat", this.dateChangeFormate);
      if (this.dateChangeFormate == 'DATE1BS') {
        elementObj = this._bsTrnDate;
        this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate(this.VoucherEntry.DATE1, 'AD');
      } else if (this.dateChangeFormate == 'DATE1AD') {
        elementObj = this._adTrnDate;
        this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate(this.VoucherEntry.DATE1, 'AD');
      } else if (this.dateChangeFormate == 'DATE3BS') {
        elementObj = this._bsEntryDate;
        this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate1(this.EntryDate.DATE3, 'AD');
      } else if (this.dateChangeFormate == 'DATE3AD') {
        elementObj = this._adEntryDate;
        // this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");  
        ////console.log("entry date", this.EntryDate.DATE3);

        this.EntryDate.DATE3 = new Date().toJSON().split('T')[0];
        this.changeEntryDate1(this.EntryDate.DATE3, 'AD');
      }

      if (elementObj != null) {
        setTimeout(() => {
          elementObj.nativeElement.focus();
        }, 2);
      }
    }
  }


  ngAfterViewInit() {
    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote) {
      if (this._transactionService.userSetting.enableCostCenter == 1) {
        document.getElementById("costcenter").focus();
      } else {
        if (this.userSetting.PrefixForRefNoInvEntry == 0) {
          document.getElementById("refno").focus();
        } else {
          document.getElementById("prefix").focus();
        }
      }
    }

  }


  setChalanNumber() {

  }

  getChalanSeries() {
    this._transactionService.TrnMainObj.CHALANNOPREFIX = '';

    const vType = this._transactionService.TrnMainObj.VoucherPrefix ? this._transactionService.TrnMainObj.VoucherPrefix : '';
    this.masterService.getAllChalanSeries(vType).subscribe((response: any) => {
      const res = response.json();
      if (res && res.status === 'ok' && res.result) {
        this.chalanSeries = res.result ? res.result : [];

      } else {
        this.chalanSeries = [];
      }
    }, error => {
      this.chalanSeries = [];
    });
  }
  getCurrentServerDate() {
    this.masterService.getCurrentDate().subscribe((res: any) => {
      this.serverDate = res && res.Date ? res.Date : new Date();
    }, err => { });
  }

  initDate() {
    //console.log("this.arouter.snapshot.url",this.arouter.snapshot)
    this.activeurlpath = this.arouter.snapshot.url[1] && this.arouter.snapshot.url[1].path ? this.arouter.snapshot.url[1].path : this.arouter.snapshot.url[0].path;

    if(this.activeurlpath == 'additional-cost'){
      this._transactionService.TrnMainObj.Mode = this.masterService.addnMode;
    }
    if (this._transactionService.TrnMainObj.Mode == 'NEW') {
      if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
        this._transactionService.TrnMainObj.TRNDATE = this.VoucherEntry.DATE1 = new Date().toJSON().split('T')[0]; // TRNDATE
        this._transactionService.TrnMainObj.TRN_DATE = this.EntryDate.DATE3 = new Date().toJSON().split('T')[0]; //TRN_DATE

        this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
        this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = new Date().toJSON().split('T')[0]; //TRNDATE
        this.changeEntryDate1(this.EntryDate.DATE3, "AD");
        this._transactionService.TrnMainObj.TRN_DATE = this.VoucherEntry.DATE = new Date().toJSON().split('T')[0]; //TRN_DATE
        this.changeEndDate(this.VoucherEntry.DATE, "AD");
        this.EntryDate.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate1(this.EntryDate.DATE2, "AD");
      }
      else {
        var x = this.masterService.PhiscalObj.EndDate;
        x = x.substring(0, 10);
        this._transactionService.TrnMainObj.TRNDATE = this.VoucherEntry.DATE1 = x; //TRNDATE
        this._transactionService.TrnMainObj.TRN_DATE = x; //TRN_DATE
        this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
        this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = x; //TRNDATE
        this.changeEntryDate1(this.EntryDate.DATE3, "AD");
        this._transactionService.TrnMainObj.TRN_DATE = this.VoucherEntry.DATE = x; //TRN_DATE
        this.changeEndDate(this.VoucherEntry.DATE, "AD");
        this.EntryDate.DATE2 = x;
        this.changeEndDate1(this.EntryDate.DATE2, "AD");
        ////console.log("ChecKEntrYDAte", this._transactionService.TrnMainObj.TRN_DATE)
      }
      this.EntryDate.PhiscalADDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
      this.changePhiscalDate(this.EntryDate.PhiscalADDate, "AD");

    } else {
      if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
        let trnDateForView ;
        let trn_DateForView
        if(this.activeurlpath == 'additional-cost'){
        trnDateForView=this.masterService.loadedTrnmain.TRNDATE; 
        trn_DateForView=this.masterService.loadedTrnmain.TRN_DATE;
        }else{
        trnDateForView= this._transactionService.TrnMainObj.TRNDATE;
        trn_DateForView= this._transactionService.TrnMainObj.TRN_DATE
        }

        this.EntryDate.DATE3 = moment(trnDateForView).format("YYYY-MM-DD");

        this.VoucherEntry.DATE1 = moment(trn_DateForView).format("YYYY-MM-DD");

        this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
        // this._transactionService.TrnMainObj.TRN_DATE =
        this.VoucherEntry.DATE = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.VoucherEntry.DATE, "AD");

        ////console.log("viewDATE3", this.EntryDate.DATE3);
        this.changeEntryDate1(this.EntryDate.DATE3, "AD");
        this.EntryDate.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate1(this.EntryDate.DATE2, "AD");
        // this._transactionService.TrnMainObj.TRNDATE = 
      } else {
        var x = this.masterService.PhiscalObj.EndDate
        x = x.substring(0, 10);
        let trnDateForView = this._transactionService.TrnMainObj.TRNDATE;
        let trn_DateForView = this._transactionService.TrnMainObj.TRN_DATE;

        this.EntryDate.DATE3 = moment(trnDateForView).format("YYYY-MM-DD");

        this.VoucherEntry.DATE1 = moment(trn_DateForView).format("YYYY-MM-DD");

        this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
        // this._transactionService.TrnMainObj.TRN_DATE =
        this.VoucherEntry.DATE = x;
        this.changeEndDate(this.VoucherEntry.DATE, "AD");

        ////console.log("viewDATE3", this.EntryDate.DATE3);
        this.changeEntryDate1(this.EntryDate.DATE3, "AD");
        this.EntryDate.DATE2 = x;
        this.changeEndDate1(this.EntryDate.DATE2, "AD");
      }
      this.EntryDate.PhiscalADDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
      this.changePhiscalDate(this.EntryDate.PhiscalADDate, "AD");

    }


  }

  changeEntryDate(value, format: string) {
    this.dateChangeFormate = `DATE1${format}`;
    // this.ValidatePhiscalYear(value,"TRN_DATE","DATE1");
    this._transactionService.TrnMainObj.TRN_DATE = value; //TRN_DATE
    ////console.log("changebasdate", value, this.VoucherEntry.DATE1);

    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this._transactionService.TrnMainObj.BS_DATE = this.VoucherEntry.BSDATE1 =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;
      }


      // this.VoucherEntry.BSDATE1.disableBefore = 5/4/2020;
    }
    else if (format == "BS") {
      // let yearValue = moment(value).year();
      // ////console.log("momentyes", yearValue);
      var xyz=value.split("-");
      let DateValue:any = xyz[2]+"-"+xyz[1]+"-"+xyz[0];
      var bsDate = (DateValue.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);

      this.VoucherEntry.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

      this.ValidateBSDATE(this.VoucherEntry.DATE1, "DATE1", "TRN_DATE") //TRN_DATE

    }

  }

  focusOutTrnDate($event) {
    this.ValidateBSDATE($event.target.value, "DATE1", "TRN_DATE")
  }

  changeEntryDate1(value, format: string) {

    this.dateChangeFormate = `DATE3${format}`;
    ////console.log("dateformat", value);

    this._transactionService.TrnMainObj.TRNDATE = value; //TRNDATE
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      ////console.log("yearLength",yearValue)
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this._transactionService.TrnMainObj.BSDATE = this.EntryDate.BSDATE1 =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        this.bsDate = this.EntryDate.BSDATE1;
        //console.log("@@BSDATE1",this.EntryDate.BSDATE1 );
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      let bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      var xyz=value.split("-");
      let DateValue:any = xyz[2]+"-"+xyz[1]+"-"+xyz[0];
      // var bsDate = (DateValue.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate)
      this.EntryDate.DATE3 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      //console.log("@@DATE3", this.EntryDate.DATE3);
      this._transactionService.TrnMainObj.TRNDATE= this.EntryDate.DATE3; //TRNDATE
      //this.ValidatePhiscalYear(this.EntryDate.DATE3,"TRNDATE",'DATE3');
      this.ValidateBSDATE(this.EntryDate.DATE3, "DATE3", "TRNDATE"); //TRNDATE
    }
    // //console.log('CheckDate',this._transactionService.TrnMainObj.TRN_DATE,this._transactionService.TrnMainObj.BS_DATE)

  }

  focusOutEntryDate($event) {
    this.ValidatePhiscalYear($event.target.value, "TRNDATE", 'DATE3'); 
    this.ValidateBSDATE($event.target.value, "DATE1", "TRNDATE"); 
  } 


  changeEndDate(value, format: string) {
    ////console.log("changeEndDate fired");
    this.ValidatePhiscalYear(value, "TRNDATE", 'DATE');
    this._transactionService.TrnMainObj.TRNDATE = value; //TRNDATE
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
      this._transactionService.TrnMainObj.BSDATE = this.VoucherEntry.BSDATE2 =
        (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.VoucherEntry.DATE =
        (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;

    }

  }

  changeEndDate1(value, format: string) {

    this.ValidatePhiscalYear(value, "TRNDATE", 'DATE');
    this._transactionService.TrnMainObj.TRNDATE = value; //TRNDATE
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
      this._transactionService.TrnMainObj.BSDATE = this.EntryDate.BSDATE2 =
        (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;
    }
    else if (format == "BS") {
      var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.EntryDate.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));


    }

  }



  ValidateBSDATE(value, date, dateType) {
    //console.log("@@value",value);
    if (date == 'DATE3') {
      ////console.log("validate BS DATE",date);
      if ((value < this.masterService.PhiscalObj.BeginDate.split('T')[0])
        || value > this.masterService.PhiscalObj.EndDate.split('T')[0]
      ) {
        this.errorOccurfromDate = true;
        this.alertService.info("Date Exceed to Current Phiscal Year !");
        return;
      }

      if (value > moment(this.date1).format("YYYY-MM-DD")) {
        this.alertService.info("TRN DATE SHOULD NOT BE ENTERED FUTURE DATE");
        this.errorOccurfromDate = true;
      }

    } else if (date == 'DATE1') {
      ////console.log("date new", value, this.serverDate,);
      if (value > moment(this.date1).format("YYYY-MM-DD")) {
        this.alertService.info("TRN DATE SHOULD NOT BE ENTERED FUTURE DATE");
        this.errorOccurfromDate = true;
        if (dateType == "TRNDATE") {
          // this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
          // this.changeEntryDate1(this.EntryDate.DATE3, "AD");
        }
        else if (dateType == "TRN_DATE") {
          /// this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
          //  this.changeEntryDate(this.VoucherEntry.DATE1,"AD");
        }
        return;
      }
    }
  }


  ValidatePhiscalYear(value, DateType, DATE) {

    ////console.log("CheckValue123", value, this.masterService.PhiscalObj.BeginDate)
    if (value < this.masterService.PhiscalObj.BeginDate.substring(0,10)) {
      // this.alertService.info("Date Exceed to Current Phiscal Year!");
      // this.errorOccurfromDate = true;

      // var adbs = require("ad-bs-converter");
      // if(DateType=="TRN_DATE"){
      //   this._transactionService.TrnMainObj.TRN_DATE = this.serverDate ? this.serverDate : new Date().toJSON().split('T')[0];
      //   var adDate = (value.replace("-", "/")).replace("-", "/");
      //   var bsDate = adbs.ad2bs(adDate);
      //   this._transactionService.TrnMainObj.BS_DATE = this.VoucherEntry.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
      // }
      // else if(DateType =="TRNDATE"){
      //   this._transactionService.TrnMainObj.TRNDATE = this.serverDate ? this.serverDate : new Date().toJSON().split('T')[0];
      //   var adDate = (value.replace("-", "/")).replace("-", "/");
      //   var bsDate = adbs.ad2bs(adDate);
      //   this._transactionService.TrnMainObj.BSDATE = this.VoucherEntry.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
      // }

      if (DATE == 'DATE1') {
        // this.VoucherEntry.DATE1 = this.serverDate ? this.serverDate : new Date().toJSON().split('T')[0];      
        this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
      }

      if (DATE == 'DATE2') {
        this.VoucherEntry.DATE2 = this.serverDate ? this.serverDate : new Date().toJSON().split('T')[0];
        this.EntryDate.DATE2 = new Date().toJSON().split('T')[0];
      }
      if (DATE == 'DATE3') {
        // this.EntryDate.DATE3 = this.serverDate ? this.serverDate : new Date().toJSON().split('T')[0];
        this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate1(this.EntryDate.DATE3, "AD");
      }
      if (DATE == 'DATE') {
        this.VoucherEntry.DATE = this.serverDate ? this.serverDate : new Date().toJSON().split('T')[0];
        this.changeEndDate(this.VoucherEntry.DATE, "AD");
      }
    }

  }



  changePhiscalDate(value, format: string) {

    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
      this.EntryDate.PhiscalBSDate =
        (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;
    }
  }

  showAcPartyList() {

    if (this._transactionService.TrnMainObj.VoucherType != 15 && this._transactionService.TrnMainObj.VoucherType != 16) {
      if (!this._transactionService.TrnMainObj.TRNMODE) {
        alert("Selet Voucher Type or Party Type");
        return;
      }


    }



    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;

    if (this._transactionService.TrnMainObj.VoucherType == 12) {
      TRNMODE = "ALL"
    }

    if (this._transactionService.TrnMainObj.VoucherType == 18) {
      TRNMODE = "Cash Transfer"
    }

    if (this._transactionService.TrnMainObj.VoucherType == 17) {
      TRNMODE = "Cash Transfer PV"
    }

    if (this._transactionService.TrnMainObj.VoucherType == 65) {
      if (this._transactionService.TrnMainObj.TRNMODE == 'Party Payment')
        TRNMODE = "SinglePayment_Party"
      if (this._transactionService.TrnMainObj.TRNMODE == 'Expenses Voucher')
        TRNMODE = "SinglePayment_Expense"
    }
    if (this._transactionService.TrnMainObj.VoucherType == 15
      || this._transactionService.TrnMainObj.VoucherType == 16) {
      TRNMODE = "DNCNfromMaster"
    }
    if(this._transactionService.TrnMainObj.VoucherType == 75){
      TRNMODE = "PartyPaymentCellpay";
    }
    if(this._transactionService.TrnMainObj.VoucherType == 72){
      TRNMODE = "Bank Deposit Voucher";
    this.gridACListPartyPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Default/${TRNMODE}/`,
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
    }else{ 
    this.gridACListPartyPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Master/${TRNMODE}/`,
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
    }

    this.genericGridACListParty.show();
  }

  onAcPartySelect(acItem) {
    this._transactionService.TrnMainObj.CASHBANK_SL_ACID = "";
    this._transactionService.TrnMainObj.CASHBANK_SL_NAME = "";
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher){
        //console.log("TrntranList1",this._transactionService.TrnMainObj.TrntranList)
       if(this._transactionService.TrnMainObj.TrntranList && this._transactionService.TrnMainObj.TrntranList.length>0){
        let trnlist = this._transactionService.TrnMainObj.TrntranList;
         if(acItem.ACID == trnlist[0].A_ACID){
          this.alertService.info("Debit and Credit Account cannot be same.");
          return;
         }
       }
      }
    this._transactionService.creditlimit = acItem.CRLIMIT;
    this._transactionService.MAPID_Is = acItem.MAPID;
    
    try {
      if (typeof acItem == "object") {
        var ac = <TAcList>acItem;
        this._transactionService.Party_or_Expense_Ac = ac;
        this._transactionService.TrnMainObj.TRNAC = ac.ACID;
        this._transactionService.TrnMainObj.TRNACName = ac.ACNAME;
        //console.log("@@HASSUBLEDGER",ac.HASSUBLEDGER)
        this._transactionService.TrnMainObj.HASSUBLEDGER = ac.HASSUBLEDGER;
        this._transactionService.masterSelectACID = ac.ACID;
        if (ac.MAPID == 'OD') {
          this._transactionService.checkCrAmount = true;
        }
        // ////console.log("@@ac.ACID",this._transactionService.TrnMainObj,this._transactionService.TrnMainObj.TRNACName)
        // this.TrnMainForm.patchValue({
        //   TRNAC : ac.ACID,
        //   TRNACName : ac.ACNAME
        // })
        this._transactionService.getAccountWiseTrnAmount(ac.ACID);
      } else {
        this._transactionService.TrnMainObj.TRNAC = "";
        this._transactionService.TrnMainObj.TRNACName = "";
      }



    } catch (error) {
      this._transactionService.TrnMainObj.TRNAC = "";
      this._transactionService.TrnMainObj.TRNACName = "";
    }
    ////console.log("upper rich");


    setTimeout(() => {
      // //console.log("billto native", this._billTo);
      
      if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay || this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote){
        this.masterService.focusAnyControl("ACCODEInput_"+0);
      }else if((this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher || this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) && this._transactionService.userSetting.ENABLESUBLEDGER==1){
        document.getElementById("CashBankSubLedgerInput").focus();
      }else{
        // if (this._billTo !== undefined) {
        //   if (this._billTo.nativeElement != null && this._billTo.nativeElement != undefined) {
        //     this._billTo.nativeElement.focus();
        //   }
        // }
      }

    }, 20);


  }

  cashBankFocus($event) {
    // ////console.log("@@_transactionService.masterSelectACID",this._transactionService.masterSelectACID)
    if (this._transactionService.masterSelectACID != null &&
      this._transactionService.masterSelectACID != "" &&
      this._transactionService.masterSelectACID !== undefined) {

      this._transactionService.getAccountWiseTrnAmount(this._transactionService.masterSelectACID);
    }
  }




  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  getAccountList(voucherType: string) {
    try {
      if (voucherType == "Party Payment") {
        this.masterService
          .getAccount("IncomeVoucher-account")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType == "V" || ac.PType == "C" || ac.PType == "CC"
            );
            return fil;
          })
          .subscribe((res: Array<TAcList>) => {
            this._transactionService.accountListSubject.next(res);
          });
      } else if (voucherType == "Expenses Voucher") {
        this.masterService
          .getAccount("IncomeVoucher-Expenses")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType != "C" && ac.PType != "V" && ac.PType != "CC"
            );
            return fil;
          })
          .subscribe(res => {
            this._transactionService.accountListSubject.next(res);
          });
      } else if (voucherType == "Party Receipt") {
        this.masterService
          .getAccount("IncomeVoucher-account")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType == "V" || ac.PType == "CV" || ac.PType == "C"
            );
            return fil;
          })
          .subscribe((res: Array<TAcList>) => {
            this._transactionService.accountListSubject.next(res);
          });
      } else if (voucherType == "Income Voucher") {
        this.masterService
          .getAccount("IncomeVoucher-Expenses")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType != "C" && ac.PType != "V" && ac.PType != "CC"
            );
            return fil;
          })
          .subscribe(res => {
            this._transactionService.accountListSubject.next(res);
          });
      } else {
        this.masterService
          .getAccount("IncomeVoucher-default")
          .subscribe(res => {
            this._transactionService.accountListSubject.next(res);
          });
      }
    } catch (ex) {
      alert(ex);
    }
  }

  acCodeChange() {
    try {
      // this.TrnMainForm.get("TRNAC").setValue(
      //   this.TrnMainForm.get("TRNAC").value
      // );
    } catch (ex) {
      alert(ex);
    }
  }

  acNameChange() {
    try {
      // this.TrnMainForm.get("TRNAC").setValue(
      //   this.TrnMainForm.get("TRNAC").value
      // );
    } catch (ex) {
      alert(ex);
    }
  }
  partyArray: number; //To seperate Vouchertype in single payment.
  VoucherTypeChangeEvent(value) {
    try {

      this._transactionService.TrnMainObj.TRNMODE = value;
      // this._transactionService.TrnMainObj.TRNAC = "";
      //  this._transactionService.TrnMainObj.TRNACName = "";

      // this.getAccountList(value);
      this.AssignInvoiceType(value);
      if (value == "Income Voucher") {
        this._transactionService.TableAcHeader = "Particulars";//"Income a/c";
        this.accountList = this.acList;
        this.trnaccountList = this.cashAndBankList;
        this.getAccountList(value);
      } else if (value == "Party Receipt") {
        this._transactionService.TableAcHeader = "Particulars";//"Party/Income a/c";
        this.accountList = this.Suppliers;
        this.trnaccountList = this.cashAndBankList;

      } else if (
        value == "Bank Withdraw Voucher" ||
        value == "Bank Deposit Voucher"
      ) {
        this._transactionService.TableAcHeader = "Particulars";//"Bank a/c";
        this.accountList = this.bankList;
        this.trnaccountList = this.cashList;
      } else if (value == "Cheque Encash") {
        this._transactionService.TableAcHeader = "Particulars";//"Cheque a/c";
        this.accountList = this.acList;
        this.trnaccountList = this.cashList;
      } else if (value == "Expenses Voucher") {
        if (this.voucherType == 65) this.partyArray = 1;
        this._transactionService.TableAcHeader = "Particulars";//"Expenses a/c";
        this.accountList = this.acList;
        this.trnaccountList = this.cashAndBankList;
      } else if (value == "Party Payment") {
        if (this.voucherType == 65) this.partyArray = 0;
        this._transactionService.TableAcHeader = "Particulars";//"Party Expenses a/c";
        this.accountList = this.Suppliers;
        this.trnaccountList = this.cashAndBankList;
      }
      else if (value == "Single Payment") {
        this.partyArray = 0;
        this._transactionService.TableAcHeader = "Particulars";//"Party Single Expenses a/c";
        this.accountList = this.Suppliers;
        this.trnaccountList = this.cashAndBankList;
        this._transactionService.TrnMainObj.TRNMODE == 'Party Payment'
      }
      else if (value == "Cash Transfer" || value == "Cash Transfer PV") {
        this._transactionService.TableAcHeader = "Particulars";//"Transfer To";
        this.accountList = this.cashAndBankList;
        this.trnaccountList = this.cashAndBankList;
      } else if (value == "Customer") {
        this._transactionService.TableAcHeader = "Particulars";//"Description";
        this.accountList = this.acList;
        this.trnaccountList = this.Customers;
      } else if (value == "Supplier") {
        this._transactionService.TableAcHeader = "Particulars";//"Description";
        this.accountList = this.acList;
        this.trnaccountList = this.Suppliers;
      } else {
        this._transactionService.TableAcHeader = "Particulars";//"Description";
      }
      // this.getAccountList(value);
    } catch (ex) {
      alert(ex);
    }
  }
  AssignInvoiceType(value) {
    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory) {
      if (value == "Party Receipt" || value == "Mixed Receipt") {
        this._transactionService.TrnMainObj.INVOICETYPE = "Receive Voucher"
      }
      else if (value == "Party Payment" || value == "Mixed Payment")
        this._transactionService.TrnMainObj.INVOICETYPE = "Payment Voucher"
    }
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      alert(ex);
    }
  }

  setTrnDate(value, index) {
    if (this.masterService.ValidateDate(value)) {
      this._transactionService.TrnMainObj.TRN_DATE = this.masterService.changeIMsDateToDate(value); 
    } else {
      this.alertService.error(`Invalid Transaction Date`);
    }
  }




  getTrnDate() {
    if (this._transactionService.TrnMainObj.TRN_DATE) {
      return this.masterService.customDateFormate(this._transactionService.TrnMainObj.TRN_DATE.toString()); 
    }
  }
  vatBillChange() {

    this._transactionService.TrnMainObj.TOTAMNT = 0;
    this._transactionService.TrnMainObj.TAXABLE = 0;
    this._transactionService.TrnMainObj.VATAMNT = 0;
    this._transactionService.TrnMainObj.NETAMNT = 0;
  }

  focusToPayTo() {
    if (this._billTo !== undefined) {
      if (this._billTo.nativeElement != null && this._billTo.nativeElement != undefined) {
        this._billTo.nativeElement.focus();
      }
    }
  }
  InvoiceTypeChangeEvent(value) {
    {
      ////console.log("checkedValue", value)
    }

  }

  
//   ngAfterContentChecked(): void {    
//     if(this)
//     this.initDate();
//     this.changeDetection.detectChanges();

// }

RefBillTabAndEnter(){
  
  var TRNMODE = "ALL"
  // this.gridACListPartyPopupSettings = {
  //   title: "Account Groups",
  //   apiEndpoints: `/getAccountItem/`,
  //   defaultFilterIndex: 0,
  //   columns: [
  //     {
  //       key: "ACNAME",
  //       title: "Account Name",
  //       hidden: false,
  //       noSearch: false
  //     },
  //     // {
  //     //   key: "ACID",
  //     //   title: "CODE",
  //     //   hidden: false,
  //     //   noSearch: false
  //     // },
  //     {
  //       key: "PARENT",
  //       title: "PARENT",
  //       hidden: false,
  //       noSearch: false,

  //     }
  //   ]
  // };
  // this.genericGridRefBillPopup.show();


  var TRNMODE = "ALL"

   
  this.genericRefBillPopupSetting = {
    title: "Accounts",
    apiEndpoints: `/getPerformaPageList/`,
    defaultFilterIndex: 1,
    columns: [
      {
        key: "VCHRNO",
        title: "Vchrno",
        hidden: false,
        noSearch: false
      },
      {
        key: "TRNDATE",
        title: "DATE",
        hidden: false,
        noSearch: false
      },
      
      {
        key: "BSDATE",
        title: "BSDATE",
        hidden: false,
        noSearch: false
      },
      {
        key: "NETAMNT",
        title: "NetAmount",
        hidden: false,
        noSearch: false
      }
    ]
  };
  this.genericGridRefBillPopup.show();
}
onPerformaListDblClick(value){
  this._transactionService.TrnMainObj.CHALANNO = value.VCHRNO;

}

TabRefBill() {
  this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings("ReverseCreditNote");
  this.genericGridRefBill.show();
}

onRefBillSelected(value) {
//console.log("@@value",value)
  if (value.CNDN_MODE == 1) {
    this._transactionService.loadData(
      value.VCHRNO,
      value.DIVISION,
      value.PhiscalID
    );
  } else {
    this.alertService.warning(`Cannot Load Voucher!! The Voucher is SALES RETURN based.`)
    return;
  }
}

onsubLedgerTab() {
  this.gridSubLedgerSetting = {
    title: "SubLedger List",
    apiEndpoints: `/getSubLedgerPageList`,
    defaultFilterIndex: 1,
    columns: [
      {
        key: "SL_ACID",
        title: "SubLedger ID",
        hidden: false,
        noSearch: false
      },
      {
        key: "SL_ACNAME",
        title: "SubLedger Name",
        hidden: false,
        noSearch: false
      }
    ]
  };
  this.gridSubLedgerSettingList.show();
}

onSubLedgerSelect(value) {
  this._transactionService.TrnMainObj.CASHBANK_SL_ACID = value.SL_ACID;
  this._transactionService.TrnMainObj.CASHBANK_SL_NAME = value.SL_ACNAME;
}

focusToSubLedger() {
  document.getElementById("CashBankSubLedgerInput").focus();
}

changeTrndate(){
  let trnDateForView = this._transactionService.TrnMainObj.TRNDATE;
  let trn_DateForView = this._transactionService.TrnMainObj.TRN_DATE;

  this.EntryDate.DATE3 = moment(trnDateForView).format("YYYY-MM-DD");
  this.VoucherEntry.DATE1 = moment(trn_DateForView).format("YYYY-MM-DD");
  this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
  this.changeEntryDate1(this.EntryDate.DATE3, "AD");

}
}