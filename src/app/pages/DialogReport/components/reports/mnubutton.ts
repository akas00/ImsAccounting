import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReportService, IReportMenu } from './report.service'
@Component({
    selector: 'menu-btn',
    template: `
      <div class="dropdown">
  <button class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown">{{menu.title}}
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
    <li *ngFor="let cmnu of menuList;let i=index" ><a  (click)="onMenuClick(cmnu)">{{cmnu.title}}</a>
     <ul *ngIf="cmnu.children.length>0">
      <li *ngFor="let c of cmnu.children;let i=index" ><a (click)="onMenuClick(c)">{{c.title}}</a></li>
     </ul>
    </li>
  </ul>
</div>
    `
})

export class MenuButton implements OnInit {
    @Input('menuName') menuName: string;
    @Output('menuClick') menuClick = new EventEmitter();
    menu: IReportMenu;
    menuList: Array<IReportMenu> = [];
    constructor(private reportService: ReportService) {

    }
    ngOnInit() {
        try {
            //console.log({ name: this.menuName });
            this.menu = this.reportService.reportMenus.find(mnu => mnu.name == this.menuName);
            if (this.menu) {
                this.menuList = this.menu.children;
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    onMenuClick(IReportMenu) {
        try {
            this.menuClick.emit(IReportMenu);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
}