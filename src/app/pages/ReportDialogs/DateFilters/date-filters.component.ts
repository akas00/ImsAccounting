import { Component, Output, OnInit, EventEmitter } from "@angular/core";
import { AuthService } from "../../../common/services/permission/authService.service";
import { ReportMainService } from "../../Reports/components/ReportMain/ReportMain.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "date-filters",
    templateUrl: "./date-filters.component.html",
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    providers: [AuthService]

})
export class DateFilters implements OnInit {
    // @Output() startDateResponse = new EventEmitter();
    // @Output() endDateResponse = new EventEmitter();
    userProfile: any;
    activeurlPath:any;
    PhiscalObj: any=<any>{};
    constructor(private _authService: AuthService,
        private _reportFilterService:ReportMainService,
        public arouter:ActivatedRoute) {
        this.userProfile = this._authService.getUserProfile();
        this.PhiscalObj = this._authService.PhiscalObj();
       // this.activeurlPath = arouter.snapshot.url[0].path;
       ////console.log("snapshot",arouter.snapshot);
    }
    
    ngOnInit() {
        // this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this._reportFilterService.ReportFilterObject.DATE1=this.PhiscalObj.BeginDate.split('T')[0];
        this._reportFilterService.ReportFilterObject.DATE2 = new Date().toJSON().split('T')[0];
        
        this.changeEntryDate(this._reportFilterService.ReportFilterObject.DATE1, "AD");
        this.changeEndDate(this._reportFilterService.ReportFilterObject.DATE2, "AD");
        
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.ReportFilterObject.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            // this.startDateResponse.emit(value);
        } 
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.ReportFilterObject.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.ReportFilterObject.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            // this.endDateResponse.emit(value);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this._reportFilterService.ReportFilterObject.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }
}