import { MasterRepo } from './../../../../common/repositories/masterRepo.service';

import { Component } from '@angular/core';
import { AdditionalCostService } from "./addtionalCost.service";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from "@angular/forms";

@Component({
    selector: 'costingDetail',
    templateUrl: 'costingDetail.component.html',
    styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
    providers: []

})
export class CostingDetailComponent {
    TrnMainObj: TrnMain
    form: FormGroup;
    header: any[] = [];

    constructor(public _addionalcostService: AdditionalCostService, private fb: FormBuilder, private masterService: MasterRepo, public _additionalCostService: AdditionalCostService) {
        this.TrnMainObj = _addionalcostService.TrnMainObj;
        // ////console.log("headers===" + JSON.stringify(_addionalcostService.header));
        // ////console.log("additionalCost", this._addionalcostService.addtionalCostList)
        this.form = fb.group({
            AdditionalPurchaseAc: [''],
        });
        this._additionalCostService.header = [{ TITLE: 'Item Code' }, { TITLE: 'Item Name' }, { TITLE: 'Batch' }, { TITLE: 'Qty' }, { TITLE: 'Amount' }]
        this._additionalCostService.generateCostDetails();
    }



    selectAlignment(value:any){
        ////console.log("#",value)
    }
}