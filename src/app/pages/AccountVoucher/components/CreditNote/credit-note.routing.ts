import { Routes, RouterModule } from "@angular/router";
import { CreditNoteComponent } from "./credit-note.component";
import { NgModule } from "./node_modules/@angular/cores/@angular/core";
  
const routes: Routes = [
    { path: '', component: CreditNoteComponent } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreditNoteRoutingModule { }