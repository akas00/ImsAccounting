import { AuthService } from './../../../../common/services/permission/authService.service';
import {GlobalState} from '../../../../global.state';
import { RequestOptions, Http,Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";


@Injectable()
export class VehicleRegistrationService {
    id:any;

    constructor(private http: Http,private state:GlobalState, private authService: AuthService) {
        
    }
    create(): void{
       
    }
    private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 

private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    //console.log({ headers: headers });
    return new RequestOptions({ headers: headers });
}
public saveVehicle(mode: string, Vehicle: any) {
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    ////console.log("about to save")
    let opt = this.getRequestOption();
    //console.log(opt.headers.toJSON());
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { mode: mode, data: Vehicle };
    this.http.post(this.apiUrl + "/SaveVehicle", bodyData, this.getRequestOption())
        .subscribe(data => {
            let retData = data.json();
            //console.log(retData);
            if (retData.status == "ok") {
                res.status = "ok";
                res.result = retData.result
                //console.log(res);
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
}