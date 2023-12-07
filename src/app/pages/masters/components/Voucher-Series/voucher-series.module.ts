import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { VoucherSeriesRoutingModule } from './voucher-series.routing';
import { VoucherSeriesFormComponent} from './voucher-series-form.component';
import { VoucherSeriesListComponent} from './voucher-series-list.component';
import { ModalModule } from "ngx-bootstrap";
import { SearchPipe} from "./search.pipe";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    VoucherSeriesRoutingModule

  ],
  declarations: [
      VoucherSeriesFormComponent,
      VoucherSeriesListComponent,
      SearchPipe
  ],
})
export class VoucherSeriesModule {
 }