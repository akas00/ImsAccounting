import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../common/services/permission';
import { GlobalState } from '../../../global.state';
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()

export class PurchaseService {

    constructor(private http: Http, private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";
        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    getPoList(filter,currentPage) {
        let status = 0
        if ('advanceFilterObj' in filter) {
            let filterObj = filter.advanceFilterObj.find(x => x.filterOptionKey == 'STATUS')
            status = filterObj.filterValue
        }
        return this.http.post(`${this.apiUrl}/getPoList?currentPage=${currentPage}&maxResultCount=10`,filter, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }

    public extractData(res: Response) {
        let response = res.json();
        return response || {};
    }

    public handleError(error: Response | any) {
        return Observable.throw(error);
    }


}