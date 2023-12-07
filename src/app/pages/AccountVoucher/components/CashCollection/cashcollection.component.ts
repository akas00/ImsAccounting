import { Component, HostListener, ViewChild } from '@angular/core';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { BillTrack, TAcList } from '../../../../common/interfaces';
@Component({
  selector: 'cash-collection-selector',
  templateUrl: './cashcollection.component.html',
})

export class CashCollection {
  /**Generic Group */
  @ViewChild("genericGridACList")
  genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericeSalesManList")
  genericeSalesManList: GenericPopUpComponent;
  gridCostSalesManPopupSetting: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridCashBankList")
  genericGridCashBankList: GenericPopUpComponent;
  gridCashBankListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridCostCenterList")
  genericGridCostCenterList: GenericPopUpComponent;
  gridCostCenterListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridCCvoucherList")
  genericGridCCvoucherList: GenericPopUpComponent;
  gridCCvoucherListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  /**Initialize Module */
  public DetailList: CashCollection[];
  public CashCollectionObj: CashCollection = <CashCollection>{}
  public SaveCashCollectionObj: Pobj = <Pobj>{};
  userProfile: any = <any>{};
  returnUrl: string;
  CashCollectionBillAmount: number;
  CashCollectionDueAmount: number;
  CashCollectionTotalBalance: number;
  TOTAL_CASHCOLLECTION: number;
  TotalBillCount: number;


  constructor(public masterService: MasterRepo, private loadingService: SpinnerService,
    private _transactionService: TransactionService, private alertService: AlertService,
    private authService: AuthService, private router: Router) {
    this.userProfile = authService.getUserProfile();
    this.reset();
  }

  ngOnInit() {
  }

  reset() {
    this.CashCollectionBillAmount = 0
    this.CashCollectionDueAmount = 0;
    this.CashCollectionTotalBalance = 0;
    this.TotalBillCount=0;
    this.CashCollectionObj = {} as CashCollection;
    this.DetailList = [] as Array<CashCollection>;
    this.CashCollectionObj.TOTAL_CASHCOLLECTION = 0;
    this.CashCollectionObj.RECEIPT_MODE = "cash";
    this.CashCollectionObj.DAYS_BASIS = "BILLDATE_WISE";
    this._transactionService.TrnMainObj.VoucherName = "CashCollection";
    this._transactionService.TrnMainObj.DIVISION = this.userProfile.division;
    this._transactionService.TrnMainObj.PhiscalID = this.userProfile.PhiscalYearInfo.PhiscalID;
    this.masterService.getVoucherNo(this._transactionService.TrnMainObj, "CC").subscribe(res => {
      if (res.status == "ok") {
        this.CashCollectionObj.CC_VCHRNO = res.result.VCHRNO;
      } else {
        alert("Failed to retrieve VoucherNo");
      }
    });
  }

  ValidateSaveObj() {
    if (this.DetailList.length == 0) {
      this.alertService.info("No data to save!");
      return false;
    }

    this.DetailList.forEach(x => {

      let neg_cashcollectedlist = this.DetailList.filter(x => x.CASH_COLLECTION < 0);
      if (neg_cashcollectedlist && neg_cashcollectedlist.length && neg_cashcollectedlist.length > 0) {
        this.alertService.info(`Please enter valid cash collection amount for Bill no ${x.BILL_NO}.`);
        return false;
      }

      let cashcollectedlist = this.DetailList.filter(x => x.CASH_COLLECTION > 0);
      if (cashcollectedlist.length == 0) {
        this.alertService.info(`Please enter cash collected in atleast one row.`);
        return false;
      }

      if (x.CASH_COLLECTION > 0 && (x.CASH_COLLECTION > x.DUE_AMOUNT || x.CASH_COLLECTION < x.DUE_AMOUNT)) {
        this.alertService.info(`Cash Collection should be equal to Due Amount for Bill no ${x.BILL_NO}.`);
        return false;
      } else {
        this.DetailList.forEach(x => {
          x.BALANCE = x.DUE_AMOUNT - x.CASH_COLLECTION;
        })
        this.CalculateSum();
      }
    })

    if (this.CashCollectionObj.CASHBANK_ACID == null ||
      this.CashCollectionObj.CASHBANK_ACID == "" ||
      this.CashCollectionObj.CASHBANK_ACID == undefined) {
      this.alertService.info("Please select Cash/Bank!");
      return false;
    }

  }
  BillList: any[] = [];

