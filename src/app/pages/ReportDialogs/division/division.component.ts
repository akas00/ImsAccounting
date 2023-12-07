import { Component, Output, OnInit, EventEmitter } from "@angular/core";
import { AuthService } from "../../../common/services/permission/authService.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";
import { MasterRepo } from "../../../common/repositories/masterRepo.service";
import { Division } from '../../../common/interfaces';

@Component({
    selector: "division-list",
    templateUrl: "./division.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    providers: [AuthService]

})
export class DivisionComponent {
    division: any[] = [];

    constructor(private _authService: AuthService,
        private _reportFilterService:ReportMainService,
        public masterService: MasterRepo) {
        this.division = [];
        this.masterService.getAllDivisions()
            .subscribe(res => {
                this.division.push(<Division>res);
            }, error => {
                this.masterService.resolveError(error, "divisions - getDivisions");
            });

        this._reportFilterService.ReportFilterObject.DIV=this.masterService.userProfile.CompanyInfo.INITIAL;

    }
    
 




}