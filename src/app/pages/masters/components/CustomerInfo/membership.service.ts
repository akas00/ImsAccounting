import { Injectable } from '@angular/core'
import { TMember } from "./membership.interface";
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import { GlobalState } from "../../../../global.state";

@Injectable()
export class MembershipService {
   constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState) {
    }
     private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    }
      getMembership(Initial:string) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        ////console.log("about to edit");
        let bodyData = {mode:'query',data:{MEMID:Initial}};
        this.http.post(this.apiUrl + '/getMembership',bodyData,this.getRequestOption())
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

    // saveMembership(mode:string,membership: TMember){
    //     let res = { status: "error", result: "" }
    //     let returnSubject:Subject<any> =new Subject();
    //     ////console.log("about to save")
    //     let opt=this.getRequestOption();
    //     //console.log (opt.headers.toJSON());
    //     let hd:Headers = new Headers({'Content-Type':'application/json'});
    //     let op:RequestOptions = new RequestOptions()
    //     let bodyData ={mode:mode,data:membership};
    //     this.http.post(this.apiUrl + "/saveMembership",bodyData,this.getRequestOption())
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
    
    getOccupation(){
        return [
            {
                name: "Business"
            },
            {
                name: "Service"
            },
            {
                name: "Occupation 3"
            },
            {
                name: "Occupation 4"
            },
            {
                name: "Un-employed"
            }
        ];
    };

    getScheme(){
        return [
            {
                name: "Platnium Membership"
            },
            {
                name: "Gold Membership"
            },
            {
                name: "Silver Membership"
            },
            {
                name: "Bronze Membership"
            },
            {
                name: "Full Discount Mmebership"
            }
        ];
    };

    getDesignation(){
        return [
            {
                name: "CEO"
            },
            {
                name: "General Manager"
            },
            {
                name: "Chairman"
            },
            {
                name: "Operations Manager"
            },
            {
                name: "Marketing Head"
            }
        ];
    };

    getSalesPerson(){
        return [
            {
                name: "1"
            },
            {
                name: "2"
            },
            {
                name: "3"
            },
            {
                name: "4"
            },
            {
                name: "5"
            }
        ];
    };

}