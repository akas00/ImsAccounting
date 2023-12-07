import { Component, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
import { ReportFilterComponent, ReportFilterOption } from '../../../common/popupLists/report-filter/report-filter.component';
import { CacheService } from '../../../common/services/permission';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ReportMainService } from '../../Reports/components/ReportMain/ReportMain.service';
import { BudgetService } from './budget.service';


@Component({
    selector: 'budget',
    templateUrl: './budget.component.html',
})

export class BudgetComponent  {

    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    @ViewChild('tblTable') tblTable: ElementRef
    public reportType: string = "TBL"
    public trialBalanceData = []
    public companyProfile: any;
    showReportListDialog: boolean;
    previouslyLoadedReportsList: any[] = [];
    isOnlyOpeningBalanceMode: boolean = false;

    constructor(private eventListener: EventListenerService, private activatedRoute: ActivatedRoute,
        private _reportFilterService: ReportFilterService, private _alertService: AlertService, private _spinnerService: SpinnerService, private budgetservice: BudgetService, private _cacheService: CacheService,
        private arouter: Router, private _reportMainService: ReportMainService) {
        this.companyProfile = this._cacheService.get('USER_PROFILE')

    }

   


  

   

}
