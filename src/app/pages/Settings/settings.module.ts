
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { routing } from "./settings.routing";
import { Settings } from "./setting.component";
import { SettingsList } from "./components/settingLists/setting-list.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { ModalModule } from "ng2-bootstrap";


@NgModule({
  imports: [
    routing,
    CommonModule,
    FormsModule,
    NgaModule,
    ModalModule.forRoot(),
   

  ],
  declarations: [
    Settings,
    SettingsList

   
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class SettingsModule { }
