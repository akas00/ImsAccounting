import { Subscriber } from 'rxjs/Subscriber';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { IDivision } from '../../../../common/interfaces';
import { AlternateUnit} from '../../../../common/interfaces/TrnMain';
import { Item,Product ,ItemRate,ProductType,KotCategory,Model,Brand,RateDiscount,TBarcode} from '../../../../common/interfaces';
import { Subject } from 'rxjs/subject'
import { GlobalState } from "../../../../global.state";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Observable } from "rxjs/Observable";

@Injectable()

export class TreeViewAcService {
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState,private masterService:MasterRepo) {
    }
     private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    }
    public selectAcdivisionList : any[] = [];
    public selectAcdivisionObj : any=<any>{};
    getParentWiseAccountList(ACID:string) {
        this.selectAcdivisionList = [];
        this.selectAcdivisionObj = {};
    //   return this.http.get(this.apiUrl + '/getParentWiseAccount/'+ACID, this.getRequestOption()).flatMap(response => response.json() || []);
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      this.http.get(this.apiUrl + '/getParentWiseAccount/' + ACID, this.getRequestOption()).subscribe(response => {
          let data = response.json();
          //console.log("CheckValue^^",data);
          if (data.status == 'ok') {
              this.selectAcdivisionList = data.result2;
              this.selectAcdivisionObj = data.result;
              returnSubject.next(data);
              returnSubject.unsubscribe();

          }
          else {
              returnSubject.next(data)
              returnSubject.unsubscribe();
          }
      }, error => {
          res.status = 'error'; res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
      }
      );
      return returnSubject;
    }
    getAccDivisionMapping(ACID:string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getParentWiseAccount/' + ACID, this.getRequestOption()).subscribe(response => {
            let data = response.json();
            
            if (data.status == 'ok') {
                
                returnSubject.next(data);
                returnSubject.unsubscribe();

            }
            else {
                returnSubject.next(data)
                returnSubject.unsubscribe();
            }
        }, error => {
            res.status = 'error'; res.result = error;
            returnSubject.next(res);
            returnSubject.unsubscribe();
        }
        );
        return returnSubject;
    }


    getAccountAutomationGSTRate(ACID:string,parent:string) {
        return this.http.get(this.apiUrl + `/getAccountAutomationGSTRate?ACID=${ACID}&PARENT=${parent}`, this.getRequestOption()).map(response => response.json() || []);
      }

    getNewValues(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getNewValues/' + mcode, this.getRequestOption()).subscribe(response => {
            let data = response.json();
            if (data.status == 'ok') {
                returnSubject.next(data);
                returnSubject.unsubscribe();

            }
            else {
                returnSubject.next(data)
                returnSubject.unsubscribe();
            }
        }, error => {
            res.status = 'error'; res.result = error;
            returnSubject.next(res);
            returnSubject.unsubscribe();
        }
        );
        return returnSubject;
    }
// getAccount(ACID:string){
//          let res={status:"error",result:""};
//         let returnSubject:Subject<any>=new Subject();
//        this.http.get(this.apiUrl + '/getAllData/'+ACID, this.getRequestOption()).subscribe(response=>{
//                 let data = response.json();
//                 if(data.status == 'ok'){
//                     returnSubject.next(data);
//                     returnSubject.unsubscribe();

//                 }
//                 else{
//                     returnSubject.next(data)
//                     returnSubject.unsubscribe();
//                 }
//             },error =>{
//                 res.status='error';res.result=error;
//                 returnSubject.next(res);
//                 returnSubject.unsubscribe();
//             }
//             );
//             return returnSubject;
//     }
    getPartyList(mcode:string){
         let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
       this.http.get(this.apiUrl + '/getPartyList/'+mcode, this.getRequestOption()).subscribe(response=>{
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
    }
    savePartyList(mode:string,prodObj:Product,RGLIST:ItemRate[],AlternateUnits:AlternateUnit[],PBarCodeCollection:TBarcode[]){
        let res = { status: "error", result: "" }
        let returnSubject:Subject<any> =new Subject();
        let opt=this.getRequestOption();
        let hd:Headers = new Headers({'Content-Type':'application/json'});
        let op:RequestOptions = new RequestOptions()
        let bodyData ={mode:mode,data:{product:prodObj,rglist:RGLIST,alternateunits:AlternateUnits,pbarcodes:PBarCodeCollection}};
       ////console.log("product json");
      var  data = JSON.stringify(bodyData, undefined, 2);
         //console.log(data);
        this.http.post(this.apiUrl + "/savePartyList",bodyData,this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                //console.log(retData);
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
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
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
   
    public getParentGroups(acid:string){
        //console.log({acid:acid})
        return new Observable((observer:Subscriber<GroupAccounts[]>)=>{
            this.http.get(this.masterService.apiUrl + '/getParents?acid=' + acid,this.masterService.getRequestOption())
            .map(data=>{
                //console.log({parentGrop:data})
                return data.json()
            })
            .subscribe(res=>{
                if(res.status =='ok')
               {
                    observer.next(res.result);
               }
            },error=> {
                this.masterService.resolveError(error,'getParents');
                observer.complete();
            },
            ()=>{
                observer.complete();
            }
            )
        }) 
            

    }

    public getChildrenGroups(acid:string){
        //console.log({getChildrenAcid:acid,url:this.masterService.apiUrl + '/getChildren?' + acid});
        return new Observable((observer:Subscriber<GroupAccounts[]>)=>{
            this.http.get(this.masterService.apiUrl + '/getChildren?acid=' + acid,this.masterService.getRequestOption())
            .map(data=>data.json())
            .subscribe(res=>{
                //console.log({getChildrenResult:res});
               observer.next(res.result);
            },error=> {
                this.masterService.resolveError(error,'getChildren');
                observer.complete();
            },
            ()=>{
                observer.complete();
            }
            )
        }) 
    }

    public getTopGroups(){
        return new Observable((observer:Subscriber<GroupAccounts[]>)=>{
            this.http.get(this.masterService.apiUrl + '/getTopGroups',this.masterService.getRequestOption())
            .map(data=>data.json())
            .subscribe(res=>{
               observer.next(<GroupAccounts[]>res.result);
            },error=> {
                this.masterService.resolveError(error,'getTopGroups');
                observer.complete();
            },
            ()=>{
                observer.complete();
            }
            )
        }) 
    }
}

export interface GroupAccounts{
      ACID :string;
      ACNAME:string;
      PARENT :string;
      TYPE :string;
      ACTYPE :string;
      MAPID :string;
      MCAT :string;
      HASSUBLEDGER :number;
      CHILDLIST :any[];
      CACID:string;
      SELECTEDGROUP:any;
      LIST:Observable<any[]>;
      SELECTEDGROUPAC:GroupAccounts;
}