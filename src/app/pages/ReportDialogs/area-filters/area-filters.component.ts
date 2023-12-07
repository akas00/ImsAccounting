import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "area-filters",
    templateUrl: "./area-filters.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class AreaFilters {
    AreaList: any[] = [];
    showMultipleCC: boolean;

    constructor(public masterService: MasterRepo, private _reportFilterService: ReportMainService) {
        this.masterService.getAreaList().subscribe(res => {
            this.AreaList = res.result;
        })
        _reportFilterService.ReportFilterObject.multipleAreas= [];
        // this.showMultipleCC = true;
        if(this._reportFilterService.SummaryPartyLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'summarypartyledger' && ( _reportFilterService.SummaryPartyLedgerObj.multipleAreas && _reportFilterService.SummaryPartyLedgerObj.multipleAreas.length!=0)){
            _reportFilterService.ReportFilterObject.multipleAreas = _reportFilterService.SummaryPartyLedgerObj.multipleAreas;
        }
    }

    // checkValue() {
    //     if (this._reportFilterService.ReportFilterObject.showAllContacts == true) {
    //         this.showMultipleCC = false;
    //     } else {
    //         this.showMultipleCC = true;
    //     }
    // }

    addAreaToList() {
        const areaData = this._reportFilterService.ReportFilterObject.AreaWise;
        this._reportFilterService.ReportFilterObject.AreaWise = areaData && areaData.AREA_ID ? areaData.AREA_ID : '';
        let selectAreaList = this._reportFilterService.ReportFilterObject.multipleAreas.filter(areaList => areaList.AREA_NAME == areaData.AREA_NAME)
        if (
            areaData.AREA_NAME === "" ||
            areaData.AREA_NAME === null ||
            areaData.AREA_NAME === undefined
        ) {
            return;
        }

        if (selectAreaList.length === 0) {
            this._reportFilterService.ReportFilterObject.multipleAreas.push({ AREA_ID: areaData.AREA_ID, AREA_NAME: areaData.AREA_NAME })
        }
    }

    deleteArea(index) {
        this._reportFilterService.ReportFilterObject.multipleAreas.splice(index, 1)
    }

}