import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer,
  ElementRef,
  HostListener,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
  Pipe,
  PipeTransform
} from "@angular/core";
import { PREFIX } from "./../interfaces/Prefix.interface";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  TrnMain,
  TrnProd,
  Trntran,
  TSubLedger,
  TSubLedgerTran,
  CostCenter,
  VoucherTypeEnum
} from "./../interfaces/TrnMain";
import { TAcList, TDSModel } from "./../interfaces/Account.interface";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { TransactionService } from "./transaction.service";
import { SettingService } from "./../services/setting.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { Subscription } from "rxjs";
import { VoucherTrackingComponent } from "../../pages/AccountVoucher/components/VoucherTracking/VoucherTracking.component";
import { PartyOpeningDetailsPopUpComponent } from "../popupLists/party-opening-details-popup/party-opening-details-popup.component";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { OpeningBalanceTrackingComponent } from "../../pages/AccountVoucher/components/PartyOpeningBalanceTracking/PartyopeningTracking.component";
import _, { xor } from 'lodash';
import { AuthService } from "../services/permission/authService.service";
import { TreeViewPartyervice } from "../../pages/masters/components/party-ledger/partyledger.service";
import { CookieXSRFStrategy } from "@angular/http";

@Pipe({
  name: 'active',
  pure: true
})
@Component({
  selector: "trntran-voucher-entry",
  templateUrl: "./trntran-voucher-entry.component.html",
  providers: [TreeViewPartyervice],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
      }

      input,
      select,
      textarea {
        border: 1px solid #cbcbcb;
        border-radius: 3px;
        height: 23px;
        color: black;
      }

      tr td {
        border-top: 0px;
        border-bottom: 0px;
        line-height: 31px;
        padding: 0px 2px;
      }
      tr th {
        line-height: 31px;
        padding: 0px;
        padding-left: 4px;
        padding-right: 4px;
      }
      tbody {
        border-top: 0px;
      }
      tbody:hover {
        background-color: #e0e0e0;
      }
      tr {
        padding-left: 4px;
        padding-right: 4px;
      }
    `
  ],

})
export class TrnTranVoucherEntryComponent implements OnInit, AfterContentChecked {
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
  @ViewChild("voucherTrack") VoucherTracking: VoucherTrackingComponent;
  @ViewChild("openingbalancetracking") openingbalancetracking: OpeningBalanceTrackingComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  guid: any;
  @ViewChild("genericGridCostCenterList")
  genericGridCostCenterList: GenericPopUpComponent;
  gridCostCenterListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridCostCenterGroupList")
  genericGridCostCenterGroupList: GenericPopUpComponent;
  gridCostCenterGroupListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("gridSubLedgerSettingList")
  gridSubLedgerSettingList: GenericPopUpComponent;
  gridSubLedgerSetting: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("partyOpeningDetailsPopup") partyOpeningDetailsPopup: PartyOpeningDetailsPopUpComponent;

  @ViewChild("genericeSalesManList")
  genericeSalesManList: GenericPopUpComponent;
  gridSalesmanListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridBankList") genericGridBankList: GenericPopUpComponent;
  gridBankPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  selectedtrntranRowIndex: number = 0;
  hideSubledger: boolean = true;
  //TrnMainObj: TrnMain = <TrnMain>{};
  trnaccountList: Observable<TAcList[]>;
  subledgers: TSubLedgerTran[] = [];
  subledgerDropDownList: TSubLedger[] = [];
  costCenterList: CostCenter[] = [];
  subLedgerTotal: number = 0;
  trntranTotal: number = 0;
  voucherType: VoucherTypeEnum;
  viewMode = false;
  showHelp = true;
  hideSubledgerList = true;
  private showWholeSubLedger = true;
  addFocus = false;
  @ViewChild("myInput") input: ElementRef;
  TranForm: FormGroup;
  ACBalanceType: any;
  TrntranList: Trntran[];
  private subcriptions: Array<Subscription> = [];
  crAmount: number;
  drAmount: number;

  debitAmount: number;
  creditAmount: number;
  height: any;
  newAccountDetails: any[] = [];
  newPartyDetails: any[] = [];
  selectedIndex: number
  //For Quick Master Creation
  showAccountMasterPopup: boolean;
  showPartyMasterPopup: boolean;
  formObj: any = <any>{
    ACID: '',
    ACTYPE: '',
    ACNAME: '',
    HASSUBLEDGER: ''
  }
  MainGroupAccountMaster: any[] = [];
  SubGroupAccountMaster: any[] = [];
  HASSUBLEDGER: any;
  public mode: string;
  userProfile: any;
  BankPartyVerification: any = <any>{}
  MainACID: any;
  GeoList: any[] = [];
  areaList: any[] = [];
  PartyGroupPartyMaster: any[] = [];
  partymasterObj: any = <any>{
    ACID: '',
    ACCODE: '',
    ACNAME: '',
    ADDRESS: '',
    VATNO: '',
    GEO: '',
    CRLIMIT: '',
    CRPERIOD: '',
    MOBILE: ''
  }
  createMember: any;
  userSetting: any;
  showSubLedgerMasterPopup: boolean;
  SubLedgerObj: any = <any>{
    SL_ACNAME: '',
  }
  subledgerfocus: boolean;
  copiedText: any;
  generalLedgerAc:number;
  subLedgerAc:number;
  @Input() name: string;
  emittedEvent:any;
  
  constructor(
    public masterService: MasterRepo,
    private _transactionService: TransactionService,
    private settingService: SettingService,
    private router: Router,
    private arouter: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
    private _hotkeysService: HotkeysService,
    private cd: ChangeDetectorRef,
    private _authService: AuthService,
    private PartyService: TreeViewPartyervice,
    
  ) {
    try {
      this.showWholeSubLedger = this.settingService.appSetting.enableSubLedger;
      this.voucherType = this._transactionService.TrnMainObj.VoucherType;
      this.trnaccountList = this._transactionService.accountListObersver$;
      this.userSetting = this._authService.getSetting()
      
    } catch (ex) {
      alert(ex);
    }

    this.userProfile = this._authService.getUserProfile();
    this.masterService.getMainGroupForQuickAccountMaster().subscribe(res => {
      this.MainGroupAccountMaster = res.result;
    })

    this.partymasterObj.PType = 'C';
    this.partymasterObj.CRLIMIT = 0;
    this.partymasterObj.CRPERIOD = 0;
    if (this.userSetting.CREATE_CPROFILE_AS_MEMBER == 1 && this.partymasterObj.PType == 'C') {
      this.createMember = true;
    } else {
      this.createMember = false;
    }


    this.masterService.getPartyGroupForQuickPartyMaster().subscribe(res => {
      this.PartyGroupPartyMaster = res.result;
    })

    this.PartyService.getHierachy().subscribe(res => {
      if (res.status == "ok") {
        this.GeoList = res.result.GEO;
      }
    });

    this.masterService.getAreaDetail().subscribe(res => {
      if (res.status == 'ok') {
        this.areaList = res.result;
      }
    })

    // this._hotkeysService.add(new Hotkey('ctrl+ins', (event: KeyboardEvent): boolean => {
    //   if (this.masterService.ItemList_Available == '1' || this.masterService.ItemList_Available == '0') {
    //     this.showPartyMasterPopup = true;
    //     setTimeout(() => {
    //       document.getElementById("partygroup").focus();
    //     }, 500)
    //     this.genericGridACList.hide();
    //   }
    //   return false;
    // }));
    // this._hotkeysService.add(new Hotkey('shift+ins', (event: KeyboardEvent): boolean => {
    //   if (this.masterService.ItemList_Available == '1' || this.masterService.ItemList_Available == '0') {
    //     this.showPartyMasterPopup = true;
    //     setTimeout(() => {
    //       document.getElementById("partygroup").focus();
    //     }, 500)
    //     this.genericGridACList.hide();
    //   }
    //   return false;
    // }));
    //console.log("@@trntranv", this._transactionService.TrnMainObj.TrntranList)
  }

  ngOnInit() {
    
    try {
      var some_string_value = '10000.50';
      parseFloat(some_string_value).toLocaleString()
      ////console.log("CheckABCD", some_string_value)
      this.masterService.getSubLedgerList().subscribe(
        res => {
          this.subledgerDropDownList = res;
        },
        error => {
          this.masterService.resolveError(
            error,
            "AddIncomeVoucher - getSubLedgerList"
          );
        }
      );

      if (this._transactionService.TrnMainObj.Mode == "VIEW") {
        this.viewMode = true;
      }
      this.arouter.queryParams.subscribe(params => {
        if (params['mode']=="DRILL") {
        }else{
          if (
            this._transactionService.TrnMainObj.Mode == "EDIT" ||
            this._transactionService.TrnMainObj.Mode == "VIEW"
          ) {
            this._transactionService.loadDataObservable.subscribe(data => {
              try {
                this._transactionService.TrnMainObj.TrntranList = data.TrntranList;
                this._transactionService.TrnMainObj.TrntranList && this._transactionService.TrnMainObj.TrntranList.length>0 && this._transactionService.TrnMainObj.TrntranList.forEach(t => {
                  t.ROWMODE = "save";
                  t.AccountItem = this.masterService.accountList.filter(
                    y => y.ACID == t.A_ACID
                  )[0];
                  t.acitem = t.AccountItem;
                  this.LoadSubledgerForTran(t);
                });
                if (this.viewMode == false) {
                  var nulltt = <Trntran>{};
                  nulltt.AccountItem = <TAcList>{};
                  nulltt.ROWMODE = "new";
                  this._transactionService.TrnMainObj.TrntranList.push(nulltt);
                }
              } catch (e) {
                alert(e)
              }
            });
          }
        }
      }) 
   
    } catch (ex) {
      alert(ex);
    }
    this._transactionService.TrnMainObj.TrntranList && this._transactionService.TrnMainObj.TrntranList.length>0 && this._transactionService.TrnMainObj.TrntranList.forEach(t => {
      t.CRAMNT = this.drAmount;
    });

    this._transactionService.TrnMainObj.TrntranList[this.selectedtrntranRowIndex].ISTAXABLE = 1;

  }
  public changeName() {
    this.cd.detach();
    this.name = 'Outer';
    // console.log("check value")
  }
  hideDetail() {
    this.masterService.ShowMore = true;
  }

 
  setSelectedRow(index, value) {
    this.selectedIndex = index;
    ////console.log("checkTranValue", value)


  }
  TrnTranAccNameChange(value) {

  }
  showAcList(i) {
    this._transactionService.subledgerfocus = false;

    // this.selectedIndex = i;
    if (this._transactionService.TrnMainObj.VoucherType == 15 || this._transactionService.TrnMainObj.VoucherType == 16) {
      // if (!this._transactionService.TrnMainObj.TRNMODE) {
      //   alert("Selet Voucher Type or Party Type");
      //   return;
      // }
      this._transactionService.TrnMainObj.TRNMODE = "party Payment Expense";
    }
    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;

    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay){
      //console.log("TRNMODE",this._transactionService.TrnMainObj.TRNMODE)
      if(this._transactionService.TrnMainObj.TRNMODE == "" || 
      this._transactionService.TrnMainObj.TRNMODE === null || 
      this._transactionService.TrnMainObj.TRNMODE === undefined){
        this.alertService.info("Please select vouchertype first.");
        return;
      }

      if(this._transactionService.TrnMainObj.TRNACName == "" || 
      this._transactionService.TrnMainObj.TRNACName === null || 
      this._transactionService.TrnMainObj.TRNACName === undefined){    
        this.alertService.info("Please select Bank first.");
        return;
      }
    }
    if (this._transactionService.TrnMainObj.VoucherType == 12) {
      TRNMODE = "ALL"
    }

    if (this._transactionService.TrnMainObj.VoucherType == 62) {
      TRNMODE = "CONTRA"
    }
    else if (this._transactionService.TrnMainObj.VoucherType == 23) {
      TRNMODE = "PartyOpeningBalance"
    }
    else if (this._transactionService.TrnMainObj.VoucherType == 22) {
      TRNMODE = "AccountOpeningBalance"
    }
    else if (this._transactionService.TrnMainObj.VoucherType == 17 &&
      this._transactionService.TrnMainObj.TRNMODE != 'Expenses Voucher'
    ) {
      if (TRNMODE != 'Mixed Payment')
        TRNMODE = "Party Payment"
    }
    else if (this._transactionService.TrnMainObj.VoucherType == 65) {
      // TRNMODE = "Single Payment"
      TRNMODE = "Cash Transfer"
    }
    else if (this._transactionService.TrnMainObj.VoucherType == 17 &&
      this._transactionService.TrnMainObj.TRNMODE == 'Expenses Voucher') {
      TRNMODE = "party Payment Expense"
    }
    else if (this._transactionService.TrnMainObj.VoucherType == 64) {
      TRNMODE = "party Payment Expense"
    }

    this.gridACListPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,
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

    this.genericGridACList.show();


  }
  focusNextValidation(colindex, rowIndex, event = null, value, tvalue) {
this.selectedIndex=rowIndex;
    if (value == 'Ledger') {
      if (!tvalue.acitem) {

      }
      else {
        ////console.log("ChrckValue",tvalue,tvalue)
        this.focusNext(1, this.selectedIndex, null, tvalue.acitem.HASSUBLEDGER)
      }
    }
    else if (value == 'SubLedger') {
      if (!tvalue.SL_ACNAME) {

      }
      else {
        this.focusNext(1, this.selectedIndex);
      }
    }
  }
  onTabClickNumber(colindex, rowIndex, event = null, hassubledger = 0) {
    
    if (rowIndex.NARATION1 != "none") {
      // ////console.log("checkValue",this._transactionService.TrnMainObj.TrntranList[rowIndex].ChequeNo,event)
      if (!this._transactionService.TrnMainObj.TrntranList[rowIndex].ChequeNo) {
        document.getElementById("ChequeNo_" + rowIndex).focus();
        return;
      }
      else {
        this.focusNext(colindex, rowIndex, event = null, hassubledger = 0)
      }
    }
    else {
      this.focusNext(colindex, rowIndex, event = null, hassubledger = 0)
    }

  }

  onTabOppRemarks(colindex, rowIndex, event = null, hassubledger = 0) {
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
      this._transactionService.addRowForTransaction(rowIndex);
      if (document.getElementById("ACCODEInput_" + rowIndex + 1) != null) {
        document.getElementById("ACCODEInput_" + rowIndex + 1).focus();
      };
    }
  }

  onEnterOppRemarks(colindex, rowIndex, event = null, hassubledger = 0) {
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
      this._transactionService.addRowForTransaction(rowIndex);
      this.masterService.focusAnyControl("ACCODEInput_" + (rowIndex + 1));
    }
  }

  CellPayFee : string;
  onTabBankNameClick(){
   this.focusNarration(this.selectedIndex)
  // alert("reached");
  // //console.log("CheckResult", this._transactionService.TrnMainObj.TrntranList[this.selectedIndex])
  var dramnt = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT
  var cramnt = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT;
  if(dramnt == null || dramnt == undefined){ this.alertService.warning("DRAMNT missing!");return;}
    if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem.ACNAME!='CellPay Fee' && (dramnt < 100 || dramnt > 1000000)) {
      this.alertService.warning("Please enter amount between 100 and 1000000!");
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT = 0 ;
      if(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1] && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem &&
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem.ACNAME == 'CellPay Fee'){
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem.ACID='';
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem.ACNAME='';
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].DRAMNT = 0;
      }
      return;
    }
  this.CellPayFee = (dramnt?dramnt:cramnt).toString();
    //console.log("CellPayFeeACID", this.masterService.userSetting.CellPayFee);
    if (this.masterService.userSetting.CellPayFee == null || this.masterService.userSetting.CellPayFee == '' ||
      this.masterService.userSetting.CellPayFee == undefined) {
      this.alertService.info("Please add CellPayFee ACID in database!");
      return;
    }
   this.masterService.getFeeFromCellPay(this.CellPayFee).subscribe(x=>{
  
   
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].DRAMNT = x.fee
      var x:any=<any>{}
     
      x.ACID = this.masterService.userSetting.CellPayFee?this.masterService.userSetting.CellPayFee:'AG479';
      x.ACNAME = 'CellPay Fee';

      var ac = <TAcList> x;
  

      
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].AccountItem = x;
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem = x;
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].A_ACID = x.ACID;
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].AccountItem.ACCODE = ac.ACCODE;
      // this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem = ac;
      if(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].acitem.ACNAME == 'CellPay Fee'){
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex+1].disableCellPayRow = true;
      }      
  })
   if(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem.ACID != "AG1")
   {
     //call cellpay api
     var amount = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT;
   
    }
  }
  focusNext(colindex, rowIndex, event = null, hassubledger = 0) {

    //console.log("focusnext",colindex, rowIndex, event);

    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher
    ) {
      if (colindex == 5 &&
        this._transactionService.TrnMainObj.TrntranList[rowIndex].NARATION1 == 'none'
      ) {
        let sname = "";
                this._transactionService.addRowForTransaction(rowIndex);
        ////console.log("CheckValue@@@",this._transactionService.TrnMainObj)
        // this._transactionService.addRowForTransaction(rowIndex);
        // if (document.getElementById("ACCODEInput_" + rowIndex + 1) != null) {
        sname = `ACCODEInput_${rowIndex + 1}`
        let element = document.getElementById(`${sname}`);
        if (element) {
          setTimeout(function () {
            (<HTMLInputElement>element).focus();
            //(<HTMLInputElement>element).select();
          }, 100)
        }

        // };
        return;
      }
    }


    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher) {
      if (rowIndex > 0) {

        // this.calculateDRandCRAmount(rowIndex);
      }

    }

    if (event && event != null && event != undefined) event.preventDefault();

    let selectorName = "";
    // ////console.log("colindex",colindex);
    switch (colindex) {

      case 0: {
        selectorName = `ACCODEInput_${rowIndex}`
        this._transactionService.subledgerfocus = false;
        break;
      }
      case 1: {
        if (hassubledger == 1) {

          selectorName = `SubLedgerInput_${rowIndex}`;
          this._transactionService.subledgerfocus = true;
        }
        else {
          this._transactionService.subledgerfocus = false;
          selectorName = (this.voucherType == VoucherTypeEnum.Journal 
            || this.voucherType == VoucherTypeEnum.ContraVoucher
            || this.voucherType == VoucherTypeEnum.PaymentVoucher
            || this.voucherType == VoucherTypeEnum.PartyOpeningBalance
            || this.voucherType == VoucherTypeEnum.AccountOpeningBalance
            || this.voucherType == VoucherTypeEnum.CreditNote
            || this.voucherType == VoucherTypeEnum.CapitalVoucher
            || this.voucherType == VoucherTypeEnum.Cellpay
            || (this.voucherType == VoucherTypeEnum.PostDirectory && (this._transactionService.TrnMainObj.TRNMODE != 'Party Receipt' && this._transactionService.TrnMainObj.TRNMODE != 'Mixed Receipt'))
          )&&((this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT == null || this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT == 0) &&(this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT == null || this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT == 0))


            ? `DrAmtInput_${rowIndex}`
            : `CrAmtInput_${rowIndex}`;
          if (this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT == null || this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT == 0) {
            this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT = null;
          }
          if (this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT == null || this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT == 0) {
            this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT = null;
          }
        }

        break;
      }
      case 2: {
        // console.log(this.showTDSDetailPopup)
        // selectorName = this._transactionService.nullToReturnZero( this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT) != 0
        //   ? this._transactionService.AppSettings.enableCostCenter == 1 ? `CostCenterInput_${rowIndex}` : `narration_${rowIndex}`
        //   : `CrAmtInput_${rowIndex}`
        // ////console.log("dramount",this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT) )
        if (this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT) != 0) {
         if (this._transactionService.userSetting.enableCostCenter == 2) {
            selectorName = `CostCenterInput_${rowIndex}`;
          }
          else if (this._transactionService.userSetting.enableSalesman == 1 && (this._transactionService.TrnMainObj.VoucherType == 12 || this._transactionService.TrnMainObj.VoucherType == 18)) {
            selectorName = `SalesmanInput_${rowIndex}`;
          }
          else {
            selectorName = `narration_${rowIndex}`;
          }
        
         
        } else {
          if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) {
            if (this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT) == 0) {
              selectorName = `DrAmtInput_${rowIndex}`;
            } else {
              if (this._transactionService.userSetting.enableCostCenter == 2 ) {
                selectorName = `CostCenterInput_${rowIndex}`;
              }
              else if (this._transactionService.userSetting.enableSalesman == 1 ) {
                selectorName = `SalesmanInput_${rowIndex}`;
              }
              else {
                selectorName = `narration_${rowIndex}`;
              }
            }

          }
          else if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
            if(this._transactionService.TrnMainObj.TRNMODE == 'Party Receipt' && this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT) == 0){
              selectorName = `DrAmtInput_${rowIndex}`;
            }else if ( this._transactionService.TrnMainObj.TRNMODE == 'Party Payment' && this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT) == 0) {
              selectorName = `CrAmtInput_${rowIndex}`;
            }else{
              selectorName = `CostCenterInput_${rowIndex}`;
            }
          }
          else if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            if (this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT) != 0) {
              if (this._transactionService.userSetting.enableCostCenter == 2) {
                 selectorName = `CostCenterInput_${rowIndex}`;
               }
               else {
                 selectorName = `narration_${rowIndex}`;
               } 
             }else{
              selectorName = `DrAmtInput_${rowIndex}`;
             }
          }
          else {
            selectorName = `CrAmtInput_${rowIndex}`;
          }

        }


        break;
      }
      case 3: {
        // console.log(this.showTDSDetailPopup)
        ////console.log("newfound", selectorName, this._transactionService.AppSettings.enableCostCenter);
       if (this._transactionService.userSetting.enableCostCenter == 2 && this._transactionService.TrnMainObj.TrntranList[rowIndex].CRAMNT != 0 ) {
          selectorName = `CostCenterInput_${rowIndex}`;
        }
        else if (this._transactionService.userSetting.enableSalesman == 1 && (this._transactionService.TrnMainObj.VoucherType == 12 || this._transactionService.TrnMainObj.VoucherType == 18)) {
          selectorName = `SalesmanInput_${rowIndex}`;
        }
        else {
          selectorName = `narration_${rowIndex}`;
        }
        // if(this.showTDSDetailPopup==0){
        //   setTimeout(() => {
        //     document.getElementById("desca").focus();
        //   },500)
        // }
        // selectorName = this._transactionService.userSetting.enableCostCenter == 2 ? `CostCenterInput_${rowIndex}` : `narration_${rowIndex}`;
        break;
      }
      case 4: {
        ////console.log("second narration", selectorName);
        selectorName = `narration_${rowIndex}`
        break;
      }
      case 5: {
        selectorName = `ChequeNo_${rowIndex}`
        break;
      }
      case 6: {
        selectorName = `chequeDate_${rowIndex}`
        break;
      }
      case 7:
        {
          selectorName = `transactionType_${rowIndex}`
          break;
        }
      case 8:
        {
          selectorName = `SalesmanInput_${rowIndex}`
          break;
        }
      default: {
        selectorName = `ACCODEInput_${rowIndex}`
        break;
      }
    }
    ////console.log("focus narration", selectorName);

    let element = document.getElementById(`${selectorName}`);
    if (element) {
      setTimeout(function () {
        (<HTMLInputElement>element).focus();
        //(<HTMLInputElement>element).select();
      }, 100)
    }
    // write balance amount

  }

  AssignValueToDebit() {

    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher
    ) {
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT == 0) {
        this._transactionService.calculateDrCrDifferences()

        // if(this._transactionService.differenceAmount < 0){

        //   this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT = Math.abs(this._transactionService.differenceAmount)
        // }
      }
    }
  }

  showTDSDetailPopup = 0;
  focusOutCRAmount(event, i) {
    
    if ((this._transactionService.TrnMainObj.VoucherType ==
      VoucherTypeEnum.AccountOpeningBalance) ||
      (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance)) {
      return;
    }
    if (this._transactionService.differenceAmount > 0) {
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT == null)
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT = this._transactionService.differenceAmount
      this._transactionService.calculateCrDrTotal();
    }

    if (event.target.value != '' && event.target.value != null && event.target.value != undefined) {
      let abcd = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT;
      // console.log("@@CRAMNT",abcd)
      let xyz = abcd.toFixed(2);
      // this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT = Number(xyz);
    }
    // console.log("ENABLETDSTRACKING",this.userSetting.ENABLETDSTRACKING)
    if(this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal||
      (this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.PaymentVoucher && this._transactionService.TrnMainObj.TRNMODE != 'Party Payment') ||
      this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.DebitNote||
      this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.CreditNote){

      var parent = this._transactionService.TrnMainObj.TrntranList[i] && this._transactionService.TrnMainObj.TrntranList[i].acitem && this._transactionService.TrnMainObj.TrntranList[i].acitem.PARENT;
        if( (parent == this.masterService.userSetting.TDS_PAYABLE || parent == this.masterService.userSetting.TDS_RECEIVABLE)&& this._transactionService.TrnMainObj.TrntranList[i].CRAMNT!=null){
          //console.log("TDS TRACKING...")
          this.showTDSDetailPopup = 1;
          console.log("indd",this.selectedIndex)
          setTimeout(() => {
            if( document.getElementById("desca")){
            document.getElementById("desca").focus();
            this.genericGridCostCenterList.hide();
            }
          },10)
          this.generalLedgerAc=1;
          console.log("Check",this._transactionService.TrnMainObj.TrntranList)

          if(this._transactionService.TrnMainObj.TrntranList[i].OppAcid!=null){
           console.log( this._transactionService.TrnMainObj.Mode)
            if(this._transactionService.TrnMainObj.Mode=='EDIT'){
             this.masterService.tdsList=[]
             var CRAMNT = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT;
            var DRAMNT = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT;
              var newRow = <TDSModel>{};
              var amt = CRAMNT ? CRAMNT : DRAMNT 
              newRow.TDS = amt;
             newRow.DESCA= this._transactionService.TrnMainObj.TrntranList[i].OPPNAME,
             newRow.AMNT=this._transactionService.TrnMainObj.TrntranList[i].OPPREMARKS,
             newRow.ACID=this._transactionService.TrnMainObj.TrntranList[i].OppAcid,
                this.masterService.tdsList.push(newRow);
} else{

            // this.masterService.tdsList.forEach(x=>{
              var CRAMNT = this._transactionService.TrnMainObj.TrntranList[i].CRAMNT;
              var DRAMNT = this._transactionService.TrnMainObj.TrntranList[i].DRAMNT;
              var amt = CRAMNT ? CRAMNT : DRAMNT 
              this.masterService.tdsList[0].AMNT=this._transactionService.TrnMainObj.TrntranList[i].OPPREMARKS 
              this.masterService.tdsList[0].ACID=this._transactionService.TrnMainObj.TrntranList[i].OppAcid
              this.masterService.tdsList[0].DESCA=this._transactionService.TrnMainObj.TrntranList[i].OPPNAME
              this.masterService.tdsList[0].TDS=amt;
              
          // })
          }
        }else{

          this.addRow();
          }
        }
      }
      
    }

  
  cancelTDSDetailPopup(){
  
    if (confirm("Are you sure you want to close tds popup?All the data will be removed from the field.")) {
        this.showTDSDetailPopup = 0;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].OPPNAME = ""
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].OppAcid = ""
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].OPPREMARKS =   ""
        // document.getElementById('CostCenterInput_'+this.selectedIndex).focus();
        if(this.voucherType == VoucherTypeEnum.Journal){
          this.focusNext(2, this.selectedIndex)
        } else{
          if(document.getElementById("CostCenterInput_"+this.selectedIndex)){
            document.getElementById("CostCenterInput_"+this.selectedIndex).focus();
          }
          else if(document.getElementById("narration_"+this.selectedIndex)){
            document.getElementById("narration_"+this.selectedIndex).focus();
          }
        }
        
        // this.focusNext(1,this.selectedIndex) 
    }else{
      return;
    }
    
  }
  TdsPopupOK(){
    this.showTDSDetailPopup = 0;
    // console.log("pp",this.selectedIndex)
    let index = this.selectedIndex;
    // if(this.masterService.tdsList && this.masterService.tdsList.length && this.masterService.tdsList.length>0 && this.masterService.tdsList[0].TDS_TOBETRACK_LEDGERINDEX &&(this.masterService.tdsList[0].DESCA!=  this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].OPPNAME)){
    //   index=this.masterService.tdsList[0].TDS_TOBETRACK_LEDGERINDEX;
    // }else{
    //   index=this.selectedIndex;
    // }
    if(document.getElementById("CostCenterInput_"+index)){
      document.getElementById("CostCenterInput_"+index).focus();
    }
    else if(document.getElementById("narration_"+index)){
      document.getElementById("narration_"+index).focus();
    }
    // console.log("index",index)
    this._transactionService.TrnMainObj.TrntranList[index].OPPNAME = this.masterService.tdsList[0].DESCA;
      this._transactionService.TrnMainObj.TrntranList[index].OppAcid = this.masterService.tdsList[0].ACID;
      this._transactionService.TrnMainObj.TrntranList[index].OPPREMARKS =   this.masterService.tdsList[0].AMNT;
      this.genericGridACList.hide();
      this.gridSubLedgerSettingList.hide();
    // console.log("Ch",this._transactionService.TrnMainObj.TrntranList)
    }
   

  PopupRowClick(){
   
  }
  ChangeDesca(value){
  //  console.log(value)
  //   this.masterService.tdsList[0].ACID = this._transactionService.TrnMainObj.TrntranList.filter(x=>x.acitem.ACNAME == value.target.value)
    
  }
  disableOK(){
    if(this.masterService.tdsList){
    if(this.masterService.tdsList[0].DESCA==null ||this.masterService.tdsList[0].DESCA==undefined||this.masterService.tdsList[0].DESCA==''){
      return true;
    }
    else if(this.masterService.tdsList[0].AMNT==null ||this.masterService.tdsList[0].AMNT==undefined||this.masterService.tdsList[0].AMNT==''){
   return true;
    }
    else{
      return false;
    }
  }
  }
  BaseAmntChange(value){
  
  }
  FilterList :any[]=[];
  enableOK_Tdspopup = false;
  addRow() {
    try {
      this.masterService.tdsList= [];
      this.FilterList = [];
      var CRAMNT = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT;
      var DRAMNT = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT;
      var tds_tobetrack_ledgeracid = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].A_ACID;
      var tds_tobetrack_ledgerindex = this.selectedIndex;
      for(let i of this._transactionService.TrnMainObj.TrntranList){
        if(i.acitem.PARENT != this.masterService.userSetting.TDS_PAYABLE &&
          i.acitem.PARENT != this.masterService.userSetting.TDS_RECEIVABLE){
            this.FilterList.push(i)
          }
      }
        // this.FilterList.splice(index,1)
      var amt = CRAMNT ? CRAMNT : DRAMNT 
      var newRow = <TDSModel>{};
      newRow.TDS = amt;
      newRow.TDS_TOBETRACK_LEDGERACID = tds_tobetrack_ledgeracid;
      newRow.TDS_TOBETRACK_LEDGERINDEX = tds_tobetrack_ledgerindex;

      this.masterService.tdsList.push(newRow);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  focusOutDRAmount(event, i) {
    // ////console.log("reach here");
    if ((this._transactionService.TrnMainObj.VoucherType ==
      VoucherTypeEnum.AccountOpeningBalance) ||
      (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance)) {
      return;
    }
    // if (this._transactionService.differenceAmount < 0) {
    //   // ////console.log("dramount", this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT);
    //   if (this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT) == 0)
    //     this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT = Math.abs(this._transactionService.differenceAmount);
    //   this._transactionService.calculateCrDrTotal();
    // }

    if (event.target.value != '' && event.target.value != null && event.target.value != undefined) {
      let abcd = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex] && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT;
      //console.log("abcd",abcd)
      let xyz = event.target.value.includes(".")?abcd.toFixed(2):abcd;
      // this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT = Number(xyz);
    }
    //console.log("ENABLETDSTRACKING_1",this.userSetting.ENABLETDSTRACKING)
    if(this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.Journal  ||
      this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.ReceiveVoucher && this._transactionService.TrnMainObj.TRNMODE != 'Party Receipt' ||
      this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.DebitNote||
      this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.CreditNote
       ){
      var parent = this._transactionService.TrnMainObj.TrntranList[i] && this._transactionService.TrnMainObj.TrntranList[i].acitem && this._transactionService.TrnMainObj.TrntranList[i].acitem.PARENT;
      if( (parent == this.masterService.userSetting.TDS_PAYABLE ||
         parent == this.masterService.userSetting.TDS_RECEIVABLE) &&
         this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT != null
         ){
          //console.log("...TDS TRACKING...")
           
        this.showTDSDetailPopup = 1;
        this.generalLedgerAc=1
          setTimeout(() => {
            if( document.getElementById("desca")){
            document.getElementById("desca").focus();
            this.genericGridCostCenterList.hide();
            }
          },10)
          if(this._transactionService.TrnMainObj.TrntranList[i].OppAcid!=null){
            // console.log( this._transactionService.TrnMainObj.Mode)
             if(this._transactionService.TrnMainObj.Mode=='EDIT'){
              this.masterService.tdsList=[]
              var CRAMNT = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT;
              var DRAMNT = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT;
                      var newRow = <TDSModel>{};
                      var amt = CRAMNT ? CRAMNT : DRAMNT 
                      newRow.TDS = amt;
              newRow.DESCA= this._transactionService.TrnMainObj.TrntranList[i].OPPNAME,
              newRow.AMNT=this._transactionService.TrnMainObj.TrntranList[i].OPPREMARKS,
              newRow.ACID=this._transactionService.TrnMainObj.TrntranList[i].OppAcid,
                 this.masterService.tdsList.push(newRow);
 } else{

          //    this.masterService.tdsList.forEach(x=>{
          //      x.AMNT=this._transactionService.TrnMainObj.TrntranList[i].OPPREMARKS 
          //      x.ACID=this._transactionService.TrnMainObj.TrntranList[i].OppAcid
          //    x.DESCA=this._transactionService.TrnMainObj.TrntranList[i].OPPNAME})
          //  }
          var CRAMNT = this._transactionService.TrnMainObj.TrntranList[i].CRAMNT;
          var DRAMNT = this._transactionService.TrnMainObj.TrntranList[i].DRAMNT;
          var amt = CRAMNT ? CRAMNT : DRAMNT 
          this.masterService.tdsList[0].AMNT=this._transactionService.TrnMainObj.TrntranList[i].OPPREMARKS 
          this.masterService.tdsList[0].ACID=this._transactionService.TrnMainObj.TrntranList[i].OppAcid
          this.masterService.tdsList[0].DESCA=this._transactionService.TrnMainObj.TrntranList[i].OPPNAME
          this.masterService.tdsList[0].TDS=amt;
        }
         }else{
           this.addRow();
           }
      
      }
    
  }
  if(this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.Cellpay){
    this.onTabBankNameClick();
  }

  // if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
  //   this._transactionService.budgetCalculation(i);
  // }
  }


  AssignValueToCredit() {
    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher
    ) {
      if (this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT) == 0) {
        this._transactionService.calculateDrCrDifferences()


        // if(this._transactionService.differenceAmount > 0){
        //   this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT = this._transactionService.differenceAmount
        // }
      }
    }
  }
  debitTab(colindex, rowIndex, event = null) {
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay){
      if(event.target.value > this._transactionService.diffAmountItemForAccount){
        this.alertService.warning("Amount Exceded the A/C Balance!");
      }
    }
    this.AssignValueToCredit()
    this.focusNext(colindex, rowIndex, event)
  }

  activeDebit = false; //For Journal Entry - DueVoucher - Customer or Supplier seperation
  activeCredit = false
  AcObj: TAcList = <TAcList>{}


  enterDabitAmount(i, event) {
    //console.log("event",event.target.value)
    // if(this._transactionService.diffAmountItemForAccount < )
    ////console.log("transaction", this._transactionService.TrnMainObj.TrntranList);
    if (i > 0) {
      this.calculateDRandCRAmount(i);
    }
    console.log("@@",this._transactionService.TrnMainObj.TrntranList[i])
    // if(this._transactionService.TrnMainObj.TrntranList[i].AccountItem.PARENT=="AT"||
    // this._transactionService.TrnMainObj.TrntranList[i].AccountItem.PARENT=="DE"){

    // }
    // this.checkBudgetStatus(i);
    this.AssignValueToCredit()
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay){
      if(event.target.value > this._transactionService.diffAmountItemForAccount){
        this.alertService.warning("Amount Exceded the A/C Balance!");
      }
    }
    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher) {
      if (this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.ReceiveVoucher && this.userSetting.enableSalesman == 1) {
        this.focusNext(8, i, event)
      }
      else {
        this.focusNext(3, i, event)
      }

    } else {
      // console.log(this.showTDSDetailPopup)
      this.focusNext(2, i, event)
    }


  }


  calculateDRandCRAmount(i) {
    this.debitAmount = 0;
    this.creditAmount = 0;
    let managableValue = 0;

    // this._transactionService.TrnMainObj.TrntranList.forEach(x => {
    //   this.debitAmount += this._transactionService.nullToReturnZero(x.DRAMNT);
    // })

    // this._transactionService.TrnMainObj.TrntranList.forEach(x => {
    //   this.creditAmount += this._transactionService.nullToReturnZero(x.CRAMNT);
    // })

    // if (this.debitAmount === this.creditAmount) {
    //   //console.log('in equal');
    //   this.debitAmount = 0;
    //   this.creditAmount = 0;
    //   return;
    // }
    // //console.log('debit amount', this.debitAmount);
    // //console.log('credit amount', this.creditAmount);



    // if (this.debitAmount > this.creditAmount) {
    //   //console.log('grater');

    //   managableValue = this._transactionService.nullToReturnZero(this.debitAmount) - this._transactionService.nullToReturnZero(this.creditAmount);
    //   this._transactionService.TrnMainObj.TrntranList[i].CRAMNT = managableValue;

    //   if (this.debitAmount === this.creditAmount) {
    //     //console.log(' grreater in equal');
    //   }

    // } else {
    //   //console.log('smaller');
    //   managableValue = this._transactionService.nullToReturnZero(this.creditAmount) - this._transactionService.nullToReturnZero(this.debitAmount);
    //   this._transactionService.TrnMainObj.TrntranList[i].DRAMNT = managableValue;

    //   if (this.debitAmount === this.creditAmount) {
    //     //console.log(' smaller in equal');
    //   }
    // }
  }
  Cheque_Bank_Name :string;
  onAcSelect(acItem) {
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
       this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher){
        //console.log("cashbank",this._transactionService.TrnMainObj.TRNAC)
        if(this._transactionService.TrnMainObj.TRNAC!=='' && this._transactionService.TrnMainObj.TRNAC!==null && this._transactionService.TrnMainObj.TRNAC!==undefined){
          if(acItem.ACID == this._transactionService.TrnMainObj.TRNAC){
            this.alertService.info("Debit and Credit Account cannot be same.");
            return;
          }
        }
       }
       if(this.generalLedgerAc==1){
        this.masterService.tdsList[0].DESCA =acItem.ACNAME;
        this.masterService.tdsList[0].ACID =acItem.ACID;
        this.generalLedgerAc=0;
        if( document.getElementById("amount")){
      document.getElementById("amount").focus();
        return;
      }
      }
// //console.log("CheckONSelectAC",acItem,this._transactionService.TrnMainObj)
     this.calculateDRandCRAmount(this.selectedIndex);

    try {
      
      if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher
      ) {
        this._transactionService.calculateDrCrDifferences();
      }
      if (typeof acItem === "object") {
        var ac = <TAcList>acItem;
        this.AcObj = acItem;

        if(this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.Cellpay){
          this.masterService.getAllAccount(ac.ACID)
          .subscribe(data => {
            if(data.status == 'ok'){
              if(data.result5.length>0){
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].disableBank = false;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].hasAdditionalBank = true;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKNAME  = ac.BANKNAME;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKCODE  = ac.BANKCODE;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].ChequeNo = ac.BANKACCOUNTNUMBER;
                let abc = data.result5.filter(x=>x.BANKCODE == ac.BANKCODE && x.BANKACCOUNTNUMBER == ac.BANKACCOUNTNUMBER);
                if(abc.length && abc.length > 0){

                }else{
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKNAME  = '';
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKCODE  = '';
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].ChequeNo = '';
                // this.alertService.info("Account number was changed.ss Please select bank!");
                }

              }else{
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKID  = ac.BANKID;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKNAME  = ac.BANKNAME;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].BANKCODE  = ac.BANKCODE;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].ChequeNo = ac.BANKACCOUNTNUMBER;
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].hasAdditionalBank = false;
                if(ac.BANKCODE){
                  this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].disableBank = true;
                }else{
                  this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].disableBank = false;
                }
              }
            }
          })
         //console.log("CheckValue",ac)
         
          this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].NARATION1 = "e-transfer";
          
        }
        // console.log("yyy",this.selectedIndex)
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem = acItem;
        //this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].rootparent = acItem.rootparent;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].rootparentname = acItem.rootparentname;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].A_ACID = acItem.ACID;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.ACCODE = ac.ACCODE;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem = ac;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].RowWiseBillTrackedList = [];

        // START DueVoucher purpose
        if (this.voucherType == 12) {
          if (ac.PType == 'C') {
            this.activeDebit = true;
            this.activeCredit = false;
          }
          else if (ac.PType == 'V') {
            this.activeDebit = false;
            this.activeCredit = true;
          }
        }
        try {

          if (acItem.isAutoGSTApplicable == 1) {
            this.masterService.masterGetmethod("/GetAccountDetailsForTran?acid=" + acItem.ACID).subscribe(res => {
              if (res.status == "ok") {
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.AutoCalculationObj = res.result;
              } else { }
            }, error => { }
            );
          }

          if (acItem.ACID == this._transactionService.AppSettings.CGST_PAYABLE
            || acItem.ACID == this._transactionService.AppSettings.IGST_PAYABLE
            || acItem.ACID == this._transactionService.AppSettings.SGST_PAYABLE
            || acItem.ACID == this._transactionService.AppSettings.CGST_RECEIVABLE
            || acItem.ACID == this._transactionService.AppSettings.IGST_RECEIVABLE
            || acItem.ACID == this._transactionService.AppSettings.SGST_RECEIVABLE
            || acItem.ACID == this._transactionService.AppSettings.CGST_PAYABLE_RCM
            || acItem.ACID == this._transactionService.AppSettings.IGST_PAYABLE_RCM
            || acItem.ACID == this._transactionService.AppSettings.SGST_PAYABLE_RCM
            || acItem.ACID == this._transactionService.AppSettings.CGST_RECEIVABLE_RCM
            || acItem.ACID == this._transactionService.AppSettings.IGST_RECEIVABLE_RCM
            || acItem.ACID == this._transactionService.AppSettings.SGST_RECEIVABLE_RCM) {
            this.setParentAccountForAutoCalculation(this.selectedIndex);

            if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.parentAccountForAutoGSTCalculation != null
              && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.parentAccountForAutoGSTCalculation.AutoCalculationObj != null
              && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.parentAccountForAutoGSTCalculation.AutoCalculationObj.length > 0) {
              let parentacc = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.parentAccountForAutoGSTCalculation;
              this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.GSTRATE = parentacc.AutoCalculationObj.filter(x => x.ACCOUNT == acItem.ACID)[0].RATE;

              let gstrate = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.GSTRATE;
              let parAcc = this._transactionService.TrnMainObj.TrntranList.filter(x => x.AccountItem.ACID == parentacc.ACID)[0];

              let calculateddramnt = this._transactionService.nullToZeroConverter(gstrate) * this._transactionService.nullToZeroConverter(parAcc.DRAMNT) / 100;
              let calculatedCrAmnt = this._transactionService.nullToZeroConverter(gstrate) * this._transactionService.nullToZeroConverter(parAcc.CRAMNT) / 100;

              if (calculateddramnt > 0) {
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT = calculateddramnt;
              }
              if (calculatedCrAmnt > 0) {
                this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT = calculatedCrAmnt;
              }
              this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.GSTAMOUNT = calculateddramnt + calculatedCrAmnt;
            }
          }
        } catch (error) {
        }

        //END
        this.trnAccountChange(ac.HASSUBLEDGER, this.selectedIndex);



        // //console.log("@@this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT",this._transactionService.TrnMainObj.TrntranList[this.selectedIndex],this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT)

        if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT != 0
          && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT != null
        ) {
          this.focusNext(1, this.selectedIndex);
        } else if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher || this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay) {
          this.focusNext(1, this.selectedIndex);
        }
        else {
      // console.log("reac second");
      //     this.focusNext(1,this.selectedIndex);
        }

if(  this._transactionService.TrnMainObj.TrntranList[
  this.selectedIndex
].AccountItem.ACCODE != ""){
  this.focusNext(1, this.selectedIndex);
}
        this.getAccountWiseTrnAmount(ac)
        this.AssignValueToDebit()

      } else {
        this._transactionService.TrnMainObj.TrntranList[
          this.selectedIndex
        ].AccountItem.ACCODE = "";
        // this.focusNext(0, this.selectedIndex);
      }
      acItem.HASSUBLEDGER == 1 ?
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].disableSubLedger = false :
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].disableSubLedger = true;
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].disableSubLedger == true) {
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACID = null;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACNAME = '';
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT = 0;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT = 0;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].NARATION = '';
        if(document.getElementById("SubLedgerInput_"+ this.selectedIndex)){
        document.getElementById("SubLedgerInput_" + this.selectedIndex).removeAttribute("placeholder");
      }
    }

      this.focusNext(1, this.selectedIndex, null, acItem.HASSUBLEDGER);
    } catch (error) {
      console.log(error)
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedIndex
      ].AccountItem.ACCODE = "";
      // this.focusNext(0, this.selectedIndex);
    }


  }

  getAccountWiseTrnAmount(ac: TAcList) {
    this._transactionService.getAccountWiseTrnAmount(ac.ACID);
  }

  onAcRowFocus(index: number) {
    let account = this._transactionService.TrnMainObj.TrntranList[index].AccountItem;

    if (account && account != null && account != undefined) {
      this.getAccountWiseTrnAmount(account)
    };
  }

  showCostCenterList(i) {
    this.selectedIndex = i;
    if(this.masterService.userSetting.EnableCompulsoryCostCategory==1){
      this.gridCostCenterGroupListPopupSettings = {
        title: "Cost Centers Group",
        apiEndpoints: `/getCostCenterGroupPagedList`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: "ccgid",
            title: "ID",
            hidden: false,
            noSearch: false
          },
          {
            key: "COSTCENTERGROUPNAME",
            title: "Cost Center Group Name",
            hidden: false,
            noSearch: false
          },
          
        ]
      };
  this.genericGridCostCenterGroupList.show();
    }
    else{
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

  }
  onCostCenterGroupSelect(costCenter) {
    this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].COSTCENTERGROUP_NAME = costCenter.COSTCENTERGROUPNAME;
    this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CCG_ID = costCenter.ccgid; 
    this.gridCostCenterListPopupSettings = {
      title: "Cost Centers",
      apiEndpoints: `/getCostCenterPagedListAccordingToId/${costCenter.ccgid}`,
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
  onCostCenterSelect(costCenter) {
    this._transactionService.TrnMainObj.TrntranList[
      this.selectedIndex
    ].CostCenter = costCenter.COSTCENTERNAME;
    this._transactionService.TrnMainObj.TrntranList[
      this.selectedIndex
    ].CCID = costCenter.CCID; // for Budget Status Checking
    this.focusNext(4, this.selectedIndex);
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  LoadSubledgerForTran(t: Trntran) {
    try {
      if (
        t.AccountItem != null &&
        (t.AccountItem && t.AccountItem.HASSUBLEDGER == 1)
      ) {
        t.SubledgerTranList.forEach(z => {
          (z.ROWMODE = "save"),
            (z.SubledgerItem = this.subledgerDropDownList.filter(
              w => w.ACID == z.A_ACID
            )[0]);
        });
        if (this.viewMode == false) {
        }
        this.addTrnTranRow();
      }
    } catch (ex) {
      alert(ex);
    }
  }

  accountListObservable$ = (keyword: any): Observable<TAcList[]> => {
    try {
      return new Observable((observer: Subscriber<TAcList[]>) => {
        if (keyword) {
          this.trnaccountList
            .map(data => {
              var lst = data.filter(
                ac =>
                  ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1
              );
              return lst;
            })
            .subscribe(res => {
              observer.next(res);
            });
        } else {
          observer.next([]);
        }
      });
    } catch (ex) {
      alert(ex);
    }
  };

  AddNewSubLedgerRow() {
    try {
      var nullsl = <TSubLedgerTran>{};
      nullsl.SubledgerItem = <TSubLedger>{};
      nullsl.ROWMODE = "new";
      this.subledgers.push(nullsl);
      /*
            var fGroup= this.fb.group({
                accode:new FormControl(''),
                acname:new FormControl(''),
                dramnt:new FormControl(0),
                cramnt:new FormControl(0),
                remarks:new FormControl(''),
                acItem:new FormControl(''),
            })
            */
    } catch (ex) {
      alert(ex);
    }
  }
  focusNarration(index) {
    this._transactionService.addRowForTransaction(index);
  }
  TrnTranRowOk($event, index, value) {
    $event.preventDefault();
    if (value.AccountItem.HASSUBLEDGER == 1 && (!this._transactionService.TrnMainObj.TrntranList[index].SL_ACID)) {
      var ACNAME = value.AccountItem.ACNAME;
      this.alertService.warning("PLEASE, SPECIFY SUB LEDGER FOR A/C '" + ACNAME + "'");
      return;
    }
    // ////console.log("narration",this._transactionService.TrnMainObj.TrntranList);
    
    this._transactionService.diffAmountItemForAccount = 0;
    var nextindex = index + 1;
    this.selectedIndex = index+1;
    try {
      if (this.userSetting.ENABLE_BUDGETCONTROL==1 &&
        (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.AdditionalCost)
      ) {
        this.checkBudgetStatus(index);
      }
      if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.AccountOpeningBalance ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher

      ) {
       
        this._transactionService.addRowForTransaction(index);
        
        // if (document.getElementById("ACCODEInput_" + nextindex) != null) {
        //   document.getElementById("ACCODEInput_" + nextindex).focus();
        // };
        setTimeout(() => {
          this.focusNext(0, index + 1);
        }, 500)
      }
      else if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher) {
        // this._transactionService.addRowForTransaction(index);

        this.focusNext(7, index);
      }
      else if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
        this.focusNext(5, index);
      }
    } catch (ex) {
      alert(ex);
    }

   

  }

  FocusOn(event,index){
    // //console.log("Reached inside",index);
    if(this.voucherType==64){
      document.getElementById("CPTYPE"+index).focus();
    }

  }

  onChequeDateEnter($event, index) {
    var nextindex = index + 1;
    this._transactionService.addRowForTransaction(index);
    if (document.getElementById("ACCODEInput_" + nextindex) != null) {
      document.getElementById("ACCODEInput_" + nextindex).focus();
    };
  }


  onAcRowFocusOut(i) {
    this.selectedIndex=i
    // ////console.log("this.activerowindex",i)
    //   ////console.log("mainlist",this._transactionService.TrnMainObj.TrntranList[0]);
    // ////console.log("AcRowFocusOut",this._transactionService.TrnMainObj.TrntranList[i].AccountItem)
    // ////console.log("length",Object.keys(this._transactionService.TrnMainObj.TrntranList[0].AccountItem).length);
    if (i > 0 && Object.keys(this._transactionService.TrnMainObj.TrntranList[0].AccountItem).length != 0
    ) {
      if (this._transactionService.TrnMainObj.TrntranList[i].A_ACID == undefined ||
        this._transactionService.TrnMainObj.TrntranList[i].A_ACID == null ||
        this._transactionService.TrnMainObj.TrntranList[i].A_ACID == "") {
        this._transactionService.diffAmountItemForAccount = 0;
      }
    }
    this._transactionService.subledgerfocus = false;
  }


  SubLedgerRowOk(index) {
    try {
      var rm = this.subledgers[index].ROWMODE;
      if (rm == "new") {
        this.subledgers[index].ROWMODE = "save";
        this.AddNewSubLedgerRow();
      } else if (rm == "edit") {
        this.subledgers[index].ROWMODE = "save";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  removeRow(index) {
    try {
      if (
        this._transactionService.TrnMainObj.TrntranList[index].inputMode ==
        true &&
        this._transactionService.TrnMainObj.TrntranList[index].editMode == false
      ) {
        this._transactionService.TrnMainObj.TrntranList[index] = <Trntran>{};
        this._transactionService.TrnMainObj.TrntranList[index].AccountItem = <TAcList>{};
        this._transactionService.TrnMainObj.TrntranList[index].SubledgerTranList = [];
        //this.showSubLedger = false;
        this.showHelp = true;
        this._transactionService.TrnMainObj.TrntranList[index].inputMode = true;
        this._transactionService.TrnMainObj.TrntranList[index].editMode = false;
        this._transactionService.TrnMainObj.TrntranList[index].drBGColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].drColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].crBGColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].crColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].hasDebit = true;
        this._transactionService.TrnMainObj.TrntranList[index].hasCredit = true;
        // this.changeCredit(null, index);
        // this.changeDebit(null, index);
      } else {
        this._transactionService.TrnMainObj.TrntranList.splice(index, 1);
        //this.hasAddBtn = false;
        this._transactionService.TrnMainObj.TrntranList[index].DRAMNT = null;
        this._transactionService.TrnMainObj.TrntranList[index].CRAMNT = null;

        // this.showSubLedger = false;
        this.showHelp = true;

        //this.changeCredit(null, index);
        //this.changeDebit(null, index);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  clearRow($event, index, value) {
    try {
      $event.preventDefault();

      if (confirm("Are you sure you want to delete the row?")) {
        this._transactionService.deleteAccountTrnRow(index);
        ////console.log("firsteventvalue", event);
        this.TrnTranCrAmtChange(event);
        this.TrnTranDrAmtChange(null, index);

        if (value !== undefined && value != null && value != 'undefined') {
          ////console.log("value null2", value);
          this.VoucherTracking.removeRowFromGuid(value.guid,index);
        }

        if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Cellpay){
          this._transactionService.TrnMainObj.TrntranList=[];
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
          this._transactionService.TrnMainObj.TrntranList.push(newRow);
        }

      }
    } catch (ex) {
      alert(ex);
    }
  }

  clearSubLedgerRow(index) {
    try {
      var rm = this.subledgers[index].ROWMODE;
      if (rm == "new") {
        this.subledgers[index] = <TSubLedgerTran>{};
        this.subledgers[index].SubledgerItem = <TSubLedger>{};
        this.subledgers[index].ROWMODE = "new";
      } else if (rm == "save" || rm == "edit") {
        this.subledgers.splice(index, 1);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  editRow(index) {
    try {
      if (
        this._transactionService.TrnMainObj.TrntranList[index].ROWMODE == "save"
      ) {
        this._transactionService.TrnMainObj.TrntranList[index].ROWMODE = "edit";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  editSubledgerRow(index) {
    try {
      if (this.subledgers[index].ROWMODE == "save") {
        this.subledgers[index].ROWMODE = "edit";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  trnAccountChange(hasSubLedger, index) {
    try {
      this.selectedtrntranRowIndex = index;
      //this._transactionService.TrnMainObj.TrntranList[index].CRAMNT = 0;
      // this._transactionService.TrnMainObj.TrntranList[index].DRAMNT = 0;
      if (hasSubLedger == 1) {
        this.showSubLedgerEntry(index);
        if (
          this.voucherType == VoucherTypeEnum.PaymentVoucher ||
          this.voucherType == VoucherTypeEnum.CreditNote
        ) {
          // this.subLedgerCrAmtChanges(index);
        } else if (
          this.voucherType == VoucherTypeEnum.ReceiveVoucher ||
          this.voucherType == VoucherTypeEnum.DebitNote
        ) {
          // this.subLedgerDrAmtChanges();
        }
      } else {
        this.hideSubLedgerEntry(index);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  hideSubLedgerEntry(index) {
    try {
      this.hideSubledger = true;
      this.subledgers = [];
      if (
        this._transactionService.TrnMainObj.TrntranList[index].ROWMODE == "new"
      ) {
        this.showHelp = true;
        this.hideSubledgerList = true;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  showSubLedgerEntry(index) {
    try {
      if (
        this._transactionService.TrnMainObj.TrntranList[index]
          .SubledgerTranList == null
      ) {
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].SubledgerTranList = [];
      }
      if (
        this._transactionService.TrnMainObj.TrntranList[index].SubledgerTranList
          .length == 0
      ) {
        this.AddNewSubLedgerRow();
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].SubledgerTranList = this.subledgers;
      }
      this.subledgers = this._transactionService.TrnMainObj.TrntranList[
        index
      ].SubledgerTranList;
      for (var i in this.subledgers) {
        if (
          this.subledgers[i].SubledgerItem != null &&
          this.subledgers[i].SubledgerItem.ACNAME != null &&
          this.subledgers[i].Amount != null &&
          this.subledgers[i].Amount > 0
        ) {
          this.subledgers[i].ROWMODE = "save";
        }
      }
      this.hideSubledger = false;
      this.hideSubledgerList = true;
      this.showHelp = false;
    } catch (ex) {
      alert(ex);
    }
  }

  rowClick(i) {
    try {
      this.masterService.ShowMore = this.masterService.ShowMore;
      this.showHelp = false;
      this.hideSubledgerList = false;
      this.selectedtrntranRowIndex = i;
      if (
        this._transactionService.TrnMainObj.TrntranList[i].AccountItem == null
      ) {
        return;
      }
      if (
        this._transactionService.TrnMainObj.TrntranList[i].AccountItem &&
        this._transactionService.TrnMainObj.TrntranList[i].AccountItem
          .HASSUBLEDGER == 1
      ) {
        this.showSubLedgerEntry(i);
        if (
          this.voucherType == VoucherTypeEnum.PaymentVoucher ||
          this.voucherType == VoucherTypeEnum.CreditNote
        ) {
          // this.subLedgerCrAmtChanges(i);
        } else if (
          this.voucherType == VoucherTypeEnum.ReceiveVoucher ||
          this.voucherType == VoucherTypeEnum.DebitNote
        ) {
          // this.subLedgerDrAmtChanges();
        }
      } else {
        this.hideSubLedgerEntry(i);
      }

      // if(this._transactionService.TrnMainObj.TrntranList[i].ROWMODE == "new"){
      //     this.showHelp = true;
      //     this.hideSubledgerList = true;
      // }
    } catch (ex) {
      alert(ex);
    }

    // this._transactionService.TrnMainObj.TrntranList.forEach(x=>{
    //   x.ISTAXABLE = 1;
    // });

   

  }

  addTrnTranRow() { }

  subLedgerDrAmtChanges() {
    try {
      this.subLedgerTotal = 0;
      this.subledgers.forEach(x => {
        this.subLedgerTotal += x.DRAMNT == null ? 0 : x.DRAMNT;
      });
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedtrntranRowIndex
      ].CRAMNT = this.subLedgerTotal;
      this.TrnTranCrAmtChange(null);
    } catch (ex) {
      alert(ex);
    }
  }

  subLedgerCrAmtChanges(i) {
    try {
      this.subLedgerTotal = 0;
      this.subledgers.forEach(x => {
        this.subLedgerTotal += x.CRAMNT == null ? 0 : x.CRAMNT;
      });
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedtrntranRowIndex
      ].DRAMNT = this.subLedgerTotal;
      this.TrnTranDrAmtChange(null, i);
    } catch (ex) {
      alert(ex);
    }
  }

  drTotal: number;
  crTotal: number;

  TrnTranDrAmtChange(value, i) {

    try {
      if (i > 0) {


        //this.calculateDRandCRAmount(i);
      }


      this.trntranTotal = 0;
      this.drAmount=0; // here
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote){
          this.trntranTotal += x.CRAMNT == null ? null : x.CRAMNT;
        }else{
          this.trntranTotal += x.DRAMNT == null ? null : x.DRAMNT;
        }
        this.drAmount += x.DRAMNT == null ? null : x.DRAMNT;
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      if (this._transactionService.TrnMainObj.VoucherType == 15 || this._transactionService.TrnMainObj.VoucherType == 16) {

        // if (this._transactionService.TrnMainObj.VATBILL == 0) {

          this.CalculateAccountVAT();
        // }
        // else {
        //   this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
        //   this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
        // }
      }else{
        this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
        this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
      }  

      ////console.log("trntranTOTAMNT", this.trntranTotal);
      this.VoucherTracking.GetAdjAmtValue(value);
      this._transactionService.calculateDrCrDifferences();
      if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
        this._transactionService.budgetCalculation(i);
      }

    } catch (ex) {
      ////console.log("dramountundefine");
      alert(ex);
    }

  }




  BillTrack() {
// console.log("hi",this._transactionService.TrnMainObj.TrntranList)
    if (this._transactionService.TrnMainObj.TrntranList.length > 0) {
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem != undefined) {

        if (this.voucherType == 18) {
          this.VoucherTracking.CustomerPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem, this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
          this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT);
        }
        else if (this.voucherType == 17) {
          this.VoucherTracking.SupplierPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem, this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
          this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT, this.selectedIndex);
        }
        this.ACBalanceType = 'Cr.'


        // this.VoucherTracking.CustomerPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem)
        // if (this.voucherType == 18 || this.voucherType == 12) {
        //   if (this.voucherType == 12) {
        //     if (this.activeCredit == true)
        //       this.VoucherTracking.show();
        //   }
        //   else {
        //     this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT, this.selectedIndex);
        //   }
        //   this.ACBalanceType = 'Cr.'
        // }
      } else {
        this.alertService.error("Please Select Account For Bill Tracking")

      }

    } else {
      this.alertService.error("No Account Found For Adjustment")
    }
  }
  @HostListener("document : keydown", ["$event"])
  keyDownEvent($event: KeyboardEvent, adjAmt) {
    if ($event.code == "F12") {
      $event.preventDefault();
      if (this._transactionService.TrnMainObj.VoucherType == 23) {
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].PartyDetails
        this.openingbalancetracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].PartyDetails);
      } else {
        if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem != undefined) {
          if (this.voucherType == 18 || this.voucherType == 12 || this.voucherType == 17) {
            if (this.voucherType == 12) {
              if (this.activeCredit == true)
                this.VoucherTracking.show();
            }
            else if (this.voucherType == 18) {
              ////console.log("CheckGUID", this.VoucherTracking.guid)
              this.VoucherTracking.CustomerPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem, this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
              this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT);
            }
            else if (this.voucherType == 17) {
              ////console.log("CheckGUID", this.VoucherTracking.guid)

              this.VoucherTracking.SupplierPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem, this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
              this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT, this.selectedIndex);
            }
            this.ACBalanceType = 'Cr.'
          }
        } else {
          this.alertService.error("Please Select Account For Bill Tracking")
        }
      }
    }

  }


  AccBal: number = 0;
  AdjustingAmt: number = 0;
  PartyName: any;
  saveopeningbilllist(BillList) {
    this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].PartyDetails = BillList;
  }
  TrnTranCrAmtChange(value) {

    try {

      this.trntranTotal = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        ////console.log("checkXvalue", x.CRAMNT)
        this.crAmount = x.CRAMNT;
        if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote){
          this.trntranTotal += x.CRAMNT == null ? null : x.CRAMNT;
        }else{
          this.trntranTotal += x.DRAMNT == null ? null : x.DRAMNT;
        }

      });
      this._transactionService.trntranTotal = this.trntranTotal;
      // 16 Debit note 15 Credit Note
      if (this._transactionService.TrnMainObj.VoucherType == 15 || this._transactionService.TrnMainObj.VoucherType == 16) {

        // if (this._transactionService.TrnMainObj.VATBILL == 0) {

          this.CalculateAccountVAT();
        // }
        // else {
        //   this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
        //   this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
        // }
      }
      else {

        if (this._transactionService.TrnMainObj.VoucherType != VoucherTypeEnum.PaymentVoucher) {
          this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
          this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
        }
      }

      this.VoucherTracking.GetAdjAmtValue(value);
      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      ////console.log("alert from credit");
      alert(ex);
    }
  }
  partyOpeningPopup(voucher:string,value,i){
    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance){
 if((this._transactionService.userSetting.enablepartyopeningdetails==1||this._transactionService.userSetting.enablepartyopeningdetails==2 )  && (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT!=null ||this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT!=null)){
  this.showPartyOpeningDetails(this.selectedIndex, voucher)
//   this._transactionService.TrnMainObj.TrntranList[i]
// .PartyDetails[i].AMOUNT=value.target.value;  
    }
  }
    }
  
  CalculateAccountVAT() {
    ////console.log("trantar", this.trntranTotal);
    this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
    this._transactionService.TrnMainObj.TAXABLE = this.trntranTotal
    this._transactionService.TrnMainObj.NONTAXABLE = this.trntranTotal - this._transactionService.TrnMainObj.TAXABLE
    this._transactionService.TrnMainObj.VATAMNT = (13 / 100) * this._transactionService.TrnMainObj.TAXABLE;
    this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal + this._transactionService.TrnMainObj.VATAMNT;
    ////console.log("CheckData", this._transactionService.TrnMainObj.TOTAMNT,
    // this._transactionService.TrnMainObj.TAXABLE,
    //   this._transactionService.TrnMainObj.NONTAXABLE,
    //   this._transactionService.TrnMainObj.VATAMNT,
    //   this._transactionService.TrnMainObj.NETAMNT,
    //   this.trntranTotal)
  }
  AutoSelectAcnameChange($event, index) {
    try {
      if (typeof $event == "object") {
        var ac = <TAcList>$event;
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].AccountItem = $event;
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].AccountItem.ACCODE = ac.ACCODE;
        // if (ac.HASSUBLEDGER == 1) {
        //     this.showSubLedgerEntry(index);
        // } else {
        //     this.hideSubLedgerEntry(index);
        //     this._transactionService.TrnMainObj.TrntranList[index].SubledgerTranList = [];
        // }
      } else {
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].AccountItem.ACCODE = "";
      }
    } catch (error) {
      this._transactionService.TrnMainObj.TrntranList[
        index
      ].AccountItem.ACCODE = "";
    }
  }

  checkDifference() {
    try {
      let diffAmount: number = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(tran => {
        diffAmount =
          diffAmount +
          ((tran.DRAMNT == null ? 0 : tran.DRAMNT) -
            (tran.CRAMNT == null ? 0 : tran.CRAMNT));
      });
      this._transactionService.differenceAmount = Math.abs(diffAmount);
    } catch (ex) {
      alert(ex);
    }
  }

  debitTotal() {
    try {
      let debitAmount: number = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(tran => {
        debitAmount = debitAmount + (tran.DRAMNT == null ? 0 : tran.DRAMNT);
      });
      this.drTotal = debitAmount;
    } catch (ex) {
      alert(ex);
    }
  }

  creditTotal() {
    try {
      let creditAmount: number = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(tran => {
        creditAmount = creditAmount + (tran.CRAMNT == null ? 0 : tran.CRAMNT);
      });
      this.crTotal = creditAmount;
    } catch (ex) {
      alert(ex);
    }
  }

  changeSubDebit(value, index) {
    try {
      this.subDebitTotal();
      this.creditTotal();
      this.checkDifference();
      // this.hasLedgerAddBtn = true;
      // if (value == null) {
      //     this.hasLedgerAddBtn = true;
      // } else if (this.subLedgerList[index].SubledgerItem == null || this.subLedgerList[index].SubledgerItem.ACID == null || this.subLedgerList[index].DRAMNT <= 0) {
      //     this.hasLedgerAddBtn = false;
      // }
      // if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
      //     this._trnMainService.saveDisable  = false;
      // } else {
      //     this._trnMainService.saveDisable  = true;
      // }
    } catch (ex) {
      alert(ex);
    }
  }

  changeSubCredit(value, index) {
    try {
      this.subCreditTotal();
      this.debitTotal();
      this.checkDifference();
      // this.hasLedgerAddBtn = true;
      // if (value == null) {
      //     this.hasLedgerAddBtn = true;
      // } else if (this.subLedgerList[index].SubledgerItem == null || this.subLedgerList[index].SubledgerItem.ACID == null || this.subLedgerList[index].CRAMNT <= 0) {
      //     this.hasLedgerAddBtn = false;
      // }
      // if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
      //     this._trnMainService.saveDisable  = false;
      // } else {
      //     this._trnMainService.saveDisable  = true;
      // }
    } catch (ex) {
      alert(ex);
    }
  }

  subDebitTotal() {
    try {
      let debitAmount: number = 0;
      // this.trnMain.TrntranList[this.changeIndex].SubledgerTranList.forEach(sub => {
      //     debitAmount = debitAmount + ((sub.DRAMNT == null) ? 0 : sub.DRAMNT)
      // })
      // this.trnMain.TrntranList[this.changeIndex].CRAMNT = debitAmount;
      // this.subDrTotal = debitAmount;
      // if (this.trnMain.TrntranList[this.changeIndex].AccountItem != null && this.trnMain.TrntranList[this.changeIndex].CRAMNT > 0) {
      //     this.hasAddBtn = true;
      // } else {
      //     this.hasAddBtn = false;
      // }
    } catch (ex) {
      alert(ex);
    }
  }

  subCreditTotal() {
    try {
      let creditAmount: number = 0;
      // this.trnMain.TrntranList[this.changeIndex].SubledgerTranList.forEach(sub => {
      //     creditAmount = creditAmount + ((sub.CRAMNT == null) ? 0 : sub.CRAMNT)
      // })
      // this.subCrTotal = creditAmount;
      // this.trnMain.TrntranList[this.changeIndex].DRAMNT = creditAmount;
      // if (this.trnMain.TrntranList[this.changeIndex].AccountItem != null && this.trnMain.TrntranList[this.changeIndex].DRAMNT > 0) {
      //     this.hasAddBtn = true;
      // } else {
      //     this.hasAddBtn = false;
      // }
    } catch (ex) {
      alert(ex);
    }
  }

  showPartyOpeningDetails(index: number, acCase: string) {
    //validate

    if (this._transactionService.TrnMainObj.VoucherType != 23) return;

    var currentTrnTranObj = this._transactionService.TrnMainObj.TrntranList[index];

    if (currentTrnTranObj.AccountItem.PType == "V" && acCase == 'drAmt') {
      //alert error
      this.alertService.warning("Party Opening details is not valid for Dr Amount with selected A/C");
      return;
    }

    if (currentTrnTranObj.AccountItem.PType == "C" && acCase == 'crAmt') {
      //alert error
      this.alertService.warning("Party Opening details is not valid for Cr Amount with selected A/C");
      return;
    }

    //show popup
    this.partyOpeningDetailsPopup.show(index, acCase);
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      alert(ex);
    }
  }


  setChequeDate(value, index) {
    if (value != null && value != undefined && value != "") {
      if (this.masterService.ValidateDate(value)) {
        this._transactionService.TrnMainObj.TrntranList[index].ChequeDate = this.masterService.changeIMsDateToDate(value);
        this.chequeDateAD(this._transactionService.TrnMainObj.TrntranList[index].ChequeDate,'AD',index)
        this.onChequeDateEnter(value, index);
      } else {
        this.alertService.error(`Invalid Transaction Date`);
        return;
      }
    }
    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher) {
      if (this._transactionService.TrnMainObj.TrntranList[index].NARATION1 == 'e-transfer') {
        if (this._transactionService.TrnMainObj.TrntranList[index].ChequeNo == '' || this._transactionService.TrnMainObj.TrntranList[index].ChequeNo == null || this._transactionService.TrnMainObj.TrntranList[index].ChequeNo == undefined) {
          this.alertService.error(`Please Enter Number for ${this._transactionService.TrnMainObj.TrntranList[index].AccountItem.ACNAME}`);
          return;
        }
        if (this._transactionService.TrnMainObj.TrntranList[index].ChequeDate == '' || this._transactionService.TrnMainObj.TrntranList[index].ChequeDate == null || this._transactionService.TrnMainObj.TrntranList[index].ChequeDate == undefined) {
          this.alertService.error(`Please Enter Date for ${this._transactionService.TrnMainObj.TrntranList[index].AccountItem.ACNAME}`);
          return;
        }
      }
    }

    if(this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PostDirectory){
      document.getElementById("oppremarks_" + index).focus();
    }else{
      this._transactionService.addRowForTransaction(index);
      if (document.getElementById("ACCODEInput_" + index + 1) != null) {
        document.getElementById("ACCODEInput_" + index + 1).focus();
      };
    }

    
  }




  getChequeDate(index) {
    if (this._transactionService.TrnMainObj.TrntranList[index].ChequeDate) {
      return this.masterService.customDateFormate(this._transactionService.TrnMainObj.TrntranList[index].ChequeDate.toString());
    }
  }

  IsNumeric(event, index) {
    var isShift = false;
    if (event.keyCode == 16) {
      isShift = true;
    }

    if (this._transactionService.TrnMainObj.VoucherType == 17 || this._transactionService.TrnMainObj.VoucherType == 18 || this._transactionService.TrnMainObj.VoucherType == 62) {
      if ((this._transactionService.TrnMainObj.TrntranList[index].NARATION1 == '' || this._transactionService.TrnMainObj.TrntranList[index].NARATION1 == null || this._transactionService.TrnMainObj.TrntranList[index].NARATION1 == undefined) && this._transactionService.TrnMainObj.TrntranList[index].NARATION1 != "none") {
        this.alertService.warning("Please Select transaction Type.");
        this._transactionService.TrnMainObj.TrntranList[index].ChequeNo = '';
        return;
      } else {
        if (this._transactionService.TrnMainObj.TrntranList[index].NARATION1 != "others" || this._transactionService.TrnMainObj.TrntranList[index].NARATION1 != "none") {
          if (((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 8 || event.keyCode <= 37 || event.keyCode <= 39 || (event.keyCode >= 96 && event.keyCode <= 105)) && isShift == false) {
            return true;
          }
          else {
            return false;
          }
        }
      }
    } else {
      if (((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 8 || event.keyCode <= 37 || event.keyCode <= 39 || (event.keyCode >= 96 && event.keyCode <= 105)) && isShift == false) {
        return true;
      }
      else {
        return false;
      }
    }


  }



  onTrnTypeChange(trnType, index) {
    this._transactionService.TrnMainObj.TrntranList[index].ChequeNo = '';
    this._transactionService.TrnMainObj.TrntranList[index].ChequeDate = '';

    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
      this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher
    ) {
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].NARATION1 == 'none') {
        let sname = "";
        sname = `ACCODEInput_${index + 1}`
        let element = document.getElementById(`${sname}`);
        if (element) {
          setTimeout(function () {
            (<HTMLInputElement>element).focus();
          }, 100)
        }
      } else {
        let sname = "";
        sname = `ChequeNo_${index}`
        let element = document.getElementById(`${sname}`);
        if (element) {
          (<HTMLInputElement>element).focus();
        }
      }
    }
  }

  setParentAccountForAutoCalculation(index: number) {
    let i: number = index;
    let acItem = this._transactionService.TrnMainObj.TrntranList[i - 1];
    if (acItem != null) {
      if (acItem.AccountItem.ACID == this._transactionService.AppSettings.CGST_PAYABLE
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.IGST_PAYABLE
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.SGST_PAYABLE
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.CGST_RECEIVABLE
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.IGST_RECEIVABLE
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.SGST_RECEIVABLE
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.CGST_PAYABLE_RCM
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.IGST_PAYABLE_RCM
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.SGST_PAYABLE_RCM
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.CGST_RECEIVABLE_RCM
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.IGST_RECEIVABLE_RCM
        || acItem.AccountItem.ACID == this._transactionService.AppSettings.SGST_RECEIVABLE_RCM) {
        this.setParentAccountForAutoCalculation(i - 1);
      }
      else {
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.parentAccountForAutoGSTCalculation =
          acItem.AccountItem;
      }

    }

  }
  // processMyValue(i): void {
  //   ////console.log("logProcess",i,i.dramnt)
  //   if(i.dramnt == undefined) return
  //   let numberVal = parseInt(i.dramnt).toLocaleString();
  //   i.dramnt= numberVal;
  // }
  myValue: string;

  processMyValue(): void {
    var dr = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT.toString();
    var numberVal = parseInt(dr).toLocaleString();
    ////console.log("CheckVlaue", numberVal)
    // this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT =  numberVal ;
  }

  setHeight() {
    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CapitalVoucher) {
      this.height = { 'height': '300px' };
      return this.height;
    } else {
      this.height = { 'height': '480px' };
      return this.height;
    }
  }

  cancelAccountPopup() {
    this.showAccountMasterPopup = false;
    this.resetAccountMaster();
  }

  cancelPartyPopup() {
    this.showPartyMasterPopup = false;
    this.resetPartyAccount();
  }

  resetAccountMaster() {
    this.formObj.ACTYPE = '';
    this.formObj.ACID = '';
    this.formObj.HASSUBLEDGER = 0;
    this.formObj.ACNAME = '';
    this.MainACID = '';
    this.SubGroupAccountMaster = [];
    this.formObj.MAPID = '';
  }

  resetPartyAccount() {
    this.partymasterObj.ACID = '';
    this.partymasterObj.ACCODE = '';
    this.partymasterObj.ACNAME = '';
    this.partymasterObj.ADDRESS = '';
    this.partymasterObj.VATNO = '';
    this.partymasterObj.GEO = '';
    this.partymasterObj.CITY = '';
    this.partymasterObj.CRLIMIT = 0;
    this.partymasterObj.CRPERIOD = 0;
    this.partymasterObj.PType = 'C';
    this.partymasterObj.MOBILE = ''
  }
  mainGrpActype: any;
  OnSelectMainGroup(event) {
    this.masterService.getSubGroupForQuickAccountMaster(event.target.value).subscribe(res => {
      this.SubGroupAccountMaster = res.result;
      this.MainACID = event.target.value;
    })
    this.mainGrpActype = this.MainGroupAccountMaster.filter(actype => actype.ACID == event.target.value);
    this.mainGrpActype = this.mainGrpActype[0].ACTYPE;


  }

  OnSelectSubGroup(event) {
    this.HASSUBLEDGER = this.SubGroupAccountMaster.filter(x => x.HASSUBLEDGER == 1 && x.ACID == event.target.value)
    this.formObj.HASSUBLEDGER = this.HASSUBLEDGER.length > 0 ? this.HASSUBLEDGER[0].HASSUBLEDGER : 0;
    if ((this.SubGroupAccountMaster.filter(x => x.ACID == 'AG006' && event.target.value == 'AG006')).length > 0) {
      this.formObj.MAPID = 'B';
    } else
      if ((this.SubGroupAccountMaster.filter(x => x.ACID == 'AG005' && event.target.value == 'AG005')).length > 0) {
        this.formObj.MAPID = 'C';
      } else if ((this.SubGroupAccountMaster.filter(x => x.ACID == 'AG013' && event.target.value == 'AG013')).length > 0) {
        this.formObj.MAPID = 'OD';
      } else {
        this.formObj.MAPID = 'N';
      }
  }

  saveAccountMaster() {
    let saveModel = Object.assign(<TAcList>{}, this.formObj);
    saveModel.DIV = this.userProfile.userDivision;
    saveModel.PARENT = this.formObj.ACID ? this.formObj.ACID : this.MainACID;
    if (saveModel.PARENT == this.MainACID) {
      saveModel.ACID = this.MainACID;
    }
    saveModel.ACTYPE = this.mainGrpActype;
    // saveModel.HASSUBLEDGER = this.formObj.HASSUBLEDGER;
    // saveModel.HASSUBLEDGER = 0;

    if (this.formObj.HASSUBLEDGER == 1) {
      saveModel.MCAT = 'SL'
    }
    if (saveModel.PARENT == '') {
      alert("Please Select Group First!")
      return;
    }
    if (saveModel.ACNAME == '') {
      alert("Please enter Account Name First!")
      return;
    }

    saveModel.ACCODE="";

    this.mode = "add";
    this.BankPartyVerification.SupplierGrp = 0;
    saveModel.TDS_TYPE="";
    saveModel.enableDivSelectionTable=false;

    let sub = this.masterService.saveAccountLedgerOnly(
      this.mode,
      saveModel,
      null,
      this.BankPartyVerification
    ).subscribe(
      data => {
        if (data.status == "ok") {
          // this.alertService.success("Data Saved Successfully");
          this.cancelAccountPopup();
          this.genericGridACList.hide();
          this.masterService.getDetailsOfAccount(saveModel.ACNAME).subscribe(res => {
            if (res.status == "ok") {
              this.newAccountDetails = res.result;
              // ////console.log("@@this.newAccountDetails",this.newAccountDetails[0])
              this.onAcSelect(this.newAccountDetails[0]);
            }
          })
        } else {
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

  onChangeArea(event) {
    let userAreaName = event.target.value;
    let checkArea = [];
    if (userAreaName != null) {
      checkArea = this.areaList.filter(x => x.AREANAME.toUpperCase() == userAreaName.toUpperCase());
      if (checkArea.length == 0) {
        if (confirm("Do you want to add new Area")) {
        } else {
        }
      }
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  savePartyMaster() {
    let savePartyMaster = Object.assign(<TAcList>{}, this.partymasterObj);
    savePartyMaster.DIV = this.userProfile.userDivision;
    savePartyMaster.PARENT = this.partymasterObj.ACID;
    savePartyMaster.ISACTIVE = 1;
    savePartyMaster.CRLIMIT = this.partymasterObj.CRLIMIT ? this.partymasterObj.CRLIMIT : 0;
    savePartyMaster.CRPERIOD = this.partymasterObj.CRPERIOD ? this.partymasterObj.CRPERIOD : 0;
    savePartyMaster.CATEGORY = this.partymasterObj.GEO;
    if (this.partymasterObj.CITY != null) {
      let checkAreaID = this.areaList.filter(x => x.AREANAME.toUpperCase() == this.partymasterObj.CITY.toUpperCase());
      ////console.log("@@Quick_checkAreaID", checkAreaID);
      savePartyMaster.AREA_ID = checkAreaID[0] ? checkAreaID[0].AREAID : null;
    }

    if (savePartyMaster.ACID == '') {
      alert("Please Select Party Group First!")
      return;
    }
    if (savePartyMaster.ACNAME == '') {
      alert("Please Enter Party Name First!")
      return;
    }
    if (savePartyMaster.ADDRESS == '') {
      alert("Please Enter Address First!")
      return;
    }
    if (this.partymasterObj.PType == 'V') {
      if (savePartyMaster.VATNO == '') {
        alert("Please Enter VATNO First!")
        return;
      }
    }
    if (savePartyMaster.VATNO != '') {
      if (savePartyMaster.VATNO.length != 9) {
        alert("VAT NO should be nine digit length!")
        return;
      }
    }



    if (this.userSetting.CREATE_CPROFILE_AS_MEMBER == 1 && this.createMember == true && this.partymasterObj.PType == 'C') {
      if (savePartyMaster.MOBILE == '') {
        alert("Please Enter Mobile No. First!")
        return;
      }
    }

    if (savePartyMaster.MOBILE != '') {
      if (savePartyMaster.MOBILE.length != 10) {
        alert("Mobile No. should be ten digit length!")
        return;
      }
    }

    if (this.partymasterObj.PType == 'V') {
      this.createMember = false;
    }

    this.mode = "add";
    savePartyMaster.PCL = 'pc002';
    ////console.log("@@createMember", this.createMember)
    let sub = this.masterService.saveAccount(
      this.mode,
      savePartyMaster,
      this.createMember
    ).subscribe(
      data => {
        if (data.status == "ok") {
          // this.alertService.success("Data Saved Successfully");
          this.cancelPartyPopup();
          this.genericGridACList.hide();
          this.masterService.getDetailsOfAccount(savePartyMaster.ACNAME).subscribe(res => {
            if (res.status == "ok") {
              this.newPartyDetails = res.result;
              // ////console.log("@@this.newPartyDetails",this.newPartyDetails[0])
              this.onAcSelect(this.newPartyDetails[0]);
            }
          })
        } else {
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

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "PageUp") {
      $event.preventDefault();
      if ((this.masterService.ItemList_Available == '1' || this.masterService.ItemList_Available == '0') && (this.showPartyMasterPopup != true && this.showSubLedgerMasterPopup != true)) {
        this.showAccountMasterPopup = true;
        this.genericGridACList.hide();
      }
      ////console.log("Checksubledgerfocus",this._transactionService.subledgerfocus)
      if (this._transactionService.subledgerfocus == true) {
        this.showSubLedgerMasterPopup = true;
        setTimeout(() => {
          document.getElementById("SL_ACNAME").focus();
        }, 500)
        this.gridSubLedgerSettingList.hide();
        this.showAccountMasterPopup = false;
        this.showPartyMasterPopup = false;
      }
      if (this.showPartyMasterPopup == true) {
        this.showAccountMasterPopup = false;
        this.showSubLedgerMasterPopup = false;
      }
    }
    if ($event.code == "PageDown") {
      $event.preventDefault();
      if ((this.masterService.ItemList_Available == '1' || this.masterService.ItemList_Available == '0') && (this.showAccountMasterPopup != true)) {
        this.showPartyMasterPopup = true;
        this.genericGridACList.hide();
      }
      if (this._transactionService.subledgerfocus == true) {
        this.showSubLedgerMasterPopup = true;
        setTimeout(() => {
          document.getElementById("SL_ACNAME").focus();
        }, 500)
        this.gridSubLedgerSettingList.hide();
        this.showAccountMasterPopup = false;
        this.showPartyMasterPopup = false;
      }
    }
    if ($event.code == "Escape") {
      $event.preventDefault();
      if (this.showAccountMasterPopup = true) {
        this.cancelAccountPopup();
      }
      if (this.showPartyMasterPopup == true) {
        this.cancelPartyPopup();
      }
      if (this.showSubLedgerMasterPopup == true) {
        this.cancelSubLedgerPopup();
      }
    }

    if ($event.code == "End") {
      $event.preventDefault();
      if (this.showAccountMasterPopup = true) {
        this.saveAccountMaster();
      }
      if (this.showPartyMasterPopup == true) {
        this.savePartyMaster();
      }
      if (this.showSubLedgerMasterPopup == true) {
        this.saveSubLedgerMaster();
      }
    }

  }


  onSubLedgerSelect(value) {
    if(this.subLedgerAc==1){
      this.masterService.tdsList[0].DESCA =value.SL_ACNAME;
      this.masterService.tdsList[0].ACID =value.SL_ACID;
      this.subLedgerAc=0
      if( document.getElementById("amount")){
        document.getElementById("amount").focus();
      }
    }else{
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACID = value.SL_ACID;
      this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACNAME = value.SL_ACNAME;
      this.focusNext(1, this.selectedIndex);
    }

  }
  onsubLedgerTab(i) {
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
  changedSubLedger(value) {
    this._transactionService.subledgerfocus = true;
    // if(value.hasSubLedger==1){
    //   this.alertService.warning("PLEASE, SPECIFY SUB LEDGER FOR A/C");

    // }
  }

  saveSubLedgerMaster() {
    if (this.SubLedgerObj.SL_ACNAME === "" || this.SubLedgerObj.SL_ACNAME === null || this.SubLedgerObj.SL_ACNAME === undefined) {
      this.alertService.info("Please Enter Sub Ledger Name");
      return;
    }

    this.mode = "add";

    let sub = this.masterService.saveSubLedgerMaster(
      this.mode,
      this.SubLedgerObj
    ).subscribe(
      data => {
        if (data.status == "ok") {
          this.alertService.success("Data Saved Successfully");
          this.cancelSubLedgerPopup();
          this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACNAME = data.result.SL_ACNAME;
          this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACID = data.result.SL_ACID;
          this.gridSubLedgerSettingList.hide();
        } else {
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

  cancelSubLedgerPopup() {
    this.showSubLedgerMasterPopup = false;
    this.resetSubLedgerMaster();
  }

  resetSubLedgerMaster() {
    this.SubLedgerObj.SL_ACNAME = '';
  }

  showSalesmanList() {
    this.gridSalesmanListPopupSettings = {
      title: "Salesman",
      apiEndpoints: `/getAllSalesmanList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "NAME",
          title: "Salesman",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.genericeSalesManList.show();
  }
  onSalesManSelect(value) {
    this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SALESMAN = value.NAME;
    this.masterService.focusAnyControl('narration_' + this.selectedIndex);

  }

  pastedText: any;
  onPaste(event: ClipboardEvent) {
    // ////console.log("@@onPastefxn",event)
    if (event && event.clipboardData) {
      // ////console.log("@@onPastefxnvitra",event.clipboardData.getData('text'))
      this.pastedText = event.clipboardData.getData('text');
    }
  }



  /* To copy Text from Textbox */
  copyText(val: string) {
    if (val != '' && val != null && val != undefined) {
      this.copiedText = val;
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
  }

  getCellPayFee() {
    if (this._transactionService.TrnMainObj.VoucherType === VoucherTypeEnum.Cellpay) {
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem.ACNAME != 'CellPay Fee'
        && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT > 100
        && this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].DRAMNT < 100000) {
          this.onTabBankNameClick();
      }
    }
  }

  showBankPopup(){
    let acid = this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].A_ACID;
    this.gridBankPopupSettings = {
      title: "Bank List",
      apiEndpoints: `/getAdditionalBankPagedList/${acid}`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "BANKCODE",
          title: "Bank Code",
          hidden: false,
          noSearch: false
        },
        {
          key: "BANKNAME",
          title: "Bank Name",
          hidden: false,
          noSearch: false
        },
        {
          key: "BANKACCOUNTNUMBER",
          title: "Account Number",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridBankList.show();
  }
  onBankSelect(value){
    this._transactionService.TrnMainObj.TrntranList[0].BANKCODE  = value.BANKCODE;
    this._transactionService.TrnMainObj.TrntranList[0].BANKNAME  = value.BANKNAME;
    this._transactionService.TrnMainObj.TrntranList[0].ChequeNo = value.BANKACCOUNTNUMBER;
  }
  onValueChnage(value){
    value=true?this.subLedgerAc=0:this.subLedgerAc=1
    this.gridSubLedgerSettingList.hide();
    if( this.masterService.tdsList[0]!=null){
      this.masterService.tdsList[0].DESCA='';
      this.masterService.tdsList[0].ACID='';
      this.masterService.tdsList[0].AMNT='';
      }
  }
  onSubChnage(value){
    value=true?this.generalLedgerAc=0:this.generalLedgerAc=1;
    this.genericGridACList.hide();
    if( this.masterService.tdsList[0]!=null){
    this.masterService.tdsList[0].DESCA='';
    this.masterService.tdsList[0].ACID='';
    this.masterService.tdsList[0].AMNT='';
    }
    // if(value==0){
    //   this.generalLedgerAc=true
    // }
  }


  onEnterLedger(i){
    if(this.generalLedgerAc==1){
      this.gridACListPopupSettings = {
        title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Details/ALL`,
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
  
      this.genericGridACList.show();     
    }
    else if(this.subLedgerAc==1){
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
  }
  focuOnOK(i){
    document.getElementById("button").focus();
  }
  chequeDate(value,index){
    this._transactionService.TrnMainObj.TrntranList[index].ChequeDateBS=value;
    this.chequeDateAD(this._transactionService.TrnMainObj.TrntranList[index].ChequeDateBS,'BS',index)


  }
  chequeDateAD(value, format: string,index) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this._transactionService.TrnMainObj.TrntranList[index].ChequeDateBS= (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
       // this.startDateResponse.emit(value);
    } 
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
        // var bsDate = (value.replace("-", "/")).replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
          //  const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            // if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this._transactionService.TrnMainObj.TrntranList[index].ChequeDate = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            // }else{
            //     this.alertService.error("Cannot Change the date");
            //   return;
            // } 
        // this._reportFilterService.ReportFilterObj.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
}

IsTaxableChange(checkbox,index){
  if(checkbox==true){
    this._transactionService.TrnMainObj.TrntranList[index].ISTAXABLE=1;
  }else{
    this._transactionService.TrnMainObj.TrntranList[index].ISTAXABLE=0;
  }
  this._transactionService.budgetCalculation(index);
}

emitevent(event: string , index) {
  this.emittedEvent = event;
  console.log('ventcheck', event)
  if(this.emittedEvent==true){
    this.masterService.focusAnyControl("NarrationId " + index);
  
  }


}

checkBudgetStatus(i) {
  let Parameters = <any>{}
  Parameters.ACID = this._transactionService.TrnMainObj.TrntranList[i].AccountItem.ACID;
  Parameters.DATE = this._transactionService.TrnMainObj.TRNDATE;
  Parameters.AMOUNT = this._transactionService.TrnMainObj.TrntranList[i].DRAMNT?this._transactionService.TrnMainObj.TrntranList[i].DRAMNT:this._transactionService.TrnMainObj.TrntranList[i].CRAMNT;
  Parameters.CCID = this._transactionService.TrnMainObj.TrntranList[i].CCID?this._transactionService.TrnMainObj.TrntranList[i].CCID:0;

  this.masterService.getBudgetStatus(Parameters).subscribe(res => {
    if (res.status == 'ok') {
      if(res.result && res.result.length && res.result.length>0){
        this._transactionService.TrnMainObj.TrntranList[i].BUDGETNAME=res.result[0].BUDGET_NAME;
        let check_duplicate_Acid=this._transactionService.TrnMainObj.TrntranList.filter(x=>
          x.AccountItem.ACID==this._transactionService.TrnMainObj.TrntranList[i].AccountItem.ACID &&
          x.BUDGETNAME!=null);
          if(check_duplicate_Acid!=null && check_duplicate_Acid.length && check_duplicate_Acid.length>1){
            this._transactionService.dupacid_budget_error_message="Duplicate Account " + this._transactionService.TrnMainObj.TrntranList[i].AccountItem.ACNAME +
            " with budget mapped detected!";
            this.alertService.info("Duplicate Account " + this._transactionService.TrnMainObj.TrntranList[i].AccountItem.ACNAME +
            " with budget mapped detected!");
            return;
          }
        if(res.result[0].OVERSHOOT_STATUS==1 && res.result[0].ACTION!="IGNORE"){
          this._transactionService.budgetexceed_error_message="Budget Amount Exceeds.";
          this.alertService.info("Budget Amount Exceeds.");
          this._transactionService.BUDGET_STATUS=res.result[0].ACTION;
          if(res.result[0].ACTION=="STOP"){
            return;
          }
        }
      }else{
        var result = this._transactionService.TrnMainObj.TrntranList.filter(
          (elem1, i) => this._transactionService.TrnMainObj.TrntranList.some(
            (elem2, j) => (elem2.AccountItem.ACID === elem1.AccountItem.ACID) &&
             (elem2.BUDGETNAME === elem1.BUDGETNAME) && j !== i));
        if(result && result.length==0){ //to remove dup acid message if dup doesnot exist
          this._transactionService.dupacid_budget_error_message="";
        }
      }
    } else {
      this.alertService.error(res.result._body);
    }
  }), err => {
    this.alertService.error(err);
  }
}
}

// (keydown.Enter)="debitTab(3, i, $event)"