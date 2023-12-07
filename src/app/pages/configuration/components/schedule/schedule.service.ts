import { AuthService } from './../../../../common/services/permission/authService.service';
import {GlobalState} from '../../../../global.state';
import { RequestOptions, Http,Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Schedule } from "../../../../common/interfaces/Schedule.interface";
@Injectable()
export class ScheduleService {
    id:any;
    schedule: Array<Schedule>;
    constructor(private masterRepoService: MasterRepo,private http: Http,private state:GlobalState, private authService: AuthService) {
        
    }
    create(): void{
        let div: Schedule = <Schedule>{};
        div.DiscountName = 'MYX'; 
        this.schedule.push(div);
    }
    private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 
getEditSchedule(Initial:string) {
    let res={status:"error",result:""};
    let returnSubject:Subject<any>=new Subject();
    ////console.log("about to edit");
    let bodyData = {mode:'query',data:{DisID:Initial}};
    this.http.post(this.apiUrl +'/getScheduleEdit',bodyData,this.getRequestOption())
        .subscribe(response=>{
            let data = response.json();
            if(data.status == 'ok'){
                returnSubject.next(data);
                returnSubject.unsubscribe();

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
   /* return this.http.get("/rategroups.json").toPromise()
        .then((res) => res.json());*/
        

}
private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    //console.log({ headers: headers });
    return new RequestOptions({ headers: headers });
}

}