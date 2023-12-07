import { NgModule } from "@angular/core";
import { NgaModule } from "../../theme/nga.module";
import { phiscalyearcomponent } from "./phiscalyear.component";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ng2-bootstrap";

@NgModule({
    imports:[
        CommonModule, 
        ModalModule.forRoot(),
        NgaModule
    ],
    declarations:[phiscalyearcomponent],
    exports:[phiscalyearcomponent]
})
export class phsicalyearModule{}