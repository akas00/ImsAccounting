import { TransactionService } from "./transaction.service";
import { Component, ViewChild, AfterContentChecked, ChangeDetectorRef } from "@angular/core";
import { MasterRepo } from "./../repositories/masterRepo.service";
import {
    GenericPopUpComponent,
    GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { VoucherTypeEnum } from "../interfaces";
import { NODATA } from "dns";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../services/alert/alert.service";
import { AuthService } from "../services/permission/authService.service";


@Component({
    selector: "trnmain-purchase-entry",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"],
    templateUrl: "./trnmain-purchase.component.html"
})
export class TrnMainPurchaseComponent implements AfterContentChecked{
    orgType: string;
    @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
    @ViewChild("genericGridShipName") genericGridShipName: GenericPopUpComponent;
    @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
    @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;

    

    gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForShipName: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();

 


    billLabel: string = "Bill No";
    invNoLabel:string = "Invoice No:";
    invDateLabel:string = "Invoice Date:";
    poNOLabel:string = "PO NO"
    paymentTermLabel:string = "Payment Terms"
    purchaseReturnType:string;
    showRefBill:boolean;
    hideRefBill:boolean;
    costlists :any;
    chalanSeries = [];
    nepaliDate: string;
    userProfile: any;
    userSetting:any;
    isAddressReadOnly:boolean = false;
    isVatNoReadOnly:boolean = false;
    
    activeUrlPath:any;
    disableReturnType:boolean;
    public appType;
    differenceAmount:number = 0;
    diffAmountDrCrType:string = "";
    PCL: number;

    constructor(
        public masterService: MasterRepo,
        public _trnMainService: TransactionService,
        private arouter: ActivatedRoute, private changeDetection: ChangeDetectorRef,
        private alertService: AlertService,
        public _authService: AuthService
    ) {

        this.PCL = this.masterService.PCL_VALUE;
        this.appType = this.masterService.appType;
        this.orgType = this._trnMainService.userProfile.CompanyInfo.ORG_TYPE;
        this.activeUrlPath = arouter.snapshot.url[0].path;
        this._trnMainService.isNotificationView = false;
        this.userProfile = this._authService.getUserProfile();
        this.userSetting = this._authService.getSetting();
      
        // this.gridPopupSettingsForSupplier = {
        //     title: "Supplier",
        //     apiEndpoints: `/getAccountPagedListByPType/PA/V`,
        //     defaultFilterIndex: 0,
        //     useDefinefilterValue: this._trnMainService.TrnMainObj.BILLTO,
        //     columns: [
        //         {
        //             key: "ACNAME",
        //             title: "NAME",
        //             hidden: false,
        //             noSearch: false
        //         },
        //         {
        //             key: "ACCODE",
        //             title: "CODE",
        //             hidden: false,
        //             noSearch: false
        //         },
        //         {
        //             key: "ADDRESS",
        //             title: "ADDRESS",
        //             hidden: false,
        //             noSearch: false
        //         },
        //         {
        //             key: "EMAIL",
        //             title: "EMAIL",
        //             hidden: false,
        //             noSearch: false
        //         }
        //     ]
        // };
        var voucherprefix="voucherprefix";
        this.gridPopupSettingsForShipName = {
            title: "Customers",
            apiEndpoints: `/getAccountPagedListByPType/PA/C/${voucherprefix}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ACCODE",
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

        }
        this.gridPopupSettingsForWarehouse = {
            title: this.appType == 2 ? "Godown" : "Warehouse",
            apiEndpoints: `/getAllWarehousePagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "NAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                }
            ]
        };

        if(this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != 'distributor'){
            
                this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings("REFBILLOFPURCHASERETURN");
            
        }
        if(this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'distributor' ){
            
            if(this.activeUrlPath == 'add-debitnote-itembase-approval'){
                this.showRefBill = true;
                this.disableReturnType = true;
            }else{
              //  this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings('PI');
            }

            if(this.activeUrlPath  == 'add-debitnote-itembase'){
                this.showRefBill = true;
               this._trnMainService.disableSupplierInfo = true;
            }
           
          
        }

        if(this.userSetting.REFBILLCOMPULSORINDNOTE ==1){
            this._trnMainService.TrnMainObj.DOFULLRETURN =1;
          }else{
            this._trnMainService.TrnMainObj.DOFULLRETURN =0;
          }

        if((this._trnMainService.TrnMainObj.VoucherType == 3 || this._trnMainService.TrnMainObj.VoucherType == 16) && this.masterService.disableQuantityEdit != true){
            this.loadCompanyBillunit();
          }

          if((this._trnMainService.TrnMainObj.VoucherType == 3) && this.masterService.disableQuantityEdit != true){
            this.getCurrentDateInReceiveddate();
          }

          if((this._trnMainService.TrnMainObj.VoucherType == 3 || this._trnMainService.TrnMainObj.VoucherType == 16)){
            this.loadCompanyInfo();
          }
        
    }
    ngAfterViewInit() {
       

    }
    ngOnInit() {
    

        if (this._trnMainService.TrnMainObj.VoucherType == 19) {
            this.billLabel = "PO NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 3) {
            this.billLabel = "PI NO.";
            this.invNoLabel = "Invoice No:";
            this.invDateLabel = "Invoice Date:"
            this.poNOLabel = "PO NO";
            this.paymentTermLabel = "Payment Terms";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 16) {
            this.billLabel = "RETURN NO.";
            this.invNoLabel = "Ref PI No:";
            this.invDateLabel = "Ref PI Date:";
            this.poNOLabel = "Ref Sup Inv NO";
            this.paymentTermLabel = "Return Mode";
        }
        else {
            this.billLabel = "BILL NO.";
        }

    

    }

   

    ngAfterContentChecked(): void {    
        this.differenceAmount = this._trnMainService.diffAmountItemForAccount;
        this.diffAmountDrCrType = this._trnMainService.diffAmountDrCrType;
        this.changeDetection.detectChanges();
    
    }
    
    OnChangePurchaseReturnType(event){
    
        if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromPurchase'){
            this._trnMainService.TrnMainObj.REFBILL = '';
        }
      

        if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE  == 'StockIssueApproved'
         || this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE  == 'DamageSalesReturnApproved'         
         || this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromPurchase'
         ){
            this.showRefBill = false;
        }

        if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'StockIssueApproved'){
            this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings("getApprovedStockIssueForDebitNote"); 

        }else if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE== 'DamageSalesReturnApproved' ){
            this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings("DamageIssueForPurchaseReturn");
         
        }else if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromPurchase'){
            this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings('PI');
        }else if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromOpeningStock'){
            this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings('OP');
        }

    }

    


    undo() {
        this._trnMainService.TrnMainObj.TRNMODE = "credit";
    }

    ngOnDestroy() {
        try {
        } catch (ex) {
            //console.log({ ondestroy: ex });
        }
    }
    // CurrencyChange(){

    //             if(this.masterService.Currencies.length>0){
    //               var FC=  this.masterService.Currencies.find(c=>c.CURNAME==this.TrnMainObj.FCurrency);
    //               if(FC!=null){
    //                  this.TrnMainObj.EXRATE=FC.EXRATE;
    //                  this.TrnMainForm.patchValue({EXRATE:FC.EXRATE});
    //               }
    //             }
    //             if(this.TrnMainObj.ProdList!=null && this.TrnMainObj.ProdList.length>0){
    //                 for(let p of this.TrnMainObj.ProdList){
    //                 this._trnMainService.CalculateNormal(p,this.setting.appSetting.ServiceTaxRate,this.setting.appSetting.VATRate,1);
    //                }
    //             this._trnMainService.ReCalculateBill(this.TrnMainObj,this.setting.appSetting.ServiceTaxRate,this.setting.appSetting.VATRate);
    //             }

    // }

    SupplierEnterCommand(e) {
        // if(!this._trnMainService.checkPurchaseVerification()){
        //     this.alertService.warning("Cannot do manual purchase. Please choose bill from Notification only");
        //     return;
        // }
           
        
        e.preventDefault();
        document.getElementById("supplierid").blur();
        this._trnMainService.customerEvent = true;
        this.getSupplierList();
        this.genericGridSupplier.show();
        // this.masterService.partyPopUpHeaderText = "Suppliers";
        // this.masterService.PlistTitle = "partyPopUp";
        // this.masterService.getSupplierList().subscribe(
        //   res => {
        //     this._trnMainService.partyList = res;
        //   },
        //   error => {
        //     this.masterService.resolveError(error, "trnmain-- getSupplier");
        //   }
        // );
    }
    supplierFieldChange() {
        this._trnMainService.TrnMainObj.PARAC = null;
        this._trnMainService.TrnMainObj.TRNAC = null;
        this._trnMainService.TrnMainObj.BILLTOADD = null;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = null;
        this._trnMainService.TrnMainObj.TRNMODE = null;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = null;
        this._trnMainService.TrnMainObj.CREDITDAYS = 0;

    }
    onSupplierSelected(supplier) {
        if(this.activeUrlPath == 'add-debitnote-itembase-approval'){
            this.disableReturnType = false;
        }

        this._trnMainService.TrnMainObj.BILLTO = supplier.ACNAME;
        this._trnMainService.TrnMainObj.BILLTOTEL = supplier.VATNO;
        this._trnMainService.TrnMainObj.PARAC = supplier.ACID
        this._trnMainService.TrnMainObj.TRNAC = supplier.ACID;
        this._trnMainService.TrnMainObj.BILLTOADD = supplier.ADDRESS;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = supplier.PSTYPE == null ? null : supplier.PSTYPE.toLowerCase();
        this._trnMainService.TrnMainObj.TRNMODE = supplier.PMODE;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = supplier.ORG_TYPE;
        this._trnMainService.TrnMainObj.CREDITDAYS = supplier.CRPERIOD;
        this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + supplier.ACID)
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        this._trnMainService.TrnMainObj.BALANCE = this._trnMainService.nullToZeroConverter(res.result);
                    } else {
                        //console.log(res.result);
                    }
                },
                error => {
                    //console.log(error);
                }
            );
            this._trnMainService.getAccountWiseTrnAmount(supplier.ACID);

      //saveChanges is false means (changes will be lost!) alert is true
        this._trnMainService.saveChanges = false;
        this._trnMainService.preventNavigation();
        
    }

    shipNameEnterCommand(e) {
        e.preventDefault();
        document.getElementById("shipname").blur();
        this.genericGridShipName.show();
    }
    supplierFieldDisabled(): boolean {
        if (this._trnMainService.TrnMainObj.ProdList != null) {
            if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
                return true;
            }
        }     

 
        return false;
    }
    onShipNameSelected(customer) {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = customer.ACID;
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = customer.ACNAME;
        this._trnMainService.TrnMainObj.DeliveryAddress = customer.ADDRESS;
        //this._trnMainService.TrnMainObj.TRNMODE = customer.PMODE;

    }

    paymentTermsChange() {
        ////console.log("paymentchange", this._trnMainService.TrnMainObj.TRNMODE);
    }
    RefBillEnterCommand(event) {
        // ////console.log("CheckEvent",event)

            event.preventDefault();
            document.getElementById("refbill").blur();
            this._trnMainService.customerEvent=true;
            this.genericGridRefBill.show();
    
    }
    onRefBillSelected(event) {
        //this.showRefBill = true;

        if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromPurchase' ||
           this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'fromOpeningStock' 
        ){
          this._trnMainService.disableSupplierInfo = false;
        }

        if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'StockIssueApproved'){
            this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
            this._trnMainService.TrnMainObj.REFORDBILL = event.REFBILL;
            //console.log('reached');
            //this._trnMainService.loadStockIssueDataForPurchaseReturn(event.VCHRNO,event.DIVISION,event.PHICALID);
        }else if(this._trnMainService.TrnMainObj.AdditionalObj.RETURNTYPE == 'DamageSalesReturnApproved') {
            this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
            this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
            // this._trnMainService.TrnMainObj.PARAC = event.PARAC;
            // this._trnMainService.TrnMainObj.BILLTO = event.BILLTO;
            // this._trnMainService.TrnMainObj.TRNAC = event.TRNAC;
            // this._trnMainService.TrnMainObj.BILLTOADD = event.BILLTOADD;
            // this._trnMainService.TrnMainObj.TRNMODE = event.TRNMODE;
            // this._trnMainService.TrnMainObj.DCRATE = event.DCRATE;
            // this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT = event.TOTALFLATDISCOUNT;

          // this._trnMainService.TrnMainObj.AdditionalObj.INVOICETYPE = 'NewBill' 
        }else{
            this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
            this._trnMainService.TrnMainObj.PARAC = event.PARAC;
            this._trnMainService.TrnMainObj.BILLTO = event.BILLTO;
            this._trnMainService.TrnMainObj.TRNAC = event.TRNAC;
            this._trnMainService.TrnMainObj.BILLTOADD = event.BILLTOADD;
            this._trnMainService.TrnMainObj.TRNMODE = event.TRNMODE;
            this._trnMainService.TrnMainObj.DCRATE = event.DCRATE;
            this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT = event.TOTALFLATDISCOUNT;
            this._trnMainService.TrnMainObj.REFORDBILL = event.REFBILL;
        }


    }
    RefBillFieldDisabled() {
        if (this._trnMainService.TrnMainObj.ProdList != null) {
            if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
                return true;
            }
        }
        return false;
    }

    preventInput($event) {
        $event.preventDefault();
        return false;
    }
    WarehouseEnterCommand(event) {
        this.genericGridWarehouse.show();
    }
    onWarehouseSelected(event) {
        this._trnMainService.TrnMainObj.MWAREHOUSE = event.NAME;
    }

    onSelectMultiplePrice(){

    }

    getSupplierList(){
        var voucherprefix="voucherprefix";
        this.gridPopupSettingsForSupplier = {
            title: "Supplier",
            apiEndpoints: `/getAccountPagedListByPType/PA/V/${voucherprefix}`,
            defaultFilterIndex: 0,
            // useDefinefilterValue: this._trnMainService.TrnMainObj.BILLTO,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ACCODE",
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

    loadCompanyInfo() {
        if (this._trnMainService.inputCode != true) {
          this.masterService.loadCompany().subscribe((res) => {
            this._trnMainService.TrnMainObj.AdditionalObj.BILLFORMATS = res.BILLFORMATS
          })
        }
      }

    loadCompanyBillunit() {
        if (this._trnMainService.inputCode != true) {
          this.masterService.loadCompany().subscribe((res) => {
            this._trnMainService.TrnMainObj.AdditionalObj.BILLUNITS = res.BILLUNITS
          })
        }
      }

      UnitandFormatDisabled() {
        if (this._trnMainService.TrnMainObj.ProdList != null) {
          if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
            return true;
          }
        }
        return false;
      }

      
  getCurrentDateInReceiveddate(){
    this.masterService.getCurrentDate().subscribe(
      date => {
        this._trnMainService.TrnMainObj.AdditionalObj.RECEIVEDDATE = date.Date.substring(0, 10);
      },
      error => {
        ////console.log("error")
      }
    );
  }

}
