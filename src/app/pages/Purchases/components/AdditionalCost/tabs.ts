import { AdditionalCostService } from './addtionalCost.service';
import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { TabComponent } from './tab';

@Component({
    selector: 'tabs',
    template: `
       <ul class="tab-list">
           <li *ngFor="let tab of tabs" [class.active]="selectedTab===tab" (click)="onSelect(tab)">
               {{tab.tabTitle}}
           </li>
       </ul>
       <ng-content></ng-content>
    `,
    styles: [`
        .tab-list{
            list-style:none;
            overflow:hidden;
            padding:0;
            color: black;
        }

        .tab-list li{
            cursor:pointer;
            float:left;
            width:170px;
            height:30px;
            line-height:30px;
            text-align:center;
            margin: 0 .2em 1px 0;
    border: 1px solid #d6d6d6;
    background-color: #f6f7f9;
        border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: 0px;
        }

        .tab-list li:hover{
            background-color:#d6d6d6;
        }
        .tab-list li.active{
            background-color:white;
        }
    `]
})
export class TabsComponent implements AfterContentInit {

    @ContentChildren(TabComponent)

    tabs: QueryList<TabComponent>;

    selectedTab: TabComponent;
    constructor(private additionalcostService: AdditionalCostService) { }
    ngAfterContentInit() {
        this.select(this.tabs.first);
    }

    onSelect(tab) {
        this.select(tab);
    }

    select(tab) {
        this.tabs.forEach((item) => {
            item.show = false;
        });

        this.selectedTab = tab;
        this.selectedTab.show = true;
        if (tab.tabTitle == "Costing Detail") {
          if (this.additionalcostService.costList==null ||this.additionalcostService.costList.length==0 ) {
                return;
            }
            else{
            this.additionalcostService.generateCostDetails();
            }
        }
    }
}