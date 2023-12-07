import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../common/services/permission';
import { GlobalState } from '../../../global.state';
import { Observable } from 'rxjs';

@Injectable()

export class LedgerVoucherService {

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public getLedgerVoucherData(from, to, acid, div,summaryReport,type) {
        let summary = summaryReport?1:0;
        return this.http.get(`${this.apiUrl}/getLedgerVoucherData?DATE1=${from}&DATE2=${to}&ACID=${acid}&DIV=${div}&summaryReport=${summary}&type=${type}`, this.getRequestOption())
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
        return new RequestOptions({ headers: headers });
    }

}