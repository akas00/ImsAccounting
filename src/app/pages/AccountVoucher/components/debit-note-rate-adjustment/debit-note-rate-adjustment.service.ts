import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import {Branch} from "../../../../common/interfaces/TrnMain";
import { Subject } from 'rxjs/subject';
import {GlobalState} from '../../../../../app/global.state';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { Observable } from 'rxjs';
@Injectable()

export class DebitNoteComponentService {
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

    saveDebitNoteRateAdjustment(bid:any){
       
        if(this.activeurlpath == 'acvouchersdebit-note-rate-adjustment'){
            this.bodyData = {type:'DebitNoteRateAdjustment',data:bid};
        }else if(this.activeurlpath == 'acvoucherscredit-note-rate-adjustment'){
            this.bodyData = {type:'CreditNoteRateAdjustment',data:bid};
        }
       // let bodyData = {mode:'query',data:{BID:Type}};
        return  this.http.post(this.apiUrl +'/saveDebitNoteRateAdjustment',this.bodyData,this.getRequestOption())
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

    LoadRateAdjustment(bid:any){    
        let bodyData = {data:bid}; 
        return  this.http.post(this.apiUrl +'/getLoadNewRateAdjustment',bodyData,this.getRequestOption())
        .map(this.extractData)
        .catch(this.handleError)
    }

      private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }
   
}