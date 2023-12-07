import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import {Branch} from "../../../../common/interfaces/TrnMain";
import { Subject } from 'rxjs/subject';
import {GlobalState} from '../../../../../app/global.state';
@Injectable()

export class ChalanMasterService {
    
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState) {
    }
   private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 
    




    public saveChalaMaster(mode: string, warehouse: any) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();    
        let opt = this.getRequestOption();
        let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
        let op: RequestOptions = new RequestOptions()
        let bodyData = { mode: mode, data: warehouse };
        ////console.log("company item"+bodyData);
        this.http.post(this.apiUrl + "/saveNewChalanSeries", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
              //  //console.log(retData);
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                //    //console.log(res);
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error1"; res.result = retData.result;
                    //console.log(res);
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
            error => {
                res.status = "error2", res.result = error;
                //console.log(res);
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;

    }

      private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

    public getChalanByVname(vname: string,) {
        let bodyData = { VName: vname };
        return this.http
          .post(this.apiUrl + "/getChalanByVname", bodyData, this.getRequestOption())
          .map(data => data.json()).share()
      }
   
}