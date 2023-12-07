import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/setting.service";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppSettings } from "../../../../common/services/AppSettings";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";
import { Item } from "../../../../common/interfaces/ProductItem";
import { Subscriber } from "rxjs/Subscriber";
import { ModalDirective } from "ng2-bootstrap";
//import { MdDialog } from "@angular/material/material";

@Component({
  selector: "normsetting",
  templateUrl: "./norms-setting.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"]
})

export class NormsSettingComponent {
  @ViewChild('onFactor') onFactor: ElementRef;
  @ViewChild('onQuantity') onQuantity: ElementRef;
  @ViewChild('newModal') newModal: ModalDirective;
  private returnUrl: string;
  invoiceType: string;
  private subcriptions: Array<Subscription> = [];
  TrnMainObj: TrnMain;
  voucherType: VoucherTypeEnum;
  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  form: FormGroup;
  subscriptions: Subscription[] = [];
  results: Observable<Item[]>;
  ReceipeItemList_results: Observable<Item[]>;
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();

  ReceipeItemList: any[] = [];
  ReceipeAddedList: any[] = [];
  selectedReceipeItem: Item;
  mode: string;
  constructor(public masterService: MasterRepo, private _trnMainService: TransactionService, private router: Router, private arouter: ActivatedRoute, private _hotkeysService: HotkeysService, private setting: SettingService, private _fb: FormBuilder, private AppSettings: AppSettings, public dialog: MdDialog) {
    this.mode = 'init';
  }

