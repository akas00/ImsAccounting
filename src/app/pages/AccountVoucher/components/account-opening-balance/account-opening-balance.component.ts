import { Component, OnDestroy } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/setting.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { AppSettings } from "../../../../common/services/AppSettings";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { Subscriber } from "rxjs/Subscriber";
import { AutoComplete } from "primeng/components/autocomplete/autocomplete";
//import { MdDialog } from "@angular/material/material";

@Component({
  selector: "account-opening-balance",
  templateUrl: "./account-opening-balance.component.html",
  providers: [TransactionService]
})
export class AccountOpeningBalance {
  TrnMainObj: TrnMain;
  voucherType: VoucherTypeEnum = VoucherTypeEnum.AccountOpeningBalance;
  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  form: FormGroup;
  accountList: TAcList[];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();

  results: Observable<TAcList[]>;
  selectedAccount: TAcList;
  TranList: any[] = [];
  TotalDebit: number;
  TotalCredit: number;
  previousOpeningAccountData: any[] = [];

  constructor(
    public masterService: MasterRepo,
    private _trnMainService: TransactionService,
    private setting: SettingService,
    private AppSettings: AppSettings,
    public dialog: MdDialog
  ) {
    this.TrnMainObj = this._trnMainService.TrnMainObj;
    this.TrnMainObj.DIVISION = this.AppSettings.DefaultDivision;
    this._trnMainService.initialFormLoad(22);
  }

  ngOnInit() {
    this.TrnMainObj.Mode = "NEW";
    this.masterService.ShowMore = false;
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType
  }

