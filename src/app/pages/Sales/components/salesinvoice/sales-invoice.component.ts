import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/setting.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";

@Component({
  selector: "sales-invoice",
  templateUrl: "./sales-invoice.component.html",
  providers: [TransactionService],
  styles: [
    `
      .GRNPopUp tbody tr:hover {
        background-color: #e0e0e0;
      }
      .GRNPopUp tr.active td {
        background-color: #123456 !important;
        color: white;
      }
      .modal-dialog.modal-md {
        top: 45%;
        margin-top: 0px;
      }

      .modal-dialog.modal-sm {
        top: 45%;
        margin-top: 0px;
      }

      .table-summary > tbody > tr > td {
        font-size: 10px;
      }

      .table-summary > tbody > tr > td:first-child {
        text-align: left !important;
      }
    `
  ]
})
export class SalesInvoiceComponent {
  // @ViewChild('printTaxInvoiceButton') printTaxInvoiceButton: ElementRef 


  private returnUrl: string;
  private subcriptions: Array<Subscription> = [];
  TrnMainObj: TrnMain;
  voucherType: VoucherTypeEnum = VoucherTypeEnum.Sales;
  prefix: PREFIX = <PREFIX>{};
  public printCopyCaption: string = "";
  checkstatus = true;
  checkView: string;
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private router: Router,
    private arouter: ActivatedRoute,
    private _hotkeysService: HotkeysService,
    private setting: SettingService
  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;

    if (!!this.arouter.snapshot.params["pmode"]) {
      this._trnMainService.PMode = this.arouter.snapshot.params["pmode"];
    }

