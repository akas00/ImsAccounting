import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "./node_modules/@angular/cores/@angular/core";
import { ReverseCreditNoteComponent } from "./reverse-credit-note.component";
  
const routes: Routes = [
    { path: '', component: ReverseCreditNoteComponent } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReverseCreditNoteRoutingModule { }