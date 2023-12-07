import { Routes, RouterModule } from '@angular/router';
import { Sales } from './sales.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { CreditNoteItemBaseComponent } from "./components/CreditNoteItemWise/creditnote-itembase.component";
import { AddSalesInvoiceComponent } from './components/salesinvoice/AddSalesInvoices';
import { PendingChangesGuard } from '../../common/services/guard/can-navigate.guard';

const routes: Routes = [
    {
        path: '',
        component: Sales,
        children: [ 
            { path: 'add-creditnote-itembase', component: CreditNoteItemBaseComponent, canDeactivate: [PendingChangesGuard],},        
            { path: 'addsientry', component: AddSalesInvoiceComponent ,canActivate:[CanActivateTeam], canDeactivate: [PendingChangesGuard],},
        ] 
    }
];

export const routing = RouterModule.forChild(routes);