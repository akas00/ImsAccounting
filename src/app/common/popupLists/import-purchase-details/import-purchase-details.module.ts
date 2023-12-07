import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportPurchaseDetails } from "./import-purchase-details.component";
import { MasterRepo } from "../../repositories/masterRepo.service";
import { TransactionService } from "../../Transaction Components/transaction.service";

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ImportPurchaseDetails],
  exports: [ImportPurchaseDetails]
})
export class ImportPurchaseDetailsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImportPurchaseDetailsModule,
      providers: [MasterRepo,TransactionService]
    };
  }
}
