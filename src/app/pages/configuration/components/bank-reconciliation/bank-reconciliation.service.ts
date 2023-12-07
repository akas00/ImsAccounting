import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import { GlobalState } from '../../../../../app/global.state';
@Injectable()

export class BankReconciliationService {

  constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
  }
  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) { apiUrl = url[0] };
    return apiUrl
  }
  saveBankReconciliation(bid: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { data: bid };
    this.http.post(this.apiUrl + '/saveBankReconciliation', bodyData, this.getRequestOption())
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

  getBankReconcileList(bid: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { data: { BID: bid } };
    this.http.post(this.apiUrl + '/getBankReconciliation', bid, this.getRequestOption())
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

  private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    return new RequestOptions({ headers: headers });
  }

}
