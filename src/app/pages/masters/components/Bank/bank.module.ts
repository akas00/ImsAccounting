import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { BankComponent } from "./bank.component";
import { BankRoutingModule } from "./bank.routing";
import { BankListComponent } from "./bank-list.component";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BankRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    BankListComponent,
    BankComponent,
      
  ],
  exports:[
    BankComponent
  ]
})
export class BankModule{ }
