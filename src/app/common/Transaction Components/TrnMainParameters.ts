import { Component, EventEmitter, Output, ViewChild, ElementRef, HostListener, ChangeDetectorRef, AfterContentChecked } from "@angular/core";
import { TransactionService } from "./transaction.service";
import { MasterRepo } from "../repositories/masterRepo.service";
import { SettingService } from "../services";
import { emit } from "cluster";
import { VoucherTypeEnum } from "../interfaces/TrnMain";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlternateUnitTabComponent } from "../../pages/masters/components/ProductMaster/AlternateUnitTabComponent";
import { ActivatedRoute } from "@angular/router";
import { NewGenericPopUpSettings, NewGenericPopUpComponent } from "../popupLists/new-generic-grid/new-generic-popup-grid.component";
import { AuthService} from '../../common/services/permission/authService.service';

@Component({
  selector: "trnmain-parameters-master",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"],
  templateUrl: "./TrnMainParameters.html"
})
export class TrnMainParametersComponent  implements AfterContentChecked{
  @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
  @ViewChild("genericGridSalesMan") genericGridSalesMan: GenericPopUpComponent;

  @ViewChild("genericGridForTaxCancel") genericGridForTaxCancel: GenericPopUpComponent;
  gridPopupSettingsForTaxCancel: GenericPopUpSettings = new GenericPopUpSettings();




  gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForSalesMan: GenericPopUpSettings = new GenericPopUpSettings();
 

  salesTransactionAccountList: any[] = [];
  ShowTransactionMode: boolean = false;
  public appType;
  customerId: any;
  doubleClick: boolean = false;
  salesManList: any[] = [];
  showBalance: boolean = false;
  // @ViewChild('focusInputUnit') focusInputUnit: ElementRef
  // @ViewChild('focusSalesman') focusSalesman: ElementRef
  // @ViewChild('focusInputFormat')focusInputFormat:ElementRef
  activeurlpath:any;
  duedateis:any;
  differenceAmount:number = 0;
  diffAmountDrCrType:string = "";
  costlists: any;
  chalanSeries: any;
  dateMiti = [];
  userSetting: any;
  paymentModeLabel: string = 'Payment Terms';


