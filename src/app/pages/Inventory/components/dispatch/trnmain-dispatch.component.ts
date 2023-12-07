import { TAcList } from './../../../../common/interfaces';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { Router, ActivatedRoute } from "@angular/router";
import { Item } from './../../../../common/interfaces/ProductItem';
//import {TAcList} from './../../../../common/interfaces';
import { TrnMain, TrnProd, CostCenter } from './../../../../common/interfaces/TrnMain';
import { PurchaseInvoiceService } from './purchaseinvoices.service';
import { ProductInsertComponent } from './ProductInsert';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { IDivision, Warehouse } from './../../../../common/interfaces'
import { AppSettings } from './../../../../common/AppSettings';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { SettingService } from './../../../../common/services';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
    selector: "trnmain-dispatch-entry",
    styleUrls: ["../../../Style.css", "./_theming.scss"],
    templateUrl: "./trnmain-dispatch.component.html",
})

export class TrnMainDispatchComponent {
    TrnMainForm: FormGroup;
    PurchaseAcList: TAcList[] = [];
    AccountList: Observable<TAcList[]>;
    SupplierList: Observable<TAcList[]>;
    CashList: Observable<TAcList[]>;
    BankList: Observable<TAcList[]>;
    AppSettings;
    RETTO: string;
    TrnMainObj: TrnMain = <TrnMain>{};
    accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
    accountListObersver$: Observable<TAcList[]> = this.accountListSubject.asObservable();
    acList: TAcList[] = [];
    partyList: TAcList[] = [];

    constructor(public masterService: MasterRepo, private _trnMainService: TransactionService, private _fb: FormBuilder, private router: Router, private arouter: ActivatedRoute, private setting: SettingService) {
        this.AppSettings = this.setting.appSetting;
        this.TrnMainObj = _trnMainService.TrnMainObj;
    }

    ngOnInit() {
        this.masterService.getAccount('tnmain-dispatch').subscribe(res => {
            this.acList=res;
            this.partyList = this.acList.filter(ac => ac.ACID.substring(0,2) == 'PA');
            this.SupplierList=Observable.of(this.partyList);
            //console.log({partylist: this.partyList});
        });

        this.TrnMainForm = this._fb.group({
            BILLTO: ['', Validators.required],
            BILLTOADD: ['', Validators.required],
            COSTCENTER: ['', Validators.required],
            WAREHOUSE: [this.AppSettings.DefaultWarehouse, Validators.required],
            CHEQUENO: ['', Validators.required],
            CHEQUEDATE: ['', Validators.required],
            REMARKS: [''],
            TRNAC:['']
        });
        
        // this.masterService.getSupplierList().subscribe(res => { this.SupplierList =Observable.of(res); //console.log({supplierlist:res}); }, error => { this.masterService.resolveError(error,'trnmain-dispatch-suplierlist'); });
        this.masterService.getPurchaseAcList().subscribe(res => { this.PurchaseAcList.push(<TAcList>res); }, error => { this.masterService.resolveError(error,'trnmain-dispatch-purchaselist'); });
        this.masterService.refreshTransactionList();

        this.masterService.getCashList().subscribe(res => { this.CashList = Observable.of(res); }, error => { this.masterService.resolveError(error,'trnmain-purchase-cashlist'); });

        this.masterService.getBankList().subscribe(res => { this.BankList = Observable.of(res); }, error => { this.masterService.resolveError(error,'trnmain-purchase-banklist'); });


        if (this.TrnMainObj.Mode == "VIEW") {
            this.TrnMainForm.get('BILLTO').disable();
            this.TrnMainForm.get('BILLTOADD').disable();
            this.TrnMainForm.get('COSTCENTER').disable();
            this.TrnMainForm.get('WAREHOUSE').disable();
            this.TrnMainForm.get('REMARKS').disable();
            this.TrnMainForm.get('TRNAC').disable();
        }

        this.TrnMainForm.valueChanges.subscribe(form => {
            this.TrnMainObj.BILLTO = form.TRNAC.ACNAME;
            this.TrnMainObj.BILLTOADD = form.BILLTOADD;
            this.TrnMainObj.COSTCENTER = form.COSTCENTER;
            this.TrnMainObj.REMARKS = form.REMARKS;
            this._trnMainService.Warehouse = form.WAREHOUSE;
            this.TrnMainObj.TRNAC=form.TRNAC.ACID;
        });

        if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
            this._trnMainService.loadDataObservable.subscribe(data => {
                try {
                    var warehouse: string;
                    if (data.ProdList && data.ProdList.length>0 && data.ProdList[0] != null) {
                        warehouse = data.ProdList[0].WAREHOUSE;
                    } else {
                        warehouse = null;
                    }
                    var trnac = this.partyList.find(ac=>ac.ACID==data.TRNAC);
                    ////console.log({findTrnac:trnac,datatrnac:data.TRNAC});
                    // trnac=this.partyList.filter(ac=>ac.ACID.indexOf(data.TRNAC))[0];
                    // //console.log({filtertrnac:trnac});
                    this.TrnMainForm.patchValue({
                        COSTCENTER: data.COSTCENTER,
                        WAREHOUSE: warehouse,
                        BILLTO: data.BILLTO,
                        BILLTOADD: data.BILLTOADD,
                        REMARKS: data.REMARKS,
                        TRNAC:trnac
                    });
                    //console.log({ trnmain: data.ProdList });
                } catch (e) {
                    //console.log({ errorOnLoad: e });
                }
            });
        }

        this.undo();
    }


    
    undo() {
        this.TrnMainForm.patchValue({ TRNMODE: "credit" });
        this.AccountList = this.SupplierList;
        this.TrnMainObj.TRNMODE = "credit"

    }
    radioTrnModeChange(value) {
        if (value == null) return;
        if (value.toString() == "cash") { this.AccountList = this.CashList; }
        else if (value.toString() == "credit") { this.AccountList = this.SupplierList; }
        else if (value.toString() == "bank") { this.AccountList = this.BankList; }
        this.TrnMainObj.TRNMODE = this.TrnMainForm.get('TRNMODE').value;
    }

}
