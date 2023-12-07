import { Routes, RouterModule } from '@angular/router';
import { Purchases } from './purchases.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { DebitNoteItemBaseComponent } from "./components/DebitNoteItemWise/debitnote-itembase.component";
import { AddPurchaseInvoiceComponent } from './components/purchaseinvoice/AddPurchaseInvoice';

const routes: Routes = [
    {
        path: '',
        component: Purchases,
        children: [
         
            { path: 'add-purchase-invoice', component: AddPurchaseInvoiceComponent, canActivate: [CanActivateTeam] },
            { path: 'add-debitnote-itembase', component: DebitNoteItemBaseComponent, canActivate: [CanActivateTeam] },
            // { path: 'additional-cost', component: MasterAdditional, canActivate: [CanActivateTeam] },
  
        ]

    }
];

export const routing = RouterModule.forChild(routes);