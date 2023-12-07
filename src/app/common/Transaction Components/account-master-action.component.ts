import { AdditionalCostService, prodCost } from "../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { TransactionService } from "./transaction.service";

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  ElementRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
//import {TAcList} from '../../../../common/interfaces';
import { TrnMain, VoucherTypeEnum, Trntran, IMPORT_DETAILS, IMPORT_DETAILS_PROD, BillTrack } from "../interfaces/TrnMain";
import { FormGroup, FormControl } from "@angular/forms";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService, AppSettings } from "../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { PrintInvoiceComponent } from "../Invoice/print-invoice/print-invoice.component";
import * as _ from "lodash";
import { TAcList, TDSModel } from "../interfaces";
import { ModalDirective } from "ng2-bootstrap";
import { VoucherTrackingComponent } from "../../pages/AccountVoucher/components/VoucherTracking/VoucherTracking.component";
import { AlternateUnitTabComponent } from "../../pages/masters/components/ProductMaster/AlternateUnitTabComponent";
import { HttpUrlEncodingCodec } from "@angular/common/http";
import { importdocument } from "../interfaces/AddiitonalCost.interface";
import * as moment from 'moment';
import { ReverseEntryComponent } from "../popupLists/reverse-entry-popup/reverse-entry.component";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../popupLists/file-uploader/file-uploader-popup.component";

