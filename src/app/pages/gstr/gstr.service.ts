import { Http, Response, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, CacheService } from '../../common/services/permission';
import { GlobalState } from '../../global.state';
import * as moment from 'moment'


@Injectable()

export class GstrService {
    gstMain: GSTMAIN = <GSTMAIN>{}

    constructor(private _cacheService: CacheService, private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
        if (this.gstMain.startDate == undefined || this.gstMain.startDate == null || this.gstMain.startDate == "" || this.gstMain.endDate == undefined || this.gstMain.endDate == null || this.gstMain.endDate == "") {
            // if (this._cacheService.get('startDate')) {
            //     this.gstMain.startDate = this._cacheService.get('startDate')
            //     this.gstMain.endDate = this._cacheService.get('endDate')
            // } else {
            // }
            this.gstMain.startDate = moment().startOf('month').format('MM-DD-YYYY')
            this.gstMain.endDate = moment().endOf('month').set('month', 2).add(1, 'year').format('MM-DD-YYYY')

        }
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public getGstType() {
        return this.http.get(`${this.apiUrl}/getGstType?startDate=${this.gstMain.startDate}&endDate=${this.gstMain.endDate}`, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
            .share()
    }

    public getGstSubTypeById(gstid: string) {

        return this.http.get(`${this.apiUrl}/getGstSubTypeById?gstid=${gstid}&startDate=${this.gstMain.startDate}&endDate=${this.gstMain.endDate}`, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
            .share()
    }
    public getGstSubTypeDetailById(gstid: string, gstSubType: string) {
        return this.http.get(`${this.apiUrl}/getGstSubTypeDetailById?gstid=${gstid}&gstSubType=${gstSubType}&startDate=${this.gstMain.startDate}&endDate=${this.gstMain.endDate}`, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
            .share()
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



    public exportGSTReport(gstID: string,date1,date2) {
        const type = 'application/vnd.ms-excel';
        const options = new RequestOptions({
            responseType: ResponseContentType.Blob,
            headers: new Headers({
                'Accept': type,
                Authorization: this.authService.getAuth().token
            })
        });
        return this.http
            .post(this.apiUrl + "/loadGSTReport", { gstType: gstID,DATE1:date1,DATE2:date2 }, options)
            .map((response: Response) => {
                let data = {
                    content: new Blob([(<any>response)._body], {
                        type: response.headers.get("Content-Type")
                    }),
                    filename: `${gstID}.xlsx`
                };
                return data;
            });

    }

    public exportGstToJson(gstID: string,date1,date2) {
        const type = 'application/json';
        const options = new RequestOptions({
            responseType: ResponseContentType.Blob,
            headers: new Headers({
                'Accept': type,
                Authorization: this.authService.getAuth().token 
            })
        });
        return this.http
            .post(this.apiUrl + "/converttojson", { gstType: gstID,DATE1:date1,DATE2:date2 }, options)
            //.post(this.apiUrl + /Convert/, options)
            .map((response: Response) => {
                let data = {
                    content: new Blob([(<any>response)._body], {
                        type: response.headers.get("Content-Type")
                    }),
                    filename: `${gstID}.json`
                };
                return data;
            });

    }

}
export interface GSTMAIN {
    startDate: string,
    endDate: string,
    activeGstType: string,
    activeSubGstType: string,
    isGstSubReport: boolean,
    isGstReport: boolean;
    listOfCard: any,
    summaryData: any,
    totalRowData: any,
    gstrSubReport: any,
    detailOfOutwaredSupplies: any,
    eligibleTax: any,
    lateFeePayable: any,
    exempted: any,
    interIntraState: any,









}

