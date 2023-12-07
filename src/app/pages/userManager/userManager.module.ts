import {UserManager} from './userManager.component';
import {CanActivateTeam} from '../../common/services/permission/guard.service';
import {AddUser} from './components/userManger/adduser.component';
import {UserList} from './components/userManger/userList.component';
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../node_modules/ng2-smart-table/src/ng2-smart-table.module';
import {ModalModule} from 'ng2-bootstrap';
import { routing } from './userManager.routing';
import { TreeModule } from 'angular-tree-component';

 
import {LoginModule} from '../login/login.module';
import { RoleMasterListComponent } from './components/role-master/role-master-list.component';
import { CheckboxesComponent } from './components/role-master/add-role-master/add-role-mater-demo.comopnent';


@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    FormsModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    LoginModule,
    TreeModule
    
 

  ],
  declarations: [
    AddUser,UserManager,UserList,RoleMasterListComponent,CheckboxesComponent
  ],
  providers: [
      CanActivateTeam
  ]
})
export class UserManagerModule {
}