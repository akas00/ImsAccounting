import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { xor } from 'lodash';
import { ModalDirective } from 'ng2-bootstrap';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'PaymentCollection',
  templateUrl: './PaymentCollection.component.html'
})

export class PaymentCollection {
  /**Generic Group */
  @ViewChild("genericGridACList")
  genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericVchrnoList")
  genericVchrnoList: GenericPopUpComponent;
  gridvchrnoListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericeSalesManList")
  genericeSalesManList: GenericPopUpComponent;
  gridCostSalesManPopupSetting: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild('ShowDate') ShowDate: ModalDirective;

  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild('ShowCellPay') ShowCellPay: ModalDirective;
  /**Initialize Module */
  public DetailList: PaymentCollection[];
  public DetailObj: PaymentCollection = <PaymentCollection>{}
  public PayMainObj: Pobj = <Pobj>{};
  mode: any;
  custAcid: any
  rowIndex: any;
  isViewMode: boolean = false;
  SelectedPopupDate: any;
  EntryDate: any = <any>{};
  BSDATE: string;
  @ViewChild ('customerInput') customerInput:ElementRef;
  @ViewChild ('chequeDate') chequeDate:ElementRef;
  CellPayForm: FormGroup;

  constructor(public masterService: MasterRepo, private loadingService: SpinnerService,
    private _transactionService: TransactionService, private alertService: AlertService,
    private router: Router,private _fb: FormBuilder) {
    this.reset();
    // this.masterService.focusAnyControl("ACCODEInput_Cust" + 1)
    this._transactionService.DrillMode = "New";
    this.CellPayForm = this._fb.group({
      merchant_id: [''],
      product_id: [''],
      description: [''],
      amount: [''],
      quantity: [''],
      invoice_number: [''],
      sucess_callback: [''],
      failure_callback: [''],
      transaction_type: [''],
      cancel_callback: [''],
      is_live: ['']

  });
  }

  reset() {
    var guid = null;
    const uuidV1 = require('uuid/v1');
    guid = uuidV1();
    this.DetailObj = {} as PaymentCollection;
    this.DetailList = [] as Array<PaymentCollection>
    var nulltt = <any>{};
    nulltt.customerName = ''
    nulltt.BillNo = '';
    nulltt.Amount = 0;
    nulltt.PaymentMode = 'Cheque',
      nulltt.ChequeDate = this._transactionService.transformDate(new Date()),
      nulltt.ChequeNo = '',
      nulltt.CostCenter = '';
    nulltt.isChequeMode = true;
    nulltt.GUID = guid;
    nulltt.IsStatusOne = false;
    nulltt.STATUS = '0';
    this.DetailList.push(nulltt);
    this.isViewMode = false;
    this.mode = "NEW";
    this.EntryDate.RECEIVEDATEIS = this._transactionService.transformDate(new Date());
    this.changeEntryDate(this.EntryDate.RECEIVEDATEIS,'AD')
    // this.masterService.focusAnyControl("ACCODEInput_Cust" + 0)
    setTimeout(()=>{
      this.customerInput.nativeElement.focus();
    },10);
    this.rowIndex=0;

  }

  ngAfterViewInit() { }

