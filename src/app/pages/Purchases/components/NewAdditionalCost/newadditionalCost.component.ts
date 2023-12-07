import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Component, ViewChild, HostListener } from '@angular/core';
import { TrnMain, Trntran } from "../../../../common/interfaces/TrnMain";
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from "@angular/forms";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AuthService } from '../../../../common/services/permission';
import { AdditionalCostService,Cost, prodCost } from '../AdditionalCost/addtionalCost.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
// import { NewAdditionalCostService, Cost } from './newAdditionalCost.service';

@Component({
    selector: 'newadditionalCost',
    templateUrl: 'newadditionalCost.component.html',
    styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
    providers: []

})
export class newadditionalCostDetail {
    DrsubledgerValue:any;
    CrsubledgerValue:any
    subLedgerAc:number;
    selectedIndex: number
    TrnMainObj: TrnMain
    form: FormGroup;
    majorParentAcList: any[] = [];
    costdata: any[] = [];
    TrnProdObj: any;
    allList: TAcList[] = [];
    private _selectedProd: any; // this is for the product selection in drop down
    GcostMode: any;
    allowRowAdd: boolean = false;
    public get selectedProd(): any {
        return this._selectedProd;
    }
    public set selectedProd(value: any) {

        this._selectedProd = value;

    }
    PI = true;
    PIList: any[] = [];
    PIADD = true;
    qty = true;
    // formdetail:any[];
    userSetting: any;
    TDSACCOUNTNAME:string;
    REFSUPPLIERNAME:string;
    ALLCHECKBOX:boolean;


    @ViewChild("genericGridACParty") genericGridACParty: GenericPopUpComponent;
    gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridCreditACListParty") genericGridCreditACListParty: GenericPopUpComponent;
    gridCreditACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridItem") genericGridItem: GenericPopUpComponent;
    gridItemPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridBatch") genericGridBatch: GenericPopUpComponent;
    gridBatchPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    // @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
    // gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
    gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("gridSubLedgerSettingListCr")gridSubLedgerSettingListCr: GenericPopUpComponent;
  gridSubLedgerSettingCr: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("gridSubLedgerSettingListDr")gridSubLedgerSettingListDr: GenericPopUpComponent;
  gridSubLedgerSettingDr: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("gridSubLedgerSettingListAc")gridSubLedgerSettingListAc: GenericPopUpComponent;
  gridSubLedgerSettingAc: GenericPopUpSettings = new GenericPopUpSettings();
  

    constructor(
        public _addionalcostService: AdditionalCostService,
        private fb: FormBuilder,
        private masterService: MasterRepo,
        private _transactionService: TransactionService,
        public authservice: AuthService,
        private loadingService: SpinnerService
    ) {
        this._transactionService.initialFormLoad(66);


        this.TrnMainObj = _addionalcostService.TrnMainObj;
        this.form = fb.group({
            CREDITEDAC: ['', Validators.required],
            AdditionalPurchaseAc: ['', Validators.required],
            AMOUNT: ['', Validators.required],
            REMARKS: [''],
            MCODE: [''],
            BYQUANTITY: [''],
            DESCA:[''],
            BATCH:[''],
            BATCHID: [''],
            COSTING:['']
        });
        // this.masterService.getpartyListTree()
        //     .subscribe(data => {
        //         let l = data
        //         this.majorParentAcList = l;
        //     });

        // this.masterService.getAccount('').subscribe(data => {
        //     this.allList = data;
        // }

        // )
        this.PI = false;
        this.PIADD = false;
        this.qty = false;
        this.IndividualPI(false);
        this.masterService.focusAnyControl("AdditionalCostAc_");
        // this.form.get('MCODE').disable();
        // this._transactionService.TrnMainObj.TrntranList.splice(-1);
        this.byQuantity("Amount");
        this._transactionService.DrillMode = "New";
        this.userSetting = authservice.getSetting();
    }



