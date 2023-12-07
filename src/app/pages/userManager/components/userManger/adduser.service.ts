import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state'
import { Subject } from "rxjs/Subject";
import { ModalDirective } from 'ng2-bootstrap'
@Injectable()
export class AddUserService {
    private apiUrl: string;
    constructor(private http: Http, private authService: AuthService, private gblState: GlobalState) {
        let url = this.gblState.getGlobalSetting("apiUrl");
        if (!!url && url.length > 0) this.apiUrl = url[0]
    }
    
    getUserProfile(username: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getUser?username=' + username, this.authService.getRequestOption())
            .subscribe(response => {
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
    getUserDivList(username: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getUserDivList?username=' + username, this.authService.getRequestOption())
            .subscribe(response => {
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
    getRightList(){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getUserrightList', this.authService.getRequestOption())
            .subscribe(response => {
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

    getUserList(){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getUserList', this.authService.getRequestOption())
            .map(res=> res.json())
            .subscribe(data => {
                if (data.status == 'ok') {
                    let r = data.result;
                    returnSubject.next(r);
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

    saveUser(data: any) {
       return this.http.post(this.apiUrl + "/saveuser", data, this.authService.getRequestOption())
            .map(res => res.json())
            .share();
    }


    public saveRole(data:any){
        return this.http.post(this.apiUrl + "/saveRole", data, this.authService.getRequestOption())
            .map(res => res.json())
            .share();
    }

    public getRoleList(){
        return this.http.get(this.apiUrl + "/getRoleList",  this.authService.getRequestOption())
        .map(res => res.json())
        .share();
    }
    public getRole(rolename:string){
        return this.http.get(`${this.apiUrl}/getRole/?rolename=${rolename}`,this.authService.getRequestOption())
        .map(res=>res.json())
        .share()
    }
    public deleteUser(data: any){
        const options = { headers: this.authService.getRequestOption(), method: 'post' };
        return this.http.post(this.apiUrl + '/deleteUser', data, this.authService.getRequestOption())
        .map(res=>res.json())
        .share()
    }
}