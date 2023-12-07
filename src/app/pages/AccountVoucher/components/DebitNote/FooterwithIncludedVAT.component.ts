import { Component, AfterContentChecked, ChangeDetectorRef, PipeTransform } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../common/services/setting.service";
import { ConvertToDecimalPipe } from "../../../../common/decimal.pipe";

@Component({
  selector: "DrCrFooter_With_VAT",
  templateUrl: "./FooterwithIncludedVAT.component.html",
  styleUrls: ["../../../Style.css"]
 
})
export class DrCrFooterWithVATIncluded implements AfterContentChecked , PipeTransform {



  differenceAmount:number = 0;
  diffAmountDrCrType:string = "";
  TrnMainObj: TrnMain = <TrnMain>{};
  voucherType: VoucherTypeEnum = VoucherTypeEnum.DebitNote;
  prefix: PREFIX = <PREFIX>{};
  applyPipeinTaxable:boolean=true;
  applyPipeinNonTaxable:boolean=true;
  constructor(
    private masterService: MasterRepo,
    private _transactionService: TransactionService,
    private setting: SettingService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.TrnMainObj = _transactionService.TrnMainObj;
    // this.differenceAmount = this._transactionService.differenceAmount;
    // this.diffAmountDrCrType = this._transactionService.diffAmountDrCrType;

  }

  ngOnInit() {
  
  }

  ngAfterContentChecked(): void {    
    this.differenceAmount = this._transactionService.diffAmountItemForAccount;
    this.diffAmountDrCrType = this._transactionService.diffAmountDrCrType;
    this.changeDetection.detectChanges();

}



  onChange(){
  
    this.differenceAmount = this._transactionService.differenceAmount;
    this.diffAmountDrCrType = this._transactionService.diffAmountDrCrType;
  }



  calculateCrAmount() {
    this._transactionService.totalCRAmount = 0;
    this._transactionService.creditList.forEach(x => this._transactionService.totalCRAmount += x.CRAMNT);
    this._transactionService.totalCRAmount += this._transactionService.TrnMainObj.DCAMNT;
  }
  
  taxableAmountChange(event) {
    this.applyPipeinTaxable = false;
    var TAXABLE = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE);
      var Gross = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT)
    if(Gross<TAXABLE){
      this._transactionService.TrnMainObj.TAXABLE = 0
    }
    
    this._transactionService.TrnMainObj.NONTAXABLE = 
    this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) -
     this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE)
   // this._transactionService.TrnMainObj.NONTAXABLE = this.transform(this._transactionService.TrnMainObj.NONTAXABLE);
     this.calculation();
  }
  nonTaxableAmountChange(event) {
    this.applyPipeinNonTaxable = false;
    ////console.log("call non taxable");
    var NONTAXABLE = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE);
    var Gross = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT)
    ////console.log("nontaxable",NONTAXABLE,Gross);
    if(NONTAXABLE>Gross){
    this._transactionService.TrnMainObj.NONTAXABLE = 0
  }
    // this._transactionService.TrnMainObj.NONTAXABLE = this._transactionService.nullToZeroConverter(event.target.value);
    // this._transactionService.TrnMainObj.TAXABLE = this._transactionService.TrnMainObj.TOTAMNT - this._transactionService.nullToZeroConverter(this._transactionService.TrnMainObj.DCAMNT) - this._transactionService.nullToZeroConverter(this._transactionService.TrnMainObj.NONTAXABLE);
    
    this._transactionService.TrnMainObj.TAXABLE = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TOTAMNT) - this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE)

    //this._transactionService.TrnMainObj.TAXABLE = this.transform(this._transactionService.TrnMainObj.TAXABLE);
    this.calculation();
  }
  VATAmountChange(event) {
 
    // this._transactionService.TrnMainObj.VATAMNT = this._transactionService.nullToZeroConverter(event.target.value);
    // this.budgetCalculation();
  }

  focusOutNonTaxableAmountChange($event){
    this.applyPipeinNonTaxable = true;
    // this._transactionService.TrnMainObj.NONTAXABLE =
    //  this._transactionService.formatetoTwoDecimal(this._transactionService.TrnMainObj.NONTAXABLE);
  }

  focusOutTaxableAmountChange($event){
    this.applyPipeinTaxable = true;
    // this._transactionService.TrnMainObj.TAXABLE =
    //  this._transactionService.formatetoTwoDecimal(this._transactionService.TrnMainObj.TAXABLE);
    // ////console.log("taxable",this._transactionService.TrnMainObj.TAXABLE)
    }

  calculation() {
    // this._transactionService.totalDRAmount = 0;
    // if(this._transactionService.TrnMainObj.TAXABLE == 0) return
    ////console.log("agaivat",this._transactionService.TrnMainObj.TAXABLE);
    this._transactionService.TrnMainObj.VATAMNT = this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE) * 0.13;
  
    this._transactionService.TrnMainObj.NETAMNT = 
              this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.TAXABLE)  +
              this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.VATAMNT) +
              this._transactionService.nullToReturnZero(this._transactionService.TrnMainObj.NONTAXABLE);
    // this._transactionService.totalDRAmount = this._transactionService.TrnMainObj.NETAMNT + this._transactionService.nullToZeroConverter(this._transactionService.nullToZeroConverter(this._transactionService.TrnMainObj.DCAMNT));
  }
  onFocus(value){
    ////console.log("CheckValue",value)
  }

  transform(input:number):string {
    if(!input){ input=0}
       return input.toFixed(2);
   
  }
 
}
