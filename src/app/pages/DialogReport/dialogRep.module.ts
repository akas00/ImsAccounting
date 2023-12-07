import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../node_modules/ng2-smart-table/src/ng2-smart-table.module';
import { ModalModule } from 'ng2-bootstrap';
import { routing } from './dialogRep.routing';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { Report } from './components/reports/report.component';
import { TabsA } from './components/reports/tabsA';
import { TabA } from './components/reports/tabA';
import { MenuButton } from './components/reports/mnubutton';
import { ReportDialog } from './components/reports/reportdialog.component';
import { ReportTable } from './components/reports/ReportTable.component';
import { dialogRepComponent } from './dialogRep.component';
import { TreeModule } from 'angular-tree-component';
import { ReportControls } from './components/reports/reportControls';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import {ContextMenuModule } from 'ngx-contextmenu';
import {ReportService} from './components/reports/report.service';
import {MenubarModule} from 'primeng/components/menubar/menubar';
import {TabViewModule} from 'primeng/components/tabview/tabview';
import { ExcelService } from "./components/reports/Excel.service";

import { DebitorsReportOptionsAndDueAgingComponent } from "./components/ReportDynamicControls/DebitorsReportOptionsAndDueAging.component";
import { TreePartyAndLedgerComponent } from "./components/ReportDynamicControls/TreePartyAndLedger";
import { PreviewReportFormatComponent } from "./components/reports/PreviewReportFormat";
import { AddUserService } from "../userManager/components/userManger/adduser.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    TreeModule,
    NguiAutoCompleteModule,
    ContextMenuModule,MenubarModule,TabViewModule
  ],
  declarations: [
    dialogRepComponent,
    Report, TabsA, TabA, MenuButton, ReportDialog, ReportTable,
    ReportControls,
    DebitorsReportOptionsAndDueAgingComponent,
    TreePartyAndLedgerComponent,
    PreviewReportFormatComponent
  ],
  providers: [
    CanActivateTeam,ReportService,
    ExcelService,AddUserService
  ],
})
export class ReportModule {
}