    ngOnInit() {
      
        this.PIList = this._addionalcostService.addtionalCostList;
        // ////console.log("PIList", this.PIList)
        //console.log("mode",this._transactionService.TrnMainObj.Mode)
        if(this._transactionService.TrnMainObj.Mode == 'NEW'){
            this.PI=false;
            this.masterService.costType="GroupCost";
            this.masterService.addcosting='COSTING';
            if(this.masterService.RefObj.PURCHASE_TYPE=="LOCALPURCHASE"){
                this.masterService.IsTaxableBill=0;
                this.masterService.DoAccountPosting=0;
            }else{
                this.masterService.IsTaxableBill=1;
                this.masterService.DoAccountPosting=1;
            }
            this.masterService.IS_ECA_ITEM=0;
            this.masterService.focusAnyControl("AdditionalCostAc_");
        }
    }
    ValuePI: any;
    ItemObj:any=<any>{}
    BatchList:any[]=[];
    passValue() {
        this.BatchList = [];
       
        this.ValuePI = 1;
        this.form.patchValue({
            MCODE:this.ItemObj.mcode,
            
           })
    for(let i of this._addionalcostService.addtionalCostList){
        if(i.menucode == this.ItemObj.mcode){
            this.BatchList.push(i);
        }
    }
        //console.log("valueObj1", this.BatchList)
    }
    onAddClick() {
        this.PI=false; //false for group costing
        this.form.patchValue({
            MCODE:this.masterService.mcode,
            DESCA:this.masterService.desca,
            BATCH:this.masterService.batch,
            BATCHID:this.masterService.batchid
        })
        // console.log("Hereby",this.form.value)
        // this._addionalcostService.costdetail = [];

        // this.masterService.addcosting = "true";
        // if(this.PI == true && this.form.controls.MCODE.value == ""){
        //     alert("Enter Item for Individual item cost type !");
        //     return;
        // }
        
        // if(this.PI == true && this.form.controls.BATCH.value == ""){
        //     alert("Enter batch for Individual item cost type !");
        //     return;
        // }
        if(this.PI == false && this.GcostMode == ''){
            alert("Enter Group cost mode.");
            return;
        }
        // if( this.PI == true && this.form.controls.CREDITEDAC.value == ""){
        //     alert("Enter Credited Account for Individual item cost type !");
        //     return;
        // }
       
        if (this.masterService.AdditionalAMOUNT == ""||this.masterService.AdditionalAMOUNT == null) {
            alert("Amount is required");
            return;
        }

        
      
        var desca = '';
        // console.log('addtionalCostList', this._addionalcostService.addtionalCostList, this._addionalcostService.addtionalCostList)
        for(let i of this._addionalcostService.addtionalCostList){
            if(i.mcode == this.form.value.MCODE){
                desca = i.desca
            }
        }
        // if (this.PI == false) {
        //     for (const iterator of this._addionalcostService.costList) {
        //         if (iterator.amount == "" || iterator.amount == null) {
        //             alert("Amount is required");
        //             return;
        //         }
        //     }
        // }
       
        if(this.PI == false){
            for(const iterator of this._addionalcostService.costList){
                if((iterator.costAc.ACNAME == this.form.value.AdditionalPurchaseAc.ACNAME && (iterator.CostingNonCosting == 'COSTING' || iterator.CostingNonCosting == 'true'))
                || (iterator.costAc.ACNAME == this.form.value.AdditionalPurchaseAc.ACNAME && (iterator.CostingNonCosting == 'NONCOSTING' || iterator.CostingNonCosting == 'false') && this.masterService.addcosting == 'COSTING')){
                    alert(`Duplicate Additional Cost A/C ${this.form.value.AdditionalPurchaseAc.ACNAME}!`);
                    return;
                }
            }
        }else if(this.PI == true){
            for(const iterator of this._addionalcostService.costList){
                if(iterator.costAc.ACNAME == this.form.value.AdditionalPurchaseAc.ACNAME 
                    && iterator.mcode ==  this.form.value.MCODE
                    && iterator.batch ==  this.form.value.BATCH){
                    alert("Duplicate Additional Cost A/C and Item!");
                    return;
                }
            }
        }
        if(this.masterService.AdditionalPurchaseAcObj ==  null || this.masterService.AdditionalPurchaseAcObj == "" || this.masterService.AdditionalPurchaseAcObj == undefined){
            alert("Please enter Additional cost A/C");
            return;
        }

        if(this.masterService.RefObj.PURCHASE_TYPE!="LOCALPURCHASE"){
            if(this.masterService.AdditionalPurchaseCreditAcObj == null || this.masterService.AdditionalPurchaseCreditAcObj == "" || this.masterService.AdditionalPurchaseCreditAcObj == undefined){
                alert("Please enter credited A/C !");
                return;
            }
        }

        if (this.masterService.RefObj.Ref_SupplierName  == null || this.masterService.RefObj.Ref_SupplierName  == "" || this.masterService.RefObj.Ref_SupplierName  == undefined) {
            this.masterService.RefObj.Ref_SupplierACID= "";
            this.REFSUPPLIERNAME="";
        }

        if (this.masterService.TDSAccount_Name == null || this.masterService.TDSAccount_Name == "" || this.masterService.TDSAccount_Name == undefined) {
            this.masterService.TDSAccount_ACID = "";
            this.masterService.TDSAmount = 0;
            this.TDSACCOUNTNAME="";
        } else {
            if (this.masterService.TDSAccount_ACID &&
                (this.masterService.TDSAmount == null || this.masterService.TDSAmount == "" || this.masterService.TDSAmount == undefined || this.masterService.TDSAmount==0)) {
                alert("Please enter TDS Amount !");
                return;
            }

            if(this.masterService.TDSAccount_ACID && this.masterService.TDSAmount>0){
                if(this.masterService.RefObj.Ref_SupplierACID == null || this.masterService.RefObj.Ref_SupplierACID == "" || this.masterService.RefObj.Ref_SupplierACID == undefined ||
                this.masterService.RefObj.Ref_SupplierName == null || this.masterService.RefObj.Ref_SupplierName == "" || this.masterService.RefObj.Ref_SupplierName == undefined){
                    alert("Please enter Supplier !");
                    return;
                }
            }
        }
        if(this.masterService.RefObj.PURCHASE_TYPE ==  'LOCALPURCHASE'){
            this.masterService.IsTaxableBill = 0;
            this.masterService.DoAccountPosting = 0;
            this.masterService.IS_ECA_ITEM=0;
            // if (this.masterService.IsTaxableBill == 1) {
            //     alert("Is Taxable should be 0 for local purchase!");
            //     return;
            // }

            // if (this.masterService.DoAccountPosting == 1) {
            //     alert("Do Account Posting should be 0 for local purchase!");
            //     return;
            // }
        }
        if (this.masterService.IsTaxableBill == 1) {
            if (this.masterService.RefObj.Ref_BILLNO == null || this.masterService.RefObj.Ref_BILLNO == "" || this.masterService.RefObj.Ref_BILLNO == undefined ||
                this.masterService.RefObj.Ref_TRNDATE == null || this.masterService.RefObj.Ref_TRNDATE == "" || this.masterService.RefObj.Ref_TRNDATE == undefined ||
                this.masterService.RefObj.Ref_SupplierName == null || this.masterService.RefObj.Ref_SupplierName == "" || this.masterService.RefObj.Ref_SupplierName == undefined) {
                alert("Ref Bill No, Ref Bill Date, Supplier Name is compulsory for taxable additional bill !");
                return;
            }
        }

        if(this._transactionService.userSetting.ENABLESUBLEDGER==1){
            if(this.masterService.DR_HASSUBLEDGER==1 && this.masterService.DR_SL_ACID==""){
                alert("Please, specify SUB LEDGER FOR A/C '" + this.form.value.AdditionalPurchaseAc.ACNAME+ "'");
                return;
            }
            if(this.masterService.CR_HASSUBLEDGER==1 && this.masterService.CR_SL_ACID==""){
                alert("Please, specify SUB LEDGER FOR A/C '" + this.form.value.CREDITEDAC.ACNAME+ "'");
                return;
            }
            if(this.masterService.TDS_HASSUBLEDGER==1 && this.masterService.TDS_SL_ACID==""){
                alert("Please, specify SUB LEDGER FOR A/C '" + this.TDSACCOUNTNAME+ "'");
                return;
            }
        }

        //console.log("Hereby1",this.form.value.AdditionalPurchaseAc)
        // console.log("##this.masterService.addcosting",this.masterService.addcosting)
        let res = <Cost>{}
        res.creditAc = this.form.value.CREDITEDAC;
        res.remarks = this.masterService.AdditionalREMARKS;
        res.costAc = this.form.value.AdditionalPurchaseAc;
        res.amount = this.masterService.AdditionalAMOUNT;
        res.mcode = this.form.value.MCODE
        res.desca = desca;
        res.batch = this.form.value.BATCH;
        res.batchid = this.form.value.BATCHID;
        res.CostingNonCosting = this.masterService.addcosting;
        res.Ref_BILLNO = this.masterService.RefObj.Ref_BILLNO;
        res.Ref_TRNDATE = this.masterService.RefObj.Ref_TRNDATE;
        res.Ref_SupplierName = this.REFSUPPLIERNAME;
        res.TDSAmount = this.masterService.TDSAmount;
        res.TDSAccount_ACID= this.masterService.TDSAccount_ACID;
        res.TDSAccount_Name = this.TDSACCOUNTNAME;
        res.AdditionalDesc = this.masterService.AdditionalDesc;
        res.IsTaxableBill = this.masterService.IsTaxableBill?this.masterService.IsTaxableBill:0;
        res.DoAccountPosting = this.masterService.DoAccountPosting?this.masterService.DoAccountPosting:0;
        res.Ref_SupplierVAT = this.masterService.RefObj.Ref_SupplierVAT;
        res.Ref_SupplierACID = this.masterService.RefObj.Ref_SupplierACID;
        res.Ref_BSDATE = this.masterService.RefObj.Ref_BSDATE;
        res.IS_ECA_ITEM = this.masterService.IS_ECA_ITEM?this.masterService.IS_ECA_ITEM:0;
        res.DR_SL_ACID = this.masterService.DR_SL_ACID;
        res.DR_SL_ACNAME = this.masterService.DR_SL_ACNAME;
        res.CR_SL_ACID = this.masterService.CR_SL_ACID;
        res.CR_SL_ACNAME = this.masterService.CR_SL_ACNAME;
        res.TDS_SL_ACID = this.masterService.TDS_SL_ACID;
        res.TDS_SL_ACNAME = this.masterService.TDS_SL_ACNAME;

        if(res.IsTaxableBill==0){
            res.AdditionalVAT = this.masterService.AdditionalVAT=0;
        }else{
            res.AdditionalVAT = this.masterService.AdditionalVAT;
        }


        if(this.PI==false){
            res.CostingType = "Group Cost";
        }
        else{
            res.CostingType = "Ind Cost"
        }

        // if (this.PI == false) {
        //     res.CostingNonCosting = 'COSTING';
        // }
        // else {
        //     res.CostingNonCosting ='NONCOSTING';
        // }

        // let checked_costValue = document.querySelector('input[value = "true"]:checked');
        // if (checked_costValue != null) {  //Test if something was checked
        //     res.CostingNonCosting = true;
            
            
        // } else {
        //     res.CostingNonCosting = false
            
        // }
        
        
        // ////console.log("checking group cost", this.form.value.BYQUANTITY)
        // if(this.form.value.BYQUANTITY == true){
           
        //     res.GCOSTMODE = "On Qty";
        // }
        // else if(this.form.value.BYQUANTITY == false){
        //     res.GCOSTMODE = "On Amount";
        // }
        // else{
        //     res.GCOSTMODE = "";
        // }
        if(this.GcostMode == "Qty"){
            res.GCOSTMODE = "On Qty";
            this.byQuantity("Qty");
        }else if(this.GcostMode == "Amount"){
            res.GCOSTMODE = "On Amount";
            this.byQuantity("Amount");
        }else{
            res.GCOSTMODE = "";
        }

        res.byQuanty = this.form.value.BYQUANTITY;
        //console.log("Hereby2",this.form.value.AdditionalPurchaseAc)
     //console.log("res$$",res,this.form.value.AdditionalPurchaseAc)

         this._addionalcostService.onAddCost(res);
        // this.AddDebit();
        // this.AddCredit();
        this.EmptyAddCost();
        if (this.ValuePI == 1)
            this.PIADD = true;

        //    this.form.patchValue({
        //     AdditionalPurchaseAc:''
        //    })
        //    this.masterService.AdditionalPurchaseAcObj = ''
        //    this.masterService.AdditionalPurchaseCreditAcObj = ''
        this.masterService.mcode= '';
        this.masterService.desca='';
        this.masterService.batch='';
        this.masterService.batchid='';
        // if(this.PI == true){
        //     this.masterService.focusAnyControl("_item");
        // }else{
            this.masterService.focusAnyControl("AdditionalCostAc_");
        // }
           this.BatchList = [];
        //    this.ItemObj = {};
        // ////console.log("ChecKDATAA", this.masterService.AdditionalCostTrnTran)
    }
    // AddDebit() {

