import { Component, OnInit, Input, OnChanges, AfterViewInit } from "@angular/core";
import { GstrService } from "../gstr.service";
@Component({
    selector: "gst-summmary-list",
    templateUrl: "./gst-summary-list.component.html",
})
export class GstSummaryListComponent implements OnInit, OnChanges {
  
    @Input() summarySource: any
    @Input() totalSource: any
    @Input() listSetting: GenericListSettings;
    public gstSummaryDetail: any
    public gstTotalDetail: any
    constructor(private _gstrService:GstrService) {


    }
    ngOnInit() {

    }
    

    ngOnChanges(changes: any): void {
        if(changes.listSetting){
            this.listSetting = changes.listSetting.currentValue;
        }
        if(changes.summarySource){
            this.gstSummaryDetail = changes.summarySource.currentValue;
        }
        if(changes.totalSource){
            this.gstTotalDetail = changes.totalSource.currentValue;
        }
       
    }

    getWidth(cols){
        return Number(cols)*200+`px`
    }

}


export class GenericListSettings {
    title: string;
    columns: ColumnSettings[] = [];
}


export class ColumnSettings {
    key: string;
    title: string;
}