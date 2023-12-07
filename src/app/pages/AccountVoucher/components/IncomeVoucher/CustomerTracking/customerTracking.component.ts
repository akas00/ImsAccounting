import { Component } from "@angular/core";
import { TransactionService } from "./../../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../../common/repositories/masterRepo.service";
import { SettingService } from "../../../../../common/services/index";

@Component({
    selector: "CustomerTracking",
    templateUrl: "./customerTracking.component.html",
    providers: [TransactionService],
    styleUrls: ["../../../../modal-style.css"]
})
export class CustomerTrackingComponent {
    TrnMainObj: TrnMain = <TrnMain>{};
    isActive: boolean = false;
    constructor(
        private masterService: MasterRepo,
        private _trnMainService: TransactionService,
        private setting: SettingService
    ) {

    }

    ngOnInit() {
    }

    show() {
        this.isActive = true;
    }
   
    hide() {
        this.isActive = false;
    }
}
