import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { fiscalyearComponent } from './fiscalyear.component';
import { FiscalYearModule } from './fiscalyear.module';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: 'fiscalyear',
    component: FiscalYearModule,
    children: [
      
      { path: 'fiscalyear', component: fiscalyearComponent },
    ]
  },
 
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
