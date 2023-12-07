import { MasterRepo } from "../../repositories";
import { DynamicFilterOptionComponent } from "./dynamic-filter-option-popup.component";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule 
  
  ],
  declarations: [DynamicFilterOptionComponent],
  exports: [DynamicFilterOptionComponent]
})
export class DynamicFilterOptionModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicFilterOptionModule,
      providers: [MasterRepo]
    };
  }
}
