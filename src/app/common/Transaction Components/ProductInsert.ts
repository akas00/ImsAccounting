

import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    HostListener,
    ElementRef,
    ChangeDetectorRef,
    AfterViewChecked,
    AfterContentChecked,
    Pipe
} from "@angular/core";
import {
    VoucherTypeEnum,
    TrnMain_AdditionalInfo
} from "./../interfaces/TrnMain";
import { TransactionService } from "./transaction.service";
import { Item, Product } from "./../interfaces/ProductItem";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { AppSettings } from "./../services";
import { SettingService } from "./../services";
import { Subscription } from "rxjs/Subscription";
import { MdDialog } from "@angular/material";
import { PoplistComponent } from "../popupLists/PopItemList/PopItems.component";
import { PopBatchComponent } from "../popupLists/PopBatchList/PopBatch.component";
import { AlertService } from "../services/alert/alert.service";
import { GenericPopUpSettings, GenericPopUpComponent } from '../popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute } from "@angular/router";
import {AuthService } from "../services/permission/authService.service";

import { Column } from "primeng/primeng";
// import { NewGenericPopUpSettings, NewGenericPopUpComponent } from "../popupLists/new-generic-grid/new-generic-popup-grid.component";
import { List } from "lodash";
// import { MultiplePricePopUpComponent } from "../popupLists/multiple-price-popup/multiple-price-popup-grid.component";
// import { NewGenericPopUpApprovedComponent } from "../popupLists/new-generic-grid-approved/new-generic-popup-grid-approved.component";
import { AddPurchaseInvoiceComponent } from "../../pages/Purchases/components/purchaseinvoice/AddPurchaseInvoice";
import { PriceCalculatorPopupComponent } from "./pricecalculator/price-calculatorpopup.component";
@Component({
    selector: "productentry",
    templateUrl: "./ProductInsert.html",
    styleUrls: ["../../pages/Style.css", "./halfcolumn.css"]
})
@Pipe({
    name: 'active',
    pure: true
})
export class ProductInsertComponent implements OnInit, AfterContentChecked {
    ngAfterContentChecked(): void {
        this.changeDetection.detectChanges();
    }
    viewFromNotification: boolean

    @Output() TotalBill = new EventEmitter();
    @ViewChild(PoplistComponent) itemListChild: PoplistComponent;
    @ViewChild(PopBatchComponent) batchlistChild: PopBatchComponent;
    @ViewChild("genericGridSupplierPopup") genericGridSupplierPopup: GenericPopUpComponent;



    ServiceTaxRate: number = 0;
    VatRate: number = 0;
    batchlist: any[] = [];
    orgType: any;

    tableValidation = false;
    ItemList: Item[] = [];

    subscriptions: Subscription[] = [];
    @Input("voucherType") voucherType: any;
    flatDiscountValue: number;
    radioFlatDiscount: string;
    public appType;

    AppSettings: AppSettings;
    showDiscount: boolean = true;
    SupplierList: any[] = [];
    activerowIndex: number = 0;
    previousOpeningStockData: any[] = [];
    WarehouseWiseCounterMProduct: any[] = [];
    showPricePopUP: boolean = false;
    TIBillRowsForFormatedPrint: number;

    stockList: any[] = [];
    ItemObj: any = <any>{};
    itemListSearch: string;
    AlternateUnits: any[] = [];
    schemeList: any[] = [];
    flatdiscountpercent: number;
    PCL: number;

    // @ViewChild("genericGrid") genericGrid: NewGenericPopUpComponent;
    // gridPopupSettings: NewGenericPopUpSettings = new NewGenericPopUpSettings();


    // @ViewChild("genericGridApproved") genericGridApproved: NewGenericPopUpApprovedComponent;
    // gridPopupApprovedSettings: NewGenericPopUpSettings = new NewGenericPopUpSettings();

    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
    showStockedQuantityOnly: number = 0;
    supFilter: string = "all";
    activeurlpath: string;
    approvalFlag: boolean = false;
    realQty: number = 0;
    realQtyin: number = 0;
    finalRes: any;
    unitForTable: any;
    alterRate: number[] = [];
    eachRate: number[] = [];
    showMultiplePricePopup: boolean;
    showMultilePriceAfterClickBatch: boolean;
    skuWiseTotalQty: number;
    totalQty: number = 0;
    skuWiseList: any;
    stockListForApproved: any[] = [];
    selectedProductInvoice: any;
    selectedIndex: any;
    colorLists: any[];
    productWiseBarCode: any[] = [];
    userSetting: any;

    // @ViewChild('focusBatch') focusBatch: ElementRef
    
    gridPopupSettingsForMultiplePrice: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("pricecalculator") pricecalculator: PriceCalculatorPopupComponent;

