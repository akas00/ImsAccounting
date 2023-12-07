import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

declare var $: any;

@Component({
    selector: 'previewReport',
    templateUrl: './PreviewReportFormat.html',
    providers: []

})

export class PreviewReportFormatComponent {
    source: any = <any>{};
    LeftHeader:any[]=[];
    constructor(){
        this.LeftHeader.push({label:"From",value:"2017-2-1"});
        this.LeftHeader.push({label:"To",value:"2017-1-1"});
        this.LeftHeader.push({label:"party",value:"My Party"});
    }
}