import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { LoginCopy } from './login.componentcopy';
import {Login} from './login.component'
import { routing }       from './login.routing';
import { ModalModule } from 'ng2-bootstrap';
import {SearchUserComponent} from './searchUser.component';
import {SendEmailComponent} from './sendEmail.component';
import {enterSecurityComp} from './enterSecurityCode.component';
import {NewPasswordComp} from './newPassword.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    ModalModule.forRoot()
  ],
  declarations: [Login,LoginCopy,SearchUserComponent,SendEmailComponent,enterSecurityComp,NewPasswordComp   
  ],
  exports:[Login,LoginCopy,SendEmailComponent]
})
export class LoginModule {}
