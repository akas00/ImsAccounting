import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs";
import { AuthService } from './common/services/permission/authService.service';
import { GlobalState } from './global.state';
import { AppConfiguration } from './environment';
@Injectable()
export class AppConfigService {

    public options: RequestOptions;
    public apiUrl: string;
    constructor(public http: Http) {
        let headers: Headers = new Headers({
            "Content-type": "application/json",
        });
        this.options = new RequestOptions({ headers: headers });
    }





    public loadAppConfiguration(): Promise<any> {
        var promise = this.http.get(`../appConfig.json`, this.options)
            .map((res) => {
                let parsedResult = res.json();
                AppConfiguration.apiUrl = parsedResult.apiUrl;
            })
            .catch((error: Response | any) => {
                return Observable.throw(error);
            })
            .toPromise()

        promise.then(res => {
        })
        return promise
    }
}
