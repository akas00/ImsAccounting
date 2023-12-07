import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import {GlobalState} from '../../../../../app/global.state';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { Observable } from 'rxjs';
@Injectable()

export class BillTrackingAmendmentService {
    public activeurlpath: any;
    public bodyData:any;

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState,private alertservices:AlertService) {

        this.activeurlpath = activatedRoute.snapshot.url.join('');
    }
   private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 
    public saveBillTrack(data) {
        return this.http.post(`${this.apiUrl}/saveBillTracking`, data, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
    }


    public getDuePendingAmount(partyType,acid) {
        return this.http.get(`${this.apiUrl}/getRVPVPendingAmount/${partyType}/${acid}`, this.getRequestOption())
            .map(this.extractData)
            .catch(this.handleError)
    }

  

    public extractData(res:Response){
        let response = res.json();
        return response || {};
    }
    public handleError(error: Response |any){
        return Observable.throw(error);
    }

    

      private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }
   
}