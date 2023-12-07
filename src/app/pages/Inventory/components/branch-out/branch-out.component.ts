import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../../../../common/services/setting.service";

@Component({
    selector: "branch-out",
    templateUrl: "./branch-out.component.html",
    providers: [TransactionService],
  
})

export class BranchOutComponent {
  
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService) {
        this._trnMainService.initialFormLoad(8);
    }

    ngOnInit() {
       
    }

   
}
