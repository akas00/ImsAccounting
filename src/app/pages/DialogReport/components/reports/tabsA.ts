import { Component, ContentChildren, QueryList, AfterContentInit,Input,Output,EventEmitter } from '@angular/core';
import { TabA } from './tabA';
//import {ReportDialog} from './reportDialog.component';
import {IReportTab} from './report.component';
import {ReportService,IReportMenu,IReport} from './report.service';
import { Observable } from "rxjs/Observable";
@Component({
    selector: 'tabsA',
    template: `
    <p-tabView (onChange)="handleOnChange($event)" (onClose)="handleOnClose($event)"  >  
     <p-tabPanel *ngFor="let tab of reportTabs" [header]="tab.title" [closable]="true" [selected]="tab.active" >
        
        <ul class="pane">
            <li *ngFor="let tab of reportTabs;let i=index" [hidden]="!tab.active" style="float:inherit">
                <tabA [active]="tab.active" >
                    <h1>{{tab.title}}</h1>
                    <report-dialog [reportname]="reportname" [reportMaster]="tab.report" (contextmenuEmit)="contextMenuParam($event)" [loadFromDrill]="loadFromDrill"></report-dialog>
                    <reportmain [reportname]="reportname" [reportMaster]="tab.report" ></reportmain>
                </tabA>

            </li>
        </ul>  
        
    </p-tabPanel>
</p-tabView> 
    <!--<ul class="nav nav-tabs">
      <li *ngFor="let tab of reportTabs;let i=index" (click)="selectTab(i)" [class.active]="tab.active" >
        <a>{{tab.title}}<span><button type="button" (click)="onTabClose(i)" > x </button></span></a>
        </li>
    </ul>
    <ul class="pane">
      <li *ngFor="let tab of reportTabs;let i=index" [hidden]="!tab.active" style="float:inherit">
         <tabA [active]="tab.active" >
             <h1>{{tab.title}}</h1>
             <report-dialog [reportname]="reportname" [reportMaster]="tab.report" (contextmenuEmit)="contextMenuParam($event)" [loadFromDrill]="loadFromDrill"></report-dialog>
             <reportmain [reportname]="reportname" [reportMaster]="tab.report" ></reportmain>
          </tabA>

      </li>
    </ul>-->
    <ng-content></ng-content>
  `,

  styles:[`<style>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333333;
}

li {
    float: left;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 5px;
    text-decoration: none;
}

li a:hover {
    background-color: #111111;
}
</style>`]
})
export class TabsA implements AfterContentInit {

    @ContentChildren(TabA) tabs: QueryList<TabA>;
    @Input('reportTabs')reportTabs:Array<IReportTab>=[];
    @Input() reportname:string;
    @Output() contextmenuEmit = new EventEmitter();
    @Input() loadFromDrill=false;
    @Input() activeIndex:Observable<number>;
    constructor(){
        //console.log(this.reportTabs);
    }
    
    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }
 contextMenuParam(param){
this.contextmenuEmit.emit(param);
     }
    selectTab(i) {
        // deactivate all tabs
        if( !this.reportTabs && this.reportTabs.length==0) return;
        this.reportTabs.forEach(item=>item.active=false);
        let item =this.reportTabs[i];
        ////console.log("reportname",item.report.name);
        if(item){
            this.reportname=item.report.name;
           item.active=true;
        }
        //let tab =this.tabs[i].
        //this.tabs.toArray().forEach(tab => tab.active = false);
        
        // activate the tab the user has clicked on.
        //if(tab)
        //tab.active = true;
    }

    onTabClose(i){
        this.reportTabs.splice(i,1);
        if(this.reportTabs.length>0){
        this.reportTabs[this.reportTabs.length-1].active=true;
        }
    }

    handleOnChange(event){
        //console.log({"handleOnChange":event});
        this.selectTab(event.index);
    }

    handleOnClose(event){
        //console.log({handleOnClose:event});
        this.onTabClose(event.index);
    }
}
