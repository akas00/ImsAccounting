import { TrnMain, Warehouse } from './../../../../common/interfaces/TrnMain';
import { AuthService } from './../../../../common/services/permission/authService.service';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { IncomeVouchers } from "./../IncomeVoucher/IncomeVouchers";
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
import { ModalDirective } from 'ng2-bootstrap';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'consumptionEntry',
    templateUrl: './consumptionEntry.html',
    styleUrls: ["./../../../Style.css", "./../../../../common/Transaction Components/halfcolumn.css"]

})
export class consumptionEntryComponent {
    DialogMessage: string = "Saving";
    @ViewChild('childModal') childModal: ModalDirective;
    form: FormGroup;
    public wareHouseList: any[] = [];
    PTypeList: any[] = [];
    ConsumptionList: any[] = [];
    userProfile: any;
    dataList: any;
    TrnObj: any = <any>{};
    mode: string;
    MenuItemList: any[] = [];
    Initial: string = "";
    private return: string;
    constructor(private masterRepo: MasterRepo, private _activatedRoute: ActivatedRoute, private router: Router, private _fb: FormBuilder, private authService: AuthService) {
        
        this.masterRepo.getWarehouseList()
            .subscribe(data => {
                ////console.log("data", data)
                this.wareHouseList.push(<any>data);
            });
        this.masterRepo.getPTypeList().
            subscribe(data => {
                if (data != null) {
                    ////console.log("PTYPE", data)
                    this.PTypeList.push(<any>data);
                }
            });

        this.form = this._fb.group({
            VCHRNO: ['', Validators.required],
            TRNDATE: ['', Validators.required],
            BSDATE: ['', Validators.required],
            WAREHOUSE: ['', Validators.required],
            PTYPENAME: ['', Validators.required],
            Division: [''],
            TotalAmt: [''],
            // PhysicalStock:['']


        });
        if (!!this._activatedRoute.snapshot.params['returnUrl']) {
            this.return = this._activatedRoute.snapshot.params['returnUrl'];
        }
        this.userProfile = this.authService.getUserProfile();
        ////console.log("userP", this.userProfile.userDivision);
        if (!!this._activatedRoute.snapshot.params['initial']) {
            this.mode = 'edit';

            this.Initial = this._activatedRoute.snapshot.params['initial'];

            this.masterRepo.getConsumptionFromID(this.Initial).subscribe(data => {
                if (data) {
                    if (data.status == "ok") {
                        ////console.log("ConsumptionD@T@", data)
                        let wh: any;
                        this.dataList = data;
                        this.ConsumptionList = [];
                        for (let i of this.dataList.Result) {
                            let a: any = <any>{};
                            // a.Warehouse = i.Warehouse;
                            // wh = a.Warehouse;
                            a.Code = i.MCODE;
                            // a.Item = i.DESCA;
                            a.Unit = i.UNIT;
                            a.OPENINGQTY = i.OPENING;
                            a.StockIN = i.STOCKIN;
                            a.StockOUT = i.STOCKOUT;
                            a.Consumption = i.CONSUMPTION;
                            a.OtherConsumption = i.OTHERCONSUMPTION;
                            a.ReceipeConsumption = i.RECEIPECONSUMPTION;
                            a.Variance = i.KANDBWASTAGE;
                            a.PRATE_A = i.prate;
                            a.VarianceAmt = a.Variance * a.PRATE_A;
                            a.PhysicalStock = i.PHYSICALSTOCK;
                            a.Total = 0;
                            a.StockAdjustment = 0;
                            this.masterRepo.getProductItemList()
                                .subscribe(data => {
                                    var c = data.filter(a => a.MCODE == i.MCODE)[0];
                                    if (c != null) {
                                        a.Item = c.DESCA;
                                        this.form.patchValue({ PTYPENAME: c.PTYPE });
                                    }
                                });
                            a.STOCKCLOSINGDATE = i.TRNDATE.substring(0, 10);
                            this.ConsumptionList.push(a);

                        }
                        this.form.patchValue({
                            TRNDATE: this.dataList.TrnMain.TrnDATE.substring(0, 10),
                            BSDATE: this.dataList.TrnMain.BSDATE,
                            WAREHOUSE: this.dataList.TrnMain.Warehouse,
                        })


                    }
                    //}
                }
            })
        }
    }

    ngOnInit() {


    }

    onRunClick() {

        this.ConsumptionList = [];
        let a: any = <any>{}
        a.TRNDATE = this.form.value.TRNDATE;
        a.Warehouse = this.form.value.WAREHOUSE;
        a.PTYPENAME = this.form.value.PTYPENAME;
        a.Division = this.userProfile.userDivision;
        ////console.log("a", a)
        this.masterRepo.checkConsumptionDate(a).subscribe(data => {
            ////console.log("Ababab", data)
            let b = data.LastClosingDate;
            if (b >= this.form.value.TRNDATE || b == null) {
                this.masterRepo.getConsumptionList(a).subscribe(res => {
                    this.ConsumptionList = res;
                    ////console.log("resConsumption", this.ConsumptionList)
                })
            }
            else {
                this.DialogMessage = "your LastCountDate was '" + data.LastCountDate + "'. Please enter greater Date than this."
                this.childModal.show();
                setTimeout(() => {
                    this.childModal.hide();
                }, 1000)
            }

        });

    }
    onSave() {
        //validate before Saving
        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        // this.save();
    }
    hideChildModal() {
        this.childModal.hide();
    }

    removeRow(index) {
        // this.salesTerminal.product.splice(index, 1);
    }


