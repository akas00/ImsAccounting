import { TAcList } from "./../../../../common/interfaces";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";
import { Item } from "./../../../../common/interfaces/ProductItem";
//import {TAcList} from './../interfaces';
import {
  TrnMain,
  TrnProd,
  CostCenter,
  VoucherSatus,
  DialogInfo
} from "./../../../../common/interfaces/TrnMain";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { IDivision, Warehouse } from "./../../../../common/interfaces";
import { AppSettings } from "./../../../../common/AppSettings";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { SettingService } from "./../../../../common/services";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MdDialog } from "@angular/material";
import { DispatchDialog } from "../../../modaldialogs/dispatchDialog/dispatchDialog.component";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";

@Component({
  selector: "trnmain-sales-invoice-entry",
  styleUrls: ["../../../Style.css", "./_theming.scss"],
  templateUrl: "./trnmain-sales-invoice.component.html"
})
export class TrnMainSalesInvoiceComponent implements OnDestroy {
  @Output() DialogOpenEmit = new EventEmitter();
  TrnMainForm: FormGroup;
  SalesManList: any[] = [];
  // accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
  // AccountList: Observable<TAcList[]> = this.accountListSubject.asObservable();
  AccountList: any[] = [];
  CustomerList: TAcList[] = [];
  CashList: TAcList[] = [];
  BankList: TAcList[] = [];
  AppSettings;
  RETTO: string;
  TrnMainObj: TrnMain = <TrnMain>{};
  argument: DialogInfo;
  ServiceTaxRate: number = 0;
  VatRate: number = 0;
  tempWarehouse: string = "";
  TrnProdObj: TrnProd;
  directCashCounterSales: number;
  paymentmodelist: any[] = [];
  Suppliers: TAcList[] = [];
  BranchList: any[] = [];
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    public dialog: MdDialog,
    private _fb: FormBuilder,
    private router: Router,
    private arouter: ActivatedRoute,
    private setting: SettingService
  ) {
    this.AppSettings = this.setting.appSetting;
    this.directCashCounterSales = this.AppSettings.directCashCounterSales;
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.ServiceTaxRate = this.setting.appSetting.ServiceTaxRate;
    this.VatRate = this.setting.appSetting.VATRate;
    masterService.Currencies = [];
    masterService.getCurrencies();
  }

  ngOnInit() {
    this.TrnMainForm = this._fb.group({
      TRNMODE: ["", Validators.required],
      RETTO: ["", Validators.required],
      TRNAC: ["", Validators.required],
      PARAC: [""],
      COSTCENTER: [""],
      WAREHOUSE: [
        this.setting.appSetting.DefaultWarehouse,
        Validators.required
      ],
      CHEQUENO: [""],
      CHEQUEDATE: [""],
      REMARKS: [""],
      BILLTO: [""],
      BILLTOMOB: [""],
      BILLTOADD: [""],
      BILLTOTEL: [""],
      FCurrency: [""],
      EXRATE: [""],
      POSTUSER: [""], //use for supplier acid
      FPOSTUSER: [""], //use to save branchid to which sale is done
      TRNDATE: ["", Validators.required],
      BSDATE: ["", Validators.required],
      TRN_DATE: ["", Validators.required],
      BS_DATE: ["", Validators.required],
      VCHRNO: ["", Validators.required],
      CHALANNO: ["", Validators.required],
      DIVISION: ["", Validators.required], 
      REFBILL: [""],
      BALANCE:[""],
      INVOICETYPE:[""],
      SHIPNAME:[""],
      SALESTYPE:[""],
      CFORM:[""]

    });
    // //console.log({forminit:this.TrnMainForm,ware:this.setting.appSetting.DefaultWarehouse})
    this.masterService.refreshTransactionList();
    this.masterService.getCustomers().subscribe(
      res => {
        this.CustomerList = res;
      },
      error => {
        this.masterService.resolveError(
          error,
          "trnmain-sales-invoice - getCustomers"
        );
      },
      () => {}
    );
    this.masterService.getSupplierList().subscribe(
      res => {
        this.Suppliers = res;
      },
      error => {
        this.masterService.resolveError(
          error,
          "trnmain-sales-invoice - getsupplier"
        );
      },
      () => {}
    );
    this.masterService.getSalesmanList().subscribe(
      res => {
        this.SalesManList.push(<any>res);
      },
      error => {
        this.masterService.resolveError(
          error,
          "trnmain-sales-invoice - getSalesmanList"
        );
      }
    );

    this.masterService.getCashList().subscribe(
      res => {
        this.CashList = res;
      },
      error => {
        this.masterService.resolveError(
          error,
          "trnmain-sales-invoice - getCashList"
        );
      }
    );

    this.masterService.getBankList().subscribe(
      res => {
        this.BankList = res;
      },
      error => {
        this.masterService.resolveError(
          error,
          "trnmain-sales-invoice - getBankList"
        );
      }
    );
    this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
      res => {
        if (res.status == "ok") {
          this.paymentmodelist = res.result;
          this.TrnMainForm.patchValue({
            TRNMODE: "Cash"
          });
          this.onpaymentmodechange();
        } else {
          ////console.log("error on getting paymentmode " + res.result);
        }
      },
      error => {
        ////console.log("error on getting paymentmode ", error);
      }
    );

    this.masterService.masterGetmethod("/getChildbranches").subscribe(
      res => {
        if (res.status == "ok") {
          this.BranchList = JSON.parse(res.result);
        } else {
          ////console.log("error on getting Branches " + res.result);
        }
      },
      error => {
        ////console.log("error on getting Branches ", error);
      }
    );

    if (this.TrnMainObj.Mode == "VIEW") {
      this.TrnMainForm.get("TRNMODE").disable();
      this.TrnMainForm.get("RETTO").disable();
      this.TrnMainForm.get("TRNAC").disable();
      this.TrnMainForm.get("PARAC").disable();
      this.TrnMainForm.get("COSTCENTER").disable();
      this.TrnMainForm.get("WAREHOUSE").disable();
      this.TrnMainForm.get("CHEQUENO").disable();
      this.TrnMainForm.get("CHEQUEDATE").disable();
      this.TrnMainForm.get("REMARKS").disable();
      this.TrnMainForm.get("BILLTO").disable();
      this.TrnMainForm.get("BILLTOMOB").disable();
      this.TrnMainForm.get("BILLTOADD").disable();
      this.TrnMainForm.get("BILLTOTEL").disable();
      this.TrnMainForm.get("FCurrency").disable();
    }

    this.TrnMainForm.valueChanges.subscribe(form => {
      this.TrnMainObj.TRNMODE = form.TRNMODE;
      this.TrnMainObj.RETTO = form.RETTO;
      this.TrnMainObj.TRNAC = form.TRNAC;
      this.TrnMainObj.PARAC = form.PARAC;
      this.TrnMainObj.COSTCENTER = form.COSTCENTER;
      this.TrnMainObj.CHEQUENO = form.CHEQUENO;
      this.TrnMainObj.CHEQUEDATE = form.CHEQUEDATE;
      this.TrnMainObj.REMARKS = form.REMARKS;
      this.TrnMainObj.BILLTO = form.BILLTO;
      this.TrnMainObj.BILLTOMOB = form.BILLTOMOB;
      this.TrnMainObj.BILLTOADD = form.BILLTOADD;
      this.TrnMainObj.BILLTOTEL = form.BILLTOTEL;
      this._trnMainService.Warehouse = form.WAREHOUSE;
      this.TrnMainObj.FCurrency = form.FCurrency;
      this.TrnMainObj.POSTUSER = form.POSTUSER;
      this.TrnMainObj.FPOSTUSER = form.FPOSTUSER;
      //  //console.log({valueChanged:form});
    });

    if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
      this._trnMainService.loadDataObservable.subscribe(data => {
        try {
          var warehouse: string;
          if (data.ProdList[0] != null) {
            warehouse = data.ProdList[0].WAREHOUSE;
          } else {
            warehouse = this.setting.appSetting.DefaultWarehouse;
          }
          this.TrnMainForm.patchValue({
            TRNMODE: data.TRNMODE,
            RETTO: data.RETTO,
            TRNAC: data.TRNAC,
            PARAC: data.PARAC,
            COSTCENTER: data.COSTCENTER,
            WAREHOUSE: warehouse,
            BILLTO: data.BILLTO,
            BILLTOADD: data.BILLTOADD,
            BILLTOMOB: data.BILLTOMOB,
            CHEQUENO: data.CHEQUENO,
            CHEQUEDATE:
              data.CHEQUEDATE == null
                ? ""
                : data.CHEQUEDATE.toString().substring(0, 10),
            REMARKS: data.REMARKS,
            BILLTOTEL: data.BILLTOTEL,
            FCurrency: data.FCurrency,
            POSTUSER: data.POSTUSER, //postuser field used for supplier saving in sales
            FPOSTUSER: data.FPOSTUSER //use for branchid save
          });
          ////console.log({ trnmain: data.ProdList });
        } catch (e) {
          //console.log({ errorOnLoad: e });
        }
      });
    }

    // this._trnMainService.prodDisableSubject.subscribe(res=>{
    //     //this.TrnMainForm.reset();
    //     this.TrnMainObj.ProdList=[];
    //     this.undo();
    // })
  }

  // private resolevError(error: Error) {
  //     //console.log({trnmain_purchaseErrr:error});
  //     if (error.message == 'The ConnectionString property has not been initialized.') {
  //         // this.router.navigate(["/login", { returnUrl: this.router.url }]);
  //     }
  //     else {
  //         alert(error.message);
  //     }
  // }
  undo() {
    this.TrnMainForm.patchValue({
      TRNMODE: "credit",
      TRNAC: null,
      PARAC: null,
      REMARKS: "",
      BILLTOTEL: "",
      BILLTO: "",
      BILLTOADD: "",
      BILLTOMOB: ""
      //,
      //  WAREHOUSE:this.setting.appSetting.DefaultWarehouse
    });
    this.TrnMainObj.TRNMODE = "credit";
    this.onpaymentmodechange();
  }
  // radioTrnModeChange(value) {
  //     if (value == null) return;
  //      this.TrnMainForm.patchValue({BILLTO:"",BILLTOADD:"",BILLTOMOB:""});
  //     if (value.toString() == "cash") { this.accountListSubject.next(this.CashList) }
  //     else if (value.toString() == "credit") {

  //         this.accountListSubject.next(this.CustomerList);

  //     }
  //     else if (value.toString() == "bank") { this.accountListSubject.next(this.BankList) }
  //     this.TrnMainObj.TRNMODE = this.TrnMainForm.get('TRNMODE').value;

  // }

  ngOnDestroy() {
    try {
    } catch (ex) {
      //console.log({ ondestroy: ex });
    }
  }

  accountChange() {
    if (this.TrnMainForm.get("PARAC").value == "null") {
      this.TrnMainObj.PARAC = null;
      return;
    }
    // //console.log('before toupper',this.TrnMainObj.TRNAC,this.TrnMainObj.TRNMODE);
    if (
      this.TrnMainObj.TRNMODE &&
      this.TrnMainObj.TRNMODE.toUpperCase() == "CREDIT"
    ) {
      this.TrnMainObj.PARAC = this.TrnMainObj.TRNAC = this.TrnMainForm.get(
        "PARAC"
      ).value;

      var selectedparty = this.CustomerList.filter(
        x => x.ACID == this.TrnMainObj.PARAC
      )[0];
      if (selectedparty)
        this.TrnMainForm.patchValue({
          BILLTO: selectedparty.ACNAME,
          BILLTOADD: selectedparty.ADDRESS,
          BILLTOMOB: selectedparty.PHONE,
          BILLTOTEL: selectedparty.VATNO
        });

      // this.argument = this.prepareArgument(this.TrnMainObj.PARAC);
      // if (this._trnMainService.salesMode != 'warrenty') {
      //     this.dispatchDialogInitizeElem();
      // }
    }
    //   //console.log('after toupper',this.TrnMainObj.TRNAC,this.TrnMainObj.TRNMODE);
  }
  supplierChange() {
    ////console.log("suppliercheck", this.TrnMainForm.get("POSTUSER").value);
    if (this.TrnMainForm.get("POSTUSER").value == "null") {
      ////console.log("cehck");
      this.TrnMainObj.POSTUSER = null;
      return;
    }
    this.TrnMainObj.ProdList = [];
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
  }
  customerChangeEvent(value: string) {
    var selectedparty = this.CustomerList.filter(
      x => x.ACID == this.TrnMainObj.PARAC
    )[0];
    if (selectedparty)
      this.TrnMainForm.patchValue({
        BILLTO: selectedparty.ACNAME,
        BILLTOADD: selectedparty.ADDRESS,
        BILLTOMOB: selectedparty.PHONE
      });

    this.argument = this.prepareArgument(this.TrnMainObj.PARAC);
    if (this._trnMainService.salesMode != "warrenty") {
      this.dispatchDialogInitizeElem();
    }
  }
  dispatchDialogInitizeElem() {
    this._trnMainService.prodListMode = null;
    // this.TrnMainObj.ProdList = [];
    this.TrnMainForm.get("WAREHOUSE").enable();
    this.TrnMainForm.patchValue({
      WAREHOUSE: this.setting.appSetting.DefaultWarehouse
    });
    this._trnMainService.Warehouse = this.setting.appSetting.DefaultWarehouse;
    this._trnMainService.buttonHeading = "Reference No";
    this._trnMainService.ReCalculateBill();
  }
  openDispatchDialog() {
    //calculate button is click
    this.argument = this.prepareArgument(this.TrnMainObj.PARAC);
    if (this._trnMainService.salesMode == "warrenty") {
      // this.calculateWarrenty();
      this.WarrentyPart(this.argument);
      return;
    }

    if (this._trnMainService.salesMode == "outofwarrenty") {
      this.OutOfWarrentyPart(this.argument);
      return;
    }
    // if (this._trnMainService.PMode == "c") {

    //}
    ////console.log("argu", this.argument);
    this.dispatchDialogInitizeElem();
    let dialogRef = this.dialog.open(DispatchDialog, {
      hasBackdrop: true,
      data: this.argument
    });
    // ////console.log("chek dialog",aa);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status == "ok") {
          this._trnMainService.buttonHeading = result.selectedRow.VCHRNO;
          this.TrnMainForm.patchValue({
            BILLTO: result.selectedRow.BILLTO,
            BILLTOADD: result.selectedRow.BILLTOADD,
            BILLTOMOB: result.selectedRow.BILLTOMOB,
            TRNAC: result.selectedRow.TRNAC,
            BILLTOTEL: result.selectedRow.BILLTOTEL
          });
          this.ProdListFillerFromDispatch(result.selectedRow);
        }
      }
      dialogRef = null;
    });
  }

  calculateWarrenty() {
    this.TrnMainObj.ProdList = [];
    let response: Array<any> = [];
    this.masterService
      .getList(
        {
          DIVISION: this.TrnMainObj.DIVISION,
          TRNDATE: this._trnMainService.warrentyUpToDate
        },
        "/getWarrentyProdList"
      )
      .subscribe(
        res => {
          response = res.result.prodlist;
          this._trnMainService.warrentyVchrList = res.result.voucherlist;
          if (response && response.length > 0) {
            for (let p of response) {
              //console.log({ responseP: p });
              this.TrnMainForm.patchValue({ WAREHOUSE: p.WAREHOUSE });
              this.TrnMainObj.MWAREHOUSE = p.WAREHOUSE;
              this._trnMainService.Warehouse = p.WAREHOUSE;
              this.tempWarehouse = p.WAREHOUSE;
              this.TrnProdObj = p;
              if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales) {
                this.TrnProdObj.RealQty = this.TrnProdObj.REALQTY_IN;
                this.TrnProdObj.AltQty = this.TrnProdObj.ALTQTY_IN;
                this.TrnProdObj.REALQTY_IN = 0;
                this.TrnProdObj.ALTQTY_IN = 0;
              } else if (
                this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote
              ) {
                this.TrnProdObj.RealQty = 0;
                this.TrnProdObj.AltQty = 0;
                this.TrnProdObj.REALQTY_IN = this.TrnProdObj.RealQty;
                this.TrnProdObj.ALTQTY_IN = this.TrnProdObj.AltQty;
              } else if (
                this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
              ) {
                this.TrnProdObj.RealQty = this.TrnProdObj.REALQTY_IN;
                this.TrnProdObj.AltQty = this.TrnProdObj.ALTQTY_IN;
                this.TrnProdObj.REALQTY_IN = 0;
                this.TrnProdObj.ALTQTY_IN = 0;
              }
              //console.log({ callingCalculateNormal: this.TrnMainObj });
              this.TrnProdObj = this._trnMainService.CalculateNormal(
                this.TrnProdObj,
                this.ServiceTaxRate,
                this.VatRate
              );
              this.TrnMainObj.ProdList.push(this.TrnProdObj);
            }
            if (
              this.TrnMainObj.MWAREHOUSE == null ||
              this.TrnMainObj.MWAREHOUSE == ""
            ) {
              //rear case
              alert("Empty Warehouse");
              this._trnMainService.buttonHeading = "Reference No";
              this.TrnMainObj.ProdList = [];
            } else {
              this.TrnMainForm.get("WAREHOUSE").disable();
              this._trnMainService.Warehouse = this.tempWarehouse;
              this._trnMainService.prodListMode = {
                mode: "fromDispatch",
                selectedRow: <any>{}
              };
            }
            this._trnMainService.ReCalculateBill();
          }
        },
        error => {
          this.masterService.resolveError(
            error,
            "dispatchDialog - getWarrentyProdList"
          );
        }
      );
  }

  ProdListFillerFromDispatch(selectedRow) {
    this.TrnMainObj.ProdList = [];
    let response: Array<any> = [];
    this.masterService
      .getList(
        {
          VCHRNO: selectedRow.VCHRNO,
          DIVISION: selectedRow.DIVISION,
          PHISCALID: selectedRow.PhiscalID
        },
        "/getDeliveryProdList"
      )
      .subscribe(
        res => {
          response = res.result;
          if (response && response.length > 0) {
            for (let p of response) {
              //console.log({ responseP: p });
              this.TrnMainForm.patchValue({ WAREHOUSE: p.WAREHOUSE });
              this.TrnMainObj.MWAREHOUSE = p.WAREHOUSE;
              this._trnMainService.Warehouse = p.WAREHOUSE;
              this.tempWarehouse = p.WAREHOUSE;
              this.TrnProdObj = p;
              if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales) {
                this.TrnProdObj.RealQty = this.TrnProdObj.REALQTY_IN;
                this.TrnProdObj.AltQty = this.TrnProdObj.ALTQTY_IN;
                this.TrnProdObj.REALQTY_IN = 0;
                this.TrnProdObj.ALTQTY_IN = 0;
              } else if (
                this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
              ) {
                this.TrnProdObj.RealQty = 0;
                this.TrnProdObj.AltQty = 0;
                this.TrnProdObj.REALQTY_IN = this.TrnProdObj.RealQty;
                this.TrnProdObj.ALTQTY_IN = this.TrnProdObj.AltQty;
              } else if (
                this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
              ) {
                this.TrnProdObj.RealQty = this.TrnProdObj.REALQTY_IN;
                this.TrnProdObj.AltQty = this.TrnProdObj.ALTQTY_IN;
                this.TrnProdObj.REALQTY_IN = 0;
                this.TrnProdObj.ALTQTY_IN = 0;
              }
              //console.log({ callingCalculateNormal: this.TrnMainObj });
              this.TrnProdObj = this._trnMainService.CalculateNormal(
                this.TrnProdObj,
                this.ServiceTaxRate,
                this.VatRate
              );
              this.TrnMainObj.ProdList.push(this.TrnProdObj);
            }
            if (
              this.TrnMainObj.MWAREHOUSE == null ||
              this.TrnMainObj.MWAREHOUSE == ""
            ) {
              //rear case
              alert("Empty Warehouse");
              this._trnMainService.buttonHeading = "Reference No";
              this.TrnMainObj.ProdList = [];
            } else {
              this.TrnMainForm.get("WAREHOUSE").disable();
              this._trnMainService.Warehouse = this.tempWarehouse;
              this._trnMainService.prodListMode = {
                mode: "fromDispatch",
                selectedRow: selectedRow
              };
             this._trnMainService.ReCalculateBill();
            }
          }
        },
        error => {
          this.masterService.resolveError(
            error,
            "dispatchDialog - getDeliveryProdList"
          );
        }
      );
  }
  prepareArgument(partyac) {
    let A;
    switch (this.TrnMainObj.VoucherType) {
      case VoucherTypeEnum.Sales:
        A = {
          TRANSACTION: "SALES",
          PARAC: partyac,
          DIVISION: this.TrnMainObj.DIVISION,
          DELEVERYLIST: "OUT",
          SALESMODE: this._trnMainService.salesMode,
          WARRENTYTODATE: this._trnMainService.warrentyUpToDate
        };
        break;
      case VoucherTypeEnum.CreditNote:
        A = {
          TRANSACTION: "CREDITNOTE",
          PARAC: partyac,
          DIVISION: this.TrnMainObj.DIVISION,
          DELEVERYLIST: "IN",
          SALESMODE: this._trnMainService.salesMode,
          WARRENTYTODATE: this._trnMainService.warrentyUpToDate
        };
        break;
      case VoucherTypeEnum.TaxInvoice:
        A = {
          TRANSACTION: "TAXINVOICE",
          PARAC: partyac,
          DIVISION: this.TrnMainObj.DIVISION,
          DELEVERYLIST: "OUT",
          SALESMODE: this._trnMainService.salesMode,
          WARRENTYTODATE: this._trnMainService.warrentyUpToDate
        };
        break;
    }
    return A;
  }
  CurrencyChange() {
    if (this.masterService.Currencies.length > 0) {
      var FC = this.masterService.Currencies.find(
        c => c.CURNAME == this.TrnMainObj.FCurrency
      );
      if (FC != null) {
        this.TrnMainObj.EXRATE = FC.EXRATE;
        this.TrnMainForm.patchValue({ EXRATE: FC.EXRATE });
      }
    }
    if (
      this.TrnMainObj.ProdList != null &&
      this.TrnMainObj.ProdList.length > 0
    ) {
      for (let p of this.TrnMainObj.ProdList) {
        this._trnMainService.CalculateNormal(
          p,
          this.setting.appSetting.ServiceTaxRate,
          this.setting.appSetting.VATRate,
          1
        );
      }
      this._trnMainService.ReCalculateBill();
    }
  }

  //NEW Updated For import
  OutOfWarrentyPart(Data) {
    this.DialogOpenEmit.emit({ mode: "OutOfWarrenty", value: Data });
  }
  WarrentyPart(Data) {
    this.DialogOpenEmit.emit({ mode: "Warrenty", value: Data });
  }
  //WARRANTY BILLING
  //warrantyList
  onpaymentmodechange() {
    if (this.paymentmodelist == null || this.paymentmodelist.length == 0)
      return;
    var selectedmode = this.paymentmodelist.filter(
      x =>
        x.PAYMENTMODENAME.toUpperCase() == this.TrnMainObj.TRNMODE.toUpperCase()
    )[0];
    if (selectedmode == null) {
      ////console.log("Selected Mode not found...");
      return;
    }
    let modetype = selectedmode.MODETYPE;
    ////console.log("selectedmode", selectedmode);
    if (selectedmode.ACID != null && selectedmode.ACID != "") {
      this.TrnMainForm.patchValue({
        TRNAC: selectedmode.ACID
      });
      this.TrnMainObj.TRNAC = selectedmode.ACID;
    } else {
      this.TrnMainForm.patchValue({
        TRNAC: null
      });
      this.TrnMainObj.TRNAC = null;
    }

    if (modetype != null && modetype.toUpperCase() == "LIST") {
      this.masterService
        .masterGetmethod("/getpaymentmodelist/" + this.TrnMainObj.TRNMODE)
        .subscribe(
          res => {
            if (res.status == "ok") {
              this.AccountList = JSON.parse(res.result);
              //////console.log("accountlist",this.AccountList);
            } else {
              ////console.log("error on getting paymentmode " + res.result);
            }
          },
          error => {
            ////console.log("error on getting paymentmode ", error);
          }
        );
    } else {
      this.AccountList = this.CustomerList;
    }
  }

  changeTrnDate(value, format: string) {
    try {
      var adbs = require("ad-bs-converter");
      if (format == "AD") {
        var adDate = value.replace("-", "/").replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this.TrnMainForm.get("BS_DATE").setValue(
          bsDate.en.year +
            "-" +
            (bsDate.en.month == "1" ||
            bsDate.en.month == "2" ||
            bsDate.en.month == "3" ||
            bsDate.en.month == "4" ||
            bsDate.en.month == "5" ||
            bsDate.en.month == "6" ||
            bsDate.en.month == "7" ||
            bsDate.en.month == "8" ||
            bsDate.en.month == "9"
              ? "0" + bsDate.en.month
              : bsDate.en.month) +
            "-" +
            (bsDate.en.day == "1" ||
            bsDate.en.day == "2" ||
            bsDate.en.day == "3" ||
            bsDate.en.day == "4" ||
            bsDate.en.day == "5" ||
            bsDate.en.day == "6" ||
            bsDate.en.day == "7" ||
            bsDate.en.day == "8" ||
            bsDate.en.day == "9"
              ? "0" + bsDate.en.day
              : bsDate.en.day)
        );
      } else if (format == "BS") {
        var bsDate = value.replace("-", "/").replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this.TrnMainForm.get("TRN_DATE").setValue(
          adDate.year +
            "-" +
            (adDate.month.toString().length == 1
              ? "0" + adDate.month
              : adDate.month) +
            "-" +
            (adDate.day.toString().length == 1 ? "0" + adDate.day : adDate.day)
        );
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  clickTrnDate(value) {
    try {
      if (value != null && value != 0) {
        var adbs = require("ad-bs-converter");
        var bsDate = value.replace("-", "/").replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this.TrnMainForm.get("TRN_DATE").setValue(
          adDate.year +
            "-" +
            (adDate.month.toString().length == 1
              ? "0" + adDate.month
              : adDate.month) +
            "-" +
            (adDate.day.toString().length == 1 ? "0" + adDate.day : adDate.day)
        );
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  changeEntryDate(value, format: string) {
    try {
      var adbs = require("ad-bs-converter");
      if (format == "AD") {
        var adDate = value.replace("-", "/").replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        this.TrnMainForm.get("BSDATE").setValue(
          bsDate.en.year +
            "-" +
            (bsDate.en.month == "1" ||
            bsDate.en.month == "2" ||
            bsDate.en.month == "3" ||
            bsDate.en.month == "4" ||
            bsDate.en.month == "5" ||
            bsDate.en.month == "6" ||
            bsDate.en.month == "7" ||
            bsDate.en.month == "8" ||
            bsDate.en.month == "9"
              ? "0" + bsDate.en.month
              : bsDate.en.month) +
            "-" +
            (bsDate.en.day == "1" ||
            bsDate.en.day == "2" ||
            bsDate.en.day == "3" ||
            bsDate.en.day == "4" ||
            bsDate.en.day == "5" ||
            bsDate.en.day == "6" ||
            bsDate.en.day == "7" ||
            bsDate.en.day == "8" ||
            bsDate.en.day == "9"
              ? "0" + bsDate.en.day
              : bsDate.en.day)
        );
      } else if (format == "BS") {
        var bsDate = value.replace("-", "/").replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this.TrnMainForm.get("TRNDATE").setValue(
          adDate.year +
            "-" +
            (adDate.month.toString().length == 1
              ? "0" + adDate.month
              : adDate.month) +
            "-" +
            (adDate.day.toString().length == 1 ? "0" + adDate.day : adDate.day)
        );
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  clickEntryDate(value) {
    try {
      if (value != null && value != 0) {
        var adbs = require("ad-bs-converter");
        var bsDate = value.replace("-", "/").replace("-", "/");
        var adDate = adbs.bs2ad(bsDate);
        this.TrnMainForm.get("TRNDATE").setValue(
          adDate.year +
            "-" +
            (adDate.month.toString().length == 1
              ? "0" + adDate.month
              : adDate.month) +
            "-" +
            (adDate.day.toString().length == 1 ? "0" + adDate.day : adDate.day)
        );
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  ReferenceLoad() {
    let vchrno = this.TrnMainForm.get("REFBILL").value;
    if (!vchrno) {
      return;
    }
    //console.log({ ondispathdialogclick: vchrno });
    this.ProdListFillerFromDispatch({
      VCHRNO: vchrno,
      DIVISION: this.AppSettings.DefaultDivision,
      PHISCALID: null
    });
    return;
  }
  //   TrnProdObj: TrnProd;
  //   ProdListFillerFromDispatch(selectedRow) {
  //     this.TrnMainObj.ProdList = [];
  //     let response: Array<any> = [];
  //     this.masterService
  //       .getList(
  //         {
  //           VCHRNO: selectedRow.VCHRNO,
  //           DIVISION: selectedRow.DIVISION,
  //           PHISCALID: selectedRow.PhiscalID
  //         },
  //         "/getTrnMain"
  //       )
  //       .subscribe(
  //         res => {
  //           //console.log({ mainReturn: res });
  //           var retmain: TrnMain = res.result;
  //           this.TrnMainObj.TRNMODE = retmain.TRNMODE;
  //           this.TrnMainObj.TRNAC = retmain.TRNAC;
  //           this.TrnMainObj.REMARKS = retmain.REMARKS;
  //           this.TrnMainObj.BILLTO = retmain.BILLTO;
  //           this.TrnMainObj.BILLTOADD = retmain.BILLTOADD;
  //           this.TrnMainObj.BILLTOTEL = retmain.BILLTOTEL;
  //           this.TrnMainObj.BILLTOMOB = retmain.BILLTOMOB;
  //         },
  //         error =>
  //           this.masterService.resolveError(
  //             error,
  //             "trnmain-not-item-prodlistfiller"
  //           )
  //       );

  //     this.masterService
  //       .getList(
  //         {
  //           VCHRNO: selectedRow.VCHRNO,
  //           DIVISION: selectedRow.DIVISION,
  //           PHISCALID: selectedRow.PhiscalID
  //         },
  //         "/getDeliveryProdList"
  //       )
  //       .subscribe(res => {
  //         //console.log({ getDeliveryProdList: res });
  //         response = res.result;
  //         this._trnMainService.cnReturnedProdList = res.result;
  //         if (response && response.length > 0) {
  //           for (let p of response) {
  //             this.TrnMainObj.MWAREHOUSE = p.WAREHOUSE;
  //             this._trnMainService.Warehouse = p.WAREHOUSE;
  //             this.tempWarehouse = p.WAREHOUSE;
  //             this.TrnProdObj = p;
  //             //console.log({ p: p });
  //             this.TrnProdObj = this._trnMainService.CalculateNormal(
  //               this.TrnProdObj,
  //               this.AppSettings.ServiceTaxRate,
  //               this.AppSettings.VATRate
  //             );
  //             this.TrnProdObj.REALQTY_IN = p.RealQty;
  //             this.TrnProdObj.ALTQTY_IN = p.AltQty;
  //             this.TrnProdObj.RealQty = 0;
  //             this.TrnProdObj.AltQty = 0;

  //             this.TrnMainObj.ProdList.push(this.TrnProdObj);
  //           }
  //         }
  //         ////console.log("prodlist1", this.TrnMainObj.ProdList);
  //       });
  //   }

  //   getAdditionalCost(value: string) {
  //     this.additionalCostService.getDivision = this.form.value.DIVISION;
  //     this.additionalcostEmit.emit(value);
  //   }

  LoadSalesBill() {
    try {
      if (this.TrnMainObj.REFBILL == null || this.TrnMainObj.REFBILL == "")
        return;
      if (this.TrnMainObj.REFBILL.substr(0, 2) != "TI") {
        alert("Invalid Bill Number detected");
        return;
      }
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Checking Bill Number please wait... "
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      this.masterService
        .masterPostmethod("/getsalesbillDataFromCentralServer", {
          billno: this.TrnMainObj.REFBILL
        })
        .subscribe(
          x => {
            if (x.status == "ok") {
              var data = JSON.parse(x.result);
              var Plist = data.prod;
              this.TrnMainObj.ProdList = [];
              for (var p of Plist) {
                p.REALQTY_IN = p.RealQty;
                p.ALTQTY_IN = p.AltQty;
                p.RealQty = 0;
                p.AltQty = 0;
                p.AltQtyStr = "0";
              }
              this.TrnMainObj.ProdList = Plist;
              ////console.log(this.TrnMainObj.ProdList);
             
              messageSubject.next("Successfull");
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
              // for(let p of Plist)
              // {
              // let prodObj=<TrnProd>{};
              // prodObj.MCODE=p.MCODE;
              // prodObj.ITEMDESC=p.ITEMDESC;
              // prodObj.MENUCODE=p.MENUCODE;
              // prodObj.RATE=p.RATE;
              // prodObj.BATCH=prodObj.BC=p.BC;
              // prodObj.MFGDATE=p.MFGDATE;
              // prodObj.EXPDATE=p.EXPDATE;
              // prodObj.UNIT=p.UNIT;
              // prodObj.PRATE=p.PRATE;
              // prodObj.WAREHOUSE;
              // prodObj.Quantity=p.Quantity;
              // prodObj.REALQTY_IN=p.RealQty;
              // prodObj.ALTQTY_IN=p.AltQty;
              // prodObj.RealQty=0;
              // prodObj.AltQty=0;
              // prodObj.DISCOUNT=p.DISCOUNT;
              // prodObj.INDDISCOUNT=p.INDDISCOUNT;
              // prodObj.AMOUNT=p.AMOUNT;
              // prodObj.ISVAT=p.ISVAT;
              // prodObj.TAXABLE=p.TAXABLE;
              // prodObj.NONTAXABLE=p.NONTAXABLE;
              // prodObj.VAT=p.VAT;
              // prodObj.NETAMOUNT=p.NETAMOUNT;
              // prodObj.PROMOTION=p.PROMOTION;
              // prodObj.LOYALTY=p.LOYALTY;
              // }
            } else {
              messageSubject.next(x.result);
              setTimeout(() => {
                childDialogRef.close();
              }, 3000);
              ////console.log("error on status error", x.result);
            }
          },
          error => {
            childDialogRef.close();
            alert(error);
          }
        );
    } catch (e) {
      alert("Error on loading voucher," + e);
    }
  }

  
}
