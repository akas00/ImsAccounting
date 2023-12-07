import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, OnChanges, ElementRef } from '@angular/core';
import { AuthService } from '../../services/permission';
import * as moment from 'moment'
import { TransactionService } from '../../Transaction Components/transaction.service';
import { DecimalPipe } from '@angular/common';
import Rx from 'rxjs/Rx';
import * as _ from 'lodash';

@Component(
  {

    selector: 'print-invoice',
    template: `<div id="print"></div>`,
    providers: [AuthService]
  }
)

export class PrintInvoiceComponent {
  private companyProfile: any
  private userProfile: any
  private customerInfo: any
  numberOfItem: number;
  noOfInvoice: number;
  arrayIndex: number;
  grandTotal: any;
  gstData: any
  activeurlpath: string;
  partyForReverseCharge: any;
  supplierForReverseCharge: any;
  rcmTotal: any;
  public VATresult: any;

  constructor(private _authService: AuthService, private _transactionService: TransactionService) {
    this.userProfile = this._authService.getUserProfile()
    this.companyProfile = this.userProfile.CompanyInfo;
    this.partyForReverseCharge = <any>{};
    this.supplierForReverseCharge = <any>{};
    this.rcmTotal = <any>{};
  }

  limitDecimal(value: number) {
    return new DecimalPipe('en-US').transform(value, '1.2-2')
  }

  calculateGSTRateWise(data: any[]) {
    this.grandTotal = <any>{}
    Rx.Observable.from(data)
      .groupBy(x => x.GSTRATE)
      .flatMap(group => group.toArray())
      .map(g => {
        return {
          IGSTRATE: g[0].GSTRATE,
          IGSTTOTAL: _.sumBy(g, 'VAT'),
          CGSTRATE: this._transactionService.nullToZeroConverter(g[0].GSTRATE) / 2,
          CGSTTOTAL: this._transactionService.nullToZeroConverter(_.sumBy(g, 'VAT')) / 2,
          SGSTRATE: this._transactionService.nullToZeroConverter(g[0].GSTRATE) / 2,
          SGSTTOTAL: this._transactionService.nullToZeroConverter(_.sumBy(g, 'VAT')) / 2,
          taxable: _.sumBy(g, 'TAXABLE')
        }
      })
      .toArray()
      .subscribe((d) => {
        this.gstData = d
      });
    data.forEach(x => {
      let conversionfactor: any
      conversionfactor = x.Product.AlternateUnits.find(con => con.ALTUNIT == "Carton")
      if (conversionfactor == undefined || conversionfactor == null) {
        conversionfactor = <any>{};
        conversionfactor.CONFACTOR = 1;
      }
      let ALTUNITObj = x.Product.AlternateUnits.filter(y => y.ALTUNIT == x.ALTUNIT)
      if (ALTUNITObj == undefined || ALTUNITObj == null) {
        ALTUNITObj = [];
        if (ALTUNITObj[0] == null) {
          ALTUNITObj.push(<any>{});
        }
        ALTUNITObj[0].CONFACTOR = 1;
      }
      x.AltQty = this._transactionService.nullToZeroConverter(x.RealQty) / this._transactionService.nullToZeroConverter(ALTUNITObj[0].CONFACTOR);
      x.MRP = (this._transactionService.nullToZeroConverter(x.MRP == 0 ? x.SELECTEDITEM.MRP : x.MRP) * this._transactionService.nullToZeroConverter(ALTUNITObj[0].CONFACTOR));
      this.grandTotal.cldtotal = this._transactionService.nullToZeroConverter(this.grandTotal.cldtotal) + this._transactionService.nullToZeroConverter(x.AltQty);
      this.grandTotal.pcstotal = this._transactionService.nullToZeroConverter(this.grandTotal.pcstotal) + this._transactionService.nullToZeroConverter(x.RealQty);
      this.grandTotal.igsttotal = this._transactionService.nullToZeroConverter(this.grandTotal.igsttotal) + this._transactionService.nullToZeroConverter(x.VAT);
      this.grandTotal.cgsttotal = this._transactionService.nullToZeroConverter(this.grandTotal.cgsttotal) + this._transactionService.nullToZeroConverter(x.VAT) / 2;
      this.grandTotal.sgsttotal = this._transactionService.nullToZeroConverter(this.grandTotal.sgsttotal) + this._transactionService.nullToZeroConverter(x.VAT) / 2;
      this.grandTotal.pdistotal = this._transactionService.nullToZeroConverter(this.grandTotal.pdistotal) + this._transactionService.nullToZeroConverter(x.BasePrimaryDiscount);
      this.grandTotal.sdistotal = this._transactionService.nullToZeroConverter(this.grandTotal.sdistotal) + this._transactionService.nullToZeroConverter(x.BaseSecondaryDiscount);
      this.grandTotal.INDDISCOUNTTOTAL = this._transactionService.nullToZeroConverter(this.grandTotal.INDDISCOUNTTOTAL) + this._transactionService.nullToZeroConverter(x.INDDISCOUNT);
    })
  }

