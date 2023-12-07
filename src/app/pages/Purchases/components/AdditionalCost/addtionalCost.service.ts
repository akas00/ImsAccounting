import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// data for additional cost
export interface Cost {
    sno: number;
    costAc: TAcList;
    creditAc: TAcList;
    remarks: string;
    amount: any;
    byQuanty: boolean;
    mcode: string;
    GCOSTMODE: string;
    CostingType: string;
    desca: string;
    batch: string;
    batchid: string;
    CostingNonCosting: any;
    CostingNonCostingValue: any;
    Ref_BILLNO:string;
    Ref_TRNDATE:string;
    Ref_SupplierName:string;
    TDSAmount:string;
    TDSAccount_ACID:string;
    TDSAccount_Name:string;
    AdditionalDesc:string;
    AdditionalVAT:number;
    IsTaxableBill:any;
    DoAccountPosting:any;
    Ref_SupplierVAT:string;
    Ref_SupplierACID:string;
    Ref_BSDATE:string;
    // IND_DATA:prodCost[];
    IS_ECA_ITEM:any;
    ADDITIONALAMOUNT_DATA:any[];
    DR_SL_ACID:string;
    DR_SL_ACNAME:string;
    CR_SL_ACID:string;
    CR_SL_ACNAME:string;
    TDS_SL_ACID:string;
    TDS_SL_ACNAME:string;
}
//data for productwise cost
export interface prodCost {
    mcode: string;
    menucode: string;
    desca: string;
    unit: string;
    quantity: number;
    rate: any;
    amount: number;
    exchageRate: number;
    nAmount: number;
    listAdditionalCost: Cost[];
    batch: string;
    batchid:string;
    CostPerUnit:number;
    Total:number;
    // refno:string;
    // suppliername:string;
    // refInvNo:string;
    indamount: number;
    additionalcostac:string;
    sno:number;
}

import { Injectable } from '@angular/core'
import { IMPORT_DETAILS, IMPORT_DETAILS_PROD, TrnMain, Trntran } from "../../../../common/interfaces/TrnMain";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { IDivision } from '../../../../common/interfaces/commoninterface.interface';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { importdocument } from '../../../../common/interfaces/AddiitonalCost.interface';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { Column } from 'primeng/primeng';
import { Subject } from 'rxjs/Subject';
import { xor } from 'lodash';
import { RequestOptions,Headers, Http } from '@angular/http';
import { GlobalState } from '../../../../global.state';
import { AuthService } from '../../../../common/services/permission';
// import { TransactionService } from '../../../../common/Transaction Components/transaction.service';

@Injectable()
export class AdditionalCostService {
    TrnMainObj: TrnMain = <TrnMain>{};
    pageHeading: string;
    prefix: PREFIX = <PREFIX>{};
    division: IDivision = <IDivision>{};
    addtionalCostList: prodCost[] = [];// to hold the list of product along with cost
    costList: Cost[] = [];//to hold the list of all the costs
    costdetail: any[] = [];
    TrnMainList: TrnMain[] = [];
    header: any[] = [];
    public ReturnDataObjectSubject = new Subject<{}>();
    public ObservableReturnData = this.ReturnDataObjectSubject.asObservable();
    // [{ TITLE: 'MENUCODE', MAPPINGNAME: 'menucode' }, 
    // { TITLE: 'Description', MAPPINGNAME: 'desca' }, 
    // { TITLE: 'UNIT', MAPPINGNAME: 'unit' }, 
    // { TITLE: 'RATE', MAPPINGNAME: 'rate' }, 
    // {TITLE: 'QTY', MAPPINGNAME: 'quantity' }, 
    // { TITLE: 'GROSS Amt', MAPPINGNAME: 'amount' },
    // {TITLE :'Total', MAPPINGNAME:'total'},
    // {TITLE :'Cost Per Unit', MAPPINGNAME:'costperunit'}];

    getDivision: any;
    loadedTrnmain: TrnMain = <TrnMain>{};
    trnmainBehavior: BehaviorSubject<TrnMain> = new BehaviorSubject(<TrnMain>{})
    loadDataObservable: Observable<TrnMain> = this.trnmainBehavior.asObservable();
    addCostTotAmount: any = 0;
    public viewDate = new Subject<any>();
    IMPORTDETAILS: IMPORT_DETAILS = <IMPORT_DETAILS>{};
    IMPORT_DETAILS_PROD: IMPORT_DETAILS_PROD[] = []
    type: any;
    IndividualCostList: prodCost[] = [];// to hold the list of ind amount 
    tempIndCostList: prodCost[] = [];// to hold the list of temp ind amount 
    INDcostList: Cost[] = [];//to hold the list of all the ind costs
    GRPcostList: Cost[] = [];//to hold the list of all the group costs
    addINDCostTotAmount: any = 0;
    addGRPCostTotAmount: any = 0;


