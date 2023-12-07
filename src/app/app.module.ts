import { NgModule, ApplicationRef, APP_INITIALIZER } from '@angular/core';
import { MessageDialog } from "./pages/modaldialogs/messageDialog/messageDialog.component";
import { AuthDialog } from "./pages/modaldialogs/authorizationDialog/authorizationDialog.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import 'hammerjs';
 import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
 import {NoopAnimationsModule} from '@angular/platform-browser/animations';
 import {HotkeyModule} from 'angular2-hotkeys';
 import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
 import{SharedModule} from 'primeng/components/common/shared'
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
//services
import {MockMasterRepo,MasterRepo} from './common/repositories';
import {AppSettings, IndexedDbWrapper} from './common/services'
import { SettingService} from './common/services/setting.service';

import {CanActivateTeam,Permissions,UserToken,AuthService,CacheService} from './common/services/permission';
import { LoginService, LoginModule } from './pages/login';
import {ContextMenuModule } from 'ngx-contextmenu';
import { LoginDialog } from "./pages/modaldialogs/index";
import { CookieService } from 'angular2-cookie/core';
import { TransactionModule } from "./common/Transaction Components/transaction.module";
import { DispatchDialog } from "./pages/modaldialogs/dispatchDialog/dispatchDialog.component";
import { GRNPopUpComponent } from './pages/modaldialogs/GRNDialog/GRNPopUp';
import { popupListModule } from './common/popupLists/popuplist.module';
import { EventListenerService } from './pages/financial-report/event-listener.service';
import { ReportFilterService } from './common/popupLists/report-filter/report-filter.service';
import { ReportMainService } from './pages/Reports/components/ReportMain/ReportMain.service';
import {  AppConfigService } from './app-config.service';
import { TransactionService } from './common/Transaction Components/transaction.service';
import { PrintInvoiceComponent } from './common/Invoice/print-invoice/print-invoice.component';
import { BillTrackingAmendmentService } from './pages/AccountVoucher/components/bill-tracking-amendment/bill-tracking-amendment.service';



// import { TooltipContentComponent } from './common/Extra/tooltip/tooltip.component';
// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  AuthService,
  CacheService,MasterRepo,CookieService,
  EventListenerService,ReportFilterService,
  MockMasterRepo,UserToken,Permissions,CanActivateTeam,SettingService,LoginService,AppSettings, IndexedDbWrapper,
  ReportMainService
  
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */


 
export function loadModuleConfig(config: AppConfigService) {
  return () => config.loadAppConfiguration().then(res => {
    config.loadAppConfiguration()

  }, err => {

  });

}


@NgModule({
  bootstrap: [App],
  declarations: [LoginDialog, AuthDialog, MessageDialog, DispatchDialog,
    App,
    GRNPopUpComponent  
  ], 
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    PagesModule,
    routing,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    ContextMenuModule,LoginModule,
    HotkeyModule.forRoot(),
    AutoCompleteModule,SharedModule,
    TransactionModule,popupListModule

    
   
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS, 
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadModuleConfig,
      deps: [AppConfigService],
      multi: true
    },CanActivateTeam, TransactionService,PrintInvoiceComponent,BillTrackingAmendmentService
  ],
  entryComponents:[LoginDialog, AuthDialog, MessageDialog, DispatchDialog,GRNPopUpComponent],
})

export class AppModule {

  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
