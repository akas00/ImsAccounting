import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/subject';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
import { EnableLatePost } from '../../../../common/interfaces';
import { LatePost } from '../../../../common/interfaces/Latepost.interface';

@Injectable()

export class EPaymentStatusService {

  constructor(private http: Http, private authService: AuthService, private state: GlobalState) {
  }
  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) { apiUrl = url[0] };
    return apiUrl
  }
  saveEnableLatePost(LatePostObj: EnableLatePost) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: 'query', data: LatePostObj };
    this.http.post(this.apiUrl + '/saveEnableLatePost', bodyData, this.getRequestOption())
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
    /* return this.http.get("/rategroups.json").toPromise()
         .then((res) => res.json());*/


  }
  private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    return new RequestOptions({ headers: headers });
  }
  LoadData(LObj : LatePost) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { LObj: LObj };

    this.http.post(this.apiUrl + "/getVoucherLatePost", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

}