    constructor(public masterService: MasterRepo, private loadingService: SpinnerService,
        private state: GlobalState,private http: Http,private authService: AuthService) {

    }
    public loadPurchase(vchrno: string, division: string, phiscalid: string) {
        let postData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalid }
        this.masterService.getList(postData, '/getViewVoucher').subscribe(data => {
            if (data.status == 'ok') {
                // ////console.log("LoadPurchase1", data)
                this.addtionalCostList.push(data.result.prodList);
                // ////console.log("LoadPurchase", this.addtionalCostList)
            }
            // this.addtionalCostList.push(data);


        })
    }
    loadAdditionalCost(value) { //saved AD view/edit ma call hune function
        this.loadingService.show("please wait. Getting purchase invoice data..")
        //  this.additionalCostService.loadPurchase(value,this.form.value.DIVISION.INITIAL,this.phiscalid)
        let VCHR = value.VCHRNO
        let division = value.DIVISION;
        let phiscalid = this.masterService.PhiscalObj.PhiscalID;
        // ////console.log("vchr,Div,Phis", VCHR, division, phiscalid,this.masterService.PhiscalObj.phiscalID,this.masterService.userProfile);

        // this._trnMainService.trnmainBehavior= new BehaviorSubject(<TrnMain>{});
        //   this._trnMainService.loadData(VCHR, division, phiscalid);
        this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(data => {
            if (data) {
                try {

                    this.masterService.loadedTrnmain = data.result;
                    if (this.masterService.userSetting.EnableRateEditInAddCosting == 1) {
                        this.IMPORTDETAILS = data.result.IMPORTDETAILS;
                    }
                    // console.log("@@data.result.AdditionalCostJson",data.result.AdditionalCostJson)
                    var returnDataList = JSON.parse(data.result.AdditionalCostJson);
                    // //console.log("CheckLLL@", returnDataList, data.result)
                    this.costList = [];
                    this.costdetail = [];
                    this.addtionalCostList = [];
                    this.loadedTrnmain.TOTAMNT = 0;
                    this.addCostTotAmount = 0;
                    this.addINDCostTotAmount = 0;
                    this.addGRPCostTotAmount = 0;
                    // var addPurchaseObj: prodCost = <prodCost>{};
                    // this._additionalCostService.addtionalCostList = JSON.parse(data.result.AdditionalCostJson)
                    //console.log("returnDataList", returnDataList)
                    var nobatchid = returnDataList.filter(x => x.batchid == null);
                    // console.log("@@nobatchid", nobatchid)
                    if (nobatchid.length > 0) {
                        var vchrnodatalist = [];
                        this.masterService.getBatchidVoucherwise(data.result.REFBILL).subscribe(
                            (res: any) => {
                                //console.log("@@res", res)
                                if (res.status == "ok") {
                                    //console.log("@@res", res.result)
                                    vchrnodatalist = res.result;
                                    returnDataList.forEach(element => {
                                        let acs1: prodCost = <prodCost>{
                                            mcode: "", menucode: "", desca: "", unit: "",
                                            quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: "",
                                            CostPerUnit: 0, Total: 0, sno:0
                                        }
                                        acs1.mcode = element.mcode,
                                            acs1.menucode = element.menucode,
                                            acs1.desca = element.desca,
                                            acs1.unit = element.unit,
                                            acs1.batch = element.batch,
                                            acs1.rate = element.rate,
                                            acs1.quantity = element.quantity,
                                            acs1.amount = element.amount,
                                            acs1.nAmount = element.nAmount,
                                            acs1.batchid = vchrnodatalist && vchrnodatalist.length > 0 && vchrnodatalist.filter(x => x.mcode == element.mcode && x.batch == element.batch)[0].batchid,
                                            acs1.listAdditionalCost = element.listAdditionalCost,
                                            acs1.CostPerUnit = element.CostPerUnit,
                                            acs1.Total = element.Total,
                                            acs1.sno = element.sno
                                            // //console.log("@@_acs1", acs1)
                                            this.addtionalCostList.push(acs1);
                                    });
                                    //console.log("@@1after_resultacs", this.addtionalCostList)

                                    this.addtionalCostList[0].listAdditionalCost = returnDataList[0].listAdditionalCost;
                                    for (let i of returnDataList) {
                                        this.costList = i.listAdditionalCost;
                                        this.loadedTrnmain.TOTAMNT += i.amount;
                                        this.INDcostList=this.costList.filter(x=>x.CostingType=="Ind Cost");
                                        this.GRPcostList=this.costList.filter(x=>x.CostingType=="Group Cost");

                                    }
                                    //console.log("CheckCkec", this.costList)
                                    if (data.result.ImportDocument) {
                                        this.masterService.importDocumentDetailsObj = data.result.ImportDocument;
                                        this.masterService.importDocumentDetailsObj.PPNO = data.result.IMPORTDETAILS.DOCUMENTNO;
                                        this.masterService.importDocumentDetailsObj.LCNO = data.result.IMPORTDETAILS.LCNUM;
                                    }
                                    for (let x of this.addtionalCostList[0].listAdditionalCost) {
                                        this.addCostTotAmount = this.addCostTotAmount + x.amount;
                                    }
                                    for (let y of this.INDcostList) {
                                        this.addINDCostTotAmount = this.addINDCostTotAmount + y.amount;
                                    }
                                    for (let z of this.GRPcostList) {
                                        this.addGRPCostTotAmount = this.addGRPCostTotAmount + z.amount;
                                    }
                                    this.masterService.RefObj.Refno = data.result.REFBILL;
                                    this.masterService.RefObj.InvoiceNo = data.result.REFORDBILL;
                                    this.masterService.RefObj.SupplierName = data.result.BILLTO;
                                    this.masterService.RefObj.DIVISION=data.result.DIVISION;
                                    this.masterService.RefObj.PHISCALID=data.result.PhiscalID;
                                    this.loadingService.hide();
                                    this.generateCostDetailsFromData();
                                    this.viewDate.next();
                                    this.ReturnDataObjectSubject.next(data.result);
                                    return;
                                } else {
                                }
                            },
                            error => {
                                //console.log("err",error);
                            }
                        )
                    } else {

                        var result = returnDataList.filter((elem1, i) => returnDataList.some((elem2, j) => (elem2.mcode === elem1.mcode)
                            && (elem2.batchid == elem1.batchid) && j !== i));
                                                    //console.log("@@view_result:", result);
                                                    let acs1: prodCost = <prodCost>{
                                                        mcode: "", menucode: "", desca: "", unit: "",
                                                        quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: "", sno:0
                                                    }
                                                    if (result.length > 0) {
                            result.forEach(element => {
                                acs1.mcode = element.mcode,
                                    acs1.menucode = element.menucode,
                                    acs1.desca = element.desca,
                                    acs1.unit = element.unit,
                                    acs1.batch = element.batch,
                                    acs1.rate = element.rate,
                                    acs1.quantity = element.quantity + acs1.quantity,
                                    acs1.amount = element.amount + acs1.amount,
                                    acs1.nAmount = element.nAmount + acs1.nAmount,
                                    acs1.batchid = element.batchid,
                                    element.listAdditionalCost = element.listAdditionalCost,
                                    acs1.sno = element.sno
                            });
                            //console.log("@@after_resultacs",result)
                            this.addtionalCostList.push(acs1);
                            this.addtionalCostList[0].listAdditionalCost = result[0].listAdditionalCost;


                            var result2 = data.result.ProdList.filter((elem1, i) => result.some((elem2, j) => (elem2.mcode != elem1.mcode || elem2.batchid != elem1.batchid) && j !== i));
                            if (result2.length > 0) {
                                //console.log("@@view_mcodediff_ac2")
                                // console.log("@@", data.result.ProdList)
                                for (let i of data.result.ProdList) {
                                    var acs: prodCost = <prodCost>{
                                        mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
                                        quantity: i.REALQTY_IN,
                                        rate: i.RATE,
                                        amount: i.AMOUNT,
                                        // rate: i.CRATE ? i.CRATE : i.RATE,
                                        // amount: i.CRATE ? i.CRATE * i.REALQTY_IN : i.AMOUNT,
                                        nAmount: i.NETAMOUNT, batch: i.BATCH, batchid: i.BATCHID, sno : i.SNO
                                    };
                                    this.addtionalCostList.push(acs);
                                }
                                // result2.forEach(element => {
                                //     let acs2: prodCost = <prodCost>{
                                //         mcode: "", menucode: "", desca: "", unit: "",
                                //         quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: ""
                                //     }
                                //     acs2.mcode = element.mcode,
                                //     acs2.menucode = element.menucode,
                                //     acs2.desca = element.desca,
                                //     acs2.unit = element.unit,
                                //     acs2.batch = element.batch,
                                //     acs2.rate = element.rate,
                                //     acs2.quantity = element.quantity,
                                //     acs2.amount = element.amount,
                                //     acs2.nAmount = element.nAmount,
                                //     acs2.batchid = element.batchid,
                                //     acs2.listAdditionalCost = element.listAdditionalCost
                                //     this.addtionalCostList.push(acs2);
                                // });
                            }
                        }
                    }

                    // console.log("@@returnDataList",returnDataList)
                    for (let i of returnDataList) {  //saved AD view/edit ma call hune
                        // addPurchaseObj.mcode = i.mcode;
                        // addPurchaseObj.menucode = i.menucode;
                        // addPurchaseObj.desca = i.desca;
                        // addPurchaseObj.unit = i.unit;
                        // addPurchaseObj.quantity = i.quantity;
                        // addPurchaseObj.rate = i.rate;
                        // addPurchaseObj.amount = i.amount;
                        // addPurchaseObj.nAmount = i.nAmount;
                        // this._additionalCostService.addtionalCostList.push(addPurchaseObj)
                        this.costList = i.listAdditionalCost;
                        this.loadedTrnmain.TOTAMNT += i.amount;
                        this.INDcostList=this.costList.filter(x=>x.CostingType=="Ind Cost");
                        this.GRPcostList=this.costList.filter(x=>x.CostingType=="Group Cost");
                    }
                    // console.log("@@this.loadedTrnmain.TOTAMNT",this.loadedTrnmain.TOTAMNT)
                    //console.log("CheckCkec", this.costList)
                    // for (let i of returnDataList) {
                    //   var acs: prodCost = <prodCost>{
                    //     mcode: i.mcode, menucode: i.menucode, desca: i.desca, unit: i.unit,
                    //     quantity: i.quantity, rate: i.rate, amount: i.amount, nAmount: i.nAmount, batch:i.batch
                    //   };
                    //   this.addtionalCostList.push(acs);

                    // }
                    // var returnDataList = JSON.parse(data.result.AdditionalCostJson)

                    ////console.log("checkData444",data.result)
                    if (data.result.ImportDocument) {
                        this.masterService.importDocumentDetailsObj = data.result.ImportDocument;
                        this.masterService.importDocumentDetailsObj.PPNO = data.result.IMPORTDETAILS.DOCUMENTNO;
                        this.masterService.importDocumentDetailsObj.LCNO = data.result.IMPORTDETAILS.LCNUM;

                    }

                    this.masterService.RefObj.Refno = data.result.REFBILL;
                    this.masterService.RefObj.InvoiceNo = data.result.REFORDBILL;
                    this.masterService.RefObj.SupplierName = data.result.BILLTO;
                    this.masterService.RefObj.DIVISION=data.result.DIVISION;
                    this.masterService.RefObj.PHISCALID=data.result.PhiscalID;
                    if (this.masterService.userSetting.ENABLELOCALPURCHASE == 1) {
                        //console.log("@@daa.picndn",data.result.PI_CNDN_MODE)
                        if (data.result.PI_CNDN_MODE == 10) {
                            this.masterService.RefObj.PURCHASE_TYPE = "IMPORTPURCHASE";
                        } else {
                            this.masterService.RefObj.PURCHASE_TYPE = "LOCALPURCHASE";
                        }
                    }
                    // ////console.log("checkData$$$$$$$$$",this.masterService.importDocumentDetailsObj,this.masterService.RefObj)
                    // console.log("@@HEREthis.addtionalCostList",this.addtionalCostList)

                    if (this.addtionalCostList.length == 0 && nobatchid.length == 0) {
                        this.addtionalCostList = JSON.parse(data.result.AdditionalCostJson)

                        // console.log("@@this.addtionalCostList",this.addtionalCostList)
                        // console.log("@@this.addtionalCostList[0].listAdditionalCost",this.addtionalCostList[0].listAdditionalCost)
                        for (let x of this.addtionalCostList[0].listAdditionalCost) {
                            this.addCostTotAmount = this.addCostTotAmount + x.amount;
                        }
                        for (let y of this.INDcostList) {
                            this.addINDCostTotAmount = this.addINDCostTotAmount + y.amount;
                        }
                        for (let z of this.GRPcostList) {
                            this.addGRPCostTotAmount = this.addGRPCostTotAmount + z.amount;
                        }
                    }
                    if (data.result.IndividualCostList) {
                        this.IndividualCostList=data.result.IndividualCostList;
                        // this.masterService.TOTALINDAMOUNT =0;
                        // this.IndividualCostList.forEach(x => this.masterService.TOTALINDAMOUNT += x.indamount);
                    }
                    if(this.IndividualCostList.length==0){
                        this.IndividualCostList=this.addtionalCostList;
                        this.IndividualCostList.forEach(x=>x.indamount=x.amount);
                        // this.masterService.TOTALINDAMOUNT =0;
                        // this.IndividualCostList.forEach(x => this.masterService.TOTALINDAMOUNT += x.indamount);
                    }

                    //    for(let o of this.addtionalCostList){
                    //        for(let p of o.listAdditionalCost){

                    //                //Debit Account Recalculation
                    //                let x: Trntran = <Trntran>{};
                    //                x.A_ACID = p.costAc.ACID;
                    //                x.AccountItem = p.costAc;
                    //                x.DRAMNT = p.amount;
                    //                x.CRAMNT = 0;
                    //                x.PartyDetails = [];
                    //                x.ROWMODE = "new";
                    //                x.inputMode = true;
                    //                x.acitem = p;
                    //                this.masterService.AdditionalCostTrnTran.push(x);
                    //                // this.addCostTotAmount += p.amount;


                    //          //Credit Account Recalculation
                    //                let y: any = <any>{};
                    //                y.A_ACID = p.costAc.ACID;
                    //                y.AccountItem = p.creditAc;
                    //                y.DRAMNT = 0;
                    //                y.CRAMNT = p.amount;
                    //                y.PartyDetails = [];
                    //                y.ROWMODE = "new";
                    //                y.inputMode = true;
                    //                y.acitem =p.creditAc;
                    //                this.masterService.AdditionalCostTrnTran.push(y);


                    //        }
                    //    }
                    this.loadingService.hide();

                    this.generateCostDetailsFromData()
                    this.viewDate.next();
                    this.ReturnDataObjectSubject.next(data.result)

                }

                catch (ex) { }

            }
            else {
                alert("Cannot Get Data from Bill no.")
            }


        })


    }
    public CancelPI() {
        this.addtionalCostList = [];
    }

    public onAddCost(cdata: Cost) {
        var cst: Cost = <Cost>{
            mcode: cdata.mcode, batch: cdata.batch, sno: null, amount: cdata.amount,
            costAc: cdata.costAc, creditAc: cdata.creditAc, byQuanty: cdata.byQuanty,
            remarks: cdata.remarks, GCOSTMODE: cdata.GCOSTMODE, CostingType: cdata.CostingType, desca: cdata.desca, batchid: cdata.batchid, CostingNonCosting: cdata.CostingNonCosting, CostingNonCostingValue: cdata.CostingNonCostingValue,
            AdditionalDesc: cdata.AdditionalDesc, AdditionalVAT: cdata.AdditionalVAT, TDSAmount: cdata.TDSAmount,
            TDSAccount_ACID: cdata.TDSAccount_ACID,TDSAccount_Name: cdata.TDSAccount_Name, DoAccountPosting:cdata.DoAccountPosting, IsTaxableBill:cdata.IsTaxableBill,
            Ref_SupplierName: cdata.Ref_SupplierName,Ref_BILLNO:cdata.Ref_BILLNO,Ref_TRNDATE:cdata.Ref_TRNDATE,Ref_SupplierVAT: cdata.Ref_SupplierVAT,Ref_SupplierACID:cdata.Ref_SupplierACID,
            Ref_BSDATE: cdata.Ref_BSDATE,IS_ECA_ITEM:cdata.IS_ECA_ITEM,ADDITIONALAMOUNT_DATA:[],
            DR_SL_ACID:cdata.DR_SL_ACID,DR_SL_ACNAME:cdata.DR_SL_ACNAME,CR_SL_ACID:cdata.CR_SL_ACID,CR_SL_ACNAME:cdata.CR_SL_ACNAME,
            TDS_SL_ACID:cdata.TDS_SL_ACID,TDS_SL_ACNAME:cdata.TDS_SL_ACNAME
        }
        // console.log("PO*%", cst, cdata)
        // for(let i of this.addtionalCostList)

        let tot = { amount: 0, quantity: 0 }
        this.addtionalCostList.forEach(pdata => {

            tot.amount = pdata.amount + tot.amount;
            tot.quantity = pdata.quantity + tot.quantity;

        })
            this.addtionalCostList.forEach(prod => {
            let prodobj = Object.assign({}, prod); 
            var cost:any=<any>{};

            if (cdata.CostingNonCosting == 'COSTING' || cdata.CostingNonCosting == true) {
                if (cdata.mcode && cdata.batch) {
                    if (cdata.mcode == prodobj.mcode && cdata.batch == prodobj.batch) {
                        cost['AMOUNT'] = cdata.amount;
                    }
                }
                if (cdata.mcode == undefined) {
                    cost['AMOUNT'] = 0;
                }


                if(cdata.CostingType=='Ind Cost'){
                if ((this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x=>x.mcode==prodobj.mcode && x.batch==prodobj.batch && x.additionalcostac==cdata.costAc.ACID)) && !cdata.mcode && cdata.byQuanty != true) {
                    cost['AMOUNT'] = (this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x => x.mcode == prodobj.mcode && x.batch==prodobj.batch && x.additionalcostac==cdata.costAc.ACID))[0].indamount;
                }
                } else {
                    if (!cdata.mcode && cdata.byQuanty == true) {
                        cost['AMOUNT'] = Math.round(cdata.amount * (prodobj.quantity / tot.quantity) * 100) / 100
                    }
                    if (!cdata.mcode && cdata.byQuanty != true) {
                        cost['AMOUNT'] = Math.round(cdata.amount * (prodobj.amount / tot.amount) * 100) / 100;
                    }
                }

                cost['MCODE'] = prodobj.mcode; 
                cost['ITEMDESC'] = prodobj.desca; 
                cst.ADDITIONALAMOUNT_DATA.push(cost);                    
            } //calculation
    })

        this.costList.push(cst);
        this.INDcostList=this.costList && this.costList.length && this.costList.filter(x=>x.CostingType=="Ind Cost");
        this.GRPcostList=this.costList && this.costList.length && this.costList.filter(x=>x.CostingType=="Group Cost");


        // //console.log("ADDCOSTS", this.costList, this.addtionalCostList)
        // console.log("@@addCostTotAmount",this.addCostTotAmount)
        // all ok till here
        this.addCostTotAmount = this.addCostTotAmount + cst.amount;
        this.addINDCostTotAmount=0;
        this.addGRPCostTotAmount=0;
        for (let a of this.INDcostList) {
            this.addINDCostTotAmount = this.addINDCostTotAmount + a.amount;
        }
        for (let b of this.GRPcostList) {
            this.addGRPCostTotAmount = this.addGRPCostTotAmount + b.amount;
        }

        // EDIT MODE //VIEW MODE
        for (let i of this.addtionalCostList) {
            i.listAdditionalCost = this.costList
        }

        // NEW MODE
        // this.addtionalCostList.forEach(cost => {

        //     if (cost.listAdditionalCost == null) { cost.listAdditionalCost = []; };
        //     // ////console.log("Adds")
        //     if (cdata.mcode) {
        //         if (cost.mcode == cdata.mcode) {
        //             cst.amount = cdata.amount;
        //             cost.listAdditionalCost.push(cst);
        //         }
        //         else {
        //             // cost.listAdditionalCost=[];
        //             cost.listAdditionalCost.push(cst);
        //         }
        //     }
        //     else {
        //         if (cdata.byQuanty) {
        //             // cst.amount = (cdata.amount/totcost.quantity)* cost.quantity
        //             cost.listAdditionalCost.push(cst);
        //         }
        //         else {
        //             // cst.amount = (cdata.amount/totcost.amount) * cost.amount
        //             if (cost.listAdditionalCost && cost.listAdditionalCost.length > 0)
        //                 cost.listAdditionalCost.push(cst);
        //             else {
        //                 cost.listAdditionalCost = [];
        //                 cost.listAdditionalCost.push(cst);
        //             }
        //         }
        //     }

        // })



        if (cdata.mcode) {
            var indProd = this.addtionalCostList.find(x => x.mcode == cdata.mcode)
            if (indProd) {
                cst.amount = cdata.amount;
            }
        }
        // ////console.log("checkAddData",this.addtionalCostList)
        this.generateCostDetails()
    }

    public onDeleteCost(cdata: Cost) {
        this.addtionalCostList.forEach(cost => {
            var i = cost.listAdditionalCost.findIndex(x => x.costAc == cdata.costAc)
            cost.listAdditionalCost.splice(i, 1);
        })
    }
    DeleteDynamicColumn(Columnname: any) {

        // //console.log("CheckValue",Columnname,this.addtionalCostList)
        if (this.addtionalCostList) {
            for (let i of this.addtionalCostList) {
                delete i[Columnname];

            }
        }
        for (let i of this.addtionalCostList) {
            i.listAdditionalCost = this.costList
        }
        this.generateCostDetails()

        //23

        //    key = costing

        // for (let i of this.addtionalCostList) {
        //     for (let cost of this.costList) { //4 wota

        //         let fixedKeys = ["unit",
        //             "rate",
        //             "quantity",
        //             "nAmount",
        //             "menucode",
        //             "mcode",
        //             "desca",
        //             "batch",
        //             "amount",
        //             "Total",
        //             "listAdditionalCost",
        //             "CostPerUnit", cost.costAc.ACNAME]
        //         let keysArray = Object.keys(i);
        //         keysArray.forEach(key => {
        //             if (fixedKeys.indexOf(key) > -1) {

        //             } else {
        //                 delete i[key];
        //             }
        //         });
        //     }
        // }

        // //console.log("2", this.addtionalCostList)




        // }


    }

    public generateCostDetails(): any[] {
        // console.log('functioncalled');
        let detailCost: any[] = [];
        let tot = { amount: 0, quantity: 0 };

        var headers={
            amount: 0,
            desca: "desca",
            listAdditionalCost: [],
            mcode: "mcode",
            menucode: "menucode",
            nAmount: 0,
            quantity: 0,
            rate: 0, 
            unit: "unit", 
            indamount: 0,
            additionalcostac: "additionalcostac",
            Total: 0,
            CostPerUnit: 0,
            batch:"",
            batchid:""
        };

        this.addtionalCostList.forEach(pdata => {

            tot.amount = pdata.amount + tot.amount;
            tot.quantity = pdata.quantity + tot.quantity;


        })
        // console.log("AdditionalCostss", tot, this.addtionalCostList);
        this.addtionalCostList.forEach(prod => {


            let cst = Object.assign({}, prod);
            // console.log('cst', cst);
            // prod.refno = this.masterService.RefObj.Refno;
            // prod.refInvNo = this.masterService.RefObj.InvoiceNo;
            // prod.suppliername = this.masterService.RefObj.SupplierName;

            prod.listAdditionalCost.forEach(cost => {

                if (!cost.CostingNonCosting) {
                    cost.CostingNonCosting = 'COSTING';
                    cost.CostingNonCostingValue = 'Costing';
                } else {
                    if (cost.CostingNonCosting == 'COSTING' || cost.CostingNonCosting == true) { //checking true for old data when edit

                        cost.CostingNonCostingValue = 'Costing';
                    }
                    else {
                        cost.CostingNonCostingValue = 'Non-Costing';
                    }
                    // if (cost.CostingNonCosting == false) {
                    //     return;
                    // }
                }
                if (cost.CostingNonCosting == 'COSTING' || cost.CostingNonCosting == true) {

                
                if (cost.mcode && cost.batch) {
                    if (cost.mcode == cst.mcode && cost.batch == cst.batch) {
                        cst[cost.costAc.ACNAME] = cost.amount;
                        headers[cost.costAc.ACNAME]=cost.amount;
                    }
                    else {
                        // cst[cost.costAc.ACNAME] = 0;
                    }
                }
                if (cost.mcode == undefined) {
                    cst[cost.costAc.ACNAME] = 0;
                    headers[cost.costAc.ACNAME]=cost.amount;
                }


                if(cost.CostingType=='Ind Cost'){
                    if ((this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x=>x.mcode==cst.mcode && x.batch==cst.batch && x.additionalcostac==cost.costAc.ACID)) && !cost.mcode && cost.byQuanty != true) {
                        cst[cost.costAc.ACNAME] = (this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x=>x.mcode==cst.mcode && x.batch==cst.batch && x.additionalcostac==cost.costAc.ACID))[0].indamount;
                        headers[cost.costAc.ACNAME]=cost.amount;
                    }
                    }else{
                        if (!cost.mcode && cost.byQuanty == true) {
                            cst[cost.costAc.ACNAME] = Math.round(cost.amount * (cst.quantity / tot.quantity) * 100) / 100;
                            headers[cost.costAc.ACNAME]=cost.amount;
                        }
    
                        if (!cost.mcode && cost.byQuanty != true) {
                            cst[cost.costAc.ACNAME] = Math.round(cost.amount * (cst.amount / tot.amount) * 100) / 100;
                            headers[cost.costAc.ACNAME]=cost.amount;
                        }
                    }
                // if (cost.CostingNonCosting == true) {

                //     cst[cost.costAc.ACNAME] = Math.round(cst.amount) 
                // }

               
                // if (cost.CostingNonCosting == true) {
                     // this.costList.forEach(prod => {
                //         cst[cost.costAc.ACNAME] = cost.amount
                    
                  // })
                // }
                         

                




            }
            })
            // ////console.log("checkvalue",prod.listAdditionalCost,cst.mcode)
            // prod.listAdditionalCost.forEach(x=>{
            //     if(x.mcode!=cst.mcode){
            //         cst[x.costAc.ACNAME] = 0;
            //     }
            // })
            // //console.log("ChecKMide",this._transactionService.TrnMainObj.Mode)
            // if( this._transactionService.TrnMainObj.Mode.toUpperCase() != 'VIEW'){
                cst['Total'] = 0
                cst['CostPerUnit'] = 0
                cst['Total'] = Math.round(this.getTotal(cst) * 100) / 100;
                cst['CostPerUnit'] = (this.getCostPerUnit(cst) * 100) / 100; //remove roundoff to save without roundoff
            // }

            // cst['Total Cost Per Unit']
            // ////console.log("Check Total Costy", cst['Total'],cst)

            detailCost.push(cst);




        })
        // for(let i of this.addtionalCostList){
        //     for(let y of i.listAdditionalCost){
        //         if(y.)
        //     }
        // }
        // console.log(detailCost[0])

            // console.log("@@headers",headers)

            this.getCostingDetailHeader(headers);
        // console.log('Generate$$$', detailCost);
        this.costdetail = detailCost;
        return detailCost;

    }


    //     let checked_costValue = document.querySelector('input[value = "true"]:checked');
    // if (checked_costValue != null) {  //Test if something was checked

    // } else {

    // }
    public generateCostDetailsFromData(): any[] {
        // console.log("AdditionalCostService", this.addtionalCostList, this.costList, this.costdetail)
        let detailCost: any[] = [];
        let tot = { amount: 0, quantity: 0 };

        var _headers={
            amount: 0,
            desca: "desca",
            listAdditionalCost: [],
            mcode: "mcode",
            menucode: "menucode",
            nAmount: 0,
            quantity: 0,
            rate: 0, 
            unit: "unit", 
            indamount: 0,
            additionalcostac: "additionalcostac",
            Total: 0,
            CostPerUnit: 0,
            batch:"",
            batchid:""
        };

        this.addtionalCostList.forEach(pdata => {

            tot.amount = pdata.amount + tot.amount;
            tot.quantity = pdata.quantity + tot.quantity;

        })
        this.addtionalCostList.forEach(prod => {

            let cst = Object.assign({}, prod);
            prod.listAdditionalCost.forEach(cost => {
                // console.log('cost', cost.CostingNonCosting)
                
                // if (cost.CostingNonCosting == false) {
                //     return;
                // }

                if(!cost.CostingNonCosting){
                    cost.CostingNonCosting = 'COSTING';
                }else{
                    if (cost.CostingNonCosting=='COSTING') {
                        cost.CostingNonCosting = 'COSTING';
                    }
                    else {
                        cost.CostingNonCosting = 'NONCOSTING';   
                    }
                }

                if (cost.CostingNonCosting == 'COSTING' || cost.CostingNonCosting == true)
                {

                if (cost.mcode && cost.batch) {
                    if (cost.mcode == cst.mcode && cost.batch == cst.batch) {
                        cst[cost.costAc.ACNAME] = cost.amount;
                        _headers[cost.costAc.ACNAME]=cost.amount;
                    }
                    else {
                        // cst[cost.costAc.ACNAME] = 0;
                    }
                }
                if (cost.mcode == undefined) {
                    cst[cost.costAc.ACNAME] = 0;
                    _headers[cost.costAc.ACNAME]=cost.amount;
                }
                if (cost.CostingType=='Ind Cost'){
                    if((this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x=>x.mcode==cst.mcode && x.batch==cst.batch && x.additionalcostac==cost.costAc.ACID)) && !cost.mcode && cost.byQuanty != true) {
                        cst[cost.costAc.ACNAME] = (this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x=>x.mcode==cst.mcode && x.batch==cst.batch && x.additionalcostac==cost.costAc.ACID))[0].indamount;
                        _headers[cost.costAc.ACNAME]=(this.IndividualCostList && this.IndividualCostList.length && this.IndividualCostList.filter(x=>x.mcode==cst.mcode && x.batch==cst.batch && x.additionalcostac==cost.costAc.ACID))[0].indamount;
                    }
                }else{
                    if (!cost.mcode && cost.byQuanty == true) {
                        cst[cost.costAc.ACNAME] = Math.round(cost.amount * (cst.quantity / tot.quantity) * 100) / 100;
                        _headers[cost.costAc.ACNAME]=Math.round(cost.amount * (cst.quantity / tot.quantity) * 100) / 100;
                    }
                    if (!cost.mcode && cost.byQuanty != true) {
                        cst[cost.costAc.ACNAME] = Math.round(cost.amount * (cst.amount / tot.amount) * 100) / 100;
                        _headers[cost.costAc.ACNAME]=Math.round(cost.amount * (cst.amount / tot.amount) * 100) / 100;
                    }
                }
               
                // if (cost.CostingNonCosting == true) {

                //     // cst[cost.costAc.ACNAME] = Math.round(cost.amount * (cst.amount / tot.amount) * 100) / 100;

                //     // this.costList.forEach(prod => {
                //         cst[cost.costAc.ACNAME] = prod.amount

                //     // })
                //     //       this.costList.map((d, i) => {

                //     // })

                // }
                // if (cost.CostingNonCosting == true) {
                //     // this.costList.forEach(prod => {
                //     cst[cost.costAc.ACNAME] = cost.amount

                //     // })
                // }
            }

            
            })

            // cst['Total'] = Math.round(this.getTotal(cst) * 100) / 100;
            // cst['CostPerUnit'] = Math.round(this.getCostPerUnit(cst) * 100) / 100;
           
           
            detailCost.push(cst);



        })
        // for(let i of this.addtionalCostList){
        //     for(let y of i.listAdditionalCost){
        //         if(y.)
        //     }
        // }
