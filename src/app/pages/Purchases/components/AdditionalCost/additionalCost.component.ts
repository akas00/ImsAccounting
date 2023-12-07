import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Component, ViewChild, HostListener } from '@angular/core';
import { AdditionalCostService, Cost, prodCost } from "./addtionalCost.service";
import { TrnMain, Trntran } from "../../../../common/interfaces/TrnMain";
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from "@angular/forms";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ConsolidatedTrialBalanceReport } from '../../../ReportDialogs/Consolidated-Trial-Report/consolidated-trial-balance-report.component';
import { AuthService } from '../../../../common/services/permission';
import { MasterAdditionalComponent } from './masterPageAdditional.component';

@Component({
    selector: 'additionalCost',
    templateUrl: 'additionalCost.component.html',
    styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
    providers: []

})
export class additionalCostDetail {
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

    @ViewChild("genericGridACParty") genericGridACParty: GenericPopUpComponent;
    gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridCreditACListParty") genericGridCreditACListParty: GenericPopUpComponent;
    gridCreditACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridItem") genericGridItem: GenericPopUpComponent;
    gridItemPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridBatch") genericGridBatch: GenericPopUpComponent;
    gridBatchPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(
        public _addionalcostService: AdditionalCostService,
        private fb: FormBuilder,
        private masterService: MasterRepo,
        private _transactionService: TransactionService,
        public authservice: AuthService,
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
        this.form.patchValue({
            MCODE:this.masterService.mcode,
            DESCA:this.masterService.desca,
            BATCH:this.masterService.batch,
            BATCHID:this.masterService.batchid
        })
        // console.log("Hereby",this.form.value)
        // this._addionalcostService.costdetail = [];

        // this.masterService.addcosting = "true";

        if(this.PI == true && (this.form.controls.MCODE.value == "" || !this.form.controls.MCODE.value)){
            alert("Enter Item for Individual item cost type !");
            return;
        }
        
        if(this.PI == true && (this.form.controls.BATCH.value == "" || !this.form.controls.BATCH.value)){
            alert("Enter batch for Individual item cost type !");
            return;
        }
        if(this.PI == false && (this.GcostMode == '' || !this.GcostMode)){
            alert("Enter Group cost mode.");
            return;
        }
        if( this.PI == true && (this.form.controls.CREDITEDAC.value == "" || !this.form.controls.CREDITEDAC.value)){
            alert("Enter Credited Account for Individual item cost type !");
            return;
        }
       
        if (this.masterService.AdditionalAMOUNT == "" || !this.masterService.AdditionalAMOUNT) {
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
                    alert("Duplicate Additional Cost A/C !");
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

        if(this.masterService.AdditionalPurchaseCreditAcObj == null || this.masterService.AdditionalPurchaseCreditAcObj == "" || this.masterService.AdditionalPurchaseCreditAcObj == undefined){
            alert("Please enter credited A/C !");
            return;
        }
        //console.log("Hereby1",this.form.value.AdditionalPurchaseAc)
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
        if(this.PI == true){
            this.masterService.focusAnyControl("_item");
        }else{
            this.masterService.focusAnyControl("AdditionalCostAc_");
        }
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
            this.form.patchValue({
                REMARKS: ""
            })
        }
    }
    checkRow(index){
        // //console.log("ChecKVale",index)
    }
    TableRowDoubleClickEvent(l: any, index) {
        // //console.log("@data to be removed", l, index);

        if(!l.CostingNonCosting){
            this.masterService.addcosting = 'COSTING';
        }else{
            if (l.CostingNonCosting =='COSTING') {
                this.masterService.addcosting = 'COSTING';
            }
            else {
                this.masterService.addcosting = 'NONCOSTING';
                
            }
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

        this.form.patchValue({ AdditionalPurchaseAc: l.costAc, CREDITEDAC: l.creditAc, AMOUNT: l.amount, REMARKS: l.remarks, MCODE: l.mcode });
        this.masterService.AdditionalPurchaseAcObj = l.costAc.ACNAME;
        this.masterService.AdditionalPurchaseCreditAcObj = l.creditAc.ACNAME;
        // //console.log("AdditionalPurchaseAcObj",this.masterService.AdditionalPurchaseAcObj)
        // //console.log("AdditionalPurchaseCreditAcObj",this.masterService.AdditionalPurchaseCreditAcObj)

        this._addionalcostService.costList.splice(index,1);
        // this._addionalcostService.onDeleteCost(l);
        // this._transactionService.TrnMainObj.TrntranList.splice(index,1)
        
        this._transactionService.TrnMainObj.TrntranList = [];
        this._addionalcostService.addCostTotAmount = this._addionalcostService.addCostTotAmount - l.amount;
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
        var passingValue = '';
        if(name == 'CreditAC'){
            passingValue = 'AccountListAndSupplier'
            this.gridCreditACListPartyPopupSettings = this.masterService.getGenericGridPopUpSettings(passingValue);
            this.acTag = 'CreditAC'
            this.genericGridCreditACListParty.show();
        }
        else if(name == 'AC'){
            if(this.PI == true && (this.masterService.desca === undefined || this.masterService.desca === '' || this.masterService.desca === null)){
                alert("Please select item first!");
                return;
            }
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
            this.masterService.focusAnyControl("AmountsAD_")
            //console.log("reds",value,this.form.value.AdditionalPurchaseAc)
       


    }
    ACNameSelect_Credit(value, name) {
      
        // alert("ree333"+value+'A'+this.acTag)
        
            this.form.patchValue({ CREDITEDAC: value })
            this.masterService.AdditionalPurchaseCreditAcObj = value.ACNAME;
            this.genericGridCreditACListParty.hide();
            this.masterService.focusAnyControl("RemarksAD_")
            
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
    
}
