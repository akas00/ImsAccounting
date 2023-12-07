import { Component, Output, Input, EventEmitter } from "@angular/core";
import { TrnMain, BillTrack, VoucherTypeEnum, Trntran } from "../../../../common/interfaces";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { SettingService } from "../../../../common/services";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";


@Component({
    selector: "openingBalanceTracking",
    templateUrl: "./PartyopeningTracking.component.html",
    styleUrls: ["../../../modal-style.css"]
})
export class OpeningBalanceTrackingComponent {

    @Output() openingbalancelist = new EventEmitter();
    isActive: boolean = false;
    BillList: any[] = [];
    TrntranList: Trntran[];
    public VOUCHERNO: string = "";
    public Amount: string = "";
    voucherType: VoucherTypeEnum
    AdjAmt = 0;
    rowValue: any
    row: any;
    calculateTotal: number = 0;
    selectedTranIndex: number
    constructor(
        private masterService: MasterRepo,
        private _trnMainService: TransactionService,
        private setting: SettingService,
        private alertService: AlertService,
        private loadingSerive: SpinnerService,

    ) {

    }

    ngOnInit() {
    }
    onAddClick() {
        if (this.VOUCHERNO == null || this.VOUCHERNO == "" || this.VOUCHERNO == undefined) {
            this.alertService.error("Voucher Number cannot be empty");
            return;
        }
        if (this.Amount == null || this.Amount == "" || this.Amount == undefined) {
            this.alertService.error("Amount Cannot be empty");
            return;
        }
        let x = this.BillList.filter(itm => itm.VOUCHERNO == this.VOUCHERNO)
        if (x.length > 0) {
            return;
        }
        this.BillList.push({
            VOUCHERNO: this.VOUCHERNO,
            AMOUNT: this.Amount
        });
        this.VOUCHERNO = "";
        this.Amount = "";

    }

    remove(index) {
        this.BillList.splice(index, 1)
    }

    show(partyOpeningDetails:any=[]) {
        if(partyOpeningDetails.length){
            this.BillList = partyOpeningDetails;
        }
        this.isActive = true;
    }

    hide() {

        this.isActive = false;
    }


    okClick() {
        this.openingbalancelist.emit(this.BillList);
        this.hide();
    }



}
