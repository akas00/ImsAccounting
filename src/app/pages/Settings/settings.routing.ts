

import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingsList } from './components/settingLists/setting-list.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [ 
            { path: 'settingslist', component: SettingsList,},        
           
        ] 
        
    }
];

export const routing = RouterModule.forChild(routes);
