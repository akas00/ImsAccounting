import { Injectable, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AuthService } from '../services/permission';
import { GlobalState } from '../../global.state';



@Injectable()

export class PhiscalYearService {

    @ViewChild('dataTable') dataTable: ElementRef
    public selectedRowIndex = 0
   
    constructor(private router: Router,  private http: Http, private authService: AuthService, private state: GlobalState) {

    }

    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public extractData(res: Response) {
        let response = res.json();
        return response || {};
    }

    public handleError(error: Response | any) {
        return Observable.throw(error);
    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }





}