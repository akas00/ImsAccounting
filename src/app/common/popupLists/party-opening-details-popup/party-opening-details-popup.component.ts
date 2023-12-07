import {
  Component,
  Output,
  EventEmitter,
  Injector,
  HostListener
} from "@angular/core";
import { debounce } from "../generic-grid/generic-popup-grid.component";
import { TransactionService } from "../../Transaction Components/transaction.service";
import { VoucherTypeEnum, PartyOpeningDetail } from "../../interfaces";
import { AlertService } from "../../services/alert/alert.service";
import * as moment from 'moment';

@Component({
  selector: "party-opening-details-popup",
  templateUrl: "./party-opening-details-popup.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class PartyOpeningDetailsPopUpComponent {
  isActive: boolean = false;
  currentIndex: number = 0;
  acType: string = "";

  @Output() onPopUpClose = new EventEmitter();
  @Output() onOkClick = new EventEmitter();
  @Output() emitEvent = new EventEmitter();

  voucherType: VoucherTypeEnum;

  constructor(
    public _trnMainService: TransactionService,
    private alertService : AlertService
    ) {
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
  }

  show(index: number, acType: string) {
    this.currentIndex = index;
    this.acType = acType;


    ////console.log("length",this._trnMainService.TrnMainObj.TrntranList);

    if (
      !this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails ||
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails.length == 0
    ) {
      this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].PartyDetails = [];
      this.addRow();
  //     for(let i of this._trnMainService.TrnMainObj.TrntranList){
  //       if(i.PartyDetails[this.currentIndex].AMOUNT){
  //         console.log(acType)
  // if(acType=='crAmt'){
  //       this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[this.currentIndex].AMOUNT=this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].CRAMNT
  //     }else  if(acType=='drAmt'){
  //       this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[this.currentIndex].AMOUNT=this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].DRAMNT
  //     }
  //       }
  //     }
    }

      if(this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.length==1){
        if (this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[0].CLRAMOUNT==0) {
          this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[0].AMOUNT =
            this.acType == "drAmt" ? this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].DRAMNT : this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].CRAMNT;
        }
        this.onAmountChange(0);
      }

    this.isActive = true;
    this._trnMainService.disableSaveButton=true;
  }

  addRow(index: number = -1) {
    let dueTotal = this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.reduce(
      (sum, x) =>
        sum +
        (this._trnMainService.nullToZeroConverter(x.AMOUNT) -
          this._trnMainService.nullToZeroConverter(x.CLRAMOUNT)),
      0);

    if (index != -1) {
      let current = this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].PartyDetails[index];
       if (current.REFVNO == "") {
        alert("Voucher No is Required.");
        return;
      } else if (current.AMOUNT <= 0 || current.CLRAMOUNT < 0) {
        alert("AMOUNT and CLEAR AMOUNT is required and can not be less than 0.");
        return;
      }
      else if ((current.AMOUNT - current.CLRAMOUNT) <= 0) {
        alert("Amount Should be Greater than Clear Amount.");
        return;
      }
    }


    if(index != -1 && this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.length > index+1){
      return true;
    }

    var newItem = Object.assign(<PartyOpeningDetail>{}, {
      VCHRNO: this._trnMainService.TrnMainObj.VCHRNO,
      DIVISION: this._trnMainService.TrnMainObj.DIVISION,
      REFVNO: "",
      ACID: this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .AccountItem.ACID,
      REFDATE: "",
      AMOUNT: 0,
      CLRAMOUNT: 0,
      DUEDATE: "",
      REFSNO: "",
      PHISCALID: this._trnMainService.TrnMainObj.PhiscalID,
      REF_BSDATE: "",
      DUE_BSDATE: ""
    });
    this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.push(newItem);

    if (dueTotal == 0) {
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[0].AMOUNT =
        this.acType == "drAmt" ? this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].DRAMNT : this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].CRAMNT;
        this.onAmountChange(0);
    }
  }

  onAmountChange(i : number) {

    if(i != -1){
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].DUEAMT
      = this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].AMOUNT
      - this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].CLRAMOUNT;
