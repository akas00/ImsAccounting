import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer, ElementRef, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { TrnMain, Trntran, TSubLedgerTran, TSubLedger, CostCenter, Division, VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { CommonService, SettingService } from './../../../../common/services';
import { ActivatedRoute, Router } from '@angular/router';
import { TAcList } from './../../../../common/interfaces/Account.interface';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Subject } from 'rxjs/subject';
import { Observable } from "rxjs/Observable";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';


@Component({
  selector: 'trntran-journal-entry',
  templateUrl: "./trntran-journal-entry.component.html",
  styleUrls: ["./../../../../../assets/css/styles.css", "../../../modal-style.css"],

})

export class TrnTranJournalEntryComponent {

  @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();


  hideSubledgerRowGrid: boolean = true;
  public account: TAcList = <TAcList>{};
  //public accountList: TAcList[] = [];
  public subledgerItemList: TSubLedger[] = [];
  public costCenterList: CostCenter[] = [];
  public trnMain: TrnMain = <TrnMain>{};
  public trnTran: Trntran = <Trntran>{};
  public changeIndex: number;
  subLedgerList: TSubLedgerTran[] = [];
  private focusDr = false;
  private focusCr = false;
  private showAmount: string;
  private drTotal: number;
  private crTotal: number;
  private subDrTotal: number;
  private subCrTotal: number;
  public hasCheque = true;
  public hasCostCenter = true;
  private hasAddBtn = false;
  private hasLedgerAddBtn = false;
  private acCodeIndex: number;
  private acNameIndex: number;
  private showSubLedger = false;
  private showHelp = true;
  private showWholeSubledger = true;
  private acCodeFocused = false;
  private acNameFocused = false;
  private subAcCodeFocused = false;
  private subAcNameFocused = false;
  private enableACCodeFocus = false;
  private enableACNameFocus = true;
  private showSubLedgerList = false;
  private subjectACList = new Subject();
  viewMode = false;

  private returnUrl: string;
  private guid: string;

  private subcriptions: Array<Subscription> = [];

