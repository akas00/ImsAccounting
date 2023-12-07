import {AddUser} from './components/userManger/adduser.component';
import {Routes,RouterModule,CanActivate} from '@angular/router';
import {UserManager} from './userManager.component';
import {CanActivateTeam} from '../../common/services/permission/guard.service';
import {UserList} from './components/userManger/userList.component';
import { RoleMasterListComponent } from './components/role-master/role-master-list.component';
import { CheckboxesComponent } from './components/role-master/add-role-master/add-role-mater-demo.comopnent';
const routes:Routes =[
    {
        path:'',
        component: UserManager,
        children:[
            
             {path:'userlist',component:UserList,canActivate: [CanActivateTeam]},
             {path:'adduser',component:AddUser,canActivate: [CanActivateTeam]},
             {path:'rolemaster',component:CheckboxesComponent,canActivate: [CanActivateTeam]},
             {path:'rolemaster/add-rolemaster',component:RoleMasterListComponent,canActivate: [CanActivateTeam]},
        ]
        
    }
];

export const routing = RouterModule.forChild(routes);