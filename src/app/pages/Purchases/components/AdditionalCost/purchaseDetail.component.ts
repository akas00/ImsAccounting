import { TransactionService } from './../../../../common/Transaction Components/transaction.service';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Component } from '@angular/core';
// import { AdditionalCostService } from "./addtionalCost.service";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from "@angular/forms";
import { AdditionalCostService } from "./addtionalCost.service";

@Component({
    selector: 'purchaseDetail',
    templateUrl: 'purchaseDetail.component.html',
    styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
    providers: []

})
export class PurchaseDetailComponent {
    TrnMainObj: TrnMain
    // form:FormGroup;
    TrnProdlist: any[] = [];
    constructor(public transactionService: TransactionService, private fb: FormBuilder, private masterService: MasterRepo, public _additionalCostService: AdditionalCostService) {
        this.TrnMainObj = this._additionalCostService.TrnMainObj;
        this.TrnProdlist = (this.TrnMainObj.ProdList);
    }

    changeRate(value, index) {
        this._additionalCostService.addtionalCostList[index].rate = value;
        this._additionalCostService.addtionalCostList[index].amount = value * this._additionalCostService.addtionalCostList[index].quantity;
        this._additionalCostService.addtionalCostList[index].nAmount = this._additionalCostService.addtionalCostList[index].amount * 1.13
    }
    EnterClickOnRate(i){
        this.masterService.focusAnyControl('_AdditioanlCostRate'+(i+1))
    }
}