@Component({
  selector: "account-master-action",
  templateUrl: "./account-master-action.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class AccountMasterActionComponent implements OnInit {
  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";
  public activeurlpath: string;
  // public activeurlpath2:string;
  public activeUrlPage: string;


  //TrnMainObj: TrnMain = <TrnMain>{};

  form: FormGroup;
  AppSettings: AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};
  serverDate: any;

  savedVchrno: any;
  filename: any;
  rownumber: any;
  numtowords: any;
  showVoucherReplicateButton: boolean;
  isValueLoaded = false;
  gettingMessage: any;
  FromPostDate: any;
  ToPostDate: any;
  FromCashCollectionDate: any;
  ToCashCollectionDate: any;
  showPrintReceipt:boolean;
  showPrintPayslip:boolean;
  PartyID:any;
  PartyName:any;
  addNewUnit: boolean = false;
  Voucher_Type:any;
  PDC_LoadedClick:boolean;
  savedTrntrnlist:any[]=[];
  CashCollectionList: any[] = [];
  isCashCollecValueLoaded = false;
  filter:any

  @Output() onViewClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveClickedEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBillTrackEmit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('DeleteAcc') DeleteAcc: ModalDirective;
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  @ViewChild("voucherTrack") VoucherTracking: VoucherTrackingComponent;
  @ViewChild('ShowDate') ShowDate: ModalDirective;
  @ViewChild("genericGridReverse") genericGridReverse: GenericPopUpComponent;

  returnUrl: string;
  checkstatus = true;
  viewSubscription: Subscription = new Subscription();
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupReverseSettings: GenericPopUpSettings = new GenericPopUpSettings();

  showSecondaryButtons: boolean;
  gridPopupSettingsForHoldBill: GenericPopUpSettings = new GenericPopUpSettings();
  trialUrl: boolean = false;
  showUnApprove: boolean = false;
  showgstsetuponAccount: boolean = false;
  showgstItcReversalPopup: boolean = false;
  vouchernois: any;
  division: any;
  phiscalid: any;
  paymentmode: any;
  isActive: boolean = false;
  CashCollActive:boolean=false;
  savedtrnmode:any;
  showReverseEntryAuth: boolean = false;
  reverseEntryAuthObj = {
    username: "",
    password: "",
  };

  remarksfordeleteObj = {
      voucherno: '',
      remarks: '',
  }



  @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
  gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
  
  @ViewChild("genericGridPartyLedger") genericGridPartyLedger: GenericPopUpComponent;
  gridPopupSettingsForPartyLedgerList: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridReverseView") genericGridReverseView: GenericPopUpComponent;
  gridPopupSettingsForReverse: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("reverseEntryConfirm") reverseEntryConfirm: ReverseEntryComponent;
  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    public additionalCostService: AdditionalCostService,
    public authservice: AuthService,
    public dialog: MdDialog,
    private router: Router,
    private arouter: ActivatedRoute,
    private alertService: AlertService,
    private _hotkeysService: HotkeysService,
    private loadingService: SpinnerService,
    public invoicePrint: PrintInvoiceComponent,
    public _additionalCostService: AdditionalCostService

  ) {
    //this.TrnMainObj = _trnMainService.TrnMainObj;
    this.activeurlpath = this.arouter.snapshot.url[0].path;
    let currentPath = arouter.snapshot.url.join('');
    this.activeUrlPage = this.arouter.snapshot.url[1].path
    ////console.log("activeUrlPage", this.arouter.snapshot.url[1].path)
    this.masterService.ShowMore = false;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
    this._trnMainService.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this._trnMainService.TrnMainObj.PhiscalID = this._trnMainService.PhiscalObj.PhiscalID;
    this._trnMainService.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.showSecondaryButtons = false;
    this.userSetting = authservice.getSetting()
    this.masterService.refreshTransactionList();
    if (
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
    ) {
      this.transactionType = "creditnote";
    }
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.AdditionalCost) {
      this._trnMainService.TrnMainObj.VoucherPrefix = 'AD'
    }
    // ////console.log("CheckValue@a", this._trnMainService.TrnMainObj)
    this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings(
      this._trnMainService.TrnMainObj.VoucherPrefix, this._trnMainService.TrnMainObj.VoucherPrefix
    );
    this.getCurrentServerDate();
    this.masterService.addnMode = 'NEW'


  }

  inputDisabled: boolean;
  ngOnInit() {
    this.arouter.queryParams.subscribe(params => {
      if (params['mode'] == "DRILL" && params['returnUrl']) {
        let activeurlpath = params['returnUrl']
        let abcd = '/pages/financialreports/account-ledger-reports/'
        this.returnUrl = abcd + activeurlpath;
      } else {
        this.returnUrl = "/pages/dashboard/dashboard";
        this.inputDisabled = false
      }
    });
    // this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
    // {
    //   title: "Import Account opening Balance",
    //   uploadEndpoints: `/importJsonFileForTransaction`,
    //   allowMultiple: false,
    //   acceptFormat: ".json",
    //   note: `
    // <P>You can supply Dr or Cr Balance in a csv format for quick importing</p>
    // <ul>
    //    <li>Enter Dr or Cr balance Only </li>
    //    <li>Do not change the accounts name</li>
    // </ul> 
    // `,
    //   filename: `ErrorJson.json`
    // });
  }


  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
      this.alertService.error(ex)
    }
  }

  getCurrentServerDate() {
    this.masterService.getCurrentDate().subscribe((res: any) => {
      this.serverDate = res && res.Date ? res.Date : new Date();

    }, err => { });
  }




  onCloseClicked() {
    this.router.navigate(["/pages/dashboard"]);
  }

  onViewClicked() {
    this.masterService.addnMode = 'VIEW'
    this.inputDisabled = true;
    this._trnMainService.replicateVoucher = false;
    this.showVoucherReplicateButton = false;
    // this._trnMainService.TrnMainObj.Mode = "VIEW";
    this._trnMainService.buttonClickMode = "VIEW";
    this._trnMainService.showAddCosting = false;

    //console.log("@@.INVOICETYPE",this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE)
    //console.log("@@.VoucherType", this._trnMainService.TrnMainObj.VoucherType,this.activeUrlPage)

    if((this._trnMainService.TrnMainObj.AdditionalObj && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'REVERSE') || this.activeUrlPage=='credit-note'){
      this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = '';
      this._trnMainService.TrnMainObj.VoucherPrefix="CN";
      this._trnMainService.TrnMainObj.VoucherAbbName="CN";
      this._trnMainService.TrnMainObj.VoucherType=VoucherTypeEnum.CreditNote;
      this._trnMainService.initialFormLoad(15);
    }

    if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "cnlistforview");
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "dnlistforview");
    }
    else if (this._trnMainService.TrnMainObj.VoucherType == 12) {
      this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings(
        this._trnMainService.TrnMainObj.VoucherPrefix, this._trnMainService.TrnMainObj.VoucherPrefix,"journal");
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "journal");
    }

    else {
      this.genericGrid.show();

    }
    if (this.userSetting.ENABLEVOUCHERSERIES == 0) {
      //console.log("CheckVlaue#",this._trnMainService.TrnMainObj,this._trnMainService.prefix)
      this.masterService.getGenericGridPopUpSettings(
        this._trnMainService.TrnMainObj.VoucherPrefix, this._trnMainService.TrnMainObj.VoucherAbbName
      );
    }



  }



  //for print
  public promptPrintDevice: boolean = false
  promptPrintDeviceAfterSave: boolean = false
  public printControl = new FormControl(0)


  setPrinterAndprint() {
    this.promptPrintDevice = false;
    this.userProfile.PrintMode = this.printControl.value
    if (this.userProfile.PrintMode == 1) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {
        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNAC).subscribe((res) => {
          // this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix)
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix);
          this.loadingService.hide()
        }, err => {
          this.alertService.error(err)
        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    } else if (this._trnMainService.TrnMainObj.VoucherType == 12 && this.userProfile.PrintMode == 2) {
      if (this._trnMainService.TrnMainObj.REVCHARGE == 'Y') {
        try {
          this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC).subscribe((res) => {
            this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix, "", 1, true)
            this.loadingService.hide()
          }, err => {
            this.alertService.error(err)
          })
        } catch (ex) {
          this.alertService.error(ex)
        }
      } else {
        this.promptPrintDevice = false;
        this.alertService.error("Please load RCM Entry for Self Invoice");
      }
    }
  }


  onClickNo() {

  }
  changeCursor: boolean;
  onPrintClicked() {
    // if (this._trnMainService.TrnMainObj.TrntranList.length > 0) {
    //   this.promptPrintDevice = true;
    // } else {
    //   this.alertService.warning("No voucher Found for Printing");
    // }
    this._trnMainService.replicateVoucher = false;
    this.showVoucherReplicateButton = false;
    ////console.log("@@VoucherPrefix", this._trnMainService.TrnMainObj.VoucherPrefix)
    //console.log("2this.userProfile.CompanyInfo.COMPANYID",this.userProfile.CompanyInfo.COMPANYID)
    //console.log('VAT', this.userProfile.CompanyInfo.VAT);
    let vat = this.userProfile.CompanyInfo.VAT;
    let VATresult = vat.split("");
    let voucherprefix= this._trnMainService.TrnMainObj.VoucherPrefix;
    let TRNMODE= this._trnMainService.TrnMainObj.TRNMODE;
    //console.log("VoucherPrefix",this._trnMainService.TrnMainObj.VoucherPrefix)
    if(this._trnMainService.TrnMainObj.VoucherPrefix == 'PC'){
      //console.log("TRNMODE",TRNMODE)
      if(TRNMODE == 'Party Receipt'){
        voucherprefix= 'PC-Receipt';
      }if(TRNMODE == 'Party Payment' || TRNMODE == 'Expenses Voucher'){
        voucherprefix= 'PC-Payment';
      }
    }

    this.masterService.getPrintFileName(voucherprefix).subscribe((res) => {
      if (res.status == "ok") {
        this.filename = res.result ? res.result[0].FileName : '';
        this.rownumber = res.result ? res.result[0].RowsNumber : 0;

        this.changeCursor = true;
        //console.log('vchrno', this._trnMainService.TrnMainObj.VCHRNO);
        //console.log('initial', this.userProfile.CompanyInfo.INITIAL);
        //console.log('psyid', this.masterService.PhiscalObj.PhiscalID);
        //console.log('cmpid', this.userProfile.CompanyInfo.COMPANYID);
        //console.log('name', this.userProfile.CompanyInfo.NAME);
        //console.log('address', this.userProfile.CompanyInfo.ADDRESS);



        this.masterService.getNumberToWords(this._trnMainService.TrnMainObj.VCHRNO, this.userProfile.CompanyInfo.INITIAL, this.masterService.PhiscalObj.PhiscalID, this.userProfile.CompanyInfo.COMPANYID,this._trnMainService.TrnMainObj.TRNMODE).subscribe(
          (res) => {
            if (res.status == "ok") {
              this.numtowords = res.result ? res.result[0].NUMTOWORDS : '';
              ////console.log("@@numtowords", this.numtowords);

              let userdivision = this.userProfile.userDivision ? this.userProfile.userDivision : this.userProfile.CompanyInfo.INITIAL;
              let ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
              let BRANCHNAME = this.userProfile.CompanyInfo.INITIAL;
              this.masterService.getDetailsByUserDivision(userdivision).subscribe((res: any) => {
                if (res.status == "ok") {
                  if (res.result && res.result.length > 0 && res.result[0] && res.result[0].COMADD) {
                    ADDRESS = res.result[0].COMADD;
                  }
                  if (ADDRESS === null || ADDRESS === undefined || ADDRESS === '') {
                    ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
                  }
                  if (res.result && res.result.length > 0 && res.result[0] && res.result[0].BRANCHNAME) {
                    BRANCHNAME = res.result[0].BRANCHNAME;
                  }
                  if (BRANCHNAME === null || BRANCHNAME === undefined || BRANCHNAME === '') {
                    BRANCHNAME = this.userProfile.CompanyInfo.INITIAL;
                  }

                  let pdfPrintFormatParameters: any = <any>{}
                  pdfPrintFormatParameters.filename = this.filename;
                  pdfPrintFormatParameters.rownumber = this.rownumber;
                  pdfPrintFormatParameters.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
                  pdfPrintFormatParameters.NAME = this.userProfile.CompanyInfo.NAME;
                  pdfPrintFormatParameters.ADDRESS = ADDRESS ? ADDRESS : ' ';
                  pdfPrintFormatParameters.INITIAL = this.userProfile.CompanyInfo.INITIAL;
                  pdfPrintFormatParameters.PhiscalID = this.userProfile.CompanyInfo.PhiscalID,
                  pdfPrintFormatParameters.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
                  pdfPrintFormatParameters.phone1 = this.userProfile.CompanyInfo.TELA?this.userProfile.CompanyInfo.TELA:' ';
                  pdfPrintFormatParameters.phone2 = this.userProfile.CompanyInfo.TELB?this.userProfile.CompanyInfo.TELB:' ';
                  pdfPrintFormatParameters.EMAIL = this.userProfile.CompanyInfo.EMAIL?this.userProfile.CompanyInfo.EMAIL:' ';
                  pdfPrintFormatParameters.numtowords = this.numtowords ? this.numtowords : ' ';
                  pdfPrintFormatParameters.panno1 = VATresult[0] ? VATresult[0] : ' ';
                  pdfPrintFormatParameters.panno2 = VATresult[1] ? VATresult[1] : ' ';
                  pdfPrintFormatParameters.panno3 = VATresult[2] ? VATresult[2] : ' ';
                  pdfPrintFormatParameters.panno4 = VATresult[3] ? VATresult[3] : ' ';
                  pdfPrintFormatParameters.panno5 = VATresult[4] ? VATresult[4] : ' ';
                  pdfPrintFormatParameters.panno6 = VATresult[5] ? VATresult[5] : ' ';
                  pdfPrintFormatParameters.panno7 = VATresult[6] ? VATresult[6] : ' ';
                  pdfPrintFormatParameters.panno8 = VATresult[7] ? VATresult[7] : ' ';
                  pdfPrintFormatParameters.panno9 = VATresult[8] ? VATresult[8] : ' ';
                  pdfPrintFormatParameters.VoucherPrefix = this._trnMainService.TrnMainObj.VoucherPrefix;
                  pdfPrintFormatParameters.PRINTBY = this.userProfile.username ? this.userProfile.username : ' ';
                  pdfPrintFormatParameters.COMPANYVAT = vat?vat:this.userProfile.CompanyInfo.VAT;
                  pdfPrintFormatParameters.BRANCHNAME = BRANCHNAME?BRANCHNAME:' ';

                  this.masterService.getAllInvoiceData(pdfPrintFormatParameters).subscribe(
                    (res) => {
                      ////console.log("pdfresponse", res);

                      const blobUrl = URL.createObjectURL(res.content);
                      const iframe = document.createElement('iframe');
                      iframe.style.display = 'none';
                      iframe.src = blobUrl;
                      document.body.appendChild(iframe);
                      iframe.contentWindow.print();
                      this.changeCursor = false;
                      //console.log("@@VoucherType,",this._trnMainService.TrnMainObj.VoucherType,this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE)
                      if(this._trnMainService.TrnMainObj.AdditionalObj && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'REVERSE'){
                        this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = '';
                        this._trnMainService.initialFormLoad(15);
                        this._trnMainService.TrnMainObj.VoucherPrefix="CN";
                        this._trnMainService.TrnMainObj.VoucherAbbName="CN";
                        this._trnMainService.TrnMainObj.VoucherType=VoucherTypeEnum.CreditNote;
                      }

                    },error=>{
                      this.alertService.info("Issue in print file.");
                      this.changeCursor = false;
                    }
                  )
                }


              })



            }
          })


      }

    })
    this.changeCursor = false;

  }



  print(printStr: string) {
    var ws;
    ws = new WebSocket("ws://127.0.0.1:1660");
    ws.addEventListener("message", ws_recv, false);
    ws.addEventListener("open", ws_open(printStr), false);
    function ws_open(text) {
      alert("Are you sure to print?");
      ws.onopen = () => ws.send(text);
      // ws.send(text);
    }

    function ws_recv() {
      alert("2 : success");
    }
  }
  AddDebit(i) {

    let x: Trntran = <Trntran>{};

    x.A_ACID = i.costAc.ACID;
    x.B_ACID = i.creditAc.ACID;
    x.AccountItem = i.costAc;
    x.DRAMNT = i.amount;
    x.CRAMNT = 0;
    x.PartyDetails = [];
    x.ROWMODE = "new";
    x.inputMode = true;
    x.acitem = i.costAc;
    x.NARATION = i.remarks;
    x.Ref_BILLNO = i.Ref_BILLNO;
    x.Ref_TRNDATE = i.Ref_TRNDATE;
    x.Ref_SupplierName = i.Ref_SupplierName;
    x.TDSAmount = i.TDSAmount;
    x.TDSAccount_ACID = i.TDSAccount_ACID;
    x.AdditionalDesc = i.AdditionalDesc;
    x.AdditionalVAT = i.AdditionalVAT;
    x.IsTaxableBill = i.IsTaxableBill;
    x.DoAccountPosting = i.DoAccountPosting==0?0:1;
    x.OppAcid=i.Ref_SupplierACID;
    x.OPPREMARKS=i.amount;
    x.IS_ECA_ITEM=i.IS_ECA_ITEM==1?1:0;
    x.SL_ACID=i.DR_SL_ACID?i.DR_SL_ACID:null;
    x.TDS_SL_ACID=i.TDS_SL_ACID?i.TDS_SL_ACID:null;


    this.masterService.AdditionalCostTrnTran.push(x);
  }

  AddCredit(i) {

    let y: Trntran = <Trntran>{};

    y.A_ACID = i.creditAc.ACID;
    y.B_ACID = i.costAc.ACID;
    y.AccountItem = i.creditAc;
    y.DRAMNT = 0;
    y.CRAMNT = i.amount;
    y.PartyDetails = [];
    y.ROWMODE = "new";
    y.inputMode = true;
    y.acitem = i.creditAc;
    y.DoAccountPosting = i.DoAccountPosting==0?0:1;
    y.OppAcid=i.Ref_SupplierACID;
    y.OPPREMARKS=i.amount;
    y.SL_ACID=i.CR_SL_ACID?i.CR_SL_ACID:null;
    y.TDS_SL_ACID=i.TDS_SL_ACID?i.TDS_SL_ACID:null;
    this.masterService.AdditionalCostTrnTran.push(y);

  }
  onSaveClicked() {

    if (this.userProfile.CompanyInfo.FYClose == 1) {
      this.alertService.warning("Fiscal Year Book '" + this.masterService.PhiscalObj.PhiscalID + "' is already closed! Hence, Cannot do further transaction")
      return;
    }


    this.showVoucherReplicateButton = false;
    this._trnMainService.replicateVoucher = false;

    // ////console.log("this._trnMainService.TrnMainObj.TrntranList", this.voucherType, this._trnMainService.TrnMainObj.TrntranList)

    // ////console.log("vchrnInfo", this.voucherType, this.masterService.AdditionalCostTrnTran)
    if (this.voucherType == 66)//AdditionalCost
    {
      // //console.log("CheckValue",this._additionalCostService.costdetail,this._additionalCostService.addtionalCostList)
      // this._additionalCostService.costdetail = [];
      // this._additionalCostService.addtionalCostList = [];
      this._trnMainService.disableSaveButton=true; //Disable Save Button
      if (this._additionalCostService.costdetail.length == 0) {
        this.alertService.warning("Costing Details cannot be Empty!");
        this._trnMainService.disableSaveButton=false; //Enable Save Button
        return;
      }

      if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == null) {
        this.alertService.warning("Cannot detect Refbillno! Please verify vchrno and Refbill");
        this._trnMainService.disableSaveButton=false; //Enable Save Button
        return;
      }
      this.masterService.AdditionalCostTrnTran=[];
      // this.additionalCostService.IndividualCostList=[];
      if (this._additionalCostService.costList) {
        for (let i of this._additionalCostService.costList) {
          this.AddDebit(i);
          this.AddCredit(i);
          // if (i.IND_DATA && i.IND_DATA.length > 0) {
          //   this.AddIndAdditionalData(i);
          // }
        }
      }
      if (this.masterService.AdditionalCostTrnTran) {

        this._trnMainService.TrnMainObj.TrntranList = [];
        this._trnMainService.TrnMainObj.TrntranList = this.masterService.AdditionalCostTrnTran

      }
      else {
        this.alertService.warning("Accounting for Additional Cost is not preprared!");
        this._trnMainService.disableSaveButton=false; //Enable Save Button
        return;
      }
      if (this.additionalCostService.addtionalCostList.length==0) {
        this.alertService.warning("Costing is not prepared!");
        this._trnMainService.disableSaveButton=false; //Enable Save Button
        return;
      }
      else {

        var arrayLength = this._additionalCostService.costdetail.length;
        for (let i of this._additionalCostService.costList) {

          // vat re =100 i
          var sum = 0;
          var countno = 0
          for (let x of this.additionalCostService.costdetail) {
            if (Object.keys(x).indexOf(i.costAc.ACNAME) > -1) {
              countno += 1
              sum += x[i.costAc.ACNAME]
              // if (countno == arrayLength) {
              //   if (sum != i.amount) {
              //     var r = (i.amount - sum)
              //     //console.log("AmountNotMatch",r)
              //     x[i.costAc.ACNAME] = Math.round(x[i.costAc.ACNAME] + r);
              //   }
              // }

              // if(sum != i.amount){
              //   var r = (i.amount - sum)
              // if(r >=1 || r<=-1){
              //   this.alertService.warning("Total Costing donot match with Additional Cost amount - "+i.costAc.ACNAME)
              // }
              // else{
              // x[i.costAc.ACNAME] = Math.round(x[i.costAc.ACNAME] + r);
              // //console.log("Checkvalue",x[i.costAc.ACNAME],sum)
              // }
              // }
            }

          }



        }

        
        this._trnMainService.TrnMainObj.AdditionalCostJson = JSON.stringify(this.additionalCostService.costdetail)
        this._trnMainService.TrnMainObj.ImportDocument = this.masterService.importDocumentDetailsObj;
        this._trnMainService.TrnMainObj.IMPORTDETAILS = this.additionalCostService.IMPORTDETAILS;
        // this._trnMainService.TrnMainObj.importDocument.SUPPLIER = this.masterService.RefObj.SupplierName;

      }

      if(this.additionalCostService.IndividualCostList.length>0){
        this._trnMainService.TrnMainObj.IndividualCostList=this.additionalCostService.IndividualCostList;
      }
      // return;
      // this._trnMainService.TrnMainObj = <TrnMain>{};
      // this._trnMainService.TrnMainObj.costList = this.additionalCostService.costList;
      // this._trnMainService.TrnMainObj.addtionalCostList =this.additionalCostService.addtionalCostList
      // this.additionalCostService.costdetail = [];
      // this.masterService.AdditionalCostTrnTran = [];
      // this.masterService.importDocumentDetailsObj  =<importdocument>{}
      // this.masterService.RefObj = <any>{};
      // ////console.log("xxa",this.additionalCostService.costdetail,this.additionalCostService.costList,this.additionalCostService.header)
      this._trnMainService.TrnMainObj.REFBILL = this.masterService.RefObj.Refno;
      this._trnMainService.TrnMainObj.REFORDBILL = this.masterService.RefObj.InvoiceNo;
      this._trnMainService.TrnMainObj.BILLTO = this.masterService.RefObj.SupplierName;
      //console.log("@@this.masterService.RefObj.PURCHASE_TYPE",this.masterService.RefObj.PURCHASE_TYPE)
      this._trnMainService.TrnMainObj.PURCHASETYPE = this.masterService.RefObj.PURCHASE_TYPE;
    }
    // return;
    if (this._trnMainService.TrnMainObj.Mode == "NEW" || this._trnMainService.TrnMainObj.Mode == "EDIT") {
      // if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == "" || this._trnMainService.TrnMainObj.REFBILL == undefined) {
      //   this.alertService.error("Please provide Refbill.");
      //   return;
      // }

      if (this._trnMainService.TrnMainObj.VoucherType == 64) {
        this._trnMainService.TrnMainObj.AdditionTranList = [];
        let item = 0;
        for (let i of this._trnMainService.creditList) {
          this._trnMainService.TrnMainObj.AdditionTranList.push(this._trnMainService.creditList[item]);
          item++;
        }

      }

      if (this._trnMainService.TrnMainObj.VoucherType == 17) {
        this._trnMainService.TrnMainObj.RETTO = "Payment Voucher";
      }

      if (this._trnMainService.TrnMainObj.VoucherType == 65) {
        this._trnMainService.TrnMainObj.RETTO = "SINGLE PAYMENT";
      }
      //console.log("ENABLETDSTRACKING",this.userSetting.ENABLETDSTRACKING)
      if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal ) {
        if (!this.TDSValidationInJournal()) return;
      }
      // ////console.log("first tranlist", this._trnMainService.TrnMainObj.TrntranList);

      // if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == "" || this._trnMainService.TrnMainObj.REFBILL == undefined) {
      //   this.alertService.error("Please provide Refbill.");
      //   return;
      // }
      if (!this.SubLedgerValidation()) { return }
      for(let i of this._trnMainService.TrnMainObj.TrntranList){
        if(i.acitem){
        if(i.acitem.ACNAME==null||i.acitem.ACNAME==''||i.acitem.ACNAME==undefined){
          alert("Ledger Account  is Required");
        return;
        }
      }
      if (
        i.acitem && 
        ((i.DRAMNT == 0 || i.DRAMNT == null) &&
          (i.CRAMNT == 0 || i.CRAMNT == null))
      ) {
        alert("Debit Amount or Credit Amount is Required ");
        return;
      }
    }
      //console.log("@@beforesubmit1", this.voucherType, this._trnMainService.TrnMainObj.TrntranList)



      if (this.masterService.userSetting.ENABLE_BUDGETCONTROL==1 &&
        (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost)
      ) {
        var result = this._trnMainService.TrnMainObj.TrntranList.filter(
          (elem1, i) => this._trnMainService.TrnMainObj.TrntranList.some(
            (elem2, j) => (elem2.AccountItem.ACID === elem1.AccountItem.ACID) &&
             (elem2.BUDGETNAME === elem1.BUDGETNAME) && j !== i));
        if(result && result.length==0){ //to remove dup acid message if dup doesnot exist
          this._trnMainService.dupacid_budget_error_message="";
        }
        if(this._trnMainService.budgetexceed_error_message=="" && 
        this._trnMainService.dupacid_budget_error_message==""){
          setTimeout(()=>{
            this.onSubmit();
          },0)
       //return;
        }else{
          if(this._trnMainService.dupacid_budget_error_message!=""){
            this.alertService.info(this._trnMainService.dupacid_budget_error_message);
           return;
          }
          if(this._trnMainService.budgetexceed_error_message!=""){
            this.alertService.info(this._trnMainService.budgetexceed_error_message);
            if(this._trnMainService.BUDGET_STATUS=="STOP"){
              return;
            }else{
              setTimeout(()=>{
                this.onSubmit();
              },2000)
            }
            // return;
          }
        }
      }
      else{
        setTimeout(()=>{
          this.onSubmit();
        },0)
      }

   


     
    } else {
      this.alertService.warning("Cannot Save in View Mode")
    }


  }
  saveTdsPopup() {
    this.showTDSDetailPopup = 0;
    this.onSubmit();

  }
  TDSValidationInJournal() {
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal) {
      //console.log("TrntranList",this._trnMainService.TrnMainObj.TrntranList)
     for(let i of this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.A_ACID!=null)){
      if(i.acitem.PARENT == this.masterService.userSetting.TDS_PAYABLE || i.acitem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE){
        //console.log("...TDS-TRACKING...")
        if(i.OppAcid == null){
          var index=this._trnMainService.TrnMainObj.TrntranList.indexOf(i)
          this.alertService.warning("TDS DETAIL INFORMATION IS MISSING FOR TDS A/C"+"'"+i.acitem.ACNAME +"'(SN NO"+(index+1)+")")
          return false;
        }
        if(i.OPPREMARKS == null){
          this.alertService.warning("TDS Base amount cannot be empty")
          return false;
        }
      }
     }
       
    }
    return true;
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal) {
      //console.log("CheckValue", this._trnMainService.TrnMainObj.TrntranList)
      let index = this._trnMainService.TrnMainObj.TrntranList.findIndex( x => x.A_ACID == null);
      //console.log("INDEXXXX", index);
      this._trnMainService.TrnMainObj.TrntranList.splice(index,1);
      
      var countTDSReceivable = 0;
      var countTDSPayable = 0
      var isTDSPayable = 0;

      this._trnMainService.TrnMainObj.TrntranList.forEach(x => {
        if (x.AccountItem) {
          if (x.acitem.PARENT == this.masterService.userSetting.TDS_PAYABLE) {
            countTDSPayable++
            isTDSPayable = 1;
          }

          if (x.acitem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE) {
            countTDSReceivable++
            isTDSPayable = 0;

          }
        }

      });
      
     
      if (countTDSReceivable == 1 && countTDSPayable == 1) {
        this.MixTDSButSingle(isTDSPayable);
        return false;
      }
      else if (countTDSReceivable == 1 || countTDSPayable == 1) {
        this.OneTDS_MultiParty_JV(isTDSPayable);
        return false;
        //console.log("Checcccc", this.FinalCrTDSObj, this.FinalDrTDSObj)
      }
      else if (countTDSReceivable > 1 || countTDSPayable > 1) {
        if (this.MoreThanOneTds_JV()) return true;
        else return false;
      }
      else{
        return true;
      }
      
     
   
    }
  }
  showTDSDetailPopup = 0;
  finalCreditList = [];
  finalDebitList = [];
  FinalCrTDSObj: any;
  FinalDrTDSObj: any;
  MixTDSButSingle(isTDSPayable) {
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal) {
      var getCrPartyList = [];
      var getDrPartyList = [];
      this.finalDebitList = [];
      this.finalCreditList = [];
      this.FinalDrTDSObj = this._trnMainService.TrnMainObj.TrntranList.filter(x => x.acitem.PARENT == this.masterService.userSetting.TDS_PAYABLE)[0]
      this.FinalCrTDSObj = this._trnMainService.TrnMainObj.TrntranList.filter(x => x.acitem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE)[0]
      var count = 0;
      for (let i of this._trnMainService.TrnMainObj.TrntranList) {
        if (i.AccountItem) {

          if (i.CRAMNT != null || i.CRAMNT != 0) {
            if (i.acitem.ACID.substring(0, 2) == 'PA') {
              getCrPartyList.push(i);
              //console.log("CHeckListCr", getCrPartyList)
              this.showTDSDetailPopup = 1;
              count++;
            }

          }
        }





      }

      var count = 0;
      for (let i of this._trnMainService.TrnMainObj.TrntranList) {
        if (i.AccountItem) {

          if (i.DRAMNT != null || i.DRAMNT != 0) {
            if (i.acitem.ACID.substring(0, 2) == 'PA') {
              getDrPartyList.push(i);
              //console.log("CHeckListCr", getDrPartyList)
              this.showTDSDetailPopup = 1;
              count++;
            }

          }
        }




      }
      if (getCrPartyList.length > 0) {

        for (let i of getCrPartyList) {
          if (i.CRAMNT) {
            let a = <any>{};
            let b = <any>{};
            a.ACID = i.acitem.ACID;
            a.ACNAME = i.acitem.ACNAME;
            a.CRAMNT = i.CRAMNT;
            a.DRAMNT = 0;
            a.isCheck = false;
            this.finalCreditList.push(a);
            //console.log("checkValue&&", this.finalCreditList)
          }
        }

      }

      if (getDrPartyList.length > 0) {

        for (let i of getDrPartyList) {
          if (i.DRAMNT) {


            let a = <any>{};
            let b = <any>{};
            a.ACID = i.acitem.ACID;
            a.ACNAME = i.acitem.ACNAME;
            a.DRAMNT = i.DRAMNT;
            a.isCheck = false;
            this.finalDebitList.push(a);
          }
          //console.log("checkValueDebit&&", this.finalDebitList)

        }

      }
    }
  }
  OneTDS_MultiParty_JV(isTDSPayable) {
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal) {
      var getCrPartyList = [];
      var getDrPartyList = [];
      this.finalDebitList = [];
      this.finalCreditList = [];
      if (isTDSPayable == 0) {
        var count = 0;
        for (let i of this._trnMainService.TrnMainObj.TrntranList) {
          if (i.AccountItem) {

            if (i.CRAMNT != null || i.CRAMNT != 0) {
              if (i.acitem.ACID.substring(0, 2) == 'PA') {
                getCrPartyList.push(i);
                //console.log("CHeckListCr", getCrPartyList)
                this.showTDSDetailPopup = 1;
                count++;
              }

            }
          }
        }


        if (getCrPartyList.length > 0) {

          for (let i of getCrPartyList) {
            let a = <any>{};
            let b = <any>{};
            a.ACID = i.acitem.ACID;
            a.ACNAME = i.acitem.ACNAME;
            a.CRAMNT = i.CRAMNT;
            a.DRAMNT = 0;
            a.isCheck = false;
            this.finalCreditList.push(a);
            //console.log("checkValue&&", this.finalCreditList)

          }

        }

      }
      else if (isTDSPayable == 1) {
        var count = 0;
        for (let i of this._trnMainService.TrnMainObj.TrntranList) {
          if (i.AccountItem) {

            if (i.DRAMNT != null || i.DRAMNT != 0) {
              if (i.acitem.ACID.substring(0, 2) == 'PA') {
                getDrPartyList.push(i);
                //console.log("CHeckListCr", getDrPartyList)
                this.showTDSDetailPopup = 1;
                count++;
              }

            }
          }
        }



        if (getDrPartyList.length > 0) {

          for (let i of getDrPartyList) {
            let a = <any>{};
            let b = <any>{};
            a.ACID = i.acitem.ACID;
            a.ACNAME = i.acitem.ACNAME;
            a.DRAMNT = i.DRAMNT;
            a.isCheck = false;
            this.finalDebitList.push(a);
            //console.log("checkValueDebit&&", this.finalDebitList)

          }

        }
      }
    }
    return true;
  }
  MoreThanOneTds_JV() {

    //Check more than one TaxPayable
    var count = 0;
    for (let i of this._trnMainService.TrnMainObj.TrntranList) {
      count++;
      if (i.AccountItem) {
        if (i.acitem.PARENT == this.masterService.userSetting.TDS_PAYABLE || i.acitem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE) {
          for (let x = 2; x <= count; x++) {
            if (this._trnMainService.TrnMainObj.TrntranList[count - x].acitem.ACID.substring(0, 2) == 'PA') {
              i.OppAcid = this._trnMainService.TrnMainObj.TrntranList[count - x].acitem.ACID;
              if (i.acitem.PARENT == this.masterService.userSetting.TDS_PAYABLE) {
                if (this._trnMainService.TrnMainObj.TrntranList[count - x].DRAMNT)
                  i.OPPREMARKS = this._trnMainService.TrnMainObj.TrntranList[count - x].DRAMNT.toString();
              }
              else if (i.acitem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE) {
                if (this._trnMainService.TrnMainObj.TrntranList[count - x].CRAMNT)
                  i.OPPREMARKS = this._trnMainService.TrnMainObj.TrntranList[count - x].CRAMNT.toString();
              }
              break;
            }
          }
        }

      }

    }
    return true;
  }
  _activeCrIndex: any;
  _activeDrIndex: any;
  CrRowClick(index) {
    this._activeCrIndex = index;
  }
  DrRowClick(index) {
    this._activeDrIndex = index;
  }
  isPayableTab = true;
  activeTabForTds(value) {
    value == true ? this.isPayableTab = true : this.isPayableTab = false;
  }
  ClickCrList(index) {
    //console.log("Index", this.finalCreditList[index].isCheck)
    if (this.finalCreditList[index].isCheck == false) {
      if (this.isPayableTab == false) {
        this._trnMainService.TrnMainObj.TrntranList.forEach(x => {
          if (x.acitem.ACNAME ==
            this.finalCreditList[index].ACNAME) {
            x.OppAcid = this.FinalCrTDSObj.acitem.ACID;
            x.OPPREMARKS = this.FinalCrTDSObj.DRAMNT;
          }
        })
      }
      //console.log("CheckValueOfFfff", this._trnMainService.TrnMainObj.TrntranList)

    }

  }
  ClickDrList(index) {
    //console.log("Index", this.FinalDrTDSObj, this._trnMainService.TrnMainObj.TrntranList)
    if (this.finalDebitList[index].isCheck == false) {
      if (this.isPayableTab == true) {
        this._trnMainService.TrnMainObj.TrntranList.forEach(x => {
          if (x.acitem.ACNAME ==
            this.finalDebitList[index].ACNAME) {

            x.OppAcid = this.FinalDrTDSObj.acitem.ACID;
            x.OPPREMARKS = this.FinalDrTDSObj.CRAMNT;
          }
        })
      }
      //console.log("CheckValueOfFfff", this._trnMainService.TrnMainObj.TrntranList)

    }

  }
  cancelTDSDetailPopup() {
    this.showTDSDetailPopup = 0;
  }
  SubLedgerValidation(): boolean {
    // ////console.log("SaveTransactionObj",this._trnMainService.TrnMainObj)
    if (this._trnMainService.TrnMainObj.VoucherType !== VoucherTypeEnum.AdditionalCost){
      for (let i of this._trnMainService.TrnMainObj.TrntranList) {
        if (i.AccountItem.HASSUBLEDGER == 1 && (!i.SL_ACID)) {
          var ACNAME = i.AccountItem.ACNAME;
            this.alertService.warning("PLEASE, SPECIFY SUB LEDGER FOR A/C '" + ACNAME + "'");
            return false;
        }
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.CapitalVoucher) {
      for (let x of this._trnMainService.TrnMainObj.AdditionTranList) {
        if (x.AccountItem.HASSUBLEDGER == 1 && (!x.SL_ACID)) {
          var ACNAME = x.AccountItem.ACNAME;
          this.alertService.warning("PLEASE, SPECIFY SUB LEDGER FOR A/C '" + ACNAME + "'");
          return false;
        }
      }
    }
    return true;
  }
  transactionValidator(): boolean {
    if (!this._trnMainService.setDefaultValueInTransaction()) {
      return false;
    }
    return true;
  }
  userSetting: any;


  onSubmit() {

    ////console.log("date check",this._trnMainService.TrnMainObj.TRNDATE, this._trnMainService.TrnMainObj.TRN_DATE)
    if (this._trnMainService.TrnMainObj.VoucherType != VoucherTypeEnum.AdditionalCost) {
      //Below code are already used there but Not required for AddiotionalCost.
      this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.CHALANNO;
    }


    try {

      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
        // if(this._trnMainService.TrnMainObj.CNDN_MODE == undefined){ //commented because capitalized input in not neeeded in cp now, cndn input commented in capital voucher so not compulsory now
        //   this.alertService.warning("Please select Capitalize Purchase Type");
        //   return;
        // }

        if (Math.round((this._trnMainService.totalCRAmount + Number.EPSILON) * 100) / 100
          != Math.round((this._trnMainService.totalDRAmount + Number.EPSILON) * 100) / 100) {
          this.alertService.info("DR and Cr amount are not equall");
          return;
        }
        if (this._trnMainService.TrnMainObj.BILLTO == null ||
          this._trnMainService.TrnMainObj.BILLTO == "" ||
          this._trnMainService.TrnMainObj.BILLTO == undefined
        ) {
          this.alertService.info("Supplier is not selected");
          return;
        }

        this._trnMainService.TrnMainObj.DCAMNT = Math.round((this._trnMainService.TrnMainObj.DCAMNT + Number.EPSILON) * 100) / 100;
        this._trnMainService.TrnMainObj.VATAMNT = Math.round((this._trnMainService.TrnMainObj.VATAMNT + Number.EPSILON) * 100) / 100;
      }

      if (this._trnMainService.TrnMainObj.VoucherType == 17 ||
        this._trnMainService.TrnMainObj.VoucherType == 18 ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay) {
        if (this._trnMainService.TrnMainObj.TRNACName == null ||
          this._trnMainService.TrnMainObj.TRNACName === undefined ||
          this._trnMainService.TrnMainObj.TRNACName == ""
        ) {
          this.alertService.info("CASH/BANK A/C IS NOT SELECTED. PLS SELECT IT FIRST");
          return;
        }
      }

    if((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) &&
    this._trnMainService.TrnMainObj.HASSUBLEDGER ==1 && this._trnMainService.userSetting.ENABLESUBLEDGER==1 ){
      if (this._trnMainService.TrnMainObj.CASHBANK_SL_NAME == null ||
        this._trnMainService.TrnMainObj.CASHBANK_SL_NAME === undefined ||
        this._trnMainService.TrnMainObj.CASHBANK_SL_NAME == ""
      ) {
        this.alertService.info("Subledger of CASH/BANK A/C IS NOT SELECTED. PLS SELECT IT FIRST");
        return;
      }
    }

    if (this._trnMainService.TrnMainObj.VoucherType == 15 || this._trnMainService.TrnMainObj.VoucherType == 16) {
      if (this._trnMainService.TrnMainObj.TRNACName == null ||
        this._trnMainService.TrnMainObj.TRNACName === undefined ||
        this._trnMainService.TrnMainObj.TRNACName == ""
      ) {
        let ac="Cr.";
        if(this._trnMainService.TrnMainObj.VoucherType == 15){
          ac="Cr.";
          this.alertService.info(`${ac} A/C IS NOT SELECTED. PLS SELECT IT FIRST`);
        }else if(this._trnMainService.TrnMainObj.VoucherType == 16){
          ac="Dr.";
          this.alertService.info(`${ac} A/C IS NOT SELECTED. PLS SELECT IT FIRST`);
        }
        return;
      }

      
      if(this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 1){
        // console.log("TrntranList--",this._trnMainService.TrnMainObj.TrntranList)
        let tds_payable = this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.CRAMNT > 0 && (x.AccountItem.PARENT==this.userSetting.TDS_PAYABLE ||
          x.AccountItem.PARENT==this.userSetting.TDS_RECEIVABLE));
          if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.DebitNote){
            tds_payable = this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.DRAMNT > 0 && (x.AccountItem.PARENT==this.userSetting.TDS_PAYABLE ||
              x.AccountItem.PARENT==this.userSetting.TDS_RECEIVABLE));
          }
        // console.log("tds_payable",tds_payable)
        // if(tds_payable && tds_payable.length > 1){
        //   this.alertService.info("Only one tds ledger is allowed.");
        //   return;
        // }
      }
    }


      // ////console.log("#123")
      //console.log("validation checl", this._trnMainService.TrnMainObj.TRNDATE, this.serverDate);
      if (this._trnMainService.TrnMainObj.TRNDATE > this.serverDate) {
        this.alertService.info("TRN DATE SHOULD NOT BE ENTERED FUTURE DATE");
        return;
      }

      // ////console.log("CheckDate",this._trnMainService.TrnMainObj.TRN_DATE,this.masterService.PhiscalObj.EndDate)
      let trn_Date=moment(this._trnMainService.TrnMainObj.TRN_DATE).format("YYYY-MM-DD");
      //console.log("trn_Date",trn_Date)
      if ((trn_Date < this.masterService.PhiscalObj.BeginDate.split('T')[0])
        || trn_Date > this.masterService.PhiscalObj.EndDate.split('T')[0]
      ) {
        //console.log("CheckDate", this._trnMainService.TrnMainObj.TRN_DATE, this.masterService.PhiscalObj.BeginDate, this.masterService.PhiscalObj.EndDate)
        this.alertService.info("ENTRY DATE SHOULD BE WITH IN  FISCAL YEAR DATE RANGE!");
        return;
      }
      // ////console.log("#1234")
      if (this._trnMainService.TrnMainObj.VoucherType !== VoucherTypeEnum.AdditionalCost) {
        if (this.userSetting.RefNoReqInvEntry == 1) {
          if (this._trnMainService.TrnMainObj.CHALANNO == '' ||
            this._trnMainService.TrnMainObj.CHALANNO == null) {
            this.alertService.info("Refno cannot be empty");
            return;
          }

        }
      }
      // ////console.log("#1235",this.userSetting.PrefixForRefNoInvEntry,this._trnMainService.TrnMainObj.CHALANNO )
      if (this.userSetting.PrefixForRefNoInvEntry == 1) {
        // ////console.log("chalan no value", this._trnMainService.TrnMainObj.CHALANNO);

        if (this._trnMainService.TrnMainObj.CHALANNO == '' ||
          this._trnMainService.TrnMainObj.CHALANNO == null ||
          this._trnMainService.TrnMainObj.CHALANNOPREFIX == '' ||
          this._trnMainService.TrnMainObj.CHALANNOPREFIX == null
        ) {
          this.alertService.info("Refno/Prefix cannot be empty");
          return;
        }

      }
      if (this.userSetting.COSTCENTERCOMPULSORY == 1) {
        //console.log("COSTCENTER",this._trnMainService.TrnMainObj.COSTCENTER)
        if((this.userSetting.enableCostCenter == 1 &&
           (this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.Journal || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.ContraVoucher || 
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.PaymentVoucher || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.ReceiveVoucher ||
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.CreditNote || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.DebitNote ||
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.PostDirectory ||this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.Cellpay ||
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.AdditionalCost || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote)) || 
            this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.CapitalVoucher){
          if (this._trnMainService.TrnMainObj.COSTCENTER == null ||
            this._trnMainService.TrnMainObj.COSTCENTER === undefined ||
            this._trnMainService.TrnMainObj.COSTCENTER == ""
          ) {
            this.alertService.info("Please select Costcenter first!");
            return;
          }
        }

        if(this.userSetting.enableCostCenter == 2){
          if(this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.Journal || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.ContraVoucher || 
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.PaymentVoucher || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.ReceiveVoucher ||
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.PostDirectory || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.CapitalVoucher ||
            this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.CreditNote || this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.DebitNote ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote){
              let ccenter_check = this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 0 && this._trnMainService.TrnMainObj.TrntranList.filter(x=>((x.CostCenter == '' || x.CostCenter === null || x.CostCenter === undefined) && x.A_ACID != null ));
              //console.log("@@ccenter_check",ccenter_check)
              if(ccenter_check && ccenter_check.length > 0){
              this.alertService.info("Please select Costcenter");
              return;
          }
            }  
        }
      }

      if (this.userSetting.ENABLECOMPULSORY_PAYTO == 1) {
        if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PaymentVoucher && 
          (this._trnMainService.TrnMainObj.BILLTO==null || this._trnMainService.TrnMainObj.BILLTO=="" || this._trnMainService.TrnMainObj.BILLTO===undefined)){
            this.alertService.info("Please enter Pay To!");
            return;
        }
      }


      //console.log("@@this._trnMainService.TrnMainObj.VoucherType",this._trnMainService.TrnMainObj.VoucherType)
      if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
        let multiple_pledger = this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 0 && this._trnMainService.TrnMainObj.TrntranList.filter(x=>(x.A_ACID!=null && x.A_ACID.startsWith('PA')));
        if(multiple_pledger && multiple_pledger.length > 1){
            this.alertService.info("Multiple Party A/C Selection is Not Supported In Posted Date Voucher Entry.");
            return;
          }

          let zerodrcranmt = this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 0 && this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.A_ACID !=null && ((x.DRAMNT==null || x.DRAMNT==0) && (x.CRAMNT==null || x.CRAMNT==0)));
          //console.log("zerodrcranmt",zerodrcranmt)
        if(zerodrcranmt && zerodrcranmt.length > 0){
            this.alertService.info("Debit Amount or Credit Amount is Required.");
            return;
          }

          if(this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 1){
            let pledger = this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.CRAMNT > 0 && x.A_ACID.startsWith('PA'));
            if(this._trnMainService.TrnMainObj.TRNMODE == 'Party Receipt'){
              pledger = this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.CRAMNT > 0 && x.A_ACID.startsWith('PA'));
            }else{
              pledger = this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.DRAMNT > 0 && x.A_ACID.startsWith('PA'));
            }
            //console.log("pledger2",pledger)
            if(pledger && pledger.length > 0){
              let not_pledger = this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.A_ACID !=null && x.A_ACID.substring(0, 2) != 'PA' && (x.ChequeNo == '' || x.ChequeNo === null || x.ChequeNo === undefined));
              //console.log("not_pledger3",not_pledger)
              if(not_pledger && not_pledger.length >0){
                not_pledger[0].ChequeNo = pledger[0].ChequeNo;
                not_pledger[0].ChequeDate = pledger[0].ChequeDate;
              }
            }
          }

        let chequeno_check = this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 0 && this._trnMainService.TrnMainObj.TrntranList.filter(x=>((x.ChequeNo == '' || x.ChequeNo === null || x.ChequeNo === undefined) && x.A_ACID != null ));
        // //console.log("@@chequeno_check",chequeno_check)
        if(chequeno_check && chequeno_check.length > 0){
          this.alertService.info("Please select Cheque no");
          return;
        }

        let chequedate_check = this._trnMainService.TrnMainObj.TrntranList && this._trnMainService.TrnMainObj.TrntranList.length > 0 && this._trnMainService.TrnMainObj.TrntranList.filter(x=>((x.ChequeDate == '' || x.ChequeDate === null || x.ChequeDate === undefined) && x.A_ACID != null ));
        // //console.log("@@chequedate_check",chequedate_check)
        if(chequedate_check && chequedate_check.length > 0){
          this.alertService.info("Please select Cheque Date");
          return;
        }

        if(this._trnMainService.TrnMainObj.TRNACName==''||this._trnMainService.TrnMainObj.TRNACName==null||this._trnMainService.TrnMainObj.TRNACName==undefined){
          this.alertService.info("Bank Cannot be empty");
          return;
        }
      }
      

      if (this._trnMainService.TrnMainObj.VoucherType !== VoucherTypeEnum.AdditionalCost) {
        if (
          this._trnMainService.TrnMainObj.TrntranList[this._trnMainService.TrnMainObj.TrntranList.length - 1].AccountItem.ACID == null
        ) {
          this._trnMainService.TrnMainObj.TrntranList.splice(
            this._trnMainService.TrnMainObj.TrntranList.length - 1,
            1
          );
        }
      }

      // ////console.log("#1237")
      //Check Limit in Payment vouhcer in overdraft account
      if (this._trnMainService.TrnMainObj.VoucherType == 17 && this._trnMainService.MAPID_Is == "OD") {
        // ////console.log("@@totalDramnt",this._trnMainService.drTotal)
        // ////console.log("@@totalCramnt",this._trnMainService.crTotal)
        // ////console.log("@@_trnMainService.diffAmountIs",this._trnMainService.diffAmountIs)
        // ////console.log("@@creditlimit",this._trnMainService.creditlimit)
        let a = this._trnMainService.drTotal - this._trnMainService.crTotal;
        let b = this._trnMainService.creditlimit + (this._trnMainService.diffAmountIs);
        if (this._trnMainService.creditlimit > 0) {
          if (Math.abs(a) > b) {
            let pqr = b - Math.abs(a);
            this.alertService.info(" O/D LIMIT (Rs. " + this._trnMainService.creditlimit + ") WILL BE EXCEED BY (Rs." + Math.abs(pqr) + ") WITH THIS TRANSACTION. HENCE, REQUESTED COMMAND IS ABORTED.");
            return;
          }
        }
      }

      // This function below is for Payment and Receive Voucher
      // ////console.log("#1238")
      // return;
      if (this._trnMainService.TrnMainObj.VoucherType == 17 || this._trnMainService.TrnMainObj.VoucherType == 18) {
        // CheckBillTrack
        var isBillTrack: Boolean;
        this._trnMainService.TrnMainObj.BillTrackedList=[];
        for (let data of this._trnMainService.TrnMainObj.TrntranList) {
          if(data.RowWiseBillTrackedList){
            for (let i of data.RowWiseBillTrackedList) {
              let rowwise_billtrack_data: BillTrack = <BillTrack>{}
              rowwise_billtrack_data.AMOUNT = i.AMOUNT;
              rowwise_billtrack_data.REFBILL = i.REFBILL;
              rowwise_billtrack_data.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
              rowwise_billtrack_data.DIVISION = i.DIVISION;
              rowwise_billtrack_data.ACID = i.ACID;
              rowwise_billtrack_data.REFDIVISION = i.DIVISION;
              rowwise_billtrack_data.TBillNo = i.CHALANNO;
              rowwise_billtrack_data.TVCHRNO = i.CHALANNO;
              rowwise_billtrack_data.TAMOUNT = i.AMOUNT;
              rowwise_billtrack_data.VOUCHERTYPE = this._trnMainService.TrnMainObj.VoucherPrefix;
              rowwise_billtrack_data.ID = this._trnMainService.TrnMainObj.guid;
              this._trnMainService.TrnMainObj.BillTrackedList.push(rowwise_billtrack_data);
            }
          }
        }
        if (this._trnMainService.TrnMainObj.BillTrackedList != null &&
          this._trnMainService.TrnMainObj.BillTrackedList !== undefined
        ) {
          var _billtracklist=this._trnMainService.TrnMainObj.BillTrackedList;
          for (let a of _billtracklist) {
            let abc=this._trnMainService.TrnMainObj.TrntranList.filter(x=>x.A_ACID==a.ACID);
            if(abc && abc.length==0){
              let getindex=this._trnMainService.TrnMainObj.BillTrackedList.findIndex(x=>x.ACID==a.ACID);
              if(getindex && getindex>=0){
                this._trnMainService.TrnMainObj.BillTrackedList.splice(getindex,1)
              }
            }
          }
          if (this._trnMainService.TrnMainObj.BillTrackedList.length > 0) {
            isBillTrack = true;
          }
        }

        // ////console.log("#1239")
        try {
          if (this._trnMainService.Party_or_Expense_Ac != null) {
            // ////console.log("reached here")
            var TotalDebit = 0;
            var TotalCredit = 0;
            var BalanceDebitCredit = 0;
            var addnewTran: Boolean = false;
            var countDr = 0
            var countCr = 0
            var changeNarration: Boolean = false;
            var remarks = '';
            var skipArrayIfBillTrackedCr: boolean;
            var skipArrayIfBillTrackedDr: boolean;
            // count DR/CR seperatly
            // Below function is for Narration of TDS assign to others
            // ////console.log("#12399")
            for (let i of this._trnMainService.TrnMainObj.TrntranList) {
              if (this._trnMainService.TrnMainObj.VoucherType == 17) {
                if (i.DRAMNT != 0)
                  countDr += 1;
                if (i.AccountItem.PARENT == 'AG214') {
                  remarks = i.NARATION;

                }
              }
              else if (this._trnMainService.TrnMainObj.VoucherType == 18) {
                if (i.CRAMNT != 0)
                  countCr += 1
                if (i.AccountItem.PARENT == 'AG215') {
                  ////console.log("reached 2")
                  remarks = i.NARATION;
                }
              }

            }
            for (let i of this._trnMainService.TrnMainObj.TrntranList) {
              skipArrayIfBillTrackedDr = false;
              skipArrayIfBillTrackedCr = false;
              if (isBillTrack == true) {
                for (let b of this._trnMainService.TrnMainObj.BillTrackedList) {
                  if (i.guid == b.ID) {
                    if (this._trnMainService.TrnMainObj.VoucherType == 17) {
                      skipArrayIfBillTrackedCr = true
                    }

                    if (this._trnMainService.TrnMainObj.VoucherType == 18) {
                      skipArrayIfBillTrackedDr = true
                    }

                  }
                }
              }
              // ////console.log("#12312")
              if (i.DRAMNT == undefined) {
                i.DRAMNT = 0;
              } if (i.CRAMNT == undefined) {
                i.CRAMNT = 0;
              }
              if (skipArrayIfBillTrackedDr == false) {
                TotalDebit += i.DRAMNT
              }

              if (skipArrayIfBillTrackedCr == false) {
                TotalCredit += i.CRAMNT;
              }
              // ////console.log("TotalDDD", TotalDebit, TotalCredit, countDr, countCr, remarks)
              if (TotalDebit > 0 && TotalCredit > 0) {
                this._trnMainService.TrnMainObj.isOneisToManyvchr = true;
                if (this._trnMainService.TrnMainObj.VoucherType == 17) {
                  BalanceDebitCredit = TotalDebit - TotalCredit;
                  addnewTran = true;
                  if (countDr == 1) {

                    //  i.NARATION = "tds";
                    ////console.log("i.NARATION", i.NARATION)
                  }

                }
                else if (this._trnMainService.TrnMainObj.VoucherType == 18) {
                  BalanceDebitCredit = TotalCredit - TotalDebit;
                  addnewTran = true;
                  if (countCr == 1) {

                    //  i.NARATION = "tds";
                    ////console.log("reach 3", i.NARATION)
                  }
                }

              }
              else {
                this._trnMainService.TrnMainObj.isOneisToManyvchr = false;
              }


            }
            if (this._trnMainService.TrnMainObj.VoucherType == 17) {
              if (countDr == 1) {
                for (let i of this._trnMainService.TrnMainObj.TrntranList) {
                  if (i.DRAMNT != 0) {
                    if (i.AccountItem.PARENT == 'AG214') {

                      // this._trnMainService.TrnMainObj.TrntranList.forEach(x => x.NARATION = remarks);
                    }
                  }
                }
              }
            }

            if (this._trnMainService.TrnMainObj.VoucherType == 18) {
              if (countCr == 1) {
                for (let i of this._trnMainService.TrnMainObj.TrntranList) {
                  if (i.CRAMNT != 0) {

                    if (i.AccountItem.PARENT == 'AG215') {

                      //  this._trnMainService.TrnMainObj.TrntranList.forEach(x => x.NARATION = remarks);
                    }
                  }
                }
              }

            }
            // ////console.log("addneTran", addnewTran);
            if (addnewTran == true) {
              this.addNewTranRowWhenSave(BalanceDebitCredit, remarks)
            }
          }

        } catch (error) {
          alert(error);
        }

      }



      // 16 ~ Debit note
      // This function below is for Debit Credit Note
      if (this._trnMainService.TrnMainObj.VoucherType == 16 || this._trnMainService.TrnMainObj.VoucherType == 15) {

        if (this._trnMainService.Party_or_Expense_Ac != null) {
          this.DebitCreditNoteRecalculate(this._trnMainService.TrnMainObj.VoucherType);

        }
      }


      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher) {
        // //console.log("CheckValuePay",this._trnMainService.TrnMainObj)

        var count = 0;
        for (let i of this._trnMainService.TrnMainObj.TrntranList) {
          if (i.AccountItem != null) {
            count++;
            // //console.log("Check_p",i,this.masterService.userSetting.TDS_PAYABLE)
            if (i.AccountItem.PARENT == this.masterService.userSetting.TDS_PAYABLE || i.AccountItem.PARENT == this.masterService.userSetting.TDS_RECEIVABLE) {
              //get opposite parent ACID;     
              // //console.log("Check_x",i)
              for (let x = 2; x <= count; x++) {
                // x=2
                // count = 6
                // RES =  4;

                // x=3
                // count = 6
                // RES =  3;

                // x=4
                // count = 6
                // RES =  2;

                if (this._trnMainService.TrnMainObj.TrntranList[count - x].AccountItem.ACID.substring(0, 2) == 'PA') {

                  i.OppAcid = this._trnMainService.TrnMainObj.TrntranList[count - x].AccountItem.ACID;
                  if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) {
                    i.OPPREMARKS = this._trnMainService.TrnMainObj.TrntranList[count - x].CRAMNT.toString();
                  }
                  else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher) {
                    i.OPPREMARKS = this._trnMainService.TrnMainObj.TrntranList[count - x].DRAMNT.toString();
                  }

                  // //console.log("Check_y",i)
                  break;
                }

              }

            }

            if (i.NARATION1 == "cheque") {
              if (i.ChequeNo == null || i.ChequeNo == "" || i.ChequeNo == undefined || i.ChequeDate == null || i.ChequeDate == "" || i.ChequeDate == undefined) {
                this.alertService.error(`Cheque Date and Cheque Number required for ${i.AccountItem.ACNAME} `);
                return;
              }
            }
            else if (i.NARATION1 == "DemandDraft" || i.NARATION1 == "others" || i.NARATION1 == "e-transfer") {
              if (i.ChequeNo == null || i.ChequeNo == "" || i.ChequeNo == undefined || i.ChequeDate == null || i.ChequeDate == "" || i.ChequeDate == undefined) {
                this.alertService.error(`Date and  Number required for ${i.AccountItem.ACNAME} `);
                return;
              }
            }
          }
        }
      }

      if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay) {
        if (this._trnMainService.TrnMainObj.TrntranList[0].acitem.ACNAME!='CellPay Fee' && (this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT < 100 
          || this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT  > 1000000)) {
          this.alertService.warning("Please enter amount between 100 and 1000000!");
          this._trnMainService.TrnMainObj.TrntranList[0].DRAMNT = 0 ;
          if(this._trnMainService.TrnMainObj.TrntranList[1] && this._trnMainService.TrnMainObj.TrntranList[1].acitem && 
            this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACNAME == 'CellPay Fee'){
            this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACID='';
            this._trnMainService.TrnMainObj.TrntranList[1].acitem.ACNAME='';
            this._trnMainService.TrnMainObj.TrntranList[1].DRAMNT = 0;
          }
          return;
        }

        //console.log("CellPayFeeACID", this.masterService.userSetting.CellPayFee);
        if (this.masterService.userSetting.CellPayFee == null || this.masterService.userSetting.CellPayFee == '' ||
          this.masterService.userSetting.CellPayFee == undefined) {
          this.alertService.info("Please add CellPayFee ACID in database!");
          return;
        }

        if(this._trnMainService.TrnMainObj.TrntranList[0].A_ACID.startsWith('PA')){
          if(this._trnMainService.TrnMainObj.TrntranList[0].BANKCODE == "" ||this._trnMainService.TrnMainObj.TrntranList[0].BANKCODE ===null || this._trnMainService.TrnMainObj.TrntranList[0].BANKCODE ===undefined){
            this.alertService.info("Please select bank!");
            return;
          }
          if(this._trnMainService.TrnMainObj.TrntranList[0].BANKNAME == "" ||this._trnMainService.TrnMainObj.TrntranList[0].BANKNAME ===null || this._trnMainService.TrnMainObj.TrntranList[0].BANKNAME ===undefined){
            this.alertService.info("Please select bank!");
            return;
          }
          if(this._trnMainService.TrnMainObj.TrntranList[0].ChequeNo == "" ||this._trnMainService.TrnMainObj.TrntranList[0].ChequeNo ===null || this._trnMainService.TrnMainObj.TrntranList[0].ChequeNo ===undefined){
            this.alertService.info("Please select bank!");
            return;
          }
        }
      }

      try {
        for (var t in this._trnMainService.TrnMainObj.TrntranList) {
          if (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList !== undefined) {
            if (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length > 0) {

              if (
                this._trnMainService.TrnMainObj.TrntranList[t].AccountItem.HASSUBLEDGER == 1 &&
                (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList[
                  this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1
                ].SubledgerItem.ACID == null ||
                  this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList[
                    this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1
                  ].CRAMNT == null)
              ) {
                this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.splice(
                  this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1,
                  1
                );
              }

            }
          }
        }

      } catch (error) {
        alert(error);
      }


      if (this._trnMainService.TrnMainObj.VoucherType == 22 || this._trnMainService.TrnMainObj.VoucherType == 23) {
        this._trnMainService.TrnMainObj.ProdList = [];
      }

      let path2 = this.arouter.snapshot.url[1];
      if (path2 != null) {
        if (path2.path == "debit-note" || path2.path == "credit-note") {
          this._trnMainService.TrnMainObj.CNDN_MODE = 1;
        }
        else if (path2.path == "debit-note-rate-adjustment" || path2.path == "credit-note-rate-adjustment") {
          this._trnMainService.TrnMainObj.CNDN_MODE = 2;
        }
      }

      this._trnMainService.TrnMainObj.tag = "accountbase";
      this._trnMainService.TrnMainObj.IsAccountBase = true;
      if (this._trnMainService.TrnMainObj.TrntranList.filter(y => y.AccountItem != null).findIndex(x => x.AccountItem.isAutoGSTApplicable == 1) < 0) {

      }
      else {
        this._trnMainService.AutoGstPreparation();
      }
      if (this._trnMainService.TrnMainObj.gstInfoOfAccount != null && this._trnMainService.TrnMainObj.gstInfoOfAccount.GSTLIST != null && this._trnMainService.TrnMainObj.gstInfoOfAccount.GSTLIST.length > 0) {
        this._trnMainService.JournalGstListPreparationForSave();
      }

      // if(this._trnMainService.TrnMainObj.CHALANNOPREFIX != "" || this._trnMainService.TrnMainObj.CHALANNOPREFIX != null){
      //   this._trnMainService.TrnMainObj.CHALANNO = `${this._trnMainService.TrnMainObj.CHALANNOPREFIX}${this._trnMainService.TrnMainObj.CHALANNO}`
      // }






      // ////console.log("@@SAVEthis._trnMainService.TrnMainObj.TrntranList",this._trnMainService.TrnMainObj.TrntranList)

      //console.log("@@this._trnMainService.TrnMainObj.DIVISION",this._trnMainService.TrnMainObj.DIVISION)
      this._trnMainService.TrnMainObj.DIVISION = this.masterService.PhiscalObj.Div;
      //console.log("@@this.PhiscalObj.DIV",this.masterService.PhiscalObj.Div)

      if(this._trnMainService.TrnMainObj.AdditionalObj && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'REVERSE'){
        this.closeReverseEntryAuthPopup();
        this.reverseEntryConfirm.hide();
      }

      if(this._trnMainService.TrnMainObj.TOTAMNT===undefined || this._trnMainService.TrnMainObj.TOTAMNT==0){
        let _trntranTotal = 0;
        this._trnMainService.TrnMainObj.TrntranList.forEach(x => {
            _trntranTotal += x.DRAMNT == null ? null : x.DRAMNT;
        });
          // console.log("@@_trntranTotal", _trntranTotal)
          if(_trntranTotal==0){
            this._trnMainService.TrnMainObj.TrntranList.forEach(x => {
              _trntranTotal += x.CRAMNT == null ? null : x.CRAMNT;
          });
          }
          this._trnMainService.TrnMainObj.NETAMNT = _trntranTotal;
          this._trnMainService.TrnMainObj.TOTAMNT = _trntranTotal;
      }

      // console.log('this._trnMainService.TrnMainObj', this._trnMainService.TrnMainObj)


      this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj)
        .subscribe(
          data => {
            if (data.status == "ok") {
              this._trnMainService.disableSaveButton=false; //Enable Save Button
              this.savedVchrno = data.savedvchrno;
              this.savedtrnmode = this._trnMainService.TrnMainObj.TRNMODE;
              this.savedTrntrnlist = data.result2.TrntranList;
              //console.log("this.savedtrnmode",this.savedtrnmode)
              this.masterService.postdatedvoucher = false;
                this.DeleteAcc.show();
              this._trnMainService.masterSelectACID = '';
              if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal && data.result2.REVCHARGE == "Y") {
                try {

                  this.loadingService.hide()
                  //  this.promptPrintDeviceAfterSave = false

                  // this.masterService.getInvoiceData(data.savedvchrno, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC)
                  // .subscribe((res) => {
                  //   this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix, "", 1, true)
                  //   this.loadingService.hide()
                  // }, err => {
                  //   this.alertService.error(err)
                  // })
                } catch (ex) {
                  this.alertService.error(ex)
                }
              }

              if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal && data.result2.REVCHARGE != "Y" ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote) {
                //  this.loadingService.show("please wait. Getting invoice data ready for printing.")
                try {
                  // this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNAC)
                  // .subscribe((res) => {
                  //   this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix);
                  //   this.loadingService.hide()
                  // }, err => {
                  //   this.alertService.error(err)
                  // })

                  this.loadingService.hide()

                  // this.promptPrintDeviceAfterSave = true;
                } catch (ex) {
                  this.alertService.error(ex)
                }
              }


              if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
                this._trnMainService.creditList = [];
                this._trnMainService.totalCRAmount = 0;
                this._trnMainService.totalDRAmount = 0;
                this._trnMainService.storePreviousRoundOff = 0;
                this._trnMainService.addCreditListnewRow();
                this._trnMainService.TrnMainObj.CNDN_MODE = 0
              }

              this._trnMainService.crTotal = 0;
              this._trnMainService.drTotal = 0;
              this._trnMainService.diffAmountItemForAccount = 0;

              //this._trnMainService.viewDate.next(); //update date value

              this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);

              if (this._trnMainService.TrnMainObj.VoucherType == 14 || this._trnMainService.TrnMainObj.VoucherType == 15) {
                this._trnMainService.TrnMainObj.VATBILL = 0;

              }

              if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher) {
                this._trnMainService.TrnMainObj.TRNMODE = 'Party Payment'
                this.FlushBillList();
                this.VoucherTracking.HoldALLBillList = [];

              }
              else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) {
                this._trnMainService.TrnMainObj.TRNMODE = 'Party Receipt';
                this.FlushBillList();
                this.VoucherTracking.HoldALLBillList = [];
                // this.showPrintReceipt=true;
              }
              else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory) {
                this._trnMainService.TrnMainObj.TRNMODE = 'Party Receipt';
              }

              if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost) {

                this.onNewClick();
                this.Reset_AdditionalCost();

              }


            }
            else {
              this._trnMainService.disableSaveButton=false; //Enable Save Button
              if (this._trnMainService.TrnMainObj.VoucherType == 17 ||
                this._trnMainService.TrnMainObj.VoucherType == 18) {

                if (this._trnMainService.TrnMainObj.isOneisToManyvchr == true) {
                  this._trnMainService.TrnMainObj.TrntranList.splice(
                    this._trnMainService.TrnMainObj.TrntranList.length - 1

                  );
                }
              }
              if (this._trnMainService.TrnMainObj.VoucherType == 15 ||
                this._trnMainService.TrnMainObj.VoucherType == 16) {

                if (this._trnMainService.TrnMainObj.isOneisToManyvchr == true) {
                  this._trnMainService.TrnMainObj.TrntranList.splice(
                    this._trnMainService.TrnMainObj.TrntranList.length - 2);
                }
              }
            }
            this._trnMainService.viewDate.next(); // reset entrydate trndate
          },
          error => {
            this._trnMainService.disableSaveButton=false; //Enable Save Button
          }
        );
    } catch (e) {
    }
  }

  setPrinterAndprintAfterSave() {
    //console.log("vchrn", this.savedVchrno);
    this.promptPrintDeviceAfterSave = false
    // this.masterService.getInvoiceData(this.savedVchrno, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNAC)
    //           .subscribe((res) => {
    //             this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherPrefix);
    //             this.loadingService.hide()
    //           }, err => {
    //             this.alertService.error(err)
    //           })
    //console.log("1this.userProfile.CompanyInfo.COMPANYID",this.userProfile.CompanyInfo.COMPANYID)
    let vat = this.userProfile.CompanyInfo.VAT;
    let VATresult = vat.split("");
    let voucherprefix= this._trnMainService.TrnMainObj.VoucherPrefix;
    //console.log("@@2this.activeUrlPage",this.activeUrlPage)

    if(this.savedVchrno.startsWith('RR') && this.activeUrlPage=='credit-note'){
      voucherprefix= "RR";
    }

    let TRNMODE= this.savedtrnmode?this.savedtrnmode:this._trnMainService.TrnMainObj.TRNMODE;
    //console.log("VoucherPrefix",this._trnMainService.TrnMainObj.VoucherPrefix)
    if(this._trnMainService.TrnMainObj.VoucherPrefix == 'PC'){
      //console.log("TRNMODE",TRNMODE)
      if(TRNMODE == 'Party Receipt'){
        voucherprefix= 'PC-Receipt';
      }if(TRNMODE == 'Party Payment' || TRNMODE == 'Expenses Voucher'){
        voucherprefix= 'PC-Payment';
      }
    }

    this.masterService.getPrintFileName(voucherprefix).subscribe((res) => {
      if (res.status == "ok") {
        this.filename = res.result ? res.result[0].FileName : '';
        this.rownumber = res.result ? res.result[0].RowsNumber : 0;

        this.masterService.getNumberToWords(this.savedVchrno, this.userProfile.CompanyInfo.INITIAL, this.masterService.PhiscalObj.PhiscalID, this.userProfile.CompanyInfo.COMPANYID,TRNMODE).subscribe(
          (res) => {
            if (res.status == "ok") {
              this.numtowords = res.result ? res.result[0].NUMTOWORDS : '';
              ////console.log("@@numtowords", this.numtowords);

              let userdivision = this.userProfile.userDivision ? this.userProfile.userDivision : this.userProfile.CompanyInfo.INITIAL;
              let ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
              let BRANCHNAME = this.userProfile.CompanyInfo.INITIAL;
              this.masterService.getDetailsByUserDivision(userdivision).subscribe((res: any) => {
                if (res.status == "ok") {
                  if (res.result && res.result.length > 0 && res.result[0] && res.result[0].COMADD) {
                    ADDRESS = res.result[0].COMADD;
                  }
                  if (ADDRESS === null || ADDRESS === undefined || ADDRESS === '') {
                    ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
                  }
                  if (res.result && res.result.length > 0 && res.result[0] && res.result[0].BRANCHNAME) {
                    BRANCHNAME = res.result[0].BRANCHNAME;
                  }
                  if (BRANCHNAME === null || BRANCHNAME === undefined || BRANCHNAME === '') {
                    BRANCHNAME = this.userProfile.CompanyInfo.INITIAL;
                  }

                  let pdfPrintFormatParameters: any = <any>{}
                  pdfPrintFormatParameters.filename = this.filename;
                  pdfPrintFormatParameters.rownumber = this.rownumber;
                  pdfPrintFormatParameters.VCHRNO = this.savedVchrno;
                  pdfPrintFormatParameters.NAME = this.userProfile.CompanyInfo.NAME;
                  pdfPrintFormatParameters.ADDRESS = ADDRESS ? ADDRESS : ' ';
                  pdfPrintFormatParameters.INITIAL = this.userProfile.CompanyInfo.INITIAL;
                  pdfPrintFormatParameters.PhiscalID = this.userProfile.CompanyInfo.PhiscalID,
                  pdfPrintFormatParameters.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
                  pdfPrintFormatParameters.phone1 = this.userProfile.CompanyInfo.TELA?this.userProfile.CompanyInfo.TELA:' ';
                  pdfPrintFormatParameters.phone2 = this.userProfile.CompanyInfo.TELB?this.userProfile.CompanyInfo.TELB:' ';
                  pdfPrintFormatParameters.EMAIL = this.userProfile.CompanyInfo.EMAIL?this.userProfile.CompanyInfo.EMAIL:' ';
                  pdfPrintFormatParameters.numtowords = this.numtowords ? this.numtowords : ' ';
                  pdfPrintFormatParameters.panno1 = VATresult[0] ? VATresult[0] : ' ';
                  pdfPrintFormatParameters.panno2 = VATresult[1] ? VATresult[1] : ' ';
                  pdfPrintFormatParameters.panno3 = VATresult[2] ? VATresult[2] : ' ';
                  pdfPrintFormatParameters.panno4 = VATresult[3] ? VATresult[3] : ' ';
                  pdfPrintFormatParameters.panno5 = VATresult[4] ? VATresult[4] : ' ';
                  pdfPrintFormatParameters.panno6 = VATresult[5] ? VATresult[5] : ' ';
                  pdfPrintFormatParameters.panno7 = VATresult[6] ? VATresult[6] : ' ';
                  pdfPrintFormatParameters.panno8 = VATresult[7] ? VATresult[7] : ' ';
                  pdfPrintFormatParameters.panno9 = VATresult[8] ? VATresult[8] : ' ';
                  pdfPrintFormatParameters.VoucherPrefix = this._trnMainService.TrnMainObj.VoucherPrefix;
                  pdfPrintFormatParameters.PRINTBY = this.userProfile.username ? this.userProfile.username : ' ';
                  pdfPrintFormatParameters.COMPANYVAT = vat?vat:this.userProfile.CompanyInfo.VAT;
                  pdfPrintFormatParameters.BRANCHNAME = BRANCHNAME?BRANCHNAME:' ';

                    this.masterService.getAllInvoiceData(pdfPrintFormatParameters).subscribe(

                    (res) => {
                      ////console.log("pdfresponse", res);
                      const blobUrl = URL.createObjectURL(res.content);
                      const iframe = document.createElement('iframe');
                      iframe.style.display = 'none';
                      iframe.src = blobUrl;
                      document.body.appendChild(iframe);
                      iframe.contentWindow.print();
                    }
                  )
                }
              })
            }
          })
      }
    })

    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher){
      setTimeout(() => {
        this.showPrintReceipt=true;
      }, 4000);
    }

    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher){
      setTimeout(() => {
        this.showPrintPayslip=true;
      }, 4000);
    }
  }


  // Below function below is for Debit Credit Note only
  DebitCreditNoteRecalculate(VoucherType) {
    ////console.log("reach hera");
    if (this._trnMainService.TrnMainObj.VATAMNT == undefined) this._trnMainService.TrnMainObj.VATAMNT = 0
    var BalanceDebitCredit = 0;
    for (let i of this._trnMainService.TrnMainObj.TrntranList) {

      if (i.DRAMNT == undefined) {
        i.DRAMNT = 0;
      } if (i.CRAMNT == undefined) {
        i.CRAMNT = 0;
      }
      this.TotalDrCr_Debit += i.DRAMNT
      this.TotalDrCr_Credit += i.CRAMNT;
      if (i.NARATION != null) {
        this.RemarksToDrCrAccount = i.NARATION;
      }


    }

    if (this._trnMainService.TrnMainObj.VATAMNT != 0) {
      this.createnewAcObjForVAT(VoucherType);
      if (VoucherType == 16) {
        BalanceDebitCredit = this.TotalDrCr_Credit + this._trnMainService.TrnMainObj.VATAMNT;
        this.addNewTrnTranRowForDrCR(0, BalanceDebitCredit, this._trnMainService.Party_or_Expense_Ac, false)
        this._trnMainService.TrnMainObj.isOneisToManyvchr = true;
      }
      else if (VoucherType == 15) {
        BalanceDebitCredit = this.TotalDrCr_Debit + this._trnMainService.TrnMainObj.VATAMNT;
        this.addNewTrnTranRowForDrCR(BalanceDebitCredit, 0, this._trnMainService.Party_or_Expense_Ac, false)
        this._trnMainService.TrnMainObj.isOneisToManyvchr = true;
      }
    }
    else {
      this._trnMainService.TrnMainObj.isOneisToManyvchr = false;
    }

  }

  remainingAmtForDrCr: any;
  CRAMNT = 0;
  DRAMNT = 0;
  TotalDrCr_Debit = 0;
  TotalDrCr_Credit = 0;

  // Below function below is for Debit Credit Note only
  createnewAcObjForVAT(VoucherType) {
    var newAC = <TAcList>{}

    if (this._trnMainService.TrnMainObj.VoucherType == 15) {
      newAC.ACID = this.userSetting.Vat_Sales;
      newAC.ACCODE = this.userSetting.Vat_Sales;
    } else if (this._trnMainService.TrnMainObj.VoucherType == 16) {
      newAC.ACID = this.userSetting.Vat_Purchase;
      newAC.ACCODE = this.userSetting.Vat_Purchase;
    }

    newAC.ACNAME = "VAT A/C",
      newAC.PARENT = "AG007",
      newAC.TYPE = "A",
      newAC.MAPID = "N",
      newAC.IsBasicAc = 0,
      newAC.ADDRESS = null,
      newAC.PHONE = null,
      newAC.FAX = null,
      newAC.EMAIL = null,
      newAC.VATNO = null,
      newAC.PType = "B",
      newAC.CRLIMIT = 0,
      newAC.CRPERIOD = 0,
      newAC.SALEREF = 0,
      newAC.LEVELS = 4,
      newAC.FLGNEW = 0,
      newAC.COMMON = 0,
      newAC.PATH = null,
      newAC.INITIAL = null,
      newAC.EDATE = null,
      newAC.DISMODE = "0",
      newAC.MCAT = null,
      newAC.HASSUBLEDGER = 0,
      newAC.RATETYPE = null,
      newAC.INVCHECK = 0,
      newAC.LEADTIME = 0
    //  16 Debit note
    if (this._trnMainService.TrnMainObj.VoucherType == 16) {

      this.CRAMNT = this._trnMainService.TrnMainObj.VATAMNT;
      this.DRAMNT = 0
      ////console.log("CheckTran", this.DRAMNT, this.CRAMNT, this._trnMainService.TrnMainObj.VATAMNT)
      this.addNewTrnTranRowForDrCR(this.CRAMNT, this.DRAMNT, newAC, true)
    }
    //  15 Credit note
    else if (this._trnMainService.TrnMainObj.VoucherType == 15) {

      this.CRAMNT = 0
      this.DRAMNT = this._trnMainService.TrnMainObj.VATAMNT;
      ////console.log("CheckTran", this.DRAMNT, this.CRAMNT, this._trnMainService.TrnMainObj.VATAMNT)
      this.addNewTrnTranRowForDrCR(this.CRAMNT, this.DRAMNT, newAC, true)
    }



  }

  RemarksToDrCrAccount: any;
  //  this.VATACID = "LB01003";
  // Below function below is for Debit Credit Note only
  addNewTrnTranRowForDrCR(CRAMNT, DRAMNT, value: TAcList, isVATAccount = false) {
    var newRow = <Trntran>{};
    newRow.AccountItem = value;
    newRow.A_ACID = value.ACID;
    newRow.NARATION1 = "none";
    newRow.CRAMNT = CRAMNT,
      newRow.DRAMNT = DRAMNT,
      newRow.inputMode = true;
    newRow.editMode = true;
    newRow.ROWMODE = "new";
    ////console.log("CheckDATA2", this.RemarksToDrCrAccount)
    if (this.RemarksToDrCrAccount != null) {

      if (isVATAccount == false) {

        newRow.NARATION = this.RemarksToDrCrAccount
        ////console.log("CheckDATA2", newRow.NARATION)
      }
    }
    this._trnMainService.TrnMainObj.TrntranList.push(newRow);
  }

  //Below function is for Payment and Receipt voucher only!
  addNewTranRowWhenSave(BalanceDebitCredit, remarks) {

    var newRow = <Trntran>{};

    newRow.AccountItem = this._trnMainService.Party_or_Expense_Ac;
    if (this._trnMainService.TrnMainObj.Mode == "EDIT") {
      newRow.A_ACID = this._trnMainService.Party_or_Expense_Ac.ACID

    }

    newRow.NARATION1 = "none";
    newRow.inputMode = true;
    newRow.editMode = true;
    if (this._trnMainService.TrnMainObj.VoucherType == 17) {
      // this._trnMainService.TrnMainObj.TrntranList.forEach(x => x.NARATION = remarks);
      newRow.CRAMNT = BalanceDebitCredit;
      if (this._trnMainService.TrnMainObj.REMARKS != null &&
        this._trnMainService.TrnMainObj.REMARKS !== undefined &&
        this._trnMainService.TrnMainObj.REMARKS !== ""
      ) {
        newRow.NARATION = this._trnMainService.TrnMainObj.REMARKS;
      }
    }

    else
      newRow.CRAMNT = 0
    if (this._trnMainService.TrnMainObj.VoucherType == 18) {
      //this._trnMainService.TrnMainObj.TrntranList.forEach(x => x.NARATION = remarks);
      newRow.DRAMNT = BalanceDebitCredit;
      if (this._trnMainService.TrnMainObj.REMARKS != null &&
        this._trnMainService.TrnMainObj.REMARKS !== undefined &&
        this._trnMainService.TrnMainObj.REMARKS !== ""
      ) {
        newRow.NARATION = this._trnMainService.TrnMainObj.REMARKS;
      }
    }

    else
      newRow.DRAMNT = 0
    newRow.ROWMODE = "new";
    newRow.PartyDetails = [];
    this._trnMainService.TrnMainObj.TrntranList.push(newRow);

  }

  cancelprint() {
    this.promptPrintDevice = false;
    this.promptPrintDeviceAfterSave = false;
    // this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher){
      this.showPrintReceipt=true;
    }
    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher){
      this.showPrintPayslip=true;
    }
  }


  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }

  onItemDoubleClick(event) {
    this.masterService.VCHR=event.VCHRNO;
    this.masterService.loadedTrnmain.Mode = this.masterService.addnMode;
    if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN" || this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
      if (event.CNDN_MODE == 1) {
        this.loadVoucher(event);
      } else {
        this.alertService.warning(`Cannot Load Voucher!! The Voucher is ${event.VOUCHERREMARKS} based.`)
        return;
      }
    }
    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
      if(this._trnMainService.buttonClickMode == "EDIT"){
        this.masterService.PIVoucherDetail(event.VCHRNO).subscribe(res => {
          if (res.status == "ok") {
              if (res.result && res.result.length && res.result.length > 0) {
                    this.alertService.info(`This voucher ${this._trnMainService.TrnMainObj.VCHRNO} has been used for local purchase cost allocation.`);
                    return;
              }else{
                this._trnMainService.CapitalBudgetData(event.VCHRNO, event.DIVISION, event.PhiscalID);
              }
          }
      }, err => {
          this.alertService.info(err);
      })
      }else{
        this._trnMainService.CapitalBudgetData(event.VCHRNO, event.DIVISION, event.PhiscalID);
      }
    }
    else if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.AdditionalCost) {
      ////console.log("view add cost", event);

      this._additionalCostService.loadAdditionalCost(event)
      setTimeout(() => {
        // this._trnMainService.TrnMainObj.Mode = 'VIEW'
        // this._trnMainService.TrnMainObj.Mode = this._trnMainService.buttonClickMode;

        // this._trnMainService.TrnMainObj = this.masterService.loadedTrnmain
        // this._trnMainService.TrnMainObj.Mode = this.masterService.addnMode;

        //Dbl check if trnmain vchrno missing -- sometimes date will not show on Edit or View
        // this.loadVoucher(this._trnMainService.TrnMainObj);
      }, 3000);
      this._additionalCostService.ObservableReturnData.subscribe((x: any) => {
        this._trnMainService.TrnMainObj = this.masterService.loadedTrnmain
        this._trnMainService.TrnMainObj.Mode = this.masterService.addnMode;
        this.loadVoucher(x.TrnMainObj);
      })
      return
    }else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory && this._trnMainService.buttonClickMode == "EDIT"){
      this.masterService.LatePostDatedinRVPV(event.VCHRNO).subscribe(res=>{
        if(res.status == 'ok'){
          this.loadVoucher(event);
        }else{
          this.alertService.info("This voucher cannot be edited.");
          return;
        }
      })
    }
    else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher && this._trnMainService.buttonClickMode == "EDIT"){
      this.masterService.CheckIfRefbillIsCellpay(event.VCHRNO).subscribe(res=>{
        if(res.status == 'ok'){
          this.masterService.CheckPost(event.VCHRNO).subscribe(res=>{
            if(res.status == 'ok'){
           this.loadVoucher(event);
            }else{
              if (this.userSetting.EnableLatePost == 1) {
                if (this.userProfile.LATEPOSTEDIT == 1) {
                  this.loadVoucher(event);
                  return;
                }
              }  
              this.alertService.info("This Voucher"+event.VCHRNO+ "has been posted so it cannot be edited");
              return;
            }
          })
         // this.loadVoucher(event);
        }else{
          this.alertService.info("This voucher cannot be edited.");
          return;
        }
      })
    }
    else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay && this._trnMainService.buttonClickMode == "EDIT"){
      this.masterService.CheckCellPayPaymentDone(event.VCHRNO).subscribe(res=>{
        if(res.status == 'ok'){
          this.loadVoucher(event);
        }else{
          this.alertService.info("This voucher cannot be edited.");
          return;
        }
      })
    }
    else if((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal && this._trnMainService.buttonClickMode == "EDIT")||(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher && this._trnMainService.buttonClickMode == "EDIT")||(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher && this._trnMainService.buttonClickMode == "EDIT")){
      this.masterService.CheckPost(event.VCHRNO).subscribe(res=>{
        if(res.status == 'ok'){
          if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal){
            this.masterService.PIVoucherDetail(event.VCHRNO).subscribe(res => {
              if (res.status == "ok") {
                  if (res.result && res.result.length && res.result.length > 0) {
                        this.alertService.info(`This voucher ${this._trnMainService.TrnMainObj.VCHRNO} has been used for local purchase cost allocation.`);
                        return;
                  }else{
                    this.loadVoucher(event);
                  }
              }
          }, err => {
              this.alertService.info(err);
          })
          }else{
            this.loadVoucher(event);
          }
        }else{
          if (this.userSetting.EnableLatePost == 1) {
            if (this.userProfile.LATEPOSTEDIT == 1) {
              this.loadVoucher(event);
              return;
            }
          }  
          this.alertService.info("This Voucher"+event.VCHRNO+ "has been posted so it cannot be edited");
          return;
        }
      })
    }
    else {
      this.loadVoucher(event);
    }

    if (this._trnMainService.TrnMainObj.VoucherPrefix == 'JV' && this._trnMainService.buttonClickMode == "VIEW") {
      this.showVoucherReplicateButton = true;
    }
  }

  loadVoucher(selectedItem) {
    this._trnMainService.loadData(
      selectedItem.VCHRNO,
      selectedItem.DIVISION,
      selectedItem.PhiscalID
    );

    this._trnMainService.showPerformaApproveReject = false;
    if (this._trnMainService.TrnMainObj.gstInfoOfAccount == null) {
      this._trnMainService.TrnMainObj.gstInfoOfAccount = <any>{}
    }
    this._trnMainService.TrnMainObj.gstInfoOfAccount.TRNTYPE = selectedItem.PSTYPE
    this.vouchernois = selectedItem.VCHRNO;
    this.division = selectedItem.DIVISION;
    this.phiscalid = selectedItem.PhiscalID;

  }

  onNewClick() {
    // ////console.log("Checkaaa",this._trnMainService.TrnMainObj)
    //console.log("@this.activeurlpath",this.activeurlpath)
    if(this._trnMainService.TrnMainObj.AdditionalObj && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'REVERSE'){
      this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = '';
      this._trnMainService.initialFormLoad(15);
      this._trnMainService.TrnMainObj.VoucherPrefix="CN";
      this._trnMainService.TrnMainObj.VoucherAbbName="CN";
      this._trnMainService.TrnMainObj.VoucherType=VoucherTypeEnum.CreditNote;
    }
    this._trnMainService.budgetexceed_error_message="";
    this._trnMainService.dupacid_budget_error_message="";
    this._trnMainService.BUDGET_STATUS="";
    this._trnMainService.disableSaveButton=false;
    this.masterService.postdatedvoucher = false;
    this.masterService.addnMode = 'NEW';
    this.additionalCostService.costList = [];
    this.additionalCostService.INDcostList = [];
    this.additionalCostService.GRPcostList = [];
    this.additionalCostService.addCostTotAmount = 0;
    this.additionalCostService.addINDCostTotAmount = 0;
    this.additionalCostService.addGRPCostTotAmount = 0;
    this.additionalCostService.loadedTrnmain.TOTAMNT = 0;
    this.additionalCostService.header = [{ TITLE: 'Item Code' }, { TITLE: 'Item Name' }, { TITLE: 'Batch' }, { TITLE: 'Qty' }, { TITLE: 'Amount' }];
    this.additionalCostService.addtionalCostList = [];
    this.additionalCostService.IndividualCostList = [];
    this.additionalCostService.costdetail = [];
    this.masterService.AdditionalCostTrnTran = [];
    this.masterService.importDocumentDetailsObj = <importdocument>{}
    this.masterService.RefObj = <any>{};
    this._trnMainService.initialFormLoad(
      this._trnMainService.TrnMainObj.VoucherType
    );

    // alert("voucherTy"+ this._trnMainService.TrnMainObj.VoucherType)


    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseCreditNote) {
      if (this._trnMainService.userSetting.enableCostCenter == 1) {
        this.masterService.focusAnyControl("costcenter");
        this
      } else {
        if (this.userSetting.PrefixForRefNoInvEntry == 0) {
          this.masterService.focusAnyControl("refno");
        } else {
          this.masterService.focusAnyControl("prefix");
        }
      }
    }


    this.masterService.ShowMore = false;
    this._trnMainService.showPerformaApproveReject = false;
    this.inputDisabled = false;
    this._trnMainService.crTotal = 0;
    this._trnMainService.drTotal = 0;
    this._trnMainService.diffAmountItemForAccount = 0;
    this._trnMainService.differenceAmount = 0;
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
      this._trnMainService.creditList = [];
      this._trnMainService.totalCRAmount = 0;
      this._trnMainService.totalDRAmount = 0;
      this._trnMainService.addCreditListnewRow();
      this._trnMainService.TrnMainObj.DCAMNT = 0;
      this._trnMainService.TrnMainObj.TAXABLE = 0;
      this._trnMainService.TrnMainObj.NONTAXABLE = 0;
      this._trnMainService.storePreviousRoundOff = 0;
    }
    this._trnMainService.masterSelectACID = "";

    if (this._trnMainService.TrnMainObj.VoucherType == 14 || this._trnMainService.TrnMainObj.VoucherType == 15) {
      this._trnMainService.TrnMainObj.VATBILL = 0;
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher) {
      this._trnMainService.TrnMainObj.TRNMODE = 'Party Payment'
      this.FlushBillList();
      this.VoucherTracking.HoldALLBillList = [];

    }
    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) {
      this._trnMainService.TrnMainObj.TRNMODE = 'Party Receipt';
      this.FlushBillList();
      this.VoucherTracking.HoldALLBillList = [];
    }
    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory) {
      this._trnMainService.TrnMainObj.TRNMODE = 'Party Receipt';
    }

    this._trnMainService.viewDate.next();
    this._trnMainService.replicateVoucher = false;
    this.showVoucherReplicateButton = false;
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost) {
      // ////console.log("@@RESET")
      this.router.navigate['/pages/account/acvouchers/additional-cost'];
      setTimeout(() => {
        this.masterService.focusAnyControl("REFPINO_AD");
      }, 1000);
      this.Reset_AdditionalCost()


    }

    if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PaymentVoucher || this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ReceiveVoucher){
      this.PDC_LoadedClick=false;
    }


  }
  Reset_AdditionalCost() {
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost) {
      this.masterService.showLoadAllocationbutton=false;
      this.masterService.showCostPopup=false;
      this.masterService.pi_costdetaillist=[];
      this.masterService.batch='';
      this.masterService.desca='';
      this.masterService.mcode='';
      this.masterService.AdditionalAMOUNT='';
      this.masterService.AdditionalREMARKS='';
      this.masterService.addcosting='COSTING';
      this.masterService.AdditionalDesc="";
      this.masterService.AdditionalVAT=0;
      this.masterService.TDSAmount=0;
      this.masterService.TDSAccount_ACID="";
      this.masterService.TDSAccount_Name="";
      this.masterService.DoAccountPosting=1;
      this.masterService.IsTaxableBill=1;
      this.masterService.showIndividualAmountPopup=false;
      this.additionalCostService.tempIndCostList=[];
      this.masterService.TOTALINDAMOUNT=0;
      this.masterService.IS_ECA_ITEM=0;
      
      this.masterService.AdditionalPurchaseAcObj = '';
      this.masterService.AdditionalPurchaseCreditAcObj = '';
      this.masterService.RefObj.Ref_BILLNO="";
      this.masterService.RefObj.Ref_TRNDATE="";
      this.masterService.RefObj.Ref_BSDATE="";
      this.masterService.RefObj.Ref_SupplierACID="";
      this.masterService.RefObj.Ref_SupplierName="";
      this.masterService.RefObj.Ref_SupplierVAT="";
      this.masterService.AdditionalAMOUNT="";
      this.masterService.DR_SL_ACID='';
      this.masterService.DR_SL_ACNAME='';
      this.masterService.CR_SL_ACID='';
      this.masterService.CR_SL_ACNAME='';
      this.masterService.TDS_SL_ACID='';
      this.masterService.TDS_SL_ACNAME='';
      this.masterService.DR_HASSUBLEDGER=0;
      this.masterService.CR_HASSUBLEDGER=0;
      this.masterService.TDS_HASSUBLEDGER=0;
      // this.masterService.disable_DrSubLedger=true;
      // this.masterService.disable_CrSubLedger=true;
      
      this.masterService.AdditionalAMOUNT_2="";
      this.masterService.AdditionalPurchaseAcObj_2 = '';
      this.masterService.AdditionalPurchaseAcObj_2_ACID = '';
      this.masterService.AdditionalPurchaseCreditAcObj_2 = '';
      this.masterService.AdditionalREMARKS_2="";
      this.masterService.AdditionalDesc_2="";
      this.masterService.AdditionalVAT_2=0;
      this.masterService.TDSAmount_2=0;
      this.masterService.TDSAccount_ACID_2="";
      this.masterService.TDSAccount_Name_2="";
      this.masterService.DoAccountPosting_2=1;
      this.masterService.IsTaxableBill_2=1;
      this.masterService.RefObj.Ref_BILLNO_2="";
      this.masterService.RefObj.Ref_TRNDATE_2="";
      this.masterService.RefObj.Ref_BSDATE_2="";
      this.masterService.RefObj.Ref_SupplierACID_2="";
      this.masterService.RefObj.Ref_SupplierName_2="";
      this.masterService.RefObj.Ref_SupplierVAT_2="";
      this.masterService.IS_ECA_ITEM_2=0;
      this.masterService.DR_SL_INDV_ACID='';
      this.masterService.DR_SL_INDV_ACNAME='';
      this.masterService.CR_SL_INDV_ACID='';
      this.masterService.CR_SL_INDV_ACNAME='';
      this.masterService.TDS_SL_INDV_ACID='';
      this.masterService.TDS_SL_INDV_ACNAME='';
      this.masterService.DR_INDV_HASSUBLEDGER=0;
      this.masterService.CR_INDV_HASSUBLEDGER=0;
      this.masterService.TDS_INDV_HASSUBLEDGER=0;

      if (this.masterService.userSetting.EnableRateEditInAddCosting == 1) {
        this.additionalCostService.IMPORTDETAILS = <IMPORT_DETAILS>{};
        this.additionalCostService.IMPORTDETAILS.prodList = [];
        var newRow = <IMPORT_DETAILS_PROD>{};
        this.additionalCostService.IMPORTDETAILS.prodList.push(newRow);
      }
    }
  }
  FlushBillList() {
    this._trnMainService.TrnMainObj.BillTrackedList = [];

  }

  okClicked(value) {
    this._trnMainService.TrnMainObj.TenderList = value;
    let TB = this._trnMainService.TrnMainObj.TenderList[0];
    if (TB == null) {
      this.alertService.error("Tender Amount not detected");
      return;
    }
    this._trnMainService.TrnMainObj.TRNAC = TB.ACCOUNT;
    if (!this.transactionValidator()) return;
    this.onSubmit();
  }

  okAddNewClicked(value) {
    let CustObj = value;
    CustObj.PRICELEVEL = value.GEO;
    CustObj.TYPE = "A";
    CustObj.PARENT = "PA";
    CustObj.PType = "C";
    CustObj.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
  }
  onGstSetUpClick() {
    if (this._trnMainService.TrnMainObj.TrntranList.filter(y => y.AccountItem != null).findIndex(x => x.AccountItem.isAutoGSTApplicable == 1) < 0) {
      this._trnMainService.expensesAccountFromTranTranList();
      this._trnMainService.partyListFromTrnTranList();
      if (this._trnMainService.EnteredSupplierAcList.length <= 0) {
        this.alertService.error("Party not found...");
        return;
      }

      if (this._trnMainService.TrnMainObj.gstInfoOfAccount == null) {
        this._trnMainService.TrnMainObj.gstInfoOfAccount = <any>{};
      }
      if (this._trnMainService.TrnMainObj.gstInfoOfAccount.GSTLIST == null) {
        this._trnMainService.TrnMainObj.gstInfoOfAccount.GSTLIST = [];
      }
      if (this._trnMainService.GSTSETUPOBJ == null) {
        this._trnMainService.GSTSETUPOBJ = <any>{};
      }

      if (this._trnMainService.TrnMainObj.gstInfoOfAccount.TRNTYPE == null) {
        this._trnMainService.TrnMainObj.gstInfoOfAccount.TRNTYPE = "local";
      }
      if (this._trnMainService.TrnMainObj.REVCHARGE == null) { this._trnMainService.TrnMainObj.REVCHARGE = 'N'; }
      this.showgstsetuponAccount = true;
      if (this._trnMainService.TrnMainObj.gstInfoOfAccount.PARAC == null) {
        let aa = this._trnMainService.EnteredSupplierAcList[0];
        if (aa != null) {
          this._trnMainService.TrnMainObj.gstInfoOfAccount.PARAC = aa.ACID;
        }

      }
      if (this._trnMainService.TrnMainObj.gstInfoOfAccount.NETAMNT == null || this._trnMainService.TrnMainObj.gstInfoOfAccount.NETAMNT == 0) {
        this._trnMainService.TrnMainObj.gstInfoOfAccount.NETAMNT = 0;
        this._trnMainService.TrnMainObj.TrntranList.forEach(x => { this._trnMainService.TrnMainObj.gstInfoOfAccount.NETAMNT += x.DRAMNT });
      }
    }
    else {
      this._trnMainService.AutoGstPreparation();
    }
    this.showgstsetuponAccount = true;
  }
  ReverseChargeApplicablecheck(e) {
    if (e.target.checked) { this._trnMainService.TrnMainObj.REVCHARGE = "Y"; }
    else { this._trnMainService.TrnMainObj.REVCHARGE = "N"; }
  }
  gstchange() {
    this.TaxAmountCalculateForGST();
  }
  TaxAmountCalculateForGST() {
    if (this._trnMainService.GSTSETUPOBJ.GST > 0 && this._trnMainService.GSTSETUPOBJ.GSTRATE > 0) {
      this._trnMainService.GSTSETUPOBJ.AMOUNT = this._trnMainService.GSTSETUPOBJ.GST * 100 / this._trnMainService.GSTSETUPOBJ.GSTRATE;
    }
  }
  AddGstObj() {
    this.TaxAmountCalculateForGST();
    this._trnMainService.GSTSETUPOBJ.REFTRNAC_NAME = this._trnMainService.EnteredExpensesAcList.filter(x => x.ACID == this._trnMainService.GSTSETUPOBJ.REFTRNAC)[0].ACNAME;
    this._trnMainService.TrnMainObj.gstInfoOfAccount.GSTLIST.push(this._trnMainService.GSTSETUPOBJ);
    this._trnMainService.GSTSETUPOBJ = <any>{};
  }
  cancelGstSetUp() {
    this._trnMainService.TrnMainObj.gstInfoOfAccount = <any>{};
    this._trnMainService.TrnMainObj.gstInfoOfAccount.GSTLIST = [];
    this._trnMainService.GSTSETUPOBJ = <any>{};
    this.showgstsetuponAccount = false;
  }
  OkGstSetUp() {
    this.showgstsetuponAccount = false;
  }


  onGstItcReversal() {
    let gstItcList = [
      { SNO: 1, DECSRIPTION: "Amount in terms of rule 37(2)", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 },
      { SNO: 2, DECSRIPTION: "Amount in terms of rule 42(1)(m)", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 },
      { SNO: 3, DECSRIPTION: "Amount in terms of rule 43(1)(h)", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 },
      { SNO: 4, DECSRIPTION: "Amount in terms of rule 42(2)(a)", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 },
      { SNO: 5, DECSRIPTION: "Amount in terms of rule 42(2)(b)", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 },
      { SNO: 6, DECSRIPTION: "On account of amount paid subsequent to reversal of ITC", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 },
      { SNO: 7, DECSRIPTION: "Any other liability(Specify)", MODE: "add", ITC_INTEGRATED: 0, ITC_CENTRAL: 0, ITC_STATE: 0, ITC_CESS: 0 }
    ];
    if (this._trnMainService.TrnMainObj.gstItcReversalList != null && this._trnMainService.TrnMainObj.gstItcReversalList.length > 0) {

      for (var g of gstItcList) {
        for (var f of this._trnMainService.TrnMainObj.gstItcReversalList) {
          if (g.SNO == f.SNO) {
            g.MODE = f.MODE;
            g.ITC_INTEGRATED = f.ITC_INTEGRATED;
            g.ITC_CENTRAL = f.ITC_CENTRAL;
            g.ITC_STATE = f.ITC_STATE;
            g.ITC_CESS = f.ITC_CESS;
          }
        }
      }

    }
    this._trnMainService.TrnMainObj.gstItcReversalList = gstItcList;
    this.showgstItcReversalPopup = true;
  }
  cancelGstItcReversal() {
    this._trnMainService.TrnMainObj.gstItcReversalList = [];
    this.showgstItcReversalPopup = false;
  }
  OkGstItcReversal() {
    this.showgstItcReversalPopup = false;
  }

  isFormValid: boolean;
  formValidCheck = (): boolean => {
    if (this._trnMainService.Warehouse == undefined || this._trnMainService.Warehouse == '') {
      return false;
    }
    if (this._trnMainService.TrnMainObj.ProdList == undefined) {
      return false;
    }
    else {
      if (this._trnMainService.TrnMainObj.ProdList.length < 1) {
        return false;
      }
    }
    return true;
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "ShiftLeft" || $event.code == "ShiftRight") {
      $event.preventDefault();
      this.showSecondaryButtons = true;
    }
    if ($event.code == "Delete") {
      $event.preventDefault();
      this.showSecondaryButtons = false;
    }
    else if ($event.code == "F3") {
      $event.preventDefault();
      this.onNewClick();
    } else if ($event.code == "F6") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.Mode != 'VIEW') {
        if(this._trnMainService.disableSaveButton!=true){
          this.onSaveClicked();
        }
      }
    } else if ($event.code == "F8") {
      $event.preventDefault();
      this.onPrintClicked();
    } else if ($event.code == "F10") {
      $event.preventDefault();
      this.onBackClicked();
    } else if ($event.code == "F5" && this._trnMainService.TrnMainObj.VoucherType!= 15 && this._trnMainService.TrnMainObj.VoucherType!= 16) {
      $event.preventDefault();
      this.onEditClicked();
    } else if ($event.code == "F4") {
      $event.preventDefault();
      this.onViewClicked();
    } else if ($event.code == "F7" && this.userSetting.ENABLEBILLTRACKING==1) {
      $event.preventDefault();
      this.BillTrack();
    }
    else if ($event.code == "shift+del") {
      ////console.log("detect shift del");
    }else if ($event.code == "F1") {
      if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay){
        $event.preventDefault();
        this.masterService.ShowMore = !this.masterService.ShowMore;
      }
    }


  }
  @HostListener("document : keyup", ["$event"])
  handleKeyUpboardEvent($event: KeyboardEvent) {
    if ($event.code == "ShiftLeft" || $event.code == "ShiftRight") {
      $event.preventDefault();
      this.showSecondaryButtons = false;
    }
    if ($event.code == "Delete") {
      $event.preventDefault();
      this.showSecondaryButtons = true;
    }
  }
  //  // if (this._authService.checkMenuRight("stock-issue", "add") == true) {
  //   this._router.navigate(["/pages/transaction/inventory/stock-issue/add-stock-issue", { vt: 5, mode: "add", returnUrl: this._router.url }])
  //   // } else {
  //   //   this.messageSubject.next("You are not authorized to add stock issue.");
  //   //   this.openAuthDialog();
  //   // }
  onEditClicked() {
    this.masterService.addnMode = 'EDIT'
    this._trnMainService.replicateVoucher = false;
    this.showVoucherReplicateButton = false;
    this._trnMainService.disableSaveButton=false; //Enable Save Button
    if (this._trnMainService.DrillMode && this._trnMainService.DrillMode.toUpperCase() == "DRILL") {
      if (this.masterService.userSetting.userwisedivision == 1) {

        // if (this.masterService.SelectedDivReport != this.masterService.userProfile.CompanyInfo.Initial) {
        //   this.alertService.warning("You are not authorized to Edit from another Division");
        //   return;
        // }
        this.masterService.getAccListDivision().subscribe(data => {
          if (data.status == 'ok') {
            var filterdataObj = data.result.filter(x => x.DIVISION == this.masterService.SelectedRepDiv)[0]
            if (filterdataObj.ISSELECTED == 0) {
              this.alertService.warning("You are not authorized to edit");
            }
            else {
              this.ConfirmEdit();
            }

          }
        })
      }
      else {
        this.ConfirmEdit();
      }

    }
    else {
      // if (this.userSetting.EnableLatePost == 1) {
      //   if (this.userProfile.LATEPOSTEDIT == 0) {
      //     this.alertService.warning("You are not authorized to edit.");
      //     return;
      //   }
      // }

      if (this.CheckMenuRights(this.activeUrlPage, "edit") == true) {
        // this._trnMainService.TrnMainObj.Mode = "EDIT";
        if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.PostDirectory || this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal ||this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ){
          this.masterService.LatePostDatedinRVPV(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res=>{
            if(res.status == 'ok'){
              if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal){
                this.masterService.PIVoucherDetail(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res => {
                  if (res.status == "ok") {
                      if (res.result && res.result.length && res.result.length > 0) {
                            this.alertService.info(`This voucher ${this._trnMainService.TrnMainObj.VCHRNO} has been used for local purchase cost allocation.`);
                            return;
                      }else{
                        this.ConfirmEdit();
                      }
                  }
              }, err => {
                  this.alertService.info(err);
              })
              }else{
                this.ConfirmEdit();
              }
            }else{
              this.alertService.info("This voucher cannot be edited.");
              return;
            }
          })
        } else if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.PaymentVoucher){
          this.masterService.CheckIfRefbillIsCellpay(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res=>{
            if(res.status == 'ok'){
              this.ConfirmEdit();
            }else{
              this.alertService.info("This voucher cannot be edited.");
              return;
            }
          })
        }
        else if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.Cellpay){
          this.masterService.CheckCellPayPaymentDone(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res=>{
            if(res.status == 'ok'){
              this.ConfirmEdit();
            }else{
              this.alertService.info("This voucher cannot be edited.");
              return;
            }
          })
        }else if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.CapitalVoucher){
          this.masterService.PIVoucherDetail(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res => {
            if (res.status == "ok") {
                if (res.result && res.result.length && res.result.length > 0) {
                      this.alertService.info(`This voucher ${this._trnMainService.TrnMainObj.VCHRNO} has been used for local purchase cost allocation.`);
                      return;
                }else{
                  this.ConfirmEdit();
                }
            }
        }, err => {
            this.alertService.info(err);
        })
        }
        else{
          this.ConfirmEdit()
        }
      }
    }

    this.inputDisabled = false;


  }
  ConfirmEdit() {
    if (this._trnMainService.TrnMainObj.Mode) {
      if (this._trnMainService.TrnMainObj.Mode.toLocaleUpperCase() == "VIEW") {
        if (confirm('Are you sure you want to edit the voucher?')) {
          this._trnMainService.buttonClickMode = "EDIT";
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
            this._trnMainService.CapitalBudgetData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID);
          } else {
            this.masterService.CheckPost(this.masterService.VCHR).subscribe(res=>{
              if(res.status == 'ok'){
             this.loadVoucher(this._trnMainService.TrnMainObj);
              }else{
                if (this.userSetting.EnableLatePost == 1) {
                  if (this.userProfile.LATEPOSTEDIT == 1) {
                    this.loadVoucher(this._trnMainService.TrnMainObj);
                    return;
                  }
                  this.alertService.info("This Voucher"+this.masterService.VCHR+ "has been posted so it cannot be edited");
                  return;
            //this.loadVoucher(this._trnMainService.TrnMainObj);
              }
            }});}}
      } else {
        this._trnMainService.buttonClickMode = "EDIT";

        if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN") {
          this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "cnlistforview");
        }
        else if (this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
          this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "dnlistforview");
        } else if (this._trnMainService.TrnMainObj.VoucherType == 12) {
          this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings(
            this._trnMainService.TrnMainObj.VoucherPrefix, this._trnMainService.TrnMainObj.VoucherPrefix,"journal");
          this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "journal");   
        }
        else {
          this.genericGrid.show();

        };

      }
    }
  }

  BillTrack() {
    this.onBillTrackEmit.emit(true)
  }






  onBackClicked() {
    this._trnMainService.replicateVoucher = false;
    this.showVoucherReplicateButton = false;
    this.router.navigate([this.returnUrl]);
  }

  onCancelClicked() {
    // alert("inside the delete");
    if (this.userProfile.CompanyInfo.FYClose == 1) {
      this.alertService.warning("Fiscal Year Book '" + this.masterService.PhiscalObj.PhiscalID + "' is already closed! Hence, Cannot do further transaction")
      return;
    }
    this._trnMainService.replicateVoucher = false;
    this.showVoucherReplicateButton = false;
   
    if (this.CheckMenuRights(this.activeUrlPage, "delete") == true) {
      if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost){

      }else{
        let trntrn = this._trnMainService.TrnMainObj.TrntranList.filter(x => x.ACNAME != "" && x.ACNAME != null && x.ACNAME != undefined);
      if (trntrn.length == 0) {
        this.alertService.error("Please load Voucher to Cancel");
        return;
      }
      }    

      if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.PostDirectory){
        this.masterService.LatePostDatedinRVPV(this._trnMainService.TrnMainObj.VCHRNO).subscribe(res=>{
          if(res.status == 'ok'){
            let data = <any>{};
            data.VoucherType = this._trnMainService.TrnMainObj.VoucherType;
            data.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            data.MODE = "CANCEL";
            data.VoucherPrefix = this._trnMainService.TrnMainObj.VoucherPrefix;
            if (confirm("Are you sure to cancel this voucher?")) {
              // alert("alert 1")
              this.loadingService.show(`Cancelling Voucher ${data.VCHRNO}. Please Wait.`);
              this.masterService.cancelAccoutingVoucher(data).subscribe((res) => {
                this.loadingService.hide();
                if (res.status == "ok") {
                  this.alertService.success(res.result);
                  this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
                } else {
                  this.alertService.error(res.result);
                }
              }, error => {
                this.loadingService.hide();
                this.alertService.error(error);
              })
            }
            }else{
            this.alertService.info("This voucher cannot be deleted.");
            return;
          }
        })
      }else{
        var _cancelMessage="Are you sure to cancel this voucher?";
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost) {
          _cancelMessage = "Are you sure to cancel this voucher?" + "\n" +
            "1. Data will not be recovered." + "\n" +
            "2. Changes in rates will be done." + "\n" +
            "3. System will not be responsible for changes in rates if the reports are already submitted to VAT.";
        }
        let data = <any>{};
        data.VoucherType = this._trnMainService.TrnMainObj.VoucherType;
        data.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
        data.MODE = "CANCEL";
        data.VoucherPrefix = this._trnMainService.TrnMainObj.VoucherPrefix;
        this.masterService.CheckPost(data.VCHRNO).subscribe(res=>{
          if(res.status == 'ok'){
        if (confirm(_cancelMessage)) {
          // alert("alert 2")
          // this.addNewUnit = true;
          // return;
          this.loadingService.show(`Cancelling Voucher ${data.VCHRNO}. Please Wait.`);
          this.masterService.cancelAccoutingVoucher(data).subscribe((res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
              this.alertService.success(res.result);
              this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
              this.onNewClick();
            } else {
              this.alertService.error(res.result);
            }
          }, error => {
            this.loadingService.hide();
            this.alertService.error(error);
          })
        }
      }else{
        if (this.userSetting.EnableLatePost == 1) {
          if (this.userProfile.LATEPOSTEDIT == 1) {
        if (confirm(_cancelMessage)) {
          // alert("alert 3");
          this.loadingService.show(`Cancelling Voucher ${data.VCHRNO}. Please Wait.`);
          this.masterService.cancelAccoutingVoucher(data).subscribe((res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
              this.alertService.success(res.result);
              this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
            } else {
              this.alertService.error(res.result);
            }
          }, error => {
            this.loadingService.hide();
            this.alertService.error(error);
          })
          return;
        }
      }}
      this.alertService.info("This Voucher"+data.VCHRNO+ "has been posted so it cannot be deleted");
      return;
    }
      })
    }
    }
  }

  PrintYes() {
    this.DeleteAcc.hide();
    this.promptPrintDeviceAfterSave = true;
  }
  PrintNo() {
    this.DeleteAcc.hide();
    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher){
      this.showPrintReceipt=true;
    }
    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher){
      this.showPrintPayslip=true;
    }
  }


  CheckMenuRights(activePage, mode) {
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
  CheckMenuRights_DivWise(activePage, mode) {
    var Checkright = this.authservice.getMenuRight_DivWise(activePage, mode)
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

  onReplicateClick() {
    this._trnMainService.replicateVoucher = true;
    if (confirm("Are you sure to replicate this voucher?")) {
      this._trnMainService.loadData(this.vouchernois, this.division, this.phiscalid);
      this.showVoucherReplicateButton = false;
    } else {
      this.showVoucherReplicateButton = true;
    }
  }

  SelectedPopupDate: any;
  SelectDate() {
    this.SelectedPopupDate = this._trnMainService.transformDate(new Date());
    this.ShowDate.show();


  }
  ShowDateOk() {
    this.masterService.getReceiveLogDataFromDate(this.SelectedPopupDate, 'RV',
      this.paymentmode).subscribe((x => {
        // ////console.log("CheckValue",x);
        if (x.status == 'ok') {

          if (x.result.length == 0) {
            this.ShowDate.hide();
            this.alertService.info(`No data found on ${this.SelectedPopupDate}`);
            return;
          }
          this._trnMainService.TrnMainObj.TrntranList.splice(0);

          if (x.result) {
            for (let i of x.result) {
              var val: any = <any>{ AccountItem: <TAcList>{} }
              var AccountItem: TAcList = <TAcList>{};

              val.AccountItem.ACNAME = i.customerName;
              val.AccountItem.ACID = i.ACID;
              val.CRAMNT = i.Amount;
              val.CostCenter = i.CostCenter;
              if (i.PaymentMode == "Cheque") {
                val.NARATION1 = "cheque";
                val.ChequeDate = this._trnMainService.transformDate(i.ChequeDate);
              } else {
                val.NARATION1 = i.PaymentMode;
              }
              val.ChequeNo = i.ChequeNo;
              val.guid = i.GUID;
              //   val.ChequeDate = this._trnMainService.transformDate(i.ChequeDate);
              val.DRAMNT = 0;
              // val.PartyDetails=[];
              // val.ROWMODE = "new";
              val.disableSubLedger = true;
              val.editMode = true;
              val.inputMode = true;
              val.A_ACID = i.ACID;
              if (this._trnMainService.userSetting.enableSalesman == 1) {
                val.SALESMAN = i.CostCenter;
              }


              // ////console.log("@@val.A_ACID",val.A_ACID)
              if (val.A_ACID) {
                if (val.A_ACID != null) {
                  this._trnMainService.TrnMainObj.TrntranList.push(val)
                }

              }


            }
            // this.AddCredit();
            ////console.log("@@CheckAssighValue", this._trnMainService.TrnMainObj.TrntranList)
          }

          this.ShowDate.hide();

        }
      }))
  }

  ShoWdateClose() {
    this.ShowDate.hide()

  }
  BillList: any[] = [];
  BillList_1:any[]=[];
  clickPostDate() {
    this.isActive = true;
    this.Voucher_Type="Party Payment";
    this.FromPostDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.ToPostDate = this._trnMainService.transformDate(new Date());
    // this.LoadPostDateData()
    if(this.PDC_LoadedClick==true){
      let phiscalid=this.masterService.PhiscalObj.PhiscalID;
      this.isValueLoaded = false;
      this.gettingMessage = 'getting data please wait..';
      this.masterService.LoadPostDirectory(this.FromPostDate, this.ToPostDate,this.PartyID,this._trnMainService.TrnMainObj.VoucherPrefix,phiscalid,this.Voucher_Type).subscribe(res => {
        this.BillList = res.result;
        if (res.result.length == 0) {
          this.isValueLoaded = false;
          this.gettingMessage = 'data not found!'
        }else{
          this.isValueLoaded = true;
        }
        if(this.Voucher_Type=="Expenses Voucher"){
          this.BillList_1 = res.result;
        }else{
          this.BillList_1 = res.result && res.result.length > 0 && res.result.filter(x=>x.ACID.startsWith('PA'))
        }
        this.BillList_1.forEach(x => { //by Riju on v7(4) branch
          this._trnMainService.TrnMainObj.TrntranList.forEach(y=>{
            // console.log("x.ACID",x.ACID);
            // console.log("Y.A_ACID",y.A_ACID);
            let _index=this.BillList_1.findIndex(x=>x.ACID==y.A_ACID);
            if(_index>=0){
              this.BillList_1.splice(_index,1);
            }
            if(y.A_ACID==x.ACID){
              x.checkbox=true;
            }else{
              x.checkbox = false;
            }
          })
          
        });
      });
    }else{
      this.resetall();
    }
  }
  // LoadCashCollection(){
  //   this.CashCollActive = true;
  //   // this.LoadPostDateData()
  //   // if(this.PDC_LoadedClick==true){
  //     if(this.CashCollActive == true){
  //     this.isCashCollecValueLoaded = false;
  //     this.gettingMessage = 'getting data please wait..';

    
  //     this.masterService.LoadCashCollection (this.FromCashCollectionDate, this.ToCashCollectionDate).subscribe(res => {
  //       console.log('resdate', res)
  //       this.CashCollectionList = res.result;
  //       console.log('resdate', this.CashCollectionList)
  //       if (res.result.length == 0) {
  //         this.isCashCollecValueLoaded = false;
  //         this.gettingMessage = 'data not found!'
  //       }else{
  //         this.isCashCollecValueLoaded = true;
  //       }
        
  //     });
  //   }else{
  //     this.resetall();
  //   }

  // }
  HidePostDate() {
    this.isActive = false;
    this.CashCollActive = false;
    this.PDC_LoadedClick=true;
    // this.resetall(); //by Riju on v7(4) branch
  }

  // LoadCashCollectionDateData(){
  //   this.isCashCollecValueLoaded = false;
  //   this.gettingMessage = 'getting data please wait..'
  //   this.masterService.LoadCashCollection (this.FromCashCollectionDate, this.ToCashCollectionDate).subscribe(res => {
  //     this.BillList = res.result;
     
  //     if (res.result.length == 0) {
  //       this.isValueLoaded = false;
  //       this.gettingMessage = 'data not found!'
  //     }else{
  //       this.isCashCollecValueLoaded = true;
  //     }
  //   });

  // }

  LoadPostDateData() {
    let phiscalid=this.masterService.PhiscalObj.PhiscalID;
    this.isValueLoaded = false;
    this.gettingMessage = 'getting data please wait..'
    this.masterService.LoadPostDirectory(this.FromPostDate, this.ToPostDate,this.PartyID,this._trnMainService.TrnMainObj.VoucherPrefix,phiscalid,this.Voucher_Type).subscribe(res => {
      this.BillList = res.result;
      if(this.Voucher_Type=="Expenses Voucher"){
        this.BillList_1 = res.result;
      }else{
        this.BillList_1 = res.result && res.result.length > 0 && res.result.filter(x=>x.ACID.startsWith('PA'))
      }
      if (res.result.length == 0) {
        this.isValueLoaded = false;
        this.gettingMessage = 'data not found!'
      }else{
        this.isValueLoaded = true;
      }
    });
  }
  clickCheckBox(index) {
    for (let i of this.BillList_1.filter(x => x.checkbox == true)) {

      if (i.ChequeDate && index.ChequeDate) {
        if (i.ChequeDate == index.ChequeDate) {
          i.checkbox = true;
          this.BillList[index].checkbox= true;
        } else {
          i.checkbox = false; //by Riju on v7(4) branch
          this.BillList[index].checkbox= false;
        }
      } else {
        i.checkbox = false; //by Riju on v7(4) branch
        this.BillList[index].checkbox= false;
      }
    }
  }

  okClick() {
    // var guid = null;
    // const uuidV1 = require('uuid/v1');
    // guid = uuidV1();
    this.PDC_LoadedClick=true;
    let checked_list = this.BillList.filter(x => x.checkbox == true);
    //console.log("checked_list",checked_list)
    this._trnMainService.TrnMainObj.TrntranList.splice(0);
    // this.BillList.forEach(x=>{
    //   if(checked_list[0].VCHRNO == x.VCHRNO){
    //     x.checkbox = true;
    //   }
    // })
    //console.log("BillList",this.BillList)
    for (let i of this.BillList.filter(x => x.checkbox == true)) {
      //console.log("@@i", i)

      var val: any = <any>{ AccountItem: <TAcList>{} }
      var AccountItem: TAcList = <TAcList>{};

      this._trnMainService.TrnMainObj.CHALANNO = i.VCHRNO;
      this._trnMainService.TrnMainObj.REMARKS = i.REMARKS;
      this._trnMainService.TrnMainObj.TRNAC = i.TRNAC;
      this._trnMainService.TrnMainObj.TRNACName = i.TRNACNAME;
      this._trnMainService.TrnMainObj.TRNMODE = i.TRNMODE;
      this._trnMainService.TrnMainObj.BILLTO = i.BILLTO;
      this._trnMainService.TrnMainObj.HASSUBLEDGER = i.HASSUBLEDGER;
      this._trnMainService.TrnMainObj.NETAMNT=this._trnMainService.TrnMainObj.TOTAMNT=i.DRAMNT>0?i.DRAMNT:i.CRAMNT;
      this.masterService.postdatedvoucher = true;
      val.AccountItem.ACNAME = i.ACNAME;
      val.AccountItem.ACID = i.ACID;
      val.CostCenter = i.CostCenter;
      ////console.log("@@i.ChequeDate", i.ChequeDate)
      if (i.ChequeDate != null && i.ChequeDate != undefined) {
        val.ChequeDate = this._trnMainService.transformDate(i.ChequeDate);
        this._trnMainService.TrnMainObj.TRN_DATE = this._trnMainService.transformDate(i.ChequeDate);
        // this._trnMainService.TrnMainObj.TRNDATE = this._trnMainService.transformDate(i.ChequeDate);
        this.changeEntryDate(val.ChequeDate, "AD");
      }
      val.NARATION = i.NARRATION;
      val.NARATION1 = 'cheque';
      val.ChequeNo = i.ChequeNo;
      val.guid = i.guid;
      // ////console.log("@@this.activeUrlPage",this.activeUrlPage)
      if (this.activeUrlPage == 'expense-voucher') {
        val.CRAMNT = i.CRAMNT;
        val.DRAMNT = i.DRAMNT;
      } else if (this.activeUrlPage == 'income-voucher') {
        val.CRAMNT = i.CRAMNT;
        val.DRAMNT = i.DRAMNT;
        

      }
      val.disableSubLedger = true;
      val.editMode = true;
      val.inputMode = true;
      val.A_ACID = i.ACID;
      val.OPPREMARKS = i.OPPREMARKS;
      val.POSTDATEVOUCHERNO = i.VCHRNO;
      if (this._trnMainService.userSetting.enableSalesman == 1) {
        val.SALESMAN = i.CostCenter;
      }
      val.SL_ACID=i.SL_ACID;
      val.SL_ACNAME=i.SL_ACNAME;

      // ////console.log("@@val.A_ACID",val.A_ACID)
      if (val.A_ACID) {
        if (val.A_ACID != null) {
          this._trnMainService.TrnMainObj.TrntranList.push(val)
        }
for(let x of  this._trnMainService.TrnMainObj.TrntranList){
  x.acitem=x.AccountItem;
}
      }
      this._trnMainService.calculateDrCrDifferences();
    }
    this.isActive = false;
    // this.resetall(); //by Riju on v7(4) branch
  }
  okClickCashCollection(){
    
    this._trnMainService.TrnMainObj.TrntranList.splice(0);
    for (let i of this.CashCollectionList.filter(x => x.checkbox == true)) {
      this._trnMainService.TrnMainObj.TRNACName = i.CASHBANK_ACNAME;
      this._trnMainService.TrnMainObj.TRNAC = i.CASHBANK_ACID;
      this._trnMainService.TrnMainObj.REMARKS = i.REMARKS;

      var val: any = <any>{ AccountItem: <TAcList>{} }
      var AccountItem: TAcList = <TAcList>{};
      val.AccountItem.ACNAME = i.CUSTOMER_ACNAME;
      val.AccountItem.ACID = i.CUSTOMER_ACID;
      val.NARATION = i.REMARKS;
      val.CRAMNT = i.CASH_COLLECTION;
      val.ROWMODE="new";
       this._trnMainService.TrnMainObj.TrntranList.push(val)
    }

    for(let x of  this._trnMainService.TrnMainObj.TrntranList){
      x.acitem=x.AccountItem;
    }
    this._trnMainService.calculateDrCrDifferences();
    this.CashCollActive = false;

  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this._trnMainService.TrnMainObj.BSDATE = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '-' + bsDate.en.month + '-' + bsDate.en.year;
    }
  }


  resetall() {
    this.BillList = [];
    this.BillList_1 = [];
    this.PartyID = "";
    this.PartyName = "";
    this.Voucher_Type="Party Payment";
    this.FromPostDate = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.ToPostDate = this._trnMainService.transformDate(new Date());;
    this.LoadPostDateData()
  }

  onReworkClicked() {
    if (confirm('Are you sure you want to rework(the voucher data will be flush)?')) {
      this.additionalCostService.addtionalCostList = []
      this.additionalCostService.IndividualCostList = [];
      this._trnMainService.TrnMainObj.TrntranList = []
      this.additionalCostService.costdetail = []
      // this.additionalCostService.costList = []
      this.masterService.importDocumentDetailsObj = new importdocument;
      this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettingsForAdditionalCostReWork()
      this.genericGridRefBill.show();
    }
  }
  onRefBillSelected(value) {
    // //console.log("ChecKValue",value)
    this.masterService.RefObj.Refno = value.VCHRNO;
    this.masterService.RefObj.disable = true;
    this._trnMainService.TrnMainObj.REFBILL = value.VCHRNO;
    this.getAdditionalCost(value)

  }
  getAdditionalCost(value) {
    this.loadingService.show("please wait. Getting purchase invoice data..")
    //  this.additionalCostService.loadPurchase(value,this.form.value.DIVISION.INITIAL,this.phiscalid)
    let VCHR = value.VCHRNO
    let division = value.DIVISION;
    let phiscalid: any;

    // this._trnMainService.trnmainBehavior= new BehaviorSubject(<TrnMain>{});
    //   this._trnMainService.loadData(VCHR, division, phiscalid);
    this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe((data: any) => {
      if (data) {
        try {
          // this._additionalCostService.costList = [];
          this._additionalCostService.costdetail = [];
          this._additionalCostService.addtionalCostList = [];
          this._additionalCostService.IndividualCostList = [];
          this.additionalCostService.tempIndCostList=[];
          for (let i of data.result.ProdList) {
            var acs: prodCost = <prodCost>{
              mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
              quantity: i.REALQTY_IN, rate: i.RATE, amount: i.AMOUNT, nAmount: i.NETAMOUNT, batch: i.BATCH
            };
            this._additionalCostService.addtionalCostList.push(acs);
          }
          //total amount
          this._additionalCostService.loadedTrnmain = data.result;
          //console.log("additionalCstService", this._additionalCostService.loadedTrnmain)
          this.loadingService.hide();
        }
        catch (ex) { }

      }
      else {
        alert("Cannot Get Data from Bill no.")
      }

      //console.log({ trnMAIN00000000000000: this._trnMainService.TrnMainObj });
    })


  }

  viaCellPayClick() {
    this.VerifySingleOrBulk()
  }

  VerifySingleOrBulk() {

    var FilterValue = this._trnMainService.TrnMainObj.TrntranList.filter(x => x.acitem);
    // //console.log("CheckData#",FilterValue, this._trnMainService.TrnMainObj)
    let count = 0;
    const dataList = [];
    FilterValue.forEach(x => {

      if (x.NARATION1 == "e-transfer") {
        count += 1;
      }

    })
    FilterValue.forEach(x => {
      // //console.log("count",count,x)
      if (count == 1) {
        if (x.NARATION1 == "e-transfer") {
          let passObj: any = <any>{};
          passObj.description = x.acitem.ACNAME;
          passObj.amount = this._trnMainService.TrnMainObj.VoucherPrefix == "RV" ? x.CRAMNT : x.DRAMNT
          passObj.invoice_number = this._trnMainService.TrnMainObj.VCHRNO;
          // return;
          this.ClickCellPay(passObj)
          // //console.log("CheckValue",passObj)

        }
        else {
          this.alertService.warning("Cannot do payment via CellPay");
        }
      }
      else if (count > 1) {
        if (x.NARATION1 == "e-transfer") {

          var dataObj: any = <any>{};
          dataObj.id = 1;
          dataObj.merchantName = x.acitem.ACNAME;
          dataObj.merchantAccount = this._trnMainService.TrnMainObj.TRNACName;
          dataObj.bankCode = "SIDH";
          dataObj.amount = this._trnMainService.TrnMainObj.VoucherPrefix == "RV" ? x.CRAMNT : x.DRAMNT;
          dataObj.description = x.NARATION;
          dataObj.invoiceNumber = x.ChequeNo;
          dataObj.paymentStatus = "False";
          dataList.push(dataObj);



        }
      }
      else {
        this.alertService.warning("Cannot do payment via CellPay");
      }

    })
    if (count > 1) {
      let passObj: any = <any>{};
      passObj.merchant_code = "IMS";
      passObj.secret_key = "123123123";
      passObj.voucher_id = this._trnMainService.TrnMainObj.VCHRNO;
      passObj.invoice_number = this._trnMainService.TrnMainObj.VCHRNO;
      passObj.is_live = "false";
      this.BulkCellPay(passObj, dataList)
    }


  }
  ClickCellPay(passObj) {
    const form = document.createElement('form');
    form.method = "POST";
    form.target = "_blank"
    form.action = "https://cellpay.com.np/cpay/submit";
    const hiddenField = document.createElement('input');
    hiddenField.type = 'text';
    hiddenField.name = "merchant_id";
    hiddenField.value = "9801977888";

    const hiddenField1 = document.createElement('input');
    hiddenField1.type = 'text';
    hiddenField1.name = "description";
    hiddenField1.value = passObj.description.toString();

    const hiddenField2 = document.createElement('input');
    hiddenField2.type = 'text';
    hiddenField2.name = "amount";
    hiddenField2.value = passObj.amount.toString();

    const hiddenField3 = document.createElement('input');
    hiddenField3.type = 'text';
    hiddenField3.name = "invoice_number";
    hiddenField3.value = passObj.invoice_number.toString();

    const hiddenField4 = document.createElement('input');
    hiddenField4.type = 'text';
    hiddenField4.name = "transaction_type";
    hiddenField4.value = "1";

    const hiddenField5 = document.createElement('input');
    hiddenField5.type = 'text';
    hiddenField5.name = "success_callback";
    hiddenField5.value = "https://new1.cellpay.com.np/cpay/";

    const hiddenField6 = document.createElement('input');
    hiddenField6.type = 'text';
    hiddenField6.name = "failure_callback";
    hiddenField6.value = "Fail";


    const hiddenField7 = document.createElement('input');
    hiddenField7.type = 'text';
    hiddenField7.name = "cancel_callback";
    hiddenField7.value = "cancel";


    const hiddenField8 = document.createElement('input');
    hiddenField8.type = 'text';
    hiddenField8.name = "is_live";
    hiddenField8.value = "false";


    form.appendChild(hiddenField);
    form.appendChild(hiddenField1);
    form.appendChild(hiddenField2);
    form.appendChild(hiddenField3);
    form.appendChild(hiddenField4);
    form.appendChild(hiddenField5);
    form.appendChild(hiddenField6);
    form.appendChild(hiddenField7);
    form.appendChild(hiddenField8);
    document.body.appendChild(form);
    form.submit();
  }
  BulkCellPay(passObj, dataList) {
    // const dataList = [];
    // var dataObj:any=<any>{};
    // dataObj.id = 1;
    // dataObj.merchantName = "ASK company";
    // dataObj.merchantAccount = "001NIBLASK";
    // dataObj.bankCode = "NIBL";
    // dataObj.amount = "106";
    // dataObj.description = "To ask";
    // dataObj.invoiceNumber = "005";
    // dataObj.paymentStatus = "False";
    // dataList.push(dataObj);

    var merchant_data = JSON.stringify(dataList);
    //console.log("merchant_data", merchant_data);

    const form = document.createElement('form');
    form.method = "POST";
    form.target = "_blank"
    form.action = "https://cellpay.com.np/cpay/submitBulk";
    const hiddenField = document.createElement('input');
    hiddenField.type = 'text';
    hiddenField.name = "merchant_code";
    hiddenField.value = passObj.merchant_code;

    const hiddenField1 = document.createElement('input');
    hiddenField1.type = 'text';
    hiddenField1.name = "secret_key";
    hiddenField1.value = passObj.secret_key;

    const hiddenField2 = document.createElement('input');
    hiddenField2.type = 'text';
    hiddenField2.name = "voucher_id";
    hiddenField2.value = passObj.voucher_id;

    const hiddenField3 = document.createElement('input');
    hiddenField3.type = 'text';
    hiddenField3.name = "invoice_number";
    hiddenField3.value = passObj.invoice_number;

    const hiddenField4 = document.createElement('input');
    hiddenField4.type = 'text';
    hiddenField4.name = "is_live";
    hiddenField4.value = passObj.is_live;

    const hiddenField9 = document.createElement('input');
    hiddenField9.type = 'text';
    hiddenField9.name = "merchant_data";
    hiddenField9.value = merchant_data;

    const hiddenField5 = document.createElement('input');
    hiddenField5.type = 'text';
    hiddenField5.name = "success_callback";
    hiddenField5.value = "Sucess";

    const hiddenField6 = document.createElement('input');
    hiddenField6.type = 'text';
    hiddenField6.name = "cancel_callback";
    hiddenField6.value = "Failure";


    form.appendChild(hiddenField);
    form.appendChild(hiddenField1);
    form.appendChild(hiddenField2);
    form.appendChild(hiddenField3);
    form.appendChild(hiddenField4);
    form.appendChild(hiddenField5);
    form.appendChild(hiddenField6);
    form.appendChild(hiddenField9);
    document.body.appendChild(form);
    form.submit();
  }

  onPrintReceiptClicked() {
    let voucherno = this._trnMainService.TrnMainObj.VCHRNO;
    let _TrntranList = this._trnMainService.TrnMainObj.TrntranList;
    if (this._trnMainService.TrnMainObj.Mode == 'NEW') {
      voucherno = this.savedVchrno;
      _TrntranList = this.savedTrntrnlist;
    } else {
      voucherno = this._trnMainService.TrnMainObj.VCHRNO;
      _TrntranList = this._trnMainService.TrnMainObj.TrntranList;
    }
    if(_TrntranList && _TrntranList.length>1){
        this.alertService.info("Cannot generate receipt of voucher with more than 1 ledger.")
        return;
      }
    this.filename = 'RECEIPT.ims';
    this.rownumber = 0;

    this.changeCursor = true;
    this.masterService.getNumberToWords(voucherno, this.userProfile.CompanyInfo.INITIAL, this.masterService.PhiscalObj.PhiscalID, this.userProfile.CompanyInfo.COMPANYID,this._trnMainService.TrnMainObj.TRNMODE).subscribe(
      (res) => {
        if (res.status == "ok") {
          this.numtowords = res.result ? res.result[0].NUMTOWORDS : ' ';
          ////console.log("numtowords", this.numtowords);

          let userdivision = this.userProfile.userDivision ? this.userProfile.userDivision : this.userProfile.CompanyInfo.INITIAL;
          let ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
          this.masterService.getDetailsByUserDivision(userdivision).subscribe((res: any) => {
            if (res.status == "ok") {
              if (res.result && res.result.length > 0 && res.result[0] && res.result[0].COMADD) {
                ADDRESS = res.result[0].COMADD;
              }
              if (ADDRESS === null || ADDRESS === undefined || ADDRESS === '') {
                ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
              }

              let pdfPrintFormatParameters: any = <any>{}

              pdfPrintFormatParameters.DIVISION = this.userProfile.CompanyInfo.INITIAL;
              pdfPrintFormatParameters.PHISCALID = this.userProfile.CompanyInfo.PhiscalID;
              pdfPrintFormatParameters.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
              pdfPrintFormatParameters.COMPANYNAME = this.userProfile.CompanyInfo.NAME ? this.userProfile.CompanyInfo.NAME : ' ';
              pdfPrintFormatParameters.COMPANYADDRESS = ADDRESS ? ADDRESS : ' ';
              pdfPrintFormatParameters.PANNO = this.userProfile.CompanyInfo.VAT ? this.userProfile.CompanyInfo.VAT : ' ';
              pdfPrintFormatParameters.VCHRNO = voucherno ? voucherno : ' ';
              pdfPrintFormatParameters.TRNUSER = this.userProfile.username ? this.userProfile.username : ' ';
              pdfPrintFormatParameters.numtowords = this.numtowords ? this.numtowords : ' ';

              this.masterService.printPartyBalance(this.filename, pdfPrintFormatParameters).subscribe(
                (res) => {
                  const blobUrl = URL.createObjectURL(res.content);
                  const iframe = document.createElement('iframe');
                  iframe.style.display = 'none';
                  iframe.src = blobUrl;
                  document.body.appendChild(iframe);
                  iframe.contentWindow.print();
                  this.changeCursor = false;
                })
            }
          })
        }
      })
    this.changeCursor = false;
  }

  PrintReceiptYes() {
    this.onPrintReceiptClicked();
    this.showPrintReceipt=false;
  }
  PrintReceiptNo() {
    this.showPrintReceipt=false;
  }

  onPrintPayslipClicked(){
    let voucherno = this._trnMainService.TrnMainObj.VCHRNO;
    let _TrntranList = this._trnMainService.TrnMainObj.TrntranList;
    if (this._trnMainService.TrnMainObj.Mode == 'NEW') {
      voucherno = this.savedVchrno;
      _TrntranList = this.savedTrntrnlist;
    } else {
      voucherno = this._trnMainService.TrnMainObj.VCHRNO;
      _TrntranList = this._trnMainService.TrnMainObj.TrntranList;
    }

    if(_TrntranList && _TrntranList.length>1){
        this.alertService.info("Cannot generate payslip of voucher with more than 1 ledger.")
        return;
      }
    let division = this._trnMainService.TrnMainObj.DIVISION;
    let phiscalid = this._trnMainService.TrnMainObj.PhiscalID;
    let trnuser = this.userProfile.username;
    this.masterService.savePrintLog(voucherno, division,phiscalid, trnuser).subscribe((response) => {
      if (response.status == "ok") {
      this.masterService.getPrintTitleAsReprinted(voucherno, division, phiscalid, trnuser).subscribe((response) => {
        if (response.status == "ok") {
          let caption = response.result;
          this.onPrintPayslipPreview(caption);
        }
      })
    }
    })
   
  }

  onPrintPayslipPreview(caption) {
    let voucherno = this._trnMainService.TrnMainObj.VCHRNO;
    if (this._trnMainService.TrnMainObj.Mode == 'NEW') {
      voucherno = this.savedVchrno;
    } else {
      voucherno = this._trnMainService.TrnMainObj.VCHRNO;
    }
    this.filename = 'PAYSLIP.ims';
    this.rownumber = 0;

    this.changeCursor = true;
    this.masterService.getNumberToWords(voucherno, this.userProfile.CompanyInfo.INITIAL, this.masterService.PhiscalObj.PhiscalID, this.userProfile.CompanyInfo.COMPANYID,this._trnMainService.TrnMainObj.TRNMODE).subscribe(
      (res) => {
        if (res.status == "ok") {
          this.numtowords = res.result ? res.result[0].NUMTOWORDS : ' ';
          ////console.log("numtowords", this.numtowords);

          let userdivision = this.userProfile.userDivision ? this.userProfile.userDivision : this.userProfile.CompanyInfo.INITIAL;
          let ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
          this.masterService.getDetailsByUserDivision(userdivision).subscribe((res: any) => {
            if (res.status == "ok") {
              if (res.result && res.result.length > 0 && res.result[0] && res.result[0].COMADD) {
                ADDRESS = res.result[0].COMADD;
              }
              if (ADDRESS === null || ADDRESS === undefined || ADDRESS === '') {
                ADDRESS = this.userProfile.CompanyInfo.ADDRESS;
              }

              let pdfPrintFormatParameters: any = <any>{}

              pdfPrintFormatParameters.DIVISION = this.userProfile.CompanyInfo.INITIAL;
              pdfPrintFormatParameters.PHISCALID = this.userProfile.CompanyInfo.PhiscalID;
              pdfPrintFormatParameters.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
              pdfPrintFormatParameters.COMPANYNAME = this.userProfile.CompanyInfo.NAME ? this.userProfile.CompanyInfo.NAME : ' ';
              pdfPrintFormatParameters.COMPANYADDRESS = ADDRESS ? ADDRESS : ' ';
              pdfPrintFormatParameters.PANNO = this.userProfile.CompanyInfo.VAT ? this.userProfile.CompanyInfo.VAT : ' ';
              pdfPrintFormatParameters.VCHRNO = voucherno ? voucherno : ' ';
              pdfPrintFormatParameters.TRNUSER = this.userProfile.username ? this.userProfile.username : ' ';
              pdfPrintFormatParameters.numtowords = this.numtowords ? this.numtowords : ' ';
              pdfPrintFormatParameters.caption = caption ? caption : ' ';


              this.masterService.printPartyBalance(this.filename, pdfPrintFormatParameters).subscribe(
                (res) => {
                  const blobUrl = URL.createObjectURL(res.content);
                  const iframe = document.createElement('iframe');
                  iframe.style.display = 'none';
                  iframe.src = blobUrl;
                  document.body.appendChild(iframe);
                  iframe.contentWindow.print();
                  this.changeCursor = false;
                })
            }
          })
        }
      })
    this.changeCursor = false;
  }

  PrintPayslipYes() {
    this.onPrintPayslipClicked();
    this.showPrintPayslip=false;
  }
  PrintPayslipNo() {
    this.showPrintPayslip=false;
  }

  AccountEnterClicked() {
    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher){
      if(this.Voucher_Type=="Expenses Voucher"){
        this.gridPopupSettingsForPartyLedgerList = this.masterService.getGenericGridPopUpSettings('Expenses Voucher');
      }else{
        this.gridPopupSettingsForPartyLedgerList = this.masterService.getGenericGridPopUpSettings('Supplier');
      }
    }else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher){
      this.gridPopupSettingsForPartyLedgerList = this.masterService.getGenericGridPopUpSettings('Customer');
    }
    this.genericGridPartyLedger.show();
}

