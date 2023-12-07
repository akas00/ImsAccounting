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
  OnChanges
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
import { TAcList } from "./../interfaces/Account.interface";
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
import _ from 'lodash';

@Component({
  selector: "trntran-note-entry",
  templateUrl: "./trntran-note-entry.component.html",
  providers: [],
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
  ]
})
export class TrnTranNoteEntryComponent implements OnInit, AfterContentChecked, OnChanges {
  @Input() noteType: string;
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
  @ViewChild("voucherTrack") VoucherTracking: VoucherTrackingComponent;
  @ViewChild("openingbalancetracking") openingbalancetracking: OpeningBalanceTrackingComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridCostCenterList")
  genericGridCostCenterList: GenericPopUpComponent;
  gridCostCenterListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("partyOpeningDetailsPopup") partyOpeningDetailsPopup: PartyOpeningDetailsPopUpComponent;

  selectedtrntranRowIndex: number;
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
    private cd: ChangeDetectorRef
  ) {
    try {
      //this.masterService.refreshTransactionList();
      this.showWholeSubLedger = this.settingService.appSetting.enableSubLedger;
      //this.TrnMainObj = this._transactionService.TrnMainObj;
      this.voucherType = this._transactionService.TrnMainObj.VoucherType;
      this.trnaccountList = this._transactionService.accountListObersver$;
      // if (!this.TrnMainObj.TrntranList || this.TrnMainObj.TrntranList.length == 0) {
      //     this._transactionService.addRowForTransaction(0);
      // }

      

      this.addFocus = true;
    } catch (ex) {
      alert(ex);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.noteType === 'CreditNote') {
      this._transactionService.TrnMainObj.TRNMODE = "DebitNote";
    } else if (this.noteType === 'DebitNote') {
      this._transactionService.TrnMainObj.TRNMODE = "CreditNote";
    }

  }

  ngOnInit() {
    try {
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

      if (
        this._transactionService.TrnMainObj.Mode == "EDIT" ||
        this._transactionService.TrnMainObj.Mode == "VIEW"
      ) {
        this._transactionService.loadDataObservable.subscribe(data => {
          try {
            this._transactionService.TrnMainObj.TrntranList = data.TrntranList;
            this._transactionService.TrnMainObj.TrntranList.forEach(t => {
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
    } catch (ex) {
      alert(ex);
    }
    this._transactionService.TrnMainObj.TrntranList.forEach(t => {
      t.CRAMNT = this.drAmount;
    });

  }

  hideDetail() {
    this.masterService.ShowMore = false;
  }

  selectedIndex: number = 0;
  setSelectedRow(index, value) {

    this.selectedIndex = index;



  }
  TrnTranAccNameChange(value) {

  }
  showAcList(i) {
   
    this.selectedIndex = i;
    // if (this._transactionService.TrnMainObj.VoucherType == 15 || this._transactionService.TrnMainObj.VoucherType == 16) {
    //   if (!this._transactionService.TrnMainObj.TRNMODE) {
    //     alert("Selet Voucher Type or Party Type");
    //     return;
    //   }
    // }
    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;

    this.gridACListPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,
      defaultFilterIndex: 1,
      columns: [
        
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
  
  focusNext(colindex, rowIndex, event = null) {

    if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher) {
      if (rowIndex > 0) {

        // this.calculateDRandCRAmount(rowIndex);
      }

    }

    if (event && event != null && event != undefined) event.preventDefault();

    let selectorName = "";
    switch (colindex) {
      case 0: {
        selectorName = `ACCODEInput_${rowIndex}`
        break;
      }
      case 1: {
        selectorName = (this.voucherType == VoucherTypeEnum.Journal
          || this.voucherType == VoucherTypeEnum.ContraVoucher
          || this.voucherType == VoucherTypeEnum.PaymentVoucher
          || this.voucherType == VoucherTypeEnum.PartyOpeningBalance
          || this.voucherType == VoucherTypeEnum.AccountOpeningBalance
          || this.voucherType == VoucherTypeEnum.CreditNote)
          ? `DrAmtInput_${rowIndex}`
          : `CrAmtInput_${rowIndex}`;
        break;
      }
      case 2: {
        selectorName = this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT != 0
          ? this._transactionService.AppSettings.enableCostCenter == 1 ? `CostCenterInput_${rowIndex}` : `narration_${rowIndex}`
          : `CrAmtInput_${rowIndex}`
        break;
      }
      case 3: {
        selectorName = this._transactionService.AppSettings.enableCostCenter == 1 ? `CostCenterInput_${rowIndex}` : `narration_${rowIndex}`;
        break;
      }
      case 4: {
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
      default: {
        selectorName = `ACCODEInput_${rowIndex}`
        break;
      }
    }

    let element = document.getElementById(`${selectorName}`);
    if (element) {
      setTimeout(function () {
        (<HTMLInputElement>element).focus();
      }, 100)
    }
  }
  activeDebit = false; //For Journal Entry - DueVoucher - Customer or Supplier seperation
  activeCredit = false
  AcObj: TAcList = <TAcList>{}


  enterDabitAmount(i, event) {
    if (i > 0) {
      this.calculateDRandCRAmount(i);
    }
    this.focusNext(2, i, event)

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

  onAcSelect(acItem) {
    try {
      if (typeof acItem === "object") {
        var ac = <TAcList>acItem;
        this.AcObj = acItem;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem = acItem;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].rootparent = acItem.rootparent;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].rootparentname = acItem.rootparentname;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].A_ACID = acItem.ACID;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].AccountItem.ACCODE = ac.ACCODE;
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem = ac;
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
        this.focusNext(1, this.selectedIndex);

        this.getAccountWiseTrnAmount(ac)

      } else {
        this._transactionService.TrnMainObj.TrntranList[
          this.selectedIndex
        ].AccountItem.ACCODE = "";
        this.focusNext(0, this.selectedIndex);
      }
    } catch (error) {
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedIndex
      ].AccountItem.ACCODE = "";
      this.focusNext(0, this.selectedIndex);
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

  onCostCenterSelect(costCenter) {
    this._transactionService.TrnMainObj.TrntranList[
      this.selectedIndex
    ].CostCenter = costCenter.CostCenterName;
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
          this.addTrnTranRow();
        }
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

  TrnTranRowOk($event, index) {
    var nextindex = index + 1;
    try {
      if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.Journal ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.AccountOpeningBalance ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PartyOpeningBalance) {
        this._transactionService.addRowForTransaction(index);
        if (document.getElementById("ACCODEInput_" + nextindex) != null) {
          document.getElementById("ACCODEInput_" + nextindex).focus();
        };
      }
      else if (this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ContraVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiveVoucher ||
        this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.PaymentVoucher) {
        this.focusNext(7, index);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  onChequeDateEnter($event, index) {
    var nextindex = index + 1;
    this._transactionService.addRowForTransaction(index);
    if (document.getElementById("ACCODEInput_" + nextindex) != null) {
      document.getElementById("ACCODEInput_" + nextindex).focus();
    };
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

  clearRow($event, index) {
    try {
      $event.preventDefault();
      if (confirm("Are you sure you want to delete the row?")) {
        this._transactionService.deleteAccountTrnRow(index);
        this.TrnTranCrAmtChange(null);
        this.TrnTranDrAmtChange(null, index);
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
          this.subLedgerCrAmtChanges(index);
        } else if (
          this.voucherType == VoucherTypeEnum.ReceiveVoucher ||
          this.voucherType == VoucherTypeEnum.DebitNote
        ) {
          this.subLedgerDrAmtChanges();
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
          this.subLedgerCrAmtChanges(i);
        } else if (
          this.voucherType == VoucherTypeEnum.ReceiveVoucher ||
          this.voucherType == VoucherTypeEnum.DebitNote
        ) {
          this.subLedgerDrAmtChanges();
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
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        this.trntranTotal += x.DRAMNT == null ? null : x.DRAMNT;
        this.drAmount = this.trntranTotal;
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
      this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
      this.VoucherTracking.GetAdjAmtValue(value);
      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      alert(ex);
    }

  }

  BillTrack() {
    if (this._transactionService.TrnMainObj.TrntranList.length > 0) {
      if (this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem != undefined) {

        if (this.voucherType == 18) {
          this.VoucherTracking.CustomerPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem,this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
          this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT);
        }
        else if (this.voucherType == 17) {
          this.VoucherTracking.SupplierPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem,this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
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
              this.VoucherTracking.CustomerPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem,this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
              this.VoucherTracking.show(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].CRAMNT);
            }
            else if (this.voucherType == 17) {
              this.VoucherTracking.SupplierPartyObj(this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].acitem,this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].guid)
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
        this.crAmount = x.CRAMNT;
        this.trntranTotal += x.CRAMNT == null ? 0 : x.CRAMNT;
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
      this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
      this.VoucherTracking.GetAdjAmtValue(value);
      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      alert(ex);
    }
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

    if (currentTrnTranObj.AccountItem.PType == "C" && acCase == 'drAmt') {
      //alert error
      this.alertService.warning("Party Opening details is not valid for Dr Amount with selected A/C");
      return;
    }

    if (currentTrnTranObj.AccountItem.PType == "V" && acCase == 'crAmt') {
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
        this.onChequeDateEnter(value, index);
      } else {
        this.alertService.error(`Invalid Transaction Date`);
        return;
      }
    }
    this._transactionService.addRowForTransaction(index);
    if (document.getElementById("ACCODEInput_" + index + 1) != null) {
      document.getElementById("ACCODEInput_" + index + 1).focus();
    };
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

  TabAclist(i){
    this.focusNext(1, this.selectedIndex);
  }
  TabCostcenter(i){
    this.selectedIndex = i;
    this.focusNext(4, this.selectedIndex);
  }
}
