import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";

@Component({
    selector: "area-list",
    templateUrl: "./area-list.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class AreaList {
    AreaList: any[] = [];

    constructor(public masterService: MasterRepo,private _reportFilterService:ReportMainService) {
        this.masterService.getAreaList().subscribe(res => {
            this.AreaList = res.result;
        })

        this._reportFilterService.ReportFilterObject.AreaWise = 0;
        if(this._reportFilterService.PartyLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'partyledgerreport'){
            _reportFilterService.ReportFilterObject.AreaWise = _reportFilterService.PartyLedgerObj.AreaWise;
        }

    }
}