import { TransactionService } from './../../../../common/Transaction Components/transaction.service';
import { MenuItem } from './../../../../common/interfaces/ProductItem';
import { MessageDialog } from './../../../modaldialogs/messageDialog/messageDialog.component';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdDialog } from '@angular/material';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Component, ContentChildren, QueryList, Input, ViewChild } from '@angular/core';
// import { AdditionalCostService, prodCost } from "./addtionalCost.service";
import { IMPORT_DETAILS_PROD, TrnMain, VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from "@angular/forms";
import { TabsComponent } from './tabs';
import { TabComponent } from './tab';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { PREFIX } from '../../../../common/interfaces';
import { SettingService } from '../../../../common/services';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { AdditionalCostService, prodCost } from '../AdditionalCost/addtionalCost.service';
import _ from 'lodash';


@Component({
    selector: 'newadditional-cost',
    templateUrl: 'newmasterPageAdditional.component.html',
    styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
    providers: [AdditionalCostService]

})
// export class MasterNewAdditionalComponent {
//     modeTitle: string = 'Additional Cost';
//     TrnMainObj: TrnMain
//     form: FormGroup;
//     dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
//     dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
//     items: any[] = [];
//     activeItem: any;
//     activeIndexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0)
//     activeIndex$: Observable<number> = this.activeIndexSubject.asObservable();
//     additionalCost: any;
//     @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
//     gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();

//     voucherType: VoucherTypeEnum = VoucherTypeEnum.AdditionalCost;


//     constructor(public additionalcostService: NewAdditionalCostService, private fb: FormBuilder,
//         private masterService: MasterRepo, public dialog: MdDialog, public _trnMainService: TransactionService,
//         private setting: SettingService, private loadingService: SpinnerService, private alertService: AlertService, private route: ActivatedRoute) {
//         this.TrnMainObj = additionalcostService.TrnMainObj;
//         this._trnMainService.TrnMainObj.VoucherType = 66;
//         // this._trnMainService.pageHeading = "Additoinal Cost";
//         // this._trnMainService.TrnMainObj.VoucherPrefix = "AD";
//         // this.TrnMainObj.VoucherPrefix = "AD";
//         // this._trnMainService.initialFormLoad(66);


//         this.form = fb.group({
//             VCHRNO: ['', [Validators.required]],
//             DIVISION: ['', [Validators.required]],
//             // PIVchr:['',[Validators.required]],
//             TRNDATE: ['', [Validators.required]],
//             BSDATE: ['', [Validators.required]],
//             AdditionalPurchaseAc: [''],
//             CHALANNO: [''],
//         });
//         this.additionalCost = 99;

//     }
//     menuItems: MenuItem[];
//     ngOnInit() {
//         this.route.queryParams.subscribe(params => {
//             if (params['mode'] == "DRILL") {
//                 let VCHR = params['voucher']
//                 let vparams = []
//                 vparams = VCHR.split('-');
//                 let data = {
//                     VCHRNO: VCHR,
//                     DIVISION: vparams[1]
//                 }
//                 this.loadingService.show("Loading Invoice")
//                 this.additionalcostService.loadAdditionalCost(data);
//                 this.additionalcostService.ObservableReturnData.subscribe((x: any) => {
//                     this._trnMainService.TrnMainObj = this.masterService.loadedTrnmain;
//                     this._trnMainService.TrnMainObj.Mode = "VIEW";

//                     //Dbl check if trnmain vchrno missing -- sometimes date will not show on Edit or View
//                     this.loadVoucher(x.TrnMainObj);
//                 })
//                 // this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
//                 //   if (res.status == "ok") {
//                 //     this.loadingService.hide()
//                 //     this._trnMainService.TrnMainObj = res.result;
//                 //     this._trnMainService.TrnMainObj.VoucherType = 3;
//                 //     this._trnMainService.pageHeading = "Additional Cost";
//                 //     this._trnMainService.TrnMainObj.VoucherPrefix = "AD";
//                 //     this._trnMainService.TrnMainObj.Mode = "VIEW";
//                 //   }
//                 // }, err => {
//                 //   this.loadingService.hide()
//                 //   this.alertService.error(err)
//                 // })

//             } else if (params['mode'] == "fromLatepost") {
//                 // alert("params['mode']==additional cost")
//                 this.loadingService.show("Loading Invoice")
//                 let data = {
//                     VCHRNO: params.voucher,
//                     DIVISION: params.DIVISION,
//                     PHISCALID: params.PHISCALID
//                 }
//                 this.additionalcostService.loadAdditionalCost(data);
//                 this.additionalcostService.ObservableReturnData.subscribe((x: any) => {
//                     this._trnMainService.TrnMainObj = this.masterService.loadedTrnmain;
//                     this._trnMainService.TrnMainObj.Mode = "VIEW";

//                     //Dbl check if trnmain vchrno missing -- sometimes date will not show on Edit or View
//                     this.loadVoucher(x.TrnMainObj);
//                 })

//             }

//             else {
//                 this.items = [
//                     {
//                         // label: 'Purchase details', icon: 'fa-bar-chart', id: 'purchasedetail', command: (event) => { this.activeItem = event.item }
//                     },
//                     { label: 'Additional Cost Details', icon: 'fa-support', id: 'addcost', command: (event) => { this.activeItem = event.item } },
//                     { label: 'Costing Detail', icon: 'fa-book', id: 'detailcosting', command: (event) => { this.activeItem = event.item } },
//                 ];
//                 this.activeItem = this.items[0];
//                 // ////console.log("ROUTERERERERER", this.activeItem)
//                 this.menuItems = [
//                     // { label: 'Purchase Details', menuName: 'purchasedetail', icon: 'fa-bar-chart' },
//                     { label: 'Additional Cost Details', menuName: 'adddetail' },
//                     { label: 'Costing Detail', menuName: 'costingdetail' }
//                 ];
//                 this.masterService.ShowMore = true;
//                 this.masterService.focusAnyControl("REFPINO_AD");
//                 this.additionalcostService.IMPORTDETAILS.prodList = [];
//             }
//         });

//     }
//     ngAfterViewInit() {
//         this.addRow();
//     }

//     loadVoucher(selectedItem) {
//         this._trnMainService.loadData(
//             selectedItem.VCHRNO,
//             selectedItem.DIVISION,
//             selectedItem.PhiscalID
//         );

//         this._trnMainService.showPerformaApproveReject = false;
//         if (this._trnMainService.TrnMainObj.gstInfoOfAccount == null) {
//             this._trnMainService.TrnMainObj.gstInfoOfAccount = <any>{}
//         }
//         this._trnMainService.TrnMainObj.gstInfoOfAccount.TRNTYPE = selectedItem.PSTYPE
//         // this.vouchernois = selectedItem.VCHRNO;
//         // this.division = selectedItem.DIVISION;
//         // this.phiscalid = selectedItem.PhiscalID;

//     }
//     addRow() {
//         try {

//             let newRow = <IMPORT_DETAILS_PROD>{};
//             newRow.ITEMNAME = '';
//             newRow.NETAMOUNT = 0;
//             newRow.NONTAXABLE = 0;
//             newRow.QUANTITY = 0;
//             newRow.TAXABLE = 0;
//             newRow.VAT = 0;
//             //console.log("add row",newRow);

//             this.additionalcostService.IMPORTDETAILS.prodList && this.additionalcostService.IMPORTDETAILS.prodList.push(newRow);
//         } catch (ex) {
//             //console.log(ex);
//             alert(ex);
//         }
//     }
// }
export class MasterNewAdditionalComponent {
    modeTitle: string = 'Additional Cost';
    TrnMainObj: TrnMain
    form: FormGroup;
    dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
    items: any[] = [];
    activeItem: any;
    activeIndexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0)
    activeIndex$: Observable<number> = this.activeIndexSubject.asObservable();
    additionalCost: any;
    @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
    gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();

    voucherType: VoucherTypeEnum = VoucherTypeEnum.AdditionalCost;


    constructor(public additionalcostService: AdditionalCostService, private fb: FormBuilder,
        private masterService: MasterRepo, public dialog: MdDialog, public _trnMainService: TransactionService,
        private setting: SettingService, private loadingService: SpinnerService, private alertService: AlertService, private route: ActivatedRoute) {
        this.TrnMainObj = additionalcostService.TrnMainObj;
        this._trnMainService.TrnMainObj.VoucherType = 66;
        // this._trnMainService.pageHeading = "Additoinal Cost";
        // this._trnMainService.TrnMainObj.VoucherPrefix = "AD";
        // this.TrnMainObj.VoucherPrefix = "AD";
        // this._trnMainService.initialFormLoad(66);


        this.form = fb.group({
            VCHRNO: ['', [Validators.required]],
            DIVISION: ['', [Validators.required]],
            // PIVchr:['',[Validators.required]],
            TRNDATE: ['', [Validators.required]],
            BSDATE: ['', [Validators.required]],
            AdditionalPurchaseAc: [''],
            CHALANNO: [''],
            INDDATA:['']
        });
        this.additionalCost = 99;

    }
    menuItems: MenuItem[];
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['mode'] == "DRILL") {
                let VCHR = params['voucher']
                let vparams = []
                vparams = VCHR.split('-');
                let data = {
                    VCHRNO: VCHR,
                    DIVISION: vparams[1]
                }
                this.loadingService.show("Loading Invoice")
                this.additionalcostService.loadAdditionalCost(data);
                this.additionalcostService.ObservableReturnData.subscribe((x: any) => {
                    this._trnMainService.TrnMainObj = this.masterService.loadedTrnmain;
                    this._trnMainService.TrnMainObj.Mode = "VIEW";

                    //Dbl check if trnmain vchrno missing -- sometimes date will not show on Edit or View
                    this.loadVoucher(x.TrnMainObj);
                })
                // this.masterService.LoadTransaction(VCHR, vparams[1], vparams[2]).subscribe((res) => {
                //   if (res.status == "ok") {
                //     this.loadingService.hide()
                //     this._trnMainService.TrnMainObj = res.result;
                //     this._trnMainService.TrnMainObj.VoucherType = 3;
                //     this._trnMainService.pageHeading = "Additional Cost";
                //     this._trnMainService.TrnMainObj.VoucherPrefix = "AD";
                //     this._trnMainService.TrnMainObj.Mode = "VIEW";
                //   }
                // }, err => {
                //   this.loadingService.hide()
                //   this.alertService.error(err)
                // })

            } else if (params['mode'] == "fromLatepost") {
                // alert("params['mode']==additional cost")
                this.loadingService.show("Loading Invoice")
                let data = {
                    VCHRNO: params.voucher,
                    DIVISION: params.DIVISION,
                    PHISCALID: params.PHISCALID
                }
                this.additionalcostService.loadAdditionalCost(data);
                this.additionalcostService.ObservableReturnData.subscribe((x: any) => {
                    this._trnMainService.TrnMainObj = this.masterService.loadedTrnmain;
                    this._trnMainService.TrnMainObj.Mode = "VIEW";

                    //Dbl check if trnmain vchrno missing -- sometimes date will not show on Edit or View
                    this.loadVoucher(x.TrnMainObj);
                })

            }

            else {
                this.items = [
                    {
                        // label: 'Purchase details', icon: 'fa-bar-chart', id: 'purchasedetail', command: (event) => { this.activeItem = event.item }
                    },
                    { label: 'Additional Cost Details', icon: 'fa-support', id: 'addcost', command: (event) => { this.activeItem = event.item } },
                    { label: 'Costing Detail', icon: 'fa-book', id: 'detailcosting', command: (event) => { this.activeItem = event.item } },
                ];
                this.activeItem = this.items[0];
                // ////console.log("ROUTERERERERER", this.activeItem)
                this.menuItems = [
                    // { label: 'Purchase Details', menuName: 'purchasedetail', icon: 'fa-bar-chart' },
                    { label: 'Additional Cost Details', menuName: 'adddetail' },
                    { label: 'Costing Detail', menuName: 'costingdetail' }
                ];
                this.masterService.ShowMore = true;
                this.masterService.focusAnyControl("REFPINO_AD");
                this.additionalcostService.IMPORTDETAILS.prodList = [];
            }
        });

    }
    ngAfterViewInit() {
        this.addRow();
    }

    public loadPi(Vchrno: string, Division: string) {
        this.additionalcostService.loadPurchase(Vchrno, Division, null)
    }

    onSave() {
        //alert("MasterSave!!!");
        this.dialogMessageSubject.next("Saving Data please wait...!");
        var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
        try {
            this.additionalcostService.saveAdditionalCost();

        }
        catch (ex) {
            this.dialogMessageSubject.next(ex)
            setTimeout(function () {

                dialogRef.close();
            }, 3000);
            //  alert(ex);
            //  //console.log(ex);
        }
    }
    cancel() {

    }
    costingDetailClickEvent() {
        this.additionalcostService.generateCostDetails();
    }
    getAdditionalCost(value) { //new Ref PI load garda
        this.loadingService.show("please wait. Getting purchase invoice data..")
        //  this.additionalCostService.loadPurchase(value,this.form.value.DIVISION.INITIAL,this.phiscalid)
        let VCHR = value.VCHRNO
        let division = value.DIVISION;
        let phiscalid = this.masterService.PhiscalObj.PhiscalID;
        // console.log("vchr,Div,Phis", VCHR, division, phiscalid,this.masterService.PhiscalObj.phiscalID,this.masterService.userProfile);

        // this._trnMainService.trnmainBehavior= new BehaviorSubject(<TrnMain>{});
        //   this._trnMainService.loadData(VCHR, division, phiscalid);
        this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(data => {
            if (data) {
                try {
                    ////console.log("additionalCostDataLoaded",data.result)

                    this.EmptyAddCost();
                    //console.log("@@data.result.ProdList",data.result.ProdList)
                    var result = data.result.ProdList.filter((elem1, i) => data.result.ProdList.some((elem2, j) => (elem2.MCODE === elem1.MCODE)
                        && (elem2.BATCHID == elem1.BATCHID) && j !== i));
                    //console.log("@@PI__result:", result);

                    let acs1: prodCost = <prodCost>{
                        mcode: "", menucode: "", desca: "", unit: "",
                        quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: "", sno:0
                    }
                    if (result.length > 0) {
                        result.forEach(element => {
                            acs1.mcode = element.MCODE,
                                acs1.menucode = element.MENUCODE,
                                acs1.desca = element.ITEMDESC,
                                acs1.unit = element.UNIT,
                                acs1.batch = element.BATCH,
                                acs1.rate = element.CRATE?Number(element.CRATE).toFixed(12):Number(element.RATE).toFixed(12),
                                acs1.quantity = element.REALQTY_IN + acs1.quantity,
                                acs1.amount = element.AMOUNT + acs1.amount,
                                acs1.nAmount = element.NETAMOUNT + acs1.nAmount,
                                acs1.batchid = element.BATCHID,
                                acs1.sno = element.SNO
                        });
                        this.additionalcostService.addtionalCostList.push(acs1);

                        var result2 = data.result.ProdList.filter((elem1, i) => result.some((elem2, j) => (elem2.MCODE != elem1.MCODE || elem2.BATCHID != elem1.BATCHID) && j !== i));
                        if (result2.length > 0) {
                            //console.log("@@mcodediff_ac2",result2)
                            for (let i of result2) {
                                var acs: prodCost = <prodCost>{
                                    mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
                                    quantity: i.REALQTY_IN,
                                    rate: i.CRATE?Number(i.CRATE).toFixed(12):Number(i.RATE).toFixed(12) ,
                                    amount:  i.AMOUNT,
                                    nAmount: i.NETAMOUNT, batch: i.BATCH, batchid: i.BATCHID, sno: i.SNO
                                };
                                this.additionalcostService.addtionalCostList.push(acs);
                            }
                        }
                    }

                    if (this.additionalcostService.addtionalCostList.length == 0) {  //new Ref PI load garda
                        // console.log("@@ac2",data.result.ProdList)
                        for (let i of data.result.ProdList) {
                            var acs: prodCost = <prodCost>{
                                mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
                                quantity: i.REALQTY_IN,
                                rate: i.CRATE?Number(i.CRATE).toFixed(12):Number(i.RATE).toFixed(12),
                                // amount:  i.AMOUNT,                              
                      amount: i.CRATE ? i.CRATE * i.REALQTY_IN : i.AMOUNT,
                                nAmount: i.NETAMOUNT, batch: i.BATCH, batchid: i.BATCHID, sno: i.SNO
                            };
                            this.additionalcostService.addtionalCostList.push(acs);
                        }
                    }

                    let sortedArray = _.sortBy(this.additionalcostService.addtionalCostList, 'sno');
                    if (sortedArray) {
                        this.additionalcostService.addtionalCostList = sortedArray;
                    }

                    if(this.additionalcostService.IndividualCostList.length==0){
                        // this.additionalcostService.IndividualCostList=this.additionalcostService.addtionalCostList;
                        // this.additionalcostService.IndividualCostList.forEach(x=>x.indamount=x.amount);
                        // this.masterService.TOTALINDAMOUNT =0;
                        // this.additionalcostService.IndividualCostList.forEach(x => this.masterService.TOTALINDAMOUNT += x.indamount);
                    }
                    this.masterService.batch = data.result.ProdList && data.result.ProdList.length > 0 && data.result.ProdList[0].BATCH;
                    //total amount
                    this.additionalcostService.loadedTrnmain = data.result;
                    // console.log("additionalCstService", this.additionalcostService.loadedTrnmain)
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


    calculatecosting() {
        this.additionalcostService.generateCostDetails();

    }
    TabRefBill() {
        //    this.genericGridRefBill.show();
        // this.gridACListPartyPopupSettings = {
        //     title: "Accounts",
        //     apiEndpoints: `/getAccountPagedListByMapId/Master/${'SinglePayment_Party'}/`,
        //     defaultFilterIndex: 1,
        //     columns: [
        //       {
        //         key: "ACCODE",
        //         title: "AC CODE",
        //         hidden: false,
        //         noSearch: false
        //       },
        //       {
        //         key: "ACNAME",
        //         title: "A/C NAME",
        //         hidden: false,
        //         noSearch: false
        //       }
        //     ]
        //   };
        //console.log("@@PURCHASE_TYPE",this.masterService.RefObj.PURCHASE_TYPE,this._trnMainService.userSetting.ENABLELOCALPURCHASE)
        if (this._trnMainService.userSetting.ENABLELOCALPURCHASE == 0) {
            this.masterService.RefObj.PURCHASE_TYPE = 'ALL';
        } else {
            if (this._trnMainService.userSetting.ENABLELOCALPURCHASE == 1 && !this.masterService.RefObj.PURCHASE_TYPE) {
                this.masterService.RefObj.PURCHASE_TYPE = 'ALL';
            }
        }
        this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettingsForAdditionalCost("AdditionalCost", this.masterService.RefObj.PURCHASE_TYPE);
        this.genericGridRefBill.show();
    }
    prefix: PREFIX = <PREFIX>{};
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

    onRefBillSelected(value) {
        // alert("reached")
        this.masterService.AdditionalPurchaseAcObj = '';
        this.masterService.AdditionalPurchaseCreditAcObj = '';
        this.masterService.mcode = '';
        this.masterService.desca = '';
        this.masterService.batch = '';
        this.masterService.batchid = '';
        this.additionalcostService.GRPcostList=[];
        this.additionalcostService.INDcostList=[];
        this.additionalcostService.costList=[];

        this.masterService.RefObj.Refno = value.VCHRNO;
        this.masterService.RefObj.disable = true;
        this._trnMainService.TrnMainObj.REFBILL = value.VCHRNO;
        this.masterService.RefObj.InvoiceNo = value.REFBILL;
        this.masterService.RefObj.SupplierName = value.ACNAME;
        this._trnMainService.TrnMainObj.PARAC = value.PARAC;
        this.getAdditionalCost(value)
        this.masterService.focusAnyControl("_AdditioanlCostRate" + 0)
        if(this.masterService.RefObj.PURCHASE_TYPE=="LOCALPURCHASE"){
            this.masterService.PIVoucherDetail(value.VCHRNO).subscribe(res => {
                if (res.status == "ok") {
                    if (res.result && res.result.length && res.result.length > 0) {
                        this.masterService.pi_costdetaillist=res.result.filter(x=>x.VCHRNO==value.VCHRNO);
                        this.masterService.showLoadAllocationbutton=true;
                        this.masterService.showCostPopup=true;
                    }else{
                        this.masterService.showLoadAllocationbutton=false;
                        this.masterService.showCostPopup=false;
                    }
                }
            }, err => {
            })
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
        // this.vouchernois = selectedItem.VCHRNO;
        // this.division = selectedItem.DIVISION;
        // this.phiscalid = selectedItem.PhiscalID;

    }
    ImportDetailsClick() {

    }
    addRow() {
        try {

            let newRow = <IMPORT_DETAILS_PROD>{};
            newRow.ITEMNAME = '';
            newRow.NETAMOUNT = 0;
            newRow.NONTAXABLE = 0;
            newRow.QUANTITY = 0;
            newRow.TAXABLE = 0;
            newRow.VAT = 0;
            //console.log("add row",newRow);

            this.additionalcostService.IMPORTDETAILS.prodList && this.additionalcostService.IMPORTDETAILS.prodList.push(newRow);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    
    keyPress(event: any) {
        if(event.key!="Enter" && event.key!="Tab"){
            event.preventDefault();
        }
    }

    EmptyAddCost() {
        this.additionalcostService.costList = [];
        this.additionalcostService.costdetail = [];
        this.additionalcostService.addtionalCostList = [];
        this.additionalcostService.IndividualCostList = [];
        this.additionalcostService.addCostTotAmount = 0;
        this.additionalcostService.GRPcostList = [];
        this.additionalcostService.INDcostList = [];
        this.additionalcostService.addINDCostTotAmount = 0;
        this.additionalcostService.addGRPCostTotAmount = 0;

        this.masterService.AdditionalAMOUNT = "";
        this.masterService.AdditionalPurchaseAcObj = '';
        this.masterService.AdditionalPurchaseCreditAcObj = '';
        this.masterService.AdditionalREMARKS = "";
        this.masterService.AdditionalDesc = "";
        this.masterService.AdditionalVAT = 0;
        this.masterService.TDSAmount = 0;
        this.masterService.TDSAccount_ACID = "";
        this.masterService.TDSAccount_Name = "";
        if (this.masterService.RefObj.PURCHASE_TYPE == 'LOCALPURCHASE') {
            this.masterService.DoAccountPosting = 0;
            this.masterService.IsTaxableBill = 0;
        } else {
            this.masterService.DoAccountPosting = 1;
            this.masterService.IsTaxableBill = 1;
        }
        this.masterService.RefObj.Ref_BILLNO = "";
        this.masterService.RefObj.Ref_TRNDATE = "";
        this.masterService.RefObj.Ref_BSDATE = "";
        this.masterService.RefObj.Ref_SupplierACID = "";
        this.masterService.RefObj.Ref_SupplierName = "";
        this.masterService.RefObj.Ref_SupplierVAT = "";
        this.masterService.showIndividualAmountPopup = false;
        this.additionalcostService.tempIndCostList = [];
        this.masterService.TOTALINDAMOUNT = 0;
        this.masterService.IS_ECA_ITEM = 0;

        this.masterService.AdditionalAMOUNT_2 = "";
        this.masterService.AdditionalPurchaseAcObj_2 = '';
        this.masterService.AdditionalPurchaseCreditAcObj_2 = '';
        this.masterService.AdditionalREMARKS_2 = "";
        this.masterService.AdditionalDesc_2 = "";
        this.masterService.AdditionalVAT_2 = 0;
        this.masterService.TDSAmount_2 = 0;
        this.masterService.TDSAccount_ACID_2 = "";
        this.masterService.TDSAccount_Name_2 = "";
        this.masterService.DoAccountPosting_2 = 1;
        this.masterService.IsTaxableBill_2 = 1;
        this.masterService.RefObj.Ref_BILLNO_2 = "";
        this.masterService.RefObj.Ref_TRNDATE_2 = "";
        this.masterService.RefObj.Ref_BSDATE_2 = "";
        this.masterService.RefObj.Ref_SupplierACID_2 = "";
        this.masterService.RefObj.Ref_SupplierName_2 = "";
        this.masterService.RefObj.Ref_SupplierVAT_2 = "";
        this.masterService.IS_ECA_ITEM_2 = 0;



        this.masterService.TDS_SL_ACID = '';
        this.masterService.TDS_SL_ACNAME = '';
        this.masterService.DR_SL_ACID = '';
        this.masterService.DR_SL_ACNAME = '';
        this.masterService.CR_SL_ACID = '';
        this.masterService.CR_SL_ACNAME = '';
        this.masterService.DR_HASSUBLEDGER=0;
        this.masterService.CR_HASSUBLEDGER=0;
        this.masterService.TDS_HASSUBLEDGER=0;
        this.masterService.DR_SL_INDV_ACID='';
        this.masterService.DR_SL_INDV_ACNAME='';
        this.masterService.CR_SL_INDV_ACID='';
        this.masterService.CR_SL_INDV_ACNAME='';
        this.masterService.TDS_SL_INDV_ACID='';
        this.masterService.TDS_SL_INDV_ACNAME='';
        this.masterService.DR_INDV_HASSUBLEDGER=0;
        this.masterService.CR_INDV_HASSUBLEDGER=0;
        this.masterService.TDS_INDV_HASSUBLEDGER=0;
    }

    changePurchaseType(){
        this.EmptyAddCost();
        this.masterService.mcode = '';
        this.masterService.desca = '';
        this.masterService.batch = '';
        this.masterService.batchid = '';
        this.masterService.RefObj.Refno='';
        this._trnMainService.TrnMainObj.REFBILL='';
        this.masterService.RefObj.InvoiceNo='';
        this.masterService.RefObj.SupplierName='';
        this._trnMainService.TrnMainObj.PARAC='';
        this.masterService.showLoadAllocationbutton=false;
        this.masterService.showCostPopup=false;
        this.masterService.pi_costdetaillist=[];
    }
}
