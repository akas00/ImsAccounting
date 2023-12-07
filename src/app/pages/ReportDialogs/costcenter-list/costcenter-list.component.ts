import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";

@Component({
    selector: "costcenter-list",
    templateUrl: "./costcenter-list.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class CostcenterList {
    CostcenterList: any[] = [];

    constructor(public masterService: MasterRepo,private _reportFilterService:ReportMainService) {
        this.masterService.getCostcenter().subscribe(res => {
            this.CostcenterList = res;
        })

        _reportFilterService.ReportFilterObject.CostCenter ='%'


    }
}