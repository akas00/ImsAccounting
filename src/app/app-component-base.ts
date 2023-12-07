import { Injector } from "@angular/core";
import { AuthService } from "./common/services/permission";
import { GlobalState } from "./global.state";
import { Http } from '@angular/http';

export abstract class AppComponentBase {

    public _authService: AuthService;
    public _state : GlobalState;
    public _http : Http;

    constructor(injector: Injector) { 
        this._authService = injector.get(AuthService); 
        this._state = injector.get(GlobalState);
        this._http = injector.get(Http); 
    }

    canActiveMenu(menu: string, right: string) { 
        return true;
        //this._authService.checkMenuRight(menu, 'list');
    }

    //end accountlist
    public get apiUrl(): string { 
        let url = this._state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }
}