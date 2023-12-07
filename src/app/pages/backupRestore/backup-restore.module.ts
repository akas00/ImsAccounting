import { NgModule } from '@angular/core';
import { PrefixComponent } from "./../../common/Prefix/prefix.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { ModalModule } from 'ng2-bootstrap';

import { CanActivateTeam } from '../../common/services/permission/guard.service'
import { LoginModule } from "../login/index";
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { BackupRestore } from "./backup-restore.component";
import { BackupRestoreComponent } from "./components/BackupRestore/main-backup-restore.component";
import { routing } from "./backup-restore.routing";



@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, NguiAutoCompleteModule,
    NgaModule,
    routing,
    ModalModule.forRoot(),
    // LoginModule
  ],
  declarations: [
    BackupRestore, BackupRestoreComponent 
  ],
  providers: [
    CanActivateTeam
  ]
})
export class BackupRestoreModule {
}
