import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReverseEntryComponent } from './reverse-entry.component'
@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ReverseEntryComponent],
  exports: [ReverseEntryComponent]
})

export class ReverseEntryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ReverseEntryModule
    };
  }
}
