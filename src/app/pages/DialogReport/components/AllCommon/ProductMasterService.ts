import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { IDivision } from '../../../../common/interfaces';
import { AlternateUnit} from '../../../../common/interfaces/TrnMain';
import { Item,Product ,ItemRate,ProductType,KotCategory,Model,Brand,RateDiscount,TBarcode} from '../../../../common/interfaces';
import { Subject } from 'rxjs/subject'
import { GlobalState } from "../../../../global.state";

@Injectable()

export class ProductMasterService {
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState) {
    }
     private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    }
    getParentWiseProduct(MCODE:string) {
      return this.http.get(this.apiUrl + '/getParentWiseProduct/'+MCODE, this.getRequestOption()).flatMap(response => response.json() || []);
    }

    getProduct(mcode:string){
         let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
       this.http.get(this.apiUrl + '/getProduct/'+mcode, this.getRequestOption()).subscribe(response=>{
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
    saveProduct(mode:string,prodObj:Product,RGLIST:ItemRate[],AlternateUnits:AlternateUnit[],PBarCodeCollection:TBarcode[]){
        let res = { status: "error", result: "" }
        let returnSubject:Subject<any> =new Subject();
        let opt=this.getRequestOption();
        let hd:Headers = new Headers({'Content-Type':'application/json'});
        let op:RequestOptions = new RequestOptions()
        let bodyData ={mode:mode,data:{product:prodObj,rglist:RGLIST,alternateunits:AlternateUnits,pbarcodes:PBarCodeCollection}};
       ////console.log("product json");
      var  data = JSON.stringify(bodyData, undefined, 2);
         //console.log(data);
        this.http.post(this.apiUrl + "/saveProductMaster",bodyData,this.getRequestOption())
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
   

}