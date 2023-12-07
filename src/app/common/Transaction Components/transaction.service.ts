import { Injectable } from "@angular/core";
import { PREFIX } from "./../interfaces/Prefix.interface";
import { MasterRepo } from "./../repositories/masterRepo.service";
import {
  TrnProd,
  VoucherTypeEnum,
  TrnMain_AdditionalInfo,
  Transporter_Eway,
  Trntran,
  BillTrack,
  VoucherPosting
} from "./../interfaces/TrnMain";
import { TrnMain } from "./../interfaces/TrnMain";
import { IDivision } from "./../interfaces/commonInterface.interface";
import { AuthService } from "./../services/permission/index";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TAcList } from "../interfaces/Account.interface";
import Rx, { Subject } from "rxjs/Rx";
import * as _ from "lodash";
import { SettingService } from "../services/setting.service";
import { Product } from "../interfaces";
import { PriceRate } from "./../interfaces/PriceRate.interface";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { Filter } from "../interfaces/filter.interface";
import { Subscriber } from "rxjs/Subscriber";
import * as moment from 'moment'
import { PreventNavigationService } from "../services/navigation-perventor/navigation-perventor.service";
import { AdditionalCostService, Cost, prodCost } from "../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { importdocument } from "../interfaces/AddiitonalCost.interface";
import { ActivatedRoute } from "@angular/router";
import * as uuid from 'uuid';



@Injectable()
export class TransactionService {
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherPostingObj: VoucherPosting = <VoucherPosting>{}
  FilterObj: Filter = <Filter>{}
  Warehouse: string;
  pageHeading: string;
  division: IDivision = <IDivision>{};
  saveDisable: boolean;
  differenceAmount: number = 0;
  trntranTotal: number = 0;
  EntryDate: any = <any>{};
  Party_or_Expense_Ac: any;
  creditList: Trntran[] = [];
  filteredCreditList: any[] = [];
  totalCRAmount: number = 0;
  totalDRAmount: number = 0;
  crTotal: number = 0;
  drTotal: number = 0;
  salesMode: string;
  cnMode: string;
  customerEvent: boolean = false;
  schemeApplyClick: boolean = false;
  warrentyUpToDate: Date;
  warrentyVchrList: any[];
  buttonHeading: string = "Reference No";
  buttonClickMode: string;
  accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<
    TAcList[]
  >([]);
  accountListObersver$: Observable<
    TAcList[]
  > = this.accountListSubject.asObservable();
  TableAcHeader: string = "Description";
  prodListMode: ProdListMode;
  prodDisableSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  prodDisable$: Observable<boolean> = this.prodDisableSubject.asObservable();
  cnReturnedProdList: TrnProd[];
  referenceNoSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  referenceNo$: Observable<string> = this.referenceNoSubject.asObservable();
  public PrintStuffSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public PrintStuff$: Observable<any> = this.PrintStuffSubject.asObservable();

  public viewDate = new Subject<any>();
  masterSelectACID: string;

  saveChanges: boolean = true;
  inputCode: boolean;
  supplierwiseItem: any = 0;
  returnVoucherMain: any = <any>{};
  DefaultSellableWarehouse: string;
  partyList: any[] = [];
  userProfile: any = <any>{};
  public isSelfBill = false;
  DOFULLRETURN: number = 0;

  //extra settings for performa invoice
  showPerformaApproveReject: boolean = false; // initially false

  billTo: string;
  BarcodeFromScan: string;
  ItemsListForMultiItemBarcode: any[] = [];

  voucherNoHeader: string = "Bill No";
  storePreviousRoundOff: number = 0; //for capital voucher



  trnmainBehavior: BehaviorSubject<TrnMain> = new BehaviorSubject(<TrnMain>{});
  loadDataObservable: Observable<TrnMain> = this.trnmainBehavior.asObservable();
  PMode: string; //p for party mode and c for customer mode
  MaxTotalAmountLimit: number = 5000;
  DefaultCustomerAc: string = "";
  SettlementNo: any;
  INVMAIN: any;
  AppSettings: any;
  CashList: any[] = [];
  PurchaseAcList: any[] = [];
  paymentmodelist: any[] = [];
  paymentAccountList: any[] = [];
  settlementList: any[] = [];
  EnteredExpensesAcList: any[] = [];
  EnteredSupplierAcList: any[] = [];
  EnteredGSTList: any[] = [];
  costlists: any[] = [];
  GSTSETUPOBJ: any = <any>{};
  isDrCRFooterNormal = false;
  userSetting: any;
  replicateVoucher: boolean;
  isNotificationView: boolean;
  disableSupplierInfo: boolean;
  salesmanName: string;
  creditlimit: any;
  MAPID_Is: any;
  diffAmountIs: number = 0;
  checkCrAmount: boolean;
  enableSubledger: boolean = false;
  subledgerfocus: boolean = false;
  PhiscalObj: any = <any>{};
  prefix: PREFIX = <PREFIX>{};
  DrillMode:string;
  SelectedDivReport : string;
  disableSaveButton: boolean;
  showAddCosting:boolean;
  public changetrndate = new Subject<any>();
  isAutoDetailShow:boolean;
  budgetexceed_error_message="";
  dupacid_budget_error_message="";
  BUDGET_STATUS="";

  constructor(
    private masterService: MasterRepo,
    private setting: SettingService,
    private authservice: AuthService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    public preventNavigationService: PreventNavigationService,
    public _additionalCostService: AdditionalCostService,
    private arouter: ActivatedRoute
  ) {
    this.AppSettings = setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.userSetting = authservice.getSetting()
    this.PhiscalObj = authservice.getPhiscalInfo()
    // this.masterService.getProductItemList().subscribe();
    this.getCostCenterList();
  }
  