    constructor(
        private masterService: MasterRepo,
        public _trnMainService: TransactionService,
        private setting: SettingService,
        public dialog: MdDialog,
        public arouter: ActivatedRoute,
        private alertService: AlertService,
        private changeDetection: ChangeDetectorRef,
        private authservice: AuthService
    ) {
        this.PCL = this.masterService.PCL_VALUE;
        this.appType = this.masterService.appType;
        this.userSetting = this.authservice.getSetting();
        this.orgType = this._trnMainService.userProfile.CompanyInfo.ORG_TYPE;
        this.TIBillRowsForFormatedPrint = this._trnMainService.userSetting.TIBillRowsForFormatedPrint;
        if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.SalesReturn || this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.CreditNote){
            this.masterService.disableQuantityEdit = true;
        }
        else{
            this.masterService.disableQuantityEdit = false; 
        }
 
        this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = '';
        if (this._trnMainService.TrnMainObj.VoucherType != VoucherTypeEnum.Purchase) {
            this.masterService.disableQuantityEdit = false;
        }

        // if (this._trnMainService.TrnMainObj.VoucherType == 3 || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance) {
        //     this.getMultiplePriceForProduct();

        // }

        try {
            if (this._trnMainService.TrnMainObj.VoucherType == 57)
                // this._trnMainService.addRow();
                this.AppSettings = setting.appSetting;
            this.ServiceTaxRate = this.setting.appSetting.ServiceTaxRate;
            this.VatRate = this.setting.appSetting.VATRate;

            //Constructor ended
            if (

                this._trnMainService.TrnMainObj.VoucherType ==
                VoucherTypeEnum.StockIssue
            ) {
                this.showDiscount = false;
            }
            this.radioFlatDiscount == "percent";
            masterService.ShowMore = true;
        } catch (ex) {
            //console.log({ productinsertConstructorError: ex });
        }
        this.activeurlpath = arouter.snapshot.url[0].path;
        // this._trnMainService.TrnMainObj.ProdList.
        this.masterService.Account = '';



    }
    isNotificationView: boolean = true;
    NotificationView(isNot) {
        this.isNotificationView = isNot
    }

    ngAfterViewInit() { }

    // ngAfterContentInit(){}

    model1Closed() {
        this.masterService.PlistTitle = "";
    }
    ngOnInit() {
      
    }


    tabAcivateforQty = false;
    rowIndex: any;
    // AMOUNT:any;
    RowClick(index) {
        //////console.log("rowClick",index);
        this.activerowIndex = this.rowIndex = index;
        this.masterService.ShowMore = false;
        // if (!this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].inputMode
        //     && this._trnMainService.TrnMainObj.VoucherType != 57
        // ) {
        //     if (document.getElementById("remarks" + this.activerowIndex) != null) {
        //         document.getElementById("remarks" + this.activerowIndex).focus();
        //     }
        // }
    }

    /** -------------------- Tab Section ------------------ */

    ItemkeyEvent(index, event) {
        //  this.masterService.PlistTitle = "itemList";

        // if(!this._trnMainService.checkPurchaseVerification()){
        //     this.alertService.warning("Cannot do manual purchase. Please choose bill from Notification only");
        //     return;
        // }

        event.preventDefault();
        //  this._trnMainService.inputCode = true;
        this.activerowIndex = index;
        this.setItemPopupUrl();
        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
        //     this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
        //     this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Purchase ||
        //     ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE=='superdistributor' ||
        //     this._trnMainService.userProfile.CompanyInfo.ORG_TYPE=='distributor') && 
        //     this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice)) {
        //     let party = "";
        //     if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || 
        //         this._trnMainService.TrnMainObj.VoucherType==VoucherTypeEnum.Purchase ) {
        //         party = "Supplier";
        //     }
        //     else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder
        //         ||  this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        //         party = "Customer";
        //     }
        //     if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
        //         this.alertService.info("Please Choose " + party + " to proceed...");
        //         this.masterService.ShowMore = true;
        //         return false;
        //     }
        // }
        document.getElementById('menucode' + this.activerowIndex).blur();

        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            ////console.log("checkCC", this._trnMainService.TrnMainObj.PARAC, this._trnMainService.TrnMainObj, this._trnMainService.userProfile.CompanyInfo.NAME);
           if(this._trnMainService.isSelfBill == true){
               this.masterService.getOwnCustomerIDForSelfBill(this._trnMainService.userProfile.CompanyInfo.NAME).subscribe(x=>{
                   ////console.log("checkData",x);
               });
           }
           else{
            if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {

                this.alertService.info("Please Select The Customer First");
                return false;
            }
           }
            // this._trnMainService.TrnMainObj.PARAC = 'PANT0000047';

           

        }

        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Sales ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) { this.showStockedQuantityOnly = 1; }
        else { this.showStockedQuantityOnly = 0; }

        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        //     (
        //         this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE != 'fromOpeningStock'
        //     ) ||
        //     this.activeurlpath == 'add-creditnote-itembase-approval' ||
        //     this.activeurlpath == 'add-stock-issue-approval' ||
        //     ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
        //         this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockSample) && this.activeurlpath == 'add-stock-issue')
        // ) {
        //     if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == "") {
        //         this.alertService.info("Please Load the ref bill for return");
        //     }
        //     this.gridPopupSettings.apiEndpoints = `/getMenuitemFromProdForReturnPagedList`;

        // }
        // else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromOpeningStock') {
        //     this._trnMainService.TrnMainObj.REFBILL = 'DN';
        //     this.gridPopupSettings.apiEndpoints = `/getMenuitemFromProdForReturnPagedList`;
        // }
        // else {
        //     let prefix = "";

        //     if (this._trnMainService.TrnMainObj.VoucherPrefix != null) {
        //         prefix = this._trnMainService.TrnMainObj.VoucherPrefix;
        //     }
        //     let warehouse = this._trnMainService.userProfile.userWarehouse;
        //     if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
        //         warehouse = this._trnMainService.TrnMainObj.BILLTO;
        //     }
        //     ////console.log("CheckLog_of_isSelfbill", this._trnMainService.isSelfBill)
        //     if (this._trnMainService.isSelfBill == true) {
        //         if(this._trnMainService.TrnMainObj.MWAREHOUSE == 'Expired Stock Godown/Market'){
        //             warehouse = 'ExpireStock';
        //         }
        //         else if(this._trnMainService.TrnMainObj.MWAREHOUSE == 'Transit Shortage/Damage'){
        //             warehouse = 'ShortageDamage';
        //         } 
        //         else if(this._trnMainService.TrnMainObj.MWAREHOUSE == 'Custom/Lab Testing'){
        //             warehouse = 'CustomLab Testing';
        //         } 
        //         else {
        //             warehouse = this._trnMainService.TrnMainObj.MWAREHOUSE
        //         }
                
        //         this.gridPopupSettings.apiEndpoints = `/getUnsalableMenuitemList/${this.showStockedQuantityOnly}/${'all'}/${prefix}/${warehouse}`;
        //     }
        //     else if (this._trnMainService.isSelfBill == false) {
        //         this.gridPopupSettings.apiEndpoints = `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/${prefix}/${warehouse}`;
        //     }

        // }

        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'NewBill') {

        //     let prefix = "";
        //     if (this._trnMainService.TrnMainObj.VoucherPrefix != null) {
        //         prefix = this._trnMainService.TrnMainObj.VoucherPrefix;
        //     }
        //     let warehouse = this._trnMainService.userProfile.userWarehouse;
        //     this.gridPopupSettings.apiEndpoints = `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/PI/${warehouse}`;
        // }

        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
        //     this.gridPopupApprovedSettings = this.gridPopupSettings;
        //     this.genericGridApproved.show(this._trnMainService.TrnMainObj.REFBILL)
        // } else {
        //     this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL);
        // }
        // this.initScheme();
        return false;
    }
    /**Batch tab/Enter */
    BatchTabClick(index, event) {
        // if (event != null) {
        //     event.preventDefault();
        // }
        // this.showMultilePriceAfterClickBatch = true;

        // if (this._trnMainService.TrnMainObj.VoucherType == 3 || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance) {
        //     //    ////console.log("opening click",this.showPricePopUP);
        //     if (this.showPricePopUP != false) {
        //         this.genericGridMultiplePrice.show();
        //     }


        // }



        // // alert("reached")
        // this.activerowIndex = index;
        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance) {
        //     if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH == null) {
        //         return false;
        //     }
        //     this._trnMainService.checkDuplicateProductWithBatchCode(this.activerowIndex);
        //     //  this.masterService.batchValidation(this._trnMainService.TrnMainObj.ProdList[index].BATCH);
        //     this.masterService.masterGetmethod("/batch/getmfgdate?batchCode=" + this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH + "&&selfLife=" + this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SHELFLIFE).subscribe(res => {
        //         if (res.status == "ok") {
        //             this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MFGDATE = res.result.mfgdate;
        //             this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].EXPDATE = res.result.expdate;

        //             if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase && this._trnMainService.TrnMainObj.AdditionalObj.BILLUNITS == 'EACH') {
        //                 this.masterService.focusAnyControl("basequantity" + index);
        //             } else {
        //                 this.masterService.focusAnyControl("alternateqty" + index);
        //             }

        //         }
        //         else {
        //             this.alertService.error("Invalid BatchCode.Error Details: " + res.message);
        //         };
        //     }, error => {
        //         this.alertService.error("Invalid BatchCode.Error Details: " + error);
        //     }
        //     );
        // }

        // if (
        //     this._trnMainService.TrnMainObj.ProdList[index] == null ||
        //     this._trnMainService.TrnMainObj.ProdList[index].MCODE == null ||
        //     this._trnMainService.TrnMainObj.ProdList[index].MCODE == ""
        // ) {
        //     return false;
        // }
        // let warehouse = this._trnMainService.userProfile.userWarehouse;
        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
        //     warehouse = this._trnMainService.TrnMainObj.BILLTO;
        // }

        // if (this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'NewBill' && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {

        //     this.getBatchWiseDateForNoBill(index);

        // }

        // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance || this._trnMainService.prodListForUnfinedBill != false || (this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'NewBill' && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote)) { }
        // else {
        //     var bname = '';
        //     if (this._trnMainService.isSelfBill == true) {
        //         bname = 'getBatchListOfItemFromNonSaleable'
        //     } else {
        //         bname = 'getBatchListOfItem'
        //     }
        //     this.masterService
        //         .masterPostmethod("/" + bname, {
        //             mcode: this._trnMainService.TrnMainObj.ProdList[index].MCODE,
        //             onlynonexpireditem: this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ? 1 : 0,
        //             voucherprefix: this._trnMainService.TrnMainObj.VoucherPrefix,
        //             warehouse: warehouse
        //         })
        //         .subscribe(
        //             res => {
        //                 if (res.status == "ok") {
        //                     // ////console.log("Reus", res)
        //                     this.batchlist = JSON.parse(res.result);
        //                     if (this.batchlist.length == 1) {
        //                         // this.returnBatch(this.batchlist[0]);
        //                         // this.masterService.PlistTitle = "single";
        //                         this.masterService.PlistTitle = "batchList";
        //                     }
        //                     else if (this.batchlist.length == 0 && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE != 'NewBill') {
        //                         alert("Rate not Detected!")
        //                     }
        //                     else if (this.batchlist.length == 0 && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'NewBill') {

        //                         //   this.getBatchWiseDateForNoBill(index);
        //                         // this._trnMainService.getPricingOfItem(this.activerowIndex);
        //                     }

        //                     else {
        //                         this.masterService.PlistTitle = "batchList";
        //                     }
        //                     // this.assignedSchemeToBatch();
        //                     //  ////console.log("batchlist",this.batchlist);
        //                 } else {
        //                     ////console.log("error on getting BatchListOfItem " + res.result);
        //                 }
        //             },
        //             error => {
        //                 ////console.log("error on getting BatchListOfItem ", error);
        //             }
        //         );
        // }

        return false;
    }
    onKeydownOnBatch(event) {

        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance || this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'NewBill') {

        }
        else {
            if (event.key === "Enter" || event.key === "Tab") { }
            else {
                event.preventDefault();
            }
        }
    }
    assignedSchemeToBatch() {
        let scheme = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex]
            .ALLSCHEME;
        if (scheme != null) {
            if (scheme.batches == null || scheme.batches == "") {
                this.batchlist.forEach(b => {
                    b.SCHEME = scheme;
                    b.SCHEMERATE = scheme.schemeDisRate;
                    b.SCHEMENAME = scheme.schemeName;
                    b.SchemeRateType = scheme.discountRateType;
                });
            } else {
                var batches = scheme.batches.toString().split(",");
                this.batchlist.forEach(b => {
                    if (batches.find(x => x == b.BATCH) != null) {
                        b.SCHEME = scheme;
                        b.SCHEMERATE = scheme.schemeDisRate;
                        b.SCHEMENAME = scheme.schemeName;
                        b.SchemeRateType = scheme.discountRateType;
                    }
                });
            }
        }
    }
    ReturnedSchemeValue() { }
    BatchEnter(index, event) {
        event.preventDefault();
        this.BatchTabClick(index, event);
        return false;
    }

    popupShowHideControl() {
        switch (this.masterService.PlistTitle) {
        }
    }
