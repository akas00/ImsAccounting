import { Component, ViewChild, OnInit, AfterContentChecked, ChangeDetectorRef, ElementRef, HostListener } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { VoucherTypeEnum, TAcList, Trntran } from "../../../../common/interfaces";
import { iCreditList } from "./capital-voucher.service";
import { AuthService } from "../../../../common/services/permission";
import { TwoDigitNumber } from "../../../../theme/pipes";
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";

@Component({
  selector: 'capital-voucher',
  templateUrl: './capital-voucher.component.html',
  styleUrls: ["../../../Style.css"],
  providers:[TwoDigitNumber]

})
export class CapitalVoucherComponent implements OnInit ,AfterContentChecked  {
  selectedIndex: number = 0;
  trntranTotal: number = 0;
  AcObj: TAcList = <TAcList>{}

  GROSSAMOUNT: number = 0;
  discount: number = 0;
  taxableAmount: number = 0;
  nonTaxableAmount: number = 0;
  VATAMOUNT: number = 0;
  NETAMOUNT: number = 0;
  rounding: number = 0;
  nexIndex: number = 0;
  accnamefocus: boolean;
  totalamount: number = 0;
  chalanSeries:any;
  EntryDate: any = <any>{};
  VoucherEntry:any = <any>{};
  differenceAmount:number = 0;
  diffAmountDrCrType:string;

  applyPipeinDiscount:boolean=true;
  applyPipeinVatAmount:boolean=true;
  applyPipeinTaxableAmount:boolean=true;
  applyPipeinNonTaxableAmount:boolean=true;

  applyPipeinRoundingAmount:boolean =true;


  @ViewChild("adEntryDate") _adEntryDate:ElementRef;
  @ViewChild("bsEntryDate") _bsEntryDate:ElementRef;
  @ViewChild("adTrnDate") _adTrnDate:ElementRef;
  @ViewChild("bsTrnDate") _bsTrnDate:ElementRef;



  private specialKeys: Array<string> = ["Tab"];



  @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
  gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
  trnNepaliDate: any;
  trnEnglishDate: any;
  userSetting:any;
  costlists:any[] = [];
  userProfile:any;
  date1:any;
  errorOccurfromDate:boolean  = false;
  dateChangeFormate:string;
  date2:any;
  @ViewChild("gridSubLedgerSettingList")
  gridSubLedgerSettingList:GenericPopUpComponent;
  gridSubLedgerSetting: GenericPopUpSettings = new GenericPopUpSettings();
  bsDate: any;


  constructor(public masterService: MasterRepo,
    private _transactionService: TransactionService,
    public alertService: AlertService,
    private _authService: AuthService,
    private twoDigitPipe:TwoDigitNumber,
    private changeDetection: ChangeDetectorRef,
    private el: ElementRef,
    private _activatedRoute: ActivatedRoute,
    private _loadingSerive: SpinnerService,
  ) {
  //  this.masterService.ShowMore = false;

    ////console.log("showMore",this.masterService.ShowMore);
    this._transactionService.initialFormLoad(64)
    this._transactionService.creditList =  [];
    this.addCreditListnewRow();
    this._transactionService.TrnMainObj.DCAMNT = 0.00;
    this._transactionService.TrnMainObj.NETAMNT = 0.00;
    this._transactionService.TrnMainObj.TAXABLE = 0.00;
    this._transactionService.TrnMainObj.NONTAXABLE = 0.00;
    this._transactionService.TrnMainObj.VATAMNT = 0.00;
    this._transactionService.TrnMainObj.TOTAMNT = 0.00;
    this._transactionService.TrnMainObj.ROUNDOFF = 0.00;
    this.userSetting = _authService.getSetting()
    this.getSupplierList();
    this.getChalanSeries();
    this.getCostCenterList();
    this.userProfile = this._authService.getUserProfile();
    var y = this.masterService.PhiscalObj.BeginDate
    y = y.substring(0, 10);
    this.date2 = y;
    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
      this.date1 = new Date();
    }
    else {
      this.date1 = this.masterService.PhiscalObj.EndDate
    }
    this._transactionService.DrillMode = "New";

