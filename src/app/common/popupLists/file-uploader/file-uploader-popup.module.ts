import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { MasterRepo } from "../../repositories";
import { NgaModule } from "../../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";
import { FileUploaderPopupComponent } from "./file-uploader-popup.component";
import { FileUploaderService } from "./file-uploader-popup.service";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [FileUploaderPopupComponent],
  exports: [FileUploaderPopupComponent]
})
export class FileUploaderPopupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FileUploaderPopupModule,
      providers: [MasterRepo, FileUploaderService]
    };
  }
}