    //     let x: Trntran = <Trntran>{};
       
    //     x.A_ACID = this.form.value.AdditionalPurchaseAc.ACID;
    //     x.AccountItem = this.form.value.AdditionalPurchaseAc;
    //     x.DRAMNT = this.form.value.AMOUNT;
    //     x.CRAMNT = 0;
    //     x.PartyDetails = [];
    //     x.ROWMODE = "new";
    //     x.inputMode = true;
    //     x.acitem = this.form.value.AdditionalPurchaseAc;
    //     this.masterService.AdditionalCostTrnTran.push(x);
    // }

    // AddCredit() {

    //     let y: Trntran = <Trntran>{};
        
    //     y.A_ACID = this.form.value.AdditionalPurchaseAc.ACID;
    //     y.AccountItem = this.form.value.CREDITEDAC;
    //     y.DRAMNT = 0;
    //     y.CRAMNT = this.form.value.AMOUNT;
    //     y.PartyDetails = [];
    //     y.ROWMODE = "new";
    //     y.inputMode = true;
    //     y.acitem = this.form.value.CREDITEDAC;
    //     this.masterService.AdditionalCostTrnTran.push(y);

    // }
    EmptyAddCost() {
        this.form.patchValue({
            // CREDITEDAC: "",
            // AdditionalPurchaseAc: "",
            AMOUNT: "",
            // REMARKS: "",
            MCODE: "",
            // BYQUANTITY:""
        })
        this.masterService.AdditionalAMOUNT="";
        if(this.PI == false){ // empty additionalcost a/c on  groupcost radio button selection
            this.masterService.AdditionalPurchaseAcObj = '';
            this.masterService.AdditionalPurchaseCreditAcObj = '';
            this.masterService.AdditionalREMARKS="";
            this.masterService.AdditionalDesc="";
            this.masterService.AdditionalVAT=0;
            this.masterService.TDSAmount=0;
            this.masterService.TDSAccount_ACID="";
            this.masterService.TDSAccount_Name="";
            this.masterService.DoAccountPosting=1;
            if(this.masterService.RefObj.PURCHASE_TYPE=="LOCALPURCHASE"){
                this.masterService.IsTaxableBill=0;
            }else{
                this.masterService.IsTaxableBill=1;
            }
            this.masterService.RefObj.Ref_BILLNO="";
            this.masterService.RefObj.Ref_TRNDATE="";
            this.masterService.RefObj.Ref_BSDATE="";
            this.masterService.RefObj.Ref_SupplierACID="";
            this.masterService.RefObj.Ref_SupplierName="";
            this.masterService.RefObj.Ref_SupplierVAT="";
            this.masterService.IS_ECA_ITEM=0;
            this.TDSACCOUNTNAME="";
            this.REFSUPPLIERNAME="";
            this.masterService.DR_SL_ACID='';
            this.masterService.DR_SL_ACNAME='';
            this.masterService.CR_SL_ACID='';
            this.masterService.CR_SL_ACNAME='';
            this.masterService.TDS_SL_ACID='';
            this.masterService.TDS_SL_ACNAME='';
            this.masterService.DR_HASSUBLEDGER=0;
            this.masterService.CR_HASSUBLEDGER=0;
            this.masterService.TDS_HASSUBLEDGER=0;
            // this.masterService.disable_DrSubLedger=true;
            // this.masterService.disable_CrSubLedger=true;
            this.form.patchValue({
                REMARKS: ""
            })
        }
    }
    checkRow(index){
        // //console.log("ChecKVale",index)
    }
    TableRowDoubleClickEvent(l: any) {
        // console.log("@data to be removed", l);

        if (l.CostingNonCosting =='COSTING') {
            this.masterService.addcosting = 'COSTING';
        }
        else {
            this.masterService.addcosting = 'NONCOSTING';
            
        }
        this.allowRowAdd = false;
        if(l.CostingType == "Group Cost"){
            this.masterService.costType="GroupCost";
            this.IndividualPI(false);
        }else if(l.CostingType == "Ind Cost"){
            this.masterService.costType="IndividualCost";
            this.IndividualPI(true);
        }

        if(l.GCOSTMODE == "On Qty"){
            ////console.log("inside on qty");
            this.GcostMode = 'Qty';
            this.byQuantity('Qty');
        }else if(l.GCOSTMODE == "On Amount"){
            this.GcostMode = 'Amount';
            this.byQuantity('Amount');

        }else{
            this.GcostMode = '';
            this.form.value.BYQUANTITY = null;
        }
        if(l.CostingType != "Group Cost"){
            return;
        }
        this.form.patchValue({ AdditionalPurchaseAc: l.costAc, CREDITEDAC: l.creditAc, AMOUNT: l.amount, REMARKS: l.remarks, MCODE: l.mcode ,
            AdditionalDesc: l.AdditionalDesc, AdditionalVAT: l.AdditionalVAT, TDSAmount: l.TDSAmount,
            TDSAccount_Name: l.TDSAccount_Name, DoAccountPosting:l.DoAccountPosting, IsTaxableBill:l.IsTaxableBill});
        this.masterService.AdditionalPurchaseAcObj = l.costAc.ACNAME;
        this.masterService.AdditionalPurchaseCreditAcObj = l.creditAc.ACNAME;
        this.masterService.AdditionalAMOUNT=l.amount;
        this.masterService.AdditionalREMARKS=l.remarks;
        this.masterService.TDSAmount=l.TDSAmount;
        this.masterService.TDSAccount_Name=l.TDSAccount_Name;
        this.masterService.AdditionalDesc=l.AdditionalDesc;
        this.masterService.AdditionalVAT=l.AdditionalVAT;
        this.masterService.IsTaxableBill=l.IsTaxableBill;
        this.masterService.DoAccountPosting=l.DoAccountPosting;
        this.masterService.RefObj.Ref_BILLNO=l.Ref_BILLNO;
        this.masterService.RefObj.Ref_TRNDATE=l.Ref_TRNDATE;
        this.masterService.RefObj.Ref_BSDATE=l.Ref_BSDATE;
        this.masterService.RefObj.Ref_SupplierACID=l.Ref_SupplierACID;
        this.masterService.RefObj.Ref_SupplierName=l.Ref_SupplierName;
        this.masterService.RefObj.Ref_SupplierVAT=l.Ref_SupplierVAT;
        this.masterService.TDSAccount_ACID=l.TDSAccount_ACID;
        this.TDSACCOUNTNAME=l.TDSAccount_Name;
        this.REFSUPPLIERNAME=l.Ref_SupplierName;
        this.masterService.IS_ECA_ITEM=l.IS_ECA_ITEM;
        this.masterService.DR_SL_ACID=l.DR_SL_ACID;
        this.masterService.DR_SL_ACNAME=l.DR_SL_ACNAME;
        this.masterService.CR_SL_ACID=l.CR_SL_ACID;
        this.masterService.CR_SL_ACNAME=l.CR_SL_ACNAME;
        this.masterService.TDS_SL_ACID=l.TDS_SL_ACID;
        this.masterService.TDS_SL_ACNAME=l.TDS_SL_ACNAME;
            // if(l.DR_SL_ACID){
            //     this.masterService.disable_DrSubLedger=false;
            // }
            // if(l.CR_SL_ACID){
            //     this.masterService.disable_CrSubLedger=false;
            // }




        // //console.log("AdditionalPurchaseAcObj",this.masterService.AdditionalPurchaseAcObj)
        // //console.log("AdditionalPurchaseCreditAcObj",this.masterService.AdditionalPurchaseCreditAcObj)
        let _getIndex = this._addionalcostService.costList.findIndex(x=>x.costAc.ACNAME == l.costAc.ACNAME)
        this._addionalcostService.costList.splice(_getIndex,1);
        this._addionalcostService.INDcostList=this._addionalcostService.costList.filter(x=>x.CostingType=="Ind Cost");
        this._addionalcostService.GRPcostList=this._addionalcostService.costList.filter(x=>x.CostingType=="Group Cost");
        // this._addionalcostService.onDeleteCost(l);
        // this._transactionService.TrnMainObj.TrntranList.splice(index,1)
        
        this._transactionService.TrnMainObj.TrntranList = [];
        this._addionalcostService.addCostTotAmount = this._addionalcostService.addCostTotAmount - l.amount;
        this._addionalcostService.addGRPCostTotAmount = this._addionalcostService.addGRPCostTotAmount - l.amount;

        if(this._addionalcostService.header)
        this._addionalcostService.header.splice(this._addionalcostService.header.findIndex(x=>x.MAPPINGNAME==l.costAc.ACNAME),1)
        this._addionalcostService.DeleteDynamicColumn(l.costAc.ACNAME)
       
        
    }

