import { Component} from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";

import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";


@Component({
    selector: "branch-in",
    templateUrl: "./branch-in.component.html",
    providers: [TransactionService],

})

export class BranchInComponent {
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService) {
     this._trnMainService.initialFormLoad(7);
    }

    ngOnInit() {
       
    }
}
