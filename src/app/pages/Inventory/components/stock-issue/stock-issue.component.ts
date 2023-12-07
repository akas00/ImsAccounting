import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../../../../common/services/setting.service";
import { AuthService } from '../../../../common/services/permission/authService.service';

@Component({
    selector: "stock-issue",
    templateUrl: "./stock-issue.component.html",
    providers: [TransactionService],
})

export class StockIssueComponent {
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private router: Router, private arouter: ActivatedRoute,private setting:SettingService,private authService: AuthService) {
       this._trnMainService.initialFormLoad(5);   
    }

    ngOnInit() {
     
    }

}