    public generateCostDetails() {
        this._addionalcostService.generateCostDetails();
    }

    IndividualPI(value) {
        this.PI = value
        if(this.PI==false){
            this.form.get('MCODE').disable();
            this.form.get('BATCH').disable();
            this.GcostMode ="Amount";
            this.form.value.BYQUANTITY = true;
            this.masterService.focusAnyControl("AdditionalCostAc_");
        }
        else if(this.PI == true){
            this.form.get('MCODE').enable();
            this.form.get('BATCH').enable();
            this.form.value.BYQUANTITY = null;
            this.GcostMode = "";
            // document.getElementById("_item").focus();
            this.masterService.focusAnyControl("_item");
        }
        this.form.patchValue({ MCODE: "",BATCH : value.BATCH });
        this.ItemObj = value.desca;
        // this.PIADD=true;

    }
    byQuantity(value) {
        // ////console.log("CheckForm1",value)
        if (value == "Qty") {
            this.form.value.BYQUANTITY = true;
            this.qty = true;
        }
        else if(value == "Amount") {
            this.form.value.BYQUANTITY = false;
            this.qty = false;
        }
        else{
            this.form.value.BYQUANTITY = null;
        }
        // ////console.log("CheckForm",this.form.value.BYQUANTITY)
    }
    acTag: any;

