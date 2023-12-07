import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { CompanyService } from "./company.service";
import { CompanyFormComponent } from "./companyForm.component";
import { CompanyInfoRoutingModule } from "./company-info.routing";
import { ModalModule } from "ngx-bootstrap";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyInfoRoutingModule,
    NgaModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    CompanyFormComponent
  ],
  providers:[CompanyService]
})
export class CompanyInfoModule { }
