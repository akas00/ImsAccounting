import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { VehicleCostTrackingService } from './vehicle-cost-tracking.service';
@Component({
    selector: 'localpurchase-cost-allocation-selector',
    templateUrl: './localpurchase-costallocation-list.component.html',
    styleUrls: ['./localpurchase-costallocation-list.component.css']
})

export class LocalPurchaseCostAllocationListComponent {
    pivouchersList: any = [];
    filter:any;

    constructor(private masterService: MasterRepo, private router: Router,
        public _vechiclecosttrackService: VehicleCostTrackingService, private _alertService: AlertService) {
        this.getPIVoucherList();
    }

    getPIVoucherList() {
        this._vechiclecosttrackService.UntrackedPIVoucherList().subscribe(res => {
            if (res.status == "ok") {
                this.pivouchersList = res.result;
            }
        }, err => {
            this._alertService.error(err)
        })
    }

    AddNewLocalPurchaseCost() {
        try {
            this.router.navigate(["./pages/account/acvouchers/localpurchase-costallocation/add-costallocation",{mode: "ADD"}])
        } catch (ex) {
            alert(ex);
        }
    }

    onEditClick(event) {
        try {
            this.router.navigate(["./pages/account/acvouchers/localpurchase-costallocation/add-costallocation", { VCHRNO: event.CAPITALPURCHASE_VCHRNO, mode: "EDIT"}])
        } catch (ex) {
            alert(ex);
        }
    }

    onViewClick(event) {
        // console.log("@@event",event)
        try {
            this.router.navigate(["./pages/account/acvouchers/localpurchase-costallocation/add-costallocation", { VCHRNO: event.CAPITALPURCHASE_VCHRNO, mode: "VIEW" }])
        } catch (ex) {
            alert(ex);
        }
    }

}
