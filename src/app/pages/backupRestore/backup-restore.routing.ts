import { Routes, RouterModule, CanActivate } from '@angular/router';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { BackupRestoreComponent } from "./components/BackupRestore/main-backup-restore.component";

const routes: Routes = [
    {
        path: '',
        component: BackupRestoreComponent,
        children: [

            // { path: 'incomevoucher', component: IncomeVouchers, canActivate: [CanActivateTeam] },
           
        ]

    }
];

export const routing = RouterModule.forChild(routes);