  saveClick() {
    this.ValidateSaveObj();
   
    

    // ////console.log("@@this.DetailList",this.DetailList)
    let EmptyChequeNo = this.DetailList.filter(x => x.PaymentMode == "Cheque" && x.ChequeNo == "")
    ////console.log("EmptyChequeNo", EmptyChequeNo)
    if (EmptyChequeNo.length > 0) {
      this.alertService.info("Please Enter Cheque No. and Cheque Date for Payment Mode Cheque");
return;
    }

    if (this._transactionService.subtractDates(this._transactionService.transformDatetoMMddYY(new Date()), this._transactionService.transformDatetoMMddYY(this.EntryDate.RECEIVEDATEIS)) > 0) {
      this.alertService.info("Received Date should not be future date!")
      return;
    }
    this.PayMainObj.PList = this.DetailList;
    if (!this.EntryDate.RECEIVEDATEIS) {
      this.EntryDate.RECEIVEDATEIS = this._transactionService.transformDate(new Date());
    }

    this.EntryDate.mode = this.mode;
    let bodyData = { data: this.PayMainObj, EntryDate: this.EntryDate };
    if (this.DetailList.length > 0) {
      this.loadingService.show("Please wait. Saving Payment Collection.")
      this.masterService.savePaymentCollection(bodyData).subscribe(x => {
        if (x.status == "ok") {
          this.reset();
          this.loadingService.hide();
          this.alertService.info("Payment Collection saved successfully.");
        } else {
          this.loadingService.hide();
          this.alertService.error(x.result);
        }
      }, error => {
        this.loadingService.hide();
        // ////console.log("@@error",error)
      })
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
        this.EntryDate.BSDATE =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }


      // this.VoucherEntry.BSDATE1.disableBefore = 5/4/2020;
    }
    else if (format == "BS") {
      var datearr = value.split('/');
    const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      let yearValue = moment(value).year();
      ////console.log("momentyes", yearValue);
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);

