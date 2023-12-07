import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";
import { MultiPrintRoutingModule } from "./multiple-voucher-print.routing";
import { MultiPrintComponent } from "./multiple-voucher-print.component";
import { PrintInvoiceComponent } from "../../common/Invoice/print-invoice/print-invoice.component";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    NgxPaginationModule,
    MultiPrintRoutingModule,
    NgxDaterangepickerMd.forRoot(),

  ],
  declarations: [
    MultiPrintComponent
  ],
  providers:[PrintInvoiceComponent,TransactionService]
})
export class MultiPrintModule { }