  constructor(
    private masterService: MasterRepo,
    private _trnMainService: TransactionService,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private settingService: SettingService,
    private renderer: Renderer,
    private _sanitizer: DomSanitizer,
    private alertService: AlertService,
    private loadingSerive: SpinnerService) {
    try {
      this.trnMain = _trnMainService.TrnMainObj;
      this._trnMainService.saveDisable = true;
      this.showWholeSubledger = this.settingService.appSetting.enableSubLedger;
      this.hasCostCenter = this.settingService.appSetting.enableCostCenter;
      this.hasCheque = this.settingService.appSetting.enableChequeInEntry;
      this.enableACCodeFocus = this.settingService.appSetting.enableACCodeFocus;
      this.enableACNameFocus = this.settingService.appSetting.enableACNameFocus;
      this.masterService.refreshAccountList('Journal-constructor');

      this.gridACListPopupSettings = {
        title: "Accounts",
        apiEndpoints: `/getAccountPagedList`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'A/C CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          }
        ]
      }
    } catch (ex) {
      alert(ex);
    }
  }
  observableAclist = (): Observable<TAcList[]> => {
    //let serv=this._service
    try {
      return this.masterService.getAccount('journal-ObservableAclist');
    } catch (ex) {
      alert(ex);
    }

  }
  observableAclistAcname = (keyword: any): Observable<TAcList[]> => {
    //let serv=this._service
    try {
      if (keyword) {
        return this.masterService.getAccoutFilteredObs(keyword, 1);

      }
      else {
        return Observable.of([]);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  //aclist = this._service.accountList;
  observableAclistAcid = (keyword: any): Observable<TAcList[]> => {
    //let serv=this._service
    try {
      if (keyword) {
        return this.masterService.getAccoutFilteredObs(keyword, 0);

      }
      else {
        return Observable.of([]);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    try {
      let html = `<span>${data.ACNAME}</span>`;
      return this._sanitizer.bypassSecurityTrustHtml(html);
    } catch (ex) {
      alert(ex);
    }
  }
  autocompleListAcidFormatter = (data: any): SafeHtml => {
    try {
      let html = `<span>${data.ACCODE}</span>`;
      return this._sanitizer.bypassSecurityTrustHtml(html);
    } catch (ex) {
      alert(ex);
    }
  }

  AutoSelectAccodeChange($event, index) {
    try {
      let ret = this.masterService.accountList.find(x => x.ACCODE == $event);
      if (ret) {
        this.trnMain.TrntranList[index].AccountItem = ret;
        this.trnMain.TrntranList[index].acitem = ret;
      }
      this.trnMain.TrntranList[index].hasDebit = true;
      this.trnMain.TrntranList[index].hasCredit = true;
      this.trnMain.TrntranList[index].SubledgerTranList = [];
      this.trnMain.TrntranList[index].DRAMNT = null;
      this.trnMain.TrntranList[index].CRAMNT = null;
      this.checkDifference();
      this.hasAddBtn = false;
      this.focusDr = false;
      this.focusCr = false;
      this.acNameIndex = index;
      this.trnMain.TrntranList[index].acType = null;
      this.trnMain.TrntranList[index].drBGColor = "";
      this.trnMain.TrntranList[index].drColor = "";
      this.trnMain.TrntranList[index].crBGColor = "";
      this.trnMain.TrntranList[index].crColor = "";


    }
    catch (error) {
      this.trnMain.TrntranList[index].AccountItem = undefined;
    }
  }

  AutoSelectAcnameChange($event, index) {
    try {
      if (typeof ($event) == 'object') {
        var ac = <TAcList>$event;
        this.trnMain.TrntranList[index].AccountItem = $event;
        this.trnMain.TrntranList[index].AccountItem.ACCODE = ac.ACCODE;
      }
      else {
        this.trnMain.TrntranList[index].AccountItem.ACCODE = "";
      }

      this.trnMain.TrntranList[index].hasDebit = true;
      this.trnMain.TrntranList[index].hasCredit = true;
      this.trnMain.TrntranList[index].SubledgerTranList = [];
      this.trnMain.TrntranList[index].DRAMNT = null;
      this.trnMain.TrntranList[index].CRAMNT = null;
      this.checkDifference();
      this.hasAddBtn = false;
      this.focusDr = false;
      this.focusCr = false;
      this.acNameIndex = index;
      this.trnMain.TrntranList[index].acType = null;
      this.trnMain.TrntranList[index].drBGColor = "";
      this.trnMain.TrntranList[index].drColor = "";
      this.trnMain.TrntranList[index].crBGColor = "";
      this.trnMain.TrntranList[index].crColor = "";
    }
    catch (error) {
      this.trnMain.TrntranList[index].AccountItem.ACCODE = "";
    }
  }

  hideDetail() {
    this.masterService.ShowMore = false;
  }

  selectedIndex: number = 0;
  showAcList(i) {
    this.selectedIndex = i;
    this.genericGridACList.show();
  }

  onAcSelect(acItem: any) {
    try {
      if (typeof (acItem) == 'object') {
        var ac = <TAcList>acItem;
        this.trnMain.TrntranList[this.selectedIndex].AccountItem = acItem;
        this.trnMain.TrntranList[this.selectedIndex].AccountItem.ACCODE = ac.ACCODE;
      }
      else {
        this.trnMain.TrntranList[this.selectedIndex].AccountItem.ACCODE = "";
      }

      this.trnMain.TrntranList[this.selectedIndex].hasDebit = true;
      this.trnMain.TrntranList[this.selectedIndex].hasCredit = true;
      this.trnMain.TrntranList[this.selectedIndex].SubledgerTranList = [];
      this.trnMain.TrntranList[this.selectedIndex].DRAMNT = null;
      this.trnMain.TrntranList[this.selectedIndex].CRAMNT = null;
      this.checkDifference();
      this.hasAddBtn = false;
      this.focusDr = false;
      this.focusCr = false;
      this.acNameIndex = this.selectedIndex;
      this.trnMain.TrntranList[this.selectedIndex].acType = null;
      this.trnMain.TrntranList[this.selectedIndex].drBGColor = "";
      this.trnMain.TrntranList[this.selectedIndex].drColor = "";
      this.trnMain.TrntranList[this.selectedIndex].crBGColor = "";
      this.trnMain.TrntranList[this.selectedIndex].crColor = "";
    }
    catch (error) {
      this.trnMain.TrntranList[this.selectedIndex].AccountItem.ACCODE = "";
    }
    this.trnMain.TrntranList[this.selectedIndex].acitem = acItem;
  }


  ngOnInit() {
    try {
      this.trnMain.TrntranList = [];

      this.masterService.refreshTransactionList();
      this.masterService.getSubLedgerList().subscribe((res: Array<TSubLedger>) => { this.subledgerItemList = res; },
        error => {
          this.masterService.resolveError(error, "trntran-journal-entry - getSubLedgerList");
        }
      );
      if (this.trnMain.Mode == "VIEW") {
        this.viewMode = true;
      }

      if (this.trnMain.Mode == "EDIT" || this.trnMain.Mode == "VIEW") {
        this._trnMainService.loadDataObservable.subscribe(data => {
          try {
            this.trnMain.TrntranList = data.TrntranList;

            for (var t in this.trnMain.TrntranList) {
              this.trnMain.TrntranList[t].inputMode = false;
              this.trnMain.TrntranList[t].editMode = false;
              this.trnMain.TrntranList[t].AccountItem = this.masterService.accountList.filter(y => y.ACID == this.trnMain.TrntranList[t].A_ACID)[0];
              this.trnMain.TrntranList[t].acitem = this.trnMain.TrntranList[t].AccountItem;
              if (this.trnMain.TrntranList[t].AccountItem != null && this.trnMain.TrntranList[t].AccountItem.HASSUBLEDGER == 1) {
                this.trnMain.TrntranList[t].SubledgerTranList.forEach(z => { z.inputMode = false, z.editMode = false, z.SubledgerItem = this.subledgerItemList.filter(w => w.ACID == z.A_ACID)[0] });
                if (this.viewMode == false) {
                  var nullsl = <TSubLedgerTran>{};
                  nullsl.SubledgerItem = <TSubLedger>{};
                  nullsl.inputMode = true;
                  nullsl.editMode = false;
                  this.trnMain.TrntranList[t].SubledgerTranList.push(nullsl);
                }
              }
            }

            if (this.viewMode == false) {
              var nulltt = <Trntran>{};
              nulltt.AccountItem = <TAcList>{};
              nulltt.inputMode = true;
              nulltt.editMode = false;
              this.trnMain.TrntranList.push(nulltt);
            }


            if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
              this._trnMainService.saveDisable = false;
            } else {
              this._trnMainService.saveDisable = true;
            }

          } catch (e) {
          }
        }, error => {
          this.masterService.resolveError(error, "journal - loadDataObservable");
        }
        );
      }
      else {
        var newRow = <Trntran>{};
        newRow.inputMode = true;
        newRow.editMode = false;
        newRow.AccountItem = <TAcList>{};
        this.trnMain.TrntranList.push(newRow);
        const uuidV1 = require('uuid/v1');
        this.trnMain.guid = uuidV1();
      }
    } catch (ex) {
      alert(ex);
    }
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  addRow(index) {
    try {
      let currentObj = this.trnMain.TrntranList[index];

      if (this.trnMain.TrntranList[index + 1]) {
        return;
      }

      if (!currentObj.AccountItem || currentObj.AccountItem.ACCODE == undefined || currentObj.AccountItem.ACCODE == "") {
        this.alertService.info("Please Select A/C");
        return;
      }

      if ((currentObj.DRAMNT == 0 || currentObj.DRAMNT == null) && (currentObj.CRAMNT == 0 || currentObj.CRAMNT == null)) {
        this.alertService.info("Debit Amount or Credit Amount is Required.")
        return;
      }

      var newRow = <Trntran>{};
      var newaclist: TAcList = <TAcList>{};
      newRow.AccountItem = newaclist;
      newRow.inputMode = true;
      newRow.editMode = true;
      this.trnMain.TrntranList.push(newRow);
    } catch (ex) {
      alert(ex);
    }
  }

  removeRow(index) {
    try {
      if (this.trnMain.TrntranList[index].inputMode == true && this.trnMain.TrntranList[index].editMode == false) {
        this.trnMain.TrntranList[index] = <Trntran>{}
        this.trnMain.TrntranList[index].AccountItem = <TAcList>{};
        this.trnMain.TrntranList[index].SubledgerTranList = [];
        this.showSubLedger = false;
        this.showHelp = true;
        this.trnMain.TrntranList[index].inputMode = true;
        this.trnMain.TrntranList[index].editMode = false;
        this.trnMain.TrntranList[index].drBGColor = "";
        this.trnMain.TrntranList[index].drColor = "";
        this.trnMain.TrntranList[index].crBGColor = "";
        this.trnMain.TrntranList[index].crColor = "";
        this.trnMain.TrntranList[index].hasDebit = true;
        this.trnMain.TrntranList[index].hasCredit = true;
        this.changeCredit(null, index);
        this.changeDebit(null, index);
        this.hasAddBtn = false;
      } else {
        this.trnMain.TrntranList.splice(index, 1);
        this.hasAddBtn = false;
        this.trnMain.TrntranList[index].DRAMNT = null;
        this.trnMain.TrntranList[index].CRAMNT = null;

        this.showSubLedger = false;
        this.showHelp = true;

        this.changeCredit(null, index);
        this.changeDebit(null, index);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  editRow(index) {
    try {
      this.trnMain.TrntranList[index].inputMode = true;
      this.trnMain.TrntranList[index].editMode = true;
      if (this.trnMain.TrntranList[index].DRAMNT != null && this.trnMain.TrntranList[index].DRAMNT != 0) {
        this.trnMain.TrntranList[index].hasDebit = true;
        this.trnMain.TrntranList[index].hasCredit = false;
        if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1) {
          this.trnMain.TrntranList[index].drBGColor = "grey";
          this.trnMain.TrntranList[index].drColor = "white";
          this.trnMain.TrntranList[index].hasDebit = false;
        }
      } else if (this.trnMain.TrntranList[index].CRAMNT != null && this.trnMain.TrntranList[index].CRAMNT != 0) {
        this.trnMain.TrntranList[index].hasDebit = false;
        this.trnMain.TrntranList[index].hasCredit = true;
        if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1) {
          this.trnMain.TrntranList[index].crBGColor = "grey";
          this.trnMain.TrntranList[index].crColor = "white";
          this.trnMain.TrntranList[index].hasCredit = false;
        }
      }

      if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1 && this.trnMain.TrntranList[index].DRAMNT != 0 && this.trnMain.TrntranList[index].DRAMNT != null) {
        this.subLedgerList = this.trnMain.TrntranList[index].SubledgerTranList;
        this.showSubLedger = true;
        this.showHelp = false;
        this.trnMain.TrntranList[index].acType = "Cr.";
        this.showSubLedgerList = false;

      } else if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1 && this.trnMain.TrntranList[index].CRAMNT != 0 && this.trnMain.TrntranList[index].CRAMNT != null) {
        this.subLedgerList = this.trnMain.TrntranList[index].SubledgerTranList;
        this.showSubLedger = true;
        this.showHelp = false;
        this.trnMain.TrntranList[index].acType = "Dr.";
        this.showSubLedgerList = false;

      } else {
        this.showSubLedger = false;
        this.showHelp = true;
        this.trnMain.TrntranList[index].acType = null;
        this.showSubLedgerList = false;
      }
      this.showAmount = this.trnMain.TrntranList[index].acType;
    } catch (ex) {
      alert(ex);
    }
  }

  saveRow(index) {
    try {
      this.trnMain.TrntranList[index].inputMode = false;
      this.trnMain.TrntranList[index].editMode = false;
      if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1) {
        this.showSubLedger = false;
        this.showHelp = false;
        this.showSubLedgerList = true;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  addLedgerRow(index) {
    try {
      this.subLedgerList.forEach(x => x.inputMode = false);
      var newSubLedger = <TSubLedgerTran>{};
      newSubLedger.SubledgerItem = <TSubLedger>{};
      newSubLedger.inputMode = true;
      newSubLedger.editMode = false;
      this.subLedgerList.push(newSubLedger);
      this.hasLedgerAddBtn = false;
      if (this.enableACCodeFocus == true) {
        this.subAcCodeFocused = true;
      } else if (this.enableACNameFocus) {
        this.subAcNameFocused = true;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  removeLedgerRow(index) {
    try {
      if (this.subLedgerList[index].inputMode == true && this.subLedgerList[index].editMode == false) {
        this.subLedgerList[index].SubledgerItem = <TSubLedger>{};
        this.subLedgerList[index] = <TSubLedgerTran>{};
        this.subLedgerList[index].inputMode = true;
        this.subLedgerList[index].editMode = false;
        this.subCreditTotal();
        this.subDebitTotal();
        this.debitTotal();
        this.creditTotal();
        this.checkDifference();
        this.changeSubCredit(null, index);
        this.changeSubDebit(null, index);
        this.hasLedgerAddBtn = false;
      } else {
        this.subLedgerList.splice(index, 1);
        this.subCreditTotal();
        this.subDebitTotal();
        this.debitTotal();
        this.creditTotal();
        this.checkDifference();
        this.changeSubCredit(null, index);
        this.changeSubDebit(null, index);
        this.hasLedgerAddBtn = false;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  editLedgerRow(index) {
    try {
      this.subLedgerList[index].inputMode = true;
      this.subLedgerList[index].editMode = true;
    } catch (ex) {
      alert(ex);
    }
  }

  saveLedgerRow(index) {
    try {
      this.subLedgerList[index].inputMode = false;
      this.subLedgerList[index].editMode = false;
    } catch (ex) {
      alert(ex);
    }
  }

  // value="{{(tList.acitem!=null) ? tList.acitem.ACCODE : ''}}"
  changeDebit(value, index) {
    try {

      if (this._trnMainService.TrnMainObj.VoucherType != 12) return;

      if (value != null) {
        if (value.length > 0) {
          this.trnMain.TrntranList[index].hasCredit = false;
          this.trnMain.TrntranList[index].CRAMNT = 0;
          if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1 && this.showWholeSubledger == true) {
            this.trnMain.TrntranList[index].hasDebit = false;
            this.trnMain.TrntranList[index].hasCredit = false;
            this.trnMain.TrntranList[index].drBGColor = "grey";
            this.trnMain.TrntranList[index].drColor = "white";
            this.showSubLedger = true;
            this.showHelp = false;
            this.trnMain.TrntranList[index].DRAMNT = 0;
            this.subLedgerList = this.trnMain.TrntranList[index].SubledgerTranList = [];
            this.trnMain.TrntranList[index].acType = "Cr.";
            this.showAmount = this.trnMain.TrntranList[index].acType;
            var newSubLedger = <TSubLedgerTran>{};
            newSubLedger.SubledgerItem = <TSubLedger>{};
            newSubLedger.inputMode = true;
            newSubLedger.editMode = false;
            this.subLedgerList.push(newSubLedger);
            this.trnMain.TrntranList[index].CRAMNT = 0;
            if (this.enableACCodeFocus == true) {
              this.subAcCodeFocused = true;
            } else if (this.enableACNameFocus) {
              this.subAcNameFocused = true;
            }
          }
          this.changeIndex = index;
          this.focusDr = true;

        } else if (value.length == 0) {
          this.trnMain.TrntranList[index].hasCredit = true;
          this.trnMain.TrntranList[index].CRAMNT = null;
        }
      }
      this.checkDifference();
      this.debitTotal();

      //if (this.trnMain.TrntranList[index].DRAMNT == 0) {
      //    this.trnMain.TrntranList[index].DRAMNT = null;
      //}

      if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
        this._trnMainService.saveDisable = false;
      } else {
        this._trnMainService.saveDisable = true;
      }

      this.hasAddBtn = true;
      if (value == null) {
        this.hasAddBtn = true;
      } else if (this.trnMain.TrntranList[index].AccountItem == null || this.trnMain.TrntranList[index].AccountItem.ACID == null || this.trnMain.TrntranList[index].DRAMNT <= 0) {
        this.hasAddBtn = false;
      }
    } catch (ex) {
      alert(ex);
    }

  }

  changeCredit(value, index) {
    try {

      if (this._trnMainService.TrnMainObj.VoucherType != 12) return;

      if (value != null) {
        if (value.length > 0) {
          this.trnMain.TrntranList[index].hasDebit = false;
          this.trnMain.TrntranList[index].DRAMNT = 0;
          if (this.trnMain.TrntranList[index].AccountItem != null && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1 && this.showWholeSubledger == true) {
            this.trnMain.TrntranList[index].hasDebit = false;
            this.trnMain.TrntranList[index].hasCredit = false;
            this.trnMain.TrntranList[index].crBGColor = "grey";
            this.trnMain.TrntranList[index].crColor = "white";
            this.showSubLedger = true;
            this.showHelp = false;
            this.trnMain.TrntranList[index].CRAMNT = 0;
            this.subLedgerList = this.trnMain.TrntranList[index].SubledgerTranList = [];
            this.trnMain.TrntranList[index].acType = "Dr.";
            this.showAmount = this.trnMain.TrntranList[index].acType;
            var newSubLedger = <TSubLedgerTran>{};
            newSubLedger.SubledgerItem = <TSubLedger>{};
            newSubLedger.inputMode = true;
            newSubLedger.editMode = false;
            this.subLedgerList.push(newSubLedger);
            this.trnMain.TrntranList[index].DRAMNT = 0;
            if (this.enableACCodeFocus == true) {
              this.subAcCodeFocused = true;
            } else if (this.enableACNameFocus) {
              this.subAcNameFocused = true;
            }
          }
          this.changeIndex = index;
          this.focusCr = true;

        } else if (value.length == 0) {
          this.trnMain.TrntranList[index].hasDebit = true;
          this.trnMain.TrntranList[index].DRAMNT = null;
        }
      }
      this.checkDifference();
      this.creditTotal();

      if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
        this._trnMainService.saveDisable = false;
      } else {
        this._trnMainService.saveDisable = true;
      }

      //if (this.trnMain.TrntranList[index].CRAMNT == 0) {
      //    this.trnMain.TrntranList[index].CRAMNT = null;
      //}

      this.hasAddBtn = true;
      if (value == null) {
        this.hasAddBtn = true;
      } else if (this.trnMain.TrntranList[index].AccountItem == null || this.trnMain.TrntranList[index].AccountItem.ACID == null || this.trnMain.TrntranList[index].CRAMNT <= 0) {
        this.hasAddBtn = false;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  checkDifference() {
    try {
      let diffAmount: number = 0;
      this.trnMain.TrntranList.forEach(tran => {
        diffAmount = diffAmount + (((tran.DRAMNT == null) ? 0 : tran.DRAMNT) - ((tran.CRAMNT == null) ? 0 : tran.CRAMNT))
      })
      this._trnMainService.differenceAmount = Math.abs(diffAmount);
    } catch (ex) {
      alert(ex);
    }
  }

  debitTotal() {
    try {
      let debitAmount: number = 0;
      this.trnMain.TrntranList.forEach(tran => {
        debitAmount = debitAmount + ((tran.DRAMNT == null) ? 0 : tran.DRAMNT)
      });
      this.drTotal = debitAmount;
    } catch (ex) {
      alert(ex);
    }
  }

  creditTotal() {
    try {
      let creditAmount: number = 0;
      this.trnMain.TrntranList.forEach(tran => {
        creditAmount = creditAmount + ((tran.CRAMNT == null) ? 0 : tran.CRAMNT)
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
      this.hasLedgerAddBtn = true;
      if (value == null) {
        this.hasLedgerAddBtn = true;
      } else if (this.subLedgerList[index].SubledgerItem == null || this.subLedgerList[index].SubledgerItem.ACID == null || this.subLedgerList[index].DRAMNT <= 0) {
        this.hasLedgerAddBtn = false;
      }
      if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
        this._trnMainService.saveDisable = false;
      } else {
        this._trnMainService.saveDisable = true;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  changeSubCredit(value, index) {
    try {
      this.subCreditTotal();
      this.debitTotal();
      this.checkDifference();
      this.hasLedgerAddBtn = true;
      if (value == null) {
        this.hasLedgerAddBtn = true;
      } else if (this.subLedgerList[index].SubledgerItem == null || this.subLedgerList[index].SubledgerItem.ACID == null || this.subLedgerList[index].CRAMNT <= 0) {
        this.hasLedgerAddBtn = false;
      }
      if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
        this._trnMainService.saveDisable = false;
      } else {
        this._trnMainService.saveDisable = true;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  subDebitTotal() {
    try {
      let debitAmount: number = 0;
      this.trnMain.TrntranList[this.changeIndex].SubledgerTranList.forEach(sub => {
        debitAmount = debitAmount + ((sub.DRAMNT == null) ? 0 : sub.DRAMNT)
      })
      this.trnMain.TrntranList[this.changeIndex].CRAMNT = debitAmount;
      this.subDrTotal = debitAmount;
      if (this.trnMain.TrntranList[this.changeIndex].AccountItem != null && this.trnMain.TrntranList[this.changeIndex].CRAMNT > 0) {
        this.hasAddBtn = true;
      } else {
        this.hasAddBtn = false;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  subCreditTotal() {
    try {
      let creditAmount: number = 0;
      this.trnMain.TrntranList[this.changeIndex].SubledgerTranList.forEach(sub => {
        creditAmount = creditAmount + ((sub.CRAMNT == null) ? 0 : sub.CRAMNT)
      })
      this.subCrTotal = creditAmount;
      this.trnMain.TrntranList[this.changeIndex].DRAMNT = creditAmount;
      if (this.trnMain.TrntranList[this.changeIndex].AccountItem != null && this.trnMain.TrntranList[this.changeIndex].DRAMNT > 0) {
        this.hasAddBtn = true;
      } else {
        this.hasAddBtn = false;
      }
    } catch (ex) {
      alert(ex);
    }
  }

  clickRow(index) {
    try {
      if (this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1 && this.trnMain.TrntranList[index].SubledgerTranList != null && this.trnMain.TrntranList[index].SubledgerTranList.length > 0 && this.trnMain.TrntranList[index].inputMode == false) {
        this.showSubLedgerList = true;
        this.showSubLedger = false;
        this.showHelp = false;
      } else if (this.trnMain.TrntranList[index].inputMode == true && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 0) {
        this.showSubLedgerList = false;
        this.showSubLedger = false;
        this.showHelp = true;
      } else if (this.trnMain.TrntranList[index].inputMode == true && this.trnMain.TrntranList[index].AccountItem.HASSUBLEDGER == 1) {
        this.showSubLedgerList = false;
        this.showSubLedger = true;
        this.showHelp = false;
        this.subLedgerList = this.trnMain.TrntranList[index].SubledgerTranList;
        this.showAmount = this.trnMain.TrntranList[index].acType;
      } else {
        this.showSubLedgerList = false;
        this.showSubLedger = false;
        this.showHelp = true;
      }

      this.changeIndex = index;
    } catch (ex) {
      alert(ex);
    }
  }

  acCodeChange(index) {
    try {
      this.trnMain.TrntranList[index].hasDebit = true;
      this.trnMain.TrntranList[index].hasCredit = true;
      this.trnMain.TrntranList[index].SubledgerTranList = [];
      this.trnMain.TrntranList[index].DRAMNT = null;
      this.trnMain.TrntranList[index].CRAMNT = null;
      this.checkDifference();
      this.hasAddBtn = false;
      this.focusDr = false;
      this.focusCr = false;
      this.acCodeIndex = index;
      this.trnMain.TrntranList[index].acType = null;
      this.trnMain.TrntranList[index].drBGColor = "";
      this.trnMain.TrntranList[index].drColor = "";
      this.trnMain.TrntranList[index].crBGColor = "";
      this.trnMain.TrntranList[index].crColor = "";
    } catch (ex) {
      alert(ex);
    }
  }
  acidChange(index) {
    try {
      this.trnMain.TrntranList[index].hasDebit = true;
      this.trnMain.TrntranList[index].hasCredit = true;
      this.trnMain.TrntranList[index].SubledgerTranList = [];
      this.trnMain.TrntranList[index].DRAMNT = null;
      this.trnMain.TrntranList[index].CRAMNT = null;
      this.checkDifference();
      this.hasAddBtn = false;
      this.focusDr = false;
      this.focusCr = false;
      this.acNameIndex = index;
      this.trnMain.TrntranList[index].acType = null;
      this.trnMain.TrntranList[index].drBGColor = "";
      this.trnMain.TrntranList[index].drColor = "";
      this.trnMain.TrntranList[index].crBGColor = "";
      this.trnMain.TrntranList[index].crColor = "";
    } catch (ex) {
      alert(ex);
    }
  }
  acNameChange(index) {
    try {
      this.trnMain.TrntranList[index].hasDebit = true;
      this.trnMain.TrntranList[index].hasCredit = true;
      this.trnMain.TrntranList[index].SubledgerTranList = [];
      this.trnMain.TrntranList[index].DRAMNT = null;
      this.trnMain.TrntranList[index].CRAMNT = null;
      this.checkDifference();
      this.hasAddBtn = false;
      this.focusDr = false;
      this.focusCr = false;
      this.acNameIndex = index;
      this.trnMain.TrntranList[index].acType = null;
      this.trnMain.TrntranList[index].drBGColor = "";
      this.trnMain.TrntranList[index].drColor = "";
      this.trnMain.TrntranList[index].crBGColor = "";
      this.trnMain.TrntranList[index].crColor = "";
    } catch (ex) {
      alert(ex);
    }
  }

  subACCodeChange(index) {
    try {
      this.subLedgerList[index].DRAMNT = null;
      this.subLedgerList[index].CRAMNT = null;
    } catch (ex) {
      alert(ex);
    }
  }
  subACNameChange(index) {
    try {
      this.subLedgerList[index].DRAMNT = null;
      this.subLedgerList[index].CRAMNT = null;
    } catch (ex) {
      alert(ex);
    }
  }

  changeToArray(data) {
    try {
      if (data) {
        let retData: Array<any> = [];
        retData.concat([], data);
        return retData;
      }
      return [];
    } catch (ex) {
      alert(ex);
    }
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

  back() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      alert(ex);
    }
  }
}

