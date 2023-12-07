import { AdditionalCostService } from "../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { TransactionService } from "./transaction.service";
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
//import {TAcList} from '../../../../common/interfaces';
import { TrnMain, VoucherTypeEnum, TrnProd, BillTrack } from "../interfaces/TrnMain";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";
import { GenericPopUpComponent, GenericPopUpSettings } from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { PrintInvoiceComponent } from "../Invoice/print-invoice/print-invoice.component";
import { ImportPurchaseDetails } from "../popupLists/import-purchase-details/import-purchase-details.component";


@Component({
  selector: "voucher-master-action",
  templateUrl: "./voucher-master-action.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"],
  providers: [PrintInvoiceComponent]
})
export class VoucherMasterActionComponent implements OnInit {
  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";
  TrnMainObj: TrnMain = <TrnMain>{};
  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};
  // additonalCost is 99 sends from AdditionalCost component
  @Input() additionCost: number;
  @Output() additionalcostEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromSOClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromPOClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromHOPerformaInvoiceClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromPerformaInvoiceClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromHoTaxInvoiceClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromSAPFTPClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromStockSettlementApproval: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSettlementStockApprove: EventEmitter<any> = new EventEmitter<any>();
  @Output() onApproveStockSettlementList: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPInvoieFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  // @Output() onPOCancelPurchaseOrderLoadEmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  @Output() onLoadCancelSalesEmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("genericGridHoldBill") genericGridHoldBill: GenericPopUpComponent;
  @ViewChild("genericGridIntend") genericGridIntend: GenericPopUpComponent;
  @ViewChild('printSetupModal') printSetupModal: ElementRef;
  @ViewChild("ImportPurchaseDetail") ImportPurchaseDetail: ImportPurchaseDetails;

  @Output() onAddNewCustomerClickEmit: EventEmitter<any> = new EventEmitter<any>();
  returnUrl: string;
  checkstatus = true;
  viewSubscription: Subscription = new Subscription();
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  showSecondaryButtons: boolean;
  gridPopupSettingsForHoldBill: GenericPopUpSettings = new GenericPopUpSettings();
  trialUrl: boolean = false;
  showUnApprove: boolean = false;
  activeurlpath: any;
  gridPopupSettingsForIntend: GenericPopUpSettings = new GenericPopUpSettings();
  showAdvanceAdjustmentPopUp: boolean = false;
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    public additionalCostService: AdditionalCostService,
    authservice: AuthService,
    public dialog: MdDialog,
    private router: Router,
    private arouter: ActivatedRoute,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private loadingService: SpinnerService,
    public invoicePrint: PrintInvoiceComponent,

  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.masterService.ShowMore = false;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    
    this.voucherType = this.TrnMainObj.VoucherType;
    this.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.showSecondaryButtons = false;
    this.masterService.refreshTransactionList();
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
    ) {
      this.transactionType = "creditnote";
    }

    this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings(this.TrnMainObj.VoucherPrefix);

    this.gridPopupSettingsForHoldBill = this.masterService.getGenericGridPopUpSettings("HOLDBILLLIST");
    this.gridPopupSettingsForIntend = this.masterService.getGenericGridPopUpSettings("INTENDLIST");
    this.activeurlpath = arouter.snapshot.url[0].path;

  }
  drillmode:any;
  ngOnInit() {
    this.arouter.queryParams.subscribe(params => {
      if (params['mode']=="DRILL" && params['returnUrl']) {
        this.drillmode ="DRILL";
        let activeurlpath = params['returnUrl']
        let abcd='/pages/financialreports/account-ledger-reports/'
        this.returnUrl = abcd + activeurlpath;
      }else{
        this.returnUrl = "/pages/dashboard/dashboard";
        // if (!!this.arouter.snapshot.params["returnUrl"]) {
        //   this.returnUrl = this.arouter.snapshot.params["returnUrl"];
        // }
        // if (this.activeurlpath == 'StockSettlementEntryApproval') {
        //   return this.trialUrl = true;
        // }
        // if (this.activeurlpath == 'StockSettlementEntry') {
        //   return this.showUnApprove = true;
        // }
      }
    });

   

  }

  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
    }
  }

  stockSettlementApprovalLoad() {
    this.onLoadFromStockSettlementApproval.emit(true);
  }

  stockSettlementOnApproveList() {
    this.onApproveStockSettlementList.emit(true);
  }



  stockSettlementApprove() {
    var voucherNumber = this._trnMainService.TrnMainObj.Mode = "NEW";
    this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(x => x.IsApproveStockSettlement == true);
    this.masterService.saveTransaction(voucherNumber, this._trnMainService.TrnMainObj)
      .subscribe(data => {
        if (data.status == 'ok') {
          this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
        }
        error => {
          this.alertService.error(error);
        }
      });

  }

  onLoadFromSalesOrder() {
    this.onLoadFromSOClickEmit.emit(true);
  }
  onLoadSalesCancel() {
    this.onLoadCancelSalesEmit.emit(true)
  }

  onLoadFromPurchaseOrder() {
    this.onLoadFromPOClickEmit.emit(true);
  }

  onLoadFromHOPerformaInvoiceClick() {
    this.onLoadFromHOPerformaInvoiceClickEmit.emit(true)
  }

  onLoadFromHoTaxInvoiceClick() {
    this.onLoadFromHoTaxInvoiceClickEmit.emit(true)
  }

  onLoadFromSAPFTPClick() {
    this.onLoadFromSAPFTPClickEmit.emit(true)
  }

  // onLoadPOForPOCancel(){
  //   this.onPOCancelPurchaseOrderLoadEmit.emit(true);
  // }

  onCloseClicked() {
    this.router.navigate(["/pages/dashboard"]);
  }

  onViewClicked() {


    // this.onViewClickEmit.emit(null);
    if (this.activeurlpath == "StockSettlementEntry") {
      this.stockSettlementOnApproveList();
    }
    else {
      this.genericGrid.show();
    }
  }


  public promptPrintDevice: boolean = false
  promptPrinterDevice() {
    this.promptPrintDevice = true
  }
  public printControl = new FormControl(0)

  setPrinterAndprint() {
    this.promptPrintDevice = false;
    this.userProfile.PrintMode = this.printControl.value
    if (this.userProfile.PrintMode == 1) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {
        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC).subscribe((res) => {
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix)
          this.loadingService.hide()
        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    } else if (this.userProfile.PrintMode == 0) {
      try {
        this.masterService.getReprintData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNUSER).subscribe((response) => {
          this.print(response.result)
        }, err => {
          this.alertService.error(err);
        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    } else {
      try {
        this.masterService.getReprintData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNUSER).subscribe((response) => {
          this.print(response.result)
        }, err => {
          this.alertService.error(err);
        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }


    setTimeout(() => {
      this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType
      this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
    }, 100);

  }




  onPrintClicked() {
    this.promptPrinterDevice()
  }



  print(printStr: string) {
    var ws;
    var state;
    ws = new WebSocket('ws://127.0.0.1:1660');
    ws.addEventListener('message', ws_recv, false);
    ws.addEventListener('open', ws_open(printStr), false);
    function ws_open(text) {
      ws.onopen = () => ws.send(text)
    }

    function ws_recv(e) {
      alert("2 : success");
    }
  }
  
  onSaveClicked() {

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
      if (this._trnMainService.TrnMainObj.REMARKS == null || this._trnMainService.TrnMainObj.REMARKS == "" || this._trnMainService.TrnMainObj.REMARKS == undefined) {
        this.alertService.info("Remarks is required...");
        return;
      }
    }
   

   
  

   
    if (!this.transactionValidator()) return;
    //for bill tracking
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
      if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.TrnMainObj.BALANCE < 0) || (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase && this._trnMainService.TrnMainObj.BALANCE > 0)) {
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj = <any>{};
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj.AdjustmentType = "full";
        this.showAdvanceAdjustmentPopUp = true;
        return;
      }
    }
    
    this.onSubmit();
  }

  transactionValidator(): boolean {
    this.removeInvalidRowsFromprod();
    this._trnMainService.MergeSameItemWithSameBatchOfProd();
   

    if (!this._trnMainService.setDefaultValueInTransaction()) { return false; }
    return true;
  }
 
  onSubmit() {
    if (this.activeurlpath == 'StockSettlementEntry') {
      if (this._trnMainService.TrnMainObj.Mode != "NEW") {
        this.alertService.warning("You are in View Mode can not be saved...");
        return;
      }
      this.masterService.saveStockSettlement(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj).subscribe(data => {
        if (data.status == 'ok') {

          this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
        }
      })
    }
    else if (this.activeurlpath == "StockSettlementEntryApproval") {
      this.stockSettlementApprove();
    }
    else {

      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        if (this._trnMainService.TrnMainObj.TransporterEway != null) {
          this._trnMainService.TrnMainObj.TransporterEway.TOTALWEIGHT = this._trnMainService.TrnMainObj.TOTALWEIGHT;
        }
      }
      if (this._trnMainService.TrnMainObj.Mode == 'VIEW' && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel)) {
        this._trnMainService.TrnMainObj.Mode = 'NEW';
      }
      this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj)
        .subscribe(data => {
          if (data.status == 'ok') {
            let userProfile = this.authService.getUserProfile();
            this._trnMainService.TrnMainObj.PhiscalID = this._trnMainService.PhiscalObj.PhiscalID;
            this._trnMainService.TrnMainObj.TRNUSER = userProfile.username;
            if (this._trnMainService.TrnMainObj.VoucherType == 3) {
              if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
                || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor")
                && data != null && data.result2 != null && data.result2.AdditionalObj != null && data.result2.AdditionalObj.SHIPNAME != null) {

                this._trnMainService.TrnMainObj.VoucherType = 14;
                this._trnMainService.TrnMainObj.Mode = "VIEW";
                this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
                this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
                this._trnMainService.TrnMainObj.CHALANNO = "";

                for (let i in this._trnMainService.TrnMainObj.ProdList) {
                  this._trnMainService.getPricingOfItem(i, "", false);

                }

               if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher){
                 this._trnMainService.TrnMainObj.TRNMODE = 'Party Payment';
               }

                setTimeout(() => {
                  this._trnMainService.TrnMainObj.hasShipName = true;
                }, 0);

              }

              else {
                this.onPrintClicked()
             
              }
            } else {

              if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || 
                this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || 
                this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel ||
                 this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales || 
                 this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder || 
                 this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn ||
                  this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
                   this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
                    this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturn) {
                this.onPrintClicked();
              } else {
                this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType
                this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
              }

            }

          }
          else {
          }
        }, error => {
          this.alertService.error(error);
        })
    }



  }
  TaxInvoice: any;

  removeInvalidRowsFromprod() {
    this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(
      x =>
        x.MCODE != null && x.MCODE != ""
    );
  }

  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }

  onItemDoubleClick(event) {
    if (this.activeurlpath == 'StockSettlementEntry') {

    }
    else {
      if (this._trnMainService.TrnMainObj.ProdList != null && this._trnMainService.TrnMainObj.ProdList.length > 0) {
        let p = this._trnMainService.TrnMainObj.ProdList[0];
        if (p != null) {
          if (p.MCODE != null) {
            if (confirm("You are about to load the bill.Do you want to continue?")) {
              this.loadVoucher(event);
              return;
            }
            else {
              return;
            }
          }
        }
      }
      this.loadVoucher(event);
    }
  }

  onLoadFromPerformaInvoice() {
    this.onLoadFromPerformaInvoiceClickEmit.emit(true);
  }

  onShowImport() {
    this.onShowFileUploadPopupEmit.emit(true);
  }

  onImportPurchaseInvoice() {
    this.onPInvoieFileUploadPopupEmit.emit(true);
  }

  onShowImportSO() {
    if (this.TrnMainObj.BILLTO == null || this.TrnMainObj.BILLTO == undefined || this.TrnMainObj.BILLTO == "") {
      this.alertService.info("Select Customer");
      return;
    }
    this.onShowFileUploadPopupEmit.emit(true);
  }

  loadVoucher(selectedItem) {
    ////console.log("CheckLoadedItem")
    this._trnMainService.loadData(selectedItem.VCHRNO, selectedItem.DIVISION, selectedItem.PhiscalID);
    this._trnMainService.showPerformaApproveReject = false;
  }

  onNewClick() {
    if (confirm("Are you sure to Reset the transaction? ")) {
      this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
      this._trnMainService.showPerformaApproveReject = false;
      this._trnMainService.showAddCosting = false;
    }
  }

  onReset() {
    this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
    this._trnMainService.showPerformaApproveReject = false;
  }

  okClicked(value) {
    this._trnMainService.TrnMainObj.TenderList = value;
    console.table(this._trnMainService.TrnMainObj.TenderList);
    let TB = this._trnMainService.TrnMainObj.TenderList[0];
    if (TB == null) { this.alertService.error("Tender Amount not detected"); return; }
    this._trnMainService.TrnMainObj.TRNAC = TB.ACCOUNT;
    if (!this.transactionValidator()) return;

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
      if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.TrnMainObj.BALANCE < 0) || (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase && this._trnMainService.TrnMainObj.BALANCE > 0)) {
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj = <any>{};
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj.AdjustmentType = "full";
        this.showAdvanceAdjustmentPopUp = true;
        return;
      }
    }
    this.onSubmit();

  }

  approvePerformInvoice() {
    var voucherNumber = this._trnMainService.TrnMainObj.VCHRNO;

    this.masterService.approvePerformaInvoice(voucherNumber)
      .subscribe(result => {
        this.alertService.success("Performa invoice successfully approved");
      },
        error => {
          this.alertService.error(error);
        });
  }

  stockSettlementApproval() {

  }


  rejectPerformInvoice() {
    var voucherNumber = this._trnMainService.TrnMainObj.VCHRNO;
    this.masterService.rejectPerformaInvoice(voucherNumber)
      .subscribe(result => {
        this.alertService.success("Performa invoice successfully rejected");
      },
        error => {
          this.alertService.error(error);
        });
  }

  onNewCustomerClick() {
    // this.AddNewCustomerPopup.show();
  }
  okAddNewClicked(value) {
    let CustObj = value;
    CustObj.PRICELEVEL = value.GEO;
    CustObj.TYPE = "A"
    CustObj.PARENT = "PA";
    CustObj.PType = "C";
    CustObj.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
    let sub = this.masterService.saveAccount("add",CustObj,null).subscribe(
      data => {

        if (data.status == "ok") {
          let customer = data.result;

          this._trnMainService.TrnMainObj.BILLTO = customer.ACNAME;
          this._trnMainService.TrnMainObj.PARAC = customer.ACID;
          this._trnMainService.TrnMainObj.TRNAC = customer.ACID;
          this._trnMainService.TrnMainObj.BILLTOADD = customer.ADDRESS;
          this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = customer.PSTYPE;
          this._trnMainService.TrnMainObj.TRNMODE = customer.PMODE;
          this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = customer.ORG_TYPE;
          // this.AddNewCustomerPopup.hide();
        } else {
          //alert(data.result);
          //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
          if (
            data.result._body ==
            "The ConnectionString property has not been initialized."
          ) {
            this.router.navigate(["/login", this.router.url]);
            return;
          }
          //Some other issues need to check
          this.alertService.error(
            "Error in Saving Data:" + data.result._body
          );
        }
      },
      error => {

        this.alertService.error(error);
      }
    );


  }
  onRecallClick() {

    this.genericGridHoldBill.show();
  }
  onHoldClick() {
    if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null && x.BATCH != null)[0] == null) {
      this.alertService.info("No Valid Products entries Detect...");
      return;
    }
    this.masterService
      .masterPostmethod("/saveholdbill", this.HoldBillPreparationForSave())
      .subscribe(
        x => {
          if (x.status == "ok") {
            this._trnMainService.initialFormLoad(VoucherTypeEnum.TaxInvoice);
          }
        },
        error => {

          alert(error);
        }
      );
  }
  HoldBillPreparationForSave() {
    let holdbillObj = <any>{};
    let holdbillProdList = [];
    for (let i of this._trnMainService.TrnMainObj.ProdList) {
      if (i.MCODE != null && i.BATCH != null) {
        holdbillProdList.push(
          {
            MCODE: i.MCODE,
            UNIT: i.ALTUNIT,
            Quantity: i.Quantity,
            BATCH: i.BATCH,
            BC: i.BC,
            REMARKS: i.REMARKS,
            INVDISRATE: i.INDDISCOUNTRATE,
            INVDISAMOUNT: i.INDDISCOUNT,
            CONFACTOR: i.CONFACTOR
          }
        );
      }

    }
    holdbillObj = {
      PARAC: this._trnMainService.TrnMainObj.PARAC,
      REMARKS: this._trnMainService.TrnMainObj.REMARKS,
      DATE: this._trnMainService.TrnMainObj.TRNDATE,
      NETAMNT: this._trnMainService.TrnMainObj.NETAMNT,
      FLATDISRATE: this._trnMainService.TrnMainObj.DCRATE,
      FLATDISAMOUNT: this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT,
      INVOICETYPE: 'retailinvoice',
      PAYMENTSTATUS: 'Hold',
      holdBillProdList: holdbillProdList,
      SNO: this._trnMainService.TrnMainObj.HOLDBILLID
    }

    return holdbillObj;

  }
  onHoldBillDoubleClick(event) {
    this.loadingService.show("Recalling Bill.Please Wait...");
    this.masterService
      .masterPostmethod("/recallholdbill", event)
      .subscribe(
        x => {
          if (x.status == "ok") {
            this._trnMainService.initialFormLoad(VoucherTypeEnum.TaxInvoice);
            this.convertingRecallBillToMainBill(JSON.parse(x.result));
            this._trnMainService.TrnMainObj.HOLDBILLID = event.SNO;
            this.loadingService.hide();
          }
          else {
            this.loadingService.hide();
            this.alertService.error(x.result._body);
          }
        },
        error => {

          alert(error);
        }
      );
  }
  convertingRecallBillToMainBill(recalBill) {
    this._trnMainService.TrnMainObj.TRNAC =
      this._trnMainService.TrnMainObj.PARAC = recalBill.PARAC;
    if (recalBill.customer != null) {
      this._trnMainService.TrnMainObj.BILLTO = recalBill.customer.ACNAME;
      this._trnMainService.TrnMainObj.BILLTOADD = recalBill.customer.ADDRESS;
      this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = recalBill.customer.PSTYPE;
      this._trnMainService.TrnMainObj.TRNMODE = recalBill.customer.PMODE;
      this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = recalBill.customer.ORG_TYPE;
    }
    this._trnMainService.TrnMainObj.REMARKS = recalBill.REMARKS;
    this._trnMainService.TrnMainObj.INVOICETYPE = recalBill.INVOICETYPE;
    this._trnMainService.TrnMainObj.DiscRate = this._trnMainService.nullToZeroConverter(recalBill.FLATDISRATE);
    this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT = this._trnMainService.nullToZeroConverter(recalBill.FLATDISAMOUNT);


    this._trnMainService.TrnMainObj.ProdList = [];
    let rowindex = 0;
    for (let r of recalBill.holdBillProdList) {

      if (r.MCODE == null || r.BATCH == null) continue;


      var TP = <TrnProd>{};

      TP.MCODE = r.MCODE;
      TP.SELECTEDITEM = r.SELECTEDITEM;
      TP.BC = r.BC;
      TP.ISVAT = r.SELECTEDITEM.ISVAT;
      TP.MENUCODE = r.SELECTEDITEM.MENUCODE;
      TP.ITEMDESC = r.SELECTEDITEM.DESCA;
      TP.MCODE = r.SELECTEDITEM.MCODE;
      TP.GSTRATE_ONLYFORSHOWING = r.SELECTEDITEM.GST
      TP.GSTRATE = r.SELECTEDITEM.GST;
      TP.WEIGHT = r.SELECTEDITEM.GWEIGHT;
      TP.Mcat = r.SELECTEDITEM.MCAT;
      TP.MRP = r.SELECTEDBATCH.MRP;
      TP.BATCH = r.BATCH;
      TP.MFGDATE = ((r.SELECTEDBATCH.MFGDATE == null) ? "" : r.SELECTEDBATCH.MFGDATE.toString().substring(0, 10));
      TP.EXPDATE = ((r.SELECTEDBATCH.EXPIRY == null) ? "" : r.SELECTEDBATCH.EXPIRY.toString().substring(0, 10));
      TP.UNIT = r.SELECTEDBATCH.UNIT;
      TP.STOCK = r.SELECTEDBATCH.STOCK;
      TP.WAREHOUSE = r.SELECTEDBATCH.WAREHOUSE;
      TP.BATCHSCHEME = r.SELECTEDBATCH.SCHEMENAME;
      TP.Quantity = this._trnMainService.nullToZeroConverter(r.Quantity);
      TP.INDDISCOUNTRATE = this._trnMainService.nullToZeroConverter(r.INVDISRATE);
      TP.INDDISCOUNT = this._trnMainService.nullToZeroConverter(r.INVDISAMOUNT);
      TP.inputMode = false;
      TP.Product = <any>{};
      TP.Product.MCODE = r.MCODE;
      TP.Product.AlternateUnits = r.ALTUNITLIST;
      TP.ALTUNITObj = TP.Product.AlternateUnits.filter(x => x.ALTUNIT == r.UNIT)[0];

      this._trnMainService.TrnMainObj.ProdList.push(TP);

      this._trnMainService.AssignSellingPriceAndDiscounts(r.PClist, rowindex, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE);
      this._trnMainService.RealQuantitySet(rowindex, r.CONFACTOR);



      let rate1 = this._trnMainService.TrnMainObj.ProdList[rowindex].RATE;
      let rate2 = 0;
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
        rate2 = this._trnMainService.TrnMainObj.ProdList[rowindex].SPRICE;
      }
      else {
        rate2 = this._trnMainService.TrnMainObj.ProdList[rowindex].PRATE;
      }
      this._trnMainService.setunit(rate1, rate2, rowindex, this._trnMainService.TrnMainObj.ProdList[rowindex].ALTUNITObj);
      this._trnMainService.CalculateNormalNew(rowindex);
      rowindex++;

    }
    this._trnMainService.ReCalculateBill();

  }
  onTransportClick() {

  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {

    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = true;
    }
    else if ($event.code == "F3") {
      $event.preventDefault();
      this.onNewClick();
    }
    else if ($event.code == "F6") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.Mode != 'VIEW') {
        if (!this._trnMainService.showPerformaApproveReject) {
          this.onSaveClicked();
        }
      }
    }
    else if ($event.code == "F4") {
      $event.preventDefault();
      if (!this._trnMainService.showPerformaApproveReject && this._trnMainService.TrnMainObj.VoucherType != 58 && this._trnMainService.TrnMainObj.VoucherType != 61) {
        this.onViewClicked();
      }
    }
    else if ($event.code == "F8") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 14) {
        this.onPrintClicked();
      }
    }else if ($event.code == "F10") {
      $event.preventDefault();
      this.onBackClicked();
    }
  }
  @HostListener("document : keyup", ["$event"])
  handleKeyUpboardEvent($event: KeyboardEvent) {

    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = false;
    }

  }
  onShowIndentLoadForPO() {

  }
  onIntendDoubleClick() {

  }


  cancelprint() {
    this.promptPrintDevice = !this.promptPrintDevice;
    this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);

  }

  OkAdvanceAdjustment() {
    this.showAdvanceAdjustmentPopUp = false;

    this.onSubmit();
  }
  cancelAdvanceAdjustment() {
    this.showAdvanceAdjustmentPopUp = false;
    this._trnMainService.TrnMainObj.AdvanceAdjustmentObj = null;
    this.onSubmit();
  }

  onBackClicked() {
    if(this.drillmode == "DRILL"){
      this.router.navigate(
        [this.returnUrl],
        {
          queryParams: {
            mode: 'DRILL'          }
        }
      );
    }else{
      this.router.navigate([this.returnUrl]);
    }
  }

  onAddCosting() {
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase &&
      this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toUpperCase() == "SUPERDISTRIBUTOR" &&
      this._trnMainService.TrnMainObj.Mode != "NEW") {
      this._trnMainService.showAddCosting = true;
    }
  }

  onImportDetailsClick() {
    if (this._trnMainService.TrnMainObj.IMPORTDETAILS == null) {
      this._trnMainService.TrnMainObj.IMPORTDETAILS = <any>{};
    }
    this.masterService.getPurchaseImportDetails(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res => {
      if (res.status == "ok") {
          if (res.result && res.result.length && res.result.length > 0) {
              this._trnMainService.TrnMainObj.IMPORTDETAILS.prodList=res.result;
              this._trnMainService.TrnMainObj.IMPORTDETAILS.DOCUMENTNO=res.result[0].PPNO;
              this._trnMainService.TrnMainObj.IMPORTDETAILS.LCNUM=res.result[0].LCNO;
              this.RecalculateImportDetails();
          }
      }
  }, err => {
      this.alertService.error(err);
  })
    this.ImportPurchaseDetail.show();
  }

  RecalculateImportDetails(){
    try{
      if (this._trnMainService.TrnMainObj.IMPORTDETAILS && this._trnMainService.TrnMainObj.IMPORTDETAILS.prodList.length) {
        this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALQTY = 0
        this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALTAXABLE = 0;
        this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALNONTAXABLE = 0
        this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALVAT = 0;
        this._trnMainService.TrnMainObj.IMPORTDETAILS.NETAMOUNT = 0;
        this._trnMainService.TrnMainObj.IMPORTDETAILS.prodList.forEach(x => {
          x.NETAMOUNT = this._trnMainService.nullToZeroConverter(x.NONTAXABLE) + this._trnMainService.nullToZeroConverter(x.TAXABLE) + this._trnMainService.nullToZeroConverter(x.VAT);
          this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALQTY = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALQTY) + this._trnMainService.nullToZeroConverter(x.QUANTITY);
          this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALTAXABLE = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALTAXABLE) + this._trnMainService.nullToZeroConverter(x.TAXABLE);
          this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALNONTAXABLE = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALNONTAXABLE) + this._trnMainService.nullToZeroConverter(x.NONTAXABLE);
          this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALVAT = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.IMPORTDETAILS.TOTALVAT) + this._trnMainService.nullToZeroConverter(x.VAT);
          this._trnMainService.TrnMainObj.IMPORTDETAILS.NETAMOUNT = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.IMPORTDETAILS.NETAMOUNT) + this._trnMainService.nullToZeroConverter(x.NETAMOUNT);
        })
      }

    } catch(error){
      this.alertService.error('Error in import details calculation: '+ error);
    }

  }


}