    TabAcBox(name) {
        //    this.genericGridRefBill.show();
        this.PI = false;
        var passingValue = '';
        if(name == 'CreditAC'){
            passingValue = 'AccountListAndSupplier'
            this.gridCreditACListPartyPopupSettings = this.masterService.getGenericGridPopUpSettings(passingValue);
            this.acTag = 'CreditAC'
            this.genericGridCreditACListParty.show();
        }
        else if(name == 'AC'){
            // if(this.PI == true && (this.masterService.desca === undefined || this.masterService.desca === '' || this.masterService.desca === null)){
            //     alert("Please select item first!");
            //     return;
            // }
            passingValue = 'AccountLedgerList';
            this.gridACListPartyPopupSettings = this.masterService.getGenericGridPopUpSettings(passingValue);
            this.acTag = 'AC'
            this.genericGridACParty.show();
        }



        

    }

    ACNameSelect_Additional(value, name) {
        // alert("ree123"+value+'A'+this.acTag)
        //console.log("value",value)
        this.form.patchValue({ AdditionalPurchaseAc: value })
            this.masterService.AdditionalPurchaseAcObj = value.ACNAME;
            this.genericGridACParty.hide();
            this.masterService.DR_SL_ACID='';
            this.masterService.DR_SL_ACNAME='';
            this.masterService.DR_HASSUBLEDGER=value.HASSUBLEDGER;
            if(value.HASSUBLEDGER==1 && this._transactionService.userSetting.ENABLESUBLEDGER==1){
                this.onsubLedgerTabDr(value);
                // this.masterService.disable_DrSubLedger=false;
            }else{
                // this.masterService.disable_DrSubLedger=true;
            }

            // this.masterService.focusAnyControl("Dr_Sub_ledger")
            //console.log("reds",value,this.form.value.AdditionalPurchaseAc)
       


    }
    ACNameSelect_Credit(value, name) {
      
        // alert("ree333"+value+'A'+this.acTag)

        this.form.patchValue({ CREDITEDAC: value })
            this.masterService.AdditionalPurchaseCreditAcObj = value.ACNAME;
            this.genericGridCreditACListParty.hide();
            this.masterService.CR_SL_ACID='';
            this.masterService.CR_SL_ACNAME='';
            this.masterService.CR_HASSUBLEDGER=value.HASSUBLEDGER;
            if(value.HASSUBLEDGER==1 && this._transactionService.userSetting.ENABLESUBLEDGER==1){
                // this.masterService.disable_CrSubLedger=false;
                this.onsubLedgerTabCr(value);
            }else{
                // this.masterService.disable_CrSubLedger=true;

            }
            // this.masterService.focusAnyControl("Cr_Sub_ledger");

    }

