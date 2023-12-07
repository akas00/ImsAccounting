import {Component, ViewChild} from '@angular/core';
import { AbstractControlDirective } from '@angular/forms';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { TwoDigitNumber } from '../../../../theme/pipes';
@Component({
    selector: 'party-balance-confirmation',
    templateUrl: './party-balance-confirmation.component.html',
    providers:[TwoDigitNumber]
    // styleUrls: ['./party-balance-confirmation.component.styl']
})
export class PartyBalanceConfirmationComponent {

  @ViewChild("genericGridACList")  genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  rowIndex = 0;
  custAcid: any;
  customerName:string;

  PartyInfo = [];
  costlists=[];
  public PartyBalanceData: PARTYBALANCE = <PARTYBALANCE>{}




  constructor(
    private _transactionService: TransactionService,
    public masterService: MasterRepo,
    private authService: AuthService,
  ){
    this.userProfile = this.authService.getUserProfile();
      this.PartyBalanceData.DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
      this.changeEntryDate(this.PartyBalanceData.DATE1, "AD");
      this.PartyBalanceData.DATE2 = this.masterService.PhiscalObj.EndDate.split('T')[0];
      this.changeEndDate(this.PartyBalanceData.DATE2, "AD");
      this.PartyBalanceData.INCLUDECASHTRANSACTION=0
      this.masterService.getAllNEWCostCenter().subscribe(res => {
        if (res) {
          this.costlists = res.result;
        }
      }, error => {
        this.costlists = [];
      });
      this.PartyBalanceData.PARTYTYPE="C";
     
    }

