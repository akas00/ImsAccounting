import { ModalModule } from "ng2-bootstrap";
import { CheckboxModule } from "primeng/components/checkbox/checkbox";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { Ng2SmartTableModule } from "../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { AutoCompleteModule } from "primeng/components/autocomplete/autocomplete";
import { NguiAutoCompleteModule } from "@ngui/auto-complete/dist";
import { routing } from "./configuration.routing";
import { Configuration } from "./configuration.component";
import { SchemeSettingComponent } from "./components/scheme-setting/scheme-setting.component";
import { SchemeSettingListComponent } from "./components/scheme-setting/scheme-setting-list.component";

import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { OpeningStockComponent } from "./components/openingStock/openingStock.component";
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { scheduleComponent } from "./components/schedule/schedule.component";
import { CalendarModule } from "primeng/components/calendar/calendar";
import { TabelComponent } from "./components/schedule/tableSchedule.component";
import { openingstocklistComponent } from "./components/openingStock/openingStockList.component";
import { NormsSettingComponent } from "./components/norms-setting/norms-setting.component";
import { SchemeComponent } from "./components/scheme/scheme.component";
import { TreeModule } from "angular-tree-component";
import { SchemeTableComponent } from "./components/scheme/schemeTable.component";
import { TableVehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistrationTable.component";
import { VehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistration.component";
import { popupListModule } from "../../common/popupLists/popuplist.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { PopQtyRangeComponent } from "./components/scheme/PopqtyRange.component";
import { EwayComponent } from "./components/EwayUpdate/Eway.component";
import { Ewaypopupcomponent } from "./components/EwayUpdate/Ewaypopup.component";
import { ExcelImportConfigComponent } from "./components/excel-import-config/excel-import-config.component";
import { KeysPipe } from "../../theme/directives/pipes/pipes";
import { EwaypopupRowDataComponent } from "./components/EwayUpdate/EwaypopupRowData.component";
import { FileUploaderPopupModule } from "../../common/popupLists/file-uploader/file-uploader-popup.module";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { LimitDecimalPlacesModule } from "../../common/directives/limit-decimal.module";
import { ManualSyncComponent } from "./components/manual-sync/manual-sync.component";
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    TransactionModule,
    AutoCompleteModule,
    NguiAutoCompleteModule,
    CalendarModule,
    CheckboxModule,
    TreeModule,
    popupListModule,
    FileUploaderPopupModule.forRoot(),
    GenericPopupGridModule.forRoot(),
    LimitDecimalPlacesModule.forRoot()
  ],
  declarations: [
    SchemeSettingListComponent,
    SchemeSettingComponent,
    Configuration,
    OpeningStockComponent, 
    openingstocklistComponent,  
    NormsSettingComponent,
    SchemeComponent,
    scheduleComponent,
    TabelComponent,
    SchemeTableComponent,
    VehicleRegistrationComponent,
    TableVehicleRegistrationComponent,
    PopQtyRangeComponent,
    EwayComponent,
    Ewaypopupcomponent,
    ExcelImportConfigComponent,
    KeysPipe,
    EwaypopupRowDataComponent,
    ManualSyncComponent

  ],
  providers: [CanActivateTeam, TransactionService]
})
export class ConfigurationModule {}
