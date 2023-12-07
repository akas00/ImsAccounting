
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TabsA } from './tabsA';
import { TabA } from './tabA';
import { ReportService, IReportMenu, IReport } from './report.service';
//import {MenuButton} from './mnubutton.ts'
import 'style-loader!./buttons.scss';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { MenuItem } from "../../../../common/interfaces/index";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

declare var $: any;

@Component({
    selector: 'report',
    templateUrl: './report.html',
    providers: [ReportService]

})

export class Report {
    reportMenus: Array<IReportMenu> = [];
    reportTabs: Array<IReportTab> = [];
    message: string;
    reportname: string = "";
    loadFromDrill = false;
    menuItems: MenuItem[] = [];
    activeIndexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0)
    activeIndex$: Observable<number> = this.activeIndexSubject.asObservable();
    // @ViewChild('application', {read: ViewContainerRef}) applicationRef: ViewContainerRef;
    constructor(private reportService: ReportService, private router: Router, private _elRef: ElementRef, private masterService: MasterRepo) {
        this.reportService.getReportMenus()
            .subscribe(res => {
                //console.log({ reportmenu: res });
                this.reportMenus.push(<IReportMenu>res);
            }, error => {
                this.masterService.resolveError(error, "report - getReportMenus");
            }, () => {

                this.menuItems = this.createMenu(this.reportMenus);
                //console.log({ repMenuCOmplete: this.reportMenus, menus: this.menuItems });
            }
            );
        //  this.reportParam.name="test;"

        //  this.reportMaster.reportGrid={ID: { title: 'ID',type: 'number' }, INITIAL: {title: 'Abb Value',type: 'string'},NAME:{title: 'Name',type: 'string'}};

        //    //console.log({frm:'report',reportMenu:this.reportMenus});


    }
    ngOnInit() {
        // this.reportMenus =this.reportService.getReportMenus();

    }

    createMenu(rptmenu: IReportMenu[]) {
        let menu: MenuItem[] = [];
        rptmenu.forEach(m => {
            let mnu: MenuItem = <MenuItem>{};
            mnu.label = m.title;
            mnu.menuName = m.reportName;
            if (m.children.length > 0) {
                mnu.items = [];
                this.addChildrenMenu(mnu, m)
            }
            else {
                mnu.command = (event) => {
                    this.onMenuItemClick(event);
                }
            }

            menu.push(mnu);
        })
        return menu;
    }
    addChildrenMenu(mnu: MenuItem, m: IReportMenu) {
        m.children.forEach(n => {
            let mm: MenuItem = <MenuItem>{};
            mm.label = n.title;
            mm.menuName = n.reportName;
            if (n.children.length > 0) {
                mm.items = [];
                this.addChildrenMenu(mm, n);
            }
            else {
                mm.command = (event) => {
                    this.onMenuItemClick(event);
                }
            }
            mnu.items.push(mm);
        })
    }

    onMenuItemClick(event) {
        //console.log({ event: event });
        if (event) {
            let repMenu: IReportMenu = <IReportMenu>{};
            repMenu.reportName = event.item.menuName;
            this.onMenuClick(repMenu);
        }
    }

    ngAfterViewInit() {

    }
    onMenuClick(event: IReportMenu, ReportQueryDataFromDrill = null) {
        try{
        //console.log({ frm: 'onMenuclick', obj: event });
        if (event) {
            if (event.reportName != '') {
                this.message = event.reportName;
                this.reportService.getReportMaster(event.reportName).subscribe(data => {
                    //console.log({ "reportMaster": data });
                    try {
                        let repTab: IReportTab = <IReportTab>{};
                        repTab.id = UUID.UUID();
                        repTab.report = <IReport>{};
                        if (data != null && data.result != null) {
                            repTab.report.reportGrid = data.result.reportGrid == null ? null : JSON.parse(data.result.reportGrid);
                            repTab.report.name = data.result.name;
                            repTab.report.title = data.result.title;
                            repTab.report.reportDrill = data.result.reportDrill == null ? null : JSON.parse(data.result.reportDrill);
                            // repTab.report.reportOptions=data.result.reportOptions==null?null:JSON.parse(data.result.reportOptions);
                            repTab.report.reportQuery = data.result.reportQuery == null ? null : JSON.parse(data.result.reportQuery);
                            repTab.report.controls = data.result.controls == null ? null : JSON.parse(data.result.controls);
                            repTab.report.reportDrill = data.result.reportDrill == null ? null : JSON.parse(data.result.reportDrill);

                            repTab.title = repTab.report.title;
                            repTab.active = true;
                            this.loadFromDrill = false;
                            //came from drill
                            if (ReportQueryDataFromDrill != null) {
                                this.loadFromDrill = true;
                                for (let rq of repTab.report.reportQuery) {
                                    for (let rgd of ReportQueryDataFromDrill) {
                                        if (rq.param == rgd.param) {
                                            rq.value = rgd.value;
                                        }
                                        
                                    }
                                }
                            }
                            ////console.log("Report Tabs"+repTab);
                            let i = this.reportTabs.push(repTab);
                            this.selectTab(i - 1);
                        }
                    }
                    catch (ex) {
                        //console.log({ onMenuClickError: ex });
                    }
                }, error => {
                    this.masterService.resolveError(error, "report - onMenuClick");
                });
                //  //console.log({report:rep});

            }
        }
        }catch(ex){alert(ex);}
    }
    selectTab(i) {
        // deactivate all tabs
        if (!this.reportTabs && this.reportTabs.length == 0) return;
        this.reportTabs.forEach(item => item.active = false);
        let item = this.reportTabs[i];
        //console.log(item);
        if (item) {
            this.reportname = item.report.name;


            item.active = true;
        }
    }

    contextMenuParam(param) {
        let repMenu: IReportMenu = { reportName: param.reportName, children: [], name: null, title: null };
        this.onMenuClick(repMenu, param.reportParamAndValues);
    }

}

export interface IReportTab {
    id: string;
    title: string;
    reportName: string;
    active: boolean;
    report: IReport;
    result: any;
}