  saveClick() {
    if (this.ValidateSaveObj() == false) {
      return;
    }

    if (!this.CashCollectionObj.ENTRYDATE) {
      this.CashCollectionObj.ENTRYDATE = new Date().toJSON().split('T')[0];
      this.changeEntryDate(this.CashCollectionObj.ENTRYDATE, 'AD');
    }
    if (!this.CashCollectionObj.DATE1) {
      this.CashCollectionObj.DATE1 = new Date().toJSON().split('T')[0];
      this.changeDate1(this.CashCollectionObj.DATE1, 'AD');
    }
    if (!this.CashCollectionObj.DATE2) {
      this.CashCollectionObj.DATE2 = new Date().toJSON().split('T')[0];
      this.changeDate2(this.CashCollectionObj.DATE2, 'AD');
    }

    //main and tran data prepare starts
    this._transactionService.initialFormLoad(18,"cashcollection");
    this._transactionService.TrnMainObj.TRNACName = this.CashCollectionObj.CASHBANK_ACNAME;
    this._transactionService.TrnMainObj.TRNAC = this.CashCollectionObj.CASHBANK_ACID;
    this._transactionService.TrnMainObj.REMARKS = this.CashCollectionObj.REMARKS;
    this._transactionService.TrnMainObj.TRNDATE = this._transactionService.TrnMainObj.TRN_DATE = this.CashCollectionObj.ENTRYDATE;
    this._transactionService.TrnMainObj.BSDATE = this._transactionService.TrnMainObj.BS_DATE = this.CashCollectionObj.ENTRY_BSDATE;
    this._transactionService.TrnMainObj.TRNMODE = "Party Receipt";
    this._transactionService.TrnMainObj.TOTAMNT = this._transactionService.TrnMainObj.NETAMNT = this.CashCollectionObj.TOTAL_CASHCOLLECTION;
    this._transactionService.TrnMainObj.TrntranList = [];
    // this._transactionService.TrnMainObj.BillTrackedList = [];

    if (this.DetailList.filter(x => x.CASH_COLLECTION > 0).length > 0 &&
      this.DetailList.filter(x => x.CASH_COLLECTION > x.DUE_AMOUNT).length == 0 &&
      this.DetailList.filter(x => x.BALANCE < 0).length == 0 &&
      this.DetailList.filter(x => x.CASH_COLLECTION < 0).length == 0 &&
      this.DetailList.filter(x => x.CASH_COLLECTION > 0 && (x.CASH_COLLECTION < x.DUE_AMOUNT)).length == 0) {
      this.SaveCashCollectionObj.CashDataList = this.DetailList.filter(x => x.CASH_COLLECTION > 0);

      this.SaveCashCollectionObj.CashDataList.forEach(x => {
        //cashcollection data prepare starts
        x.ENTRYDATE = this.CashCollectionObj.ENTRYDATE;
        x.ENTRY_BSDATE = this.CashCollectionObj.ENTRY_BSDATE;
        x.CASHBANK_ACID = this.CashCollectionObj.CASHBANK_ACID;
        x.CASHBANK_ACNAME = this.CashCollectionObj.CASHBANK_ACNAME;
        x.SALESMAN_ID = this.CashCollectionObj.SALESMAN_ID;
        x.SALESMAN_NAME = this.CashCollectionObj.SALESMAN_NAME;
        x.REMARKS = this.CashCollectionObj.REMARKS;
        x.DIVISION = this.userProfile.division;
        x.PHISCALID = this.userProfile.PhiscalYearInfo.PhiscalID;
        x.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
        x.CC_VCHRNO = this.CashCollectionObj.CC_VCHRNO;
        x.TOTAL_CASHCOLLECTION = this.CashCollectionObj.TOTAL_CASHCOLLECTION;
        x.DATE1 = this.CashCollectionObj.DATE1;
        x.BSDATE1 = this.CashCollectionObj.BSDATE1;
        x.DATE2 = this.CashCollectionObj.DATE2;
        x.BSDATE2 = this.CashCollectionObj.BSDATE2;
        x.RECEIPT_MODE = this.CashCollectionObj.RECEIPT_MODE;
        x.DAYS_BASIS = this.CashCollectionObj.DAYS_BASIS;
        x.CUS_ACID = this.CashCollectionObj.CUS_ACID;
        x.CUS_ACNAME = this.CashCollectionObj.CUS_ACNAME;

        //cashcollection data prepare ends

        var val: any = <any>{ AccountItem: <TAcList>{} }
        val.AccountItem.ACNAME = x.CUSTOMER_ACNAME;
        val.AccountItem.ACID = x.CUSTOMER_ACID;
        val.CRAMNT = x.CASH_COLLECTION;
        this._transactionService.TrnMainObj.TrntranList.push(val);
        for (let x of this._transactionService.TrnMainObj.TrntranList) {
          x.acitem = x.AccountItem;
        }
        this._transactionService.calculateDrCrDifferences();
        //main and tran data prepare ends

        //billtracking data prepare starts
        // let a: BillTrack = <BillTrack>{} //billtracking comment for 1st phase
        // if (x.BALANCE > 0 && x.CASH_COLLECTION > 0) {
        //   a.AMOUNT = x.BALANCE;
        //   a.REFBILL = x.BILL_NO;
        //   a.VCHRNO = this._transactionService.TrnMainObj.VCHRNO;
        //   a.DIVISION = x.DIVISION;
        //   a.ACID = x.CUSTOMER_ACID;
        //   a.REFDIVISION = x.DIVISION;
        //   a.TBillNo = this._transactionService.TrnMainObj.CHALANNO;
        //   a.VOUCHERTYPE = this._transactionService.TrnMainObj.VoucherPrefix;
        //   a.ID = this._transactionService.TrnMainObj.guid;
        //   this._transactionService.TrnMainObj.BillTrackedList.push(a);
        // }
      })
      //billtracking data prepare ends

      let bodyData = { data: this.SaveCashCollectionObj };
      let rv_voucherno = this._transactionService.TrnMainObj.VCHRNO;
      this.masterService.saveCashCollection(bodyData).subscribe(x => {
        if (x.status == "ok") {
          this.masterService.saveTransaction(this._transactionService.TrnMainObj.Mode, this._transactionService.TrnMainObj)
            .subscribe(
              data => {
                if (data.status == "ok") {
                  this.reset();
                  this.alertService.info(`Cash Collection Saved Successfully as Receipt Voucher No. ${data.savedvchrno}`);
                } else {
                  this.alertService.error(x.result);
                }
              }), err => {
                this.alertService.error(err);
              }
        } else {
          this.alertService.error(x.result);
        }
      }), err => {
        this.alertService.error(err);
      }
    }
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this.CashCollectionObj.ENTRY_BSDATE =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      let yearValue = moment(value).year();
      var adDate = adbs.bs2ad(bsDate);
      this.CashCollectionObj.ENTRYDATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeDate1(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this.CashCollectionObj.BSDATE1 =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      let yearValue = moment(value).year();
      var adDate = adbs.bs2ad(bsDate);
      this.CashCollectionObj.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeDate2(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this.CashCollectionObj.BSDATE2 =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      let yearValue = moment(value).year();
      var adDate = adbs.bs2ad(bsDate);
      this.CashCollectionObj.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }


  showAcList() {
    this._transactionService.TrnMainObj.TRNMODE = "Customer_Pay";
    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;
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

  onAcSelect(acItem) {
    this.CashCollectionObj.CUS_ACID = acItem.ACID;
    this.CashCollectionObj.CUS_ACNAME = acItem.ACNAME;
  }

  EnterClick() {
    this.gridCostSalesManPopupSetting = {
      title: "Salesman List",
      apiEndpoints: `/getSalesManPageList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "Name",
          title: "Name",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.genericeSalesManList.show();
  }

  onSalesManSelect(salesman) {
    this.CashCollectionObj.SALESMAN_ID = salesman.SALESMANID;
    this.CashCollectionObj.SALESMAN_NAME = salesman.Name;
  }

  CashBankList() {
    var TRNMODE = "Cash Transfer PV"
    this.gridCashBankListPopupSettings = {
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

    this.genericGridCashBankList.show();
  }

  onCashBankSelect(cashbank) {
    this.CashCollectionObj.CASHBANK_ACID = cashbank.ACID;
    this.CashCollectionObj.CASHBANK_ACNAME = cashbank.ACNAME;
  }

  showCostCenterList(i) {
    this.gridCostCenterListPopupSettings = {
      title: "Cost Centers",
      apiEndpoints: `/getCostCenterPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "COSTCENTERNAME",
          title: "Cost Center Name",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridCostCenterList.show();
  }

  onCostcenterSelect(costcenter) {
    this.CashCollectionObj.COSTCENTER_ID = costcenter.CCID;
    this.CashCollectionObj.COSTCENTER_NAME = costcenter.COSTCENTERNAME;
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "F3") {
      $event.preventDefault();
      this.reset();
    } else if ($event.code == "F6") {
      $event.preventDefault();
      this.saveClick();
    } else if ($event.code == "F10") {
      $event.preventDefault();
      this.back();
    }
  }

  back() {
    this.returnUrl = "/pages/dashboard/dashboard";
    this.router.navigate([this.returnUrl]);
  }

  loadsalesdata() {
    // if (this.CashCollectionObj.CUS_ACID == "" ||
    //   this.CashCollectionObj.CUS_ACID == null ||
    //   this.CashCollectionObj.CUS_ACID == undefined) {
    //   this.alertService.info("Please select customer.");
    //   return;
    // }
    this.loadingService.show("Please wait. Data is Loading.")
    let cashCollectionParameters = <CashCollection>{}
    cashCollectionParameters.DATE1 = this.CashCollectionObj.DATE1 ? this.CashCollectionObj.DATE1 : new Date().toJSON().split('T')[0];
    cashCollectionParameters.DATE2 = this.CashCollectionObj.DATE2 ? this.CashCollectionObj.DATE2 : new Date().toJSON().split('T')[0];
    cashCollectionParameters.AREA_ID = this.CashCollectionObj.AREA_ID ? this.CashCollectionObj.AREA_ID : '%';
    cashCollectionParameters.SALESMAN_ID = this.CashCollectionObj.SALESMAN_ID ? this.CashCollectionObj.SALESMAN_ID : '%';
    cashCollectionParameters.RECEIPT_MODE = '%';
    cashCollectionParameters.DAYS_BASIS = '%';
    cashCollectionParameters.CASHBANK_ACID = this.CashCollectionObj.CASHBANK_ACID ? this.CashCollectionObj.CASHBANK_ACID : '%';
    cashCollectionParameters.CUS_ACID = this.CashCollectionObj.CUS_ACID ? this.CashCollectionObj.CUS_ACID : '%';
    cashCollectionParameters.COSTCENTER_ID = this.CashCollectionObj.COSTCENTER_ID ? this.CashCollectionObj.COSTCENTER_ID : '%';
    cashCollectionParameters.DIVISION = this.userProfile.division;
    cashCollectionParameters.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
    cashCollectionParameters.PHISCALID = this.userProfile.PhiscalYearInfo.PhiscalID;
    cashCollectionParameters.VIEWMODE = 0;
    cashCollectionParameters.VNO = 0;

    this.masterService.getCashCollectionDetails(cashCollectionParameters).subscribe(res => {
      if (res.status == 'ok') {
        this.loadingService.hide();
        if (res.result == 0) {
          this.alertService.info(`No data found.`);
          return;
        }
        this.DetailList = [];

        for (let i of res.result) {
          var load_val: any = <CashCollection>{};
          load_val.CUSTOMER_ACID = i.ACID;
          load_val.CUSTOMER_ACNAME = i.CUSTOMERNAME;
          load_val.BILL_NO = i.BILLNO;
          load_val.BILL_DATE = this._transactionService.transformDate(i.BILLDATE);
          load_val.BILL_BSDATE = i.BSDATE;
          load_val.DUE_DATE = this._transactionService.transformDate(i.DUEDATE);
          load_val.BILL_AMOUNT = i.BILLAMOUNT;
          load_val.DUE_AMOUNT = i.DUEAMOUNT;
          load_val.BALANCE = i.DUEAMOUNT;
          load_val.IS_CHECKED = false;
          load_val.CASH_COLLECTION = 0;
          load_val.RECEIPT_NO = "";
          this.DetailList.push(load_val);
        }
        this.CalculateSum();
      } else {
        this.alertService.error(res.result._body);
        this.loadingService.hide();
      }
    }), err => {
      this.alertService.error(err);
      this.loadingService.hide();
    }
  }

  CalculateSum() {
    this.CashCollectionBillAmount = 0;
    this.CashCollectionDueAmount = 0;
    this.CashCollectionTotalBalance = 0;
    this.CashCollectionObj.TOTAL_CASHCOLLECTION = 0;
    this.TotalBillCount=0;
    this.DetailList.forEach(x => {
      this.CashCollectionBillAmount += Number(x.BILL_AMOUNT);
      this.CashCollectionDueAmount += Number(x.DUE_AMOUNT);
      this.CashCollectionTotalBalance += Number(x.BALANCE);
      this.CashCollectionObj.TOTAL_CASHCOLLECTION += Number(x.CASH_COLLECTION);
    })
    this.TotalBillCount=this.DetailList && this.DetailList.length;
  }


  CalculateBal(index) {
    if (this.DetailList[index].CASH_COLLECTION > 0 &&
      (this.DetailList[index].CASH_COLLECTION < this.DetailList[index].DUE_AMOUNT ||
        this.DetailList[index].CASH_COLLECTION > this.DetailList[index].DUE_AMOUNT)) {
      this.alertService.info("Cash Collection should be equal to  Due Amount.");
      return;
    }
    this.DetailList[index].BALANCE = this.DetailList[index].DUE_AMOUNT - this.DetailList[index].CASH_COLLECTION;
    this.CalculateSum();
  }

  ChooseCashCollection(event: any, index) {
    this.calculation(event.target.checked, index);
  }

  calculation(isChecked: boolean, index: any) {
    if (isChecked) {
      this.DetailList[index].CASH_COLLECTION = this.DetailList[index].DUE_AMOUNT;
      this.DetailList[index].IS_CHECKED = true;
      this.DetailList[index].BALANCE = 0;
    } else {
      this.DetailList[index].CASH_COLLECTION = 0;
      this.DetailList[index].IS_CHECKED = false;
      this.DetailList[index].BALANCE = this.DetailList[index].DUE_AMOUNT;
    }
    this.CalculateSum();
  }

  handleChange(event: any) {
    // Handle the change event here
    if (event.target.checked == true) {
      this.DetailList.forEach(x => {
        x.CASH_COLLECTION = x.DUE_AMOUNT;
        x.BALANCE = x.DUE_AMOUNT - x.CASH_COLLECTION;
        x.IS_CHECKED = true;
      })
    } else {
      this.DetailList.forEach(x => {
        x.CASH_COLLECTION = 0;
        x.BALANCE = x.DUE_AMOUNT;
        x.IS_CHECKED = false;
      })
    }
    this.CalculateSum();
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  onViewClicked() {
    this.gridCCvoucherListPopupSettings = this.masterService.getGenericGridPopUpSettings("CC", "CC");
    this.genericGridCCvoucherList.show();
  }

  onVoucherDoubleClick(event) {
    this.CashCollectionObj.MODE = "VIEW";
    this.masterService.LoadCashCollection(event.CC_VCHRNO).subscribe(res => {
      if (res.result && res.result.length && res.result.length > 0) {
        this.DetailList = res.result;
        this.CalculateSum();
        this.DetailList.forEach(x => {
          if (x.BALANCE == 0) {
            x.IS_CHECKED = true;
          }
        })
        this.CashCollectionObj.CC_VCHRNO = event.CC_VCHRNO;
        this.CashCollectionObj.RV_VCHRNO = res.result[0].RV_VCHRNO;
        this.CashCollectionObj.CASHBANK_ACNAME = res.result[0].CASHBANK_ACNAME;
        this.CashCollectionObj.CUS_ACNAME = res.result[0].CUSTOMER_ACNAME;
        this.CashCollectionObj.REMARKS = res.result[0].REMARKS;
        this.CashCollectionObj.ENTRYDATE = res.result[0].ENTRYDATE;
        this.CashCollectionObj.ENTRY_BSDATE = res.result[0].ENTRY_BSDATE;
        this.CashCollectionObj.DATE1 = res.result[0].DATE1;
        this.CashCollectionObj.BSDATE1 = res.result[0].BSDATE1;
        this.CashCollectionObj.DATE2 = res.result[0].DATE2;
        this.CashCollectionObj.BSDATE2 = res.result[0].BSDATE2;
        this.CashCollectionObj.SALESMAN_NAME = res.result[0].SALESMAN_NAME;
        this.CashCollectionObj.CUS_ACNAME = res.result[0].CUS_ACNAME;
      }
    });
  }
}

export interface Pobj {
  CashDataList: CashCollection[];
}
export interface CashCollection {
  VIEWMODE: any;
  VNO: any;
  ENTRYDATE: Date | string;
  ENTRY_BSDATE: string;
  DATE1: Date | string;
  DATE2: Date | string;
  BSDATE1: Date | string;
  BSDATE2: Date | string;
  AREA_ID: string;
  AREA_NAME: string;
  SALESMAN_ID: string;
  SALESMAN_NAME: string;
  RECEIPT_MODE: string;
  DAYS_BASIS: string;
  CUS_ACID: string;
  CUS_ACNAME: string;
  COSTCENTER_ID: string;
  COSTCENTER_NAME: string;
  REMARKS: string;

  CUSTOMER_ACID: string;
  CUSTOMER_ACNAME: string;
  BILL_NO: string;
  BILL_DATE: Date | string;
  BILL_BSDATE: Date | string;
  DUE_DATE: Date | string;
  BILL_AMOUNT: number;
  DUE_AMOUNT: number;
  BALANCE: number;
  IS_CHECKED: boolean;
  CASH_COLLECTION: number;
  RECEIPT_NO: number;
  CASHBANK_ACID: string;
  CASHBANK_ACNAME: string;
  DIVISION: string;
  PHISCALID: string;
  COMPANYID: string;
  CC_VCHRNO: string;
  RV_VCHRNO: string;
  MODE: string;
  TOTAL_CASHCOLLECTION: number;
}
