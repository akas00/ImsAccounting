import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "costcenter-filters",
    templateUrl: "./costcenter-filters.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class CostcenterFilters {
    CostcenterList: any[] = [];
    showMultipleCC: boolean;

    constructor(public masterService: MasterRepo, private _reportFilterService: ReportMainService) {
        this.masterService.getCostcenter().subscribe(res => {
            this.CostcenterList = res;
        })
        _reportFilterService.ReportFilterObject.multipleCostcenter = [];

        if(this._reportFilterService.AccoutLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'accountledgerreport' && ( _reportFilterService.AccoutLedgerObj.multipleCostcenter && _reportFilterService.AccoutLedgerObj.multipleCostcenter.length!=0)){
            _reportFilterService.ReportFilterObject.multipleCostcenter = _reportFilterService.AccoutLedgerObj.multipleCostcenter;
        }
        if(this._reportFilterService.PartyLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'partyledgerreport' && (_reportFilterService.PartyLedgerObj.multipleCostcenter &&_reportFilterService.PartyLedgerObj.multipleCostcenter.length!=0)){
            _reportFilterService.ReportFilterObject.multipleCostcenter = _reportFilterService.PartyLedgerObj.multipleCostcenter;
        }
        if(this._reportFilterService.SummaryLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'summaryledgerreport' && ( _reportFilterService.SummaryLedgerObj.multipleCostcenter && _reportFilterService.SummaryLedgerObj.multipleCostcenter.length!=0)){
            _reportFilterService.ReportFilterObject.multipleCostcenter = _reportFilterService.SummaryLedgerObj.multipleCostcenter;
        }
        if(this._reportFilterService.SummaryPartyLedgerObj.assignPrevioiusDate == true && this._reportFilterService.reportUrlPath == 'summarypartyledger' && ( _reportFilterService.SummaryPartyLedgerObj.multipleCostcenter && _reportFilterService.SummaryPartyLedgerObj.multipleCostcenter.length!=0)){
            _reportFilterService.ReportFilterObject.multipleCostcenter = _reportFilterService.SummaryPartyLedgerObj.multipleCostcenter;
        }
    
        this.showMultipleCC = true;
    }

    checkValue() {
        if (this._reportFilterService.ReportFilterObject.showAllContacts == true) {
            this.showMultipleCC = false;
        } else {
            this.showMultipleCC = true;
        }
    }

    addCostcenterToList() {
        const ccData = this._reportFilterService.ReportFilterObject.CCENTER;
        this._reportFilterService.ReportFilterObject.CCENTER = ccData && ccData.CCID ? ccData.CCID : '';
        let selectCCenterList = this._reportFilterService.ReportFilterObject.multipleCostcenter.filter(centerList => centerList.COSTCENTERNAME == ccData.COSTCENTERNAME)
        if (
            ccData.COSTCENTERNAME === "" ||
            ccData.COSTCENTERNAME === null ||
            ccData.COSTCENTERNAME === undefined
        ) {
            return;
        }

        if (selectCCenterList.length === 0) {
            this._reportFilterService.ReportFilterObject.multipleCostcenter.push({ CCID: ccData.CCID, COSTCENTERNAME: ccData.COSTCENTERNAME })
        }

    }

    deleteCostcenter(index) {
        this._reportFilterService.ReportFilterObject.multipleCostcenter.splice(index, 1)
    }

}