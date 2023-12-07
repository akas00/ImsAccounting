import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TerminalComponent } from './terminal.component';
import { TerminalRouting }       from './terminal.routing';
import { ModalModule } from 'ng2-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    NgaModule,
    ModalModule.forRoot(),
    TerminalRouting,
  ],
  declarations: [

    TerminalComponent
  ],

  providers: [
  ]
})
export class TerminalModule {}