      this.EntryDate.RECEIVEDATEIS = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));


    }

  }
 ValidateSaveObj() {
    this.DetailList.forEach(element => {
      let indexnum = 0
      if (element.ACID) {
        if (element.ACID == '' || element.ACID == undefined || element.ACID == null) {
          indexnum += 1
          this.DetailList.splice(indexnum);
          return true;
        }
      }
      if (!element.ACID) {
        this.DetailList.splice(-1);
      }
    });
    
    const index = this.DetailList.findIndex(x => x.STATUS == '1');
    if (index >= 0) {
      this.DetailList.splice(index);
    }
    this.DetailList.forEach(element => {
      if(element.Amount <= 0){
        this.alertService.warning("Amount is missing")
        return;
      }
    })

  }
  NextRow() {
    if (this.DetailList.length > 0) {
      if (!this.DetailList[this.DetailList.length - 1].ACID) {
        return;
      }
    }

    var guid = null;
    const uuidV1 = require('uuid/v1');
    guid = uuidV1();
    this.rowIndex = this.rowIndex + 1;
    this.DetailObj = {} as PaymentCollection;
    this.DetailObj.PaymentMode = 'Cheque',
      this.DetailObj.isChequeMode = true;
    this.DetailObj.ChequeDate = this._transactionService.transformDate(new Date());
    this.DetailObj.GUID = guid;
    this.DetailObj.IsStatusOne = false;
    this.DetailObj.STATUS = '0';
    this.DetailList.push(this.DetailObj);




  }
  NewRowForSalesman() {
    if (this.DetailList.length > 0) {
      if (!this.DetailList[this.DetailList.length - 1].ACID) {
        return;
      }
    }

    var guid = null;
    const uuidV1 = require('uuid/v1');
    guid = uuidV1();
    
    this.DetailObj = {} as PaymentCollection;
    this.DetailObj.PaymentMode = 'Cheque',
      this.DetailObj.isChequeMode = true;
    this.DetailObj.ChequeDate = this._transactionService.transformDate(new Date());
    this.DetailObj.GUID = guid;
    this.DetailObj.IsStatusOne = false;
    this.DetailObj.STATUS = '0';
    this.DetailList.push(this.DetailObj);




  }

  showAcList(i) {
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
    ////console.log("ChecKVa@", acItem, this.rowIndex);
    this.DetailList[this.rowIndex].customerName = acItem.ACNAME;
    this.DetailList[this.rowIndex].ACID = this.custAcid = acItem.ACID;
    this.masterService.focusAnyControl('BillInput' + this.rowIndex);
    // this.onBillShow();


  }

  onBillShow() {
    if (!this.custAcid) { this.alertService.warning("Please select the customer first!") }
    this.gridvchrnoListPopupSettings = {
      title: "BillList",
      apiEndpoints: `/getAllTrnMainFromParty/${this.custAcid}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "vchrno",
          title: "VCHRNO",
          hidden: false,
          noSearch: false
        },
        {
          key: "trndate",
          title: "TRNDATE",
          hidden: false,
          noSearch: false
        },
        {
          key: "billto",
          title: "CUSTOMER",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridACList.hide();
    this.genericVchrnoList.show();
  }

  rowClick(i) {
    this.rowIndex = i;

  }

  onVchrnoSelect(value) {
    this.DetailList[this.rowIndex].BillNo = value.vchrno;
    // this.DetailList[this.rowIndex].Amount = value.netamnt;
    this.genericGridACList.hide();
    this.masterService.focusAnyControl('amountInput' + this.rowIndex);
  }

  clearRow(value) {
    this.DetailList.splice(this.rowIndex);

  }

  onSalesManSelect(value) {
    this.DetailList[this.rowIndex].CostCenter = value.Name;
    this.rowIndex=this.rowIndex+1;
    this.masterService.focusAnyControl('ACCODEInput_Cust' + this.rowIndex);
  }

  EnterClick() {
    this.gridCostSalesManPopupSetting = {
      title: "Salesman List",
      apiEndpoints: `/getSalesManPageList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "Name",
          title: "Salesman",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.genericeSalesManList.show();
  }

  DisableInputFunction() {
    if (this.mode == 'EDIT') {
      this
    }
  }

  ChangePMode(value) {



    this.DetailList[this.rowIndex].ChequeNo = '';
    this.DetailList[this.rowIndex].PaymentMode == "Cheque" ?
      this.DetailList[this.rowIndex].isChequeMode = true :
      this.DetailList[this.rowIndex].isChequeMode = false
    if (this.DetailList[this.rowIndex].PaymentMode == "Cheque") {
      this.DetailList[this.rowIndex].ChequeDate = this._transactionService.transformDate(new Date());
      // document.getElementById('chequeNo_Pay'+this.rowIndex).focus();
      // this.masterService.focusAnyControl("chequeNo_Pay"+this.rowIndex);
    } else {
      this.DetailList[this.rowIndex].ChequeDate = null;
      this.masterService.focusAnyControl("sm_Pay"+this.rowIndex);
      // this.checkValidation(this.DetailList[this.rowIndex]);
    }

  }

  checkValidation(i) {

    let sameCustomer = this.DetailList.filter(x => x.customerName == i.customerName && x.BillNo == i.BillNo && x.CostCenter == i.CostCenter)
    if (sameCustomer.length > 1) {
      if (confirm("Same Customer, Bill No. and Costcenter detected. Do you want to continue?")) {
      } else {
        return;
      }
    }

    if (i.customerName && i.customerName != "") {
      if (i.PaymentMode == "Cheque") {
        if (i.ChequeNo === "" || i.ChequeNo == null || i.ChequeNo === undefined || i.ChequeNo == undefined) {
          this.alertService.info("Please Enter Cheque No.");
          return;
        }
        if (!i.ChequeDate) {
          this.alertService.info("Please Enter Cheque Date.");
          return;
        }
      }
    }

    if (this.mode == 'NEW') {
      
      if (i.customerName && i.customerName != "") {
        this.NewRowForSalesman();
      
  
    
      }
    }

  }

  SelectDate() {
    this.ShowDate.show();
  }

  ShowDateOk() {
    this.masterService.getReceiveLogDataFromDate(this.SelectedPopupDate, 'PC').subscribe((x => {
      if (x.status == 'ok') {
        this.DetailList.splice(0);
        if (x.result) {
          for (let i of x.result) {
            var val: any = <PaymentCollection>{};
            val.customerName = i.customerName;
            val.BillNo = i.BillNO;
            val.Amount = i.Amount;
            val.PaymentMode = i.PaymentMode;
            val.ChequeNo = i.ChequeNo;
            val.ChequeDate = this._transactionService.transformDate(i.ChequeDate);
            val.CostCenter = i.CostCenter;
            this.DetailList.push(val)
          }
        }
        this.ShowDate.hide();
      }
    }))
  }

  ShoWdateClose() {
    this.ShowDate.hide()
  }

  view() {
    this.mode = "VIEW";
    this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings('PAYMENTCOLLECTION');
    this.genericGrid.show('', false, "paymentcollectionview");

  }

  edit() {
    this.mode = "EDIT";
    this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings('PAYMENTCOLLECTION');
    this.genericGrid.show('', false, "paymentcollectionedit");
  }

  delete() {
    this.masterService.deletePaymentCollection(this.SelectedPopupDate).subscribe(x => {
      if (x.status == 'ok') {
        this.reset();
      }
    })
  }

  onItemDoubleClick(event) {
    this.SelectedPopupDate = event.RECEIVEDATE;
    this.masterService.getReceiveLogDataFromDate(this.SelectedPopupDate, 'PC').subscribe((x => {
      if (x.status == 'ok') {
        if (x.result.length == 0) {
          this.ShowDate.hide();
          this.alertService.info(`No data found on ${this.SelectedPopupDate}`);
          return;
        }

        this.DetailList = [];
        if (x.result) {
          for (let i of x.result) {
            var val: any = <PaymentCollection>{};
            // ////console.log("@@i",i)
            val.customerName = i.customerName;
            val.BillNo = i.BillNO;
            val.Amount = i.Amount;
            val.PaymentMode = i.PaymentMode;
            val.ChequeNo = i.ChequeNo;
            if (i.PaymentMode == "Cheque") {
              val.ChequeDate = this._transactionService.transformDate(i.ChequeDate);
              val.isChequeMode = true;
            }
            val.CostCenter = i.CostCenter;
            val.STATUS = i.STATUS;
            val.ACID = i.ACID;
            val.GUID = i.GUID;
            if (i.STATUS == '1') {
              val.IsStatusOne = true;
            }
            this.DetailList.push(val);
            this.EntryDate.RECEIVEDATEIS = this._transactionService.transformDate(i.ReceiveDate);
          }
        }
        this.ShowDate.hide();
      }
    }))

    if (this.mode == "EDIT") {
      this.isViewMode = false;
    } else if (this.mode == "VIEW") {
      this.isViewMode = true;
    }

  }

  focusPmode(value) {
    this.masterService.focusAnyControl('PmodeInput' + this.rowIndex);
  }

  focusChequeDate(value) {
    this.masterService.focusAnyControl('chequeDate' + this.rowIndex);
  }

  focusSalesman(value) {
    this.masterService.focusAnyControl('sm_Pay' + this.rowIndex);
    // this.checkValidation(this.DetailList[this.rowIndex]);
  }

  focusCustomer(){
    setTimeout(()=>{
      this.customerInput.nativeElement.focus();
    },10);
    this.rowIndex=0;
  }

  focusChequeNo(i){
    if(i.PaymentMode == "Cheque"){
      this.masterService.focusAnyControl('chequeNo_Pay' + this.rowIndex);
    }
  }

  Focus_Salesman(){
    this.checkValidation(this.DetailList[this.rowIndex]);
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    
    if ($event.code == "F3") {
      $event.preventDefault();
      this.reset();
    } else if ($event.code == "F6") {
      $event.preventDefault();
     
        this.saveClick();
    }
    else if ($event.code == "F5") {
      $event.preventDefault();
      this.edit();
    } else if ($event.code == "F4") {
      $event.preventDefault();
      this.view();
    }else if ($event.code == "F10") {
      $event.preventDefault();
      this.back();
    }


  }
  returnUrl : string;
  back(){
    this.returnUrl = "/pages/dashboard/dashboard";
    this.router.navigate([this.returnUrl]);
  }
  

}

export interface Pobj {
  PList: PaymentCollection[];
}
export interface PaymentCollection {
  customerName: string;
  BillNo: string;
  Amount: number;
  PaymentMode: string;
  ChequeNo: string;
  ChequeDate: Date | string;
  CostCenter: string;
  ACID: string;
  isChequeMode: boolean;
  GUID: string;
  IsStatusOne: boolean;
  STATUS: string;

}