dblClickAccountSelect(account) {
    this.PartyID = account.ACID;
    this.PartyName= account.ACNAME;
}


onViewReverseClick(){
  // this._trnMainService.disableNepaliDate = true;
  // this._trnMainService.buttonMode = "VIEW";

  // this.billFormatsForPrint = null;
  // this._trnMainService.reverseViewTag = "REVERSEVIEW";
  let reversePrefix ="";
//console.log("@@this._trnMainService.TrnMainObj.VoucherPrefix",this._trnMainService.TrnMainObj.VoucherPrefix)
  // if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase){
  //   reversePrefix = "PX";
  // }
  if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote){
    reversePrefix = "RR";
  }
  // this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings("RR","RR");

  this.gridPopupReverseSettings = this.masterService.getGenericGridPopUpSettings(
    reversePrefix, reversePrefix
  );
  this.genericGridReverse.show();
 // this.onViewClicked();
}

onReverseEntry(){    
  //console.log("@@AllowReverseEntry",this.userProfile.AllowReverseEntry)
  if(this.userProfile.AllowReverseEntry == 0){
    this.alertService.info("No rights for Reverse Entry!!!");
    return;
  }else{
      if(this.userProfile.AllowReverseEntry == 1){
      this._trnMainService.reverseEntry(VoucherTypeEnum.CreditNote);
      this.masterService.checkDuplicateReverseEntry(this._trnMainService.TrnMainObj.VCHRNO).subscribe(
        (res:any)=>{
          if(res.status== "ok"){
            this.showReverseEntryAuth = true;
          }else{
            this.alertService.info("Voucher is already reversed");
          }
        },
        error =>{
          //console.log("err",error);
          this.alertService.info(error);
        }
      )
    }
  }
  
}

