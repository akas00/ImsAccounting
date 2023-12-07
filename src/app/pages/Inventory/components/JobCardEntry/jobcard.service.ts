import { LoginDialog } from './../../../modaldialogs/logindialog/logindialog.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SettingService } from './../../../../common/services/setting.service';
import { MdDialog } from '@angular/material';
import { IndexedDbWrapper } from './../../../../common/services/IndexedDbWrapper';
import { GlobalState } from './../../../../global.state';
import { AuthService } from './../../../../common/services/permission/authService.service';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Injectable } from '@angular/core'
import { MockMasterRepo } from '../../../../common/repositories'
@Injectable()
export class JobCardService {
    
    constructor(private http: Http, private authService: AuthService, private state: GlobalState, private dbWrapper: IndexedDbWrapper, public dialog: MdDialog, private setting: SettingService) {

    }
    public getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
    public get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        //console.log({ apiUrl: apiUrl })
        return apiUrl
    }
    public IsLoginDialogOpened: boolean = false;
    public resolveError(error: any, callFrom: string) { 
        //console.log({ callfrom: callFrom, Error: error });
        try {
            let dialogResult
            if (error.statusText == "Unauthorized") {
                if (this.IsLoginDialogOpened == true) { return }
                this.IsLoginDialogOpened = true;
                let dialogRef = this.dialog.open(LoginDialog, { disableClose: true });
                dialogRef.afterClosed().subscribe(result => {
                    this.IsLoginDialogOpened = false;
                });
                return null;
            }
            let err = error;
            //console.log({ errorconvert: err })
            if (err && err == "The ConnectionString property has not been initialized.") {
                if (this.IsLoginDialogOpened == true) { return }
                this.IsLoginDialogOpened = true;
                let dialogRef = this.dialog.open(LoginDialog, { disableClose: true });
                dialogRef.afterClosed().subscribe(result => {
                    this.IsLoginDialogOpened = false;
                });
                return null;
            }
            //console.log(error);
            return (err);

        }
        catch (ex) {
            //console.log({ callfrom: callFrom, catchError: ex });
        }
    }

    /******************************************************************************/

    getAllSuperVisorName() {
        return this.http.get(this.apiUrl + '/getAllSuperVisorName', this.getRequestOption())
            .flatMap(response => response.json() || [])
    }
    getJobCardMain() {
        return this.http.get(this.apiUrl + '/getJobCardMain', this.getRequestOption())
            .flatMap(response => response.json() || [])
    }
    getAllMACHANIC() {
        return this.http.get(this.apiUrl + '/getAllMACHANIC', this.getRequestOption())
            .flatMap(response => response.json() || [])
    }
    getVehicleDetailFromID(CID: string) {
        let res = { status: "error", result: "" };
        let returnItemSubject: Subject<any> = new Subject();
        ////console.log("CIDIDI", CID)
        this.http.post(this.apiUrl + '/getVehicleFromID', { CID: CID }, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnItemSubject.next(data);
                    returnItemSubject.unsubscribe();

                }
                else {
                    returnItemSubject.next(data)
                    returnItemSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnItemSubject.next(res);
                returnItemSubject.unsubscribe();
            }
            );
        return returnItemSubject;
        /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/


    }
    _vehicleList:any[]=[];
    public _vehicleRegObservable$: Observable<any[]>;
    public getVehileRegList() {
        try {
            if (this._vehicleList.length > 0) {
                //   //console.log({ getproductItemList: 'from Array', items: this._itemList })
                //return this._itemList;
                return Observable.of(this._vehicleList);
            }
            else if (this._vehicleRegObservable$) {
                // //console.log({ itemlistObservable: this._itemListObservable$ });
                return this._vehicleRegObservable$;
            }
            else {
                this._vehicleRegObservable$ = null;
                //console.log({ productItemlistReqOptions: this.getRequestOption });
                this._vehicleRegObservable$ = this.http.get(this.apiUrl + '/getAllVehicleList', this.getRequestOption())
                    .flatMap(res => res.json() || [])
                    .map(data => {
                        // ////console.log("data&&&&",data)
                        this._vehicleList.push(<any>data)
                        return this._vehicleList;
                    })
                    .share();
                return this._vehicleRegObservable$;
            }

        }
        catch (ex) {
            //console.log({ getProduclistError: ex });
        }
    }
    getCustomerList() {
        return this.http.get(this.apiUrl + '/getCustomerList', this.getRequestOption())
            .flatMap(response => response.json() || [])
    }
    /*Dropdown TextSearch(EG: Norsetting)*/
    _jobDescList:any[]=[];
    public _jobDescObservable$: Observable<any[]>;
    public getJobDesciption() {
        try {
            if (this._jobDescList.length > 0) {
                //   //console.log({ getproductItemList: 'from Array', items: this._itemList })
                //return this._itemList;
                return Observable.of(this._jobDescList);
            }
            else if (this._jobDescObservable$) {
                // //console.log({ itemlistObservable: this._itemListObservable$ });
                return this._jobDescObservable$;
            }
            else {
                this._jobDescObservable$ = null;
                //console.log({ productItemlistReqOptions: this.getRequestOption });
                this._jobDescObservable$ = this.http.get(this.apiUrl + '/getJobDesciption', this.getRequestOption())
                    .flatMap(res => res.json() || [])
                    .map(data => {
                        // ////console.log("data&&&&",data)
                        this._jobDescList.push(<any>data)
                        return this._jobDescList;
                    })
                    .share();
                return this._jobDescObservable$;
            }

        }
        catch (ex) {
            //console.log({ getProduclistError: ex });
        }
    }
    public saveJobCard(mode: string, List: any[], TRN: any) {
        ////console.log("JOBCARD@", List)
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        ////console.log("about to save")
        let opt = this.getRequestOption();
        //console.log(opt.headers.toJSON());
        let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
        let op: RequestOptions = new RequestOptions()
        let bodyData = { mode: mode, data: List, data2: TRN };
        //console.log({ SchemeJson: bodyData });
        this.http.post(this.apiUrl + "/saveJobCard", bodyData, this.getRequestOption())
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
    getJobNo(Div:string) {
        return this.http.get(this.apiUrl + '/getJobNo', this.getRequestOption())
            .flatMap(response => response.json() || [])
    }
    
    getJobCardFromID(JOBNO: string) {
        let res = { status: "error", result: "" };
        let returnItemSubject: Subject<any> = new Subject();
        ////console.log("CIDIDI", JOBNO)
        this.http.post(this.apiUrl + '/getJobCardFromID', { JOBNO: JOBNO }, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnItemSubject.next(data);
                    returnItemSubject.unsubscribe();

                }
                else {
                    returnItemSubject.next(data)
                    returnItemSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnItemSubject.next(res);
                returnItemSubject.unsubscribe();
            }
            );
        return returnItemSubject;
        /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/


    }
    
    getTableList() {
        return this.http.get(this.apiUrl + '/getTableList', this.getRequestOption())
            .flatMap(response => response.json() || [])
    }
}