  showAcList(i) {
    this._transactionService.TrnMainObj.TRNMODE = "SinglePayment_Party";
    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;
    if(this.PartyBalanceData.PARTYTYPE=="C"){
      TRNMODE="PartyBalance_Customer";
    }else{
    TRNMODE = "SinglePayment_Party";
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
  // ngOnInit(){
  //   this.changeEntryDate(this.PartyBalanceData.DATE1, "AD");
  //   this.changeEndDate(this.PartyBalanceData.DATE2, "AD");

  // }

  onAcSelect(acItem) {
    //console.log('sdgfgsdh', acItem);
     this.PartyBalanceData.CUSTOMERNAME = acItem.ACNAME;
     this.PartyBalanceData.ACID=acItem.ACID;
     this.PartyBalanceData.PANNO=acItem.VATNO
     this.PartyBalanceData.COMPANYADDRESS=acItem.ADDRESS
    //  this.setFocus();

}

setFocus() {
  document.getElementById('Name0').focus();
}
onLoad(){
  // //console.log('hello its working',this.PartyBalanceData);
  this.PartyBalanceData.DIVISION=this.userProfile.CompanyInfo.INITIAL;
  this.PartyBalanceData.PHISCALID=this.userProfile.CompanyInfo.PhiscalID;
  this.PartyBalanceData.COMPANYID=this.userProfile.CompanyInfo.COMPANYID;
  if(!this.PartyBalanceData.COSTCENTER){
    this.PartyBalanceData.COSTCENTER='%';
  }
  if(!this.PartyBalanceData.ACID){
    this.PartyBalanceData.ACID='%';
  }

  this.masterService.LoadPartyBalanceData(this.PartyBalanceData).subscribe(res=>{
    //console.log("@@@res.result",res.result)
    this.PartyInfo = res.result;
    let abcd = this.PartyInfo.filter(x=>(x.PARTICULAR == 'Net Receivable' || x.PARTICULAR == 'Net Payable')); //check for Net Receivable and Net Payable
    //console.log("abcd",abcd)
    if(abcd.length > 0 && abcd[0] && abcd[0].AMOUNT){
      if(abcd[0].AMOUNT<0){
        this.PartyBalanceData.NETAMOUNT = abcd[0].AMOUNT * (-1); // send positive netamount for partbalnce print if in negative.
      }else{
        this.PartyBalanceData.NETAMOUNT = abcd[0].AMOUNT;
      }
    }else{
      this.PartyBalanceData.NETAMOUNT = 0;
    }
  })

 
}
reSet(){
  this.PartyInfo = [];
  this.PartyBalanceData = <PARTYBALANCE>{}
}

// **********For Date Format**************

changeEntryDate(value, format: string) {
  //console.log('working');
  var adbs = require("ad-bs-converter");
  if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.PartyBalanceData.BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
  }
  else if (format == "BS") {
    var datearr = value.split('/');
    const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.PartyBalanceData.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
  }
}

changeEndDate(value, format: string) {
  var adbs = require("ad-bs-converter");
  if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.PartyBalanceData.BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
  }
  else if (format == "BS") {
    var datearr = value.split('/');
    const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
      // var bsDate = (value.replace("-", "/")).replace("-", "/");
      var adDate = adbs.bs2ad(bsDate);
      this.PartyBalanceData.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
  }
}

// printPage(){
//   window.print();
// }

// *****************For Print************************
changeCursor: boolean;
showVoucherReplicateButton: boolean;
userProfile: any = <any>{};
filename: any;
rownumber: any;
numtowords: any;
  onPrintClicked() {
    //console.log('Its working');
    // if (this._trnMainService.TrnMainObj.TrntranList.length > 0) {
    //   this.promptPrintDevice = true;
    // } else {
    //   this.alertService.warning("No voucher Found for Printing");
    // }

    this.showVoucherReplicateButton = false;
    let vat = 606764917;
    // let VATresult = vat.split("");

    // this.masterService.getPrintFileName("PV").subscribe((res) => {
      // if (res.status == "ok") {
        this.filename = 'PARTYBALANCE.ims';
        this.rownumber = 0;

        this.changeCursor = true;
        this.masterService.getGivenNumberToWords(this.PartyBalanceData.NETAMOUNT).subscribe(
          (res) => {
            if (res.status == "ok") {
              this.numtowords = res.result ? res.result[0].NUMTOWORDS : '';
              ////console.log("@@numtowords", this.numtowords);

              let userdivision = this.userProfile.userDivision ? this.userProfile.userDivision : this.userProfile.CompanyInfo.INITIAL;
              let ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
              this.masterService.getDetailsByUserDivision(userdivision).subscribe((res:any)=>{
                if (res.status == "ok") {
                  if(res.result && res.result.length > 0 && res.result[0] && res.result[0].COMADD){
                    ADDRESS =  res.result[0].COMADD;
                  }
                  if(ADDRESS === null || ADDRESS === undefined || ADDRESS === ''){
                    ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
                  }

              this.PartyBalanceData.DIVISION=this.userProfile.CompanyInfo.INITIAL; // must for SP
              this.PartyBalanceData.PHISCALID=this.userProfile.CompanyInfo.PhiscalID; // must for SP
              this.PartyBalanceData.COMPANYID=this.userProfile.CompanyInfo.COMPANYID; // must for SP
              this.PartyBalanceData.NAME=this.userProfile.CompanyInfo.NAME?this.userProfile.CompanyInfo.NAME:'';
              this.PartyBalanceData.ADDRESS=this.userProfile.CompanyInfo.ADDRESS?this.userProfile.CompanyInfo.ADDRESS:''
              this.PartyBalanceData.VATNO=this.userProfile.CompanyInfo.VAT?this.userProfile.CompanyInfo.VAT:'';
              this.PartyBalanceData.numtowords=this.numtowords?this.numtowords:'';
              this.PartyBalanceData.NETAMOUNT = this.PartyBalanceData.NETAMOUNT?this.PartyBalanceData.NETAMOUNT:0;
              this.PartyBalanceData.COMPANYNAME=this.PartyBalanceData.CUSTOMERNAME?this.PartyBalanceData.CUSTOMERNAME:'';
              this.PartyBalanceData.COMPANYADDRESS=this.PartyBalanceData.COMPANYADDRESS?this.PartyBalanceData.COMPANYADDRESS:'';
              this.PartyBalanceData.PANNO=this.PartyBalanceData.PANNO?this.PartyBalanceData.PANNO:0;
              if(!this.PartyBalanceData.COSTCENTER){
                this.PartyBalanceData.COSTCENTER='%'; // must for SP
              }
              if(!this.PartyBalanceData.ACID){
                this.PartyBalanceData.ACID='%'; // must for SP
              }
              console.log("d",this.PartyBalanceData)
              this.masterService.printPartyBalance(this.filename, this.PartyBalanceData).subscribe(
                (res) => {
                  ////console.log("pdfresponse", res);

                  const blobUrl = URL.createObjectURL(res.content);
                  const iframe = document.createElement('iframe');
                  iframe.style.display = 'none';
                  iframe.src = blobUrl;
                  document.body.appendChild(iframe);
                  iframe.contentWindow.print();
                  this.changeCursor = false;

                }
              )

            }
          })


      }

    })
    this.changeCursor = false;

  }

  parttypeChange(){
    this.PartyBalanceData.CUSTOMERNAME="";
    this.PartyBalanceData.ACID="";
  }

}
export interface PARTYBALANCE{
  DATE1: Date | string;
  DATE2: Date | string;
  BSDATE1: Date | string;
  BSDATE2: Date | string;
  DIVISION: string;
  PHISCALID: string;
  COMPANYID: string;
  ACID: string;
  COSTCENTER: string;
  CUSTOMERNAME:string;
  COMPANYNAME:string;
  COMPANYADDRESS: string;
  PANNO:number;
  numtowords:string;
  NETAMOUNT:number;
  PARTYTYPE:any;
  INCLUDECASHTRANSACTION:number;
  NAME:string;
  ADDRESS:string;
  VATNO:number;
}