  ngOnInit() {
    // if (this.ReceipeItemList.length == 0) {
    //     this.masterService.getList({}, '/getReceipeItemList').subscribe(
    //         res => {
    //             if (res.status == 'ok') {
    //                 this.ReceipeItemList = res.result;
    //             }
    //         }
    //     );
    // }
    this.form = this._fb.group({
      MCODE1: [''],
      MENUCODE1: [''],
      MENUCODE: [''],
      selectedProd: [''],
      selectedReceipeItem: [''],
      FACTOR: [''],
      QUANTITY: [''],
      // DIVISION: [this.AppSettings.DefaultDivision, Validators.required],

    });
    // if (!!this.arouter.snapshot.params['returnUrl']) {
    //     this.returnUrl = this.arouter.snapshot.params['returnUrl'];
    // }
    // var mode: string;
    // if (!!this.arouter.snapshot.params['mode']) {
    //     mode = this.arouter.snapshot.params['mode'];
    //     this.TrnMainObj.Mode = mode == 'add' ? 'NEW' : mode.toUpperCase();
    // }

    // if (mode.toUpperCase() == "VIEW") {
    //     let division: string;
    //     let phiscalid: string;
    //     let VNO: string;
    //     if (!!this.arouter.snapshot.params['div']) {
    //         division = this.arouter.snapshot.params['div'];
    //     }

    //     if (!!this.arouter.snapshot.params['phiscal']) {
    //         phiscalid = this.arouter.snapshot.params['phiscal'];
    //     }
    //     if (!!this.arouter.snapshot.params['c']) {
    //         VNO = this.arouter.snapshot.params['c'];
    //     }
    //     this.masterService.getSingleObject({ VNO: VNO, division: division, phiscalid: phiscalid }, '/getopeningstockbyvno').subscribe(
    //         data => {
    //             if (data.status == 'ok') {
    //                 this.TrnMainObj.ProdList = data.result;
    //                 this._trnMainService.TrnMainObj = this.TrnMainObj;
    //                 this.form.patchValue({ DIVISION: division, CHALANNO: VNO });


    //             }
    //         }
    //     )
    // }


  }
  ReceipeItemList_search(event) {
    if (event.query == '') {
      this.ReceipeItemList_results = this.ReceipeItemList_dropListItem('a');
      return;
    }
    this.ReceipeItemList_results = this.ReceipeItemList_dropListItem(event.query);
  }
  ReceipeItemList_handleDropdownClick() {
    let resultDataSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    this.ReceipeItemList_results = resultDataSubject.asObservable();
    let allItems: Item[] = [];
    this.masterService.getReceipeItemList()
      .subscribe(data => {
        allItems = data;
        resultDataSubject.next(allItems)
      }, error => this.masterService.resolveError(Error, 'receipeitemList-handledropdown')
      );
  }
  ReceipeItemList_onIFocus(event) {
    if (event.target.value == "") { return }
    else {
      this.ReceipeItemList_search({ query: event.target.value });
    }
  }
  ReceipeItemList_dropListItem = (keyword: any): Observable<Array<Item>> => {
    try {
      return new Observable((observer: Subscriber<Array<Item>>) => {
        let sub11 = this.masterService.getReceipeItemList()
          .map(fList => {
            return fList.filter((data: Item) =>
              data.DESCA == null ? '' : data.DESCA.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
          })
          .map(res => res.slice(0, 20))
          .subscribe(data => {
            observer.next(data);
          }, Error => {
            this.masterService.resolveError(Error, "Norm Setting- getReceipeItemList");
            this.masterService._receipeitemListObservable$ = null;
            observer.complete();
          },
            () => { observer.complete(); }
          )
        this.subscriptions.push(sub11);
      });
    }
    catch (ex) {
    }
  }
  receipeItemChange(value) {
    if (value) {
      this.form.patchValue({ MENUCODE1: value.MENUCODE, FACTOR: value.FACTOR });
    }
  }
  search(event) {
    if (event.query == '') {
      this.results = this.dropListItem('a');
      return;
    }
    this.results = this.dropListItem(event.query);
  }
  handleDropdownClick() {
    let resultDataSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    this.results = resultDataSubject.asObservable();
    let allItems: Item[] = [];
    this.masterService.getProductItemList()
      //.map(m=>{return m.filter(i=>i.PTYPE==0)})
      .subscribe(data => {
        allItems = data;
        resultDataSubject.next(allItems)
      }, error => this.masterService.resolveError(Error, 'Productinsert-handledropdown')
      );


  }
  onIFocus(event) {
    if (event.target.value == "") {
      return
    }
    else {

      this.search({ query: event.target.value });
    }
  }
  dropListItem = (keyword: any): Observable<Array<Item>> => {
    try {
      return new Observable((observer: Subscriber<Array<Item>>) => {
        let sub11 = this.masterService.getProductItemList()
          //.map(m=>{return m.filter(i=>i.PTYPE==0)})
          .map(fList => {
            return fList.filter((data: Item) =>
              data.DESCA == null ? '' : data.DESCA.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
          })
          .map(res => res.slice(0, 20))
          .subscribe(data => {
            observer.next(data);
          }, Error => {
            this.masterService.resolveError(Error, "Product Insert - getProductItemList");
            this.masterService._itemListObservable$ = null;
            observer.complete();
          },
            () => { observer.complete(); }
          )
        this.subscriptions.push(sub11);
      });
    }
    catch (ex) {
    }
  }
  menucode1Changed(value) {
    this.masterService.getReceipeItemList().subscribe(x => {
      var item = x.find(x => x.MENUCODE == value);
      if (item) {
        this.form.patchValue({ selectedReceipeItem: item, FACTOR: item.FACTOR });
        this.onFactor.nativeElement.focus();

      }

    })
  }

  itemChanged(value) {
    if (value) {
      this.form.patchValue({ MENUCODE: value.MENUCODE });
    }
  }
  menucodeChanged(value) {
    this.masterService.getProductItemList()
      .subscribe(x => {
        var item = x.find(x => x.MENUCODE == value);
        if (item) {
          this.form.patchValue({ selectedProd: item });
          this.onQuantity.nativeElement.focus();

        }

      })
  }
  onNewClick() {
    if (this.form.value.selectedReceipeItem != null && this.form.value.selectedReceipeItem.ENO != null) {
      this.newModal.show(); return;
    }
    this.mode = "new";
  }

  onClickYes() {
    this.newModal.hide();
    this.mode = "edit";
    this.dialogMessageSubject.next("please wait...");
    var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })

    let sub = this.masterService.getSingleObject({ ENO: this.form.value.selectedReceipeItem.ENO }, '/getReceipeProdList')
      .subscribe(data => {
        if (data.status == 'ok') {
          dialogRef.close();
          this.ReceipeAddedList = data.result;
        }
        else {
          this.dialogMessageSubject.next(data.result);
          setTimeout(() => {
            this.onUndoClick();
            dialogRef.close();
          }, 3000)
        }
      },
        error => { alert(error) },
      )
    this.subcriptions.push(sub);
  }
  onUndoClick() {
    this.mode = "init";
    this.ReceipeAddedList = [];
    this.form = this._fb.group({
      MCODE1: [''],
      MENUCODE1: [''],
      MENUCODE: [''],
      selectedProd: [''],
      selectedReceipeItem: [''],
      FACTOR: [''],
      QUANTITY: [''],

    });
  }
  onClickNo() {
    this.newModal.hide();
    this.onUndoClick();
  }
  onAddClick() {

    this.ReceipeAddedList.push({ MENUCODE: this.form.value.selectedProd.MENUCODE, DESCA: this.form.value.selectedProd.DESCA, BASEUNIT: this.form.value.selectedProd.BASEUNIT, QTY: this.form.value.QUANTITY, RMCODE: this.form.value.selectedProd.MCODE });
    this.form.patchValue({ MENUCODE: '', selectedProd: '', QUANTITY: '' });
  }
  onSaveClicked() {
    this.dialogMessageSubject.next("Saving Data please wait...");
    var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })

    this.ReceipeAddedList.forEach(r => r.ENO = this.form.value.selectedReceipeItem.ENO);
    let sub = this.masterService.saveObject(this.mode, { receipeItem: { ENO: this.form.value.selectedReceipeItem.ENO, FACTOR: this.form.value.FACTOR, MCODE: this.form.value.selectedReceipeItem.MCODE }, receipeprod: this.ReceipeAddedList }, '/saveReceipeItem')
      .subscribe(data => {
        if (data.status == 'ok') {
          this.dialogMessageSubject.next("Data Saved Successfully");
          this.ReceipeAddedList = [];
          this.onUndoClick();
          this.masterService.getReceipeItemList(true);
          setTimeout(() => {
            dialogRef.close();
          }, 1000)
        }
        else {
          this.dialogMessageSubject.next(data.result);
          setTimeout(() => {
            dialogRef.close();
          }, 3000)
        }
      },
        error => { alert(error) },
      )

    this.subcriptions.push(sub);
  }
  onCancelClicked() {
    this.router.navigate([this.returnUrl]);
  }
  TableRowDoubleClickEvent(value, index) {
    this.ReceipeAddedList.splice(index, 1);
  }
}
