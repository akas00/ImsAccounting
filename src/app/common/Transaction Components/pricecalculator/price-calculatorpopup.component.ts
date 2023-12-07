import { Component, OnInit } from "@angular/core";
import { ImporterPriceCalc } from "../../interfaces/Account.interface";
import { MasterRepo } from "../../repositories";
import { TransactionService } from "../transaction.service";

@Component({
    selector: "pricecalc-selector",
    styleUrls: ['./price-calculatorpopup.component.css'],
    templateUrl: "./price-calculatorpopup.component.html"
})

export class PriceCalculatorPopupComponent implements OnInit {
    isActive: boolean = false;
    currentIndex: number = 0;
    public priceFormula: any;
    savedPPNO:string;
    savedLCNO:string;
    // previousvat:number;
    disable_Okbutton:boolean;
    saved_voucherno:string;

    constructor(public masterService: MasterRepo, private _trnMainService: TransactionService) {

    }

    ngOnInit() {
    }

    show(index) {
        this.currentIndex = index;
        if (!this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList) {
            this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList = <ImporterPriceCalc>{};
        }
        // console.log("@@this.savedPPNO",this.savedPPNO)
        if((this.savedPPNO && this.savedPPNO!==null && this.savedPPNO!=="" && this.savedPPNO!==undefined) && 
        this.saved_voucherno == this._trnMainService.TrnMainObj.ProdList[this.currentIndex].VCHRNO){
            this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.PPNO=this.savedPPNO;
        }else{
            this.savedPPNO = null;
        }
        // console.log("@@this.savedLCNO",this.savedLCNO)
        if((this.savedLCNO && this.savedLCNO!==null && this.savedLCNO!=="" && this.savedLCNO!==undefined) && 
        this.saved_voucherno == this._trnMainService.TrnMainObj.ProdList[this.currentIndex].VCHRNO){
            this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.LCNO=this.savedLCNO;
        }else{
            this.savedLCNO = null;
        }

        if(this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.Unit_ImporterRate==="" ||
        this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.Unit_ImporterRate==null ||
        this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.Unit_ImporterRate==undefined){
            this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.Unit_ImporterRate="Each";
        }
        // this.previousvat=this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList.VAT_ImporterRate);
        this.isActive = true;
    }

    close() {
        this.isActive = false;
    }

