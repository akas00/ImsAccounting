import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { GstrDashBoardComponent } from './gstr-dashboard/gstr-dashboard.component';
import { Gstr1Component } from './gstr-1/gstr1.component';
import { Gstr2Component } from './gstr-2/gstr2.component';
import { Gstr4Component } from './gstr-4/gstr4.component';
import { Gstr3BComponent } from './gstr-3B/gstr-3B.component';
import { GstrComponent } from './gstr.component';

const routes: Routes = [
    // { path: '', redirectTo: 'dashboard',canActivate: [CanActivateTeam]},
    {
        path: '', component: GstrComponent, children: [
            { path: '', redirectTo: 'dashboard', canActivate: [CanActivateTeam] },
            { path: 'dashboard', component: GstrDashBoardComponent, canActivate: [CanActivateTeam] },
            { path: 'gstr-1', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/b2b', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/b2ba', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/b2cl', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/b2cla', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/b2cs', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/b2csa', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/cdnr', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/cdnra', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/cdnur', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/cdnura', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/exemp', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/hsn', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/exp', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/expa', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/at', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/ata', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/atadj', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/atadja', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-1/docs', component: Gstr1Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/b2b', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/b2bur', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/imps', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/impg', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/cdnr', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/cdnur', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/itcr', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/at', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/atadj', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/exemp', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-2/hsnsum', component: Gstr2Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-3b', component: Gstr3BComponent, canActivate: [CanActivateTeam] },
            { path: 'gstr-4', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/b2b', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/b2ba', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/b2bur', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/b2bura', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/imps', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/impsa', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/impsa', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/cdnr', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/cdnra', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/cdnura', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/cdnur', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/txos', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/txosa', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/at', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/ata', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/atadj', component: Gstr4Component, canActivate: [CanActivateTeam] },
            { path: 'gstr-4/atadja', component: Gstr4Component, canActivate: [CanActivateTeam] },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GstrRoutingModule { }