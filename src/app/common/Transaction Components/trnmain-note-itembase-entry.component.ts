import { TAcList } from './../interfaces';
import { VoucherTypeEnum } from "./../interfaces/TrnMain";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Item } from './../interfaces';
//import {TAcList, TAcList} from '../../../..///common/interfaces/Account';
import { TrnMain, TrnProd, CostCenter, DialogInfo } from './../interfaces/TrnMain';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from './../repositories/masterRepo.service';
import { IDivision } from './../interfaces'
import { SettingService, AppSettings } from './../services';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { PREFIX } from "./../interfaces/Prefix.interface";
import { TransactionService } from "./transaction.service";
import { DispatchDialog } from "../../pages/modaldialogs/dispatchDialog/dispatchDialog.component";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MessageDialog } from '../../pages/modaldialogs/messageDialog/messageDialog.component';

@Component({
    selector: "trnmain-note-itembase",
    templateUrl: "./trnmain-note-itembase-entry.component.html",
    styleUrls: ["../../pages/Style.css", "../../pages/modal-style.css"],
})

export class TrnMainNoteItemBaseComponent {
    TrnMainObj: TrnMain = <TrnMain>{};
    PurchaseAcList: TAcList[] = [];
    SalesAcList: TAcList[] = [];
    CustomerList: TAcList[] = [];
    CostCenterList: CostCenter[] = [];
    divisionList: IDivision[] = [];
    TrnMainForm: FormGroup;
    AppSettings: AppSettings;
    argument: DialogInfo;
    ServiceTaxRate: number;
    VatRate: number;
    dispatchNo: string = 'Reference No';
    tempWarehouse: string;
    accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
    AccountList: Observable<TAcList[]> = this.accountListSubject.asObservable();
    SupplierList: TAcList[] = [];
    CashList: TAcList[] = [];
    BankList: TAcList[] = [];
    RefNoVisible;