reverseEntryAuthConfirm(){
  this.loadingService.show("Authorizing Please wait...");
  this.masterService.reverseEntryAutorisation(this.reverseEntryAuthObj).subscribe(
    (data: any) => {
      this.loadingService.hide();
      if (data.status == "ok") {
        //console.log("data status succcess", data.status, data);
        alert("Authorization Sucessful");
        this.closeReverseEntryAuthPopup();
        this.openReverseEntry();
      }else{
        alert("User Not Found...Authorization Failed!");
      }
    }  
  );

  this.loadingService.hide();
}
openReverseEntry(){
  let billNo = this._trnMainService.TrnMainObj.VCHRNO;
  this.reverseEntryConfirm.show(billNo);
}

closeReverseEntryAuthPopup() {
  this.showReverseEntryAuth = false;
}


onClickReverseSave(){
  this._trnMainService.TrnMainObj.Mode = "NEW";
  this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = "REVERSE";
  this.onSaveClicked();
}

closeModal() {
  this.addNewUnit = false;
}

SaveRemarksDetails(){
//console.log("this.remarksfordeleteObj",this.remarksfordeleteObj);
this.closeModal();
}

changeVoucherType(){
  this.BillList=[];
  this.BillList_1=[];
  this.PartyName="";
  this.PartyID="";
}
onLoadJsonClicked(){

  // if(localStorage.getItem("ErrorJson"))
  // {

  //   let Trntran=JSON.parse(localStorage.getItem("ErrorJson"));
  //   let TrntranList=Trntran.TrntranList
  //   this._trnMainService.TrnMainObj.TrntranList=TrntranList;
  //   this._trnMainService.TrnMainObj.TrntranList.forEach(X=>X.ROWMODE="new")
  //   this._trnMainService.calculateCrDrTotal();
  // }else{
    this.loadingService.show("Loading data......")
    console.log(this._trnMainService.TrnMainObj.VoucherType)
    this.masterService.importJsonFileForTransaction(this._trnMainService.TrnMainObj.VoucherType).subscribe(data=>{
      if(data.status=="ok"){
      this.loadingService.hide()
      this._trnMainService.TrnMainObj.TrntranList=data.result.TrntranList;
      this._trnMainService.TrnMainObj.TrntranList.forEach(X=>X.ROWMODE="new")
      this._trnMainService.calculateCrDrTotal();
      }
    })
  // }
  // this.fileUploadPopup.show();
}
  // AddIndAdditionalData(i) {
  //   if (i.IND_DATA && i.IND_DATA.length > 0) {
  //     i.IND_DATA.forEach(element => {
  //       let NEWOBJ2 = <prodCost>{
  //         mcode: "", menucode: "", desca: "", unit: "",
  //         quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: "", indamount: 0
  //       }
  //       NEWOBJ2.mcode = element.mcode,
  //         NEWOBJ2.menucode = element.menucode,
  //         NEWOBJ2.desca = element.desca,
  //         NEWOBJ2.batch = element.batch,
  //         NEWOBJ2.rate = element.rate,
  //         NEWOBJ2.quantity = element.quantity,
  //         NEWOBJ2.amount = element.amount,
  //         NEWOBJ2.additionalcostac = element.additionalcostac,
  //         NEWOBJ2.batchid = element.batchid,
  //         NEWOBJ2.indamount = element.indamount,
  //       this.additionalCostService.IndividualCostList.push(NEWOBJ2);
  //     });
  //   }
  // }
  
