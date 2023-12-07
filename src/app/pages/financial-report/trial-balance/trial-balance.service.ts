import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../common/services/permission';
import { GlobalState } from '../../../global.state';
import { Observable } from 'rxjs';

@Injectable()

export class TrialBalanceService {

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public getTrialBalanceData(filterObj) {
        let body = {
            'DATE1': filterObj.DATE1,
            'DATE2': filterObj.DATE2,
            'DIV': filterObj.DIV,
            'isSummary': filterObj.isSummary ? 1 : 0,
            'isZeroBalance': filterObj.isZeroBalance ? 1 : 0,
            'showAllLevel': filterObj.showAllLevel ? 1 : 0,
            'isLedgerWise': filterObj.isLedgerWise ? 1 : 0,
            'nodeAcid': filterObj.nodeACID,
            'nodeAcname': filterObj.nodeACNAME,
            'showAll':filterObj.showAll?1:0,
            'SHOWDEBTORSCREDITORS':filterObj.showPartylistInTrialBalance?1:0,
            'ShowSubLedger':filterObj.showSubLedgerInTrialBalance?1:0,
            'ShowStockValue':filterObj.showClosingStockValueInTrialBalance?1:0,
            'SHOWOPENINGTRIALONLY':filterObj.showOpeningTrialBalanceOnly?1:0,
            // 'SHOWOPENINGTRIALONLY': filterObj.SHOWOPENINGTRIALONLY?1:0,
            'COSTCENTER':filterObj.TBL_CostCenter?filterObj.TBL_CostCenter:'%',
        }
        return this.http.post(`${this.apiUrl}/getTrialBalanceData`, body, this.getRequestOption())
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