PlistTitle
    

   

    discEnterClicked(i) {
        if (
            this._trnMainService.TrnMainObj.VoucherType ==
            VoucherTypeEnum.OpeningStockBalance
        ) {
            document.getElementById("supplier" + i).focus();
        } else {
            document.getElementById("remarks" + i).focus();
        }
        return false;
    }
    listObj: any = <any>{};
    discRateEnterClicked(i) {
        var elmnt = document.getElementById("netamount" + i);
        elmnt.scrollIntoView();
        if (document.getElementById("discountAmt" + i) != null) {
            document.getElementById("discountAmt" + i).focus();
        }
        if (document.getElementById("discountAmtVATInclusiveForretailer" + i) != null) {
            document.getElementById("discountAmtVATInclusiveForretailer" + i).focus();
        }

        return false;
    }

  
    initScheme() {
        for (let i of this._trnMainService.TrnMainObj.ProdList) {
            // i.SCHEMESAPPLIEDIED = "";
            i.SecondaryDiscount = 0;
            i.BaseSecondaryDiscount = 0;
        }

        this._trnMainService.schemeApplyClick = false;
        this._trnMainService.TrnMainObj.DmsSchemesApplied = [];
        this._trnMainService.ReCalculateBillWithNormal();
    }


    QuantityEventClick(i) {

        if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].Quantity) < 1) {
            return false;
        }
        //         if(this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" && 
        //         this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder)
        //         {
        //             if(this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM!=null)
        //             {

        //                 if((this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].Quantity)+this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].STOCK))>this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.MAXLEVEL))
        //                  {

        // alert("You can not Order more than maximum stock assign to you...");
        // document.getElementById('quantity' + i).focus();
        // return false;
        //                  }
        //             }
        //         }
        this.activerowIndex = i;
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue
        ) {
            document.getElementById('alternateunit' + i).focus();
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            document.getElementById('remarks' + i).focus();
        }
        return false;
    }
    canAddRow() {
        try {
            return { status: "ok" };
        } catch (ex) {
            return { status: "error", error: ex };
        }
    }
    isTableRowSelected(i) {
        return this.activerowIndex == i;
    }
    scroll(event: KeyboardEvent) {
        event.preventDefault();
        if (event.keyCode === 13) {
            // ////console.log("enter");
        } else if (event.keyCode === 38) {
        } else return;
    }
    deleteRow() {
        if (confirm("Are you sure u you want to delete the Row?")) {
            this._trnMainService.TrnMainObj.ProdList.splice(this.activerowIndex, 1);
            if (this._trnMainService.TrnMainObj.ProdList.length == 0) {
                this._trnMainService.addRow();
            }
            this._trnMainService.ReCalculateBillWithNormal();
            this.initScheme();
            // this._trnMainService.QuantityMsg = '';
            // this._trnMainService.Dup_ItemBatchValidation = '';

        }
    }
  
   
    // SelectUnit(i, unit, value) {
    //     if (this._trnMainService.TrnMainObj.VoucherType != 14) return;
    //     // let altunitObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj;
    //     // this._trnMainService.TrnMainObj.ProdList[i].ALTCONFACTOR = altunitObj.CONFACTOR;
    //     // this._trnMainService.TrnMainObj.ProdList[i].ALTERNATEUNIT = altunitObj.ALTUNIT;
    //     // this._trnMainService.ReCalculateBillWithNormal();
    //     let alterRateValue = 0;
    //     this.changeDetection;
    //     // ////console.log("CheckDetection",this.changeDetection)
    //     // this.eachRate.push(this._trnMainService.TrnMainObj.ProdList[i].RATE);
    //     var currentIndexRate = this._trnMainService.TrnMainObj.ProdList[i].RATE

    //     if (value == "") {

    //         return;
    //     }
    //     //console.log('Unit value', this._trnMainService.TrnMainObj.ProdList[i].UNIT, i)
    //     // this._trnMainService.TrnMainObj.AdditionalObj.BILLUNITS = this._trnMainService.TrnMainObj.ProdList[i].UNIT;
    //     if (unit == "CASE") {

    //         // alterRateValue = this.eachRate[i] * this._trnMainService.TrnMainObj.ProdList[i].ALTCONFACTOR;
    //         // this.alterRate.push(alterRateValue);
    //         this._trnMainService.TrnMainObj.ProdList[i].RATE = this._trnMainService.TrnMainObj.ProdList[i].RATE * this._trnMainService.TrnMainObj.ProdList[i].ALTCONFACTOR;

    //     }


    // }

    // hidepopup() {
    //     this.childModal.hide();
    // }
    

    
    

    
    RemarksEnterCommand(event, i) {
        // event.preventDefault();
        // // this.checkValidation(i);

        // if (this.checkValidation(i)) {

        // } else {

        //     this.masterService.focusAnyControl('remarks' + i);

        // }

        // // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE != 'NewBill') {
        // //     this.stockCheck(this._trnMainService.TrnMainObj.REFBILL, i);
        // // }
        // return false;
    }
    
   
    onKeydownPreventEdit(event) {
        if (event.key === "Enter" || event.key === "Tab") { }
        else {
            event.preventDefault();
        }
    }


    

    setItemPopupUrl() {

        let hideapprovedEACH = true;
        let hideapprovedCASE = true;
        let hidePIEACH = true;
        let hidePICASE = true;
        let hideOPEACH = true;
        let hideOPCASE = true;
        let hideBatch = true;
        let hideCNCASE = true;
        let hideCNEACH = true;
        if (this.activeurlpath == "add-debitnote-itembase-approval") {
            hideapprovedEACH = false;
            hideapprovedCASE = false;
        }
        
        

        if (this.activeurlpath == 'add-debitnote-itembase') {
            ////console.log("from oopening", this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE);
            if (this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromPurchase') {
                hidePIEACH = false;
                hidePICASE = false;
            } else if (this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromOpeningStock') {
                hideOPEACH = false;
                hideOPCASE = false;
            }
        }

        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote &&
            this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromOpeningStock'
        ) {
            hideBatch = false;
        } else {
            hideBatch = true;
        }

        var voucherprefix="voucherprefix";
        this.gridPopupSettingsForSupplier = {
            title: "Supplier",
            apiEndpoints: `/getAccountPagedListByPType/PA/V/${voucherprefix}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ERPPLANTCODE",
                    title: "CODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ADDRESS",
                    title: "ADDRESS",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "EMAIL",
                    title: "EMAIL",
                    hidden: false,
                    noSearch: false
                }
            ]
        };
    }


    ShowProductInsertTableColumns(rowName, i): boolean {
        var VT = this._trnMainService.TrnMainObj.VoucherType;
        let PROD = <any>{};
        if (this._trnMainService.TrnMainObj.ProdList != null) {
            PROD = this._trnMainService.TrnMainObj.ProdList[i];
        }


        let showColumn = false;
        switch (rowName) {
           

            case "BATCH_HEADER":
                if((this.userSetting.EnableBatch == 0 || this.userSetting.EnableBatch ==1) ){
                    return false;
                  } 

                if (VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.DebitNote 
                    // VT == VoucherTypeEnum.CreditNoteApproval ||
                    // VT == VoucherTypeEnum.StockSample ||
                    // VT == VoucherTypeEnum.ReverseSalesRetrun

                )
                    showColumn = true;
                break;

                case 'MENUCODE_HEADER':
                    if(this.userSetting.GblBarcodeWiseBilling == 1 && (VT === VoucherTypeEnum.TaxInvoice || VT === VoucherTypeEnum.CreditNote)){        
                        // alert("reachwed-")
                        return false;  
                    }  
                    if(VT === VoucherTypeEnum.Purchase ||
                        VT === VoucherTypeEnum.DebitNote ||
                        VT === VoucherTypeEnum.OpeningStockBalance ||
                        VT === VoucherTypeEnum.PurchaseOrder ||
                        VT === VoucherTypeEnum.StockIssue
                        ){
                        // alert("reachwed-123")
                        showColumn = true;
                        } 
                        
    
                 case 'BARCODE_HEADER':      
           
                        if(this.userSetting.GblBarcodeWiseBilling == 0){        
                          return false;            
                          }
                
                          if (VT === VoucherTypeEnum.TaxInvoice  ||
                             VT === VoucherTypeEnum.CreditNote               
                            ){
                              showColumn = true;
                              
                            }
                
                          break;

                          case "BATCH_EDITABLE":
                            if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                                VT == VoucherTypeEnum.PerformaSalesInvoice ||
                                VT == VoucherTypeEnum.Purchase ||
                                VT == VoucherTypeEnum.Sales ||
                                VT == VoucherTypeEnum.StockSettlement ||
                                VT == VoucherTypeEnum.TaxInvoiceCancel ||
                                VT == VoucherTypeEnum.TaxInvoice
            
            
                            ) && PROD.inputMode == true
                            )
                                showColumn = true;
                            if (this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE == 'NewBill') {
                                showColumn = true;
                            }
            
            
                            break;
                        case "BATCH_NONEDITABLE":
                            if (((VT == VoucherTypeEnum.OpeningStockBalance ||
                                VT == VoucherTypeEnum.PerformaSalesInvoice ||
                                VT == VoucherTypeEnum.Purchase ||
                                VT == VoucherTypeEnum.PurchaseReturn ||
                                VT == VoucherTypeEnum.Sales ||
                                VT == VoucherTypeEnum.SalesReturn ||
                                VT == VoucherTypeEnum.StockIssue ||
                                VT == VoucherTypeEnum.StockSettlement ||
                                VT == VoucherTypeEnum.TaxInvoiceCancel ||
                                VT == VoucherTypeEnum.TaxInvoice ||
                                VT == VoucherTypeEnum.StockSample
            
                            ) && PROD.inputMode == false) ||
                                VT == VoucherTypeEnum.CreditNote ||
                                VT == VoucherTypeEnum.DebitNote ||
                                VT == VoucherTypeEnum.ReverseSalesRetrun
            
                            )
                                showColumn = true;
                            break;
            case "MFGDATE_HEADER":
                if((this.userSetting.EnableBatch == 0  )){
                    return false;
                  } 

                if (VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                      VT === VoucherTypeEnum.CreditNote

                )
                    showColumn = true;
                break;
            case "MFGDATE_EDITABLE":
                if((this.userSetting.EnableBatch == 0  )){
                    return false;
                  }  
          
                  if(
                    VT === VoucherTypeEnum.Purchase ||
                    VT === VoucherTypeEnum.OpeningStockBalance ||
                    
                    VT === VoucherTypeEnum.StockIssue
                    
                  ){
                    showColumn = true;
                  }
                          
                  break;
                
            case "MFGDATE_NONEDITABLE":
                if((this.userSetting.EnableBatch == 0  )){
                    return false;
                  } 

                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.StockSettlement ||
                     VT === VoucherTypeEnum.CreditNote

                )
                    showColumn = true;
                break;
            case "EXPDATE_HEADER":
                if((this.userSetting.EnableBatch == 0 )){
                    return false;
                  }  

                if (VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.CreditNote 
                    // VT == VoucherTypeEnum.CreditNoteApproval ||
                    // VT == VoucherTypeEnum.StockSample
                )
                    showColumn = true;
                break;
            case "EXPDATE_EDITABLE":
                if((this.userSetting.EnableBatch == 0  )){
                    return false;
                  }  
          
                  if(VT === VoucherTypeEnum.Purchase ||
                     VT === VoucherTypeEnum.OpeningStockBalance ||           
                     VT === VoucherTypeEnum.StockIssue
                     ){          
                    showColumn = true;
                  }
                
                  break;
                
            case "EXPDATE_NONEDITABLE":
                if((this.userSetting.EnableBatch == 0  )){
                    return false;
                  } 

                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.Purchase

                )
                    showColumn = true;
                break;

            case "QUANTITY_EDITABLE":
                if (VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.DebitNote 

                )
                    showColumn = true;
                break;

            case "QUANTITY_NONEDITABLE":
                if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.DebitNote ||
                    // VT == VoucherTypeEnum.CreditNoteApproval ||
                    // VT == VoucherTypeEnum.StockSample ||
                    this._trnMainService.showPerformaApproveReject)
                    && PROD.inputMode == false
                ) {
                    showColumn = true;
                }
                //quantity can be editable

                break;
            case "MRP_NONEDITABLE":
                if (VT != VoucherTypeEnum.OpeningStockBalance
                    && VT != VoucherTypeEnum.Purchase) {
                    showColumn = true;
                }
                break;
            case "MRP_EDITABLE":
                /**
                 * CHANGES ADDED BY BIBEK
                 */
                // if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE =='superdistributor' && VT==VoucherTypeEnum.Purchase) {
                //     showColumn = true;
                // }
                break;
            /**
             * END OF CHANGES BY BIBEK
             */
            case "COSTPRICE_HEADER":

                if (
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms"))
                    || VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.OpeningStockBalance
                    || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockIssue) { }
                else {
                    showColumn = true;
                }
                break;
            case "COSTPRICE2_EDITABLE":

                break;
            case "COSTPRICE2_NONEDITABLE":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Sales ||
                    (VT == VoucherTypeEnum.TaxInvoice && (
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder) {
                    showColumn = true;
                }
                break;

            case "ACTUAL_TRAN_PRICE_EDITABLE": 1
                break;
            case "ACTUAL_TRAN_PRICE_NONEDITABLE":
                if (VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder ||

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.DebitNote ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor"))
                ) {
                    showColumn = true;
                }
                break;

            case "SELLINGPRICE2_EDITABLE":

                break;
            case "SELLINGPRICE2_NONEDITABLE":
                if (VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.Purchase) {
                    showColumn = true;
                }
                break;
            case "SELLING_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||



                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.SalesOrder) {
                    showColumn = true;
                }
                break;
            case "DISCOUNT_PER_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT === VoucherTypeEnum.DebitNote ||
                    VT == VoucherTypeEnum.CreditNote 
                )
                    showColumn = true;
                break;
            case "DISCOUNT_PER_EDITABLE":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice 

                    //  ||VT == VoucherTypeEnum.CreditNote 
                )
                // if(VT==VoucherTypeEnum.CreditNote){
                //     if( this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = "NewBill"){
                //         showColumn = true;
                       
                //     }
                //     else{
                //         showColumn = false;
                      
                //     }
                // }
                // else{
                    showColumn = true;
                  
                // }

                if((VT === VoucherTypeEnum.PerformaSalesInvoice ||
                    VT === VoucherTypeEnum.Purchase ||
                    VT === VoucherTypeEnum.PurchaseReturn ||
                    VT === VoucherTypeEnum.Sales ||
                    VT === VoucherTypeEnum.SalesReturn ||
                    VT === VoucherTypeEnum.TaxInvoiceCancel ||
                    VT === VoucherTypeEnum.TaxInvoice ||
                    VT === VoucherTypeEnum.DebitNote ||
                    VT === VoucherTypeEnum.CreditNote ) && this.PCL == 2)
                    showColumn = true;
                 
                break;
            case "DISCOUNT_AMT_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.CreditNote 
                )
                    showColumn = true;

                    if ((
                        VT === VoucherTypeEnum.PerformaSalesInvoice ||
                        VT === VoucherTypeEnum.PurchaseReturn ||
                        VT === VoucherTypeEnum.Sales ||
                        VT === VoucherTypeEnum.SalesReturn ||
                        VT === VoucherTypeEnum.TaxInvoiceCancel ||
                        VT === VoucherTypeEnum.TaxInvoice ||
                        VT === VoucherTypeEnum.Purchase ||
                        VT === VoucherTypeEnum.DebitNote ||
                        VT === VoucherTypeEnum.CreditNote
                      ) && this.PCL ==2)
                        showColumn = true;
                break;
            case "DISCOUNT_AMT_EDITABLE":
                if ((
                    VT === VoucherTypeEnum.PerformaSalesInvoice ||
                    VT === VoucherTypeEnum.PurchaseReturn ||
                    VT === VoucherTypeEnum.Purchase ||
                    VT === VoucherTypeEnum.Sales ||
                    VT === VoucherTypeEnum.SalesReturn ||
                    VT === VoucherTypeEnum.DebitNote ||
                    VT === VoucherTypeEnum.CreditNote ||
                    (VT === VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE === 'distributor' ||
                      this._trnMainService.userProfile.CompanyInfo.ORG_TYPE === 'superdistributor')) ||
                    (VT === VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE === 'distributor' ||
                      this._trnMainService.userProfile.CompanyInfo.ORG_TYPE === 'superdistributor'))
                  ) && this.PCL ==2)
                    showColumn = true;

                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.Purchase ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor"))
                )
                    showColumn = true;
                break;
            case "DISCOUNT_AMT_EDITABLE_VATINCLU":
                if (
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms"))
                )
                    showColumn = true;
                break;
            case "SUPPLIER_HEADER":
                if (
                    VT == VoucherTypeEnum.OpeningStockBalance
                )
                    showColumn = true;
                break;
            case "SUPPLIER_EDITABLE":
                if (
                    VT == VoucherTypeEnum.OpeningStockBalance
                )
                    showColumn = true;
                break;
            case "GST_PER_HEADER":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||

                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder
                )
                    showColumn = true;
                break;
            case "GST_PER_NONEDITABLE":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||

                    (VT == VoucherTypeEnum.TaxInvoice) ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.SalesOrder
                )
                    showColumn = true;
                break;
            case "GST_PER_NONEDITABLE_EXCLUSIVE_FOR_RETAILER":

                break;
            case "GST_AMT_HEADER":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||

                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder 
                    // VT == VoucherTypeEnum.StockSample
                )
                    showColumn = true;
                break;
            case "GST_AMT_NONEDITABLE":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    // VT == VoucherTypeEnum.StockSample ||
                    (VT == VoucherTypeEnum.TaxInvoice) ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.DebitNote 
                    // VT == VoucherTypeEnum.CreditNoteApproval ||
                    // VT == VoucherTypeEnum.ReverseSalesRetrun


                )
                    showColumn = true;
                break;
            case "GST_AMT_NONEDITABLE_EXCLUSIVE_FOR_RETAILER":

                break;
            case "PRIMARY_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.CreditNote ||
                    //VT == VoucherTypeEnum.Purchase ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor"))
                )
                    showColumn = true;
                break;
            case "SECONDARY_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.CreditNote ||
                    //(VT == VoucherTypeEnum.Purchase && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor"))
                )
                    showColumn = true;
                break;
            case "LIQUIDITION_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor"))
                )
                    showColumn = true;
                break;
            case "OTHER_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor"))
                )
                    showColumn = true;
                break;


            case "UNIT_EDITABLE":
                if (
                    VT === VoucherTypeEnum.TaxInvoice ||
                    VT === VoucherTypeEnum.Purchase  ||
                    VT === VoucherTypeEnum.DebitNote
                    ) {
                    showColumn = true;
                  }
                  else {
                    showColumn = true;
                  }
                
                if (VT == VoucherTypeEnum.CreditNote
                    || VT == VoucherTypeEnum.DebitNote

                ) {

                }
                else if (VT == VoucherTypeEnum.TaxInvoice) {
                    showColumn = true;
                }

                else {
                    showColumn = true;
                }

               
    
                // if (this._trnMainService.TrnMainObj.Mode == "VIEW"){
                //     if(VT == VoucherTypeEnum.TaxInvoice){
                //         showColumn = true;
                //     }else{
                //         showColumn = false;
                //     }
                // } 
                
                break;
            case "UNIT_NONEDITABLE":
                if (VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.DebitNote) {
                    showColumn = true;
                }
                if (this._trnMainService.TrnMainObj.Mode == "VIEW") {
                    showColumn = true;
                }
                break;

            /**
             * CHANGES ADDED BY BIBEK
             */
            case "RATE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'superdistributor') {
                    showColumn = true;
                }
                break;

            /**
             * END OF BIBEK CHANGES
             */
            default:
                showColumn = true;
                break;
        }

        return showColumn;
    }
    KeyupQty() {
        this.initScheme();
    }

    onClicked() {
        this._trnMainService.inputCode = true;
    }

   


    
    addRowInsert() {
        this._trnMainService.addRow();
    }

    showImporterPriceCalc(index) {
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase &&
            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toUpperCase() == "SUPERDISTRIBUTOR" &&
            this._trnMainService.TrnMainObj.ProdList[index].MCODE != null &&
            this._trnMainService.TrnMainObj.Mode != "NEW") {
            let another_samemcodebatch=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.MCODE==this._trnMainService.TrnMainObj.ProdList[index].MCODE &&
                x.BATCH==this._trnMainService.TrnMainObj.ProdList[index].BATCH);
                if(another_samemcodebatch && another_samemcodebatch.length>1){
                    for(var i in another_samemcodebatch){
                        let _index = this._trnMainService.TrnMainObj.ProdList.findIndex(x=>x.MCODE==this._trnMainService.TrnMainObj.ProdList[index].MCODE &&
                            x.BATCH==this._trnMainService.TrnMainObj.ProdList[index].BATCH && x.IsCostingSaved == true);
                            if(_index>=0 && _index!=index){
                                    this.alertService.info(`Costing is already added in another row for Product ${this._trnMainService.TrnMainObj.ProdList[index].ITEMDESC} 
                                    and batchno ${this._trnMainService.TrnMainObj.ProdList[index].BATCH}`);
                                    return;
                            }

                    }
                }
            this.pricecalculator.show(index);
            this.masterService.focusAnyControl('upcmr');
        }
    }


}