fileUploadSuccess(uploadedResult) {

  if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
    return;
  }

  if (uploadedResult.status == "ok") {
    // console.log("@@uploadedResult",uploadedResult.result)
    if(this._trnMainService.TrnMainObj.VoucherType != VoucherTypeEnum.Journal){
      this.onNewClick();
    }
    this._trnMainService.TrnMainObj.TrntranList=[];
    this._trnMainService.TrnMainObj.TOTAMNT=0;
    this._trnMainService.TrnMainObj.NETAMNT=0;
    this._trnMainService.diffAmountItemForAccount = 0;
    this.masterService.tdsList=[];

    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal && uploadedResult.result.length){
      this._trnMainService.TrnMainObj.TRN_DATE = uploadedResult.result && uploadedResult.result.length && uploadedResult.result[0].trndate;
      this._trnMainService.TrnMainObj.TRNDATE = uploadedResult.result && uploadedResult.result.length && uploadedResult.result[0].entrydate;
      this._trnMainService.TrnMainObj.CHALANNO = uploadedResult.result && uploadedResult.result.length && uploadedResult.result[0].refno;
      this._trnMainService.changetrndate.next();
      if (this.userSetting.ENABLEVOUCHERSERIES == 1) {
       this.voucherseriesChanged(uploadedResult.result[0].voucheR_SERIES);
     }else{
      this.voucherseriesChanged('JV');
     }
     }

    for (let i in uploadedResult.result) {
      var guid = null;
      const uuidV1 = require('uuid/v1');
      guid = uuidV1();

      var newRow = <Trntran>{};
      var newaclist: TAcList = <TAcList>{};
      newRow.AccountItem = newaclist;
      newRow.AccountItem.ACID = uploadedResult.result[i].acid;
      newRow.AccountItem.ACNAME = uploadedResult.result[i].acname;
      newRow.AccountItem.PARENT = uploadedResult.result[i].parent;
      newRow.acitem=newRow.AccountItem;
      newRow.SL_ACID = uploadedResult.result[i].sL_ACID?uploadedResult.result[i].sL_ACID:null;
      newRow.SL_ACNAME = uploadedResult.result[i].sL_ACNAME?uploadedResult.result[i].sL_ACNAME:"";
      newRow.CostCenter = uploadedResult.result[i].costcentername;
      newRow.NARATION = uploadedResult.result[i].naration;
      newRow.OppAcid= uploadedResult.result[i].tdsAccount_ACID;
      newRow.OPPNAME= uploadedResult.result[i].tdsAccount_ACNAME;
      newRow.OPPREMARKS = this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Journal?uploadedResult.result[i].tdsAmount:uploadedResult.result[i].bankname;
      newRow.NARATION1 = uploadedResult.result[i].paymenT_MODE?uploadedResult.result[i].paymenT_MODE:"none";
      newRow.ChequeNo = uploadedResult.result[i].chequE_NO;
      newRow.ChequeDate = uploadedResult.result[i].chequE_DATE;

      newRow.inputMode = true;
      newRow.editMode = true;
      newRow.CRAMNT = uploadedResult.result[i].cramnt;
      newRow.DRAMNT = uploadedResult.result[i].dramnt;
      newRow.ROWMODE = "new";
      newRow.PartyDetails = [];
      newRow.guid = guid;
      if(uploadedResult.result[i].sL_ACID){
        newRow.disableSubLedger = false;
      }else{
        newRow.disableSubLedger = true;
      }
      if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory)
        && uploadedResult.result[i].vouchertype) {
          if(((uploadedResult.result[i].vouchertype=="Party Payment" ||uploadedResult.result[i].vouchertype=="Expenses Voucher" ||
          uploadedResult.result[i].vouchertype=="Mixed Payment") && uploadedResult.result[i].dR_CR=="DR") ||
          ((uploadedResult.result[i].vouchertype=="Party Receipt" ||uploadedResult.result[i].vouchertype=="Income Voucher" ||
          uploadedResult.result[i].vouchertype=="Mixed Receipt") && uploadedResult.result[i].dR_CR=="CR")){
            this._trnMainService.TrnMainObj.TrntranList.push(newRow);
            // this._trnMainService.getAccountWiseTrnAmount(uploadedResult.result[i].acid) // No need to check this, validation only applies in Cellpay Voucher so
          }else{
            this._trnMainService.TrnMainObj.TRNAC=uploadedResult.result[0].acid;
            this._trnMainService.TrnMainObj.TRNACName=uploadedResult.result[0].acname;
            this._trnMainService.TrnMainObj.CASHBANK_SL_ACID = uploadedResult.result[0].sL_ACID?uploadedResult.result[0].sL_ACID:null;
            this._trnMainService.TrnMainObj.CASHBANK_SL_NAME = uploadedResult.result[0].sL_ACNAME?uploadedResult.result[0].sL_ACNAME:"";
            if(this._trnMainService.TrnMainObj.CASHBANK_SL_ACID){
              this._trnMainService.TrnMainObj.HASSUBLEDGER=1;
            }else{
              this._trnMainService.TrnMainObj.HASSUBLEDGER=0;
            }
          }
      } else {
        this._trnMainService.TrnMainObj.TrntranList.push(newRow);
            // this._trnMainService.getAccountWiseTrnAmount(uploadedResult.result[i].acid) // No need to check this, validation only applies in Cellpay Voucher so
          }
      var tds_newRow = <TDSModel>{};
      if(uploadedResult.result[i].tdsAccount_ACID && uploadedResult.result[i].tdsAmount>0 && this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Journal){
        var amt = uploadedResult.result[i].cramnt ? uploadedResult.result[i].cramnt : uploadedResult.result[i].dramnt; 
        tds_newRow.TDS = amt;
        tds_newRow.DESCA= uploadedResult.result[i].tdsAccount_ACNAME,
        tds_newRow.AMNT=uploadedResult.result[i].tdsAmount,
        tds_newRow.ACID=uploadedResult.result[i].tdsAccount_ACID,
        this.masterService.tdsList.push(tds_newRow);
      }
      if((this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PaymentVoucher || 
        this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ReceiveVoucher ||
        this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PostDirectory) 
        && uploadedResult.result[0].vouchertype){
        this._trnMainService.TrnMainObj.TRNMODE = uploadedResult.result[0].vouchertype;
 
      }
      if(uploadedResult.result[i].dramnt){
        this._trnMainService.TrnMainObj.TOTAMNT  +=this._trnMainService.nullToZeroConverter(uploadedResult.result[i].dramnt);
      }
       if(uploadedResult.result[i].cramnt!=0){
        this._trnMainService.TrnMainObj.TOTAMNT  +=this._trnMainService.nullToZeroConverter(uploadedResult.result[i].cramnt);
       }
       this._trnMainService.TrnMainObj.NETAMNT = this._trnMainService.TrnMainObj.TOTAMNT;
     }
     this._trnMainService.calculateCrDrTotal();
     
  }
  else {
    this.alertService.error(uploadedResult.result);
    var _errorexcelfilename="JOURNAL_VOUCHER_ERROR";
    if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Journal){
      _errorexcelfilename="JOURNAL_VOUCHER_ERROR";
    }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ContraVoucher){
      _errorexcelfilename="CONTRA_VOUCHER_ERROR";
    }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PaymentVoucher){
      _errorexcelfilename="PAYMENT_VOUCHER_ERROR";
    }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ReceiveVoucher){
      _errorexcelfilename="RECEIPT_VOUCHER_ERROR";
    }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PostDirectory){
      _errorexcelfilename="POSTDATED_VOUCHER_ERROR";
    }

    if(uploadedResult.result!="DR_AMOUNT and CR_AMOUNT does not match" && uploadedResult.result!="VOUCHERTYPE does not match in all rows."){
      this.masterService.downloadErrorFile(`/downloadSampleFile/${_errorexcelfilename}`, _errorexcelfilename)
      .subscribe(
        data => {
          this.loadingService.hide();
          data.filename=_errorexcelfilename+".xlsx";
          this.downloadFile(data);
        },
        (error) => {
          this.alertService.error(error);
          this.loadingService.hide();
        }
      );
    }
  }
}

