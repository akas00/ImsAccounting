import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReportMainService } from './components/ReportMain/ReportMain.service';

@Component({
    selector: 'report',
    template: '<router-outlet></router-outlet>'
})

export class ReportsComponent {
    constructor( private reportFilterService: ReportMainService) {
        
    }

}