    onsubLedgerTabAc(i) {
        this.selectedIndex = i;
        this.gridSubLedgerSettingAc = {
          title: "SubLedger List",
          apiEndpoints: `/getSubLedgerPageList`,
          defaultFilterIndex: 1,
          columns: [
            {
              key: "SL_ACID",
              title: "SubLedger ID",
              hidden: false,
              noSearch: false
            },
            {
              key: "SL_ACNAME",
              title: "SubLedger Name",
              hidden: false,
              noSearch: false
            }
          ]
        };

        
        this.gridSubLedgerSettingListAc.show();
      }
    onsubLedgerTabDr(i) {
        this.selectedIndex = i;
        this.gridSubLedgerSettingDr = {
          title: "SubLedger List",
          apiEndpoints: `/getSubLedgerPageList`,
          defaultFilterIndex: 1,
          columns: [
            {
              key: "SL_ACID",
              title: "SubLedger ID",
              hidden: false,
              noSearch: false
            },
            {
              key: "SL_ACNAME",
              title: "SubLedger Name",
              hidden: false,
              noSearch: false
            }
          ]
        };

        
        this.gridSubLedgerSettingListDr.show();
      }
      
    onsubLedgerTabCr(i) {
        this.selectedIndex = i;
        this.gridSubLedgerSettingCr = {
          title: "SubLedger List",
          apiEndpoints: `/getSubLedgerPageList`,
          defaultFilterIndex: 1,
          columns: [
            {
              key: "SL_ACID",
              title: "SubLedger ID",
              hidden: false,
              noSearch: false
            },
            {
              key: "SL_ACNAME",
              title: "SubLedger Name",
              hidden: false,
              noSearch: false
            }
          ]
        };

        
        this.gridSubLedgerSettingListCr.show();
      }
      onSubLedgerSelectCr(value) {
        // this.CrsubledgerValue =value.SL_ACNAME;
        this.masterService.CR_SL_ACID=value.SL_ACID;
        this.masterService.CR_SL_ACNAME=value.SL_ACNAME;
       

      }
      onSubLedgerSelectAc(value) {
        // this.CrsubledgerValue =value.SL_ACNAME;
        this.masterService.TDS_SL_ACID=value.SL_ACID;
        this.masterService.TDS_SL_ACNAME=value.SL_ACNAME;
       

      }
      onSubLedgerSelectDr(value) {
        // console.log('checkselect',value)
        // this.DrsubledgerValue =value.SL_ACNAME;
        this.masterService.DR_SL_ACID=value.SL_ACID;
        this.masterService.DR_SL_ACNAME=value.SL_ACNAME;
        
       
        // if(this.subLedgerAc==1){
        //   this.masterService.tdsList[0].DESCA =value.SL_ACNAME;
        //   this.masterService.tdsList[0].ACID =value.SL_ACID;
        //   this.subLedgerAc=0
          
        // }else{
        //   this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACID = value.SL_ACID;
        //   this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SL_ACNAME = value.SL_ACNAME;
        //   this.focusNext(1, this.selectedIndex);
        // }
    
      }

      onSalesManSelect(value) {
        this._transactionService.TrnMainObj.TrntranList[this.selectedIndex].SALESMAN = value.NAME;
        this.masterService.focusAnyControl('narration_' + this.selectedIndex);
    
      }
    @HostListener("document: keydown", ["$event"])
    updown($event: KeyboardEvent){
        if($event.key == "Enter"){
            $event.preventDefault();
            
            if(this.form.valid && this.allowRowAdd === true){
                ////console.log("Enter pressed")
                // this.onAddClick();

            }
        }
    }

    focusTrigger(){
        this.allowRowAdd = true;
    }