    if (_trnMainService.PMode == "c") {
      this.TrnMainObj.TRNAC = this.setting.appSetting.ConsumptionAccount
        ? this.setting.appSetting.ConsumptionAccount
        : "DE15507V";
      this.TrnMainObj.PARAC = this.setting.appSetting.ConsumptionAccount
        ? this.setting.appSetting.ConsumptionAccount
        : "DE15507V";
    }
    if (!!this.arouter.snapshot.params["vt"]) {
      this.voucherType = this.arouter.snapshot.params["vt"];
    }
    if (this.voucherType == VoucherTypeEnum.SalesReturn) {
      this.TrnMainObj.VoucherPrefix = "SR";
      this.TrnMainObj.VoucherType = VoucherTypeEnum.SalesReturn;
      this._trnMainService.pageHeading = "Sales Return";
    } else if (this.voucherType == VoucherTypeEnum.TaxInvoice) {
      this.TrnMainObj.VoucherPrefix = "TI";
      this.TrnMainObj.VoucherType = VoucherTypeEnum.TaxInvoice;
      this._trnMainService.pageHeading = "Tax Invoice";
    } else {
      this.TrnMainObj.VoucherPrefix = "SI";
      this.TrnMainObj.VoucherType = VoucherTypeEnum.Sales;
      this._trnMainService.pageHeading = "Sales Invoice";
      this.voucherType = VoucherTypeEnum.Sales;
    }
    this._hotkeysService.add(
      new Hotkey(
        "alt+s",
        (): boolean => {
          this.onSaveClicked();
          return true;
        }
      )
    );
    this._trnMainService.prodListMode = null; 
   
  }

  onItemDoubleClick(event){ 
    this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { vchr: event.VCHRNO, div: event.DIVISION, phiscal: event.PhiscalID,vt:VoucherTypeEnum.TaxInvoice,mode: "view",pmode:"p"  }])
    this.retfreshView();
  }

  ngOnInit() {
    this.retfreshView();
  }

  retfreshView(){
    if (!!this.arouter.snapshot.params["returnUrl"]) {
      this.returnUrl = this.arouter.snapshot.params["returnUrl"];
    }

    if (!!this.arouter.snapshot.params["mode"]) {
      var mode: string;
      mode = this.arouter.snapshot.params["mode"];
      ////console.log({ngonint:'before init'});
      this.TrnMainObj.Mode = mode == "add" ? "NEW" : mode.toUpperCase();
      // ////console.log("trnmainmode", this.TrnMainObj.Mode)
      this.checkView = this.TrnMainObj.Mode;
      if (this.checkView == "VIEW") {
        this.checkstatus = false;
        setTimeout(() => {
          this.checkstatus = true;
        }, 5000);

        let division: string;
        let phiscalid: string;

        if (!!this.arouter.snapshot.params["div"]) {
          division = this.arouter.snapshot.params["div"];
        }

        if (!!this.arouter.snapshot.params["phiscal"]) {
          phiscalid = this.arouter.snapshot.params["phiscal"];
        }

        if (!!this.arouter.snapshot.params["vchr"]) {
          let VCHR = this.arouter.snapshot.params["vchr"];

          this._trnMainService.loadData(VCHR, division, phiscalid);
          this._trnMainService.loadDataObservable.subscribe(data => {
            this.TrnMainObj = data;
            // //console.log({ mainTrnMAIN: this._trnMainService.TrnMainObj });
          });
        }
      } else {
      }
    }
  }

  // onViewClicked(event) { 
  //   ////console.log("view clicked")
  //   this.genericGrid.show(); 
  // }

  onSaveClicked() {
    // ////console.log("trnmainSaveObj",this.TrnMainObj);
    this.removeInvalidRowsFromprod();
    this.onsubmit();
  }
  TaxInvoice: any;
  onsubmit() {
    try {
      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales &&
        this.TrnMainObj.NETAMNT > this._trnMainService.MaxTotalAmountLimit
      ) {
        alert("Total amount reached the Abbrevaiated Tax limit Rs. 5000");
        return;
      }
      if (this.TrnMainObj.BILLTOTEL) {
        // //console.log({ billtotel: parseFloat(this.TrnMainObj.BILLTOTEL) })
        var pno = parseFloat(this.TrnMainObj.BILLTOTEL);
        if (pno.toString().length != 9) {
          alert("PAN No is not correct");
          return;
        }
      }
      if (!this.TrnMainObj.TRNAC) {
        alert("Transaction");
      }
      if (this._trnMainService.salesMode == "counter") {
        this.TrnMainObj.VMODE = 1;
      } else if (this._trnMainService.salesMode == "delivery") {
        this.TrnMainObj.VMODE = 2;
      } else if (this._trnMainService.salesMode == "outofwarrenty") {
        this.TrnMainObj.VMODE = 3;
      } else {
        this.TrnMainObj.VMODE = 0;
      }
      //  this.TrnMainObj.ProdList.forEach(prod => prod.WAREHOUSE =this.TrnMainObj.MWAREHOUSE);
      this.TrnMainObj.ProdList.forEach(
        prod => (prod.BRANCH = this.TrnMainObj.BRANCH)
      );
      //this.TrnMainObj.VoucherPrefix = this.prefix.VNAME;
      // this.TrnMainObj.VoucherType = VoucherTypeEnum.Purchase;
      let extraObj;
      if (
        this._trnMainService.prodListMode != null &&
        this._trnMainService.prodListMode.mode == "fromDispatch"
      ) {
        // this.TrnMainObj.REFORDBILL = this._trnMainService.prodListMode.selectedRow.VCHRNO;
        //   this.TrnMainObj.REFBILL = this._trnMainService.prodListMode.selectedRow.REFORDBILL;
        //  let dialogTrnMain: TrnMain = this._trnMainService.prodListMode.selectedRow;
        //  let vchrStatusObj: VoucherSatus = { vouchertype: dialogTrnMain.VoucherType, VCHRNO: dialogTrnMain.VCHRNO, DIVISION: dialogTrnMain.DIVISION, PhiscalID: dialogTrnMain.PhiscalID }
        // this.TrnMainObj.VoucherStatus = JSON.stringify(vchrStatusObj)
        extraObj = null; //this._trnMainService.prodListMode.selectedRow;
        // if(this._trnMainService.salesMode == 'outofwarrenty'){
        //     let vmode="complete";
        //     if(this.selectedWTMRow!=null && this.selectedWTMRow.PRESCRIBEBY.toUpperCase()=="VOID"){
        //         if(this.TrnMainObj.ProdList.length!=this.WTMItemDetails.length){
        //          vmode="partial";
        //         }
        //     }
        //     let vchrStatusObj: VoucherSatus = { vouchertype: this.selectedWTMRow.VoucherType, VCHRNO:  this.selectedWTMRow.VCHRNO, DIVISION:  this.selectedWTMRow.DIVISION, PhiscalID:  this.selectedWTMRow.PhiscalID,BillMode:vmode }
        //     this.TrnMainObj.VoucherStatus = JSON.stringify(vchrStatusObj)
        // }
        if (this._trnMainService.salesMode == "warrenty") {
          //   this._trnMainService.warrentyVchrList.forEach(w=>w.VoucherType=this.TrnMainObj.VoucherType);
          extraObj = this._trnMainService.warrentyVchrList;
        }
      } else {
        extraObj = null;
      }
      //  ////console.log("saveTranmain",this.TrnMainObj);

      let sub = this.masterService
        .saveTransaction(this.TrnMainObj.Mode, this.TrnMainObj, extraObj)
        .subscribe(
          data => {
            //console.log({ savedResult: data });
            if (data.status == "ok") {
              if (data.result.TRNMAIN.TRNDATE != null)
                data.result.TRNMAIN.TRNDATE = new Date(
                  data.result.TRNMAIN.TRNDATE
                )
                  .toJSON()
                  .split("T")[0];
              this._trnMainService.PrintStuffSubject.next(data.result);
              this.TaxInvoice = data;
              //console.log({ TAXINVOICE: this.TaxInvoice });
              this.checkstatus = true;

              this.router.navigate([this.returnUrl]);
            }
          },
          error => {
            alert(error);
          }
        );
      this.subcriptions.push(sub);
    } catch (e) {
      alert(e);
    }
  }

  // onPrintClicked() {
  //     // if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales) {
  //     //     this.getDataForPrint();
  //     //     var x = 1;
  //     //     this.myTimer = setInterval(() => {
  //     //         x++;
  //     //         if (x = 10) {
  //     //             clearInterval(this.myTimer);
  //     //         }
  //     //         //console.log({ fromtimerPricopy: this.printCopyCaption })
  //     //         if (this._trnMainService.PrintStuffSubject.getValue()) {
  //     //             this.printIt();
  //     //             this._trnMainService.PrintStuffSubject.next(null);
  //     //         }
  //     //     }, 1000)
  //     // }
  //     // else {
  //     var param;
  //     if (this.TrnMainObj.Mode == "NEW") {

  //         var returnedData = this._trnMainService.PrintStuffSubject.getValue()
  //         //console.log({ onPrintReturnData: returnedData, trnmainObj: this.TrnMainObj })
  //         if (returnedData) {
  //             var retrunedTrnmain = returnedData.TRNMAIN
  //             param = { VCHRNO: retrunedTrnmain.VCHRNO, DIVISION: retrunedTrnmain.DIVISION, PHISCALID: retrunedTrnmain.PhiscalID, REMARKS: "" }
  //         }

  //     }
  //     else {
  //         this.getDataForPrint();
  //         param = { VCHRNO: this.TrnMainObj.VCHRNO, DIVISION: this.TrnMainObj.DIVISION, PHISCALID: this.TrnMainObj.PhiscalID, REMARKS: "" }
  //     }
  //     this.masterService.getList(param, "/GetReprintCaption").subscribe(
  //         ret => {
  //             this.printCopyObject = ret;
  //             this.printCopyCaption = ret.result;
  //             //console.log({ printcopyCaption: ret })
  //             //this.printIt();
  //         }
  //         , error => this.masterService.resolveError(error, "onprintClick")

  //     );
  //     var x = 1;
  //     this.myTimer = setInterval(() => {
  //         x++;
  //         if (x = 10) {
  //             clearInterval(this.myTimer);
  //         }
  //         //console.log({ fromtimerPricopy: this.printCopyCaption })
  //         if (this.printCopyObject) {
  //             this.printIt();
  //             this.printCopyObject = null;
  //         }
  //     }, 1000)

  //     //}

  // }

  // public printIt() {
  //     clearInterval(this.myTimer);
  //     try {
  //         let printContents, popupWin;

  //         if (this.voucherType == VoucherTypeEnum.TaxInvoice) {
  //             //this.taxinvoiceDialog.show();
  //             printContents = document.getElementById('InvoiceNewPrint').innerHTML;
  //         }
  //         else if (this.voucherType == VoucherTypeEnum.Sales) {
  //             printContents = document.getElementById('SalesInvoicePrint').innerHTML;
  //         }

  //         ////console.log("reach printclicked()", printContents);
  //         popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px'); //console.log({ POPUP: popupWin })
  //         // popupWin.document.open();
  //         popupWin.document.write(`
  //       <html>
  //           <head>
  //               <style>
  //                 @media print {
  //                     footer {page-break-after: always;}
  //                 }
  //                 .InvoiceHeader{
  //                     text-align:center;
  //                     font-weight:bold
  //                 }
  //                 p
  //                 {
  //                     height:5px;
  //                 }
  //                 table{
  //                     margin:5px
  //                 }
  //                 .summaryTable{
  //                     float: right;
  //                     border: none;
  //                 }

  //                 .summaryTable  td{
  //                     text-align:right;
  //                     border:none;
  //                 }

  //                 .itemtable{
  //                     border: 1px solid black;
  //                     border-collapse: collapse;
  //                 }
  //                 .itemtable th{
  //                     height:30px;
  //                     font-weight:bold;
  //                 }
  //                 .itemtable th, td {
  //                     border: 1px solid black;
  //                     padding:2px;

  //                 }
  //                     </style>
  //                 </head>
  //                 <body onload="window.print();window.close()">${printContents}
  //                 </body>
  //             </html>`
  //         );
  //         popupWin.document.close();
  //     }
  //     catch (ex) {
  //         //console.log({ printitError: ex })
  //     }
  // }

  // prefixChanged(pref: any) {
  //     try {
  //         //console.log({ prefixChangedprefix: pref })
  //         this._trnMainService.prefix = pref;
  //         this.prefix = pref;
  //         if (this.TrnMainObj.Mode == 'NEW') {
  //             var tMain = <TrnMain>{ VoucherPrefix: pref.VNAME };
  //             if (this.TrnMainObj.DIVISION == '' || this.TrnMainObj.DIVISION == null) {
  //                 tMain.DIVISION = this.setting.appSetting.DefaultDivision;
  //             }
  //             this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
  //                 if (res.status == "ok") {
  //                     let TMain = <TrnMain>res.result;
  //                     this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(2, TMain.VCHRNO.length - 2);
  //                     this.TrnMainObj.CHALANNO = TMain.CHALANNO;
  //                 }
  //                 else {
  //                     alert("Failed to retrieve VoucherNo")
  //                     //console.log(res);
  //                 }
  //             });
  //         }
  //     } catch (ex) {
  //         //console.log(ex);
  //         alert(ex);
  //     }
  // }

  // private getDataForPrint() {
  //     var param = { VCHRNO: this.TrnMainObj.VCHRNO, DIVISION: this.TrnMainObj.DIVISION, PHISCALID: this.TrnMainObj.PhiscalID }
  //     this.masterService.getList(param, '/getDataForPrint').subscribe(data => {
  //         if (data.status == 'ok') {
  //             //console.log({ getDataForPrint: data });
  //             this._trnMainService.PrintStuffSubject.next(data.result)
  //         }
  //     })
  // }

  onCancelClicked() {
    this.router.navigate([this.returnUrl]);
  }

  // @ViewChild('TrnMainListchildModal') TrnMainListchildModal: ModalDirective;
  // @ViewChild('ItemDetailchildModal') ItemDetailchildModal: ModalDirective;
  // @ViewChild('WarentyVoucherchildModal') WarentyVoucherchildModal: ModalDirective;
  // WTMList: any[] = [];
  // WTMItemDetails: any[] = [];
  // WarrentyVList:any[]=[];
  // selectedWTMRow: any;
  // selectedWTMRowIndex: number;
  // DialogOpenEmitEvent(value) {
  //     this._trnMainService.prodListMode = { mode: "fromDispatch", selectedRow:<any>{} }
  //     this.selectedWTMRow=<any>{};
  //     if (value.mode == "OutOfWarrenty") {
  //         this.masterService.getSalesModeList(value.value).subscribe(res => {
  //             if (res.status == "ok") {
  //                this.WTMList = res.result;
  //                this.TrnMainListchildModal.show();
  //             }
  //         }, error => {
  //             this.masterService.resolveError(error, "sale-invoice - getSalesModeList");
  //         });

  //     }
  //     else if (value.mode == "Warrenty") {
  //         this.WTMItemDetails=[];
  //         this.masterService.getSalesModeList(value.value).subscribe(res => {
  //             if (res.status == "ok") {

  //                this.WarrentyVList = res.result;
  //                this.WarentyVoucherchildModal.show();
  //             }
  //         }, error => {
  //             this.masterService.resolveError(error, "sale-invoice - getSalesModeList");
  //         });
  //     }
  // }

  // WTMrowClick(selectedRow, index) {
  //     this.selectedWTMRow = selectedRow;
  //     this.selectedWTMRowIndex = index;
  // }
  //     onLoadWTMItemDetail() {
  //         this.WTMItemDetails = [];
  //         this.TrnMainObj.TRNAC=this.selectedWTMRow.TRNAC;
  //         this.TrnMainObj.REFBILL=this.selectedWTMRow.REFBILL;
  //         this.masterService.getList({ VCHRNO: this.selectedWTMRow.VCHRNO, DIVISION: this.selectedWTMRow.DIVISION, PHISCALID: this.selectedWTMRow.PhiscalID,VOUCHERTYPE:this.TrnMainObj.VoucherType }, "/getDeliveryProdList")
  //         .subscribe(
  //             data => {
  //                 if(data.status=="ok"){
  //               this.WTMItemDetails=data.result;
  //               if(this.selectedWTMRow.PRESCRIBEBY.toUpperCase()=="NO"){
  //                             for (let item of this.WTMItemDetails) {
  //                                 item.isCheckForImport=true;
  //                             }
  //                           this.onsubmitItemDetail();
  //                         }
  //                 }
  //             }
  //             , error => {
  //                 this.masterService.resolveError(error, "dispatchDialog - onLoadWTMItemDetail");
  //             }
  //         );
  //         if(this.selectedWTMRow.PRESCRIBEBY.toUpperCase()=="VOID"){
  //         this.ItemDetailchildModal.show();
  //         }
  //     }
  //     onsubmitItemDetail() {
  //         this.TrnMainObj.ProdList = [];
  //         for (let item of this.WTMItemDetails) {
  //             if (item.isCheckForImport == true) {
  //                 var rItem = item;
  //                 if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales) {
  //                   rItem.RealQty = item.REALQTY_IN;
  //                   rItem.AltQty = item.ALTQTY_IN;
  //                   rItem.REALQTY_IN = 0;
  //                   rItem.ALTQTY_IN = 0;
  //                 }
  //                 else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
  //                     rItem.RealQty = 0;
  //                     rItem.AltQty = 0;
  //                     rItem.REALQTY_IN = item.RealQty;
  //                     rItem.ALTQTY_IN =item.AltQty;
  //                 }
  //                 else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
  //                     rItem.RealQty = item.REALQTY_IN;
  //                     rItem.AltQty = item.ALTQTY_IN;
  //                     rItem.REALQTY_IN = 0;
  //                     rItem.ALTQTY_IN = 0;
  //                 }
  //               //  rItem.BATCH=this.selectedWTMRow.VCHRNO;

  //                 rItem = this._trnMainService.CalculateNormal(rItem);
  //                 this.TrnMainObj.ProdList.push(rItem);

  //             }
  //         }
  //             this.TrnMainObj = this._trnMainService.ReCalculateBill(this.TrnMainObj);
  // this.ItemDetailchildModal.hide();
  // this.TrnMainListchildModal.hide();

  // }
  // onsubmitWarrentyVoucher(){
  //     this._trnMainService.prodListMode = { mode: "fromDispatch", selectedRow: <any>{} }
  //     this.TrnMainObj.TRNAC=this.WarrentyVList[0].TRNAC;
  //     let rList= this._trnMainService.warrentyVchrList=this.WarrentyVList.filter(v=>v.isCheckForImport==true);
  //     this.masterService.getList(rList, "/getWarrentyProdList")
  //         .subscribe(res => {
  //            this.WTMItemDetails=res.result.prodlist;
  //             this.WTMItemDetails.forEach(p=>p.isCheckForImport=true);
  //             this.onsubmitItemDetail();
  //             this.WarentyVoucherchildModal.hide();

  //        }, error => {
  //            this.masterService.resolveError(error, "dispatchDialog - getWarrentyProdList");
  //        });
  // }
  removeInvalidRowsFromprod() {
    this.TrnMainObj.ProdList = this.TrnMainObj.ProdList.filter(
      x =>
        x.MCODE != null && x.MCODE != "" && x.Quantity != null && x.Quantity > 0
    );
  }
}