    calculateCostings(currentIndex) {

        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AssesableCustomDuty_ImporterRate =
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.TotalInvoiceData_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.ExciseDuty_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.Insurance_ImporterRate);

        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AssesableAntaShulka_ImporterRate =
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CustomDuty_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AssesableCustomDuty_ImporterRate);

        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CostBeforeVAT_ImporterRate =
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AssesableAntaShulka_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.ServiceCharge_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.Others_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AntaShulka_ImporterRate);

        // this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VAT_ImporterRate =
        //     this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CostBeforeVAT_ImporterRate * 0.13;

        
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.TaxableValue_VATWise =
        this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VAT_ImporterRate) / 0.13;

        if (this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_UnitWise > 0) {
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.LandedCostPerRate_ImporterRate =
                this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CostBeforeVAT_ImporterRate) /
                this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_UnitWise;
        } else {
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.LandedCostPerRate_ImporterRate = 0;
        }

        // this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.NETVALUE =
        //     (this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_ImporterRate *
        //         this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.LandedCostPerRate_ImporterRate) +
        //     this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VAT_ImporterRate;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.NETVALUE =
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CostBeforeVAT_ImporterRate +
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VAT_ImporterRate;
        
    }

    saveCosting(currentIndex) {
        this.calculateQty(currentIndex);
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.MCODE = this._trnMainService.TrnMainObj.ProdList[currentIndex].MCODE;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.ITEMDESC = this._trnMainService.TrnMainObj.ProdList[currentIndex].ITEMDESC;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.BATCH = this._trnMainService.TrnMainObj.ProdList[currentIndex].BATCH;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.BATCHID = this._trnMainService.TrnMainObj.ProdList[currentIndex].BATCHID;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VCHRNO = this._trnMainService.TrnMainObj.ProdList[currentIndex].VCHRNO;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.DIVISION = this._trnMainService.TrnMainObj.DIVISION;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.PHISCALID = this._trnMainService.TrnMainObj.PhiscalID;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.SUPPLIER = this._trnMainService.TrnMainObj.TRNAC;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CHALANNO = this._trnMainService.TrnMainObj.CHALANNO;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.STOCK = this._trnMainService.TrnMainObj.ProdList[currentIndex].Quantity;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.MODE = "ADD";
        if (this._trnMainService.TrnMainObj.ProdList[currentIndex].IsCostingSaved == true) {
            if (confirm("Costing is already done for this item. Do you want to continue?")) {
                // this.isActive = false;
                this.disable_Okbutton=true;
                this.saveImporterPurchaseCosting(currentIndex);
            }
        } else {
            // this.isActive = false;
            this.disable_Okbutton=true;
            this.saveImporterPurchaseCosting(currentIndex);
        }
    }

    saveImporterPurchaseCosting(currentIndex) {
        this.masterService.saveImporterPurchaseCosting(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList)
            .subscribe(data => {
                if (data.status == 'ok') {
                    this.savedPPNO=this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.PPNO;
                    this.savedLCNO=this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.LCNO;
                    this.saved_voucherno=this._trnMainService.TrnMainObj.ProdList[currentIndex].VCHRNO;
                    this.isActive = false;
                    this.disable_Okbutton=false;
                    if (this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.MODE == "ADD") {
                        this._trnMainService.TrnMainObj.ProdList[currentIndex].IsCostingSaved = true;
                        this._trnMainService.TrnMainObj.ProdList[currentIndex].backgroundcolor = "lightgreen";
                    } else {
                        this._trnMainService.TrnMainObj.ProdList[currentIndex].IsCostingSaved = false;
                        this._trnMainService.TrnMainObj.ProdList[currentIndex].backgroundcolor = "white";
                        this._trnMainService.TrnMainObj.ProdList[this.currentIndex].ImporterPriceCalcList = null;
                    }
                } else {
                    alert(data.result);
                    this.disable_Okbutton=false;
                }
            }, error => {
                alert(error);
                this.disable_Okbutton=false;
            });
    }

    deleteCosting(currentIndex) {
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.MCODE = this._trnMainService.TrnMainObj.ProdList[currentIndex].MCODE;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.ITEMDESC = this._trnMainService.TrnMainObj.ProdList[currentIndex].ITEMDESC;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.BATCH = this._trnMainService.TrnMainObj.ProdList[currentIndex].BATCH;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.BATCHID = this._trnMainService.TrnMainObj.ProdList[currentIndex].BATCHID;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VCHRNO = this._trnMainService.TrnMainObj.ProdList[currentIndex].VCHRNO;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.DIVISION = this._trnMainService.TrnMainObj.DIVISION;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.PHISCALID = this._trnMainService.TrnMainObj.PhiscalID;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.SUPPLIER = this._trnMainService.TrnMainObj.TRNAC;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.CHALANNO = this._trnMainService.TrnMainObj.CHALANNO;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.STOCK = this._trnMainService.TrnMainObj.ProdList[currentIndex].Quantity;
        this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.MODE = "DELETE";

        if (this._trnMainService.TrnMainObj.ProdList[currentIndex].IsCostingSaved == true) {
            if (confirm("Do you want to remove the data?")) {
                this.saveImporterPurchaseCosting(currentIndex);
            }
        }
    }

    calculateQty(currentIndex){
        if(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.Unit_ImporterRate=="Case"){
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_UnitWise=
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_ImporterRate*
            this._trnMainService.TrnMainObj.ProdList[currentIndex].CONFACTOR;
        }else{
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_UnitWise=
            this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.InvoiceQty_ImporterRate;
        }
        this.calculateCostings(currentIndex);
    }

    validateVAT(currentIndex){

        let _CostBeforeVAT_ImporterRate =
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AssesableAntaShulka_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.ServiceCharge_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.Others_ImporterRate) +
            this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.AntaShulka_ImporterRate);

        let _VAT_ImporterRate = _CostBeforeVAT_ImporterRate * 0.13;

        if (((this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VAT_ImporterRate) - _VAT_ImporterRate) > 1) ||
            (_VAT_ImporterRate - this._trnMainService.nullToReturnZero(this._trnMainService.TrnMainObj.ProdList[currentIndex].ImporterPriceCalcList.VAT_ImporterRate) > 1)) {
            alert("VAT difference is greater than 1 !");
        }
        this.calculateCostings(currentIndex);
    }
}