    // save() {
    //     try {
    //         ////console.log("submit call");
    //         let schemeSetting = <Product>{}
    //         schemeSetting.DESCA = this.form.value.DESCA,
    //             schemeSetting.MCODE = this.form.value.MCODE,
    //             schemeSetting.SCHEME_A = this.form.value.SCHEMEA,
    //             schemeSetting.SCHEME_B = this.form.value.SCHEMEB,
    //             schemeSetting.SCHEME_C = this.form.value.SCHEMEC,
    //             schemeSetting.SCHEME_D = this.form.value.SCHEMED,
    //             schemeSetting.SCHEME_E = this.form.value.SCHEMEE,

    //             //console.log({ tosubmit: schemeSetting });

    //         let sub = this._schemeSettingService.saveSchemeSetting(this.mode, schemeSetting)
    //             .subscribe(data => {
    //                 if (data.status == 'ok') {
    //                     this.DialogMessage = "Data Saved Successfully"
    //                     setTimeout(() => {
    //                         this.childModal.hide();

    //                         this._router.navigate([this.returnUrl]);
    //                     }, 1000)


    //                 }
    //                 else {

    //                     if (data.result._body == "The ConnectionString property has not been initialized.") {
    //                         this._router.navigate(['/login', this._router.url])
    //                         return;
    //                     }

    //                     this.DialogMessage = "Error in Saving Data:" + data.result._body;
    //                     //console.log(data.result._body);
    //                     setTimeout(() => {
    //                         this.childModal.hide();
    //                     }, 3000)
    //                 }
    //             },
    //             error => { alert(error) }
    //             );
    //         this.subcriptions.push(sub);
    //     }
    //     catch (e) {
    //         alert(e);
    //     }
    // }
    entryObj: any = <any>{};
    changeEntryDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get("BSDATE").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRNDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
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
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRNDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    Consumption:any=<any>{};
    changePhysicalStock(value: number, index) {

        ////console.log("VALUECHNAGE", value)
        if (value != null) {
            this.ConsumptionList[index].PhysicalStock = value;
            this.ConsumptionList[index].Variance = value - this.ConsumptionList[index].Total;
            this.ConsumptionList[index].VarianceAmt = this.ConsumptionList[index].Variance * this.ConsumptionList[index].PRATE_A;
            this.ConsumptionList[index].VariancePercent =  this.ConsumptionList[index].Total/this.ConsumptionList[index].Variance ;
            // this.Consumption.ProdList=this.ConsumptionList[index].PhysicalStock
            // this.Consumption.PhysicalStock = 0;
            // this.Consumption.ProdList.forEach(x => { this.Consumption.TOTAMNT += x.PhysicalStock; });
            for (let i of this.ConsumptionList) {
                if (i.Variance > 0) {
                    // this.Consumption.ProdList=i.PhysicalStock
                    let b: any = <any>{}
                    b.Variance = i.Variance;
                    this.form.patchValue({ TotalAmt: b.Variance });
                    // this.Consumption.TOTAMNT = 0;
                    // this.Consumption.ProdList.forEach(x => { this.Consumption.TOTAMNT += x.PhysicalStock; });
                }
            }
            // this.saveList=true;
        }

    }

    onClickSave() {
        this.DialogMessage = "Saving.... Please Wait!"
        this.childModal.show();
        let a: any = <any>{}
        this.mode == 'edit' ? this.mode = 'edit' : this.mode = 'add'
        if (this.mode == 'edit') {
            a.VCHRNO = this.dataList.TrnMain.VCHRNO;
            a.EditUser = this.userProfile.username;
        }
        alert("Mode" + this.mode)
        a.CHALANNO = this.form.value.VCHRNO;
        a.TRNDATE = this.form.value.TRNDATE;
        a.BSDATE = this.form.value.BSDATE;
        a.WAREHOUSE = this.form.value.WAREHOUSE;
        a.PTYPE = this.form.value.PTYPENAME;
        a.Division = this.userProfile.userDivision;
        // a.Amount = this.form.value.TotalAmt;
        a.Amount = 0;
        a.Closing = -(this.form.value.TotalAmt)
        a.TRNUSER = this.userProfile.username;
        let saveList: any[] = [];
        for (let i of this.ConsumptionList) {
            if (i.Variance > 0) {
                let b: any = <any>{}
                b.Code = i.Code;
                b.Item = i.Item;
                b.Unit = i.Unit;
                b.OPENINGQTY = i.OPENINGQTY;
                b.StockIN = i.StockIN;
                b.StockOUT = i.StockOUT;
                b.Consumption = i.Consumption;
                b.OtherConsumption = i.OtherConsumption ? i.OtherConsumption : 0;
                b.StockAdjustment = i.StockAdjustment;
                b.ReceipeConsumption = i.ReceipeConsumption;
                b.Total = i.Total ? i.Total : 0;
                b.Variance = i.Variance;
                b.PRATE_A = i.PRATE_A;
                b.PhysicalStock = i.PhysicalStock;
                b.VarianceAmt = i.VarianceAmt
                b.STOCKCLOSINGDATE = i.STOCKCLOSINGDATE;
                b.Mcode = i.Code;

                saveList.push(<any>b);

            };
            ////console.log("CONSAVE", this.mode, saveList, a);


        }
        this.masterRepo.SaveConsumptionEntry(this.mode, saveList, a).subscribe(data => {
            if (data.status == 'ok') {
                setTimeout(() => {
                    this.childModal.hide();
                }, 1000)
                this.router.navigate([this.return]);
            }
            else {
                if (data.result._body == "The ConnectionString property has not been initialized.") {
                    this.router.navigate(['/login', this.router.url])

                }
            }

        });
    }

}