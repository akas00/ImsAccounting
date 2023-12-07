import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { IDivision } from '../../../../common/interfaces';
import {Subject} from 'rxjs/subject'
import {GlobalState} from '../../../../global.state';
@Injectable()

export class AddDivisionService {
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private gblState:GlobalState) {
         let url =this.gblState.getGlobalSetting("apiUrl");
         if(!!url && url.length >0)this.apiUrl=url[0]
        //console.log(this.apiUrl);
    }
    private apiUrl:string;
    getDivision(Initial:string) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        ////console.log("about to edit");
        let bodyData = {mode:'query',data:{INITIAL:Initial}};
       
        this.http.post( this.apiUrl +'/getDivision',bodyData,this.getRequestOption())
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
    // saveDivision(mode:string,division: IDivision){
    //     let res = { status: "error", result: "" }
    //     let returnSubject:Subject<any> =new Subject();
    //     ////console.log("about to save")
    //     let opt=this.getRequestOption();
    //     //console.log (opt.headers.toJSON());
    //     let hd:Headers = new Headers({'Content-Type':'application/json'});
    //     let op:RequestOptions = new RequestOptions()
    //     let bodyData ={mode:mode,data:division};
    //     this.http.post(this.apiUrl + "/saveDivision",bodyData,this.getRequestOption())
    //         .subscribe(data => {
    //             let retData = data.json();
    //             //console.log(retData);
    //             if (retData.status == "ok") {
    //                 res.status = "ok";
    //                 res.result = retData.result
    //                 //console.log(res);
    //                 returnSubject.next( res);
    //                 returnSubject.unsubscribe();
    //             }
    //             else {
    //                 res.status = "error1"; res.result = retData.result;
    //                 //console.log(res);
    //                 returnSubject.next( res);
    //                 returnSubject.unsubscribe();
    //             }
    //         },
    //         error => {
    //             res.status = "error2", res.result = error;
    //             //console.log(res);
    //             returnSubject.next(res);
    //             returnSubject.unsubscribe();
    //         }
    //         );
    //         return returnSubject;

    // }

}