    ////console.log("dcamount",this._transactionService.TrnMainObj.DCAMNT);
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      if (params['mode']=="DRILL") {
        let VCHR = params['voucher']
        let vparams = []
        vparams = VCHR.split('-')
        this._loadingSerive.show("Loading Invoice")
        this._transactionService.CapitalBudgetData(VCHR, vparams[1], vparams[2]);

        // this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
        //   if (res.status == "ok") {
        //     this._loadingSerive.hide()
        //     this._transactionService.TrnMainObj = res.result;
        //     //console.log("Vat_Purchase", this.userSetting.Vat_Purchase)
        //     let abc = this._transactionService.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.userSetting.Vat_Purchase);
        //     //console.log("abc", abc)
        //     if (abc >= 0) {
        //       this._transactionService.TrnMainObj.TrntranList.splice(abc, 1)
        //     }
        //     this._transactionService.TrnMainObj.VoucherType = 64;
        //     this._transactionService.pageHeading = "Capital Voucher";
        //     this._transactionService.TrnMainObj.VoucherPrefix = "CP";
        //     this._transactionService.TrnMainObj.Mode = "VIEW";
        //   }
        // }, err => {
        //   this._loadingSerive.hide()
        //   this.alertService.error(err)
        // })
            this._transactionService.TrnMainObj.VoucherType = 64;
            this._transactionService.pageHeading = "Capitalize Purchase Voucher";
            this._transactionService.TrnMainObj.VoucherPrefix = "CP";
            this._transactionService.TrnMainObj.Mode = "VIEW";
            
        this._transactionService.viewDate.subscribe(
          (data) =>{
            this.initDate();
          }
        )
      }
      else if (params['mode']=="fromLatepost"){
        // alert("params['mode']==Capital voucher")
        this._loadingSerive.show("Loading Invoice")
        this._transactionService.CapitalBudgetData(params.voucher, params.DIVISION, params.PHISCALID);
      
      }
      else{
        this._transactionService.TrnMainObj.Mode = 'NEW';
        this.initDate();
    
        this._transactionService.viewDate.subscribe(
          (data) =>{
            this.initDate();
          }
        )
    
    
        this.alertService.emitShowHideSubject.subscribe(
          (res) =>{
            this.mangeFocusonDatefield();
          }
        )
        this.masterService.ShowMore = false;
      }
    });
    this._transactionService.TrnMainObj.CNDN_MODE = 0

  }

  ngAfterContentChecked(): void {
    this.differenceAmount = this._transactionService.diffAmountItemForAccount;
    this.diffAmountDrCrType = this._transactionService.diffAmountDrCrType;
    this.changeDetection.detectChanges();

}

initDate() {

  if(this._transactionService.TrnMainObj.Mode == 'NEW'){
    // this._transactionService.TrnMainObj.TRNDATE = this.VoucherEntry.DATE1 =   new Date().toJSON().split('T')[0];
    // this._transactionService.TrnMainObj.TRN_DATE = this.EntryDate.DATE3 = new Date().toJSON().split('T')[0];

    // this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
    // this._transactionService.TrnMainObj.TRN_DATE = this.VoucherEntry.DATE = new Date().toJSON().split('T')[0];
    // this.changeEndDate(this.VoucherEntry.DATE, "AD");
    // this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = new Date().toJSON().split('T')[0];
    // this.changeEntryDate1(this.EntryDate.DATE3, "AD");
    // this.EntryDate.DATE2 = new Date().toJSON().split('T')[0];
    // this.changeEndDate1(this.EntryDate.DATE2, "AD");
    // this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.PhiscalADDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    // this.changePhiscalDate(this.EntryDate.PhiscalADDate, "AD");

    if (this.userProfile.CompanyInfo.ActualFY == this._transactionService.PhiscalObj.PhiscalID) {
      this._transactionService.TrnMainObj.TRNDATE = this.VoucherEntry.DATE1 = new Date().toJSON().split('T')[0];
      this._transactionService.TrnMainObj.TRN_DATE = this.EntryDate.DATE3 = new Date().toJSON().split('T')[0];

      this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
      this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = new Date().toJSON().split('T')[0];
      this.changeEntryDate1(this.EntryDate.DATE3, "AD");
      // this._transactionService.TrnMainObj.TRN_DATE = this.VoucherEntry.DATE = new Date().toJSON().split('T')[0];
      // this.changeEndDate(this.VoucherEntry.DATE, "AD");
      // this.EntryDate.DATE2 = new Date().toJSON().split('T')[0];
      // this.changeEndDate1(this.EntryDate.DATE2, "AD");
    }
    else {
      var x = this.masterService.PhiscalObj.EndDate
      x = x.substring(0, 10);
      this._transactionService.TrnMainObj.TRNDATE = this.VoucherEntry.DATE1 = x;
      this._transactionService.TrnMainObj.TRN_DATE = x;
      this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
      this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = x;
      this.changeEntryDate1(this.EntryDate.DATE3, "AD");
      // this._transactionService.TrnMainObj.TRN_DATE = this.VoucherEntry.DATE = x;
      // this.changeEndDate(this.VoucherEntry.DATE, "AD");
      // this.EntryDate.DATE2 = x;
      // this.changeEndDate1(this.EntryDate.DATE2, "AD");
      ////console.log("ChecKEntrYDAte",this._transactionService.TrnMainObj.TRN_DATE)
    }
    this.EntryDate.PhiscalADDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.changePhiscalDate(this.EntryDate.PhiscalADDate, "AD");

  }else{
    let trnDateForView = this._transactionService.TrnMainObj.TRNDATE;
    let trn_DateForView = this._transactionService.TrnMainObj.TRN_DATE;

    this.EntryDate.DATE3 = moment(trnDateForView).format("YYYY-MM-DD");

    this.VoucherEntry.DATE1 =  moment(trn_DateForView).format("YYYY-MM-DD");

    this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
    // this._transactionService.TrnMainObj.TRN_DATE =
    //  this.VoucherEntry.DATE = new Date().toJSON().split('T')[0];
    // this.changeEndDate(this.VoucherEntry.DATE, "AD");

    ////console.log("viewDATE3",this.EntryDate.DATE3);
    this.changeEntryDate1(this.EntryDate.DATE3, "AD");
    // this.EntryDate.DATE2 = new Date().toJSON().split('T')[0];
    // this.changeEndDate1(this.EntryDate.DATE2, "AD");
    // this._transactionService.TrnMainObj.TRNDATE =
    this.EntryDate.PhiscalADDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.changePhiscalDate(this.EntryDate.PhiscalADDate, "AD");

  }


}


