import { Routes, RouterModule } from "@angular/router";
import { Configuration } from "./configuration.component";
import { SchemeSettingComponent } from "./components/scheme-setting/scheme-setting.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { OpeningStockComponent } from "./components/openingStock/openingStock.component";
import { scheduleComponent } from "./components/schedule/schedule.component";
import { TabelComponent } from "./components/schedule/tableSchedule.component";
import { openingstocklistComponent } from "./components/openingStock/openingStockList.component";
import { NormsSettingComponent } from "./components/norms-setting/norms-setting.component";
import { SchemeComponent } from "./components/scheme/scheme.component";
import { SchemeTableComponent } from "./components/scheme/schemeTable.component";
import { TableVehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistrationTable.component";
import { VehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistration.component";
import { EwayComponent } from "./components/EwayUpdate/Eway.component";
import { ExcelImportConfigComponent } from "./components/excel-import-config/excel-import-config.component";
import { ManualSyncComponent } from "./components/manual-sync/manual-sync.component";

const routes: Routes = [
  {
    path: "",
    component: Configuration,
    children: [
      {
        path: "scheme-setting",
        component: SchemeSettingComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "openingStock",
        component: openingstocklistComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "openingStock/add-openingstock",
        component: OpeningStockComponent,
        canActivate: [CanActivateTeam]
      },
      // {
      //   path: "acOpeningBalance",
      //   component: acOpeningBalanceComponent,
      //   canActivate: [CanActivateTeam]
      // },
      // {
      //   path: "acOpeningBalance/add-openingbl",
      //   component: accountOpeningBalance,
      //   canActivate: [CanActivateTeam]
      // },
      // {
      //   path: "paOpeningBalance",
      //   component: partyOpeningBalanceComponent,
      //   canActivate: [CanActivateTeam]
      // },
      {
        path: "normsetting",
        component: NormsSettingComponent,
        canActivate: [CanActivateTeam]
      },
      { path: "scheme", component: SchemeComponent },
      { path: "schedule", component: scheduleComponent },
      {
        path: "scheduleTable",
        component: TabelComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "schemeTable",
        component: SchemeTableComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "VehicleRegistration",
        component: TableVehicleRegistrationComponent
      },
      {
        path: "NewVehicleRegistration",
        component: VehicleRegistrationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "EwayUpdate",
        component: EwayComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "master-migration",
        component: ExcelImportConfigComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path:"manual-sync",
        component: ManualSyncComponent,
        canActivate:[CanActivateTeam]
      }
      // {
      //   path: "account-opening-balance",
      //   component: AccountOpeningBalance,
      //   canActivate: [CanActivateTeam]
      // },
      // {
      //   path: "party-opening-balance",
      //   component: PartyOpeningBalance,
      //   canActivate: [CanActivateTeam]
      // }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