    constructor(public masterService: MasterRepo, public _transactionService: TransactionService, private setting: SettingService, private _fb: FormBuilder, public dialog: MdDialog) {
        try {

            this.AppSettings = setting.appSetting;
            this.TrnMainObj = this._transactionService.TrnMainObj;
            this.ServiceTaxRate = this.setting.appSetting.ServiceTaxRate
            this.VatRate = this.setting.appSetting.VATRate;
            masterService.Currencies = [];
            masterService.getCurrencies();
            this._transactionService.prodDisable$.subscribe(res => {
                //if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                if (res == false) {
                    this.dispatchNo = "Load";
                    this.RefNoVisible = true;
                }
                else {
                    this.dispatchNo = "Reference No";
                    this.RefNoVisible = false;
                }
                //}
            });
            this.RefNoVisible = this._transactionService.prodDisable$.map(res => !res)
        } catch (ex) {
            //alert(ex);
        }
    }

    ngOnInit() {
        try {
            // this.masterService.getAcList().subscribe(res => {
            //     this.AccountList.push(<TAcList>res);
            // }, error => {
            //     this.masterService.resolveError(error, "trnmain-note-itembase - getAcList");
            // });
            // if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            //     this.masterService.getPurchaseAcList().subscribe(res => {
            //         this.PurchaseAcList.push(<TAcList>res);
            //     }, error => {
            //         this.masterService.resolveError(error, "trnmain-note-itembase- getPurchaseAcList");
            //     });
            // } else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            //     this.masterService.getSalesAcList().subscribe(res => {
            //         this.SalesAcList.push(<TAcList>res);
            //     }, error => {
            //         this.masterService.resolveError(error, "trnmain-note-itembase - getSalesAcList");
            //     });
            // }
            this.TrnMainForm = this._fb.group({
                TRNMODE: ['', Validators.required],
                RETTO: ['', Validators.required],
                TRNAC: ['', Validators.required],
                PARAC: ['', Validators.required],
                COSTCENTER: ['', Validators.required],
                WAREHOUSE: [this.AppSettings.DefaultWarehouse, Validators.required],
                CHEQUENO: ['', Validators.required],
                CHEQUEDATE: ['', Validators.required],
                REMARKS: [''],
                FCurrency: [''],
                EXRATE: [''],
                referenceNo: ['', Validators.required]
            });
            this.TrnMainForm.valueChanges.subscribe(form => {
                this.TrnMainObj.RETTO = form.RETTO;
                this.TrnMainObj.TRNAC = form.TRNAC;
                this.TrnMainObj.COSTCENTER = form.COSTCENTER;
                this.TrnMainObj.REMARKS = form.REMARKS;
            });
            this.TrnMainForm.controls['referenceNo'].valueChanges.debounceTime(1000).subscribe(value => {
                this.TrnMainObj.REFBILL = value;
                this._transactionService.referenceNoSubject.next(value);
            })
            this.TrnMainForm.patchValue({ TRNMODE: "credit" });
            this.TrnMainObj.TRNMODE = "credit"
            this.masterService.refreshTransactionList();
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                this.masterService.getCustomers()
                    .subscribe(res => {
                        this.CustomerList = res;
                    },
                        error => {
                            this.masterService.resolveError(error, 'trnmain-note-getcustomerlist');
                        }, () => { this.radioTrnModeChange(this.TrnMainObj.TRNMODE) });
            }
            else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                this.masterService.getSupplierList()
                    .subscribe(res => {
                        this.SupplierList = res;
                    },
                        error => {
                            this.masterService.resolveError(error, 'trnmain-purchase-getSupplierList');
                        }, () => { this.radioTrnModeChange(this.TrnMainObj.TRNMODE) });
            }
            //THIS IS ACTION WHILE SALEMODE OPTION CLICK
            this._transactionService.prodDisable$.subscribe(ret => {
                //counter mode


                if (ret == false) {
                    this.resetForm();
                    //this.TrnMainForm.get('TRNAC').disable();
                    //this.TrnMainForm.get('TRNMODE').disable();

                }
                else {
                    this.resetForm();
                    this.TrnMainForm.get('TRNAC').enable();
                    this.TrnMainForm.get('TRNMODE').enable();
                }
            })

            this.masterService.getCostCenterList().subscribe(res => {
                this.CostCenterList.push(<CostCenter>res);
            }, error => {
                this.masterService.resolveError(error, "trnmain-note-itembase - getCostCenterList");
            });

            this.masterService.getCashList().subscribe(res => { this.CashList = res; }, error => { this.masterService.resolveError(error, 'trnmain-note-getCashList'); });

            this.masterService.getBankList().subscribe(res => { this.BankList = res; }, error => { this.masterService.resolveError(error, 'trnmain-note-getBankList'); });

            if (this.TrnMainObj.Mode == "VIEW") {
                this.TrnMainForm.get('RETTO').disable();
                this.TrnMainForm.get('TRNAC').disable();
                this.TrnMainForm.get('COSTCENTER').disable();
                this.TrnMainForm.get('REMARKS').disable();
                this.TrnMainForm.get('FCurrency').disable();
            }


            if (this.TrnMainObj.Mode == "VIEW") {
                this._transactionService.loadDataObservable.subscribe(data => {
                    try {
                        this.TrnMainForm.patchValue({
                            RETTO: data.RETTO,
                            TRNAC: data.TRNAC,
                            COSTCENTER: data.COSTCENTER,
                            REMARKS: data.REMARKS,
                            PARAC: data.PARAC,
                            referenceNo: data.REFBILL,
                            FCurrency: data.FCurrency
                        });
                    } catch (ex) {
                        alert(ex);
                    }
                });
            }
            //if purchasereturn make refno and load button visible
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturn) {
                this._transactionService.prodDisableSubject.next(false);
            }
        } catch (ex) {
            alert(ex);
        }

    }



    acChange() {
        this.TrnMainForm.get('TRNAC').patchValue(this.TrnMainForm.get('TRNAC').value);
        this.TrnMainObj.PARAC = this.TrnMainObj.TRNAC;

        this._transactionService.prodListMode = null;
        //this.TrnMainObj.ProdList = [];
        //  this.TrnMainForm.get('WAREHOUSE').enable();
        //  this.TrnMainForm.patchValue({ WAREHOUSE: null });
        //  this._transactionService.Warehouse=null;
        this.dispatchNo = "OrderRef";
        //  this._transactionService.ReCalculateBill(this.TrnMainObj, this.ServiceTaxRate, this.VatRate);
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            this.argument = { TRANSACTION: 'CREDITNOTE', PARAC: this.TrnMainObj.PARAC, DIVISION: this.TrnMainObj.DIVISION, DELEVERYLIST: 'IN', SALESMODE: this._transactionService.salesMode, WARRENTYTODATE: this._transactionService.warrentyUpToDate };
        }
    }

    openDispatchDialog() {

        if (this._transactionService.salesMode == 'counter' || this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            let vchrno = this.TrnMainForm.get("referenceNo").value;
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && vchrno.substring(0, 2) != "PI") {
                alert("Invalid Voucher No");
                return;
            }
            else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && !(vchrno.substring(0, 2) == "TI" || vchrno.substring(0, 2) == "SI")) {
                alert("Invalid Voucher No");
                return;
            }

            if (!vchrno) { return; }
            this.ProdListFillerFromDispatch({ VCHRNO: vchrno, DIVISION: this.AppSettings.DefaultDivision, PHISCALID: null })
            return;
        }
        var selectedRow: TrnMain;
        // if(this._transactionService.PMode=="c"){
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            this.argument = { TRANSACTION: 'CREDITNOTE', PARAC: this.TrnMainObj.PARAC, DIVISION: this.TrnMainObj.DIVISION, DELEVERYLIST: 'IN', SALESMODE: this._transactionService.salesMode, WARRENTYTODATE: this._transactionService.warrentyUpToDate };
        }
        // }
        this.dispatchDialogInitizeElem();
        let dialogRef = this.dialog.open(DispatchDialog, { hasBackdrop: true, data: this.argument });
        dialogRef.afterClosed().subscribe(result => {

            if (result !== undefined) {
                if (result.status == 'ok') {
                    selectedRow = result.selectedRow;
                    this.dispatchNo = selectedRow.VCHRNO;
                    this.TrnMainForm.patchValue({
                        TRNMODE: selectedRow.TRNMODE,
                        PARAC: selectedRow.PARAC,
                        TRNAC: result.selectedRow.TRNAC,
                        BILLTOTEL: result.selectedRow.BILLTOTEL
                    });
                    this.ProdListFillerFromDispatch(result.selectedRow);
                }
            }
            dialogRef = null;
        });
    }
    radioTrnModeChange(value) {
        if (value == null) return;
        if (value.toString() == "cash") {
            this.accountListSubject.next(this.CashList);

        }
        else if (value.toString() == "credit") {

            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                this.accountListSubject.next(this.SupplierList);
            }
            else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                this.accountListSubject.next(this.CustomerList);
            }

        }
        //else if (value.toString() == "bank") { this.accountListSubject.next(this.BankList) }
        this.TrnMainObj.TRNMODE = this.TrnMainForm.get('TRNMODE').value;
    }
    dispatchDialogInitizeElem() {

        this._transactionService.prodListMode = null;
        //   this.TrnMainObj.ProdList = [];
        //this.TrnMainForm.get('WAREHOUSE').enable();
        // this.TrnMainForm.patchValue({ WAREHOUSE: null });
        //  this._transactionService.Warehouse=null;
        this.dispatchNo = "OrderRef";
        //  this._transactionService.ReCalculateBill(this.TrnMainObj, this.ServiceTaxRate, this.VatRate);
    }


    TrnProdObj: TrnProd;
    ProdListFillerFromDispatch(selectedRow) {
        // this.TrnMainObj.ProdList = [];
        let response: Array<any> = [];
        if (this._transactionService.salesMode == 'counter' || this._transactionService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            this.masterService.getList({ VCHRNO: selectedRow.VCHRNO, DIVISION: selectedRow.DIVISION, PHISCALID: selectedRow.PhiscalID, VOUCHERTYPE: this.TrnMainObj.VoucherType }, "/getTrnMain")
                .subscribe(res => {
                    var retmain: TrnMain = res.result;
                    this.TrnMainObj.TRNMODE = retmain.TRNMODE;
                    this.TrnMainObj.TRNAC = retmain.TRNAC;
                    this.TrnMainObj.REMARKS = retmain.REMARKS;
                    this.TrnMainObj.BILLTO = retmain.BILLTO;
                    this.TrnMainObj.BILLTOADD = retmain.BILLTOADD;
                    this.TrnMainObj.BILLTOTEL = retmain.BILLTOTEL;
                    this.TrnMainObj.BILLTOMOB = retmain.BILLTOMOB;
                    this.TrnMainForm.patchValue({
                        TRNMODE: retmain.TRNMODE,
                        TRNAC: retmain.TRNAC,
                        BILLTO: retmain.BILLTO,
                        BILLTOTEL: retmain.BILLTOTEL,
                        BILLTOADD: retmain.BILLTOADD,
                        BILLTOMOB: retmain.BILLTOMOB,
                        REMARKS: retmain.REMARKS
                    })
                }, error => {
                    var msg = this.masterService.resolveError(error.json(), 'trnmain-not-item-prodlistfiller');
                    alert(msg);
                }
                )
        }
        this.masterService.getList({ VCHRNO: selectedRow.VCHRNO, DIVISION: selectedRow.DIVISION, PHISCALID: selectedRow.PhiscalID, VOUCHERTYPE: this.TrnMainObj.VoucherType }, "/getDeliveryProdList")
            .subscribe(res => {
                response = res.result;
                this._transactionService.cnReturnedProdList = res.result;
                if (response && response.length > 0) {

                    for (let p of response) {
                        this.TrnMainForm.patchValue({ WAREHOUSE: p.WAREHOUSE });
                        this.TrnMainObj.MWAREHOUSE = p.WAREHOUSE;
                        this._transactionService.Warehouse = p.WAREHOUSE;
                        this.tempWarehouse = p.WAREHOUSE;
                        this.TrnProdObj = p;
                        this.TrnProdObj = this._transactionService.CalculateNormal(this.TrnProdObj, this.ServiceTaxRate, this.VatRate);

                        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                            this.TrnProdObj.RealQty = p.REALQTY_IN;
                            this.TrnProdObj.AltQty = p.ALTQTY_IN;
                            this.TrnProdObj.REALQTY_IN = 0;
                            this.TrnProdObj.ALTQTY_IN = 0;
                        }
                        else {
                            this.TrnProdObj.REALQTY_IN = p.RealQty;
                            this.TrnProdObj.ALTQTY_IN = p.AltQty;
                            this.TrnProdObj.RealQty = 0;
                            this.TrnProdObj.AltQty = 0;
                        }

                        this.TrnMainObj.ProdList.push(this.TrnProdObj);

                    }
                    if (this._transactionService.salesMode == 'delivery') {
                        if (this.TrnMainObj.MWAREHOUSE == null || this.TrnMainObj.MWAREHOUSE == "") {
                            //rear case
                            alert("Empty Warehouse");
                            this.dispatchNo = 'OrderRef';
                            this.TrnMainObj.ProdList = [];
                        }
                        else {
                            this.TrnMainForm.get('WAREHOUSE').disable();
                            this._transactionService.Warehouse = this.tempWarehouse;
                            this._transactionService.prodListMode = { mode: "fromDispatch", selectedRow: selectedRow };
                            this._transactionService.ReCalculateBill();
                        }
                    }
                    else {
                        this.TrnMainForm.get('WAREHOUSE').disabled;
                        this._transactionService.Warehouse = this.AppSettings.DefaultWarehouse;
                        this._transactionService.prodListMode = { mode: "fromCounter", selectedRow: selectedRow };
                        this._transactionService.ReCalculateBill();
                    }

                }

            }, error => {
                this.masterService.resolveError(error, "dispatchDialog - getDeliveryProdList");
            });

    }

    resetForm() {
        this._transactionService.resetData();
        this.TrnMainForm.patchValue({
            TRNAC: '',
            PARAC: '',
            BILLTO: '',
            REMARKS: '',
            referenceNo: ''
        })
    }
    accountChange() {

        let selectedparty = <TAcList>{};
        this.TrnMainObj.PARAC = this.TrnMainObj.TRNAC = this.TrnMainForm.get('TRNAC').value;
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            selectedparty = this.SupplierList.filter(x => x.ACID == this.TrnMainObj.PARAC)[0];
        }
        else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            selectedparty = this.CustomerList.filter(x => x.ACID == this.TrnMainObj.PARAC)[0];
        }
        if (selectedparty) {
            this.TrnMainForm.patchValue({ BILLTO: selectedparty.ACNAME, BILLTOADD: selectedparty.ADDRESS, BILLTOMOB: selectedparty.PHONE, BILLTOTEL: selectedparty.VATNO });
            this.TrnMainObj.BILLTO = selectedparty.ACNAME;
            this.TrnMainObj.BILLTOADD = selectedparty.ADDRESS;
            this.TrnMainObj.BILLTOMOB = selectedparty.PHONE;
            this.TrnMainObj.BILLTOTEL = selectedparty.VATNO;
        }


    }
    CurrencyChange() {

        if (this.masterService.Currencies.length > 0) {
            var FC = this.masterService.Currencies.find(c => c.CURNAME == this.TrnMainObj.FCurrency);
            if (FC != null) {
                this.TrnMainObj.EXRATE = FC.EXRATE;
                this.TrnMainForm.patchValue({ EXRATE: FC.EXRATE });
            }
        }
        if (this.TrnMainObj.ProdList != null && this.TrnMainObj.ProdList.length > 0) {
            for (let p of this.TrnMainObj.ProdList) {
                this._transactionService.CalculateNormal(p, this.setting.appSetting.ServiceTaxRate, this.setting.appSetting.VATRate, 1);
            }
            this._transactionService.ReCalculateBill();
        }

    }
    getVoucherNoWiseData() {
        let refvoucher = this.TrnMainForm.get("referenceNo").value;
        if (refvoucher == null || refvoucher == "") { return; }
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
            if (refvoucher.substr(0, 2) != 'PI') {
                alert("Invalid Bill Number detected"); return;
            }
        }
        else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            if (refvoucher.substr(0, 2) != 'TI') {
                alert("Invalid Bill Number detected"); return;
            }
        }

        var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Checking Bill Number please wait... ");
        var message$: Observable<string> = messageSubject.asObservable();
        let childDialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
        this.masterService.masterPostmethod("/getDeliveryProdList", { VCHRNO: refvoucher, VOUCHERTYPE: this.TrnMainObj.VoucherType })
            .subscribe(res => {
                if (res.status == "ok") {
                    this._transactionService.returnVoucherMain = res.result2;
                    this._transactionService.cnReturnedProdList = res.result;
                    try {
                        this.TrnMainForm.patchValue({ TRNMODE: this._transactionService.returnVoucherMain.TRNMODE.toLowerCase() });
                        this.TrnMainObj.TRNMODE = this._transactionService.returnVoucherMain.TRNMODE.toLowerCase();
                        this.radioTrnModeChange(this.TrnMainObj.TRNMODE);
                        if (this.TrnMainObj.TRNMODE == "credit") {

                            this.TrnMainObj.TRNAC = this._transactionService.returnVoucherMain.TRNAC;
                        }
                    } catch (ex) { alert(ex);}
                    messageSubject.next("Successfull")
                    setTimeout(() => {
                        childDialogRef.close();
                    }, 1000)
                }
                else {

                    childDialogRef.close();

                    alert(res.result);
                }

            }, error => {

                childDialogRef.close();

                this.masterService.resolveError(error, "dispatchDialog - getDeliveryProdList");
            });

    }
}