// console.log("@@yeta?_headers",_headers)
        this.getCostingDetailHeader(_headers);
        // detailCost[0].forEach(h => {
        //     if (h.CostingNonCosting == true) {
        //         this.getCostingDetailHeader(detailCost[0]);
        //     }
        // })

        // //console.log('Generate$$$', detailCost);
        this.costdetail = detailCost;

        return detailCost;

    }

    getTotal(cst: any): number {
        let total = 0;
        Object.keys(cst).forEach((key: any) => {
            // ////console.log("CheckLOG",typeof cst[key])

            if (key == "sno" || key == "desca" || key == "listAdditionalCost" || key == "mcode" || key == "menucode" || key == "nAmount" || key == "quantity" || key == "rate" || key == "unit" || key == "batch" || key == "batchid" || key == "indamount" || key == "additionalcostac") { }
            else {

                total = total + cst[key];




            }
        });
        // ////console.log("CheckGetTotrla",total);
        return total
    }

    getCostPerUnit(cst: any): number {
        let cpu = Number(Number(cst['Total']) / Number(cst['quantity']))
        return cpu;
    }

    getCostingDetailHeader(FirstObject) {
        // console.log("@@FirstObject",FirstObject)
        if (FirstObject == null) { return; }
        this.header = [];
        this.header = [
            { TITLE: 'Item Code', MAPPINGNAME: 'menucode', Alignment: 'left' },
            { TITLE: 'Item Name', MAPPINGNAME: 'desca', Alignment: 'left' },
            { TITLE: 'Batch', MAPPINGNAME: 'batch', Alignment: 'left' },
            // { TITLE: 'UNIT', MAPPINGNAME: 'unit' }, 
            // { TITLE: 'RATE', MAPPINGNAME: 'rate' }, 
            { TITLE: 'QTY', MAPPINGNAME: 'quantity', Alignment: 'right' },
            { TITLE: 'Amount', MAPPINGNAME: 'amount', Alignment: 'right' }];

        let total = 0;

        
        Object.keys(FirstObject).forEach((key: any) => {
            // console.log(key)
            if (key == "amount" || key == "desca" || key == "listAdditionalCost" || key == "mcode" || key == "menucode" || key == "nAmount" || key == "quantity" || key == "rate" || key == "unit" || key == "indamount" || key == "additionalcostac") {

            }
            else {
                // console.log("key", key)
                let val = "unset";
                this.header.forEach(h => { if (h.MAPPINGNAME == key) { val = "set"; } });
                // let achiveValue = [];
                // this.costList.map((d, i) => {
                //     if (d.CostingNonCosting == true) {
                //         //prevent duplicate entry in header
                //         if (val == "unset") {
                //             this.header.push({ TITLE: key, MAPPINGNAME: key, Alignment: 'right' });
                //         }

                //     }
                // })

                // this.costList.forEach(product => {
                //     if (product.CostingNonCosting == true) {
                if (val == "unset") {
                    // console.log(this.header)
                    if (key == 'batchid' || key == 'Total' || key == 'CostPerUnit') {
                        this.header.push({ TITLE: key, MAPPINGNAME: key, Alignment: 'right' });
                    }
                    let batchid_index = this.header.findIndex(x => x.MAPPINGNAME == 'batchid');
                    let total_index = this.header.findIndex(x => x.MAPPINGNAME == 'Total');

                    // if (total_index >= 0 && total_index == this.header.length-2) {
                    //     if (this.header[total_index - 1].MAPPINGNAME != 'Total' && this.header[total_index - 1].MAPPINGNAME != 'CostPerUnit' && (key != 'batchid' && key != 'Total' && key != 'CostPerUnit') ) {
                    //         console.log("@@total_index", total_index,this.header[total_index - 1].MAPPINGNAME )
                    //         this.header.splice(total_index - 1, 0, { TITLE: key, MAPPINGNAME: key, Alignment: 'right' });
                    //     }
                    // } else {
                        if (batchid_index >= 0 && (key != 'batchid' && key != 'Total' && key != 'CostPerUnit')) {
                            // console.log("##batchid_index", batchid_index,key)
                            this.header.splice(batchid_index + 1, 0, { TITLE: key, MAPPINGNAME: key, Alignment: 'right' });
                        }
                    // }
                }           
                      }                     
            //       })

            // }
        });

    }
    loadData(VCHR, division, phiscalid) {
        //return new Observable((observer: Subscriber<TrnMain>) => {
        this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(data => {
            if (data.status == 'ok') {
                this.TrnMainObj = data.result;

                this.trnmainBehavior.next(this.TrnMainObj);
            }
        }, error => {
            //console.log({ "Load Data Error": error });
            this.trnmainBehavior.complete();
        }, () => this.trnmainBehavior.complete());
        //});

    }

    saveAdditionalCost() {
        //alert("AC Service!!");
        this.masterService.saveAdditionalCost(this.addtionalCostList)
            .subscribe(res => {
                ////console.log("working!!!",res);
            })
    }

    LoadOriginalPurchaseData(){
        this.loadingService.show("please wait. Getting original purchase invoice data..")
        this.masterService.LoadTransaction(this.masterService.RefObj.Refno, this.masterService.RefObj.DIVISION, this.masterService.RefObj.PHISCALID).subscribe(data => {
            if (data) {
                try {
                    this.addtionalCostList=[];
                    var result = data.result.ProdList
                    let acs1: prodCost = <prodCost>{
                        mcode: "", menucode: "", desca: "", unit: "",
                        quantity: 0, rate: 0, amount: 0, nAmount: 0, batch: "", batchid: ""
                    }
                    if (result.length > 0) {
                        for (let i of result) {
                            var acs: prodCost = <prodCost>{
                                mcode: i.MCODE, menucode: i.MENUCODE, desca: i.ITEMDESC, unit: i.UNIT,
                                quantity: i.REALQTY_IN,
                                rate: Number(i.RATE).toFixed(12),
                                amount:  i.AMOUNT,
                                nAmount: i.NETAMOUNT, 
                                batch: i.BATCH, 
                                batchid: i.BATCHID
                            };
                            this.addtionalCostList.push(acs);
                            this.loadingService.hide();
                        }
                    }
                        //total amount
                        this.loadedTrnmain = data.result;
                }
                catch (ex){

                }
            }
        })
    }

    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public extractData(res: Response | any) {
        let response = res.json();
        return response || {};
    }
    public handleError(error: Response | any) {
        return Observable.throw(error);
    }

    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }
}