console.log("n", this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].DUEAMT)
      if(this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].DUEAMT)<=0){
        alert("Amount Should be Greater than Clear Amount.");
        return;
      }
    }

    let dueTotal = this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.reduce(
      (sum, x) =>
        sum +
        (this._trnMainService.nullToZeroConverter(x.AMOUNT) -
          this._trnMainService.nullToZeroConverter(x.CLRAMOUNT)),
      0
    );

    this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].CRAMNT = 0;
    this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].DRAMNT = 0;
    if (this.acType == "drAmt") {
      this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].DRAMNT = Number(dueTotal.toFixed(2));
    } else if (this.acType == "crAmt") {
      this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].CRAMNT = Number(dueTotal.toFixed(2));


      console.log("dueTotal",dueTotal)
    }
  }

  deleteRow(index: number) {
    this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.splice(index, 1);
    if (
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails.length == 0
    ) {
      this.addRow();
    }
    this.onAmountChange(-1);
  }

  apply(event:any) {
    if(this.validateDetailEntry()){
      this.onAmountChange(-1);
      this.currentIndex = 0;
      this.acType = "";
      this.isActive = false;
      this.onPopUpClose.emit(true);
      this.emitEvent.emit(true);
      this._trnMainService.disableSaveButton=false;
    }else{
      this._trnMainService.disableSaveButton=true;
    }


   
  }

  hide(){
    if(this._trnMainService.userSetting.enablepartyopeningdetails==1){
    if(this.validateDetailEntry()){
    // this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails=[]
    this.isActive = false;
    // this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].CRAMNT = null;
    // this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].DRAMNT = null;
    this.onPopUpClose.emit(true);
      this._trnMainService.disableSaveButton=false; 
    }
  }else{
    this.isActive = false;
    this.onPopUpClose.emit(true);
    this._trnMainService.disableSaveButton=false; 
  }
  }

  validateDetailEntry() {
//    var validate=this._trnMainService.TrnMainObj.TrntranList[0].PartyDetails.filter(x => (x.REFVNO == "" && (x.AMOUNT <= 0 || x.CLRAMOUNT < 0) && x.DUEAMT <= 0))
//    console.log("@",validate) 
//    if (validate && validate.length) {
//       alert("Party Opening Details are required");
// return true;
//     }
      let REFVNO = this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.filter(x => x.REFVNO == ""||x.REFVNO==null);
     
      if (REFVNO && REFVNO.length) {
        alert("Voucher No is Required.");
        this._trnMainService.disableSaveButton=true;
        return false;
      }
      let AMOUNT = this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.filter(x => (x.AMOUNT <= 0 || x.CLRAMOUNT < 0));
      if (AMOUNT && AMOUNT.length) {
        alert("AMOUNT and CLEAR AMOUNT is required and can not be less than 0.");
        this._trnMainService.disableSaveButton=true;
        return false;
      }
      let dueamnt = this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.filter(x => x.DUEAMT <= 0);
      if (dueamnt && dueamnt.length) {
        alert("Amount Should be Greater than Clear Amount.");
        this._trnMainService.disableSaveButton=true;
        return false;
      }
    
      let DUEDAYS = this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.filter(x => x.DUEDAYS == 0);
      if (DUEDAYS && DUEDAYS.length) {
        alert("DUEDAYS should be greater than zero.");
        this._trnMainService.disableSaveButton=true;
        return false;
      }
    return true;
  
}

  changeEntryDate(value, format: string, currentIndex, i) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._trnMainService.TrnMainObj.TrntranList[currentIndex]
        .PartyDetails[i].REF_BSDATE = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      var adDate1 = adbs.bs2ad(bsDate1);
      this._trnMainService.TrnMainObj.TrntranList[currentIndex]
        .PartyDetails[i].REFDATE = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
    }
  }

  changeDueDate(value, format: string, currentIndex, i) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._trnMainService.TrnMainObj.TrntranList[currentIndex]
        .PartyDetails[i].DUE_BSDATE = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      const bsDate1 = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      var adDate1 = adbs.bs2ad(bsDate1);
      this._trnMainService.TrnMainObj.TrntranList[currentIndex]
        .PartyDetails[i].DUEDATE = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
    }
    var date=new Date()
    const firtDateMs = date.getTime();
    const secondDateMs = (new Date(this._trnMainService.TrnMainObj.TrntranList[currentIndex]
      .PartyDetails[i].DUEDATE)).getTime();
      if(secondDateMs < date.getTime()){
        alert("Due Date cannot be less than current date")
        this._trnMainService.TrnMainObj.TrntranList[currentIndex]
      .PartyDetails[i].DUEDAYS=0;
        return;
      }
    const Difference_In_Days = Math.ceil(Math.abs(firtDateMs - secondDateMs) / (1000 * 60 * 60 * 24));

    // let m = moment(this._trnMainService.TrnMainObj.TrntranList[currentIndex]
    //   .PartyDetails[i].DUEDATE);
    // let days = m.diff(date, 'days');
    // if(days<0){
    //   alert("Due Date cannot be less than ")
    // }else{
      this._trnMainService.TrnMainObj.TrntranList[currentIndex]
      .PartyDetails[i].DUEDAYS=Difference_In_Days;
    // }
  }
  daysChange(value,currentIndex, i){
    var date=new Date()
  let m = moment(date);
  let days = m.add(value, 'days');;
  this._trnMainService.TrnMainObj.TrntranList[currentIndex].PartyDetails[i].DUEDATE=(days.toDate()).toLocaleDateString('en-CA')
  this.changeDueDate (this._trnMainService.TrnMainObj.TrntranList[currentIndex].PartyDetails[i].DUEDATE,'AD',currentIndex,i)
}
  @HostListener("document : keydown", ["$event"])
  @debounce(20)
  updown($event: KeyboardEvent) {
    if (!this.isActive) return true;
    if ($event.code == "Escape") {
      $event.preventDefault();
      this.hide();
    }
  }
}