  warehouseList:any=[]
  @ViewChild("genericGridAccountList") genericGridAccountList: GenericPopUpComponent;
  GridAccountList : GenericPopUpSettings = new GenericPopUpSettings();
  PCL: number;
  
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private arouter: ActivatedRoute,    private changeDetection: ChangeDetectorRef,
    private _authService: AuthService,

  ) {
    this.PCL = this.masterService.PCL_VALUE;
    ////console.log("pcl", this.PCL);
    this.appType = this.masterService.appType;
    this.userSetting = _authService.getSetting();
    this._trnMainService.TrnMainObj.CHALANNOPREFIX = '';

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice

    ) {
      this.ShowTransactionMode = true;
    }
    else {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReverseSalesRetrun
      ) {
        if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
          || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor") {
          this.ShowTransactionMode = true;
        }
      }
    }
    // this.masterService.getunsalableWarehouseList().subscribe((res)=>{
      
    //   this.warehouseList.push(res)
    // });
    // this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettings("REFBILLOFSALESRETURN");

    // this.gridPopupSettingsForCustomer = {
    //   title: "Customers",
    //   apiEndpoints: `/getAccountPagedListByPType/PA/C`,
    //   defaultFilterIndex: 1,
    //   useDefinefilterValue:this._trnMainService.TrnMainObj.BILLTO,
    //   columns: [
    //     {
    //       key: "ACNAME",
    //       title: "NAME",
    //       hidden: false,
    //       noSearch: false
    //     },
    //     {
    //       key: "ACCODE",
    //       title: "CODE",
    //       hidden: false,
    //       noSearch: false
    //     },
    //     {
    //       key: "ADDRESS",
    //       title: "ADDRESS",
    //       hidden: false,
    //       noSearch: false
    //     },
    //     {
    //       key: "EMAIL",
    //       title: "EMAIL",
    //       hidden: false,
    //       noSearch: false
    //     }
    //   ]
    // };
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



    // if(this._trnMainService.TrnMainObj.VoucherType == 61)
    // {
    //   this.gridPopupSettingsForTaxCancel = this.masterService.getGenericGridSettingForTaxCancel();
    // }
    this.getCurrentDateInDueDate();
    this.activeurlpath = arouter.snapshot.url[0].path;
    if((this.activeurlpath=='addsientry' && this._trnMainService.TrnMainObj.VoucherType == 14) ||  _trnMainService.TrnMainObj.VoucherType==57 || _trnMainService.TrnMainObj.VoucherType==61 || _trnMainService.TrnMainObj.VoucherType==15){
      this.loadCompanyInfo();
    }
   
    if(this._trnMainService.TrnMainObj.VoucherType == 57 || this._trnMainService.TrnMainObj.VoucherType == 15 || this._trnMainService.TrnMainObj.VoucherType == 38 ||  this._trnMainService.TrnMainObj.VoucherType == 65){
      this.loadCompanyBillunit();
    }

  }



  ngOnInit() {    
   //  this.getCurrentDateInDueDate();
    // if (this.doubleClick == true) {
    //   this.getSalesManListCustomerWise(this.customerId)
    // }
    this.setDefaultValues();
    if(this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.PerformaSalesInvoice){
      this.masterService.Account = 'CASHINHAND_AC';
      this._trnMainService.TrnMainObj.TRNAC = 'AT01002';
    }

    this._trnMainService.TrnMainObj.TRNMODE = 'credit';
    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.CreditNote ||
      this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.SalesReturn) {
      this.DisableMasterMode(true)
      // document.getElementById("refbill").focus();
    }
    else {
      this.DisableMasterMode(false)
    }
    
    this.setDefaultValues();

    if (this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.SalesReturn || this._trnMainService.TrnMainObj.VoucherType === VoucherTypeEnum.CreditNote) {
      this.paymentModeLabel = 'Return Mode';
      this._trnMainService.DOFULLRETURN = this._trnMainService.TrnMainObj.DOFULLRETURN = 1;
    }
    
  }

  disableMaster: any = <any>{};

  

  ngAfterContentChecked(): void {    
    this.differenceAmount = this._trnMainService.diffAmountItemForAccount;
    this.diffAmountDrCrType = this._trnMainService.diffAmountDrCrType;
    this.changeDetection.detectChanges();

}


