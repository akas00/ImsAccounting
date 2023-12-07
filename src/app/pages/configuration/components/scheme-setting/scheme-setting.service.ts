import { Injectable } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import {Product} from "../../../../common/interfaces/ProductItem";
import { Subject } from 'rxjs/subject';
import { GlobalState } from "../../../../global.state";

@Injectable()
export class SchemeSettingService {
     constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState) {
    }
     private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    }
      getScheme(Initial:string) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        ////console.log("about to edit");
        let bodyData = {mode:'query',data:{MCODE:Initial}};
        this.http.post(this.apiUrl + '/getScheme',bodyData,this.getRequestOption())
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

    getSchemeSubGroup(Initial:string) {
         //let res={status:"error",result:""};
         //let returnSubject:Subject<any>=new Subject();
        // ////console.log("about to edit");
        // let bodyData = {mode:'query',data:{PARENT:Initial}};
   return this.http.get(this.apiUrl + '/getSubSchemeList/'+Initial, this.getRequestOption())
            .flatMap(res => 
                    res.json() || []
            );
               
             
        // this.http.post('http://localhost:1783/api/getSubSchemeList',bodyData,this.getRequestOption())
        //     .subscribe(response=>{
        //         let data = response.json();
        //         if(data.status == 'ok'){
        //             returnSubject.next(data);
        //             returnSubject.unsubscribe();

        //         }
        //         else{
        //             returnSubject.next(data)
        //             returnSubject.unsubscribe();
        //         }
        //     },error =>{
        //         res.status='error';res.result=error;
        //         returnSubject.next(res);
        //         returnSubject.unsubscribe();
        //     }
        //     );
        //     return returnSubject;
       /* return this.http.get("/rategroups.json").toPromise()
            .then((res) => res.json());*/
            

    }

    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

    saveSchemeSetting(mode:string,scheme: Product){
        let res = { status: "error", result: "" }
        let returnSubject:Subject<any> =new Subject();
        ////console.log("about to save")
        let opt=this.getRequestOption();
        //console.log (opt.headers.toJSON());
        let hd:Headers = new Headers({'Content-Type':'application/json'});
        let op:RequestOptions = new RequestOptions()
        let bodyData ={mode:mode,data:scheme};
        this.http.post(this.apiUrl + "/saveSchemeSetting",bodyData,this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                //console.log(retData);
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    //console.log(res);
                    returnSubject.next( res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error1"; res.result = retData.result;
                    //console.log(res);
                    returnSubject.next( res);
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

    schemeList = [
        {
        id: 1,
        MCode: 'M1001',
        productCategory: "Product Category 1"
        },
        {
        id: 2,
        MCode: 'M1002',
        productCategory: "Product Category 2"
        },
        {
        id: 3,
        MCode: 'M1003',
        productCategory: "Product Category 3"
        },
        {
        id: 4,
        MCode: 'M1004',
        productCategory: "Product Category 4"
        },
        {
        id: 5,
        MCode: 'M1005',
        productCategory: "Product Category 5"
        },
    ]
    getData(): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(this.schemeList);
        }, 500);
        });
    }

    getProductCategory(){
        return [
            {
                DESCA: "Product Category 1",
                MCODE: 'M1001',
            },
            {
                DESCA: "Product Category 2",
                MCODE: 'M1002',
            },
            {
                DESCA: "Product Category 3",
                MCODE: 'M1003',
            },
            {
                DESCA: "Product Category 4",
                MCODE: 'M1004',
            },
            {
                DESCA: "Product Category 5",
                MCODE: 'M1005',
            }
        ];
    };

}