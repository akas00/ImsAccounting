import { Component } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";

@Component({
    selector: "openingstockentry",
    templateUrl: "./openingStockEntry.html",
    providers: [TransactionService]

})

export class OpeningStockEntryComponent {

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService) {
        this._trnMainService.initialFormLoad(24);
    }

    ngOnInit() {

    }

}