  loadData(VCHR, division, phiscalid) {
    this.getCostCenterList();
    //return new Observable((observer: Subscriber<TrnMain>) => {
    let mode = this.buttonClickMode;

    this.loadingService.show("Getting Details, Please Wait...");
    this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(
      data => {
        // console.log("CheckDTAA",data.result.ProdList)

        this.loadingService.hide();
        if (data.status == "ok") {
          // <!** CheckIfLatePost 
          if (data.result.POST == 1 && mode.toUpperCase()=='EDIT') {
            if (this.CheckMenuRights(this.arouter.snapshot.url[1].path, "L_edit") == false) {
              return;
            }
          }


          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher || this.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) {
            for (let i of data.result.TrntranList) {
              var guid = null;
              const uuidV1 = require('uuid/v1');
              guid = uuidV1();

              i.guid = guid;
            }
          }
          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.AccountOpeningBalance || this.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance 
            || this.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay || this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote
            || this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
            this.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote) {
            for (let i of data.result.TrntranList) {
              let a;
              a =  this.costlists.length>0 && this.costlists.filter(x => x.CCID == i.CostCenter);
              //console.log("a",a)
              if(a.length && a.length>0){
                i.CostCenter = a.length>0 && a[0].COSTCENTERNAME;
              }
            }
          }
          this.TrnMainObj.BillTrackedList=data.result.BillTrackedList;
          if(data.result.BillTrackedList && data.result.BillTrackedList.length && data.result.BillTrackedList.length>0){
            for (let i of data.result.TrntranList) {
              i.RowWiseBillTrackedList=data.result.BillTrackedList.filter(x=>x.ACID==i.A_ACID);
            }
          }

          this.getCostCenterNameForVIEWandEDIT();
          if (mode == null || mode == "") {
            mode = "VIEW";
          } else if (this.replicateVoucher == true) {
            mode = "NEW";
          }
          var Edit_EntryDate = data.result.TRNDATE;
          var Edit_TRNDATE = data.result.TRN_DATE;
          let vouchertype = this.TrnMainObj.VoucherType;
          let vchrno = this.TrnMainObj.VCHRNO;
          this.TrnMainObj = data.result;
          //console.log("@@this.TrnMainObj1e_INVOICETYPE",this.TrnMainObj.AdditionalObj.INVOICETYPE)

          if(vouchertype == VoucherTypeEnum.ReverseCreditNote || (vouchertype == VoucherTypeEnum.CreditNote && this.TrnMainObj.AdditionalObj && this.TrnMainObj.AdditionalObj.INVOICETYPE == 'REVERSE')){
            // this.TrnMainObj.VoucherType = 41;
            // this.TrnMainObj.VoucherPrefix = "RR";
            //console.log("@@this.TrnMainObj.AdditionalObj.CREFBILL",this.TrnMainObj.AdditionalObj.CREFBILL)
            if(this.TrnMainObj.AdditionalObj.CREFBILL==null || this.TrnMainObj.AdditionalObj.CREFBILL=="" ||this.TrnMainObj.AdditionalObj.CREFBILL===undefined  ){
              this.buttonClickMode=this.TrnMainObj.Mode="NEW";
              this.TrnMainObj.AdditionalObj.CREFBILL = data.result.VCHRNO;
              this.TrnMainObj.VCHRNO = vchrno;
            var guid = null;
            const uuidV1 = require('uuid/v1');
            guid = uuidV1();

            this.TrnMainObj.guid = guid;
            for (let i of data.result.TrntranList) {
              var guid = null;
              const uuidV1 = require('uuid/v1');
              guid = uuidV1();

              i.guid = guid;
            }
            }else{
              this.buttonClickMode=this.TrnMainObj.Mode="VIEW";
              this.TrnMainObj.VCHRNO = VCHR;
              for (let i of data.result.TrntranList) {
                i.DRAMNT = i.CRAMNT;
              }
            }
          }



          if (this.replicateVoucher == true && this.TrnMainObj.VoucherPrefix == 'JV') {
            this.TrnMainObj.Mode = 'NEW';
            var guid = null;
            const uuidV1 = require('uuid/v1');
            guid = uuidV1();
            this.TrnMainObj.guid=guid;
            this.TrnMainObj.POST=0;
            this.getVoucherNumber();
          } else {
            this.TrnMainObj.Mode = this.buttonClickMode;
          }
          if (this.TrnMainObj.CHALANNOPREFIX != null && this.TrnMainObj.CHALANNOPREFIX != "") {
            if (this.TrnMainObj.CHALANNO != null || this.TrnMainObj.CHALANNO != "") {
              let prefixFromChalan = this.TrnMainObj.CHALANNO.substring(0, 3);
              if (prefixFromChalan != null) {

                if (this.TrnMainObj.CHALANNOPREFIX.toUpperCase() == prefixFromChalan.toUpperCase()) {
                  this.TrnMainObj.CHALANNO = this.TrnMainObj.CHALANNO.substring(3);
                }
              }
            }
          }

          if (this.userSetting.PrefixForRefNoInvEntry == 0 && this.userSetting.SHOW_PURCHASE_MENU != 1) {
            this.TrnMainObj.CHALANNO = this.TrnMainObj.REFBILL;
          }




          this.viewDate.next();
          if (this.TrnMainObj.TransporterEway == null) {
            this.TrnMainObj.TransporterEway = <any>{};
          }
          if (this.TrnMainObj.AdditionalObj == null) {
            this.TrnMainObj.AdditionalObj = <any>{};
          }
          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
            this.TrnMainObj.Mode = "EDIT";
            this.TrnMainObj.ProdList.forEach(element => {
              element.inputMode = true;
            });
          }

          // for (let i in this.TrnMainObj.ProdList) {
          //   this.setAltunitDropDownForView(i);
          //   this.setunit(this.TrnMainObj.ProdList[i].RATE, this.TrnMainObj.ProdList[i].ALTRATE2, i, this.TrnMainObj.ProdList[i].ALTUNITObj);
          //   // this.CalculateNormalNew(i);

          //   this.TrnMainObj.ProdList[i].MFGDATE = ((this.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
          //   this.TrnMainObj.ProdList[i].EXPDATE = ((this.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
          // }

          if (this.TrnMainObj.VoucherType != 15 && this.TrnMainObj.VoucherType != 16) {
            this.ReCalculateBill();
          }

          this.Warehouse = this.TrnMainObj.MWAREHOUSE;
          if (
            !this.Warehouse &&
            this.TrnMainObj.ProdList &&
            this.TrnMainObj.ProdList.length > 0
          ) {
            this.Warehouse = this.TrnMainObj.ProdList[0].WAREHOUSE;
          }

          this.TrnMainObj.TRNDATE =
            this.TrnMainObj.TRNDATE == null
              ? ""
              : this.TrnMainObj.TRNDATE.toString().substring(0, 10);
          this.TrnMainObj.TRN_DATE =
            this.TrnMainObj.TRN_DATE == null
              ? ""
              : this.TrnMainObj.TRN_DATE.toString().substring(0, 10);
          this.TrnMainObj.CHEQUEDATE =
            this.TrnMainObj.CHEQUEDATE == null
              ? ""
              : this.TrnMainObj.CHEQUEDATE.toString().substring(0, 10);
          this.TrnMainObj.DeliveryDate =
            this.TrnMainObj.DeliveryDate == null
              ? ""
              : this.TrnMainObj.DeliveryDate.toString().substring(0, 10);

          this.TrnMainObj.TrntranList.forEach(trntran => {
            if (trntran.A_ACID) {
              trntran.acitem = trntran.AccountItem;
              trntran.ROWMODE = mode.toLowerCase();
            } else {
              trntran.acitem = <any>{};
              trntran.ROWMODE = mode.toLowerCase();
            }
          });

          let acid = this.TrnMainObj.TRNAC;

          // this.masterService.accountList$.subscribe(aclist => {
          //   if (aclist) {
          //     let ac = aclist.find(x => x.ACID == acid);
          //     if (ac && ac != null && ac != undefined)
          //       this.TrnMainObj.TRNACName = ac.ACNAME;
          //   }
          //   this.trnmainBehavior.next(this.TrnMainObj);
          // });
          this.calculateCrDrTotal();
          this.calculateDrCrDifferences();
          ////console.log("voucherType", this.TrnMainObj.VoucherType);
          if (this.TrnMainObj.VoucherType != 15 &&
            this.TrnMainObj.VoucherType != 16 &&
            this.TrnMainObj.VATBILL == 0
          ) {
            this.TrnMainObj.TOTAMNT = this.TrnMainObj.NETAMNT;
          }

          //load part of gst entries
          if (this.TrnMainObj.JournalGstList != null && this.TrnMainObj.JournalGstList.length > 0) {
            this.TrnMainObj.gstInfoOfAccount = <any>{};
            this.TrnMainObj.gstInfoOfAccount.GSTLIST = [];

            this.EnteredExpensesAcList = [];

            this.TrnMainObj.TrntranList.forEach(
              t => {
                if (t.AccountItem != null) {
                  if (t.AccountItem.ACID != null) {
                    if (t.AccountItem.ACID.substr(0, 2) != "PA" && t.AccountItem.ACID != this.AppSettings.VATAc) {
                      this.EnteredExpensesAcList.push(t.AccountItem);
                    }
                  }
                }
              }
            );
            for (var i of this.TrnMainObj.JournalGstList) {
              this.TrnMainObj.gstInfoOfAccount.TRNTYPE = i.TRNTYPE;
              this.TrnMainObj.gstInfoOfAccount.NETAMNT = i.NETAMNT;
              this.TrnMainObj.gstInfoOfAccount.PARAC = i.PARAC;
              let gObj = <any>{};
              gObj.GST = i.GST;
              gObj.GSTRATE = i.GSTRATE;
              gObj.REFTRNAC = i.REFTRNAC;
              if (this.nullToZeroConverter(i.GSTRATE) == 0 || this.nullToZeroConverter(i.GST) == 0) {
                gObj.AMOUNT = i.NONTAXABLE;

              }
              else {
                gObj.AMOUNT = i.TAXABLE;
              }

              gObj.ITC_ELIGIBILITY = i.ITC_ELIGIBILITY;
              gObj.GSTMODE = i.GSTMODE;
              gObj.REFTRNAC_NAME = this.EnteredExpensesAcList.filter(x => x.ACID == i.REFTRNAC)[0].ACNAME;
              this.TrnMainObj.gstInfoOfAccount.GSTLIST.push(gObj);
            }
          }
          if (this.TrnMainObj.Mode && this.TrnMainObj.Mode.toUpperCase() == "EDIT") {
            this.TrnMainObj.TRNDATE = Edit_EntryDate;
            this.TrnMainObj.TRN_DATE = Edit_TRNDATE;
          }

          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote) {
            //console.log("salesreturn", this.userSetting,this.userSetting.Vat_Sales)
            let abc = this.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.userSetting.Vat_Sales);
            //console.log("abc", abc)
            if (abc >= 0) {
              this.TrnMainObj.TrntranList.splice(abc, 1)
            }
          }

          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            //console.log("Vat_Purchase", this.userSetting.Vat_Purchase)
            let abc = this.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.userSetting.Vat_Purchase);
            //console.log("abc", abc)
            if (abc >= 0) {
              this.TrnMainObj.TrntranList.splice(abc, 1)
            }
          }

          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
            //console.log("Vat_Purchase", this.userSetting.Vat_Purchase)
            let abc = this.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.userSetting.Vat_Purchase);
            //console.log("abc", abc)
            if (abc >= 0) {
              this.TrnMainObj.TrntranList.splice(abc, 1)
            }
          }

          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay) {
            //console.log("TRNAC", this.TrnMainObj.TRNAC)
            let abc = this.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.TrnMainObj.TRNAC);
            //console.log("abc", abc)
            if (abc >= 0) {
              this.TrnMainObj.TrntranList.splice(abc, 1)
            }
            let abc2 = this.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.TrnMainObj.TRNAC);
            //console.log("abc2", abc2)
            if (abc >= 0) {
              this.TrnMainObj.TrntranList.splice(abc2, 1)
            }
            if (this.TrnMainObj.Mode.toUpperCase() == "EDIT") {
              let xyz = this.TrnMainObj.TrntranList.findIndex(x => x.acitem.ACNAME == 'CellPay Fee');
                this.TrnMainObj.TrntranList[xyz].disableCellPayRow = true;
            }
          }

        }
        var ac = <TAcList>{};
        ac.ACNAME = this.TrnMainObj.TRNACName;
        ac.ACID = this.TrnMainObj.TRNAC;
        this.Party_or_Expense_Ac = ac;

        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance) {
          if(data.result.PartyDetails!=null && data.result.PartyDetails && data.result.PartyDetails.length){
            for (let i of data.result.TrntranList) {
              i.PartyDetails = data.result.PartyDetails.filter(x=>x.ACID==i.A_ACID);
              i.DRAMNT = Number(i.DRAMNT.toFixed(2)); // to show 2digit after decimal in view
              i.CRAMNT = Number(i.CRAMNT.toFixed(2));
            }          
          }
        }

        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.AccountOpeningBalance) {
            for (let i of data.result.TrntranList) {
              i.DRAMNT = Number(i.DRAMNT.toFixed(2)); // to show 2digit after decimal in view
              i.CRAMNT = Number(i.CRAMNT.toFixed(2));
            }          
        }

        this.showAddCosting = false;
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase && this.userSetting.SHOW_PURCHASE_MENU == 1) {
          this.inputCode = true;
          if(data.result.ImporterPriceCalcList!=null && data.result.ImporterPriceCalcList && data.result.ImporterPriceCalcList.length){
            for (let i of data.result.ProdList) {
              let costingdata= data.result.ImporterPriceCalcList.filter(x=>(x.MCODE==i.MCODE && x.BATCH==i.BATCH));
              i.ImporterPriceCalcList = data.result.ImporterPriceCalcList.filter(x=>(x.MCODE==i.MCODE && x.BATCH==i.BATCH))[0];
              for (let j of costingdata) {
                if(j.MCODE==i.MCODE && j.BATCH==i.BATCH){
                  i.IsCostingSaved=true;
                  i.backgroundcolor="lightgreen";
                  this.showAddCosting = true;
                }
              }

            }          
          }
        }
      },
      error => {
        this.loadingService.hide();
        this.trnmainBehavior.complete();
      },
      () => {
        this.loadingService.hide();
        this.trnmainBehavior.complete();
      }
    );
  }

  getCostCenterList() {
    this.costlists = [];
    this.masterService.getAllNEWCostCenter().subscribe(res => {
      if (res) {

        this.costlists = res.result;

        // _transactionService.TrnMainObj.COSTCENTER ='';
      }
    }, error => {
      this.costlists = [];
    });
  }
 
  getCostCenterNameForVIEWandEDIT() {
    // // //console.log("costList", this.costlists)
    // // this.costlists = this.costlists.filter(x => x.CCID = this.TrnMainObj.COSTCENTER);
    // ////console.log("costlist", this.costlists);


  }



  CapitalBudgetData(VCHR, division, phiscalid) {
    this.getCostCenterList();
    //return new Observable((observer: Subscriber<TrnMain>) => {
    let mode = this.buttonClickMode;

    this.loadingService.show("Getting Details, Please Wait...");
    this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(
      data => {

        this.loadingService.hide();
        if (data.status == "ok") {
          this.getCostCenterNameForVIEWandEDIT();
          if (mode == null || mode == "") {
            mode = "VIEW";
          }
          this.TrnMainObj = data.result;
          this.TrnMainObj.Mode = this.buttonClickMode;
          this.TrnMainObj.VoucherType = VoucherTypeEnum.CapitalVoucher;
          if (this.TrnMainObj.CHALANNOPREFIX != null && this.TrnMainObj.CHALANNOPREFIX != "") {
            if (this.TrnMainObj.CHALANNO != null || this.TrnMainObj.CHALANNO != "") {
              let prefixFromChalan = this.TrnMainObj.CHALANNO.substring(0, 3);
              if (prefixFromChalan != null) {

                if (this.TrnMainObj.CHALANNOPREFIX.toUpperCase() == prefixFromChalan.toUpperCase()) {
                  this.TrnMainObj.CHALANNO = this.TrnMainObj.CHALANNO.substring(3);
                }
              }
            }
          }
          this.creditList = this.TrnMainObj.AdditionTranList;

          this.totalCRAmount = 0;
          this.creditList.forEach(x => this.totalCRAmount += x.CRAMNT);
          this.totalCRAmount += this.nullToReturnZero(this.TrnMainObj.DCAMNT);

          this.totalDRAmount = 0;
          // this.TrnMainObj.TrntranList.forEach(x => this.totalDRAmount += x.DRAMNT);
          if (this.TrnMainObj.ROUNDOFF > 0) {
            this.totalCRAmount = this.totalCRAmount - (Math.abs(this.TrnMainObj.ROUNDOFF));
          } else {
            this.totalCRAmount = this.totalCRAmount + (Math.abs(this.TrnMainObj.ROUNDOFF));
          }
          this.totalDRAmount = this.nullToReturnZero(this.TrnMainObj.TOTAMNT) + this.nullToReturnZero(this.TrnMainObj.VATAMNT);


          this.viewDate.next();
          if (this.TrnMainObj.TransporterEway == null) {
            this.TrnMainObj.TransporterEway = <any>{};
          }
          if (this.TrnMainObj.AdditionalObj == null) {
            this.TrnMainObj.AdditionalObj = <any>{};
          }

          //  this.ReCalculateBill();


          this.TrnMainObj.TRNDATE =
            this.TrnMainObj.TRNDATE == null
              ? ""
              : this.TrnMainObj.TRNDATE.toString().substring(0, 10);
          this.TrnMainObj.TRN_DATE =
            this.TrnMainObj.TRN_DATE == null
              ? ""
              : this.TrnMainObj.TRN_DATE.toString().substring(0, 10);
          this.TrnMainObj.CHEQUEDATE =
            this.TrnMainObj.CHEQUEDATE == null
              ? ""
              : this.TrnMainObj.CHEQUEDATE.toString().substring(0, 10);
          this.TrnMainObj.DeliveryDate =
            this.TrnMainObj.DeliveryDate == null
              ? ""
              : this.TrnMainObj.DeliveryDate.toString().substring(0, 10);

          this.TrnMainObj.TrntranList.forEach(trntran => {
            if (trntran.A_ACID) {
              trntran.acitem = trntran.AccountItem;
              trntran.ROWMODE = mode.toLowerCase();
            } else {
              trntran.acitem = <any>{};
              trntran.ROWMODE = mode.toLowerCase();
            }
          });

          this.calculateCrDrTotal();
          this.calculateDrCrDifferences();

          if (this.TrnMainObj.JournalGstList != null && this.TrnMainObj.JournalGstList.length > 0) {
            this.TrnMainObj.gstInfoOfAccount = <any>{};
            this.TrnMainObj.gstInfoOfAccount.GSTLIST = [];

            this.EnteredExpensesAcList = [];

            this.TrnMainObj.TrntranList.forEach(
              t => {
                if (t.AccountItem != null) {
                  if (t.AccountItem.ACID != null) {
                    if (t.AccountItem.ACID.substr(0, 2) != "PA" && t.AccountItem.ACID != this.AppSettings.VATAc) {
                      this.EnteredExpensesAcList.push(t.AccountItem);
                    }
                  }
                }
              }
            );

          }

            for (let i of data.result.TrntranList) {
              let a;
              a =  this.costlists.length>0 && this.costlists.filter(x => x.CCID == i.CostCenter);
              //console.log("a",a)
              if(a.length && a.length>0){
                i.CostCenter = a.length>0 && a[0].COSTCENTERNAME;
              }
            }

          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
            //console.log("Vat_Purchase", this.userSetting.Vat_Purchase)
            let abc = this.TrnMainObj.TrntranList.findIndex(x => x.A_ACID == this.userSetting.Vat_Purchase);
            //console.log("abc", abc)
            if (abc >= 0) {
              this.TrnMainObj.TrntranList.splice(abc, 1)
            }
          }
        }
        var ac = <TAcList>{};
        ac.ACNAME = this.TrnMainObj.TRNACName;
        ac.ACID = this.TrnMainObj.TRNAC;
        this.Party_or_Expense_Ac = ac;
        ////console.log("CheckCapitalLoadData", this.creditList)
      },
      error => {
        this.loadingService.hide();
        this.trnmainBehavior.complete();
      },
      () => {
        this.loadingService.hide();
        this.trnmainBehavior.complete();
      }
    );
  }




  loadStockSettlement(VCHR) {
    //return new Observable((observer: Subscriber<TrnMain>) => {
    this.masterService.LoadStockSettlement(VCHR).subscribe(
      data => {
        if (data.status == "ok") {
          this.TrnMainObj = data.result;

          this.TrnMainObj.Mode = "VIEW";

          //           for(let i in this.TrnMainObj.ProdList){
          //             this.setAltunitDropDownForView(i);
          //             this.getPricingOfItem(i,"",false);
          // this.TrnMainObj.ProdList[i].inputMode=false;
          //           }
          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
            this.TrnMainObj.Mode = "EDIT";
            this.TrnMainObj.ProdList.forEach(element => {
              element.inputMode = true;
            });
          }

          for (let i in this.TrnMainObj.ProdList) {
            this.setAltunitDropDownForView(i);
            this.setunit(this.TrnMainObj.ProdList[i].RATE, this.TrnMainObj.ProdList[i].ALTRATE2, i, this.TrnMainObj.ProdList[i].ALTUNITObj);

            this.CalculateNormalNew(i);
            this.TrnMainObj.ProdList[i].MFGDATE =
              this.TrnMainObj.ProdList[i].MFGDATE == null
                ? ""
                : this.TrnMainObj.ProdList[i].MFGDATE.toString().substring(
                  0,
                  10
                );
            this.TrnMainObj.ProdList[i].EXPDATE =
              this.TrnMainObj.ProdList[i].EXPDATE == null
                ? ""
                : this.TrnMainObj.ProdList[i].EXPDATE.toString().substring(
                  0,
                  10
                );
            // this.getPricingOfItem(i)
            // this.TrnMainObj.ProdList[i].ALTUNITObj = this.TrnMainObj..filter(x => x..ALTUNIT)
          }

          this.ReCalculateBill();
          this.getCurrentDate();
          this.Warehouse = this.TrnMainObj.MWAREHOUSE;
          if (
            !this.Warehouse &&
            this.TrnMainObj.ProdList &&
            this.TrnMainObj.ProdList.length > 0
          ) {
            this.Warehouse = this.TrnMainObj.ProdList[0].WAREHOUSE;
          }



          this.trnmainBehavior.next(this.TrnMainObj);
        }
      },
      error => {
        this.trnmainBehavior.complete();
      },
      () => this.trnmainBehavior.complete()
    );
    //});
  }

  getItemType() {
    return [
      { label: "FOC", value: "FOC" },
      { label: "FAULTY", value: "FALUTY" }
    ];
  }

  getReceivedType() {
    return [
      { label: "DAMAGED", value: "DAMAGED" },
      { label: "MISSING", value: "MISSING" }
    ];
  }
  ReCalculateBill() {
    //calculating flat discount. If GblReplaceIndividualWithFlat=1 or 0
    var i: number = 0;
    //var amt: number = 0;
    this.TrnMainObj.TOTAMNT = 0;
    this.TrnMainObj.TOTALINDDISCOUNT = 0;
    this.TrnMainObj.TOTALPROMOTION = 0;
    this.TrnMainObj.TOTALLOYALTY = 0;
    this.TrnMainObj.DCAMNT = 0;
    this.TrnMainObj.ServiceCharge = 0;
    this.TrnMainObj.TAXABLE = 0;
    this.TrnMainObj.NONTAXABLE = 0;
    this.TrnMainObj.VATAMNT = 0;
    this.TrnMainObj.NETWITHOUTROUNDOFF = 0;
    this.TrnMainObj.TotalWithIndDiscount = 0;
    this.TrnMainObj.TOTALDISCOUNT = 0;
    this.TrnMainObj.TOTALQTY = 0;
    this.TrnMainObj.TOTALWEIGHT = 0;
    this.TrnMainObj.TOTALDISCOUNT_VATINCLUDED = 0;
    this.TrnMainObj.ProdList.forEach(prod => {
      if (prod.EXPDATE != null) {
        prod.EXPDATE = prod.EXPDATE.toString().substring(0, 10);
      }
      if (prod.MFGDATE != null) {
        prod.MFGDATE = prod.MFGDATE.toString().substring(0, 10);
      }


      i++;
      prod.SNO = i;
      let totalAmt = 0;
      this.TrnMainObj.ProdList.forEach(x => {
        totalAmt +=
          x.AMOUNT -
          this.nullToZeroConverter(x.INDDISCOUNT) -
          this.nullToZeroConverter(x.PROMOTION) -
          this.nullToZeroConverter(x.LOYALTY) -
          this.nullToZeroConverter(x.PrimaryDiscount) -
          this.nullToZeroConverter(x.SecondaryDiscount) -
          this.nullToZeroConverter(x.LiquiditionDiscount);
      });
      // amt +=
      //   prod.AMOUNT -
      //   this.nullToZeroConverter(prod.INDDISCOUNT) -
      //   this.nullToZeroConverter(prod.PROMOTION) -
      //   this.nullToZeroConverter(prod.LOYALTY) -
      //   this.nullToZeroConverter(prod.PrimaryDiscount) -
      //   this.nullToZeroConverter(prod.SecondaryDiscount) -
      //   this.nullToZeroConverter(prod.LiquiditionDiscount)
      //   ;
      i++;
      prod.SNO = i;
      if (this.TrnMainObj.ReplaceIndividualWithFlatDiscount == 1) {
        if (this.TrnMainObj.TOTALFLATDISCOUNT != 0) {
          prod.INDDISCOUNT = 0;
        }
      }
      if (totalAmt == 0) {
        prod.FLATDISCOUNT = 0;
      } else {
        prod.FLATDISCOUNT =
          (prod.AMOUNT -
            this.nullToZeroConverter(prod.INDDISCOUNT) -
            this.nullToZeroConverter(prod.PROMOTION) -
            this.nullToZeroConverter(prod.LOYALTY) -
            this.nullToZeroConverter(prod.PrimaryDiscount) -
            this.nullToZeroConverter(prod.SecondaryDiscount) -
            this.nullToZeroConverter(prod.LiquiditionDiscount)) *
          (this.nullToZeroConverter(this.TrnMainObj.TOTALFLATDISCOUNT) /
            totalAmt);
      }

      prod.DISCOUNT =
        this.nullToZeroConverter(prod.INDDISCOUNT) +
        this.nullToZeroConverter(prod.FLATDISCOUNT) +
        this.nullToZeroConverter(prod.PROMOTION) +
        this.nullToZeroConverter(prod.LOYALTY) +
        this.nullToZeroConverter(prod.PrimaryDiscount) +
        this.nullToZeroConverter(prod.SecondaryDiscount) +
        this.nullToZeroConverter(prod.LiquiditionDiscount);
      if (prod.ISSERVICECHARGE == 1) {
        prod.SERVICETAX =
          (prod.AMOUNT - prod.DISCOUNT) *
          this.setting.appSetting.ServiceTaxRate;
      }
      if (prod.ISVAT == 1) {
        prod.TAXABLE =
          prod.AMOUNT -
          prod.DISCOUNT +
          this.nullToZeroConverter(prod.SERVICETAX);
        prod.VAT = (prod.TAXABLE * prod.GSTRATE) / 100;
        prod.VAT_ONLYFORSHOWING =
          prod.TAXABLE - prod.TAXABLE / (1 + prod.GSTRATE_ONLYFORSHOWING / 100);
        prod.NONTAXABLE = 0;
        prod.NCRATE = prod.RATE * prod.EXRATE;
        // if (prod.REALQTY_IN == 0)
        // { prod.NCRATE = prod.PRATE; }
        // else
        // { prod.NCRATE = prod.TAXABLE / this.nullToZeroConverter(prod.REALQTY_IN); }
      } else {
        prod.TAXABLE = 0;
        prod.VAT = 0;
        prod.NONTAXABLE =
          prod.AMOUNT -
          prod.DISCOUNT +
          this.nullToZeroConverter(prod.SERVICETAX);
        prod.NCRATE = prod.RATE * prod.EXRATE;
        // if (prod.REALQTY_IN == 0)
        // { prod.NCRATE = prod.PRATE; }
        // else
        // { prod.NCRATE = prod.NONTAXABLE / this.nullToZeroConverter(prod.REALQTY_IN); }
      }
      prod.NETAMOUNT =
        this.nullToZeroConverter(prod.TAXABLE) +
        this.nullToZeroConverter(prod.NONTAXABLE) +
        this.nullToZeroConverter(prod.SERVICETAX) +
        this.nullToZeroConverter(prod.VAT);

      this.TrnMainObj.TOTAMNT += prod.AMOUNT;
      this.TrnMainObj.TOTALINDDISCOUNT += this.nullToZeroConverter(
        prod.INDDISCOUNT
      );
      this.TrnMainObj.TOTALLOYALTY += this.nullToZeroConverter(prod.LOYALTY);
      this.TrnMainObj.TOTALPROMOTION += this.nullToZeroConverter(
        prod.PROMOTION
      );
      this.TrnMainObj.DCAMNT += this.nullToZeroConverter(prod.DISCOUNT);
      this.TrnMainObj.ServiceCharge += this.nullToZeroConverter(
        prod.SERVICETAX
      );
      this.TrnMainObj.TAXABLE += this.nullToZeroConverter(prod.TAXABLE);
      this.TrnMainObj.NONTAXABLE += this.nullToZeroConverter(prod.NONTAXABLE);
      this.TrnMainObj.VATAMNT += this.nullToZeroConverter(prod.VAT);
      this.TrnMainObj.NETWITHOUTROUNDOFF += this.nullToZeroConverter(
        prod.NETAMOUNT
      );
      this.TrnMainObj.TotalWithIndDiscount += this.nullToZeroConverter(
        prod.TOTAL
      );
      this.TrnMainObj.TOTALDISCOUNT += this.nullToZeroConverter(prod.DISCOUNT);
      this.TrnMainObj.TOTALQTY += this.nullToZeroConverter(
        prod.Quantity *
        (this.nullToZeroConverter(prod.CONFACTOR) <= 0
          ? 1
          : this.nullToZeroConverter(prod.CONFACTOR))
      );
      this.TrnMainObj.TOTALWEIGHT += this.nullToZeroConverter(prod.WEIGHT);
      this.TrnMainObj.TOTALDISCOUNT_VATINCLUDED +=
        this.nullToZeroConverter(prod.INDIVIDUALDISCOUNT_WITHVAT) +
        this.nullToZeroConverter(prod.FLATDISCOUNT);


      this.TrnMainObj.NETAMNT = Math.round(
        this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF)
      );
      this.TrnMainObj.ROUNDOFF =
        this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
    })
  }
  nullToZeroConverter(value) {

    if (
      value == undefined ||
      value == null ||
      value === null ||
      value == "" ||
      value == "Infinity" ||
      value == "NaN" ||
      isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);
  }

  nullToReturnZero(value) {
    if (
      value === undefined ||
      value === null ||
      value === null ||
      value === "" ||
      value === "Infinity" ||
      value === "NaN" ||
      isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);

  }




  CalculateNormalNew(i) {
    let POBJ = this.TrnMainObj.ProdList[i];

    try {
      if (
        this.TrnMainObj.ProdList[i].Quantity == null ||
        this.TrnMainObj.ProdList[i].RATE == null
      )
        return;

      this.TrnMainObj.ProdList[i].AMOUNT =
        this.TrnMainObj.ProdList[i].Quantity *
        this.TrnMainObj.ProdList[i].ALTRATE;
      this.TrnMainObj.ProdList[i].WEIGHT =
        this.TrnMainObj.ProdList[i].CONFACTOR *
        this.TrnMainObj.ProdList[i].Quantity *
        this.nullToZeroConverter(
          this.TrnMainObj.ProdList[i].SELECTEDITEM.GWEIGHT

        );
      if (POBJ.BATCHSCHEME != null) {
        if (POBJ.BATCHSCHEME.discountRateType == 0) {
          this.TrnMainObj.ProdList[i].PROMOTION =
            (POBJ.BATCHSCHEME.schemeDisRate *
              this.TrnMainObj.ProdList[i].AMOUNT) /
            100;
        } else if (POBJ.BATCHSCHEME.discountRateType == 1) {
          this.TrnMainObj.ProdList[i].PROMOTION =
            this.TrnMainObj.ProdList[i].Quantity *
            POBJ.BATCHSCHEME.schemeDisRate;
        } else if (POBJ.BATCHSCHEME.discountRateType == 2) {
          var factor =
            this.TrnMainObj.ProdList[i].Quantity /
            (POBJ.BATCHSCHEME.minQty + POBJ.BATCHSCHEME.schemeDisRate);
          this.TrnMainObj.ProdList[i].PROMOTION =
            Math.floor(factor) *
            this.TrnMainObj.ProdList[i].RATE *
            POBJ.BATCHSCHEME.schemeDisRate;
        }
      }
      if (
        this.TrnMainObj.ProdList[i].INDDISCOUNTRATE != null &&
        this.TrnMainObj.ProdList[i].INDDISCOUNTRATE > 0
      ) {
        this.TrnMainObj.ProdList[i].INDDISCOUNT = (this.TrnMainObj.ProdList[i].AMOUNT *
          this.TrnMainObj.ProdList[i].INDDISCOUNTRATE) / 100;
        if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          this.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT =
            Math.round(
              ((this.TrnMainObj.ProdList[i].Quantity *
                this.TrnMainObj.ProdList[i].CONFACTOR *
                this.TrnMainObj.ProdList[i].MRP *
                this.TrnMainObj.ProdList[i].INDDISCOUNTRATE) /
                100) *
              100
            ) / 100;
        }
      } else {
        if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          if (this.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT > 0) {
            this.TrnMainObj.ProdList[i].INDDISCOUNT =
              this.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT /
              (1 + this.TrnMainObj.ProdList[i].GSTRATE / 100);
          }
        }
      }

      //primary,secondary,liquidition discount calculate
      this.TrnMainObj.ProdList[i].PrimaryDiscount =
        this.TrnMainObj.ProdList[i].BasePrimaryDiscount *
        this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].SecondaryDiscount =
        this.TrnMainObj.ProdList[i].BaseSecondaryDiscount *
        this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].LiquiditionDiscount =
        this.TrnMainObj.ProdList[i].BaseLiquiditionDiscount *
        this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].DISCOUNT =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDDISCOUNT) +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].PROMOTION) +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].LOYALTY) +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].PrimaryDiscount) +
        this.nullToZeroConverter(
          this.TrnMainObj.ProdList[i].SecondaryDiscount
        ) +
        this.nullToZeroConverter(
          this.TrnMainObj.ProdList[i].LiquiditionDiscount
        );

      if (this.TrnMainObj.ProdList[i].ISVAT == 1) {

        this.TrnMainObj.ProdList[i].TAXABLE =
          this.TrnMainObj.ProdList[i].AMOUNT -
          this.TrnMainObj.ProdList[i].DISCOUNT;
        this.TrnMainObj.ProdList[i].NONTAXABLE = 0;
        this.TrnMainObj.ProdList[i].VAT =
          (this.TrnMainObj.ProdList[i].TAXABLE *
            this.TrnMainObj.ProdList[i].GSTRATE) /
          100;

        this.TrnMainObj.ProdList[i].VAT_ONLYFORSHOWING =
          this.TrnMainObj.ProdList[i].TAXABLE -
          this.TrnMainObj.ProdList[i].TAXABLE /
          (1 + this.TrnMainObj.ProdList[i].GSTRATE_ONLYFORSHOWING / 100);
      } else {
        this.TrnMainObj.ProdList[i].TAXABLE = 0;
        this.TrnMainObj.ProdList[i].NONTAXABLE =
          this.TrnMainObj.ProdList[i].AMOUNT -
          this.TrnMainObj.ProdList[i].DISCOUNT;
      }

      this.TrnMainObj.ProdList[i].NETAMOUNT =
        this.TrnMainObj.ProdList[i].TAXABLE +
        this.TrnMainObj.ProdList[i].NONTAXABLE +
        this.TrnMainObj.ProdList[i].VAT;

    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  CalculateNormal(
    TrnProdObj: TrnProd,
    ServiceTaxRate = this.setting.appSetting.ServiceTaxRate,
    VatRate = this.setting.appSetting.VATRate,
    calcuteDiscount = 0
  ) {
    TrnProdObj.AMOUNT = TrnProdObj.Quantity * TrnProdObj.RATE;
    if (this.setting.appSetting.ENABLEMULTICURRENCY == 1) {
      TrnProdObj.NCRATE = this.curencyConvert(TrnProdObj.RATE);
      TrnProdObj.EXRATE = this.TrnMainObj.EXRATE;
      TrnProdObj.AMOUNT = TrnProdObj.Quantity * TrnProdObj.NCRATE;
    }
    if (calcuteDiscount == 1) {
      if (TrnProdObj.IDIS != null) {
        if (TrnProdObj.IDIS.indexOf("%") < 0) {
          TrnProdObj.INDDISCOUNT = parseFloat(TrnProdObj.IDIS);
        } else {
          var dis = parseFloat(TrnProdObj.IDIS.replace("%", "").trim());
          dis = dis / 100;
          TrnProdObj.INDDISCOUNT = TrnProdObj.AMOUNT * dis;
        }
      }
    }
    TrnProdObj.DISCOUNT =
      this.nullToZeroConverter(TrnProdObj.INDDISCOUNT) +
      this.nullToZeroConverter(TrnProdObj.PROMOTION) +
      this.nullToZeroConverter(TrnProdObj.LOYALTY);
    if (this.nullToZeroConverter(TrnProdObj.ISSERVICECHARGE) == 1) {
      TrnProdObj.SERVICETAX =
        (TrnProdObj.AMOUNT - TrnProdObj.DISCOUNT) * ServiceTaxRate;
    }
    if (TrnProdObj.ISVAT == 1) {
      TrnProdObj.TAXABLE =
        TrnProdObj.AMOUNT -
        TrnProdObj.DISCOUNT +
        this.nullToZeroConverter(TrnProdObj.SERVICETAX);
      TrnProdObj.NONTAXABLE = 0;
      TrnProdObj.VAT = TrnProdObj.TAXABLE * VatRate;
    } else {
      TrnProdObj.TAXABLE = 0;
      TrnProdObj.NONTAXABLE =
        TrnProdObj.AMOUNT -
        TrnProdObj.DISCOUNT +
        this.nullToZeroConverter(TrnProdObj.SERVICETAX);
    }
    TrnProdObj.NETAMOUNT =
      TrnProdObj.TAXABLE + TrnProdObj.NONTAXABLE + TrnProdObj.VAT;
    return TrnProdObj;
  }
  FlatDiscountPercentChange() {
    this.flatDiscountAssign("percent");
  }
  FlatDiscountAmountChange() {
    this.flatDiscountAssign("amount");
  }
  flatDiscountAssign(changeType) {
    if (
      changeType == "percent" &&
      (this.TrnMainObj.DCRATE < 0 || this.TrnMainObj.DCRATE > 100)
    ) {
      this.TrnMainObj.DCRATE = 0;
      alert("Invalid Flat Discount Percent");
      return;
    }
    if (changeType == "amount") {
      this.TrnMainObj.DCRATE = 0;
    } else {
      let totalAmountWithIndDiscount = this.TrnMainObj.ProdList.reduce(
        (sum, x) =>
          sum +
          (this.nullToZeroConverter(x.AMOUNT) -
            this.nullToZeroConverter(x.INDDISCOUNT)),
        0
      );
      this.TrnMainObj.TOTALFLATDISCOUNT =
        (this.TrnMainObj.DCRATE * totalAmountWithIndDiscount) / 100;
    }
    this.ReCalculateBill();
  }

  curencyConvert(rate) {
    var C = this.masterService.Currencies.find(
      x => x.CURNAME == this.TrnMainObj.FCurrency
    );
    if (C != null) {
      return C.EXRATE * rate;
    } else return rate;
  }

  ischeckReturnQuantityError(prod: TrnProd): boolean {
    try {
      var pr = this.cnReturnedProdList.find(itm => itm.MCODE == prod.MCODE);
      if (!pr) {
        //there is no such product in return list
        return true;
      }
      let prodarray: TrnProd[] = [];
      this.cnReturnedProdList.forEach(prd => {
        var p: TrnProd;

        if (prodarray.length > 0) {
          p = prodarray.find(res => res.MCODE == prd.MCODE);
        }
        if (p) {
          p.Quantity += prd.Quantity;
          p.REALQTY_IN += prd.REALQTY_IN;
          if (prd.RATE > p.RATE) {
            p.RATE = prd.RATE;
          }
        } else {
          prodarray.push(prd);
        }
      });
      var tProd = prodarray.find(prd => prd.MCODE == prod.MCODE);
      if (tProd) {
        if (prod.Quantity > tProd.Quantity) {
          return true;
        }
        if (prod.RATE > tProd.RATE) {
          return true;
        }
      }

      return false;
    } catch (ex) {
    }
  }

  resetData() {
    this.TrnMainObj.TRNAC = null;
    this.TrnMainObj.PARAC = null;
    this.TrnMainObj.BILLTO = "";
    this.TrnMainObj.BILLTOADD = "";
    this.TrnMainObj.BILLTOMOB = "";
    this.TrnMainObj.BILLTOTEL = "";
    //  this.TrnMainObj.ProdList = [];
  }
  a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen "
  ];
  b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  ];

  decimalToWord(frac) {
    if (parseInt(frac[1]) != 0) {
      return (
        (this.a[Number(frac[1])] ||
          this.b[frac[1][0]] + " " + this.a[frac[1][1]]) + "Paisa Only "
      );
    } else {
      return "";
    }
  }

  digitToWord(num) {
    if (num != null && num != "" && num != undefined) {
      var nums = num.toString().split(".");
      var whole = nums[0];
      let w = ("000000000" + whole)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if ((whole = whole.toString()).length > 9) return "Overflow";
      if (nums.length == 2) {
        var wholeFraction = nums[1];
        var fraction = wholeFraction.substring(0, 2);
        if (
          fraction == "1" ||
          fraction == "2" ||
          fraction == "3" ||
          fraction == "4" ||
          fraction == "5" ||
          fraction == "6" ||
          fraction == "7" ||
          fraction == "8" ||
          fraction == "9"
        ) {
          fraction = fraction + "0";
        } else if (
          fraction == "01" ||
          fraction == "02" ||
          fraction == "03" ||
          fraction == "04" ||
          fraction == "05" ||
          fraction == "06" ||
          fraction == "07" ||
          fraction == "08" ||
          fraction == "09"
        ) {
          fraction = "09";
          fraction = fraction.substring(1, 2);
        }
        let f = ("00" + fraction).substr(-2).match(/^(\d{2})$/);

        if (!w || !f) return;
        var str = "";
        str +=
          parseInt(w[1]) != 0
            ? (this.a[Number(w[1])] ||
              this.b[w[1][0]] + " " + this.a[w[1][1]]) + "Crore "
            : "";
        str +=
          parseInt(w[2]) != 0
            ? (this.a[Number(w[2])] ||
              this.b[w[2][0]] + " " + this.a[w[2][1]]) + "Lakh "
            : "";
        str +=
          parseInt(w[3]) != 0
            ? (this.a[Number(w[3])] ||
              this.b[w[3][0]] + " " + this.a[w[3][1]]) + "Thousand "
            : "";
        str +=
          parseInt(w[4]) != 0
            ? (this.a[Number(w[4])] ||
              this.b[w[4][0]] + " " + this.a[w[4][1]]) + "Hundred "
            : "";
        str +=
          parseInt(w[5]) != 0
            ? (this.a[Number(w[5])] ||
              this.b[w[5][0]] + " " + this.a[w[5][1]]) +
            "and " +
            this.decimalToWord(f)
            : "";
        return str;
      } else {
        if (!w) return;
        var str = "";
        str +=
          parseInt(w[1]) != 0
            ? (this.a[Number(w[1])] ||
              this.b[w[1][0]] + " " + this.a[w[1][1]]) + "Crore "
            : "";
        str +=
          parseInt(w[2]) != 0
            ? (this.a[Number(w[2])] ||
              this.b[w[2][0]] + " " + this.a[w[2][1]]) + "Lakh "
            : "";
        str +=
          parseInt(w[3]) != 0
            ? (this.a[Number(w[3])] ||
              this.b[w[3][0]] + " " + this.a[w[3][1]]) + "Thousand "
            : "";
        str +=
          parseInt(w[4]) != 0
            ? (this.a[Number(w[4])] ||
              this.b[w[4][0]] + " " + this.a[w[4][1]]) + "Hundred "
            : "";
        str +=
          parseInt(w[5]) != 0
            ? (this.a[Number(w[5])] ||
              this.b[w[5][0]] + " " + this.a[w[5][1]]) + "Only "
            : "";
        return str;
      }
    }
  }

  setDefaultValueInTransaction() {
    if (this.TrnMainObj.MWAREHOUSE == null || this.TrnMainObj.MWAREHOUSE == "") { this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse; }

    this.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;

    this.TrnMainObj.ProdList.forEach(prod => {
      prod.WAREHOUSE = this.TrnMainObj.MWAREHOUSE;
      prod.BRANCH = this.TrnMainObj.BRANCH;
      //   prod.Supplier=this.TrnMainObj.PARAC;
    });
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
      var settlementmode = this.settlementList.filter(
        x => x.DESCRIPTION == this.TrnMainObj.TRNMODE
      )[0];
      if (settlementmode == null) {
        this.alertService.warning("Settlement Mode not found.");
        return false;
      }
      for (let i of this.TrnMainObj.ProdList) {
        if (settlementmode.DECREASE == 0) {
          i.REALQTY_IN = i.Quantity;
          i.ALTQTY_IN = i.Quantity;
          i.RealQty = 0;
          i.AltQty = 0;
        } else if (settlementmode.DECREASE == 1) {
          i.REALQTY_IN = 0;
          i.ALTQTY_IN = 0;
          i.RealQty = i.Quantity;
          i.AltQty = i.Quantity;
        }
      }
      var StockVAlidateItem = this.TrnMainObj.ProdList.filter(x => x.RealQty > x.STOCK && x.STOCK > 0)[0];
      if (StockVAlidateItem != null) {

        this.alertService.error("Inserted Quantity is greater than its Stock on item :" + StockVAlidateItem.ITEMDESC);
        return false;
      }
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut
    ) {
      this.TrnMainObj.BILLTO = this.TrnMainObj.DIVISION;
    }
    return true;
  }
  checkTransactionValidation() {
    if (
      this.TrnMainObj.Mode == "VIEW" &&
      this.TrnMainObj.VoucherType != VoucherTypeEnum.TaxInvoiceCancel
    ) {
      alert("Can Not save View Voucher");
      return false;
    }
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
      if (
        this.TrnMainObj.BILLTO == null ||
        this.TrnMainObj.BILLTO == undefined ||
        this.TrnMainObj.BILLTO == ""
      ) {
        alert("Warehouse From field is not detected.");
        return false;
      }
      if (
        this.TrnMainObj.BILLTOADD == null ||
        this.TrnMainObj.BILLTOADD == undefined ||
        this.TrnMainObj.BILLTOADD == ""
      ) {
        alert("Warehouse To field is not detected.");
        return false;
      }
      if (this.TrnMainObj.BILLTOADD == this.TrnMainObj.BILLTO) {
        alert("You cannot transfer to same Warehouse");
        return false;
      }
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
    ) {
      if (this.TrnMainObj.TRNAC == null || this.TrnMainObj.TRNAC == "") {
        alert("Please select Transaction account");
        return false;
      }
    }
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
    ) {
      if (
        this.TrnMainObj.ProdList.some(x => x.EXPDATE == null && x.MCODE != null)
      ) {
        this.alertService.warning(
          "Expiry Date of Item Not Detected..Please Review the list..."
        );
        return false;
      }

      let expitem = this.TrnMainObj.ProdList.filter(x => new Date(x.EXPDATE) < new Date(new Date().setDate(new Date().getDate() - 1)) && x.MCODE != null)[0];
      if (expitem != null) {
        this.alertService.warning(
          "Expired Item Detected with code : " + expitem.MCODE + "..Please Review the list..."
        );
        return false;
      }
      if (
        this.TrnMainObj.ProdList.some(
          x => new Date(x.MFGDATE) > new Date() && x.MCODE != null
        )
      ) {
        this.alertService.warning(
          "Invalid Manufacture Date Item Detected..Please Review the list..."
        );
        return false;
      }
      if (
        this.TrnMainObj.ProdList.some(
          x => x.MCODE != null && this.nullToZeroConverter(x.Quantity) < 1
        )
      ) {
        this.alertService.warning(
          "Invalid Entry With Invalid Quantity Detected.Please Check the Item Entry. "
        );
        return false;
      }
      var StockVAlidateItem = this.TrnMainObj.ProdList.filter(x => x.RealQty > x.STOCK && x.STOCK > 0)[0];
      if (StockVAlidateItem != null) {

        this.alertService.error("Inserted Quantity is greater than its Stock on item :" + StockVAlidateItem.ITEMDESC);
        return false;
      }
    }
    return true;
  }

  initialFormLoad(voucherType,othercondition:any='') {
    console.log("@@othercondition",othercondition)
    this.TrnMainObj = <TrnMain>{};
    this.showPerformaApproveReject = false;
    this.TrnMainObj.AdditionalObj = <TrnMain_AdditionalInfo>{};
    this.TrnMainObj.TransporterEway = <Transporter_Eway>{};
    const uuidV1 = require('uuid/v1');
    this.TrnMainObj.guid = uuidV1();
    this.TrnMainObj.TrntranList = [];
    this.TrnMainObj.BillTrackedList = [];
    this.TrnMainObj.Mode = "NEW";
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse;
    this.masterService.RefObj = {};
    this.masterService.AdditionalPurchaseAcObj = '';
    this.masterService.AdditionalPurchaseCreditAcObj = '';
    this._additionalCostService.addtionalCostList = [];
    this._additionalCostService.costList = [];
    this._additionalCostService.costdetail = [];
    this.masterService.importDocumentDetailsObj = <importdocument>{};
    switch (voucherType) {
      case VoucherTypeEnum.PurchaseOrder:
        this.TrnMainObj.VoucherPrefix = "PO";
        this.masterService.VocuherPrefix = "PO";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PurchaseOrder;
        this.pageHeading = "Purchase Order";
        break;
      case VoucherTypeEnum.Purchase:
        this.TrnMainObj.VoucherPrefix = "PI";
        this.masterService.VocuherPrefix = "PI";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Purchase;
        this.pageHeading = "Purchase Invoice";
        break;
      // case VoucherTypeEnum.DebitNote:
      //   this.TrnMainObj.VoucherPrefix = "DN";
      //   this.TrnMainObj.VoucherType = VoucherTypeEnum.DebitNote;
      //   this.pageHeading = "Debit Note";
      //   break;
      // case VoucherTypeEnum.DebitNote:
      //   this.TrnMainObj.VoucherPrefix = "DN";
      //   this.TrnMainObj.VoucherType = VoucherTypeEnum.DebitNote;
      //   this.pageHeading = "Debit Note";
      //   break;
      case VoucherTypeEnum.SalesOrder:
        this.TrnMainObj.VoucherPrefix = "SO";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.SalesOrder;
        this.voucherNoHeader = "SO No";
        this.pageHeading = "Sales Order";
        this.masterService.VocuherPrefix = "SO";
        break;
      case VoucherTypeEnum.Sales:
        this.TrnMainObj.VoucherPrefix = "SI";
        this.masterService.VocuherPrefix = "SI";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Sales;
        this.pageHeading = "Sales Invoice";
        break;
      case VoucherTypeEnum.TaxInvoice:
        this.TrnMainObj.VoucherPrefix = "TI";
        this.masterService.VocuherPrefix = "TI";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.TaxInvoice;
        this.pageHeading = "Tax Invoice";
        if (this.userProfile.CompanyInfo.ORG_TYPE == 'retailer' ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          this.masterService.getCurrentDate().subscribe(
            date => {
              this.TrnMainObj.DeliveryDate = date.Date.substring(0, 10);
            },
            error => {
              this.masterService.resolveError(
                error,
                "voucher-date - getCurrentDate"
              );
            }
          );
        }
        break;
      // case VoucherTypeEnum.CreditNote:
      //   this.TrnMainObj.VoucherPrefix = "CN";
      //   this.TrnMainObj.VoucherType = VoucherTypeEnum.CreditNote;
      //   this.pageHeading = "Credit Note";
      //   break;
      case VoucherTypeEnum.StockIssue:
        this.TrnMainObj.VoucherPrefix = "IS";
        this.masterService.VocuherPrefix = "IS";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.StockIssue;
        this.pageHeading = "Stock Issue";
        break;
      case VoucherTypeEnum.StockSettlement:
        this.TrnMainObj.VoucherPrefix = "DM";
        this.masterService.VocuherPrefix = "DM";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.StockSettlement;
        this.pageHeading = "Stock Settlement";
        break;

      case VoucherTypeEnum.OpeningStockBalance:
        this.TrnMainObj.VoucherPrefix = "OP";
        this.masterService.VocuherPrefix = "OP";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.OpeningStockBalance;
        this.pageHeading = "Opening Stock Entry";
        break;
      case VoucherTypeEnum.BranchTransferIn:
        this.TrnMainObj.VoucherPrefix = "TR";
        this.masterService.VocuherPrefix = "TR";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.BranchTransferIn;
        this.pageHeading = "Branch Transfer In";
        break;
      case VoucherTypeEnum.StockSettlement:
        this.TrnMainObj.VoucherPrefix = "TO";
        this.masterService.VocuherPrefix = "TO";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.BranchTransferOut;
        this.pageHeading = "Branch Transfer Out";
        break;
      case VoucherTypeEnum.PerformaSalesInvoice:
        this.TrnMainObj.VoucherPrefix = "PP";
        this.masterService.VocuherPrefix = "PP";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PerformaSalesInvoice;
        this.pageHeading = "Performa Invoice";
        break;
      case VoucherTypeEnum.PurchaseOrderCancel:
        this.TrnMainObj.VoucherPrefix = "PC";
        this.masterService.VocuherPrefix = "PC";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PurchaseOrderCancel;
        this.pageHeading = "PO Cancel";
        break;

      //for account vouchers
      case VoucherTypeEnum.Journal:
        this.TrnMainObj.VoucherPrefix = "JV";
        this.masterService.VocuherPrefix = "JV";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Journal;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "JOURNAL VOUCHER";
        this.TableAcHeader = "Acount (A/C)";

        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.PaymentVoucher:
        this.TrnMainObj.VoucherPrefix = "PV";
        this.masterService.VocuherPrefix = "PV";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PaymentVoucher;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "PAYMENT VOUCHER";
        this.TableAcHeader = "Party/Expenses A/C";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.ReceiveVoucher:
        this.TrnMainObj.VoucherPrefix = "RV";
        this.masterService.VocuherPrefix = "RV";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.ReceiveVoucher;
        this.pageHeading = "RECEIPT VOUCHER";
        this.TrnMainObj.TrntranList = [];
        this.TableAcHeader = "Party/Income A/C";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.DebitNote:
        this.TrnMainObj.VoucherPrefix = "DN";
        this.masterService.VocuherPrefix = "DN";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.DebitNote;
        this.pageHeading = "DEBIT NOTE";
        this.TrnMainObj.TrntranList = [];
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.CreditNote:
        this.TrnMainObj.VoucherPrefix = "CN";
        this.masterService.VocuherPrefix = "CN";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.CreditNote;
        this.pageHeading = "CREDIT NOTE";
        this.voucherNoHeader = "Return No";
        this.TrnMainObj.TrntranList = [];
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.ContraVoucher:
        this.TrnMainObj.VoucherPrefix = "CV";
        this.masterService.VocuherPrefix = "CV";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.ContraVoucher;
        this.pageHeading = "CONTRA VOUCHER";
        this.TrnMainObj.TrntranList = [];
                this.addRowForTransaction(-1);
        break;

      //configuration
      case VoucherTypeEnum.AccountOpeningBalance:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.AccountOpeningBalance;
        this.pageHeading = "ACCOUNT OPENING BALANCE";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "OB";
        this.TrnMainObj.VoucherAbbName = "OB";
        this.TrnMainObj.VoucherName = "OBBILL";
        this.masterService.VocuherPrefix = "OB";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.PartyOpeningBalance:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PartyOpeningBalance;
        this.pageHeading = "PARTY OPENING BALANCE";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "AO";
        this.TrnMainObj.VoucherAbbName = "AO";
        this.masterService.VocuherPrefix = "AO";
        this.TrnMainObj.VoucherName = "OPPARTYBILL";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.CapitalVoucher:
        this.TrnMainObj.VoucherPrefix = "CP";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.CapitalVoucher;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "Capitalize Purchase Voucher";
        this.TableAcHeader = "Account Name";
        this.masterService.VocuherPrefix = "CP";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.AdditionalCost:

        this.TrnMainObj.VoucherPrefix = "AD";
        this.TrnMainObj.VoucherAbbName = "AD";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.AdditionalCost;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "Additional Cost";
        this.TableAcHeader = "A/c Name";
        this.masterService.VocuherPrefix = "AD";
        if(this.userSetting.ENABLELOCALPURCHASE==1){
          this.masterService.RefObj.PURCHASE_TYPE='IMPORTPURCHASE';
        }
        this.masterService.showLoadAllocationbutton=false;
        this.masterService.showCostPopup=false;
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.SinglePayment:
        this.TrnMainObj.VoucherPrefix = "PV";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.SinglePayment;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "Single Payment";
        this.TableAcHeader = "Particulars";
        this.masterService.VocuherPrefix = "PV";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.PostDirectory:
        this.TrnMainObj.VoucherPrefix = "PC";
        this.masterService.VocuherPrefix = "PC";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PostDirectory;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "Post-Dated Cheque Voucher";
        this.TableAcHeader = "Post Dated Cheque Voucher";
        this.addRowForTransaction(-1);
        break;

        case VoucherTypeEnum.Cellpay:
        this.TrnMainObj.VoucherPrefix = "CX";
        this.masterService.VocuherPrefix = "CX";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Cellpay;
        this.TrnMainObj.TrntranList = [];
        this.pageHeading = "CellPay VOUCHER";
        this.TableAcHeader = "CellPay Voucher";
        this.addRowForTransaction(-1);

        case VoucherTypeEnum.ReverseCreditNote:
        // this.TrnMainObj.VoucherPrefix = "RR";
        // this.masterService.VocuherPrefix = "RR";
        // this.TrnMainObj.VoucherType = VoucherTypeEnum.ReverseCreditNote;
        // this.TrnMainObj.TrntranList = [];
        // this.pageHeading = "Reverse Credit Note";
        // this.TableAcHeader = "Reverse Credit Note";
        this.addRowForTransaction(-1);
        break;
  

    }

    this.getVoucherNumber();

    if(othercondition!="cashcollection"){
      this.getCurrentDate();
    }

    if (this.TrnMainObj.VoucherType == 57 || this.TrnMainObj.VoucherType == 58)
      return;

    this.addRow();
  }

  getVoucherNumber() {
    if (this.TrnMainObj.VoucherType === VoucherTypeEnum.AdditionalCost) {
      this.TrnMainObj.VoucherPrefix = "AD";
      this.TrnMainObj.VoucherAbbName = "AD";
    }
    if (this.masterService.userSetting.ENABLEVOUCHERSERIES == 1) {
      if (this.prefix.VNAME != null || this.prefix.VNAME != '' || this.prefix.VNAME != undefined) {
        this.TrnMainObj.VoucherPrefix = this.prefix.VNAME;
        this.TrnMainObj.VoucherAbbName = this.prefix.VNAME;
        this.masterService.getVoucherNo(this.TrnMainObj, this.prefix.VNAME).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this.TrnMainObj.VCHRNO = TMain.VCHRNO;
            // this.TrnMainObj.CHALANNO = TMain.CHALANNO;
          } else {
            alert("Failed to retrieve VoucherNo");
          }
        });
      }
    }
    else {
      //console.log("@@this.TrnMainObj.DIVISION",this.TrnMainObj.DIVISION)
      this.TrnMainObj.DIVISION = this.PhiscalObj.Div;
      //console.log("@@this.PhiscalObj.DIV",this.PhiscalObj.Div)
      this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
        if (res.status == "ok") {
          let TMain = <TrnMain>res.result;
          this.TrnMainObj.VCHRNO = TMain.VCHRNO;
          // this.TrnMainObj.CHALANNO = TMain.CHALANNO;
        } else {
          alert("Failed to retrieve VoucherNo");
        }
      });
    }

  }

  getCurrentDate() {

    this.masterService.getCurrentDate().subscribe(
      date => {
        if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
          this.TrnMainObj.TRNDATE = date.Date.substring(0, 10);
          this.TrnMainObj.TRN_DATE = date.Date.toString().substring(0, 10);
        }
        else {
          var x = this.masterService.PhiscalObj.EndDate
          x = x.substring(0, 10);
          this.TrnMainObj.TRNDATE = x;
          this.TrnMainObj.TRN_DATE = x;
        }


      },
      error => {
        this.masterService.resolveError(error, "voucher-date - getCurrentDate");
      }
    );
  }

  // getBsDate(date){
  //   var adbs = require("ad-bs-converter");
  //   var adDate = (date.replace("-", "/")).replace("-", "/");
  //   var bsDate = adbs.ad2bs(adDate);
  //   return (bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
  // }

  addRow() {
    try {
      if (this.TrnMainObj.ProdList == null) {
        this.TrnMainObj.ProdList = [];
      }
      //Duplicate Item with same batch check
      // let duplicatecheck = 0;
      // if (this.TrnMainObj.ProdList == null) {
      //   this.TrnMainObj.ProdList = [];
      // }
      // this.TrnMainObj.ProdList.reduce((aac, obj) => {
      //   var existitem = aac.find(
      //     item => item.MCODE === obj.MCODE && item.BATCH === obj.BATCH
      //   );
      //   if (existitem && this.TrnMainObj.VoucherType != VoucherTypeEnum.SalesOrder) {
      //     alert("Duplicate Item with same batch detected...");
      //     duplicatecheck = 1;
      //     return;
      //   }
      //   aac.push(obj);
      //   return aac;
      // }, []);
      // if (duplicatecheck == 1) {
      //   return false;
      // }

      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
      ) {
        if (
          this.TrnMainObj.ProdList.some(
            x => x.EXPDATE == null && x.MCODE != null
          )
        ) {
          this.alertService.warning(
            "Expiry Date of Item Not Detected..Please Review the list..."
          );
          return false;
        }

        let expitem = this.TrnMainObj.ProdList.filter(x => new Date(x.EXPDATE) < new Date(new Date().setDate(new Date().getDate() - 1)) && x.MCODE != null)[0];
        if (expitem != null) {
          this.alertService.warning(
            "Expired Item Detected with code : " + expitem.MCODE + "..Please Review the list..."
          );
          return false;
        }
        if (
          this.TrnMainObj.ProdList.some(
            x => new Date(x.MFGDATE) > new Date() && x.MCODE != null
          )
        ) {
          this.alertService.warning(
            "Invalid Manufacture Date Item Detected..Please Review the list..."
          );
          return false;
        }
        if (
          this.TrnMainObj.ProdList.some(
            x => x.MCODE != null && this.nullToZeroConverter(x.Quantity) < 1
          )
        ) {
          this.alertService.warning(
            "Invalid Entry With Invalid Quantity Detected.Please Check the Item Entry. "
          );
          return false;
        }
      }
      // this.TrnMainObj.ProdList.forEach(x => x.inputMode = false);
      var newRow = <TrnProd>{};
      newRow.inputMode = true;
      newRow.MENUCODE = null;
      newRow.ITEMDESC = null;
      newRow.RATE = null;
      newRow.RATE = null;
      newRow.NCRATE = null;
      newRow.AMOUNT = null;
      newRow.DISCOUNT = null;
      newRow.VAT = null;
      newRow.NETAMOUNT = null;
      newRow.ITEMTYPE = null;
      newRow.RECEIVEDTYPE = null;
      newRow.WAREHOUSE = null;
      newRow.BC = null;
      this.TrnMainObj.ProdList.push(newRow);
      return true;
    } catch (ex) {
      //this.alertService.error(ex);
      return false;
    }
  }

  loadSODataToSales(VCHR) {
    this.masterService
      .masterPostmethod("/getSalesBillFromSO", { REFBILL: VCHR })
      .subscribe(
        data => {
          if (data.status == "ok") {
            this.TrnMainObj = data.result;
            // this.TrnMainObj.Mode = "VIEW";
            // this.ReCalculateBill();

            this.trnmainBehavior.next(this.TrnMainObj);
          }
        },
        error => {
          this.trnmainBehavior.complete();
        },
        () => this.trnmainBehavior.complete()
      );
    //});
  }

  RealQuantitySet(i, CONFACTOR: number = 1) {
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryReturn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.GoodsReceived ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder
    ) {
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].REALQTY_IN =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
        i
      ].Quantity;
      this.TrnMainObj.ProdList[i].RealQty = 0;
      this.TrnMainObj.ProdList[i].AltQty = 0;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Delivery ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice
    ) {
      //alert("DispatchOut")
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].RealQty =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].REALQTY_IN = 0;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
    ) {
      if (this.TrnMainObj.ProdList[i].Quantity > 0) {
        //.CONFACTOR *
        this.TrnMainObj.ProdList[i].REALQTY_IN =
          this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
          CONFACTOR;
        this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
          i
        ].Quantity;
        this.TrnMainObj.ProdList[i].RealQty = 0;
        this.TrnMainObj.ProdList[i].AltQty = 0;
        this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      } else if (this.TrnMainObj.ProdList[i].Quantity < 0) {
        // .CONFACTOR *
        this.TrnMainObj.ProdList[i].RealQty =
          -1 * this.TrnMainObj.ProdList[i].Quantity * CONFACTOR;
        this.TrnMainObj.ProdList[i].AltQty =
          -1 * this.TrnMainObj.ProdList[i].Quantity;
        this.TrnMainObj.ProdList[i].REALQTY_IN = 0;
        this.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
        this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      }
    } else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
      /*
           none of the value are 0 here
           later while save the value it will checks StockSettlement and then return 0 there.
           */
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].REALQTY_IN =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
        i
      ].Quantity;
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].RealQty =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrderCancel
    ) {
      /*
           none of the value are 0 here
           later while save the value it will checks StockSettlement and then return 0 there.
           */
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].REALQTY_IN =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
        i
      ].Quantity;
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].RealQty =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      this.TrnMainObj.ProdList[i].REALQTY_IN = 0;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel
    ) {
      this.TrnMainObj.ProdList[i].REALQTY_IN = this.nullToZeroConverter(
        this.TrnMainObj.ProdList[i].RealQty
      );
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
        i
      ].AltQty;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      this.TrnMainObj.ProdList[i].RealQty = 0;
      this.TrnMainObj.ProdList[i].AltQty = 0;
    } else {
      alert("Vouchertype not found please contact admin.");
    }
  }

  setunit(baseRate: number, baseRate2: number, activerowIndex, altunitObj) {
    if (altunitObj == null) {
      altunitObj = <any>{};
    }
    this.TrnMainObj.ProdList[activerowIndex].CONFACTOR = altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALTUNIT = altunitObj.ALTUNIT;
    this.TrnMainObj.ProdList[activerowIndex].UNIT = altunitObj.BASEUOM;
    this.TrnMainObj.ProdList[activerowIndex].RATE = baseRate;
    this.TrnMainObj.ProdList[activerowIndex].REALRATE = baseRate;
    this.TrnMainObj.ProdList[activerowIndex].ALTRATE =
      baseRate * altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALTRATE2 =
      baseRate2 * altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALTMRP = this.TrnMainObj.ProdList[activerowIndex].MRP * altunitObj.CONFACTOR;
    this.RealQuantitySet(activerowIndex, altunitObj.CONFACTOR);
  }
  setAltunitDropDownForView(activerowIndex) {
    this.TrnMainObj.ProdList[
      activerowIndex
    ].ALTUNITObj = this.TrnMainObj.ProdList[
      activerowIndex
    ].Product.AlternateUnits.filter(
      x => x.ALTUNIT == this.TrnMainObj.ProdList[activerowIndex].ALTUNIT
    )[0];
  }

  setAltunitDropDownForViewStock(activerowIndex) {
    this.masterService.masterGetmethod(
      "/getAltUnitsOfItem/" + this.TrnMainObj.ProdList[activerowIndex].MCODE
    );
    // .subscribe(res => {
    //   if(res.status = "ok"){
    //     this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits = JSON.parse(res.result);

    //   }
    // })

    this.TrnMainObj.ProdList[
      activerowIndex
    ].ALTUNITObj = this.TrnMainObj.ProdList[
      activerowIndex
    ].Product.AlternateUnits.filter(
      x => x.ALTUNIT == this.TrnMainObj.ProdList[activerowIndex].ALTUNIT
    );
  }

  // getStockSettlementItemUnit(activerowIndex){
  //   this.masterService.masterGetmethod("getAluUnitsOfItem/")
  //   .subscribe(res => {
  //     if(res.status = "ok"){
  //       this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits = JSON.parse(res.result);
  //     }
  //   })
  // }

  getPricingOfItem(
    activerowIndex,
    batchcode = "",
    getAltunitListFromApi = true
  ) {

    var getpricingObj = {
      mcode: this.TrnMainObj.ProdList[activerowIndex].MCODE,
      batchcode: batchcode,
      MRP: this.TrnMainObj.ProdList[activerowIndex].MRP,
      GST: this.TrnMainObj.ProdList[activerowIndex].GSTRATE
        ? this.TrnMainObj.ProdList[activerowIndex].GSTRATE / 100
        : 0,
      SRate: 0,
      PRate: 0,
      Party: this.TrnMainObj.PARAC,
      rateType: this.TrnMainObj.ProdList[activerowIndex].Mcat
    };

    this.masterService
      .masterPostmethod("/getBatchwiseItemPriceanddiscounts", getpricingObj)
      .subscribe(res => {
        if (res.status == "ok") {
          this.AssignSellingPriceAndDiscounts(
            JSON.parse(res.result),
            activerowIndex,
            this.TrnMainObj.PARTY_ORG_TYPE
          );
          if (getAltunitListFromApi) {
            this.masterService
              .masterGetmethod(
                "/getAltUnitsOfItem/" +
                this.TrnMainObj.ProdList[activerowIndex].MCODE
              )
              .subscribe(
                res => {
                  if (res.status == "ok") {
                    if (
                      this.TrnMainObj.ProdList[activerowIndex].Product == null
                    ) {
                      this.TrnMainObj.ProdList[activerowIndex].Product = <
                        Product
                        >{};
                    }
                    this.TrnMainObj.ProdList[
                      activerowIndex
                    ].Product.MCODE = this.TrnMainObj.ProdList[
                      activerowIndex
                    ].MCODE;
                    this.TrnMainObj.ProdList[
                      activerowIndex
                    ].Product.AlternateUnits = JSON.parse(res.result);

                    this.TrnMainObj.ProdList[
                      activerowIndex
                    ].ALTUNITObj = this.TrnMainObj.ProdList[
                      activerowIndex
                    ].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
                    let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;
                    let rate2 = 0;
                    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
                      rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;
                    } else {
                      rate2 = this.TrnMainObj.ProdList[activerowIndex].PRATE;
                    }
                    this.setunit(
                      rate1,
                      rate2,
                      activerowIndex,
                      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
                    );
                  } else {
                  }
                },
                error => {
                }
              );
          } else {
            let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;
            let rate2 = 0;
            if (
              this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
              this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase
            ) {
              rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;
            } else {
              rate2 = this.TrnMainObj.ProdList[activerowIndex].PRATE;
            }
            this.setunit(
              rate1,
              rate2,
              activerowIndex,
              this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
            );
            this.CalculateNormalNew(activerowIndex);
            this.ReCalculateBill();
          }
        } else {
          alert(res.result);
        }
      });
  }
  AssignSellingPriceAndDiscounts(
    PriceRate: PriceRate[],
    activerowIndex,
    DestinationOrgType = "walkin"
  ) {

    if (DestinationOrgType == null) {
      DestinationOrgType = "";
    }
    let orgType = this.userProfile.CompanyInfo.ORG_TYPE;

    let pd = PriceRate.filter(
      x => x.ColName == "primary" && x.ColType == "discount"
    )[0];
    let sd = PriceRate.filter(
      x => x.ColName == "secondary" && x.ColType == "discount"
    )[0];
    let ld = PriceRate.filter(
      x => x.ColName == "liquidable" && x.ColType == "discount"
    )[0];
    this.TrnMainObj.ProdList[activerowIndex].BasePrimaryDiscount =
      pd == undefined || pd == null ? 0 : pd.Value;

    this.TrnMainObj.ProdList[activerowIndex].BaseSecondaryDiscount =
      sd == undefined || sd == null ? 0 : sd.Value;

    this.TrnMainObj.ProdList[activerowIndex].BaseLiquiditionDiscount =
      ld == undefined || ld == null ? 0 : ld.Value;

    if (orgType.toLowerCase() == "superdistributor") {
      let spp = PriceRate.filter(
        x => x.ColName == "superdistributorlandingprice"
      )[0];
      let ssp = <PriceRate>{};
      // if (DestinationOrgType.toLocaleLowerCase() == "distributor") {
      ssp = PriceRate.filter(
        x => x.ColType == "sellingprice" && x.ColName == "superdistributor"
      )[0];

      // }
      // else if (DestinationOrgType.toLocaleLowerCase() == "retailer" || DestinationOrgType.toLocaleLowerCase()=="ak" || DestinationOrgType.toLocaleLowerCase()=="ck") {
      //  ssp = PriceRate.filter(x => x.ColType == "sellingprice" && x.ColName == "distributor")[0];
      // }
      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
      ) {
        this.TrnMainObj.ProdList[
          activerowIndex
        ].PRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].REALRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].ALTRATE = this.TrnMainObj.ProdList[activerowIndex].RATE =
          spp == undefined || spp == null
            ? 0
            : this.nullToZeroConverter(spp.Value);
        this.TrnMainObj.ProdList[activerowIndex].SPRICE =
          ssp == undefined || ssp == null
            ? 0
            : this.nullToZeroConverter(ssp.Value);
      } else {
        this.TrnMainObj.ProdList[
          activerowIndex
        ].REALRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].ALTRATE = this.TrnMainObj.ProdList[activerowIndex].RATE =
          ssp == undefined || ssp == null
            ? 0
            : this.nullToZeroConverter(ssp.Value);

        this.TrnMainObj.ProdList[activerowIndex].PRATE =
          spp == undefined || spp == null
            ? 0
            : this.nullToZeroConverter(spp.Value);
      }
    } else if (orgType.toLowerCase() == "distributor") {
      let dpp = PriceRate.filter(
        x => x.ColType == "sellingprice" && x.ColName == "superdistributor"
      )[0];
      let dsp = PriceRate.filter(
        x => x.ColName == "distributor" && x.ColType == "sellingprice"
      )[0];

      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
      ) {
        this.TrnMainObj.ProdList[
          activerowIndex
        ].PRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].REALRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].ALTRATE = this.TrnMainObj.ProdList[activerowIndex].RATE =
          dpp == undefined || dpp == null
            ? 0
            : this.nullToZeroConverter(dpp.Value);

        this.TrnMainObj.ProdList[activerowIndex].SPRICE =
          dsp == undefined || dsp == null
            ? 0
            : this.nullToZeroConverter(dsp.Value);
      } else {
        this.TrnMainObj.ProdList[
          activerowIndex
        ].REALRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].ALTRATE = this.TrnMainObj.ProdList[activerowIndex].RATE =
          dsp == undefined || dsp == null
            ? 0
            : this.nullToZeroConverter(dsp.Value);

        this.TrnMainObj.ProdList[activerowIndex].PRATE =
          dpp == undefined || dpp == null
            ? 0
            : this.nullToZeroConverter(dpp.Value);
      }
    } else {
      let rsp = <any>{};
      let rpp = PriceRate.filter(
        x => x.ColType == "sellingprice" && x.ColName == "distributor"
      )[0];
      //if (DestinationOrgType==null || DestinationOrgType=="" || DestinationOrgType.toLocaleLowerCase() == "walkin")//walkin customer is any unknown customer that buy good from shop
      // if(this.TrnMainObj.PARAC==null || this.TrnMainObj.PARAC=="")
      //{
      // rsp = PriceRate.filter(x => x.ColName == "MRP")[0];
      // }
      // else {

      rsp = PriceRate.filter(
        x => x.ColName == "retailer" && x.ColType == "sellingprice"
      )[0];
      // }

      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
      ) {
        this.TrnMainObj.ProdList[
          activerowIndex
        ].PRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].REALRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].ALTRATE = this.TrnMainObj.ProdList[activerowIndex].RATE =
          rpp == undefined || rpp == null
            ? 0
            : this.nullToZeroConverter(rpp.Value);

        this.TrnMainObj.ProdList[activerowIndex].SPRICE =
          rsp == undefined || rsp == null
            ? 0
            : this.nullToZeroConverter(rsp.Value);
      } else {
        this.TrnMainObj.ProdList[
          activerowIndex
        ].REALRATE = this.TrnMainObj.ProdList[
          activerowIndex
        ].ALTRATE = this.TrnMainObj.ProdList[activerowIndex].RATE =
          rsp == undefined || rsp.Value == null
            ? 0
            : this.nullToZeroConverter(rsp.Value);

        this.TrnMainObj.ProdList[activerowIndex].PRATE =
          rpp == undefined || rpp == null
            ? 0
            : this.nullToZeroConverter(rpp.Value);
      }
    }
  }
  MergeSameItemWithSameBatchOfProd() {
    // let MergedProd=[];
    // Rx.Observable.from(this.TrnMainObj.ProdList)
    // .groupBy(x =>{ x.MCODE,x.ITEMDESC,x.MENUCODE}) // using groupBy from Rxjs
    // .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
    // .map(g => {// mapping
    //   return {
    //     MCODE: g[0].MCODE,//take the first name because we grouped them by name
    //     Quantity: _.sumBy(g, 'Quantity'),
    //     REALQTY_IN: _.sumBy(g, 'REALQTY_IN'),
    //   }
    // })
    // .toArray() //.toArray because I guess you want to loop on it with ngFor
    // .subscribe(d => MergedProd = d);
  }

  addRowForTransaction(index) {
    try {
      
      
      
      if (index == -1) {
        // this.TrnMainObj.TrntranList[0].ROWMODE =  "new";
        this.AddNewTrnTranRow(index);
        
        return;
      }

      // if (this.TrnMainObj.TrntranList[index + 1]) return; //prevent to add row if selected at the item at somewhere except last

      var rm = this.TrnMainObj.TrntranList[index].ROWMODE;
      if (rm == "new") {
        this.TrnMainObj.TrntranList[index].ROWMODE = "new";
        this.AddNewTrnTranRow(index);
      } else if (rm == "edit") {
        this.TrnMainObj.TrntranList[index].ROWMODE = "edit";
        this.AddNewTrnTranRow(index);
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  AddNewTrnTranRow(index) {
    ////console.log("CheckIndex", index);

    try {
      if (!this.TrnMainObj.TrntranList) {
        this.TrnMainObj.TrntranList = [];
      }

      let currentObj = this.TrnMainObj.TrntranList[index];
      if (this.TrnMainObj.TrntranList[index + 1]) {
        return;
      }

      if (
        index != -1 &&
        (!currentObj.AccountItem ||
          currentObj.AccountItem.ACID == undefined ||
          currentObj.AccountItem.ACID == "")
      ) {
        // this.alertService.info("Please Select A/C");
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

      // if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher){
      //   this.TrnMainObj.TrntranList.forEach(x=>{
      //     x.ISTAXABLE = 1;
      //   });
      // }

      if (this.userSetting.COSTCENTERCOMPULSORY == 1) {
        if(this.TrnMainObj.VoucherType ==  VoucherTypeEnum.Journal || this.TrnMainObj.VoucherType ==  VoucherTypeEnum.ContraVoucher || 
          this.TrnMainObj.VoucherType ==  VoucherTypeEnum.PaymentVoucher || this.TrnMainObj.VoucherType ==  VoucherTypeEnum.ReceiveVoucher ||
          this.TrnMainObj.VoucherType ==  VoucherTypeEnum.PostDirectory || this.TrnMainObj.VoucherType ==  VoucherTypeEnum.CapitalVoucher ||
          this.TrnMainObj.VoucherType ==  VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType ==  VoucherTypeEnum.DebitNote || 
          this.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote){
            //console.log("currentObj",currentObj)
            if(this.userSetting.enableCostCenter == 2){
              if (index != -1 &&
                (currentObj.CostCenter == '' || currentObj.CostCenter == null || currentObj.CostCenter === undefined)) {
                alert("Please select costcenter.");
                return;
              }
            }
          }
      }
      
        if(this.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
          let multiple_pledger = this.TrnMainObj.TrntranList && this.TrnMainObj.TrntranList.length>0 && this.TrnMainObj.TrntranList.filter(x=>x.A_ACID.startsWith('PA'));
          if(multiple_pledger && multiple_pledger.length > 1){
            alert("Multiple Party A/C Selection is Not Supported In Posted Date Voucher Entry.");
            return;
          }

          if(this.TrnMainObj.TrntranList && this.TrnMainObj.TrntranList.length > 1){
            let pledger = this.TrnMainObj.TrntranList.filter(x=>x.CRAMNT > 0 && x.A_ACID.startsWith('PA'));
            if(this.TrnMainObj.TRNMODE == 'Party Receipt'){
              pledger = this.TrnMainObj.TrntranList.filter(x=>x.CRAMNT > 0 && x.A_ACID.startsWith('PA'));
            }else{
              pledger = this.TrnMainObj.TrntranList.filter(x=>x.DRAMNT > 0 && x.A_ACID.startsWith('PA'));
            }
            //console.log("pledger1",pledger)
            if(pledger && pledger.length > 0){
              currentObj.ChequeNo = pledger[0].ChequeNo;
              currentObj.ChequeDate = pledger[0].ChequeDate;
            }
          }

          if (index != -1 &&
            (currentObj.ChequeNo == '' || currentObj.ChequeNo == null || currentObj.ChequeNo === undefined)) {
            alert("Please select Chequeno.");
            return;
          }

          if (index != -1 &&
            (currentObj.ChequeDate == '' || currentObj.ChequeDate == null || currentObj.ChequeDate === undefined)) {
            alert("Please select ChequeDate.");
            return;
          }

          
         
        }
      

      var guid = null;
      const uuidV1 = require('uuid/v1');
      guid = uuidV1();

      var newRow = <Trntran>{};
      var newaclist: TAcList = <TAcList>{};
      newRow.AccountItem = newaclist;
      newRow.A_ACID = null;
      newRow.NARATION1 = "none";
      newRow.inputMode = true;
      newRow.editMode = true;
      newRow.CRAMNT = 0;
      newRow.DRAMNT = 0;
      newRow.ROWMODE = "new";
      newRow.PartyDetails = [];
      newRow.guid = guid;
      newRow.disableSubLedger = true;
      newRow.ISTAXABLE=1;
      
      // ////console.log("new tranList", newRow);
      this.TrnMainObj.TrntranList.push(newRow);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }


  deleteAccountTrnRow(index) {
    try {
      if (this.TrnMainObj.TrntranList.length < 1) return;

      if (this.TrnMainObj.TrntranList.length == 1) {
        this.TrnMainObj.TrntranList.splice(index, 1);
        this.addRowForTransaction(-1);
        return;
      }
      var rm = this.TrnMainObj.TrntranList[index].ROWMODE;
      if (rm == "new") {
        this.TrnMainObj.TrntranList.splice(index, 1);
      } else if (rm == "save" || rm == "edit") {
        this.TrnMainObj.TrntranList.splice(index, 1);
      }
    } catch (ex) {
      ////console.log("deltetranro");
      this.alertService.error(ex);
    }
  }

  calculateDrCrDifferences() {
    try {
      this.calculateCrDrTotal();
      this.differenceAmount = 0;
      if (
        this.TrnMainObj.VoucherType != VoucherTypeEnum.Journal &&
        this.TrnMainObj.VoucherType != VoucherTypeEnum.ContraVoucher &&
        this.TrnMainObj.VoucherType != VoucherTypeEnum.AccountOpeningBalance &&
        this.TrnMainObj.VoucherType != VoucherTypeEnum.PartyOpeningBalance
      ) {
        return
      }
      let diffAmount: number = 0;
      this.TrnMainObj.TrntranList.forEach(tran => {
        diffAmount =
          diffAmount +
          ((tran.DRAMNT == null ? 0 : tran.DRAMNT) -
            (tran.CRAMNT == null ? 0 : tran.CRAMNT));
      });
      // ////console.log("CheckDiff",this.TrnMainObj.TrntranList)
      // this.differenceAmount = Math.abs(diffAmount);
      this.differenceAmount = diffAmount;
    } catch (ex) {
      ////console.log("alert form crdr difference");
      this.alertService.error(ex);
    }
  }
  calculateCrDrTotal() {
    this.crTotal = 0;
    this.drTotal = 0;

    this.TrnMainObj.TrntranList.forEach(tran => {
      this.crTotal = this.crTotal + (tran.CRAMNT == null ? 0 : tran.CRAMNT);
      this.drTotal = this.drTotal + (tran.DRAMNT == null ? 0 : tran.DRAMNT);
      this.drTotal.toLocaleString();
      this.crTotal.toLocaleString()
    });
  }
  barcodeEnterCommand(event) {
    event.preventDefault();
    document.getElementById("itembarcode").blur();
    this.masterService
      .masterPostmethod("/getItemDetailsFromBarcode", {
        barcode: this.BarcodeFromScan
      })
      .subscribe(
        res => {
          if (res.status == "ok") {
            if (res.message == "multiItem") {
              this.ItemsListForMultiItemBarcode = JSON.parse(res.result);
              this.masterService.PlistTitle = "itemList";
            } else {
              let item = JSON.parse(res.result);
              let index = this.TrnMainObj.ProdList.findIndex(
                x => x.MCODE == item.MCODE
              );

              if (index < 0) {
                this.addRow();
                this.assignValueToProdFromBarcode(
                  item,
                  this.TrnMainObj.ProdList.findIndex(x => x.MCODE == null)
                );
                document.getElementById("itembarcode").focus();
              } else {
                let alreadyExistingitem = this.TrnMainObj.ProdList[index];
                this.TrnMainObj.ProdList[index].Quantity += 1;
                this.RealQuantitySet(index, alreadyExistingitem.CONFACTOR);
                this.CalculateNormalNew(index);
                this.ReCalculateBill();
                document.getElementById("itembarcode").focus();
              }
              this.BarcodeFromScan = "";
            }
          } else {
            this.alertService.error(res.result);
          }
        },
        error => {
          this.alertService.error(error);
        }
      );
  }
  assignValueToProdFromBarcode(value, activerowIndex) {
    if (this.TrnMainObj.ProdList[activerowIndex] != null) {
      this.TrnMainObj.ProdList[activerowIndex].SELECTEDITEM = value;
      this.TrnMainObj.ProdList[activerowIndex].BC = value.BARCODE;
      this.TrnMainObj.ProdList[activerowIndex].PROMOTION = 0;
      this.TrnMainObj.ProdList[activerowIndex].BATCHSCHEME = null;
      this.TrnMainObj.ProdList[activerowIndex].ALLSCHEME = null;
      this.TrnMainObj.ProdList[activerowIndex].MRP = value.BatchObj.MRP;
      this.TrnMainObj.ProdList[activerowIndex].ISVAT = value.ISVAT;
      this.TrnMainObj.ProdList[activerowIndex].MENUCODE = value.MENUCODE;
      this.TrnMainObj.ProdList[activerowIndex].ITEMDESC = value.DESCA;
      this.TrnMainObj.ProdList[activerowIndex].MCODE = value.MCODE;
      this.TrnMainObj.ProdList[activerowIndex].GSTRATE_ONLYFORSHOWING =
        value.GST;
      this.TrnMainObj.ProdList[activerowIndex].GSTRATE = value.GST;
      this.TrnMainObj.ProdList[activerowIndex].WEIGHT = value.GWEIGHT;
      this.TrnMainObj.ProdList[activerowIndex].Mcat = value.MCAT;
      this.TrnMainObj.ProdList[activerowIndex].Product = value.Product;

      this.AssignSellingPriceAndDiscounts(
        value.PClist,
        activerowIndex,
        this.TrnMainObj.PARTY_ORG_TYPE
      );
      this.assignBatchToActiveProdRow(value.BatchObj, activerowIndex);
      this.TrnMainObj.ProdList[activerowIndex].Quantity = 1;
      this.TrnMainObj.ProdList[
        activerowIndex
      ].ALTUNITObj = this.TrnMainObj.ProdList[
        activerowIndex
      ].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];

      let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;
      let rate2 = 0;
      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase
      ) {
        rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;
      } else {
        rate2 = this.TrnMainObj.ProdList[activerowIndex].PRATE;
      }
      this.setunit(
        rate1,
        rate2,
        activerowIndex,
        this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
      );

      this.CalculateNormalNew(activerowIndex);
      this.ReCalculateBill();
    }
  }

  assignBatchToActiveProdRow(value, activerowIndex) {
    this.TrnMainObj.ProdList[activerowIndex].BATCH = value.BATCH;
    this.TrnMainObj.ProdList[activerowIndex].BC = value.BCODE;
    this.TrnMainObj.ProdList[activerowIndex].MFGDATE =
      value.MFGDATE == null ? "" : value.MFGDATE.toString().substring(0, 10);
    this.TrnMainObj.ProdList[activerowIndex].EXPDATE =
      value.EXPIRY == null ? "" : value.EXPIRY.toString().substring(0, 10);
    this.TrnMainObj.ProdList[activerowIndex].UNIT = value.UNIT;
    // this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE = value.SRATE;

    this.TrnMainObj.ProdList[activerowIndex].STOCK = value.STOCK;
    this.TrnMainObj.ProdList[activerowIndex].WAREHOUSE = value.WAREHOUSE;
    this.TrnMainObj.ProdList[activerowIndex].BATCHSCHEME = value.SCHEME;
  }

  diffAmountItemForAccount: number = 0;
  diffAmountDrCrType: string = "";
  getAccountWiseTrnAmount(acid: string) {
    if (!acid || acid == null || acid == undefined) return;

    this.diffAmountItemForAccount = 0;
    this.diffAmountDrCrType = "";
    if (this.checkCrAmount == true) {
      // ////console.log("@@MAPID_Is",this.MAPID_Is)
      this.diffAmountIs = 0;
    }
    let companyId = this.authservice.getCurrentCompanyId();

    let requestType = 0;
    if (this.TrnMainObj.VoucherType == 22 || this.TrnMainObj.VoucherType == 23) {
      requestType = 1;
    }
    this.masterService
      .getAccountWiseTrnAmount(
        this.TrnMainObj.TRNDATE.toString(),
        companyId,
        acid,
        this.TrnMainObj.DIVISION
      )
      .subscribe(
        res => {
          if (res.status == "ok") {
            ////console.log("CheckDiffAmt", res)
            this.diffAmountDrCrType = res.result < 0 ? "Cr" : "Dr";
            this.diffAmountItemForAccount = Math.abs(res.result);
            if (this.checkCrAmount == true) {
              ////console.log("@@diffAmountIs1", this.diffAmountIs)
              this.diffAmountIs = res.result;
              ////console.log("@@diffAmountIs2", this.diffAmountIs)
            }
            this.checkCrAmount = false;
          } else {
            this.diffAmountItemForAccount = 0;
            this.diffAmountDrCrType = "";
          }
        },
        error => {
          this.diffAmountItemForAccount = 0;
          this.diffAmountDrCrType = "";
          this.alertService.error(error);
        }
      );
  }
  ReCalculateBillWithNormal() {
    try {
      this.TrnMainObj.TOTAMNT = 0;
      this.TrnMainObj.TOTALINDDISCOUNT = 0;
      this.TrnMainObj.TOTALPROMOTION = 0;
      this.TrnMainObj.TOTALLOYALTY = 0;
      this.TrnMainObj.DCAMNT = 0;
      this.TrnMainObj.ServiceCharge = 0;
      this.TrnMainObj.TAXABLE = 0;
      this.TrnMainObj.NONTAXABLE = 0;
      this.TrnMainObj.VATAMNT = 0;
      this.TrnMainObj.NETWITHOUTROUNDOFF = 0;
      this.TrnMainObj.TotalWithIndDiscount = 0;
      this.TrnMainObj.TOTALDISCOUNT = 0;
      this.TrnMainObj.TOTALQTY = 0;
      this.TrnMainObj.TOTALWEIGHT = 0;
      this.TrnMainObj.ProdList.forEach(prod => {
        console.log("@@(prod.SELECTEDITEM",prod.SELECTEDITEM)

        if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          prod.AMOUNT = this.nullToZeroConverter(prod.Quantity) * this.nullToZeroConverter(prod.MRP);
        }
        else {
          prod.AMOUNT =
            this.nullToZeroConverter(prod.Quantity) *
            this.nullToZeroConverter(prod.ALTRATE);
        }
        prod.WEIGHT =
          this.nullToZeroConverter(prod.CONFACTOR) *
          this.nullToZeroConverter(prod.Quantity) *
          this.nullToZeroConverter(prod.SELECTEDITEM.GWEIGHT);
        if (prod.INDDISCOUNTRATE != null && prod.INDDISCOUNTRATE > 0) {
          prod.INDDISCOUNT =
            Math.round(((prod.AMOUNT * prod.INDDISCOUNTRATE) / 100) * 100) /
            100;
        }
        prod.PrimaryDiscount = prod.BasePrimaryDiscount * prod.Quantity;
        prod.SecondaryDiscount = prod.BaseSecondaryDiscount * prod.Quantity;
        prod.LiquiditionDiscount = prod.BaseLiquiditionDiscount * prod.Quantity;
        let disExcludingFlatDiscount =
          this.nullToZeroConverter(prod.INDDISCOUNT) +
          this.nullToZeroConverter(prod.PROMOTION) +
          this.nullToZeroConverter(prod.LOYALTY) +
          this.nullToZeroConverter(prod.PrimaryDiscount) +
          this.nullToZeroConverter(prod.SecondaryDiscount) +
          this.nullToZeroConverter(prod.LiquiditionDiscount);
        let totalAmt = 0;
        this.TrnMainObj.ProdList.forEach(x => {
          totalAmt +=
            x.AMOUNT -
            this.nullToZeroConverter(x.INDDISCOUNT) -
            this.nullToZeroConverter(x.PROMOTION) -
            this.nullToZeroConverter(x.LOYALTY) -
            this.nullToZeroConverter(x.PrimaryDiscount) -
            this.nullToZeroConverter(x.SecondaryDiscount) -
            this.nullToZeroConverter(x.LiquiditionDiscount);
        });
        prod.FLATDISCOUNT =
          ((prod.AMOUNT - disExcludingFlatDiscount) *
            this.TrnMainObj.TOTALFLATDISCOUNT) /
          totalAmt;
        prod.DISCOUNT =
          this.nullToZeroConverter(disExcludingFlatDiscount) +
          this.nullToZeroConverter(prod.FLATDISCOUNT);
        prod.NCRATE = prod.RATE * prod.EXRATE;
        if (prod.ISVAT == 1) {
          prod.TAXABLE = prod.AMOUNT - prod.DISCOUNT;
          prod.NONTAXABLE = 0;
          prod.VAT = (prod.TAXABLE * prod.GSTRATE) / 100;
        } else {
          prod.TAXABLE = 0;
          prod.NONTAXABLE = prod.AMOUNT - prod.DISCOUNT;
        }
        if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          prod.NETAMOUNT = prod.TAXABLE + prod.NONTAXABLE;
        } else {
          prod.NETAMOUNT = prod.TAXABLE + prod.NONTAXABLE + prod.VAT;
        }
        this.TrnMainObj.TOTAMNT += prod.AMOUNT;
        this.TrnMainObj.TOTALINDDISCOUNT += this.nullToZeroConverter(
          prod.INDDISCOUNT
        );
        this.TrnMainObj.TOTALLOYALTY += this.nullToZeroConverter(prod.LOYALTY);
        this.TrnMainObj.TOTALPROMOTION += this.nullToZeroConverter(
          prod.PROMOTION
        );
        this.TrnMainObj.DCAMNT += this.nullToZeroConverter(prod.DISCOUNT);
        this.TrnMainObj.ServiceCharge += this.nullToZeroConverter(
          prod.SERVICETAX
        );
        this.TrnMainObj.TAXABLE += this.nullToZeroConverter(prod.TAXABLE);
        this.TrnMainObj.NONTAXABLE += this.nullToZeroConverter(prod.NONTAXABLE);
        this.TrnMainObj.VATAMNT += this.nullToZeroConverter(prod.VAT);
        this.TrnMainObj.NETWITHOUTROUNDOFF += this.nullToZeroConverter(
          prod.NETAMOUNT
        );
        this.TrnMainObj.TotalWithIndDiscount += this.nullToZeroConverter(
          prod.TOTAL
        );
        this.TrnMainObj.TOTALDISCOUNT += this.nullToZeroConverter(
          prod.DISCOUNT
        );
        this.TrnMainObj.TOTALQTY += this.nullToZeroConverter(
          prod.Quantity *
          (this.nullToZeroConverter(prod.CONFACTOR) <= 0
            ? 1
            : this.nullToZeroConverter(prod.CONFACTOR))
        );
        this.TrnMainObj.TOTALWEIGHT += this.nullToZeroConverter(prod.WEIGHT);

        if (prod.ISVAT == 0) {
          prod.NETAMOUNT = prod.TAXABLE + prod.NONTAXABLE;
        }
        else {
          prod.NETAMOUNT = prod.TAXABLE + prod.NONTAXABLE + prod.VAT;
        }
        this.TrnMainObj.TOTAMNT += prod.AMOUNT;
        this.TrnMainObj.TOTALINDDISCOUNT += this.nullToZeroConverter(prod.INDDISCOUNT);
        this.TrnMainObj.TOTALLOYALTY += this.nullToZeroConverter(prod.LOYALTY);
        this.TrnMainObj.TOTALPROMOTION += this.nullToZeroConverter(prod.PROMOTION);
        this.TrnMainObj.DCAMNT += this.nullToZeroConverter(prod.DISCOUNT);
        this.TrnMainObj.ServiceCharge += this.nullToZeroConverter(prod.SERVICETAX);
        this.TrnMainObj.TAXABLE += this.nullToZeroConverter(prod.TAXABLE);
        this.TrnMainObj.NONTAXABLE += this.nullToZeroConverter(prod.NONTAXABLE);
        this.TrnMainObj.VATAMNT += this.nullToZeroConverter(prod.VAT);
        this.TrnMainObj.NETWITHOUTROUNDOFF += this.nullToZeroConverter(prod.NETAMOUNT);
        this.TrnMainObj.TotalWithIndDiscount += this.nullToZeroConverter(prod.TOTAL);
        this.TrnMainObj.TOTALDISCOUNT += this.nullToZeroConverter(prod.DISCOUNT);
        this.TrnMainObj.TOTALQTY += this.nullToZeroConverter(prod.Quantity * (this.nullToZeroConverter(prod.CONFACTOR) <= 0 ? 1 : this.nullToZeroConverter(prod.CONFACTOR)));
        this.TrnMainObj.TOTALWEIGHT += this.nullToZeroConverter(prod.WEIGHT);
      });

      this.TrnMainObj.NETAMNT = Math.round(
        this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF)
      );
      this.TrnMainObj.ROUNDOFF =
        this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
    } catch (error) {
      this.alertService.error(error);
    }
  }
  JournalGstListPreparationForSave() {
    if (this.TrnMainObj.gstInfoOfAccount == null) { return; }
    if (this.TrnMainObj.gstInfoOfAccount.GSTLIST == null) { return; }
    if (this.TrnMainObj.gstInfoOfAccount.GSTLIST.length == 0) { return; }
    this.TrnMainObj.JournalGstList = [];
    for (var j of this.TrnMainObj.gstInfoOfAccount.GSTLIST) {
      let JGL = <any>{};
      JGL.GSTRATE = j.GSTRATE;
      JGL.GST = j.GST;
      JGL.REFTRNAC = j.REFTRNAC;
      JGL.PARAC = this.TrnMainObj.gstInfoOfAccount.PARAC;
      JGL.TRNTYPE = this.TrnMainObj.gstInfoOfAccount.TRNTYPE;
      if (this.nullToZeroConverter(JGL.GSTRATE) == 0 || this.nullToZeroConverter(JGL.GST) == 0) {
        JGL.NONTAXABLE = j.AMOUNT;
      }
      else {
        JGL.TAXABLE = j.AMOUNT;
      }
      JGL.GSTMODE = j.GSTMODE;
      JGL.TOTGST = 0;

      this.TrnMainObj.TrntranList.filter(x => x.AccountItem.ACID == this.AppSettings.VATAc).forEach(y => { JGL.TOTGST += this.nullToZeroConverter(y.CRAMNT) + this.nullToZeroConverter(y.DRAMNT) });

      JGL.NETAMNT = this.TrnMainObj.gstInfoOfAccount.NETAMNT;
      JGL.ITC_ELIGIBILITY = j.ITC_ELIGIBILITY;

      this.TrnMainObj.JournalGstList.push(JGL);
    }
  }
  JournalGstITCReversalPreparationForSave() {
    this.TrnMainObj.gstItcReversalList =
      this.TrnMainObj.gstItcReversalList.filter(j => j.ITC_INTEGRATED > 0 || j.ITC_CENTRAL > 0 || j.ITC_STATE > 0 || j.ITC_CESS > 0);
  }
  getAutomationAmount() {

  }
  AutoGstPreparation() {
    this.TrnMainObj.gstInfoOfAccount = <any>{};
    this.partyListFromTrnTranList();
    this.expensesAccountFromTranTranList();
    if (this.EnteredSupplierAcList.length <= 0) {

      return;
    }

    this.TrnMainObj.gstInfoOfAccount.GSTLIST = [];
    this.GSTSETUPOBJ = <any>{};
    let aa = this.EnteredSupplierAcList[0];
    if (aa != null) {
      this.TrnMainObj.gstInfoOfAccount.PARAC = aa.ACID;


      //if(this.nullToZeroConverter(aa.STATE)==this.nullToZeroConverter(this.userProfile.CompanyInfo.STATE))
      //{
      this.TrnMainObj.gstInfoOfAccount.TRNTYPE = aa.PSTYPE;
      // }
      // else
      // {
      //  this.TrnMainObj.gstInfoOfAccount.TRNTYPE = "interstate";
      // }
    }



    this.TrnMainObj.gstInfoOfAccount.TAXABLE
    if (this.TrnMainObj.gstInfoOfAccount.NETAMNT == null || this.TrnMainObj.gstInfoOfAccount.NETAMNT == 0) {
      this.TrnMainObj.gstInfoOfAccount.NETAMNT = 0;
      this.TrnMainObj.TrntranList.forEach(x => { this.TrnMainObj.gstInfoOfAccount.NETAMNT += x.DRAMNT });
    }
    for (let e of this.EnteredExpensesAcList) {
      if (e.isRCMApplicable == 1) { this.TrnMainObj.REVCHARGE = "Y"; }
      else { this.TrnMainObj.REVCHARGE = "N"; }
      let gstObj = <any>{};
      gstObj.GST = this.EnteredGSTList.reduce((sum, x) => sum + (this.nullToZeroConverter(x.GSTAMOUNT)), 0);;
      gstObj.GSTRATE = this.EnteredGSTList.reduce((sum, x) => sum + (this.nullToZeroConverter(x.GSTRATE)), 0);
      gstObj.REFTRNAC = e.ACID;
      gstObj.REFTRNAC_NAME = e.ACNAME;
      var expAc = this.TrnMainObj.TrntranList.filter(x => x.AccountItem != null).filter(y => y.AccountItem.ACID == e.ACID)[0];
      if (expAc != null) {
        gstObj.AMOUNT = this.nullToZeroConverter(expAc.DRAMNT) + this.nullToZeroConverter(expAc.CRAMNT);

      } gstObj.ITC_ELIGIBILITY = null;
      gstObj.GSTMODE = null;
      this.TrnMainObj.gstInfoOfAccount.GSTLIST.push(gstObj);
    }

  }
  partyListFromTrnTranList() {
    this.EnteredSupplierAcList = [];

    this.TrnMainObj.TrntranList.forEach(
      t => {
        if (t.AccountItem != null) {
          if (t.AccountItem.ACID != null) {
            if (t.AccountItem.ACID.substr(0, 2) == "PA") {
              this.EnteredSupplierAcList.push(t.AccountItem);
            }
          }
        }
      });
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
      if (this.TrnMainObj.TRNAC != null && this.TrnMainObj.TRNAC != "") {
        this.EnteredSupplierAcList.push({ ACID: this.TrnMainObj.TRNAC, ACNAME: this.TrnMainObj.TRNACName });
      }
    }
  }
  expensesAccountFromTranTranList() {
    this.EnteredExpensesAcList = [];
    this.EnteredGSTList = [];
    this.TrnMainObj.TrntranList.forEach(
      t => {
        if (t.AccountItem != null) {
          if (t.AccountItem.ACID != null) {
            if (t.AccountItem.ACID.substr(0, 2) != "PA"
              && t.AccountItem.ACID != this.AppSettings.CGST_PAYABLE
              && t.AccountItem.ACID != this.AppSettings.IGST_PAYABLE
              && t.AccountItem.ACID != this.AppSettings.SGST_PAYABLE
              && t.AccountItem.ACID != this.AppSettings.CGST_RECEIVABLE
              && t.AccountItem.ACID != this.AppSettings.IGST_RECEIVABLE
              && t.AccountItem.ACID != this.AppSettings.SGST_RECEIVABLE
              && t.AccountItem.ACID != this.AppSettings.CGST_PAYABLE_RCM
              && t.AccountItem.ACID != this.AppSettings.IGST_PAYABLE_RCM
              && t.AccountItem.ACID != this.AppSettings.SGST_PAYABLE_RCM
              && t.AccountItem.ACID != this.AppSettings.CGST_RECEIVABLE_RCM
              && t.AccountItem.ACID != this.AppSettings.IGST_RECEIVABLE_RCM
              && t.AccountItem.ACID != this.AppSettings.SGST_RECEIVABLE_RCM) {
              this.EnteredExpensesAcList.push(t.AccountItem);
            }
            if (t.AccountItem.ACID == this.AppSettings.CGST_PAYABLE
              || t.AccountItem.ACID == this.AppSettings.IGST_PAYABLE
              || t.AccountItem.ACID == this.AppSettings.SGST_PAYABLE
              || t.AccountItem.ACID == this.AppSettings.CGST_RECEIVABLE
              || t.AccountItem.ACID == this.AppSettings.IGST_RECEIVABLE
              || t.AccountItem.ACID == this.AppSettings.SGST_RECEIVABLE
              || t.AccountItem.ACID == this.AppSettings.CGST_PAYABLE_RCM
              || t.AccountItem.ACID == this.AppSettings.IGST_PAYABLE_RCM
              || t.AccountItem.ACID == this.AppSettings.SGST_PAYABLE_RCM
              || t.AccountItem.ACID == this.AppSettings.CGST_RECEIVABLE_RCM
              || t.AccountItem.ACID == this.AppSettings.IGST_RECEIVABLE_RCM
              || t.AccountItem.ACID == this.AppSettings.SGST_RECEIVABLE_RCM) {
              this.EnteredGSTList.push(t.AccountItem);
            }
          }
        }
      }
    );
  }


  budgetCalculation(index) {
    this.TrnMainObj.TAXABLE = 0;
    this.TrnMainObj.NONTAXABLE = 0;
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
      this.TrnMainObj.TrntranList.forEach(x => {
        if(x.ISTAXABLE==0){
          this.TrnMainObj.NONTAXABLE += x.DRAMNT == null ? null : x.DRAMNT;
        }else{
          this.TrnMainObj.TAXABLE += x.DRAMNT == null ? null : x.DRAMNT;
        }
      });
      // this.TrnMainObj.TAXABLE = this.nullToReturnZero(this.TrnMainObj.TOTAMNT) -
      //   this.nullToReturnZero(this.TrnMainObj.DCAMNT) -
      //   this.nullToReturnZero(this.TrnMainObj.NONTAXABLE);
      // this.TrnMainObj.TAXABLE = this.formatetoTwoDecimal(this.TrnMainObj.TAXABLE);
      this.TrnMainObj.VATAMNT = (this.TrnMainObj.TAXABLE * 0.13);
      //this.TrnMainObj.VATAMNT = this.formatetoTwoDecimal(this.TrnMainObj.VATAMNT); 
      this.TrnMainObj.VATAMNT = Math.round((this.TrnMainObj.VATAMNT + Number.EPSILON) * 100) / 100;
      this.TrnMainObj.NETAMNT = this.nullToReturnZero(this.TrnMainObj.TAXABLE) + this.nullToReturnZero(this.TrnMainObj.VATAMNT) + this.nullToReturnZero(this.TrnMainObj.NONTAXABLE);
      this.totalDRAmount = this.nullToReturnZero(this.TrnMainObj.TOTAMNT) + this.nullToReturnZero(this.TrnMainObj.VATAMNT);
    }

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
    this.creditList.push(newRow);

  }


  formatetoTwoDecimal(formatValue) {
    if (typeof formatValue == 'number' || typeof formatValue == 'string') {
      formatValue = Number(formatValue);
      return formatValue = formatValue.toFixed(2);
    } else {
      formatValue = 0
      return formatValue = formatValue.toFixed(2);
    }

  }
  preventNavigation() {
    // ////console.log("ChecksaveChanges", this.saveChanges)
    if (!this.saveChanges) {
      // ////console.log("@@show alert")
      this.preventNavigationService.preventNavigation(true);
    } else {
      // ////console.log("@@donot show alert")
      this.preventNavigationService.preventNavigation(false);
    }
  }

  transformDate(date) {
    return moment(date).format('YYYY-MM-DD')
  }
  CheckMenuRights(activePage, mode) {
    console.log("@@activePage",activePage)
    console.log("@@mode",mode)
    var Checkright = this.authservice.getMenuRight(activePage, mode)
    if (Checkright != null) {
      if (Checkright.right != true) {
        this.alertService.warning("You are not authorized to " + mode + " the " + activePage);
        return false;
      }
      else {
        return true;
      }
    }
  }

  subtractDates(date1, date2) {
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }

  transformDatetoMMddYY(date) {
    return moment(date).format('MM/DD/YYYY')
  }

  reverseEntry(voucherType:VoucherTypeEnum){
    this.TrnMainObj.guid = uuid();
  }

  rowBackGrounColor(i) {
    let color = this.TrnMainObj.ProdList[i].backgroundcolor;
    if (color == null || color == "") {
      color = "white";
    }
    return color;
  }

}

export interface ProdListMode {
  mode: string;
  selectedRow: TrnMain;
}
