import { NgModule, ModuleWithProviders }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgUploaderModule } from 'ngx-uploader';
import {BusyModule} from 'angular2-busy';
import {MdInputModule,MdAutocompleteModule,MdCheckboxModule,MdDatepickerModule,MdSelectModule,MaterialModule,MdDialogModule,MdNativeDateModule, MATERIAL_SANITY_CHECKS,ConnectedOverlayPositionChange} from '@angular/material';

import {
  BaThemeConfig
} from './theme.config';

import {
  BaThemeConfigProvider
} from './theme.configProvider';

import {
  BaAmChart,
  BaBackTop,
  BaCard,
  BaChartistChart,
  BaCheckbox,
  BaContentTop,
  BaFullCalendar,
  BaMenuItem,
  BaMenu,
  BaMsgCenter,
  BaMultiCheckbox,
  BaPageTop,
  BaPictureUploader,
  BaSidebar,
  
} from './components';

import { BaCardBlur } from './components/baCard/baCardBlur.directive';

import {
  BaScrollPosition,
  BaSlimScroll,
  BaThemeRun
} from './directives';

import {
  BaAppPicturePipe,
  BaKameleonPicturePipe,
  BaProfilePicturePipe,
  TwoDigitNumber,
} from './pipes';

import {
  BaImageLoaderService,
  BaMenuService,
  BaThemePreloader,
  BaThemeSpinner
} from './services';

import {
  EmailValidator,
  EqualPasswordsValidator,
  EditPasswordValidator
} from './validators';
import { AuthService } from '../common/services/permission';
import { phsicalyearModule } from '../common/phiscalyear/phiscalyear.module';

const NGA_COMPONENTS = [
  BaAmChart,
  BaBackTop,
  BaCard,
  BaChartistChart,
  BaCheckbox,
  BaContentTop,
  BaFullCalendar,
  BaMenuItem,
  BaMenu,
  BaMsgCenter,
  BaMultiCheckbox,
  BaPageTop,
  BaPictureUploader,
  BaSidebar
];

const NGA_DIRECTIVES = [
  BaScrollPosition,
  BaSlimScroll,
  BaThemeRun,
  BaCardBlur
];

const NGA_PIPES = [
  BaAppPicturePipe,
  BaKameleonPicturePipe,
  BaProfilePicturePipe,
  TwoDigitNumber
];

const NGA_SERVICES = [
  BaImageLoaderService,
  BaThemePreloader,
  BaThemeSpinner,
  BaMenuService
];

const NGA_VALIDATORS = [
  EmailValidator,
  EqualPasswordsValidator,
  EditPasswordValidator
];

@NgModule({
  declarations: [
    ...NGA_PIPES,
    ...NGA_DIRECTIVES,
    ...NGA_COMPONENTS,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgUploaderModule,MdInputModule,MdSelectModule,MdAutocompleteModule,
    MdCheckboxModule,MaterialModule,MdDatepickerModule,MdDialogModule,MdNativeDateModule,BusyModule
    
  ],
  exports: [
    ...NGA_PIPES,
    ...NGA_DIRECTIVES,FormsModule,CommonModule,
    ReactiveFormsModule,
    ...NGA_COMPONENTS,MdInputModule,MdSelectModule,MdAutocompleteModule,
        MdCheckboxModule,MaterialModule,MdDatepickerModule,BusyModule,
  ]
})
export class NgaModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: NgaModule,
      providers: [
        BaThemeConfigProvider,
        BaThemeConfig, 
        ...NGA_VALIDATORS,
        ...NGA_SERVICES,
        
      ],
    };
  }
}
