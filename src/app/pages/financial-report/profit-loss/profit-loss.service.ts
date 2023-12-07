import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../common/services/permission';
import { GlobalState } from '../../../global.state';
import { Observable } from 'rxjs';

@Injectable()

export class ProfitLossService {

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public getProfitLossData(params) {
        let body = {
            'DATE1': params.DATE1,
            'DATE2': params.DATE2,
            'DIV': params.DIV,
            'openingStock':Number(params.openingStock?params.openingStock:0),
            'closingStock':Number(params.closingStock?params.closingStock:0),
            'ShowSubLedger' : params.ShowSubLedgerPL ? params.ShowSubLedgerPL : 0,
        }
        return this.http.post(`${this.apiUrl}/getProfitLossData`, body, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
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
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

}