    ItemSelect() {
        if(this.masterService.RefObj.Refno === undefined || this.masterService.RefObj.Refno === '' || this.masterService.RefObj.Refno === null){
            alert("Please select ref. PI voucher first.");
            return;
        }
        let _voucherno = this.masterService.RefObj.Refno;
        let vchrno = _voucherno.replace("/", "ZZ")

        this.gridItemPopupSettings = {
            title: "Item List ",
            apiEndpoints: `/getItemPagedListPIWise/${vchrno}/mcode`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'MCODE',
                    title: 'Code',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'DESCRIPTION',
                    title: 'Descritopnm',
                    hidden: false,
                    noSearch: false
                }
            ]
        };
        this.genericGridItem.show();
    }

    dblClickItemSelection(value) {
        this.masterService.desca = value.DESCRIPTION;
        this.masterService.mcode= value.MCODE;
        this.masterService.batch = "";
        this.masterService.batchid = "";
        let _voucherno = this.masterService.RefObj.Refno;
        this.masterService.getBatchOfItem(_voucherno, value.MCODE).subscribe(res => {
            if (res.status == 'ok') {
                //console.log("res", res.result)
                if (res.result && res.result.length == 1) {
                    this.masterService.batch = res.result[0].BATCH;
                    this.masterService.batchid = res.result[0].BATCHID;
                    // if (this.masterService.AdditionalPurchaseAcObj === "" || this.masterService.AdditionalPurchaseAcObj === null || this.masterService.AdditionalPurchaseAcObj === undefined) {
                        this.masterService.focusAnyControl("AdditionalCostAc_");
                    // } else {
                    //     this.masterService.focusAnyControl("AmountsAD_");
                    // }
                } else if (res.result && res.result.length > 1) {
                    this.masterService.focusAnyControl("_batch");
                }
            }
        })
    }

    BatchSelect() {

        if(this.masterService.batch != ""){
            return;
        }
        if(this.masterService.RefObj.Refno === undefined || this.masterService.RefObj.Refno === '' || this.masterService.RefObj.Refno === null){
            alert("Please select ref. PI voucher first.");
            return;
        }
        let _voucherno = this.masterService.RefObj.Refno;
        let vchrno = _voucherno.replace("/", "ZZ")
        if(this.masterService.mcode === undefined || this.masterService.mcode === '' || this.masterService.mcode === null){
            alert("Please select item first.");
            return;
        }
        let mcode = this.masterService.mcode;
        //console.log("@@DISPLAY",this.userSetting.DISPLAY)
        if(this.userSetting.DISPLAY == 1){
            this.gridBatchPopupSettings = {
                title: "Item List ",
                apiEndpoints: `/getItemPagedListPIWise/${vchrno}/${mcode}`,
                defaultFilterIndex: 0,
                columns: [
                    {
                        key: 'BATCH',
                        title: 'Batch',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'MfgDate',
                        title: 'MfgDate',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'ExpDate',
                        title: 'ExpDate',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'LANDINGCOST',
                        title: 'Rate',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'MRP',
                        title: 'Mrp',
                        hidden: false,
                        noSearch: false
                    }
                ]
            };
        }else{
            this.gridBatchPopupSettings = {
                title: "Item List ",
                apiEndpoints: `/getItemPagedListPIWise/${vchrno}/${mcode}`,
                defaultFilterIndex: 0,
                columns: [
                    {
                        key: 'BATCH',
                        title: 'Batch',
                        hidden: false,
                        noSearch: false
                    }
                ]
            };
        }
        
        this.genericGridBatch.show();
    }

    dblClickBatchSelection(value) {
        this.masterService.batch = value.BATCH;
        this.masterService.batchid = value.BATCHID;
        // if (this.masterService.AdditionalPurchaseAcObj === "" || this.masterService.AdditionalPurchaseAcObj === null || this.masterService.AdditionalPurchaseAcObj === undefined) {
            this.masterService.focusAnyControl("AdditionalCostAc_");
        // } else {
        //     this.masterService.focusAnyControl("AmountsAD_");
        // }
    }

    remarksEntered(){
        if(this.PI == true){
            this.onAddClick();
        }
    }

    gcostEntered(){
        if(this.PI == false){
            this.onAddClick();
        }
    }

    // TabRefBill() {
    //     //console.log("@@PURCHASE_TYPE",this.masterService.RefObj.PURCHASE_TYPE,this._trnMainService.userSetting.ENABLELOCALPURCHASE)
    //     if(this._transactionService.userSetting.ENABLELOCALPURCHASE==0){
    //       this.masterService.RefObj.PURCHASE_TYPE='ALL';
    //     }else{
    //       if(this._transactionService.userSetting.ENABLELOCALPURCHASE==1 && !this.masterService.RefObj.PURCHASE_TYPE){
    //         this.masterService.RefObj.PURCHASE_TYPE='ALL';
    //       }
    //     }
    //     this.gridPopupSettingsForRefBill = this.masterService.getGenericGridPopUpSettingsForAdditionalCost("AdditionalCost",this.masterService.RefObj.PURCHASE_TYPE);
    //     this.genericGridRefBill.show();
    //   }

    //   onRefBillSelected(value) {
    //     // alert("reached")
    //     this.masterService.AdditionalPurchaseAcObj = '';
    //     this.masterService.AdditionalPurchaseCreditAcObj = '';
    //     this.masterService.mcode= '';
    //     this.masterService.desca='';
    //     this.masterService.batch='';
    //     this.masterService.batchid='';
    
    //     this.masterService.RefObj.Refno = value.VCHRNO;
    //     this.masterService.RefObj.disable = true;
    //     this._transactionService.TrnMainObj.REFBILL = value.VCHRNO;
    //     this.masterService.RefObj.InvoiceNo = value.REFBILL;
    //     this.masterService.RefObj.SupplierName = value.ACNAME;
    //     this._transactionService.TrnMainObj.PARAC=value.PARAC;
    //     this.masterService.RefObj.SupplierVAT = value.BILLTOTEL;
    //     this.masterService.RefObj.Ref_TRNDATE = value.TRNDATE;
    //     this.masterService.RefObj.Ref_BSDATE = value.BSDATE;

        
    //     this.getAdditionalCost(value)
    //     this.masterService.focusAnyControl("_AdditioanlCostRate"+0)
    //   }

      TabTDSAccount(){
        let TRNMODE = "TDS";
        this.gridACListPopupSettings = {
            title: "Accounts",
            apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,
            defaultFilterIndex: 1,
            columns: [
              {
                key: "ACCODE",
                title: "AC CODE",
                hidden: false,
                noSearch: false
              },
              {
                key: "ACNAME",
                title: "A/C NAME",
                hidden: false,
                noSearch: false
              }
            ]
          };
      
          this.genericGridACList.show();
      }

      onAcSelect(value){
        this.masterService.TDSAccount_Name=value.ACNAME;
        this.masterService.TDSAccount_ACID=value.ACID;
        this.TDSACCOUNTNAME=value.ACNAME;
        this.masterService.TDS_SL_ACID='';
        this.masterService.TDS_SL_ACNAME='';
        this.masterService.TDS_HASSUBLEDGER=value.HASSUBLEDGER;
        if(value.HASSUBLEDGER==1 && this._transactionService.userSetting.ENABLESUBLEDGER==1){ 
            this.onsubLedgerTabAc(value);
        }else{
        }
      }
    
    //   getAdditionalCost(value) {
    //     this.loadingService.show("please wait. Getting purchase invoice data..")
    //     let VCHR = value.VCHRNO
    //     let division = value.DIVISION;
    //     let phiscalid= this.masterService.PhiscalObj.PhiscalID;

    //     this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(data => {
    //       if (data) {
    //         try {
    //           ////console.log("additionalCostDataLoaded",data.result)
    //           this._addionalcostService.costList = [];
    //           this._addionalcostService.costdetail = [];
    //           this._addionalcostService.addtionalCostList = [];
    //           this._addionalcostService.addCostTotAmount = 0;
    //           //console.log("@@data.result.ProdList",data.result.ProdList)
    //           var result = data.result.ProdList.filter((elem1, i) => data.result.ProdList.some((elem2, j) => (elem2.MCODE === elem1.MCODE)
    //              && (elem2.BATCHID == elem1.BATCHID) && j !== i));
    //           //console.log("@@PI__result:", result);
    
    //         let acs1: prodCost = <prodCost>{ mcode: "", menucode: "", desca: "", unit: "",
    //                                         quantity: 0, rate: 0,amount: 0, nAmount: 0, batch:"",batchid:"" }
    //         if(result.length>0){
    //             result.forEach(element => {
    //               acs1.mcode=element.MCODE,
    //               acs1.menucode=element.MENUCODE,
    //               acs1.desca=element.ITEMDESC,
    //               acs1.unit=element.UNIT,
    //               acs1.batch=element.BATCH,
    //               acs1.rate=element.RATE,
    //               acs1.quantity=element.REALQTY_IN+acs1.quantity,
    //               acs1.amount=element.AMOUNT+acs1.amount,
    //               acs1.nAmount=element.NETAMOUNT+acs1.nAmount,
    //               acs1.batchid=element.BATCHID
    //             });
    //             this._addionalcostService.addtionalCostList.push(acs1);
    
    //             var result2 = data.result.ProdList.filter((elem1, i) => result.some((elem2, j) => (elem2.MCODE != elem1.MCODE || elem2.BATCHID != elem1.BATCHID)  && j !== i));
    //             if(result2.length > 0 ){
    //               //console.log("@@mcodediff_ac2",result2)
    //               for (let i of result2) {
    //                 var acs: prodCost = <prodCost>{
    //                   mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
    //                   quantity: i.REALQTY_IN, 
    //                   rate: i.RATE,
    //                    amount: i.AMOUNT, 
    //                    nAmount: i.NETAMOUNT, batch:i.BATCH, batchid:i.BATCHID
    //                 };
    //                 this._addionalcostService.addtionalCostList.push(acs);
    //               }
    //             }
    //         }
    
    //           if(this._addionalcostService.addtionalCostList.length==0){
    //             //console.log("@@ac2")
    //           for (let i of data.result.ProdList) {
    //             var acs: prodCost = <prodCost>{
    //               mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
    //               quantity: i.REALQTY_IN, 
    //               rate: i.RATE,
    //                amount: i.AMOUNT, 
    //                nAmount: i.NETAMOUNT, batch:i.BATCH,batchid:i.BATCHID
    //             };
    //             this._addionalcostService.addtionalCostList.push(acs);
    //           }
    //         }
    //           this.masterService.batch = data.result.ProdList && data.result.ProdList.length>0 && data.result.ProdList[0].BATCH;
    //           //total amount
    //           this._addionalcostService.loadedTrnmain = data.result;
    //           this.loadingService.hide();
    //         }
    //         catch (ex) { }
    
    //       }
    //       else {
    //         alert("Cannot Get Data from Bill no.")
    //       }
    //     })
    
    
    //   }

      ChangeIsTaxableBill(value){
        if(value==true ){
            this.masterService.IsTaxableBill=1;
            this.masterService.IS_ECA_ITEM=0;
        }else{
            this.masterService.IsTaxableBill=0;
            this.masterService.AdditionalVAT=0;
            if(this._transactionService.userSetting.SHOW_IMPORT_DOC_ITEM==1){
                this.masterService.IS_ECA_ITEM=1;
            }
        }

      }
      ChangeECA_ITEM(value){
        if(value==true ){
            this.masterService.IS_ECA_ITEM=1;
            this.masterService.IsTaxableBill=0;
        }else{
            this.masterService.IsTaxableBill=1;
            this.masterService.IS_ECA_ITEM=0;
        }

      }
      changeToBSDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.masterService.RefObj.Ref_BSDATE = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
    }

    SupplierList(){
        this.gridPopupSettingsForSupplier = this.masterService.getGenericGridPopUpSettings("Supplier");
        this.genericGridSupplier.show();
    }

    onSupplierSelected(value){
        this.masterService.RefObj.Ref_SupplierACID = value.ACID;
        this.masterService.RefObj.Ref_SupplierName = value.ACNAME;
        this.masterService.RefObj.Ref_SupplierVAT = value.VATNO?value.VATNO:value.GSTNO;
        this.REFSUPPLIERNAME=value.ACNAME;
    }

    ok() {
        let abc = this.masterService.pi_costdetaillist;
        // if(abc && abc.length==0){
        //     alert("Please select any one row to load!");
        //     return;
        // }
        this.masterService.showCostPopup = false;
        for(let data of abc){
            this.form.patchValue({ AdditionalPurchaseAc: data })
            this.masterService.AdditionalPurchaseAcObj = data.ACNAME;
            this.masterService.AdditionalAMOUNT = data.AMOUNT;
            this.masterService.costType = "GroupCost";
            this.masterService.addcosting = 'COSTING';
            this.masterService.DoAccountPosting = 0;
            this.masterService.IsTaxableBill = 0;
            this.masterService.IS_ECA_ITEM = 0;
            if(this._transactionService.userSetting.ENABLESUBLEDGER==1){
                this.masterService.DR_SL_ACID=data.SL_ACID;
                this.masterService.DR_SL_ACNAME=data.SL_ACNAME;
            }
            this.onAddClick();
        }
        
    }

    cancel(){
        this.masterService.showCostPopup = false;
    }

    selectAllCheckboxes(){
        // console.log("@@ALLCHECKBOX",this.ALLCHECKBOX)
        if(this.ALLCHECKBOX==true){
            this.masterService.pi_costdetaillist.forEach(x=>x.checkbox=true);
        }else{
            this.masterService.pi_costdetaillist.forEach(x=>x.checkbox=false);
        }
    }
}