RefBillFieldDisabled() {
  if (this._trnMainService.TrnMainObj.ProdList != null) {
    // if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
    //   return true;
    // }
  }
  return false;
}


 
  onAccountSelected(value){
    this._trnMainService.TrnMainObj.TRNAC = value.ACID;
   this.masterService.Account = value.ACNAME ;
  }
  AccountEnter(){
    this.GridAccountList = {
      title: "Account List",
      apiEndpoints: `/getPagedAllCashGroupAccountList/`,
      defaultFilterIndex: 0,
  
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "customerID",
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
    this.genericGridAccountList.show();
  
  }
  customerEnterCommand(e) {
    
    // e.preventDefault();
    
    // document.getElementById("customerselectid").blur();

    // this._trnMainService.customerEvent = true;
    // if (this.activeurlpath != 'addsientry' && this.activeurlpath != 'canceladdsientry' && this._trnMainService.TrnMainObj.VoucherType!=57) {
    //   this.getCustomersList();

    //   this.genericGridCustomer.show();
    // }
    // if ((this.activeurlpath == 'addsientry' || this._trnMainService.TrnMainObj.VoucherType==57) && this._trnMainService.saveButton == true) {
    //   ////console.log("Customer bill to value", this._trnMainService.TrnMainObj.BILLTO);
    //   this.getCustomerList();
    //   this.genericGridCustomerListBySalesmanAndRoute.show();
    // }
    // // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.saveButton!=true) {
    // //     this.focusInputFormat.nativeElement.focus();

    // // }
    // // this.masterService.partyPopUpHeaderText = "Customers";
    // // this.masterService.PlistTitle = "partyPopUp";
    // // this.masterService.getCustomers().subscribe(
    // //   res => {
    // //     this._trnMainService.partyList = res;
    // //   },
    // //   error => {
    // //     this.masterService.resolveError(error, "trnmain-- getCustomers");
    // //   }
    // // );
    // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
    //   this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
    //     this.masterService.focusAnyControl("unit");
    // }else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote){
    //   this.masterService.focusAnyControl("refbill");
    // }
    
  }



  setDefaultValues() {
    if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'retailer') {
      this._trnMainService.TrnMainObj.INVOICETYPE = 'retailinvoice';
    }
    else {
      this._trnMainService.TrnMainObj.INVOICETYPE = 'taxinvoice';
      this._trnMainService.TrnMainObj.SALESMAN = this._trnMainService.salesmanName
        
    }
    // this._trnMainService.TrnMainObj.TRNMODE = 'cash';

    // this._trnMainService.TrnMainObj.TRNTYPE = 'local'

  }
  ngAfterViewInit() {
   
  }
  customerFieldChange() {
    this._trnMainService.TrnMainObj.PARAC = null;
    this._trnMainService.TrnMainObj.TRNAC = null;
    this._trnMainService.TrnMainObj.BILLTOADD = null;
    this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = null;
    this._trnMainService.TrnMainObj.TRNMODE = "credit";
    this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = null;
    this._trnMainService.TrnMainObj.CREDITDAYS = 0;
  }
  UniEnterCommand(){
 
    this.masterService.focusAnyControl('menucode'+0)
    this.masterService.ShowMore = false;
  }


  onCustomerSelected(customer) {

    this.doubleClick = true;
    this._trnMainService.TrnMainObj.BILLTO = customer.ACNAME;
    this._trnMainService.TrnMainObj.PARAC = customer.ACID;
    this._trnMainService.TrnMainObj.TRNAC = customer.ACID;
    this._trnMainService.TrnMainObj.BILLTOADD = customer.ADDRESS;
    this._trnMainService.TrnMainObj.BILLTOTEL = customer.VATNO;
    this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = customer.PSTYPE == null ? null : customer.PSTYPE.toLowerCase();
    this._trnMainService.TrnMainObj.TRNMODE = (customer.PMODE == null || customer.PMODE == "") ? "credit" : customer.PMODE;
    this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = customer.ORG_TYPE;
    this._trnMainService.TrnMainObj.CREDITDAYS = customer.CRPERIOD;
    this._trnMainService.TrnMainObj.CUS_FIX_DISCOUNT_PER = customer.CUS_FIX_DISCOUNT_PER;
    this._trnMainService.TrnMainObj.CUS_Remote_Discount = customer.CUS_Remote_Discount;
    this._trnMainService.TrnMainObj.AdditionalObj.CUSTOMERTYPE = customer.GEO;
    // this._trnMainService.TrnMainObj.isRDApproved = customer.isRDApproved;
    // this._trnMainService.TrnMainObj.isFDApproved = customer.isFDApproved;
    // this._trnMainService.TrnMainObj.CUS_Remote_Discount = customer.CUS_Remote_Discount;
    
    this.customerId = customer.SM;

    // this.getSalesManListCustomerWise(customer.SM);
    this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + customer.ACID)
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
    // if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
    //   this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote
    // ) {
    //   if (this._trnMainService.TrnMainObj.BILLTO != null) {
    //     this._trnMainService.billtoStatus=true;
    //     ////console.log("billtostatus",this._trnMainService.billtoStatus)
    //   }
    // }

    this._trnMainService.getAccountWiseTrnAmount(customer.ACID);

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (this._trnMainService.TrnMainObj.BILLTO != null) {
        // this.focusInputUnit.nativeElement.focus();
      }
    }else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote){
      this.masterService.focusAnyControl("refbill");
    }

    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this._trnMainService.TrnMainObj.VoucherType ==  VoucherTypeEnum.CreditNote){

      //saveChanges is false means (changes will be lost!) alert is true
      this._trnMainService.saveChanges = false;
      this._trnMainService.preventNavigation();
      
    }


  }


  CustomerFieldDisabled(): boolean {
    if(this._trnMainService.isSelfBill == true)return true;
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
      // if(this._trnMainService.disablePerformaBillingForLastTwoDays){
      //   return true;
      // }
    }
    return false;
  }

  // getSalesManListCustomerWise(salesManId: any) {
  //   this.masterService.getSalesmanBasedUponCustomer(salesManId)
  //     .subscribe(
  //       (res) => {
  //         this.salesManList = res;
  //         ////console.log("salesManList", this.salesManList)
  //       })
  // }
  // salesManChange() {
  //   ////console.log("sales Man" + this._trnMainService.TrnMainObj.SALESMANID)
  // }


  //sales paymentmode changes
  // onpaymentmodechange() {
  //   this._trnMainService.paymentAccountList = [];
  //   if (
  //     this._trnMainService.paymentmodelist == null ||
  //     this._trnMainService.paymentmodelist.length == 0
  //   )
  //     return;
  //   var selectedmode = this._trnMainService.paymentmodelist.filter(
  //     x =>
  //       x.PAYMENTMODENAME.toUpperCase() ==
  //       this._trnMainService.TrnMainObj.TRNMODE.toUpperCase()
  //   )[0];
  //   if (selectedmode == null) {
  //     ////console.log("Selected Mode not found...");
  //     return;
  //   }
  //   let modetype = selectedmode.MODETYPE;

  //   if (selectedmode.ACID != null && selectedmode.ACID != "") {
  //     this._trnMainService.TrnMainObj.TRNAC = selectedmode.ACID;
  //   } else {
  //     this._trnMainService.TrnMainObj.TRNAC = null;
  //   }

  //   if (modetype != null && modetype.toUpperCase() == "LIST") {
  //     this.masterService
  //       .masterGetmethod(
  //         "/getpaymentmodelist/" + this._trnMainService.TrnMainObj.TRNMODE
  //       )
  //       .subscribe(
  //         res => {
  //           if (res.status == "ok") {
  //             this._trnMainService.paymentAccountList = JSON.parse(res.result);
  //             //////console.log("accountlist",this.AccountList);
  //           } else {
  //             ////console.log("error on getting paymentmode " + res.result);
  //           }
  //         },
  //         error => {
  //           ////console.log("error on getting paymentmode ", error);
  //         }
  //       );
  //   }
  // }
  // RefBillEnterCommand(event) {
  //   event.preventDefault();
  //   document.getElementById("refbill").blur();
  //   this._trnMainService.customerEvent=true;
  //   if (this._trnMainService.TrnMainObj.VoucherType == 61) {
  //     event.preventDefault();
  //     document.getElementById("refbill").blur();
  //     this.newRefBill()
  //     this.newgenericGridForTaxCancel.show();
  //   }
    
  //   else if (this._trnMainService.TrnMainObj.VoucherType == 15 ) {

  //     // if(this.activeurlpath == 'add-creditnote-itembase-approval' ){
  //     //   this.genericGridSettingForSalesReturn(`/getTrnMainPagedListForSalesReturnApproval/${this._trnMainService.TrnMainObj.PARAC}`);
  //     //   this.newgenericGridForSalesReturn.show();
  //     // }else{
  //       var PARAC = this._trnMainService.TrnMainObj.PARAC;

  //       if(PARAC == null || PARAC == "" || PARAC == 'undefined' ){
  //         return;
  //       }
  //       else{
  //       this.genericGridSettingForSalesReturn(`/getTrnMainPagedListbyBILLTO/${PARAC}`);   
  //       this.newgenericGridForSalesReturn.show();
  //       this.triggerRefBillCheck();
  //       }
  //     // }
    
  //   }else if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNoteApproval){
    
  //       this.genericGridSettingForSalesReturn(`/getTrnMainPagedListForSalesReturnApproval/${this._trnMainService.TrnMainObj.PARAC}`);
  //       this.newgenericGridForSalesReturn.show();
      
  //   }
  //   // 38 == ReverseReturn
  //   else if(this._trnMainService.TrnMainObj.VoucherType == 38){
  //     var PARAC = this._trnMainService.TrnMainObj.PARAC;

  //     if(PARAC == null || PARAC == "" || PARAC == 'undefined' ){
  //       return;
  //     }
  //     else{
  //     this.genericGridSettingForSalesReturn(`/getTrnMainPagedListbyBILLTO_ForReverseSales/${PARAC}`);   
  //     this.newgenericGridForSalesReturn.show();
  //     this.triggerRefBillCheck();
  //     }
  //   }
  //   else {
  //     this.genericGridRefBill.show();
  //   }

  // }
  // public promptSalesReturnType: boolean = false
  BillReturnType: any;
  ReffBillObj: any = <any>{};

  



  goDownDisabled(){
    if(this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote){
      return true;
    }
  }

  popupCancel() {
    // this.promptSalesReturnType = false
  }
  popupok(event) {
    // this.promptSalesReturnType = false
    ////console.log("Event", event)
    if (this.BillReturnType == 1) {

    }
    else {

      // this.masterService.getItemForFullBillReturn()
    }
  }

  loadCompanyInfo() {
    if (this._trnMainService.inputCode != true) {
      this.masterService.loadCompany().subscribe((res) => {
        this._trnMainService.TrnMainObj.AdditionalObj.BILLFORMATS = res.BILLFORMATS
        this._trnMainService.TrnMainObj.AdditionalObj.BILLUNITS = res.BILLUNITS
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

  preventInput($event) {
    $event.preventDefault();
    return false;
  }
  gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
  WarehouseEnterCommand(event) {
    this.genericGridWarehouse.show();
  }
  UnsalableWarehouseEnterCommand(event) {
    this.genericGridWarehouse.show();
  }
  onWarehouseSelected(event) {
    this._trnMainService.TrnMainObj.MWAREHOUSE = event.NAME;
  }


  setFocusSalesman() {
    // this.focusSalesman.nativeElement.focus()
  }


  SalesmanFieldDisabled(): boolean {
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
    }
    return false;
  }


  getCurrentDateInDueDate(){
    this.masterService.getCurrentDate().subscribe(
      date => {
        this.duedateis = date.Date.substring(0, 10);
        this._trnMainService.TrnMainObj.AdditionalObj.DUEDATE=this.duedateis
      },
      error => {
        ////console.log("error")
      }
    );
  }

  DisableMasterMode(value: boolean) {
    {
      // if (this.masterService.userSetting.REFBILLCOMPULSORYINCNOTE == 1) {

        if (this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == 'CASH' ||
          this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == 'CREDIT'
        ) {
          this.disableMaster.ReturnMode = value;
          this.disableMaster.Account = value;
          this.disableMaster.Warehouse = value;
          this.disableMaster.CostCenter = value;
          this.disableMaster.Customer = value;
          this.disableMaster.FlatDisPer = value;
          this.disableMaster.FlatDisRs = value;
        }
        else if (
          this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == 'CREDIT CARD' ||
          this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == 'CHEQUE DEPOSITE'
        ) {
          this.disableMaster.ReturnMode = false;
          this.disableMaster.Account = false;
          this.disableMaster.Warehouse = value;
          this.disableMaster.CostCenter = value;
          this.disableMaster.Customer = value;
          this.disableMaster.FlatDisPer = value;
          this.disableMaster.FlatDisRs = value;
        }
      // }
      // else if (this.masterService.userSetting.REFBILLCOMPULSORYINCNOTE == 0) {
      //   this.disableMaster.ReturnMode = false;
      //   this.disableMaster.Account = false;
      //   this.disableMaster.Warehouse = false;
      //   this.disableMaster.CostCenter = false;
      //   this.disableMaster.Customer = false;
      //   this.disableMaster.FlatDisPer = false;
      //   this.disableMaster.FlatDisRs = false;
      // }
      // else {
      //   alert("No Refbill mode found in database. Please contact to Administrator")
      // }


    }
  
  }
  

}



