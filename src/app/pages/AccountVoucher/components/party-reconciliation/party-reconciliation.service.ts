import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import {Branch} from "../../../../common/interfaces/TrnMain";
import { Subject } from 'rxjs/subject';
import {GlobalState} from '../../../../global.state';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { Observable } from 'rxjs';
@Injectable()

export class PartyReconciliationService {
    
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState,private alertservices:AlertService) {
    }
   private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 

    saveBank(bid:any){
        let bodyData = {data:bid};
        return  this.http.post(this.apiUrl +'/saveBankReconciliation',bodyData,this.getRequestOption())
        .map(this.extractData)
        .catch(this.handleError)
    }
    savePartyReconciliation(bid:any){
        let bodyData = {data:bid};
        return  this.http.post(this.apiUrl +'/savePartyReconciliation',bodyData,this.getRequestOption())
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


    saveBankReconciliation(bid:any) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        let bodyData = {data:bid};
        this.http.post(this.apiUrl +'/saveBankReconciliation',bodyData,this.getRequestOption())
            .subscribe(response=>{
                let data = response.json();
                if(data.status == 'ok'){
                    returnSubject.next(data);
                    returnSubject.unsubscribe();
                    this.alertservices.success(data.result);

                }
                else{
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                    this.alertservices.error("Error"+data.result);
                }
            },error =>{
                res.status='error';res.result=error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
            return returnSubject;
      
     }
     

     getPartyReconcileList(bid:any) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        this.http.post(this.apiUrl +'/getPartyReconciliation',bid,this.getRequestOption())
            .subscribe(response=>{
                let data = response.json();
                if(data.status == 'ok'){
                    returnSubject.next(data);
                    returnSubject.unsubscribe();
                    
                }else if(data.status == 'error'){
                    this.alertservices.error("Error"+data.result);
                }
                else{
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            },error =>{
                res.status='error';res.result=error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
            return returnSubject;
     }





      private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }
   
}