changeEntryDate(value, format: string) {
  this.dateChangeFormate = `DATE1${format}`;
  // this.ValidatePhiscalYear(value,"TRN_DATE","DATE1");

  ////console.log("changebasdate", value, this.VoucherEntry.DATE1);

  var adbs = require("ad-bs-converter");
  if (format == "AD") {
    this._transactionService.TrnMainObj.TRN_DATE = value;
    let yearValue = moment(value).year();
    if (yearValue.toString().length == 4) {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
      this._transactionService.TrnMainObj.BS_DATE = this.VoucherEntry.BSDATE1 =
        (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
    }

  }
  else if (format == "BS") {
    this._transactionService.TrnMainObj.BS_DATE = value;
    var xyz=value.split("-");
    let DateValue:any = xyz[2]+"-"+xyz[1]+"-"+xyz[0];
    var datearr = value.split('/');
    const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
    // var bsDate = (DateValue.replace("-", "/")).replace("-", "/");
    var adDate = adbs.bs2ad(bsDate);

    this._transactionService.TrnMainObj.TRN_DATE =this.VoucherEntry.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

    this.ValidateBSDATE(this.VoucherEntry.DATE1, "DATE1", "TRN_DATE")

  }

}

  changeEntryDate1(value, format: string) {

    this.dateChangeFormate = `DATE3${format}`;
    ////console.log("dateformat", value);


    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      this._transactionService.TrnMainObj.TRNDATE = value;
      let yearValue = moment(value).year();
      ////console.log("yearLength",yearValue)
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this._transactionService.TrnMainObj.BSDATE = this.EntryDate.BSDATE1 =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
        this.bsDate = this.EntryDate.BSDATE1;
      }
    }
    else if (format == "BS") {
      this._transactionService.TrnMainObj.BSDATE = value;
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      var xyz=value.split("-");
      let DateValue:any = xyz[2]+"-"+xyz[1]+"-"+xyz[0];
      // var bsDate = (DateValue.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate)
      this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      //console.log("@@DATE3", this.EntryDate.DATE3);
      // this._transactionService.TrnMainObj.TRNDATE= this.EntryDate.DATE3;
      //this.ValidatePhiscalYear(this.EntryDate.DATE3,"TRNDATE",'DATE3');
      this.ValidateBSDATE(this.EntryDate.DATE3, "DATE3", "TRNDATE");
    }
    // //console.log('CheckDate',this._transactionService.TrnMainObj.TRN_DATE,this._transactionService.TrnMainObj.BS_DATE)

  }


  // changeEndDate(value, format: string) {

  //   var adbs = require("ad-bs-converter");
  //   if (format == "AD") {
  //     this._transactionService.TrnMainObj.TRNDATE = value;
  //     var adDate = (value.replace("-", "/")).replace("-", "/");
  //     var bsDate = adbs.ad2bs(adDate);
  //     this._transactionService.TrnMainObj.BSDATE = this.VoucherEntry.BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
  //   }
  //   else if (format == "BS") {
  //     var bsDate = (value.replace("-", "/")).replace("-", "/");
  //     var adDate = adbs.bs2ad(bsDate);
  //     this.VoucherEntry.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

  //   }

  // }

  // changeEndDate1(value, format: string) {
  //   var adbs = require("ad-bs-converter");
  //   if (format == "AD") {
  //     this._transactionService.TrnMainObj.TRNDATE = value;
  //     var adDate = (value.replace("-", "/")).replace("-", "/");
  //     var bsDate = adbs.ad2bs(adDate);
  //     this._transactionService.TrnMainObj.BSDATE = this.EntryDate.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
  //   }
  //   else if (format == "BS") {
  //     var bsDate = (value.replace("-", "/")).replace("-", "/");
  //     var adDate = adbs.bs2ad(bsDate);
  //     this.EntryDate.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

  //   }

  // }

  focusOutEntryDate($event){
    this.ValidatePhiscalYear($event.target.value,"TRNDATE",'DATE3');
    this.ValidateBSDATE($event.target.value,"DATE1","TRNDATE");
  }


  mangeFocusonDatefield(){
    if(this.errorOccurfromDate){
      if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
      let elementObj = null;
      ////console.log("datechangeformat",this.dateChangeFormate);
      if(this.dateChangeFormate == 'DATE1BS'){
        elementObj = this._bsTrnDate;
        this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate(this.VoucherEntry.DATE1,'AD');
      }else if(this.dateChangeFormate == 'DATE1AD'){
        elementObj = this._adTrnDate;
        this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate(this.VoucherEntry.DATE1,'AD');
      }else if(this.dateChangeFormate == 'DATE3BS'){
        elementObj = this._bsEntryDate;
        this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate1(this.EntryDate.DATE3 ,'AD');
      }else if(this.dateChangeFormate == 'DATE3AD'){
        elementObj = this._adEntryDate;
       // this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
        ////console.log("entry date",this.EntryDate.DATE3);

        this.EntryDate.DATE3 = new Date().toJSON().split('T')[0];
        this.changeEntryDate1(this.EntryDate.DATE3 ,'AD');
      }


      if(elementObj != null){
        setTimeout(() => {
          elementObj.nativeElement.focus();
       }, 2);
      }
    }
    else{
      var x = this.masterService.PhiscalObj.EndDate
      x = x.substring(0, 10);
      this._transactionService.TrnMainObj.TRNDATE = this.VoucherEntry.DATE1 = x;
      this._transactionService.TrnMainObj.TRN_DATE = x;
      this.changeEntryDate(this.VoucherEntry.DATE1, "AD");
      this._transactionService.TrnMainObj.TRNDATE = this.EntryDate.DATE3 = x;
      this.changeEntryDate1(this.EntryDate.DATE3, "AD");
      // this._transactionService.TrnMainObj.TRN_DATE = this.VoucherEntry.DATE = x;
      // this.changeEndDate(this.VoucherEntry.DATE, "AD");
      // this.EntryDate.DATE2 = x;
      // this.changeEndDate1(this.EntryDate.DATE2, "AD");
      ////console.log("ChecKEntrYDAte",this._transactionService.TrnMainObj.TRN_DATE)
    }
    }
  }




  showAcList(i) {
    this.selectedIndex = i;

    ////console.log("selectedIndex",this.selectedIndex);

    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;
    ////console.log("vouchertype",this._transactionService.TrnMainObj.VoucherType);
    if (this._transactionService.TrnMainObj.VoucherType == 64) {
      TRNMODE = "ALL"
    }

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


  clearRow($event, index) {
    try {
      $event.preventDefault();
      if (confirm("Are you sure you want to delete the row?")) {
        //console.log("inside the row");

        this.deleteCreditRow(index);
        // this.TrnTranCrAmtChange(0);
        // this.TrnTranDrAmtChange(0);
        this.onChagneCRAmount(index);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  TrnTranCrAmtChange(value) {
    try {
      this.trntranTotal = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        this.trntranTotal += x.CRAMNT == null ? 0 : x.CRAMNT;
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
      this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;

      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      alert(ex);
    }
  }

  TrnTranDrAmtChange(value) {
    try {
      this.trntranTotal = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        this.trntranTotal += x.DRAMNT == null ? 0 : x.DRAMNT;
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
      this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;

      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      alert(ex);
    }
  }

  onAcSelect(acItem) {

    try {
      if (typeof acItem == "object") {
        var ac = <TAcList>acItem;
        this.AcObj = acItem;

        this._transactionService.creditList[this.selectedIndex].AccountItem = acItem;
        this._transactionService.creditList[this.selectedIndex].A_ACID = acItem.ACID;
        this._transactionService.creditList[this.selectedIndex].AccountItem.ACCODE = ac.ACCODE;
        this._transactionService.creditList[this.selectedIndex].acitem = ac;
        this._transactionService.creditList[this.selectedIndex].ACNAME = ac.ACNAME;

        this._transactionService.getAccountWiseTrnAmount(ac.ACID);
      }
      if(acItem.HASSUBLEDGER == 1){
        this._transactionService.creditList[this.selectedIndex].disableSubLedger = false
        setTimeout(() => {
          this.masterService.focusAnyControl("SubLedgerInputCr_" + this.selectedIndex);
          this._transactionService.subledgerfocus=true;
        }, 20);
      } 
      else{
        this._transactionService.creditList[this.selectedIndex].disableSubLedger = true;
        this._transactionService.creditList[this.selectedIndex].SL_ACNAME='';
        this._transactionService.creditList[this.selectedIndex].CRAMNT=0;
        this._transactionService.creditList[this.selectedIndex].NARATION='';
        if(document.getElementById("SubLedgerInputCr_"+this.selectedIndex)){
        document.getElementById("SubLedgerInputCr_"+this.selectedIndex).removeAttribute("placeholder"); 
        }
        setTimeout(() => {
          this.masterService.focusAnyControl("Amount_" + this.selectedIndex);
        }, 20);
      }

    } catch (error) {

      this.alertService.info(error)
    }
  }


  onFocusCreditSelection(event,i){

    let acObj =  this._transactionService.creditList[i].AccountItem;
    if(acObj !=null &&acObj !== undefined){
      this._transactionService.getAccountWiseTrnAmount(acObj.ACID);
    }

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

  getCostCenterList(){

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

  addCreditnewRow(event, index) {
    this.nexIndex = index + 1;

    if (!this._transactionService.creditList) {
      this._transactionService.creditList = [];
    }


    let currentObj = this._transactionService.creditList[index];

    if (
      index != -1 &&
      (!currentObj.AccountItem ||
        currentObj.AccountItem.ACID == undefined ||
        currentObj.AccountItem.ACID == "")
    ) {

      alert("Please Select A/C");
      return;
    }

    if (
      index != -1 &&
      ((currentObj.DRAMNT == 0 || currentObj.DRAMNT == null) &&
        (currentObj.CRAMNT == 0 || currentObj.CRAMNT == null))
    ) {
      alert("Debit Amount or Credit Amount is Required.");
      return;
    }

    this.addCreditListnewRow();

    setTimeout(() => {

      if (document.getElementById("AccountName_" + this.nexIndex) != null) {
        document.getElementById("AccountName_" + this.nexIndex).focus();
      }


    }, 100);


  }

  addCreditListnewRow() {

    var newRow = <Trntran>{};
    var newaclist: TAcList = <TAcList>{};
    newRow.AccountItem = newaclist;
    newRow.NARATION = "";
    newRow.inputMode = true;
    newRow.editMode = true;
    newRow.CRAMNT = 0;
    newRow.DRAMNT = 0;
    newRow.ROWMODE = "new";
    newRow.PartyDetails = [];
    newRow.disableSubLedger = true;
    this._transactionService.creditList.push(newRow);
    this.accnamefocus = true;
  }

  discountChange(event) {
    this.applyPipeinDiscount = false;
    let discountAmount = this._transactionService.nullToReturnZero(event.target.value)
  //  this._transactionService.TrnMainObj.DCAMNT = discountAmount;
    this._transactionService.TrnMainObj.NETAMNT = discountAmount;
    this.budgetCalculation();
    this.calculateCrAmount();

  }

  discountFocusOut(event){
    this.applyPipeinDiscount = true;
    //this._transactionService.TrnMainObj.DCAMNT = this.formatetoTwoDecimal(this._transactionService.TrnMainObj.DCAMNT);



  }

  foucsOutTaxableAmount(event){
   this.applyPipeinTaxableAmount = true;
   // this._transactionService.TrnMainObj.TAXABLE = this.formatetoTwoDecimal(this._transactionService.TrnMainObj.TAXABLE);
    ////console.log("focusout taxable",this._transactionService.TrnMainObj.TAXABLE);
  }

  foucsOutNonTaxableAmount(event){
    this.applyPipeinNonTaxableAmount =true;
   // this._transactionService.TrnMainObj.NONTAXABLE = this.formatetoTwoDecimal(this._transactionService.TrnMainObj.NONTAXABLE);
  }

  roundOffFocusOut(event:KeyboardEvent){
    ////console.log("keyborad",typeof event.key);
    this.applyPipeinRoundingAmount = true;
    // if (event.key !== undefined){
    //   this._transactionService.TrnMainObj.ROUNDOFF = this.formatetoTwoDecimal(this._transactionService.TrnMainObj.ROUNDOFF);
    // }


  }

  foucsOutVATAmount($event){
    this.applyPipeinVatAmount = true;
    //this._transactionService.TrnMainObj.VATAMNT = this.formatetoTwoDecimal(this._transactionService.TrnMainObj.VATAMNT);
  }



  formatetoTwoDecimal(formatValue){
    if(typeof  formatValue == 'number' || typeof formatValue == 'string'){
       formatValue = Number(formatValue);
     return  formatValue = formatValue.toFixed(2);
    }else{
      formatValue = 0
     return formatValue = formatValue.toFixed(2);
    }

  }


  taxableAmountChange(event:KeyboardEvent) {
    this.applyPipeinTaxableAmount = false;
    if(this.specialKeys.indexOf(event.key) !=-1)
    {
      ////console.log("reachtab");
    }else{
      this._transactionService.TrnMainObj.NONTAXABLE = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) -
      this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT) -
      this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE);
      this.calculation();
    }

    //this._transactionService.TrnMainObj.TAXABLE = this._transactionService.nullToReturnZero(event.target.value);

  }


  nonTaxableAmountChange(event:KeyboardEvent) {
    this.applyPipeinNonTaxableAmount = false;
    if(this.specialKeys.indexOf(event.key) !=-1)
    {
      return false;
    }
   // this._transactionService.TrnMainObj.NONTAXABLE = this._transactionService.nullToReturnZero(event.target.value);
    this._transactionService.TrnMainObj.TAXABLE = this._transactionService.TrnMainObj.TOTAMNT -
                                                  this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT) -
                                                  this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);
    this.calculation();
  }
  VATAmountChange(event) {
    this.applyPipeinVatAmount = false
   // this._transactionService.TrnMainObj.VATAMNT = this._transactionService.nullToZeroConverter(event.target.value);
    //this.budgetCalculation();
    this._transactionService.TrnMainObj.NETAMNT = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE) +
    this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT) +
    this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);

    this._transactionService.totalDRAmount = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) + this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT)

  }

  RoundedAmountChange(event){
  this.applyPipeinRoundingAmount = false;
    event.preventDefault();

    let roundOffAmount = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.ROUNDOFF);

    if(roundOffAmount !=0){
     // this.calculateCrAmount();
      this._transactionService.TrnMainObj.NETAMNT = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE) +
      this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT) +
      this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);

       this._transactionService.storePreviousRoundOff = this._transactionService.TrnMainObj.ROUNDOFF;
        this._transactionService.TrnMainObj.NETAMNT =   this._transactionService.TrnMainObj.NETAMNT +
                                                        this._transactionService.TrnMainObj.ROUNDOFF ;
      if(roundOffAmount <0){

        this._transactionService.totalCRAmount = 0;
        this._transactionService.creditList.forEach(x => this._transactionService.totalCRAmount += x.CRAMNT);
       this._transactionService.totalCRAmount = this._transactionService.totalCRAmount+this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT)
                                                + this._transactionService.nullToReturnZero(Math.abs(this._transactionService.TrnMainObj.ROUNDOFF));
      }else{
        this._transactionService.totalCRAmount = 0;
        this._transactionService.creditList.forEach(x => this._transactionService.totalCRAmount += x.CRAMNT);
       this._transactionService.totalCRAmount = this._transactionService.totalCRAmount+this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT)
                                                - this._transactionService.nullToReturnZero(Math.abs(this._transactionService.TrnMainObj.ROUNDOFF));
      }

    }else{

      this.calculateCrAmount();

      this._transactionService.TrnMainObj.NETAMNT = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE) +
      this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT) +
      this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);

    }




  }

  roundChange($event){
    ////console.log("round change");
  }




  onChagneCRAmount(i) {
    // this._transactionService.creditList[i].CRAMNT_WITHOUTVAT=Math.round(((this._transactionService.creditList[i].CRAMNT/1.13) + Number.EPSILON) * 100) / 100;
    this.calculateCrAmount()
  }

  CRAMNTRowOk(index,value) {
    //console.log("CheckValues",value,this._transactionService.creditList)
    if(value.AccountItem.PARENT == this.masterService.userSetting.TDS_PAYABLE ||
      value.AccountItem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE
      )
      {
        // alert("reached")
        let x : any=<any>{}
       
        this.FilterList = [];
        this.PartyListFilter = [];
        for(let i of this._transactionService.creditList){
          if(i.AccountItem.PARENT != this.masterService.userSetting.TDS_PAYABLE &&
            i.AccountItem.PARENT != this.masterService.userSetting.TDS_RECEIVABLE){
              this.FilterList.push(i)
            }
          if(i.AccountItem.ACID.substring(0,2)== 'PA'){
            x.ACNAME = i.AccountItem.ACNAME;
            x.ACID = i.A_ACID;
          
            x.isCheck = true;
            x.TDS = value.CRAMNT?value.CRAMNT : value.DRAMNT;
          
            
          }
         
        }
     
        this.PartyListFilter.push(x);
      
        
        this.showTDSDetailPopup = true;
      }
      else{
        if(value.AccountItem.HASSUBLEDGER==1 && (!this._transactionService.creditList[index].SL_ACID)){
          var ACNAME = value.AccountItem.ACNAME;
          this.alertService.warning("PLEASE, SPECIFY SUB LEDGER FOR A/C '"+ACNAME+"'");
          return;
        }
        // document.getElementById("Narration_" + index).focus();
        this.masterService.focusAnyControl("NarrationCr_"+index);
      }
   
  }

  deleteCreditRow(index) {
    try {
      if (this._transactionService.creditList.length < 1) return;

      if (this._transactionService.creditList.length == 1) {
        this._transactionService.creditList.splice(index, 1);
        this.addCreditListnewRow();
        return;
      }
      var rm = this._transactionService.creditList[index].ROWMODE;
      if (rm == "new") {
        // //console.log("inside the delte row",rm);
        this._transactionService.creditList.splice(index, 1);
      }
      if( this.masterService.addnMode = 'EDIT'){
        this._transactionService.creditList.splice(index, 1);
      }
      

    } catch (error) {

    }
  }

  calculation() {
    this._transactionService.totalDRAmount = 0;
    this._transactionService.TrnMainObj.VATAMNT = (this._transactionService.TrnMainObj.TAXABLE * 0.13);
    ////console.log("sec tasavle",this._transactionService.TrnMainObj.TAXABLE);
    this._transactionService.TrnMainObj.NETAMNT = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE) +
                                                  this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT) +
                                                  this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);
    ////console.log("finalnetamout", this._transactionService.TrnMainObj.NETAMNT);
   // this._transactionService.totalDRAmount = this._transactionService.TrnMainObj.NETAMNT + this._transactionService.nullToReturnZero(this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT));
    this._transactionService.totalDRAmount = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) +
                                             this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT);
  }

  budgetCalculation() {
    this._transactionService.totalDRAmount = 0;

    this._transactionService.TrnMainObj.TAXABLE = this._transactionService.TrnMainObj.TOTAMNT -
                                                  this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT) -
                                                  this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);
    this._transactionService.TrnMainObj.NONTAXABLE = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) -
                                                     this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT) -
                                                     this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE);
                                                     ////console.log("None taxable", this._transactionService.TrnMainObj.NONTAXABLE)
    this._transactionService.TrnMainObj.VATAMNT = (this._transactionService.TrnMainObj.TAXABLE * 0.13);
    this._transactionService.TrnMainObj.NETAMNT = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE) +
                                                   this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT) +
                                                   this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);
    // this._transactionService.totalDRAmount = this._transactionService.TrnMainObj.NETAMNT +
    //                                       this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT);

    this._transactionService.totalDRAmount = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) +
                                          this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT);

  }

  calculateCrAmount() {
    this._transactionService.totalCRAmount = 0;
    this._transactionService.creditList.forEach(x => this._transactionService.totalCRAmount += x.CRAMNT);
    this._transactionService.totalCRAmount = this._transactionService.nullToReturnZero(this._transactionService.totalCRAmount)
                                               +this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.DCAMNT)

    if(this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.ROUNDOFF)>0){
      this._transactionService.totalCRAmount =  this._transactionService.totalCRAmount - this._transactionService.nullToReturnZero(Math.abs(this._transactionService.TrnMainObj.ROUNDOFF));
    }else if ( this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.ROUNDOFF) < 0 ) {
      this._transactionService.totalCRAmount =  this._transactionService.totalCRAmount + this._transactionService.nullToReturnZero(Math.abs(this._transactionService.TrnMainObj.ROUNDOFF))
    }
  }


  onSupplierSelected(supplier) {
    this._transactionService.TrnMainObj.BILLTO = supplier.ACNAME;
    this._transactionService.TrnMainObj.BILLTOTEL = supplier.VATNO?supplier.VATNO:supplier.GSTNO;
    this._transactionService.TrnMainObj.PARAC = supplier.ACID
    this._transactionService.TrnMainObj.TRNAC = supplier.ACID;
    this._transactionService.TrnMainObj.BILLTOADD = supplier.ADDRESS;
    this._transactionService.TrnMainObj.AdditionalObj.TRNTYPE = supplier.PSTYPE == null ? null : supplier.PSTYPE.toLowerCase();
    this._transactionService.TrnMainObj.TRNMODE = supplier.PMODE;
    this._transactionService.TrnMainObj.PARTY_ORG_TYPE = supplier.ORG_TYPE;
    this._transactionService.TrnMainObj.CREDITDAYS = supplier.CRPERIOD;

  }


  SupplierEnterCommand() {
    this.genericGridSupplier.show();
  }


  preventInput(event:KeyboardEvent){

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }else{
      event.preventDefault();
      return false;
    }


  }



  ValidatePhiscalYear(value,DateType,DATE){
    ////console.log("date",value,this.masterService.PhiscalObj.BeginDate);
    if(value<this.masterService.PhiscalObj.BeginDate.split('T')[0]){
      this.alertService.info("Date Exceed to Current Phiscal Year!")


      if(DateType == "TRNDATE"){
        this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate1(this.EntryDate.DATE3, "AD");
      }
      else if(DateType == "TRN_DATE"){
        this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        this.changeEntryDate(this.VoucherEntry.DATE1,"AD");
      }

    }


  }




  ValidateBSDATE(value,date,dateType){
    //console.log("value",value)
    if(date == 'DATE3'){
      if((value < this.masterService.PhiscalObj.BeginDate.split('T')[0])
      ||value > this.masterService.PhiscalObj.EndDate.split('T')[0]
      ){
      this.errorOccurfromDate = true;
        this.alertService.info("Date Exceed to Current Phiscal Year !");
        return;
      }

      if(value > moment(this.date1).format("YYYY-MM-DD")){
        this.alertService.info("TRN DATE SHOULD NOT BE ENTERED FUTURE DATE");
        this.errorOccurfromDate = true;
      }

    }else if(date == 'DATE1'){

      if(value > moment(this.date1).format("YYYY-MM-DD")){
        this.alertService.info("TRN DATE SHOULD NOT BE ENTERED FUTURE DATE");
        this.errorOccurfromDate = true;
        if(dateType == "TRNDATE"){
         // this.EntryDate.DATE3 = moment(this.date1).format("YYYY-MM-DD");
         // this.changeEntryDate1(this.EntryDate.DATE3, "AD");
        }
        else if(dateType == "TRN_DATE"){
         /// this.VoucherEntry.DATE1 = moment(this.date1).format("YYYY-MM-DD");
        //  this.changeEntryDate(this.VoucherEntry.DATE1,"AD");
        }
        return;
      }
    }
  }




  getSupplierList() {
    var voucherprefix="CP";
    this.gridPopupSettingsForSupplier = {
      title: "Supplier",
      apiEndpoints: `/getAccountPagedListByPType/PA/V/${voucherprefix}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACCODE",
          title: "CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ADDRESS",
          title: "ADDRESS",
          hidden: false,
          noSearch: false
        },
        {
          key: "EMAIL",
          title: "EMAIL",
          hidden: false,
          noSearch: false
        }
      ]
    };

  }

  changePhiscalDate(value, format: string) {

    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._transactionService.TrnMainObj.BSDATE = this.EntryDate.PhiscalBSDate = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
    }
  }
  onsubLedgerTab(i){
    this.selectedIndex = i;
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
    this._transactionService.creditList[this.selectedIndex].SL_ACID= value.SL_ACID;
    this._transactionService.creditList[this.selectedIndex].SL_ACNAME =value.SL_ACNAME;
    setTimeout(() => {
      this.masterService.focusAnyControl("Amount_" + this.selectedIndex);
    }, 20);
    // this.focusNext(1, this.selectedIndex);
   }
   changedSubLedger(value){

    // if(value.hasSubLedger==1){
    //   this.alertService.warning("PLEASE, SPECIFY SUB LEDGER FOR A/C");

    // }
  }
  
  focusNextValidation(value, tvalue) {
////console.log("CheckValueee",value,tvalue)
    if (value == 'Ledger') {
      if (tvalue.AccountItem) {
        if(tvalue.AccountItem.HASSUBLEDGER == 1){
          setTimeout(() => {
            this.masterService.focusAnyControl("SubLedgerInputCr_" + this.selectedIndex);
          }, 20);
        } 
        else{
         setTimeout(() => {
            this.masterService.focusAnyControl("Amount_" + this.selectedIndex);
          }, 20);
        }
       
      }
    
    }
    else if (value == 'SubLedger') {
      if (!tvalue.SL_ACNAME) {
       
      }
      else{
        this.masterService.focusAnyControl("Amount_" + this.selectedIndex);
      }
    }
  }

  showTDSDetailPopup = false;
  PartyListFilter =[];
  TdsPopupClick(index){

  }
  ClickDrList(){

  }
  cancelTDSDetailPopup(){
    this.showTDSDetailPopup = false;
  }
  TdsPopupOK(){
    this.showTDSDetailPopup = false;
    this._transactionService.creditList[this.selectedIndex].OPPREMARKS = this.PartyListFilter[0].AMNT;
    this._transactionService.creditList[this.selectedIndex].OppAcid = this.PartyListFilter[0].ACID[0].A_ACID;
    //console.log("FinalTDSACID", this._transactionService.creditList)
  }
  ChangeDesca(value){
   
    this.PartyListFilter[0].ACID = this._transactionService.creditList.filter(x=>x.acitem.ACNAME == value.target.value)
    
  }
  BaseAmntChange(){
  }
  FilterList :any[]=[];

  // ChangeCRAMNT_WithoutVAT(index){
  //   this._transactionService.creditList[index].CRAMNT=Math.round(((this._transactionService.creditList[index].CRAMNT_WITHOUTVAT*1.13) + Number.EPSILON) * 100) / 100;
  //   this.calculateCrAmount();
  // }

  // CRAMNT_WithoutVAT_RowOk(index,value) {
  //   if(this._transactionService.creditList[index].CRAMNT==null || this._transactionService.creditList[index].CRAMNT==0){
  //     this.masterService.focusAnyControl("Amount_" + index);
  // }else{
  //   this.masterService.focusAnyControl("NarrationCr_" + index);
  // }
  // this.CRAMNTRowOk(index,value);
  // }
}
