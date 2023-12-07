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

@Component({
    selector: 'newIndividualCost',
    templateUrl: 'newIndividualCost.component.html',
    styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
    providers: []

})
export class newIndividualCostDetail {
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
    NEWOBJ: prodCost = <prodCost>{}
    NEW_IndCostList: prodCost[] = [];// to hold the list of ind amount 
    selectedIndex: number;

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
            COSTING:[''],
            INDDATA:['']
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
        this.PI = true;
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
            this.PI=true;
            this.masterService.costType="IndividualCost";
            this.masterService.addcosting='COSTING';
            this.masterService.DoAccountPosting_2=1;
            this.masterService.IsTaxableBill_2=1;
            this.masterService.IS_ECA_ITEM_2=0;
            this.GcostMode == "Amount";
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
        this.PI=true; //false for ind costing
        this.masterService.addcosting = 'COSTING'; //always costing for ind cost
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
        // if(this.PI == false && this.GcostMode == ''){
        //     alert("Enter Group cost mode.");
        //     return;
        // }
        if( this.PI == true && this.form.controls.CREDITEDAC.value == ""){
            alert("Enter Credited Account for Individual item cost type !");
            return;
        }
        
        if (this.masterService.AdditionalAMOUNT_2 == ""||this.masterService.AdditionalAMOUNT_2 == null ||
        this.masterService.AdditionalAMOUNT_2==0) {
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
       
        // if(this.PI == false){
            for(const iterator of this._addionalcostService.costList){
                if((iterator.costAc.ACNAME == this.form.value.AdditionalPurchaseAc.ACNAME && (iterator.CostingNonCosting == 'COSTING' || iterator.CostingNonCosting == 'true'))
                || (iterator.costAc.ACNAME == this.form.value.AdditionalPurchaseAc.ACNAME && (iterator.CostingNonCosting == 'NONCOSTING' || iterator.CostingNonCosting == 'false') && this.masterService.addcosting == 'COSTING')){
                    alert("Duplicate Additional Cost A/C !");
                    return;
                }
            }
        // }
        // else if(this.PI == true){
        //     for(const iterator of this._addionalcostService.costList){
        //         if(iterator.costAc.ACNAME == this.form.value.AdditionalPurchaseAc.ACNAME 
        //             && iterator.mcode ==  this.form.value.MCODE
        //             && iterator.batch ==  this.form.value.BATCH){
        //             alert("Duplicate Additional Cost A/C and Item!");
        //             return;
        //         }
        //     }
        // }
        if(this.masterService.AdditionalPurchaseAcObj_2 ==  null || this.masterService.AdditionalPurchaseAcObj_2 == "" || this.masterService.AdditionalPurchaseAcObj_2 == undefined){
            alert("Please enter Additional cost A/C");
            return;
        }

        if(this.masterService.AdditionalPurchaseCreditAcObj_2 == null || this.masterService.AdditionalPurchaseCreditAcObj_2 == "" || this.masterService.AdditionalPurchaseCreditAcObj_2 == undefined){
            alert("Please enter credited A/C !");
            return;
        }

        if (this.masterService.RefObj.Ref_SupplierName_2  == null || this.masterService.RefObj.Ref_SupplierName_2  == "" || this.masterService.RefObj.Ref_SupplierName_2  == undefined) {
            this.masterService.RefObj.Ref_SupplierACID_2= "";
            this.REFSUPPLIERNAME="";
        }

        if (this.masterService.TDSAccount_Name_2 == null || this.masterService.TDSAccount_Name_2 == "" || this.masterService.TDSAccount_Name_2 == undefined) {
            this.masterService.TDSAccount_ACID_2 = "";
            this.masterService.TDSAmount_2 = 0;
            this.TDSACCOUNTNAME="";
        } else {
            if (this.masterService.TDSAccount_ACID_2 &&
                (this.masterService.TDSAmount_2 == null || this.masterService.TDSAmount_2 == "" || this.masterService.TDSAmount_2 == undefined || this.masterService.TDSAmount_2==0)) {
                alert("Please enter TDS Amount !");
                return;
            }

            if(this.masterService.TDSAccount_ACID_2 && this.masterService.TDSAmount_2>0){
                if(this.masterService.RefObj.Ref_SupplierACID_2 == null || this.masterService.RefObj.Ref_SupplierACID_2 == "" || this.masterService.RefObj.Ref_SupplierACID_2 == undefined ||
                this.masterService.RefObj.Ref_SupplierName_2 == null || this.masterService.RefObj.Ref_SupplierName_2 == "" || this.masterService.RefObj.Ref_SupplierName_2 == undefined){
                    alert("Please enter Supplier !");
                    return;
                }
            }
        }
        if (this.masterService.IsTaxableBill_2 == 1) {
            if (this.masterService.RefObj.Ref_BILLNO_2 == null || this.masterService.RefObj.Ref_BILLNO_2 == "" || this.masterService.RefObj.Ref_BILLNO_2 == undefined ||
                this.masterService.RefObj.Ref_TRNDATE_2 == null || this.masterService.RefObj.Ref_TRNDATE_2 == "" || this.masterService.RefObj.Ref_TRNDATE_2 == undefined ||
                this.masterService.RefObj.Ref_SupplierName_2 == null || this.masterService.RefObj.Ref_SupplierName_2 == "" || this.masterService.RefObj.Ref_SupplierName_2 == undefined) {
                alert("Ref Bill No, Ref Bill Date, Supplier Name is compulsory for taxable additional bill !");
                return;
            }
        }

        if(this._transactionService.userSetting.ENABLESUBLEDGER==1){
            if(this.masterService.DR_INDV_HASSUBLEDGER==1 && this.masterService.DR_SL_INDV_ACID==""){
                alert("Please, specify SUB LEDGER FOR A/C '" + this.form.value.AdditionalPurchaseAc.ACNAME+ "'");
                return;
            }
            if(this.masterService.CR_INDV_HASSUBLEDGER==1 && this.masterService.CR_SL_INDV_ACID==""){
                alert("Please, specify SUB LEDGER FOR A/C '" + this.form.value.CREDITEDAC.ACNAME+ "'");
                return;
            }
            if(this.masterService.TDS_INDV_HASSUBLEDGER==1 && this.masterService.TDS_SL_INDV_ACID==""){
                alert("Please, specify SUB LEDGER FOR A/C '" + this.TDSACCOUNTNAME+ "'");
                return;
            }
        }
        //console.log("Hereby1",this.form.value.AdditionalPurchaseAc)
        let res = <Cost>{}
        res.creditAc = this.form.value.CREDITEDAC;
        res.remarks = this.masterService.AdditionalREMARKS_2;
        res.costAc = this.form.value.AdditionalPurchaseAc;
        res.amount = this.masterService.AdditionalAMOUNT_2;
        res.mcode = this.form.value.MCODE
        res.desca = desca;
        res.batch = this.form.value.BATCH;
        res.batchid = this.form.value.BATCHID;
        res.CostingNonCosting = this.masterService.addcosting;
        res.Ref_BILLNO = this.masterService.RefObj.Ref_BILLNO_2;
        res.Ref_TRNDATE = this.masterService.RefObj.Ref_TRNDATE_2;
        res.Ref_SupplierName = this.REFSUPPLIERNAME;
        res.TDSAmount = this.masterService.TDSAmount_2;
        res.TDSAccount_ACID= this.masterService.TDSAccount_ACID_2;
        res.TDSAccount_Name = this.TDSACCOUNTNAME;
        res.AdditionalDesc = this.masterService.AdditionalDesc_2;
        res.IsTaxableBill = this.masterService.IsTaxableBill_2?this.masterService.IsTaxableBill_2:0;
        res.DoAccountPosting = this.masterService.DoAccountPosting_2?this.masterService.DoAccountPosting_2:0;
        res.Ref_SupplierVAT = this.masterService.RefObj.Ref_SupplierVAT_2;
        res.Ref_SupplierACID = this.masterService.RefObj.Ref_SupplierACID_2;
        res.Ref_BSDATE = this.masterService.RefObj.Ref_BSDATE_2;
        // res.IND_DATA=this.NEW_IndCostList;
        res.IS_ECA_ITEM = this.masterService.IS_ECA_ITEM_2?this.masterService.IS_ECA_ITEM_2:0;

        res.DR_SL_ACID = this.masterService.DR_SL_INDV_ACID;
        res.DR_SL_ACNAME = this.masterService.DR_SL_INDV_ACNAME;
        res.CR_SL_ACID = this.masterService.CR_SL_INDV_ACID;
        res.CR_SL_ACNAME = this.masterService.CR_SL_INDV_ACNAME;
        res.TDS_SL_ACID = this.masterService.TDS_SL_INDV_ACID;
        res.TDS_SL_ACNAME = this.masterService.TDS_SL_INDV_ACNAME;
        // console.log(' res.DR_SL_ACID',  res.DR_SL_ACID, res.DR_SL_ACNAME);
        // console.log('this.masterService.DR_SL_INDV_ACID', this.masterService.DR_SL_INDV_ACID)

        if(res.IsTaxableBill==0){
            res.AdditionalVAT = this.masterService.AdditionalVAT_2=0;
        }else{
            res.AdditionalVAT = this.masterService.AdditionalVAT_2;
        }


        // if(this.PI==false){
        //     res.CostingType = "Group Cost";
        // }
        // else{
            res.CostingType = "Ind Cost"
        // }

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
        if(this.PI == true){
            this.masterService.focusAnyControl("_item");
        }else{
            this.masterService.focusAnyControl("AdditionalCostAc_");
        }
           this.BatchList = [];
        //    this.ItemObj = {};
        // ////console.log("ChecKDATAA", this.masterService.AdditionalCostTrnTran)

        // console.log('check', this.masterService.TDS_SL_INDV_ACNAME ,  this._addionalcostService.INDcostList)
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
        this.masterService.AdditionalAMOUNT_2="";
        // if(this.PI == false){ // empty additionalcost a/c on  groupcost radio button selection
            this.masterService.AdditionalPurchaseAcObj_2 = '';
            this.masterService.AdditionalPurchaseAcObj_2_ACID = '';
            this.masterService.AdditionalPurchaseCreditAcObj_2 = '';
            this.masterService.AdditionalREMARKS_2="";
            this.masterService.AdditionalDesc_2="";
            this.masterService.AdditionalVAT_2=0;
            this.masterService.TDSAmount_2=0;
            this.masterService.TDSAccount_ACID_2="";
            this.masterService.TDSAccount_Name_2="";
            this.masterService.DoAccountPosting_2=1;
            this.masterService.IsTaxableBill_2=1;
            this.masterService.RefObj.Ref_BILLNO_2="";
            this.masterService.RefObj.Ref_TRNDATE_2="";
            this.masterService.RefObj.Ref_BSDATE_2="";
            this.masterService.RefObj.Ref_SupplierACID_2="";
            this.masterService.RefObj.Ref_SupplierName_2="";
            this.masterService.RefObj.Ref_SupplierVAT_2="";
            this.TDSACCOUNTNAME="";
            this.REFSUPPLIERNAME="";
            this.masterService.showIndividualAmountPopup=false;
            this._addionalcostService.tempIndCostList=[];
            this.NEW_IndCostList=[];
            this.masterService.TOTALINDAMOUNT=0;
            this.masterService.IS_ECA_ITEM_2=0;
            this.masterService.DR_SL_INDV_ACID='';
            this.masterService.DR_SL_INDV_ACNAME='';
            this.masterService.CR_SL_INDV_ACID='';
            this.masterService.CR_SL_INDV_ACNAME='';
            this.masterService.TDS_SL_INDV_ACID='';
            this.masterService.TDS_SL_INDV_ACNAME='';
            this.form.patchValue({
                REMARKS: "",
                INDDATA:[]
            })
        // }
    }
    checkRow(index){
        // //console.log("ChecKVale",index)
    }
    TableRowDoubleClickEvent(l: any) {
        // console.log("@data to be removed", l);
        if(this._transactionService.TrnMainObj.Mode=='VIEW'){
            return;
        }
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

        if(l.CostingType != "Ind Cost"){
            return;
        }
        this.form.patchValue({ AdditionalPurchaseAc: l.costAc, CREDITEDAC: l.creditAc, AMOUNT: l.amount, REMARKS: l.remarks, MCODE: l.mcode ,
            AdditionalDesc: l.AdditionalDesc, AdditionalVAT: l.AdditionalVAT, TDSAmount: l.TDSAmount,
            TDSAccount_Name: l.TDSAccount_Name, DoAccountPosting:l.DoAccountPosting, IsTaxableBill:l.IsTaxableBill});
        this.masterService.AdditionalPurchaseAcObj_2 = l.costAc.ACNAME;
        this.masterService.AdditionalPurchaseAcObj_2_ACID = l.costAc.ACID;
        this.masterService.AdditionalPurchaseCreditAcObj_2 = l.creditAc.ACNAME;
        this.masterService.AdditionalAMOUNT_2=l.amount;
        this.masterService.AdditionalREMARKS_2=l.remarks;
        this.masterService.TDSAmount_2=l.TDSAmount;
        this.masterService.TDSAccount_Name_2=l.TDSAccount_Name;
        this.masterService.AdditionalDesc_2=l.AdditionalDesc;
        this.masterService.AdditionalVAT_2=l.AdditionalVAT;
        this.masterService.IsTaxableBill_2=l.IsTaxableBill;
        this.masterService.DoAccountPosting_2=l.DoAccountPosting;
        this.masterService.RefObj.Ref_BILLNO_2=l.Ref_BILLNO;
        this.masterService.RefObj.Ref_TRNDATE_2=l.Ref_TRNDATE;
        this.masterService.RefObj.Ref_BSDATE_2=l.Ref_BSDATE;
        this.masterService.RefObj.Ref_SupplierACID_2=l.Ref_SupplierACID;
        this.masterService.RefObj.Ref_SupplierName_2=l.Ref_SupplierName;
        this.masterService.RefObj.Ref_SupplierVAT_2=l.Ref_SupplierVAT;
        this.masterService.TDSAccount_ACID_2=l.TDSAccount_ACID;
        this.masterService.IS_ECA_ITEM_2=l.IS_ECA_ITEM;
        this.TDSACCOUNTNAME=l.TDSAccount_Name;
        this.REFSUPPLIERNAME=l.Ref_SupplierName;
        this._addionalcostService.tempIndCostList=[];
        this.masterService.TOTALINDAMOUNT=0;
        this._addionalcostService.tempIndCostList=this._addionalcostService.IndividualCostList.filter(x=>x.additionalcostac==l.costAc.ACID); //l.IND_DATA;
        this.masterService.DR_SL_INDV_ACID=l.DR_SL_INDV_ACID;
        this.masterService.DR_SL_INDV_ACNAME=l.DR_SL_INDV_ACNAME;
        this.masterService.CR_SL_INDV_ACID=l.CR_SL_INDV_ACID;
        this.masterService.CR_SL_INDV_ACNAME=l.CR_SL_INDV_ACNAME;
        this.masterService.TDS_SL_INDV_ACID=l.TDS_SL_INDV_ACID;
        this.masterService.TDS_SL_INDV_ACNAME=l.TDS_SL_INDV_ACNAME;
        // this._addionalcostService.tempIndCostList.forEach(x => this.masterService.TOTALINDAMOUNT += x.indamount);
        // this.closeIndAmountPopup();
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
        this._addionalcostService.addINDCostTotAmount = this._addionalcostService.addINDCostTotAmount - l.amount;

        if(this._addionalcostService.header)
        this._addionalcostService.header.splice(this._addionalcostService.header.findIndex(x=>x.MAPPINGNAME==l.costAc.ACNAME),1)
        this._addionalcostService.DeleteDynamicColumn(l.costAc.ACNAME)
        // let selectedind_Data=this._addionalcostService.IndividualCostList.filter(x=>x.additionalcostac==l.costAc.ACID);
            // for(var i in selectedind_Data){
            //     let getindex=this._addionalcostService.IndividualCostList.findIndex(x=>x.additionalcostac==l.costAc.ACID);
            //     if(getindex>=0){
            //         this._addionalcostService.IndividualCostList.splice(getindex,1);
            //     }
            // }
            this.closeIndAmountPopup();
       
        
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
        let obj={ACID:value.ACID,ACNAME:value.ACNAME,HASSUBLEDGER:value.HASSUBLEDGER}
        this.form.patchValue({ AdditionalPurchaseAc: obj })
            this.masterService.AdditionalPurchaseAcObj_2 = value.ACNAME;
            this.masterService.AdditionalPurchaseAcObj_2_ACID = value.ACID;
            this.genericGridACParty.hide();
            this.masterService.DR_SL_INDV_ACID='';
            this.masterService.DR_SL_INDV_ACNAME='';
            this.masterService.AdditionalAMOUNT_2=0;
            this._addionalcostService.tempIndCostList=[];
            //console.log("reds",value,this.form.value.AdditionalPurchaseAc)
            this.masterService.DR_INDV_HASSUBLEDGER=value.HASSUBLEDGER;
            if(value.HASSUBLEDGER==1 && this._transactionService.userSetting.ENABLESUBLEDGER==1){  
                this.onsubLedgerTabDr(value);
            }else{
                this.masterService.focusAnyControl("AmountsAD_")
            }
       


    }
    ACNameSelect_Credit(value, name) {

        // alert("ree333"+value+'A'+this.acTag)
            let obj={ACID:value.ACID,ACNAME:value.ACNAME,HASSUBLEDGER:value.HASSUBLEDGER}
            this.form.patchValue({ CREDITEDAC: obj })
            this.masterService.AdditionalPurchaseCreditAcObj_2 = value.ACNAME;
            this.genericGridCreditACListParty.hide();

            this.masterService.CR_SL_INDV_ACID='';
            this.masterService.CR_SL_INDV_ACNAME='';

            this.masterService.CR_INDV_HASSUBLEDGER=value.HASSUBLEDGER;
            if(value.HASSUBLEDGER==1 && this._transactionService.userSetting.ENABLESUBLEDGER==1){ 
                this.onsubLedgerTabCr(value);
            }else{
                this.masterService.focusAnyControl("RemarksAD_");
            }
            
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

    IndAmountSelect() {
        if(this.masterService.RefObj.Refno === undefined || this.masterService.RefObj.Refno === '' || this.masterService.RefObj.Refno === null){
            alert("Please select ref. PI voucher first.");
            return;
        }
        if(this.masterService.AdditionalPurchaseAcObj_2 ==  null || this.masterService.AdditionalPurchaseAcObj_2 == "" || this.masterService.AdditionalPurchaseAcObj_2 == undefined){
            alert("Please enter Additional cost A/C");
            return;
        }

        if(this._addionalcostService.tempIndCostList.length == 0){
                    this._addionalcostService.tempIndCostList=this._addionalcostService.addtionalCostList;
                    this._addionalcostService.tempIndCostList.forEach(x => {
                        x.additionalcostac=this.form.value.AdditionalPurchaseAc.ACID,
                        x.indamount=0
                                });                            
        }
        this.masterService.TOTALINDAMOUNT=0;
        this._addionalcostService.tempIndCostList.forEach(x => this.masterService.TOTALINDAMOUNT += x.indamount);
        this.masterService.showIndividualAmountPopup=true;
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
    //     this.masterService.AdditionalPurchaseAcObj_2 = '';
    //     this.masterService.AdditionalPurchaseCreditAcObj_2 = '';
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
    //     this.masterService.RefObj.Ref_TRNDATE_2 = value.TRNDATE;
    //     this.masterService.RefObj.Ref_BSDATE_2 = value.BSDATE;

        
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
        this.masterService.TDSAccount_Name_2=value.ACNAME;
        this.masterService.TDSAccount_ACID_2=value.ACID;
        this.TDSACCOUNTNAME=value.ACNAME;
        this.masterService.TDS_SL_INDV_ACID='';
        this.masterService.TDS_SL_INDV_ACNAME='';

        this.masterService.TDS_INDV_HASSUBLEDGER=value.HASSUBLEDGER;
        if(value.HASSUBLEDGER==1 && this._transactionService.userSetting.ENABLESUBLEDGER==1){  
            this.onsubLedgerTabAc(value);
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
        if(value==true){
            this.masterService.IsTaxableBill_2=1;
            this.masterService.IS_ECA_ITEM_2=0;
        }else{
            this.masterService.IsTaxableBill_2=0;
            this.masterService.AdditionalVAT_2=0;
            if(this._transactionService.userSetting.SHOW_IMPORT_DOC_ITEM==1){
                this.masterService.IS_ECA_ITEM_2=1;
            }
        }

      }
      ChangeECA_ITEM(value){
        if(value==true ){
            this.masterService.IS_ECA_ITEM_2=1;
            this.masterService.IsTaxableBill_2=0;
        }else{
            this.masterService.IsTaxableBill_2=1;
            this.masterService.IS_ECA_ITEM_2=0;
        }

      }
      changeToBSDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.masterService.RefObj.Ref_BSDATE_2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
    }

    SupplierList(){
        this.gridPopupSettingsForSupplier = this.masterService.getGenericGridPopUpSettings("Supplier");
        this.genericGridSupplier.show();
    }

    onSupplierSelected(value){
        this.masterService.RefObj.Ref_SupplierACID_2 = value.ACID;
        this.masterService.RefObj.Ref_SupplierName_2 = value.ACNAME;
        this.masterService.RefObj.Ref_SupplierVAT_2 = value.VATNO?value.VATNO:value.GSTNO;
        this.REFSUPPLIERNAME=value.ACNAME;
    }

    CalculateTotalAmount(){
        this.masterService.TOTALINDAMOUNT =0;
        this._addionalcostService.tempIndCostList.forEach(x => this.masterService.TOTALINDAMOUNT += x.indamount);
    }
    
    closeIndAmountPopup(){
        this.masterService.showIndividualAmountPopup=false;
        this.NEW_IndCostList=[];
        // console.log("@@BEFORE.IndividualCostList",this._addionalcostService.IndividualCostList)
        let selectedind_Data=this._addionalcostService.IndividualCostList.filter(x=>x.additionalcostac==this.masterService.AdditionalPurchaseAcObj_2_ACID);
        for(var i in selectedind_Data){
            let getindex=this._addionalcostService.IndividualCostList.findIndex(x=>x.additionalcostac==this.masterService.AdditionalPurchaseAcObj_2_ACID);
            if(getindex>=0){
                this._addionalcostService.IndividualCostList.splice(getindex,1);
            }
        }
        // console.log("@@AFTER.IndividualCostList",this._addionalcostService.IndividualCostList)
        if (this._addionalcostService.tempIndCostList.length > 0) {
            this._addionalcostService.tempIndCostList.forEach(element => {
                this.NEWOBJ = <prodCost>{
                    mcode: "", menucode: "", desca: "", unit: "",
                    quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: "", indamount: 0
                                }
                this.NEWOBJ.mcode = element.mcode,
                    this.NEWOBJ.menucode = element.menucode,
                    this.NEWOBJ.desca = element.desca,
                    this.NEWOBJ.batch = element.batch,
                    this.NEWOBJ.rate = element.rate,
                    this.NEWOBJ.quantity = element.quantity,
                    this.NEWOBJ.amount = element.amount,
                    this.NEWOBJ.additionalcostac = element.additionalcostac,
                    this.NEWOBJ.batchid = element.batchid,
                    this.NEWOBJ.indamount = element.indamount
                    this.NEW_IndCostList.push(this.NEWOBJ);
            });
            this._addionalcostService.IndividualCostList.push.apply(this._addionalcostService.IndividualCostList,this.NEW_IndCostList);
            // console.log("@@FINALL.IndividualCostList",this._addionalcostService.IndividualCostList)
        }
        this.CalculateTotalAmount();
        // if(this._transactionService.TrnMainObj.Mode=="NEW"){
            this.masterService.AdditionalAMOUNT_2=this.masterService.TOTALINDAMOUNT;
        // }
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
        this.masterService.CR_SL_INDV_ACID=value.SL_ACID;
        this.masterService.CR_SL_INDV_ACNAME=value.SL_ACNAME;
        this.masterService.focusAnyControl("RemarksAD_");
       

      }
      onSubLedgerSelectAc(value) {
        // this.CrsubledgerValue =value.SL_ACNAME;
        this.masterService.TDS_SL_INDV_ACID=value.SL_ACID;
        this.masterService.TDS_SL_INDV_ACNAME=value.SL_ACNAME;
       

      }
      onSubLedgerSelectDr(value) {
        // console.log('checkselect',value)
        this.masterService.DR_SL_INDV_ACID=value.SL_ACID;
        this.masterService.DR_SL_INDV_ACNAME=value.SL_ACNAME;
        this.masterService.focusAnyControl("AmountsAD_")
        
       
      }

      keyPress(event: any) {
        if(event.key!="Enter" && event.key!="Tab"){
            event.preventDefault();
        }
    }

}