  prefixChanged(pref: any) {
    try {
      this._trnMainService.prefix = pref;
      this.prefix = pref;
      if (this.TrnMainObj.Mode == "NEW") {
        if (
          this.TrnMainObj.DIVISION == "" ||
          this.TrnMainObj.DIVISION == null
        ) {
          this.TrnMainObj.DIVISION = this.setting.appSetting.DefaultDivision;
        }
        this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
          if (res.status == "ok") {
            let TMain = <TrnMain>res.result;
            this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(
              2,
              TMain.VCHRNO.length - 2
            );
            this.TrnMainObj.CHALANNO = TMain.CHALANNO;
          } else {
            alert("Failed to retrieve VoucherNo");
          }
        });
      }
    } catch (ex) {
    }
  }

  // handleDropdownClick() {
  //     let resultDataSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
  //     this.results = resultDataSubject.asObservable();
  //     let allItems: TAcList[] = [];
  //     this.masterService.getAccount("ac opeinging balance").map(x => {
  //         if (this.voucherType == VoucherTypeEnum.AccountOpeningBalance) {
  //             return x.filter(a => a.ACID.substring(0, 2).toUpperCase() != 'PA')
  //         }
  //         else if (this.voucherType == VoucherTypeEnum.PartyOpeningBalance) {
  //             return x.filter(a => a.ACID.substring(0, 2).toUpperCase() == 'PA')
  //         }
  //     })
  //         .subscribe(data => {
  //             allItems = data;
  //             resultDataSubject.next(allItems)
  //         }, error => this.masterService.resolveError(Error, 'opeinigbalacnsr-handledropdown')
  //         );

  // }

  // onIFocus(event) {
  //     if (event.target.value == "") return;
  //     this.search({ query: event.target.value });
  // }

  // search(event) {
  //     if (event.query == '') {
  //         this.results = this.dropListItem('a');
  //         return;
  //     }
  //     this.results = this.dropListItem(event.query);
  // }

  // dropListItem = (keyword: any): Observable<Array<TAcList>> => {
  //     try {
  //         return new Observable((observer: Subscriber<Array<TAcList>>) => {
  //             let sub11 = this.masterService.getAccount("ac opeinging balance").map(alist => {
  //                 if (this.voucherType == VoucherTypeEnum.AccountOpeningBalance) {
  //                     return alist.filter(a => a.ACID.substring(0, 2).toUpperCase() != 'PA')
  //                 }
  //                 else if (this.voucherType == VoucherTypeEnum.PartyOpeningBalance) {
  //                     return alist.filter(a => a.ACID.substring(0, 2).toUpperCase() == 'PA')
  //                 }
  //             })
  //                 .map(fList => {
  //                     return fList.filter((data: TAcList) =>
  //                         data.ACNAME == null ? '' : data.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
  //                 })
  //                 .map(res => res.slice(0, 20))
  //                 .subscribe(data => {
  //                     observer.next(data);
  //                 }, Error => {
  //                     this.masterService.resolveError(Error, "account Opening Balance Insert - getaccountList");
  //                     observer.complete();
  //                 },
  //                 () => { observer.complete(); }
  //                 )
  //         });
  //     }
  //     catch (ex) {
  //     }
  // }
  // acChanged(v) {

  //     if (typeof (v) === 'object') {
  //         this.selectedAccount = v;
  //         this.form.patchValue({ ACCODE: v.ACCODE });
  //           this.previousOpeningAccountData=[];
  //          this.getPreviousAccountOpeningBalance(v.ACID);
  //     }
  // }
  // accodeChanged(accode) {
  //     if (accode == '') return;
  //     var ac = this.accountList.find(x => x.ACCODE == accode);
  //     if (accode) {
  //         this.selectedAccount = ac;
  //         this.form.patchValue({ ACNAME: ac.ACNAME });
  //          this.previousOpeningAccountData=[];
  //         this.getPreviousAccountOpeningBalance(ac.ACID);
  //     }
  // }
  // onAddClick() {
  //     this.TranList.push({
  //         account: this.selectedAccount,
  //         DRAMOUNT: (this.form.value.DEBITORCREDIT == 'd') ? this.form.value.AMOUNT : '',
  //         CRAMOUNT: (this.form.value.DEBITORCREDIT == 'c') ? this.form.value.AMOUNT : ''
  //     });
  //     this.calculateTotal();
  //     this.selectedAccount = <TAcList>{};
  //     this.form.patchValue({ ACCODE: '', ACNAME: '', AMOUNT: '' });
  // }
  // addButtonDisable() {
  //     if (this.selectedAccount == null || this.selectedAccount.ACID == null || this.form.value.AMOUNT == null || this.form.value.AMOUNT == '' || this.form.value.AMOUNT <= 0) {
  //         return true;
  //     }
  //     else { return false; }
  // }
  // calculateTotal() {
  //     if (this.TranList) {
  //         this.TotalDebit = 0; this.TranList.forEach(d => { this.TotalDebit += d.DRAMOUNT == '' ? 0 : d.DRAMOUNT });
  //         this.TotalCredit = 0; this.TranList.forEach(c => { this.TotalCredit += c.CRAMOUNT == '' ? 0 : c.CRAMOUNT })
  //     }
  // }
  // TableRowDoubleClickEvent(row, index) {
  //     this.selectedAccount = row.account;
  //     this.form.patchValue({ ACCODE: row.account.ACCODE, ACNAME: row.account.ACNAME, AMOUNT: row.DRAMOUNT == '' ? row.CRAMOUNT : row.DRAMOUNT, DEBITORCREDIT: row.DRAMOUNT == '' ? 'c' : 'd' });
  //     this.TranList.splice(index, 1);
  //     this.calculateTotal();
  // }
  // onSaveClicked() {
  //     if (this.TranList.length == 0) { return; }
  //     if (this.form.value.DIVISION == null) { alert("Division Compulsory"); return; }
  //     this.dialogMessageSubject.next("Saving Data please wait...");
  //     var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
  //     this.TrnMainObj.DIVISION = this.form.value.DIVISION;
  //     let sub = this.masterService.getSingleObject({ TrnMainObj: this.TrnMainObj, TranTrnList: this.TranList }, '/saveopeningstock')
  //         .subscribe(data => {
  //             if (data.status == 'ok') {
  //                 this.dialogMessageSubject.next("Data Saved Successfully")

  //             }
  //             else {
  //                 this.dialogMessageSubject.next(data.result);
  //                 setTimeout(() => {
  //                     dialogRef.close();
  //                 }, 3000)
  //             }
  //         },
  //         error => { alert(error) },

  //         )

  // }
  // getPreviousAccountOpeningBalance(acid){
  //      this.masterService.getSingleObject({ division: this.form.value.DIVISION,acid:acid,vt:this.voucherType}, '/getprevacopeningbl').subscribe(
  //                     data => {
  //                         if (data.status == 'ok'){

  //                             if(data.result!=null && data.result.length>0){
  //                             this.previousOpeningAccountData=data.result;
  //                             }

  //                         }
  //                         else{alert(data);}
  //                     });
  // }
  // fixablewidth(){
  //     if(this.previousOpeningAccountData.length>0)
  //         return
  // }
}