ExcelUpload() {
  var excelfilename="JOURNAL_VOUCHER";
  if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Journal){
    excelfilename="JOURNAL_VOUCHER";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ContraVoucher){
    excelfilename="CONTRA_VOUCHER";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PaymentVoucher){
    excelfilename="PAYMENT_VOUCHER";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ReceiveVoucher){
    excelfilename="RECEIPT_VOUCHER";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PostDirectory){
    excelfilename="POSTDATED_VOUCHER";
  }

  var _sampleexcelfilename="JOURNAL_VOUCHER_SAMPLE";
  if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Journal){
    _sampleexcelfilename="JOURNAL_VOUCHER_SAMPLE";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ContraVoucher){
    _sampleexcelfilename="CONTRA_VOUCHER_SAMPLE";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PaymentVoucher){
    _sampleexcelfilename="PAYMENT_VOUCHER_SAMPLE";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.ReceiveVoucher){
    _sampleexcelfilename="RECEIPT_VOUCHER_SAMPLE";
  }else if(this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.PostDirectory){
    _sampleexcelfilename="POSTDATED_VOUCHER_SAMPLE";
  }
  this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
  {
    title: "Transaction Voucher Excel Upload",
    sampleFileUrl: `/downloadSampleFile/${_sampleexcelfilename}`,
    uploadEndpoints: `/masterImport/${excelfilename}`,
    allowMultiple: false,
    acceptFormat: ".xlsx",
    filename: `${excelfilename}`,
  });
  this.fileUploadPopup.show();
}

downloadFile(response: any) {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(response.content);
  element.download = response.filename;
  document.body.appendChild(element);
  element.click();
}

LoadOriginalPIData(){
  this._additionalCostService.LoadOriginalPurchaseData();
}

showCostDetailsPopup(){
  this.masterService.showCostPopup=true;
}

voucherseriesChanged(seriesname: any) {
  try {
      var tMain = { VoucherPrefix: seriesname, DIVISION: this._trnMainService.TrnMainObj.DIVISION, PhiscalID: this._trnMainService.TrnMainObj.PhiscalID};
      this.masterService.getVoucherNo(tMain,seriesname).subscribe(res => {
        if (res.status == "ok") {
          let TMain = <TrnMain>res.result;
          this._trnMainService.TrnMainObj.VCHRNO = TMain.VCHRNO;
          this._trnMainService.TrnMainObj.VoucherPrefix=seriesname;
        }
        else {
          alert("Failed to retrieve VoucherNo")
        }
      });
  } catch (ex) {
    alert(ex);
  }
}
}