  printInvoice(invoiceData, customerInfo, invoiceType, activeurlpath: string = "", printMode: number = 1, isReverseChargeApplicable: boolean = false) {
    this.calculateGSTRateWise(invoiceData.ProdList);
    if (isReverseChargeApplicable) {
      this.partyForReverseCharge = invoiceData.TrntranList.filter(x => this._transactionService.nullToZeroConverter(x.DRAMNT) != 0 && (x.AccountItem.PARENT == "IE" || x.AccountItem.PARENT == "DE"));
      this.supplierForReverseCharge = invoiceData.TrntranList.filter(x => this._transactionService.nullToZeroConverter(x.CRAMNT) != 0 && ((x.AccountItem.ACID).substr(0, 2) == "PA"))[0];
      this.partyForReverseCharge.forEach(party => {
        party.GSTDETAIL = <any>{};
        party.GSTDETAIL = invoiceData.JournalGstList.filter(gst => gst.REFTRNAC == party.A_ACID)[0];
      });
    }

    if (isReverseChargeApplicable) {
      this.partyForReverseCharge.forEach(party => {
        this.rcmTotal.TOTALAMOUNT = this._transactionService.nullToZeroConverter(this.rcmTotal.TOTALAMOUNT) + this._transactionService.nullToZeroConverter(party.DRAMNT);
        this.rcmTotal.CGST = this._transactionService.nullToZeroConverter(this.rcmTotal.CGST) + this._transactionService.nullToZeroConverter(party.GSTDETAIL.GST) / 2;
        this.rcmTotal.SGST = this._transactionService.nullToZeroConverter(this.rcmTotal.SGST) + this._transactionService.nullToZeroConverter(party.GSTDETAIL.GST) / 2;
        this.rcmTotal.IGST = this._transactionService.nullToZeroConverter(this.rcmTotal.IGST) + this._transactionService.nullToZeroConverter(party.GSTDETAIL.GST);
        this.rcmTotal.localTax = this._transactionService.nullToZeroConverter(this.rcmTotal.CGST) + this._transactionService.nullToZeroConverter(this.rcmTotal.SGST);
        this.rcmTotal.interstateTax = this._transactionService.nullToZeroConverter(this.rcmTotal.IGST);
      });
    }
    if (customerInfo == null) {
      customerInfo = [];
    }
    if (customerInfo[0] == null) {
      customerInfo.push(<any>{});
    }
    this.customerInfo = customerInfo;
    this.activeurlpath = activeurlpath;

    let vat = this.companyProfile.VAT;
    this.VATresult = vat?vat.split(""):"";


    this.arrayIndex = 0;
    if (printMode == 1) {
      this.numberOfItem = 20;
      this.noOfInvoice = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.TrntranList.length)) / this.numberOfItem);
    }
    if (invoiceType == "RateAdjustment") {
      this.noOfInvoice = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItem);

    }
    let popupWin;
    let tableData = `<table *ngIf="itemDetail" #invoiceData  style='width: 100%;font-size: 10px;
            border-collapse: collapse;border-top: none;border-bottom: none'>`
    let printText = this.PrintFormat(invoiceData, invoiceType, isReverseChargeApplicable)
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    popupWin.document.write(`<html> <head>
              <style>

                    @media print {
                      .pagebreak { page-break-before: always; } /* page-break-after works, as well */
                  }
            </style>
        <title>${invoiceType}</title></head>
        <body onload="window.print();window.close()">
        ${printText}
        </body>
          </html>`
    );
    popupWin.document.close();

  }

  transformDate(date) {
    return moment(date).format('DD/MM/YYYY')
  }

  changetoUpperCase(value: string) {
    return value.toUpperCase();
}


  public totalNumberOfQuantity: number = 0



  getMultiplePrintFormat(invoiceData, customerInfo, invoiceType, activeurlpath: string = "", printMode: number = 1) {
    this.calculateGSTRateWise(invoiceData.ProdList)
    if (customerInfo == null) {
      customerInfo = [];
    }
    if (customerInfo[0] == null) {
      customerInfo.push(<any>{});
    }
    this.customerInfo = customerInfo;
    this.activeurlpath = activeurlpath;

    this.arrayIndex = 0;
    if (printMode == 1) {
      this.numberOfItem = 20;
      this.noOfInvoice = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.TrntranList.length)) / this.numberOfItem);
    }
    if (invoiceType == "RateAdjustment") {
      this.noOfInvoice = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItem);
    }

    let printString = this.PrintFormat(invoiceData, invoiceType);
    return printString;
  }

  PrintFormat(data, invoiceType, reverseCharge: boolean = false) {
    var row = ""

    if (invoiceType == "JV" && !reverseCharge) {
      for (let i = 1; i <= this.noOfInvoice; i++) {
        var j = 1;
        row = row + `<table style='width: 100%;font-size: 10px;
      border-collapse: collapse;border:1px solid black'>
      <tbody>
      <tr>
          <td colspan='1'>
          </td>
          <td colspan='3' style='text-align:center;max-width:150px;'>
          <b>${this.companyProfile.NAME}</b><br>
          <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
          <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.POSTALCODE == null ? '' : `, ${this.companyProfile.POSTALCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
          <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
          ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
          </td>
          <td colspan='2' style='text-align:right'>GSTIN:${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
          <td >&nbsp;</td>
          </tr>
      <tr>
        <td colspan='4'>Doc.Number:${data.VCHRNO}</td>
        <td colspan='2'>posting Date:${this.transformDate(data.TRN_DATE)}</td>
        <td >&nbsp;</td>
      </tr>
      <tr>
        <td colspan='6' style='border-bottom:1px solid black;'>Header Text:${data.REMARKS ? data.REMARKS : '--'}</td>
        <td >&nbsp;</td>
      </tr>
      <tr style='border-bottom: 1px solid black'>
      <td  style='text-align: center;'>&nbsp;</td>
          <td colspan='3' style='text-align: center;'><b>Journal Voucher<b></td>
          <td colspan='3' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoice}</td>
      </tr>
      <tr style='border-bottom:1px solid black;'>
        <td colspan='4'><b>Particulars</b></td>
        <td><b>Debit</b></td>
        <td><b>Credit</b></td>
         <td><b>Narration</b></td>
      </tr>
      `

        for (j; j <= this.numberOfItem; j++) {
          if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.TrntranList.length)) {
            row = row + `
         <tr>
         <td colspan='4'>${data.TrntranList[this.arrayIndex].ACNAME}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].DRAMNT)}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].CRAMNT)}</td>
         <td>${data.TrntranList[this.arrayIndex].NARATION?data.TrntranList[this.arrayIndex].NARATION:''}</td>
         </tr>
         `
          }
          this.arrayIndex = this.arrayIndex + 1;
        }
        if (i == this.noOfInvoice) {
          row = row + `

          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >${data.TransactionDebitTotal ? data.TransactionDebitTotal : '-'}</td>
            <td >${data.TransactionCreditTotal ? data.TransactionCreditTotal : '-'}</td>
            <td >&nbsp;</td>
          </tr>
          <tr style='border-top:1px solid black;border-bottom:1px solid black;'>
            <td colspan='4'>Reference :${data.REFBILL == null ? "N/A" : data.REFBILL}</td>
            <td colspan ='2'>Doc Date :${this.transformDate(data.TRNDATE)}</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
            <td colspan='7'>Amount in words : ${data.NETAMOUNTINWORD ? data.NETAMOUNTINWORD : 'N/A'}</td>
          </tr>
          <tr>
            <td colspan='3'>parked:</td>
            <td colspan='3' style='text-align:right;'>posted & Authorised</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
            <td colspan='3'>&nbsp;</td>
            <td colspan='3'>&nbsp;</td>
            <td >&nbsp;</td>
          </tr>
          `
        }
        row = row + `</tbody></table>`
        if (i != this.noOfInvoice) {
          row = row + `
              <div class="pagebreak"></div>
              `
        }
      }
    }
    if (invoiceType == "JV" && reverseCharge) {

      row = row + `<table style='width: 100%;font-size: 10px;
      border-collapse: collapse;border:1px solid black'>
      <tbody>
      <tr style='border:1px solid black'>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style='text-align:center;' colspan='2'>
          <b>${this.companyProfile.NAME}</b><br>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td style='text-align:right'></td>
      </tr>
      <tr style='border:1px solid black'>
        <td colspan='10' style='border-bottom:1px solid black;text-align:center'>Self Invoice<br>[Under section 31 sub-section(f)]</td>
      </tr>

      <tr>
        <td colspan='2'>Address</td>
        <td colspan='3' style='border-right:1px solid black'>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS}</td>
        <td colspan='2'>PAN No</td>
        <td colspan='3' style='border-right:1px solid black'>${this.companyProfile.VAT == null ? '' : this.companyProfile.VAT}</td>
      </tr>
      <tr>
        <td colspan='2'>State</td>
        <td colspan='3' style='border-right:1px solid black'>${this.companyProfile.STATENAME == null ? '' : this.companyProfile.STATENAME}</td>
        <td colspan='2'>GSTIN</td>
        <td colspan='3' style='border-right:1px solid black'>${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
      </tr>
      <tr>
        <td colspan='2'>State Code</td>
        <td colspan='3' style='border-right:1px solid black'>${this.companyProfile.STATE == null ? '' : this.companyProfile.STATE}</td>
        <td colspan='2'>Inv. No.</td>
        <td colspan='3' style='border-right:1px solid black'>${data.VCHRNO}</td>
      </tr>
      <tr>
        <td colspan='2'></td>
        <td colspan='3' style='border-right:1px solid black'></td>
        <td colspan='2'>Ref. No</td>
        <td colspan='3' style='border-right:1px solid black'>${data.REFBILL}</td>
      </tr>
      <tr>
        <td colspan='2'></td>
        <td colspan='3' style='border-right:1px solid black'></td>
        <td colspan='2'>Invoice Date</td>
        <td colspan='3' style='border-right:1px solid black'>${data.TRNDATE}</td>
      </tr>
      <tr style='border:1px solid black;'>
        <td colspan='10' style='text-align:center'>Supplier Details</td>
      </tr>
      <tr style='border-top:1px solid black'>
        <td colspan='2'>Entity Name</td>
        <td colspan='3' style='border-right:1px solid black'>${this.supplierForReverseCharge.AccountItem.ACNAME == null ? '' : this.supplierForReverseCharge.AccountItem.ACNAME}</td>
        <td colspan='2'>State</td>
        <td colspan='3' style='border-right:1px solid black'>${this.supplierForReverseCharge.AccountItem.STATENAME == null ? '' : this.supplierForReverseCharge.AccountItem.STATENAME}</td>
      </tr>
    <tr>
      <td colspan='2'>Address</td>
      <td colspan='3' style='border-right:1px solid black'>${this.supplierForReverseCharge.AccountItem.ADDRESS == null ? '' : this.supplierForReverseCharge.AccountItem.ADDRESS}</td>
      <td colspan='2'>State Code</td>
      <td colspan='3' style='border-right:1px solid black'>${this.supplierForReverseCharge.AccountItem.STATE == null ? '' : this.supplierForReverseCharge.AccountItem.STATE}</td>
    </tr>
    <tr>
      <td colspan='2'></td>
      <td colspan='3' style='border-right:1px solid black'></td>
      <td colspan='2'>place Of supply</td>
      <td colspan='3' style='border-right:1px solid black'>${this.supplierForReverseCharge.AccountItem.STATE == null ? '' : this.supplierForReverseCharge.AccountItem.STATE}</td>
    </tr>

      <tr style='border:1px solid black;'>
        <td colspan='10'>Goods /Service Details</td>
      </tr>
      <tr style='border-bottom:1px solid black;'>
        <td style='border-right:1px solid black;'><b>S.No</b></td>
        <td style='border-right:1px solid black;'><b>HSN/SAC Code</b></td>
        <td style='border-right:1px solid black;'><b>Description</b></td>
        <td style='border-right:1px solid black;'><b>CGST Rate</b></td>
        <td style='border-right:1px solid black;'><b>CGST Amount</b></td>
        <td style='border-right:1px solid black;'><b>SGST/UGST Rate</b></td>
        <td style='border-right:1px solid black;'><b>SGST/UGST Amount</b></td>
        <td style='border-right:1px solid black;'><b>IGST Rate</b></td>
        <td style='border-right:1px solid black;'><b>IGST Amount</b></td>
        <td><b>Amount</b></td>
      </tr>

      `
      for (let party of this.partyForReverseCharge) {
        row = row + `
        <tr style='border-bottom:1px solid black;'>
        <td style='border-right:1px solid black;'>1.</td>
        <td style='border-right:1px solid black;'>${party.HSN_SACCODE == null ? '' : party.HSN_SACCODE}</td>
        <td style='border-right:1px solid black;'>${party.AccountItem.ACNAME}</td>
        <td style='border-right:1px solid black;text-align:right'>${party.GSTDETAIL.TRNTYPE == "interstate" ? '' : this._transactionService.nullToZeroConverter(party.GSTDETAIL.GSTRATE) / 2}</td>
        <td style='border-right:1px solid black;text-align:right'>${party.GSTDETAIL.TRNTYPE == "interstate" ? '' : this._transactionService.nullToZeroConverter(party.GSTDETAIL.GST) / 2}</td>
        <td style='border-right:1px solid black;text-align:right'>${party.GSTDETAIL.TRNTYPE == "interstate" ? '' : this._transactionService.nullToZeroConverter(party.GSTDETAIL.GSTRATE) / 2}</td>
        <td style='border-right:1px solid black;text-align:right'>${party.GSTDETAIL.TRNTYPE == "interstate" ? '' : this._transactionService.nullToZeroConverter(party.GSTDETAIL.GST) / 2}</td>
        <td style='border-right:1px solid black;text-align:right'>${party.GSTDETAIL.TRNTYPE == "interstate" ? this._transactionService.nullToZeroConverter(party.GSTDETAIL.GSTRATE) : ''}</td>
        <td style='border-right:1px solid black;text-align:right'>${party.GSTDETAIL.TRNTYPE == "interstate" ? this._transactionService.nullToZeroConverter(party.GSTDETAIL.GST) : ''}</td>
        <td>${party.DRAMNT}</td>
      </tr>
        `
      }

      row = row + `
        <tr>
          <td colspan='7' rowspan='6' style="border-right:1px solid black;"></td>
          <td colspan='2' style="border:1px solid black;">Total Amount</td>
          <td style="border:1px solid black;text-align:right">${this.rcmTotal.TOTALAMOUNT}</td>
        </tr>
        <tr>
          <td colspan='2' style="border:1px solid black;">CGST Amount</td>
          <td style="border:1px solid black;text-align:right">${data.JournalGstList[0].TRNTYPE == 'interstate' ? '' : this.rcmTotal.CGST}</td>
        </tr>
        <tr>
          <td colspan='2' style="border:1px solid black;">SGST/UTGST Amount Amount</td>
          <td style="border:1px solid black;text-align:right">${data.JournalGstList[0].TRNTYPE == 'interstate' ? '' : this.rcmTotal.SGST}</td>
        </tr>
        <tr>
          <td colspan='2' style="border:1px solid black;">IGST Amount</td>
          <td style="border:1px solid black;text-align:right">${data.JournalGstList[0].TRNTYPE == 'interstate' ? this.rcmTotal.IGST : ''}</td>
        </tr>
        <tr>
          <td colspan='2' style="border:1px solid black;">Total Tax Amount</td>
          <td style="border:1px solid black;text-align:right">${data.JournalGstList[0].TRNTYPE == 'interstate' ? this.rcmTotal.interstateTax : this.rcmTotal.localTax}</td>
        </tr>
        <tr>
          <td colspan='2' style="border:1px solid black;">Invoice Amount</td>
          <td style="border:1px solid black;text-align:right">${data.NETAMNT}</td>
        </tr>
      `

      row = row + `</tbody></table>`
    }

    if (invoiceType == "PV") {
      for (let i = 1; i <= this.noOfInvoice; i++) {
        var j = 1;
        row = row + `<table style='width: 100%;font-size: 10px;
      border-collapse: collapse;border:1px solid black'>
      <tbody>
      <tr>
          <td colspan='1'>
          <h5 style="height: 25px;"></h5>
          </td>
          <td colspan='3' style='text-align:center;max-width:150px;'>                            <b>${this.companyProfile.NAME}</b><br>
          <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
          <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.POSTALCODE == null ? '' : `, ${this.companyProfile.POSTALCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
          <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
          ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
      </td>
      <td colspan='2' style='text-align:right'>GSTIN:${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
      <td>&nbsp;</td>
      </tr>
      <tr>
        <td colspan='4'>Doc.Number:${data.VCHRNO}</td>
        <td colspan='2'>posting Date:${this.transformDate(data.TRN_DATE)}</td>
        <td>&nbsp;</td>
      </tr>
      <tr style='border-bottom: 1px solid black'>
      <td  style='text-align: center;'>&nbsp;</td>
          <td colspan='3' style='text-align: center;'><b>Payment Voucher<b></td>
          <td colspan='3' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoice}</td>
      </tr>
      <tr style='border-bottom:1px solid black;'>
        <td colspan='4'><b>Particulars</b></td>
        <td><b>Debit</b></td>
        <td><b>Credit</b></td>
        <td><b>Narration</b></td>
      </tr>
      `

        for (j; j <= this.numberOfItem; j++) {
          if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.TrntranList.length)) {
            row = row + `
         <tr>
         <td colspan='4'>${data.TrntranList[this.arrayIndex].ACNAME}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].DRAMNT)}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].CRAMNT)}</td>
         <td>${data.TrntranList[this.arrayIndex].NARATION?data.TrntranList[this.arrayIndex].NARATION:''}</td>
         </tr>
         `
          }
          this.arrayIndex = this.arrayIndex + 1;
        }
        if (i == this.noOfInvoice) {
          row = row + `
        <tr>
          <td colspan='4'>To ${data.TRNACName}</td>
          <td>0.00</td>
          <td>${this.limitDecimal(data.TransactionDebitTotal)}</td>
          <td >&nbsp;</td>
         </tr>
          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td>${this.limitDecimal(data.TransactionDebitTotal)}</td>
            <td>${this.limitDecimal(data.TransactionDebitTotal)}</td>
            <td >&nbsp;</td>
            </tr>
          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
            <td colspan='4'>Reference :${data.REFBILL == null ? "" : data.REFBILL}</td>
            <td colspan ='2'>Doc Date :${this.transformDate(data.TRNDATE)}</td>
            <td >&nbsp;</td>
          </tr>
          <tr style='border-bottom:1px solid black;'>
            <td colspan='6'>Assignment :</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
            <td colspan='7'>Amount in words : ${data.NETAMOUNTINWORD}</td>
          </tr>
          <tr>
            <td colspan='2'>Enterred By:</td>
            <td colspan='2'>Checked By:</td>
            <td colspan='2'>Authorised signatory</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
            <td colspan='2'>&nbsp;</td>
            <td colspan='2'>&nbsp;</td>
            <td colspan='2'>&nbsp;</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
            <td colspan='7'>Payee's signature</td>
          </tr>
          <tr>
            <td colspan='7'>&nbsp;</td>
          </tr>
          `
        }
        row = row + `</tbody></table>`
        if (i != this.noOfInvoice) {
          row = row + `
              <div class="pagebreak"></div>
              `
        }
      }
    }
    if (invoiceType == "RV") {
      for (let i = 1; i <= this.noOfInvoice; i++) {
        var j = 1;
        row = row + `<table style='width: 100%;font-size: 10px;
      border-collapse: collapse;border:1px solid black'>
      <tbody>
      <tr>
          <td colspan='1'>
          <h5 style="height: 25px;"></h5>
          </td>
          <td colspan='3' style='text-align:center;max-width:150px;'>                            <b>${this.companyProfile.NAME}</b><br>
          <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
          <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.POSTALCODE == null ? '' : `, ${this.companyProfile.POSTALCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
          <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
          ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
</td>
<td colspan='2' style='text-align:right'>GSTIN:${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
<td>&nbsp;</td>
</tr>
      <tr>
        <td colspan='4'>Doc.Number:${data.VCHRNO}</td>
        <td colspan='2'>posting Date:${this.transformDate(data.TRN_DATE)}</td>
        <td>&nbsp;</td>
      </tr>
      <tr style='border-bottom: 1px solid black'>
      <td  style='text-align: center;'>&nbsp;</td>

          <td colspan='3' style='text-align: center;'><b>Receipt Voucher<b></td>
          <td colspan='3' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoice}</td>
      </tr>
      <tr style='border-bottom:1px solid black;'>
        <td colspan='4'><b>Particulars</b></td>
        <td><b>Debit</b></td>
        <td><b>Credit</b></td>
        <td><b>Narration</b></td>
      </tr>
      `

        for (j; j <= this.numberOfItem; j++) {
          if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.TrntranList.length)) {
            row = row + `
         <tr>
         <td colspan='4'>${data.TrntranList[this.arrayIndex].ACNAME}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].DRAMNT)}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].CRAMNT)}</td>
         <td>${data.TrntranList[this.arrayIndex].NARATION?data.TrntranList[this.arrayIndex].NARATION:''}</td>
         </tr>
         `
          }
          this.arrayIndex = this.arrayIndex + 1;
        }
        if (i == this.noOfInvoice) {
          row = row + `
          <tr>
          <td colspan='4'>To ${data.TRNACName}</td>
          <td>${this.limitDecimal(data.TransactionCreditTotal)}</td>
          <td>0.00</td>
          <td >&nbsp;</td>
         </tr>
          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td>${this.limitDecimal(data.TransactionCreditTotal)}</td>
            <td>${this.limitDecimal(data.TransactionCreditTotal)}</td>
            <td >&nbsp;</td>
            </tr>
          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
            <td colspan='4'>Reference :${data.REFBILL == null ? "" : data.REFBILL}</td>
            <td colspan ='2'>Doc Date :${this.transformDate(data.TRNDATE)}</td>
            <td >&nbsp;</td>
          </tr>
          <tr style='border-bottom:1px solid black;'>
            <td colspan='7'>Assignment :</td>
          </tr>
          <tr>
            <td colspan='7'>Amount in words : ${data.NETAMOUNTINWORD}</td>
          </tr>
          <tr>
            <td colspan='2'>Enterred By:</td>
            <td colspan='2'>Checked By:</td>
            <td colspan='2'>Authorised signatory</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
          <td colspan='2'>&nbsp;</td>
          <td colspan='2'>&nbsp;</td>
          <td colspan='2'>&nbsp;</td>
          <td >&nbsp;</td>
        </tr>
          `
        }
        row = row + `</tbody></table>`
        if (i != this.noOfInvoice) {
          row = row + `
              <div class="pagebreak"></div>
              `
        }
      }
    }

    // if (invoiceType == "DN" || invoiceType == "CN") {
    //   for (let i = 1; i <= this.noOfInvoice; i++) {
    //     var j = 1;
    //     row = row + `<table style='width: 100%;font-size: 10px;
    //   border-collapse: collapse;border:1px solid black'>
    //   <tbody>
    //   <tr>
    //       <td colspan='1'>
    //       <h5 style="height: 25px;">HamroSDS</h5>
    //       </td>
    //       <td colspan='3' style='text-align:center;max-width:150px;'>                            <b>${this.companyProfile.NAME}</b><br>
    //       <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
    //       <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.POSTALCODE == null ? '' : `, ${this.companyProfile.POSTALCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
    //       <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
    //       ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
    //       </td>
    //        <td colspan='2' style='text-align:right'>GSTIN:${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
    //   </tr>
    //   <tr>
    //     <td colspan='4'>Doc.Number:${data.VCHRNO}</td>
    //     <td colspan='2'>posting Date:${this.transformDate(data.TRN_DATE)}</td>
    //   </tr>
    //   <tr style='border-bottom: 1px solid black'>
    //   <td  style='text-align: center;'>&nbsp;</td>
    //       <td colspan='3' style='text-align: center;'><b>${invoiceType == "DN" ? "Debit Note" : "Credit Note"}<b></td>
    //       <td colspan='2' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoice}</td>
    //   </tr>
    //   <tr style='border-bottom:1px solid black;'>
    //     <td colspan='4'><b>Particulars</b></td>
    //     <td><b>Debit</b></td>
    //     <td><b>Credit</b></td>
    //   </tr>
    //   `

    //     for (j; j <= this.numberOfItem; j++) {
    //       if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.TrntranList.length)) {
    //         row = row + `
    //      <tr>
    //      <td colspan='4'>${data.TrntranList[this.arrayIndex].ACNAME}</td>
    //      <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].DRAMNT)}</td>
    //      <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].CRAMNT)}</td>
    //      </tr>
    //      `
    //       }
    //       this.arrayIndex = this.arrayIndex + 1;
    //     }
    //     if (i == this.noOfInvoice) {
    //       row = row + `
    //       <tr>
    //      <td colspan='4'>To ${data.TRNACName}</td>
    //      <td>${invoiceType == "CN" ? '0.00' : this.limitDecimal(data.TransactionCreditTotal)}</td>
    //      <td>${invoiceType == "CN" ? this.limitDecimal(data.TransactionDebitTotal) : "0.00"}</td>
    //      </tr>

    //       <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
    //         <td >&nbsp;</td>
    //         <td >&nbsp;</td>
    //         <td >&nbsp;</td>
    //         <td >&nbsp;</td>
    //         <td>${invoiceType == "DN" ? this.limitDecimal(data.TransactionCreditTotal) : this.limitDecimal(data.TransactionDebitTotal)}</td>
    //         <td>${invoiceType == "DN" ? this.limitDecimal(data.TransactionCreditTotal) : this.limitDecimal(data.TransactionDebitTotal)}</td>
    //       </tr>
    //       <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
    //         <td colspan='4'>Reference :${data.REFBILL == null ? "" : data.REFBILL}</td>
    //         <td colspan ='2'>Doc Date :${this.transformDate(data.TRNDATE)}</td>
    //       </tr>
    //       <tr style='border-bottom:1px solid black;'>
    //         <td colspan='6'>Assignment :</td>
    //       </tr>
    //       <tr>
    //         <td colspan='6'>Amount in words : ${data.NETAMOUNTINWORD}</td>
    //       </tr>

    //       <tr>
    //         <td colspan='2'>Enterred By:</td>
    //         <td colspan='2'>Checked By:</td>
    //         <td colspan='2'>Authorised signatory</td>
    //       </tr>
    //       <tr>
    //         <td colspan='2'>&nbsp;</td>
    //         <td colspan='2'>&nbsp;</td>
    //         <td colspan='2'>&nbsp;</td>
    //       </tr>
    //       <tr>
    //         <td colspan='6'>Payee's signature</td>
    //       </tr>
    //       <tr>
    //         <td colspan='6'>&nbsp;</td>
    //       </tr>
    //       `
    //     }
    //     row = row + `</tbody></table>`
    //     if (i != this.noOfInvoice) {
    //       row = row + `
    //           <div class="pagebreak"></div>
    //           `
    //     }
    //   }
    // }

    if (invoiceType == "DN" || invoiceType == "CN") {
      for (let i = 1; i <= this.noOfInvoice; i++) {
        var j = 1;
        row = row + `<table style='width: 100%;font-size: 10px;border-collapse: collapse;'>
      <tbody>
      <tr>
      <td colspan='11' style='text-align: center;font-size:26px;'><b>${this.companyProfile.NAME}</b><td>
      </tr>
      <tr>
          <td colspan='11' style='text-align: center;font-size:14px;'>
          ${this.companyProfile.ADDRESS}<br>
          Phone No: ${this.companyProfile.TELA},${this.companyProfile.TELB}<br>
          Email:${this.companyProfile.EMAIL == null ? '' : this.companyProfile.EMAIL}<br>
          </td>
      </tr>
      <tr><td>&nbsp;</td></tr>
      <tr style='padding-bottom:10px;'>
          <td colspan='3' style='font-size:14px;padding-left:0px;'><b>PAN/VAT No.</b></td>
          <td colspan='5' style='font-size:14px;margin-bottom: 5px;padding-left:10px;border:1px solid black;
          display:inline-table;'><b>

          <label style='padding:0px 5px'>${this.VATresult[0]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[1]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[2]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[3]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[4]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[5]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[6]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[7]}</label>
          <label style='border-left:1px solid black;padding:0px 5px'>${this.VATresult[8]}</label>
          </b>
          </td>
          

          <td colspan='7' style='font-size:16px;padding-left:10px;text-align:right'><b></b></td>
      </tr>
  <tr style='border-top: 1px solid black;border-bottom: 1px solid black;'>
      <td colspan='11' style='text-align: center;font-size:20px;border-left: 1px solid black;border-right: 1px solid black;padding-top:5px;padding-bottom:5px;'><b>${invoiceType == "DN" ? "Debit Note" : "Credit Note"}</b></td>
  </tr>
  <tr style='border-top: 1px solid black;'>
      <td style='border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='7'><b>M/S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${this.customerInfo[0].ACNAME==null?'':this.customerInfo[0].ACNAME}</b></td>
      <td colspan='2' style='padding-left:10px;font-size:12px'><b>${invoiceType == "DN"?'D.N. No.':'C.N. No.'}</b></td>
      <td style='border-right: 1px solid black;font-size:12px;' colspan='2'><b>:&nbsp;${data.VCHRNO}</b></td>
  <tr>
      <td style='border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='7'>Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS}</td>
      <td colspan='2' style='padding-left:10px;font-size:12px'><b>Ref Bill No.</b></td>
      <td style='border-right: 1px solid black;font-size:12px;' colspan='2'><b>:&nbsp;${data.REFBILL}</b></td>
  </tr>
  <tr>
      <td style='border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='7'>Phone No.&nbsp;:&nbsp;${this.customerInfo[0].PHONE == null ? '' : this.customerInfo[0].PHONE}</td>
      <td colspan='4' style='padding-left:10px;font-size:12px;border-right: 1px solid black;'><b>Transaction Date:&nbsp;${this.transformDate(data.TRNDATE)}</b></td>
  </tr>
  <tr>
      <td style='border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='7'><b>PAN/VAT
      NO.:&nbsp;${this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO}</b></td>
      <td colspan='2' style='font-size:12px;padding-left:10px;'><b>Invoice Date</b></td>
      <td style='border-right: 1px solid black;font-size:12px;' colspan='2'><b>:&nbsp;${this.transformDate(data.TRNDATE)}</b></td>
  </tr>
  <tr>
      <td style='border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='7'><b></b></td>
      <td colspan='2' style='font-size:12px;padding-left:10px;'><b>Invoice Miti</b></td>
      <td style='border-right: 1px solid black;font-size:12px;' colspan='2'><b>:&nbsp;${data.BS_DATE}&nbsp;${data.TRNTIME}</b></td>
  </tr>
  <tr>
      <td style='border-top: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='4'></td>
      <td style='border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;' colspan='3'><b>Party Type:&nbsp;${data.TRNMODE}</b></td>
      <td colspan='2' style='font-size:12px;padding-left:10px;'><b>Invoice Amount</b></td>
      <td style='border-right: 1px solid black;font-size:12px;' colspan='2'><b>:&nbsp;${data.NETAMNT}</b></td>
  </tr>
  <tr style='border-top: 1px solid black;border-bottom: 1px solid black;'>
      <td colspan='1' style='border-right: 1px solid black;border-left: 1px solid black;font-size:10px;padding-left:8px;padding-top:5px;padding-bottom:5px;width:5px;'><b>Sr#</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:50px;'><b>Code</b></td>
      <td colspan='2' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:190px;'><b>Description</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:50px;'><b>Batch</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:50px;'><b>Quantity</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:30px;'><b>Unit</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:40px;'><b>MRP</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:40px;'><b>Rate</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:50px;'><b>Discount</b></td>
      <td colspan='1' style='border-right: 1px solid black;font-size:10px;padding-left:10px;padding-top:5px;padding-bottom:5px;width:50px;text-align:center;'><b>Amount</b></td>
  </tr>
      `

        for (j; j <= this.numberOfItem; j++) {
          if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.TrntranList.length)) {
            row = row + `
            <tr style='height: 1px;'>
            <td colspan='1' style='border-right: 1px solid black;border-left: 1px solid black;padding-top:2px;text-align:center;font-size:9px;'>${this.arrayIndex+1}</td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;padding-top:2px;text-align:center;'></td>
            <td colspan='2' style='border-right: 1px solid black;font-size:9px;padding-top:2px;'>${data.TrntranList[this.arrayIndex].ACNAME}</td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: center;padding-top:2px;'></td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: center;padding-top:2px;'></td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: center;padding-top:2px;'></td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: right;padding-top:2px;'></td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: right;padding-top:2px;'></td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: right;padding-top:2px;'></td>
            <td colspan='1' style='border-right: 1px solid black;font-size:9px;text-align: right;padding-top:2px;'>${invoiceType == "DN"?data.TrntranList[this.arrayIndex].CRAMNT:data.TrntranList[this.arrayIndex].DRAMNT}</td>
        </tr>
         `
         row = row + `
         <tr>
             <td colspan='1' style='border-right: 1px solid black;border-left: 1px solid black;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;'></td>
             <td colspan='2' style='border-right: 1px solid black;font-size:10px;'>(${data.REMARKS == null ? '' : data.REMARKS})</td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: left;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: right;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: center;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: right;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: right;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: right;'></td>
             <td colspan='1' style='border-right: 1px solid black;font-size:10px;text-align: right;'></td>
         </tr>
             `
          }
          this.arrayIndex = this.arrayIndex + 1;
        }
        if (i == this.noOfInvoice) {
          row = row + `
          <tr style='border-top: 1px solid black;'>
          <td colspan='4'
          style='border-right: 1px solid black;border-left: 1px solid black;border-bottom: 1px solid black;padding-top:5px;padding-bottom:5px;'>
          &nbsp;</td>
      <td colspan='2'  style='border-right: 1px solid black;border-bottom: 1px solid black;font-size:12px;padding-left:10px;padding-top:5px;padding-bottom:5px;'>Total Quantity:&nbsp;&nbsp;</td>  
      <td colspan='1' style='border-right: 1px solid black;font-size:12px;padding-left:10px;padding-top:5px;padding-bottom:5px;'><b></b></td> 
      <td colspan='4' style='border-right: 1px solid black;font-size:12px;padding-left:10px;padding-top:5px;padding-bottom:5px;'><b>Gross Amount&nbsp;&nbsp;&nbsp;:</b><b style='float:right;'>${this.limitDecimal(data.TOTAMNT)}</b></td>
          </tr>
          <tr>
          <td colspan='7' style='border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black;padding-left:10px;font-size:12px;'></td>
          <td colspan='4' style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;font-size:12px;padding-left:10px;'>Discount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:<label style='float:right;'>0</label></td>
      </tr>
      <tr>
          <td colspan='7' style='border-right: 1px solid black;border-left: 1px solid black;padding-left:10px;font-size:12px;'></td>
          <td colspan='4' style='border-left: 1px solid black;border-right: 1px solid black;font-size:12px;padding-left:10px;'><b>Taxable Amount:</b><b style='float:right;'>&nbsp;${this.limitDecimal(data.TAXABLE)}</b></td>
      </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;border-left: 1px solid black;'>
                  &nbsp;</td>
              <td colspan='4' style='border-left: 1px solid black;border-right: 1px solid black;font-size:12px;padding-left:10px;'>VAT 13%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:<label style='float:right;'>0</label></td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;border-left: 1px solid black;font-size:12px;padding-left:10px;'>Amount Payable In
                  Words:-</td>
              <td colspan='4' style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;font-size:12px;padding-left:10px;'>Rounded Off&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:<label style='float:right;'>(${this.limitDecimal(data.ROUNDOFF)})</label></td>
          </tr>
          <tr style='border-bottom: 1px solid black;'>
              <td colspan='7' style='border-right: 1px solid black;border-left: 1px solid black;font-size:10px;padding-left:10px;'>${this.changetoUpperCase(this._transactionService.digitToWord(data.NETAMNT))}</td>
              <td colspan='4' style='border-left: 1px solid black;border-right: 1px solid black;font-size:12px;padding-left:10px;padding-top:5px;padding-bottom:5px;'><b>Net Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b><b style='float:right;'>${this.limitDecimal(data.NETAMNT)}</b></td>
          </tr>
          <tr>
              <td colspan='2' style='font-size:8px;'>Note:</td>
              <td colspan='9' style='text-align: right;font-size:14px;'><b>For ${this.companyProfile.NAME}</b></td>
          </tr>
          <tr>
              <td colspan='7' style='font-size:8px;'>
                  1. Goods once sold will not be returned.
              </td>
              <td colspan='4'>&nbsp;</td>
          </tr>
          <tr>
              <td colspan='11' style='font-size:8px;'>
                  2. Interest will be charged @ of bank rule if payment is not made within due date mentioned
                      above.
              </td>
          </tr>
          <tr>
          <td colspan='11'>&nbsp;</td>
          </tr>
          <tr>
          <td colspan='11'>&nbsp;</td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='4' style='text-align: right;font-size:12px;'>Authorized Signatory</td>
          </tr>
          <tr>
              <td colspan='11' style='font-size:10px;text-align: center;'>****Bill can not be reprinted****</td>
          </tr>
          <tr>
          <td colspan='11' style='font-size:10px;text-align: center;padding-bottom:40px;'>&nbsp;</td>
          </tr>
          `
        }
        row = row + `</tbody></table>`
        if (i != this.noOfInvoice) {
          row = row + `
              <div class="pagebreak"></div>
              `
        }
      }
    }


    if (invoiceType == "CE") {
      for (let i = 1; i <= this.noOfInvoice; i++) {
        var j = 1;
        row = row + `<table style='width: 100%;font-size: 10px;
      border-collapse: collapse;border:1px solid black'>
      <tbody>
      <tr>
          <td colspan='1'>&nbsp;</td>
          <td colspan='3' style='text-align:center;max-width:150px;'>
          <b>${this.companyProfile.NAME}</b><br>
          <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
          <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.POSTALCODE == null ? '' : `, ${this.companyProfile.POSTALCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
          <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
          ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}

          </td>
          <td colspan='2' style='text-align:right'>GSTIN:${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
          <td>&nbsp;</td>
          </tr>
      <tr>
        <td colspan='4'>Doc.Number:${data.VCHRNO}</td>
        <td colspan='2'>posting Date:${this.transformDate(data.TRN_DATE)}</td>
        <td>&nbsp;</td>
      </tr>
      <tr style='border-bottom: 1px solid black'>
          <td  style='text-align: center;'>&nbsp;</td>
          <td colspan='3' style='text-align: center;'><b>Contra Voucher<b></td>
          <td colspan='3' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoice}</td>
      </tr>
      <tr style='border-bottom:1px solid black;'>
        <td colspan='4'><b>Particulars</b></td>
        <td><b>Debit</b></td>
        <td><b>Credit</b></td>
        <td><b>Narration</b></td>
      </tr>
      `

        for (j; j <= this.numberOfItem; j++) {
          if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.TrntranList.length)) {
            row = row + `
         <tr>
         <td colspan='4'>${data.TrntranList[this.arrayIndex].ACNAME}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].DRAMNT)}</td>
         <td>${this.limitDecimal(data.TrntranList[this.arrayIndex].CRAMNT)}</td>
         <td>${data.TrntranList[this.arrayIndex].NARATION?data.TrntranList[this.arrayIndex].NARATION:''}</td>
         </tr>
         `
          }
          this.arrayIndex = this.arrayIndex + 1;
        }
        if (i == this.noOfInvoice) {
          row = row + `

          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >${data.TransactionDebitTotal}</td>
            <td >${data.TransactionCreditTotal}</td>
            <td >&nbsp;</td>
          </tr>
          <tr style='border-bottom:1px solid black;border-top:1px solid black;'>
          <td colspan='4'>Reference : ${data.REFBILL == null ? "" : data.REFBILL}</td>
          <td colspan ='2'>Doc Date :${this.transformDate(data.TRNDATE)}</td>
          <td >&nbsp;</td>
        </tr>
          <tr>
            <td colspan='7'>Amount in words : ${data.NETAMOUNTINWORD}</td>
          </tr>
          <tr>
          <td colspan='7' style='border-bottom:1px solid black;'>Text:${data.REMARKS}</td>
        </tr>
          <tr>
            <td colspan='2'>Enterred By:</td>
            <td colspan='2'>Checked By:</td>
            <td colspan='2'>Authorised signatory</td>
            <td >&nbsp;</td>
          </tr>
          <tr>
          <td colspan='2'>&nbsp;</td>
          <td colspan='2'>&nbsp;</td>
          <td colspan='2'>&nbsp;</td>
          <td >&nbsp;</td>
        </tr>
          `
        }
        row = row + `</tbody></table>`
        if (i != this.noOfInvoice) {
          row = row + `
              <div class="pagebreak"></div>
              `
        }
      }
    }

    if (invoiceType == "RateAdjustment") {
      for (let i = 1; i <= this.noOfInvoice; i++) {
        var j = 1;
        var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
        row = row + `<table style='width: 100%;font-size: 9px;
            border-collapse: collapse;border:1px solid black'>
            <tbody>
            <tr>
                <td colspan='8'>
                <h5 style="height: 25px;">HamroSDS</h5>
                </td>
                <td colspan='8' style='text-align:center;max-width:150px;'>
                <b>${this.companyProfile.NAME}</b><br>
                <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.POSTALCODE == null ? '' : `, ${this.companyProfile.POSTALCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}

                </td>
                <td colspan='8' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>
            </tr>
        <tr style='border-bottom: 1px solid black'>
            <td colspan='8'>
            CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}
           <br> GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
            <td colspan='8' style='text-align: center;'></td>
            <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
        </tr>
        <tr style='border-bottom: 1px solid black'>
            <td colspan='8'> </td>
            <td colspan='8' style='text-align: center;'><b>Tax Invoice:${data.REFBILL} / RATE DIFFERENCE<b></td>
            <td colspan='8' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoice}</td>
        </tr>
        <tr style='border-top: 1px solid black;'>
            <td colspan='8' style='border-right: 1px solid black;'>Buyer:&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Ship To:&nbsp;${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
            <td colspan='8' style='border-right: 1px solid black;'>${this.activeurlpath == 'acvouchersdebit-note-rate-adjustment' ? 'Debit Note' : 'Credit Note'}./Date : ${data.VCHRNO}&nbsp;${this.transformDate(data.TRNDATE)} </td>
        </tr>

        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : this.customerInfo[0].AREA + ','}${this.customerInfo[0] == null ? '' : this.customerInfo[0].DISTRICT + ','}${this.customerInfo[0] == null ? '' : this.customerInfo[0].ADDRESS}</td>
            <td colspan='8' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : data.shipToDetail.AREA + ','}${data.shipToDetail.DISTRICT == null ? '' : data.shipToDetail.DISTRICT + ','}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Net Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>

        </tr>
        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>Pincode :&nbsp;&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].POSTALCODE}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Pincode :&nbsp;&nbsp;${data.shipToDetail.POSTALCODE == null ? '' : data.shipToDetail.POSTALCODE}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Truck No. :</td>

        </tr>
        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>Mobile :  &nbsp;&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].MOBILE}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Mobile :  &nbsp;&nbsp;${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Driver No. :</td>

        </tr>
        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>GSTIN :&nbsp;&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].GSTNO}</td>
            <td colspan='8' style='border-right: 1px solid black;'>GSTIN :&nbsp;&nbsp;${data.shipToDetail.GSTNO == null ? '' : data.shipToDetail.GSTNO}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>

        </tr>
        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>PAN No : &nbsp;&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].VATNO}</td>
            <td colspan='8' style='border-right: 1px solid black;'>PAN No : &nbsp;&nbsp;${data.shipToDetail.VATNO == null ? '' : data.shipToDetail.VATNO}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :</td>

        </tr>
        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>State Code : &nbsp;&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].STATE}</td>
            <td colspan='8' style='border-right: 1px solid black;'>State Code : &nbsp;&nbsp;${data.shipToDetail.STATE == null ? '' : data.shipToDetail.STATE}</td>
            <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N</td>
        </tr>
        <tr>
            <td colspan='8' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
            <td colspan='8' style='border-right: 1px solid black;'>Beat:&nbsp;&nbsp;</td>
            <td colspan='8' style='border-right: 1px solid black;'></td>
        </tr>
        <tr style='border: 1px solid black;'>
            <td style='border-right: 1px solid black;'><b>S.No.</b></td>
            <td style='border-right: 1px solid black;max-width:200px;' colspan='2'><b>Material Description</b></td>
            <td style='border-right: 1px solid black;'><b>Item Code</b></td>
            <td style='border-right: 1px solid black;'><b>HSN/SAC</b></td>
            <td style='border-right: 1px solid black;'><b>MRP</b></td>
            <td style='border-right: 1px solid black;'><b>Batch No</b></td>
            <td style='border-right: 1px solid black;'><b>Mfg</b></td>
            <td style='border-right: 1px solid black;'><b>Exp</b></td>
            <td style='border-right: 1px solid black;'><b>CLD</b></td>
            <td style='border-right: 1px solid black;'><b>Pcs</b></td>
            <td style='border-right: 1px solid black;'><b>UOM</b></td>
            <td style='border-right: 1px solid black;'><b>Rate</b></td>
            <td style='border-right: 1px solid black;'><b>P Dis</b></td>
            <td style='border-right: 1px solid black;'><b>S Dis</b></td>
            <td style='border-right: 1px solid black;'><b>Othr Dis</b></td>
            <td style='border-right: 1px solid black;'><b>Taxable</b></td>
            <td style='border-right: 1px solid black;'><b>IGST%</b></td>
            <td style='border-right: 1px solid black;'><b>IGST Amt</b></td>
            <td style='border-right: 1px solid black;'><b>CGST%</b></td>
            <td style='border-right: 1px solid black;'><b>CGST Amt</b></td>
            <td style='border-right: 1px solid black;'><b>SGST%</b></td>
            <td style='border-right: 1px solid black;'><b>SGST Amt</b></td>
            <td style='border-right: 1px solid black;'><b>Amount</b></td>
        </tr>`

        for (j; j <= this.numberOfItem; j++) {
          if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
            //start of calculation for page sub total
            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
            //End of calculation for page sub total
            row = row + `
                    <tr>
                    <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                    <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                    <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                    <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                    <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                    <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                    <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                    <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>
                    <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? data.ProdList[this.arrayIndex].GSTRATE : ""}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(data.ProdList[this.arrayIndex].VAT) : ""}</td>
                    <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : ""}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : ""}</td>
                    <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : ""}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : ""}</td>
                    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                </tr>  `

          }


          this.arrayIndex = this.arrayIndex + 1;

        }
        // Start of page Sub total
        row = row + `
            <tr style='border: 1px solid black;'>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;' colspan='2'>Page Sub-Total</td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'><b></b></td>
            <td style='border-right: 1px solid black;'><b></b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
            <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : ''}</b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : ''}</b></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : ''}</td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
         </tr>
        `
        //End of page Sub total

        // Start Grand Page total
        if (i == this.noOfInvoice) {
          row = row + `
            <tr style='border: 1px solid black;'>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;' colspan='2'>Grand Total</td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'><b></b></td>
            <td style='border-right: 1px solid black;'><b></b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
            <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
            <td style='border-right: 1px solid black;'></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : ''}</b></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : ''}</b></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : ''}</b></td>
            <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(data.NETAMNT)}</b></td>
             </tr>
            `
        }
        // End Of Page Grand Total


        //start of gst footer header
        if (data.AdditionalObj.TRNTYPE == "interstate") {
          row = row + `
                    <tr>
                    <td colspan='2'>IGST%</td>
                    <td colspan='2'>IGST AMT</td>
                    <td colspan='2'>CGST%</td>
                    <td colspan='2'>CGST AMT</td>
                    <td colspan='2'>SGST %</td>
                    <td colspan='2'>SGST AMT</td>
                    <td colspan='2'>TAXABLE</td>
                    <td colspan='5'></td>
                    <td colspan='4'>
                    <b>
                    Bill Disc:
                    <br>
                    Total Dis Amt:
                    <br>
                    Gross Amt:
                    <br>
                    Tax Amt:
                    <br>
                    Round Off:
                    <br>
                    Amount:
                    </b>
                </td>
                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                <br>
                ${this.limitDecimal(data.DCAMNT)}<br>
                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                ${this.limitDecimal(data.VATAMNT)}<br>
                 ${this.limitDecimal(data.ROUNDOFF)}<br>
                 ${this.limitDecimal(data.NETAMNT)}
                </b></td>
            </tr>`
          //End ofgst footer header

          for (let index in this.gstData) {
            row = row + `<tr>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : '0'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : '0'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : '0'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : '0'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : '0'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : '0'}</td>
                    <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                    <td colspan='10' style='border-right:1px solid black;'></td>
                <tr>
                    `
          }

          row = row + `
            <tr>
                <td colspan='22'>Remarks: ${data.REMARKS}</td>
                <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
            </tr>
            <tr style='border-top: 1px solid black;'>
                <td colspan='22'>GST Amount : ${data.GSTINWORD}</td>
                <td colspan='2' style='text-align: right;'>${this.companyProfile.NAME}</td>
            </tr>
            <tr>
                <td colspan='22'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                <td colspan='2' style='border-right:1px solid black;'><br></td>
            </tr>
            <tr style='border-top: 1px solid black'>
                <td colspan='24' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}
                    and that all particlars are true and correct
                </td>
            </tr>`
        }

        row = row + ` </tbody>
    </table>`
        if (i != this.noOfInvoice) {
          row = row + `
                    <div class="pagebreak"></div>
                    `
        }
      }
    }
    return row
  }


}
